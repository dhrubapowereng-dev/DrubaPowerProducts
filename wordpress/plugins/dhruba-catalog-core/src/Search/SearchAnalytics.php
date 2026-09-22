<?php
/**
 * Search Analytics & Zero-Result Tracker
 *
 * Tracks catalog search demand, identifies unfulfilled customer queries,
 * and records zero-result searches to alert the engineering procurement team.
 *
 * @package DhrubaCatalog\Search
 */

declare(strict_types=1);

namespace DhrubaCatalog\Search;

use DhrubaCatalog\Database\Schema;
use DhrubaCatalog\Product\ProductMetaManager;

final class SearchAnalytics
{
    /**
     * Log a search query execution
     */
    public static function log(string $query, int $results_count, array $filters = []): void
    {
        $clean_query = trim($query);
        if (empty($clean_query) && empty($filters)) {
            return;
        }

        global $wpdb;
        $table = Schema::get_table_name(Schema::TABLE_SEARCH_LOGS);

        $user_ip = sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? '');
        $user_agent = sanitize_text_field($_SERVER['HTTP_USER_AGENT'] ?? '');
        $norm_query = ProductMetaManager::normalize_mpn($clean_query);

        $wpdb->insert(
            $table,
            [
                'query'            => mb_substr($clean_query, 0, 255),
                'normalized_query' => mb_substr($norm_query, 0, 255),
                'results_count'    => $results_count,
                'filters_json'     => !empty($filters) ? wp_json_encode($filters) : null,
                'user_ip'          => $user_ip,
                'user_agent'       => mb_substr($user_agent, 0, 500),
                'created_at'       => current_time('mysql'),
            ],
            ['%s', '%s', '%d', '%s', '%s', '%s', '%s']
        );
    }

    /**
     * Get top zero-result queries (missing SKUs needed by industrial customers)
     */
    public static function get_top_zero_results(int $limit = 20): array
    {
        global $wpdb;
        $table = Schema::get_table_name(Schema::TABLE_SEARCH_LOGS);

        $sql = "SELECT query, COUNT(*) as search_count, MAX(created_at) as last_searched
                FROM {$table}
                WHERE results_count = 0 AND query != ''
                GROUP BY normalized_query, query
                ORDER BY search_count DESC, last_searched DESC
                LIMIT %d";

        return (array)$wpdb->get_results($wpdb->prepare($sql, $limit), ARRAY_A);
    }

    /**
     * Get general search trends
     */
    public static function get_recent_searches(int $limit = 30): array
    {
        global $wpdb;
        $table = Schema::get_table_name(Schema::TABLE_SEARCH_LOGS);

        $sql = "SELECT query, results_count, filters_json, created_at
                FROM {$table}
                ORDER BY id DESC
                LIMIT %d";

        return (array)$wpdb->get_results($wpdb->prepare($sql, $limit), ARRAY_A);
    }
}
