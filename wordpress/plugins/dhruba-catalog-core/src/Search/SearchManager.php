<?php
/**
 * Search Engine Manager (Strategy Context)
 *
 * Implements the search abstraction layer. Routes requests seamlessly
 * between Meilisearch, OpenSearch / Elasticsearch, or FallbackDatabaseSearch.
 * Handles zero-result analytics tracking and query normalization.
 *
 * @package DhrubaCatalog\Search
 */

declare(strict_types=1);

namespace DhrubaCatalog\Search;

final class SearchManager implements SearchInterface
{
    private SearchInterface $driver;
    private string $driver_name;

    public function __construct(?SearchInterface $driver = null)
    {
        if ($driver !== null) {
            $this->driver = $driver;
            $this->driver_name = get_class($driver);
            return;
        }

        // Auto-resolve configured engine
        $engine = get_option('dp_search_engine', 'auto');
        $meili_host = get_option('dp_meilisearch_host', '');
        $opensearch_host = get_option('dp_opensearch_host', '');

        if ($engine === 'opensearch' || (!empty($opensearch_host) && $engine === 'auto')) {
            $this->driver = new OpenSearchAdapter();
            $this->driver_name = 'opensearch';
        } elseif ($engine === 'meilisearch' || (!empty($meili_host) && $engine === 'auto')) {
            $this->driver = new MeilisearchAdapter();
            $this->driver_name = 'meilisearch';
        } else {
            $this->driver = new FallbackDatabaseSearch();
            $this->driver_name = 'database_fallback';
        }
    }

    public function get_driver_name(): string
    {
        return $this->driver_name;
    }

    public function search(string $query, array $filters = [], int $page = 1, int $per_page = 24, string $sort = 'relevance'): array
    {
        $start_time = microtime(true);
        $clean_query = trim($query);

        // Execute search via the active engine adapter
        $result = $this->driver->search($clean_query, $filters, $page, $per_page, $sort);

        // Attach engine telemetry
        $result['engine'] = $this->driver_name;
        if (!isset($result['processingTimeMs'])) {
            $result['processingTimeMs'] = round((microtime(true) - $start_time) * 1000, 2);
        }

        // Log search analytics & zero-result tracking
        $total_hits = (int)($result['total'] ?? 0);
        SearchAnalytics::log($clean_query, $total_hits, $filters);

        return $result;
    }

    public function index_product(int $product_id): bool
    {
        return $this->driver->index_product($product_id);
    }

    public function bulk_index(array $product_ids): array
    {
        return $this->driver->bulk_index($product_ids);
    }

    public function delete_product(int $product_id): bool
    {
        return $this->driver->delete_product($product_id);
    }
}
