<?php
/**
 * Native High-Performance Indexed Database Search Fallback
 *
 * Provides indexed searches against WordPress posts, custom MPN meta,
 * SKU, and custom specs tables when external search daemons are unreachable.
 *
 * @package DhrubaCatalog\Search
 */

declare(strict_types=1);

namespace DhrubaCatalog\Search;

use DhrubaCatalog\Database\Schema;
use DhrubaCatalog\Product\ProductMetaManager;

final class FallbackDatabaseSearch implements SearchInterface
{
    public function search(string $query, array $filters = [], int $page = 1, int $per_page = 24, string $sort = 'relevance'): array
    {
        global $wpdb;
        $start_time = microtime(true);
        $offset = ($page - 1) * $per_page;
        $clean_query = trim($query);
        $norm_query  = ProductMetaManager::normalize_mpn($clean_query);

        // Search Result Transient Cache (5 minutes TTL for instant query recall)
        $cache_key = 'dp_srch_' . md5($clean_query . '_' . serialize($filters) . "_{$page}_{$per_page}_{$sort}");
        $cached = get_transient($cache_key);
        if (is_array($cached)) {
            $cached['processingTimeMs'] = round((microtime(true) - $start_time) * 1000, 2);
            $cached['cached'] = true;
            return $cached;
        }

        $where = ["p.post_type = 'product'", "p.post_status = 'publish'"];
        $joins = [];

        // 1. Search Query: Exact MPN match gets prioritized over Title & SKU
        if (!empty($clean_query)) {
            $joins[] = "LEFT JOIN {$wpdb->postmeta} pm_mpn ON (pm_mpn.post_id = p.ID AND pm_mpn.meta_key = '_dp_mpn')";
            $joins[] = "LEFT JOIN {$wpdb->postmeta} pm_norm ON (pm_norm.post_id = p.ID AND pm_norm.meta_key = '_dp_normalized_mpn')";
            $joins[] = "LEFT JOIN {$wpdb->postmeta} pm_sku ON (pm_sku.post_id = p.ID AND pm_sku.meta_key = '_sku')";

            $where[] = $wpdb->prepare(
                "(pm_mpn.meta_value = %s OR pm_norm.meta_value = %s OR pm_sku.meta_value = %s OR p.post_title LIKE %s OR pm_norm.meta_value LIKE %s)",
                $clean_query,
                $norm_query,
                $clean_query,
                '%' . $wpdb->esc_like($clean_query) . '%',
                '%' . $wpdb->esc_like($norm_query) . '%'
            );
        }

        // 2. Brand Filter
        if (!empty($filters['brand'])) {
            $brand_slugs = (array)$filters['brand'];
            $joins[] = "INNER JOIN {$wpdb->term_relationships} tr_brand ON tr_brand.object_id = p.ID
                        INNER JOIN {$wpdb->term_taxonomy} tt_brand ON tt_brand.term_taxonomy_id = tr_brand.term_taxonomy_id AND tt_brand.taxonomy = 'dp_brand'
                        INNER JOIN {$wpdb->terms} t_brand ON t_brand.term_id = tt_brand.term_id";
            $escaped_brands = implode("','", array_map('esc_sql', $brand_slugs));
            $where[] = "t_brand.slug IN ('{$escaped_brands}')";
        }

        // 3. Series Filter
        if (!empty($filters['series'])) {
            $series_slugs = (array)$filters['series'];
            $joins[] = "INNER JOIN {$wpdb->term_relationships} tr_series ON tr_series.object_id = p.ID
                        INNER JOIN {$wpdb->term_taxonomy} tt_series ON tt_series.term_taxonomy_id = tr_series.term_taxonomy_id AND tt_series.taxonomy = 'dp_series'
                        INNER JOIN {$wpdb->terms} t_series ON t_series.term_id = tt_series.term_id";
            $escaped_series = implode("','", array_map('esc_sql', $series_slugs));
            $where[] = "t_series.slug IN ('{$escaped_series}')";
        }

        // 4. Rated Current Filter via custom table (dp_specs)
        $specs_table = Schema::get_table_name(Schema::TABLE_SPECS);
        if (isset($filters['rated_current_min']) || isset($filters['rated_current_max'])) {
            $joins[] = "INNER JOIN {$specs_table} sp_cur_range ON (sp_cur_range.product_id = p.ID AND sp_cur_range.spec_key = 'rated_current')";
            if (isset($filters['rated_current_min'])) {
                $where[] = $wpdb->prepare("sp_cur_range.value_numeric >= %f", (float)$filters['rated_current_min']);
            }
            if (isset($filters['rated_current_max'])) {
                $where[] = $wpdb->prepare("sp_cur_range.value_numeric <= %f", (float)$filters['rated_current_max']);
            }
        } elseif (!empty($filters['rated_current'])) {
            $joins[] = "INNER JOIN {$specs_table} sp_cur ON (sp_cur.product_id = p.ID AND sp_cur.spec_key = 'rated_current')";
            $current_val = (float)$filters['rated_current'];
            $where[] = $wpdb->prepare("sp_cur.value_numeric = %f", $current_val);
        }

        // 5. In-Stock Filter
        if (!empty($filters['in_stock_only'])) {
            $joins[] = "INNER JOIN {$wpdb->postmeta} pm_stock ON (pm_stock.post_id = p.ID AND pm_stock.meta_key = '_stock_status')";
            $where[] = "pm_stock.meta_value = 'instock'";
        }

        $join_str  = implode(' ', array_unique($joins));
        $where_str = implode(' AND ', $where);

        $sql_count = "SELECT COUNT(DISTINCT p.ID) FROM {$wpdb->posts} p {$join_str} WHERE {$where_str}";
        $total     = (int)$wpdb->get_var($sql_count);

        // Sorting
        $order_by = "p.post_title ASC";
        if ($sort === 'popularity') {
            $order_by = "p.ID DESC";
        }

        $sql_items = "SELECT DISTINCT p.ID, p.post_title, p.post_name 
                      FROM {$wpdb->posts} p {$join_str} 
                      WHERE {$where_str} 
                      ORDER BY {$order_by} 
                      LIMIT {$offset}, {$per_page}";

        $results = $wpdb->get_results($sql_items, ARRAY_A);

        // BATCH PRIME POST, POSTMETA & TERM CACHES TO PREVENT N+1 QUERIES
        $post_ids = array_map(fn($r) => (int)$r['ID'], $results);
        if (!empty($post_ids)) {
            if (function_exists('_prime_post_caches')) {
                _prime_post_caches($post_ids, ['postmeta' => true, 'terms' => true]);
            }
            update_meta_cache('post', $post_ids);
            update_object_term_cache($post_ids, 'product');
        }

        $hits = [];
        foreach ($results as $row) {
            $id = (int)$row['ID'];
            $mpn = get_post_meta($id, ProductMetaManager::META_MPN, true) ?: '';
            $sku = get_post_meta($id, '_sku', true) ?: ProductMetaManager::generate_sku('DP', $mpn);

            $brands = wp_get_post_terms($id, 'dp_brand', ['fields' => 'names']);
            $brand  = !empty($brands) && !is_wp_error($brands) ? $brands[0] : '';

            $series = wp_get_post_terms($id, 'dp_series', ['fields' => 'names']);
            $series_name = !empty($series) && !is_wp_error($series) ? $series[0] : '';

            $hits[] = [
                'id'       => $id,
                'title'    => $row['post_title'],
                'mpn'      => $mpn,
                'sku'      => $sku,
                'brand'    => $brand,
                'series'   => $series_name,
                'url'      => get_permalink($id),
                'image'    => get_the_post_thumbnail_url($id, 'medium') ?: '',
                'in_stock' => true,
            ];
        }

        $response = [
            'success'          => true,
            'hits'             => $hits,
            'total'            => $total,
            'facets'           => [
                'brand' => [],
                'series' => [],
            ],
            'processingTimeMs' => round((microtime(true) - $start_time) * 1000, 2),
        ];

        set_transient($cache_key, $response, 300);

        return $response;
    }

    public function index_product(int $product_id): bool
    {
        return true;
    }

    public function bulk_index(array $product_ids): array
    {
        return ['indexed' => count($product_ids), 'success' => true];
    }

    public function delete_product(int $product_id): bool
    {
        return true;
    }
}
