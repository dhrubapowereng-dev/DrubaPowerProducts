<?php
/**
 * Search Engine Interface for 50,000+ Industrial Products
 *
 * @package DhrubaCatalog\Search
 */

declare(strict_types=1);

namespace DhrubaCatalog\Search;

interface SearchInterface
{
    /**
     * Search products with query, structured filters, and facets
     *
     * @param string $query User query (e.g. "ABB SH201-C20", "63A MCCB")
     * @param array $filters Structured filters [brand => [...], current => [...], etc.]
     * @param int $page Page number
     * @param int $per_page Products per page
     * @param string $sort Sort rule ('relevance', 'mpn_asc', 'current_asc', etc.)
     * @return array Standardized result envelope with items, total, facets, processingTimeMs
     */
    public function search(string $query, array $filters = [], int $page = 1, int $per_page = 24, string $sort = 'relevance'): array;

    /**
     * Index a single product into the search engine
     */
    public function index_product(int $product_id): bool;

    /**
     * Bulk index products
     */
    public function bulk_index(array $product_ids): array;

    /**
     * Remove product from index
     */
    public function delete_product(int $product_id): bool;
}
