<?php
/**
 * Industrial Product Relationship Manager
 *
 * Manages same-series model variations, accessories, replacements, and compatibility mappings.
 *
 * @package DhrubaCatalog\Relations
 */

declare(strict_types=1);

namespace DhrubaCatalog\Relations;

use DhrubaCatalog\Database\Schema;

final class RelationshipManager
{
    public const REL_SAME_SERIES  = 'same_series';
    public const REL_COMPATIBLE   = 'compatible';
    public const REL_ACCESSORY    = 'accessory';
    public const REL_REPLACEMENT  = 'replacement';
    public const REL_ALTERNATIVE  = 'alternative';
    public const REL_SPARE_PART   = 'spare_part';
    public const REL_CROSS_SELL   = 'cross_sell';
    public const REL_UPSELL       = 'upsell';

    public function add_relation(
        int $source_id,
        int $target_id,
        string $relation_type,
        float $confidence = 100.0,
        string $source = 'manual'
    ): bool {
        global $wpdb;
        $table = Schema::get_table_name(Schema::TABLE_RELATIONS);

        return (bool)$wpdb->replace(
            $table,
            [
                'source_product_id' => $source_id,
                'target_product_id' => $target_id,
                'relation_type'     => sanitize_key($relation_type),
                'confidence'        => $confidence,
                'source'            => sanitize_key($source),
                'sort_order'        => 0,
            ]
        );
    }

    /**
     * Get related products by relation type with eager-loaded basic post information
     */
    public function get_related_products(int $product_id, string $relation_type, int $limit = 12): array
    {
        global $wpdb;
        $table = Schema::get_table_name(Schema::TABLE_RELATIONS);

        $sql = "SELECT r.target_product_id, r.confidence, r.relation_type,
                       p.post_title, p.post_name
                FROM {$table} r
                INNER JOIN {$wpdb->posts} p ON p.ID = r.target_product_id
                WHERE r.source_product_id = %d AND r.relation_type = %s AND p.post_status = 'publish'
                ORDER BY r.sort_order ASC, p.post_title ASC
                LIMIT %d";

        $results = $wpdb->get_results($wpdb->prepare($sql, $product_id, $relation_type, $limit), ARRAY_A);
        return $results ?: [];
    }

    /**
     * Get all other models in the same series for the single-product model switcher table
     */
    public function get_same_series_models(int $product_id): array
    {
        // First check relationship table
        $relations = $this->get_related_products($product_id, self::REL_SAME_SERIES, 20);
        if (!empty($relations)) {
            return $relations;
        }

        // Fallback: check taxonomy 'dp_series'
        $terms = wp_get_post_terms($product_id, 'dp_series');
        if (!empty($terms) && !is_wp_error($terms)) {
            $series_term = $terms[0];
            $args = [
                'post_type'      => 'product',
                'post_status'    => 'publish',
                'posts_per_page' => 20,
                'post__not_in'   => [$product_id],
                'tax_query'      => [
                    [
                        'taxonomy' => 'dp_series',
                        'field'    => 'term_id',
                        'terms'    => $series_term->term_id,
                    ],
                ],
            ];
            $query = new \WP_Query($args);
            $models = [];
            foreach ($query->posts as $post) {
                $models[] = [
                    'target_product_id' => $post->ID,
                    'post_title'        => $post->post_title,
                    'post_name'         => $post->post_name,
                    'relation_type'     => self::REL_SAME_SERIES,
                ];
            }
            return $models;
        }

        return [];
    }
}
