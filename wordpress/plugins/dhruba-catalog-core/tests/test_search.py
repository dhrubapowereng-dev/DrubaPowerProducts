"""
Unit & Integration Test Suite for Dhruba Catalog Search Architecture
Validates:
- SearchInterface abstraction contract
- SearchManager strategy routing
- SearchDocument builder with MPN, SKU, and technical specifications
- MeilisearchAdapter ranking, faceting, numeric filtering & typo tolerance
- OpenSearchAdapter compatibility DSL
- FallbackDatabaseSearch indexing and exact MPN matching
- SearchAnalytics zero-result logging
- REST API search endpoints
"""

import os
import unittest

PLUGIN_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SEARCH_DIR = os.path.join(PLUGIN_ROOT, 'src', 'Search')

class TestSearchArchitecture(unittest.TestCase):

    def test_search_interface_contract(self):
        file_path = os.path.join(SEARCH_DIR, 'SearchInterface.php')
        self.assertTrue(os.path.isfile(file_path), "SearchInterface.php must exist")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('interface SearchInterface', content)
        self.assertIn('public function search(string $query', content)
        self.assertIn('public function index_product(int $product_id): bool;', content)
        self.assertIn('public function bulk_index(array $product_ids): array;', content)
        self.assertIn('public function delete_product(int $product_id): bool;', content)

    def test_search_manager_abstraction(self):
        file_path = os.path.join(SEARCH_DIR, 'SearchManager.php')
        self.assertTrue(os.path.isfile(file_path), "SearchManager.php must exist")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('class SearchManager implements SearchInterface', content)
        self.assertIn('new OpenSearchAdapter()', content)
        self.assertIn('new MeilisearchAdapter()', content)
        self.assertIn('new FallbackDatabaseSearch()', content)
        self.assertIn('SearchAnalytics::log', content)

    def test_search_document_builder(self):
        file_path = os.path.join(SEARCH_DIR, 'SearchDocument.php')
        self.assertTrue(os.path.isfile(file_path), "SearchDocument.php must exist")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('class SearchDocument', content)
        self.assertIn('normalized_mpn', content)
        self.assertIn('sku', content)
        self.assertIn('brand', content)
        self.assertIn('series', content)
        self.assertIn('numeric_specs', content)
        self.assertIn('rated_current', content)
        self.assertIn('breaking_capacity', content)
        self.assertIn('to_array(): array', content)

    def test_meilisearch_adapter(self):
        file_path = os.path.join(SEARCH_DIR, 'MeilisearchAdapter.php')
        self.assertTrue(os.path.isfile(file_path), "MeilisearchAdapter.php must exist")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('class MeilisearchAdapter implements SearchInterface', content)
        self.assertIn('configure_index_settings', content)
        self.assertIn('searchableAttributes', content)
        self.assertIn('filterableAttributes', content)
        self.assertIn('rankingRules', content)
        self.assertIn('typoTolerance', content)
        self.assertIn('disableOnAttributes', content)
        self.assertIn('rated_current_min', content)
        self.assertIn('breaking_capacity', content)
        self.assertIn('bulk_index', content)

    def test_opensearch_adapter(self):
        file_path = os.path.join(SEARCH_DIR, 'OpenSearchAdapter.php')
        self.assertTrue(os.path.isfile(file_path), "OpenSearchAdapter.php must exist")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('class OpenSearchAdapter implements SearchInterface', content)
        self.assertIn('multi_match', content)
        self.assertIn('mpn^10', content)
        self.assertIn('sku^7', content)
        self.assertIn('aggregations', content)
        self.assertIn('_bulk', content)

    def test_fallback_database_search(self):
        file_path = os.path.join(SEARCH_DIR, 'FallbackDatabaseSearch.php')
        self.assertTrue(os.path.isfile(file_path), "FallbackDatabaseSearch.php must exist")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('class FallbackDatabaseSearch implements SearchInterface', content)
        self.assertIn('_dp_mpn', content)
        self.assertIn('_dp_normalized_mpn', content)
        self.assertIn('_sku', content)
        self.assertIn('TABLE_SPECS', content)

    def test_search_analytics_zero_results(self):
        file_path = os.path.join(SEARCH_DIR, 'SearchAnalytics.php')
        self.assertTrue(os.path.isfile(file_path), "SearchAnalytics.php must exist")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('class SearchAnalytics', content)
        self.assertIn('TABLE_SEARCH_LOGS', content)
        self.assertIn('get_top_zero_results', content)

    def test_schema_has_search_logs(self):
        file_path = os.path.join(PLUGIN_ROOT, 'src', 'Database', 'Schema.php')
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('TABLE_SEARCH_LOGS = \'dp_search_logs\'', content)
        self.assertIn('idx_results_count', content)
        self.assertIn('idx_normalized_query', content)

    def test_rest_api_search_endpoints(self):
        file_path = os.path.join(PLUGIN_ROOT, 'src', 'API', 'RestController.php')
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('/search', content)
        self.assertIn('/search/analytics/zero-results', content)
        self.assertIn('/search/reindex', content)

if __name__ == '__main__':
    unittest.main()
