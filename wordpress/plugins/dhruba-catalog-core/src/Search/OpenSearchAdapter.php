<?php
/**
 * OpenSearch / Elasticsearch Adapter
 *
 * Implements the SearchInterface using Elasticsearch/OpenSearch query DSL.
 * This guarantees Dhruba Power can seamlessly swap engines from Meilisearch
 * to OpenSearch without touching the WordPress theme or frontend REST API consumers.
 *
 * @package DhrubaCatalog\Search
 */

declare(strict_types=1);

namespace DhrubaCatalog\Search;

final class OpenSearchAdapter implements SearchInterface
{
    private string $host;
    private string $index_name;
    private string $username;
    private string $password;

    public function __construct()
    {
        $this->host       = (string)get_option('dp_opensearch_host', 'http://127.0.0.1:9200');
        $this->index_name = (string)get_option('dp_opensearch_index', 'dhruba_products');
        $this->username   = (string)get_option('dp_opensearch_user', '');
        $this->password   = (string)get_option('dp_opensearch_pass', '');
    }

    public function search(string $query, array $filters = [], int $page = 1, int $per_page = 24, string $sort = 'relevance'): array
    {
        $from = ($page - 1) * $per_page;
        $bool_query = ['must' => [], 'filter' => []];

        // 1. Multi-match Query with Field Boosting
        if (!empty($query)) {
            $bool_query['must'][] = [
                'multi_match' => [
                    'query'  => $query,
                    'fields' => [
                        'mpn^10',             // 10x boost for exact MPN
                        'normalized_mpn^8',  // 8x boost for normalized MPN
                        'sku^7',             // 7x boost for SKU
                        'mfg_code^6',        // 6x boost for OEM Order Code
                        'title^4',           // 4x boost for Title
                        'brand^3',           // 3x boost for Brand
                        'series^2',          // 2x boost for Series
                        'specs.*',           // 1x for Specifications
                    ],
                    'fuzziness' => 'AUTO',
                ],
            ];
        } else {
            $bool_query['must'][] = ['match_all' => new \stdClass()];
        }

        // 2. Filter clauses
        if (!empty($filters['brand'])) {
            $bool_query['filter'][] = ['terms' => ['brand.keyword' => (array)$filters['brand']]];
        }
        if (!empty($filters['series'])) {
            $bool_query['filter'][] = ['terms' => ['series.keyword' => (array)$filters['series']]];
        }
        if (!empty($filters['product_type'])) {
            $bool_query['filter'][] = ['terms' => ['product_type.keyword' => (array)$filters['product_type']]];
        }
        if (!empty($filters['poles'])) {
            $bool_query['filter'][] = ['terms' => ['poles.keyword' => (array)$filters['poles']]];
        }
        if (!empty($filters['in_stock_only'])) {
            $bool_query['filter'][] = ['term' => ['in_stock' => true]];
        }

        // Numeric filtering
        if (isset($filters['rated_current_min']) || isset($filters['rated_current_max'])) {
            $range = [];
            if (isset($filters['rated_current_min'])) $range['gte'] = (float)$filters['rated_current_min'];
            if (isset($filters['rated_current_max'])) $range['lte'] = (float)$filters['rated_current_max'];
            $bool_query['filter'][] = ['range' => ['rated_current' => $range]];
        } elseif (!empty($filters['rated_current'])) {
            $bool_query['filter'][] = ['term' => ['rated_current' => (float)$filters['rated_current']]];
        }

        // 3. Facets / Aggregations
        $aggs = [
            'brand'             => ['terms' => ['field' => 'brand.keyword', 'size' => 50]],
            'series'            => ['terms' => ['field' => 'series.keyword', 'size' => 50]],
            'product_type'      => ['terms' => ['field' => 'product_type.keyword', 'size' => 50]],
            'poles'             => ['terms' => ['field' => 'poles.keyword', 'size' => 20]],
            'rated_current'     => ['terms' => ['field' => 'rated_current', 'size' => 50]],
            'breaking_capacity' => ['terms' => ['field' => 'breaking_capacity', 'size' => 20]],
            'in_stock'          => ['terms' => ['field' => 'in_stock']],
        ];

        // 4. Sorting
        $sort_clause = ['_score'];
        if ($sort === 'current_asc') {
            $sort_clause = [['rated_current' => ['order' => 'asc']]];
        } elseif ($sort === 'current_desc') {
            $sort_clause = [['rated_current' => ['order' => 'desc']]];
        } elseif ($sort === 'popularity') {
            $sort_clause = [['popularity' => ['order' => 'desc']]];
        }

        $body = [
            'from'    => $from,
            'size'    => $per_page,
            'query'   => ['bool' => $bool_query],
            'aggs'    => $aggs,
            'sort'    => $sort_clause,
        ];

        $headers = ['Content-Type' => 'application/json'];
        if (!empty($this->username) && !empty($this->password)) {
            $headers['Authorization'] = 'Basic ' . base64_encode("{$this->username}:{$this->password}");
        }

        $url = rtrim($this->host, '/') . "/{$this->index_name}/_search";
        $res = wp_remote_post($url, [
            'headers' => $headers,
            'body'    => wp_json_encode($body),
            'timeout' => 4,
        ]);

        if (is_wp_error($res) || wp_remote_retrieve_response_code($res) >= 300) {
            return [
                'success' => false,
                'error'   => is_wp_error($res) ? $res->get_error_message() : 'OpenSearch error',
                'hits'    => [],
                'total'   => 0,
                'facets'  => [],
            ];
        }

        $raw = json_decode(wp_remote_retrieve_body($res), true);
        $hits = [];
        foreach ($raw['hits']['hits'] ?? [] as $hit) {
            $hits[] = $hit['_source'];
        }

        // Map ES aggregations to standardized facet format
        $facets = [];
        foreach ($raw['aggregations'] ?? [] as $agg_key => $agg_data) {
            $facets[$agg_key] = [];
            foreach ($agg_data['buckets'] ?? [] as $bucket) {
                $facets[$agg_key][(string)$bucket['key']] = $bucket['doc_count'];
            }
        }

        return [
            'success'          => true,
            'hits'             => $hits,
            'total'            => $raw['hits']['total']['value'] ?? count($hits),
            'facets'           => $facets,
            'processingTimeMs' => $raw['took'] ?? 0,
        ];
    }

    public function index_product(int $product_id): bool
    {
        $doc = (new SearchDocument($product_id))->to_array();
        if (empty($doc['title'])) return false;

        $url = rtrim($this->host, '/') . "/{$this->index_name}/_doc/{$product_id}";
        $headers = ['Content-Type' => 'application/json'];
        if (!empty($this->username)) {
            $headers['Authorization'] = 'Basic ' . base64_encode("{$this->username}:{$this->password}");
        }

        $res = wp_remote_request($url, [
            'method'  => 'PUT',
            'headers' => $headers,
            'body'    => wp_json_encode($doc),
            'timeout' => 5,
        ]);

        return !is_wp_error($res) && wp_remote_retrieve_response_code($res) < 300;
    }

    public function bulk_index(array $product_ids): array
    {
        $ndjson = '';
        $count = 0;

        foreach ($product_ids as $id) {
            $doc = (new SearchDocument((int)$id))->to_array();
            if (!empty($doc['title'])) {
                $action = wp_json_encode(['index' => ['_index' => $this->index_name, '_id' => $id]]);
                $data   = wp_json_encode($doc);
                $ndjson .= $action . "\n" . $data . "\n";
                $count++;
            }
        }

        if (empty($ndjson)) {
            return ['indexed' => 0, 'success' => true];
        }

        $url = rtrim($this->host, '/') . '/_bulk';
        $headers = ['Content-Type' => 'application/x-ndjson'];
        if (!empty($this->username)) {
            $headers['Authorization'] = 'Basic ' . base64_encode("{$this->username}:{$this->password}");
        }

        $res = wp_remote_post($url, [
            'headers' => $headers,
            'body'    => $ndjson,
            'timeout' => 20,
        ]);

        return [
            'indexed' => $count,
            'success' => !is_wp_error($res) && wp_remote_retrieve_response_code($res) < 300,
        ];
    }

    public function delete_product(int $product_id): bool
    {
        $url = rtrim($this->host, '/') . "/{$this->index_name}/_doc/{$product_id}";
        $headers = [];
        if (!empty($this->username)) {
            $headers['Authorization'] = 'Basic ' . base64_encode("{$this->username}:{$this->password}");
        }

        $res = wp_remote_request($url, [
            'method'  => 'DELETE',
            'headers' => $headers,
            'timeout' => 5,
        ]);

        return !is_wp_error($res);
    }
}
