"""
Python Test Harness for Dhruba Catalog Core Plugin Foundation
Validates that all PHP classes, database schemas, table definitions, taxonomies,
and specification engines are structurally correct, complete, and syntactically valid.
"""

import os
import re
import unittest

PLUGIN_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

class TestDhrubaCatalogCoreFoundation(unittest.TestCase):

    def test_main_plugin_bootstrap(self):
        main_file = os.path.join(PLUGIN_ROOT, 'dhruba-catalog-core.php')
        self.assertTrue(os.path.isfile(main_file), "dhruba-catalog-core.php must exist")
        with open(main_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check Plugin header
        self.assertIn('Plugin Name: Dhruba Catalog Core', content)
        self.assertIn('declare(strict_types=1);', content)
        self.assertIn('namespace DhrubaCatalog;', content)
        self.assertIn("define('DHRUBA_CATALOG_VERSION'", content)
        self.assertIn("define('DHRUBA_CATALOG_DB_VERSION'", content)

        # Check Singleton instantiation and activation/deactivation hooks
        self.assertIn('register_activation_hook', content)
        self.assertIn('register_deactivation_hook', content)
        self.assertIn('spl_autoload_register', content)
        self.assertIn('dhruba_catalog();', content)

    def test_database_schema_and_tables(self):
        schema_file = os.path.join(PLUGIN_ROOT, 'src', 'Database', 'Schema.php')
        self.assertTrue(os.path.isfile(schema_file), "Schema.php must exist")
        with open(schema_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Verify all 7 high performance tables
        expected_tables = [
            'TABLE_SPECS = \'dp_specs\'',
            'TABLE_DOCUMENTS = \'dp_documents\'',
            'TABLE_RELATIONS = \'dp_product_relations\'',
            'TABLE_RFQS = \'dp_rfqs\'',
            'TABLE_RFQ_ITEMS = \'dp_rfq_items\'',
            'TABLE_RFQ_FILES = \'dp_rfq_files\'',
            'TABLE_IMPORT_JOBS = \'dp_import_jobs\'',
        ]
        for tbl in expected_tables:
            self.assertIn(tbl, content, f"Schema must define {tbl}")

        # Check dbDelta SQL statements
        self.assertIn('CREATE TABLE', content)
        self.assertIn('PRIMARY KEY', content)
        self.assertIn('KEY idx_spec_numeric', content)
        self.assertIn('KEY idx_sha256', content)
        self.assertIn('get_all_tables', content)
        self.assertIn('drop_tables', content)

    def test_database_migrator_versioning(self):
        migrator_file = os.path.join(PLUGIN_ROOT, 'src', 'Database', 'Migrator.php')
        self.assertTrue(os.path.isfile(migrator_file), "Migrator.php must exist")
        with open(migrator_file, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('run_migrations', content)
        self.assertIn('dbDelta', content)
        self.assertIn('dp_catalog_db_version', content)
        self.assertIn('apply_incremental_upgrades', content)

    def test_taxonomy_registrar(self):
        tax_file = os.path.join(PLUGIN_ROOT, 'src', 'Taxonomy', 'TaxonomyRegistrar.php')
        self.assertTrue(os.path.isfile(tax_file), "TaxonomyRegistrar.php must exist")
        with open(tax_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check required industrial taxonomies
        self.assertIn('TAX_BRAND = \'dp_brand\'', content)
        self.assertIn('TAX_SERIES = \'dp_series\'', content)
        self.assertIn('TAX_APPLICATION = \'dp_application\'', content)
        self.assertIn('TAX_CERTIFICATION = \'dp_certification\'', content)
        self.assertIn('register_taxonomy', content)
        self.assertIn("'show_in_rest'          => true", content)

    def test_product_meta_manager_and_quote_enforcement(self):
        meta_file = os.path.join(PLUGIN_ROOT, 'src', 'Product', 'ProductMetaManager.php')
        self.assertTrue(os.path.isfile(meta_file), "ProductMetaManager.php must exist")
        with open(meta_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check MPN and identity metadata keys
        self.assertIn('META_MPN               = \'_dp_mpn\'', content)
        self.assertIn('META_NORMALIZED_MPN    = \'_dp_normalized_mpn\'', content)
        self.assertIn('META_MANUFACTURER_CODE = \'_dp_mfg_code\'', content)
        self.assertIn('META_INTERNAL_SKU      = \'_dp_internal_sku\'', content)
        self.assertIn('META_OFFICIAL_URL      = \'_dp_official_url\'', content)

        # Quote-mode filters
        self.assertIn('woocommerce_get_price_html', content)
        self.assertIn('woocommerce_is_purchasable', content)
        self.assertIn('woocommerce_loop_add_to_cart_link', content)
        self.assertIn('woocommerce_product_data_tabs', content)
        self.assertIn('woocommerce_product_data_panels', content)
        self.assertIn('manage_edit-product_columns', content)
        self.assertIn('normalize_mpn', content)
        self.assertIn('generate_sku', content)

    def test_specification_engine(self):
        specs_file = os.path.join(PLUGIN_ROOT, 'src', 'Specs', 'SpecificationEngine.php')
        self.assertTrue(os.path.isfile(specs_file), "SpecificationEngine.php must exist")
        with open(specs_file, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('ATTRIBUTE_DICTIONARY', content)
        self.assertIn('rated_current', content)
        self.assertIn('breaking_capacity', content)
        self.assertIn('poles', content)
        self.assertIn('parse_spec_value', content)
        self.assertIn('get_product_specs', content)
        self.assertIn('set_spec', content)
        self.assertIn('batch_set_specs', content)

    def test_document_manager(self):
        doc_file = os.path.join(PLUGIN_ROOT, 'src', 'Documents', 'DocumentManager.php')
        self.assertTrue(os.path.isfile(doc_file), "DocumentManager.php must exist")
        with open(doc_file, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('TYPE_DATASHEET    = \'datasheet\'', content)
        self.assertIn('TYPE_MANUAL       = \'manual\'', content)
        self.assertIn('TYPE_CERTIFICATE  = \'certificate\'', content)
        self.assertIn('register_document', content)
        self.assertIn('sha256', content)

    def test_relationship_manager(self):
        rel_file = os.path.join(PLUGIN_ROOT, 'src', 'Relations', 'RelationshipManager.php')
        self.assertTrue(os.path.isfile(rel_file), "RelationshipManager.php must exist")
        with open(rel_file, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('REL_SAME_SERIES  = \'same_series\'', content)
        self.assertIn('REL_COMPATIBLE   = \'compatible\'', content)
        self.assertIn('REL_ACCESSORY    = \'accessory\'', content)
        self.assertIn('REL_REPLACEMENT  = \'replacement\'', content)
        self.assertIn('add_relation', content)
        self.assertIn('get_related_products', content)
        self.assertIn('get_same_series_models', content)

    def test_rfq_service_state_machine(self):
        rfq_file = os.path.join(PLUGIN_ROOT, 'src', 'RFQ', 'RfqService.php')
        self.assertTrue(os.path.isfile(rfq_file), "RfqService.php must exist")
        with open(rfq_file, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('STATUS_NEW             = \'NEW\'', content)
        self.assertIn('STATUS_REVIEWING       = \'REVIEWING\'', content)
        self.assertIn('STATUS_MATCHING        = \'MATCHING\'', content)
        self.assertIn('STATUS_QUOTED          = \'QUOTED\'', content)
        self.assertIn('generate_rfq_number', content)
        self.assertIn('create_rfq', content)
        self.assertIn('update_rfq_status', content)
        self.assertIn('build_whatsapp_url', content)

    def test_admin_dashboard_menus_and_database_page(self):
        admin_file = os.path.join(PLUGIN_ROOT, 'src', 'Admin', 'AdminDashboard.php')
        self.assertTrue(os.path.isfile(admin_file), "AdminDashboard.php must exist")
        with open(admin_file, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('register_admin_menus', content)
        self.assertIn('render_dashboard_page', content)
        self.assertIn('render_rfqs_page', content)
        self.assertIn('render_database_page', content)
        self.assertIn('render_settings_page', content)
        self.assertIn('current_user_can(\'manage_options\')', content)
        self.assertIn('check_admin_referer', content)

    def test_rest_api_foundation(self):
        api_file = os.path.join(PLUGIN_ROOT, 'src', 'API', 'RestController.php')
        self.assertTrue(os.path.isfile(api_file), "RestController.php must exist")
        with open(api_file, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('NAMESPACE = \'dhruba/v1\'', content)
        self.assertIn('register_rest_route(self::NAMESPACE, \'/search\'', content)
        self.assertIn('register_rest_route(self::NAMESPACE, \'/products/(?P<id>\\d+)\'', content)
        self.assertIn('register_rest_route(self::NAMESPACE, \'/rfq\'', content)
        self.assertIn('register_rest_route(self::NAMESPACE, \'/importer/ingest\'', content)
        self.assertIn('register_rest_route(self::NAMESPACE, \'/health\'', content)
        self.assertIn('check_importer_permissions', content)

if __name__ == '__main__':
    unittest.main()
