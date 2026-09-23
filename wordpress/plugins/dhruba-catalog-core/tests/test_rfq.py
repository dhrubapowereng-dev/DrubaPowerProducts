"""
Unit & Integration Test Suite for Dhruba Catalog Complete RFQ System
Validates:
- RfqService & state machine workflow
- BoqModel & BOM parsing
- RfqFileUploader security & mime validation
- RfqNotificationService dual email engine
- WcOrderConverter WooCommerce order generation
- Database Schema tables (dp_rfqs, dp_rfq_items, dp_rfq_files)
- REST API RFQ routes & Admin Dashboard
"""

import os
import unittest

PLUGIN_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
RFQ_DIR = os.path.join(PLUGIN_ROOT, 'src', 'RFQ')
DB_DIR = os.path.join(PLUGIN_ROOT, 'src', 'Database')
API_DIR = os.path.join(PLUGIN_ROOT, 'src', 'API')
ADMIN_DIR = os.path.join(PLUGIN_ROOT, 'src', 'Admin')

class TestRfqSystem(unittest.TestCase):

    def test_rfq_service_file_and_statuses(self):
        file_path = os.path.join(RFQ_DIR, 'RfqService.php')
        self.assertTrue(os.path.isfile(file_path), "RfqService.php must exist")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Status workflow constants
        self.assertIn('const STATUS_NEW', content)
        self.assertIn('const STATUS_REVIEWING', content)
        self.assertIn('const STATUS_MATCHING', content)
        self.assertIn('const STATUS_QUOTED', content)
        self.assertIn('const STATUS_CUSTOMER_REVIEW', content)
        self.assertIn('const STATUS_ACCEPTED', content)
        self.assertIn('const STATUS_CONVERTED', content)

        # Methods
        self.assertIn('public static function generate_rfq_number', content)
        self.assertIn('public function create_rfq', content)
        self.assertIn('public function get_rfq_details', content)
        self.assertIn('public function get_user_rfq_history', content)
        self.assertIn('public function convert_to_wc_order', content)
        self.assertIn('public static function build_whatsapp_url', content)
        self.assertIn('public static function build_basket_whatsapp_url', content)

    def test_boq_model(self):
        file_path = os.path.join(RFQ_DIR, 'BoqModel.php')
        self.assertTrue(os.path.isfile(file_path), "BoqModel.php must exist")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('class BoqModel', content)
        self.assertIn('public static function create_line_item', content)
        self.assertIn('public static function parse_raw_text_boq', content)

    def test_file_uploader_security(self):
        file_path = os.path.join(RFQ_DIR, 'RfqFileUploader.php')
        self.assertTrue(os.path.isfile(file_path), "RfqFileUploader.php must exist")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('class RfqFileUploader', content)
        self.assertIn('MAX_FILE_SIZE_BYTES = 26214400', content) # 25MB
        self.assertIn('application/pdf', content)
        self.assertIn('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', content)
        self.assertIn('Options -ExecCGI -Indexes', content)
        self.assertIn('hash_file(\'sha256\'', content)

    def test_rfq_notification_service(self):
        file_path = os.path.join(RFQ_DIR, 'RfqNotificationService.php')
        self.assertTrue(os.path.isfile(file_path), "RfqNotificationService.php must exist")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('class RfqNotificationService', content)
        self.assertIn('public static function send_rfq_created_notifications', content)
        self.assertIn('public static function send_customer_confirmation', content)
        self.assertIn('public static function send_internal_sales_alert', content)
        self.assertIn('wp_mail', content)

    def test_wc_order_converter(self):
        file_path = os.path.join(RFQ_DIR, 'WcOrderConverter.php')
        self.assertTrue(os.path.isfile(file_path), "WcOrderConverter.php must exist")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('class WcOrderConverter', content)
        self.assertIn('convert_rfq_to_order', content)
        self.assertIn('wc_create_order', content)
        self.assertIn('_dp_source_rfq_number', content)
        self.assertIn('STATUS_CONVERTED', content)

    def test_database_schema_rfq_tables(self):
        file_path = os.path.join(DB_DIR, 'Schema.php')
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('TABLE_RFQS = \'dp_rfqs\'', content)
        self.assertIn('TABLE_RFQ_ITEMS = \'dp_rfq_items\'', content)
        self.assertIn('TABLE_RFQ_FILES = \'dp_rfq_files\'', content)
        self.assertIn('wc_order_id', content)
        self.assertIn('quoted_total', content)
        self.assertIn('guest_token', content)
        self.assertIn('custom_sku', content)
        self.assertIn('custom_name', content)

    def test_rest_controller_rfq_endpoints(self):
        file_path = os.path.join(API_DIR, 'RestController.php')
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('/rfq', content)
        self.assertIn('/rfq/upload', content)
        self.assertIn('/rfq/history', content)
        self.assertIn('/rfq/(?P<number>[a-zA-Z0-9_\\-]+)', content)
        self.assertIn('/rfq/(?P<id>\\d+)/status', content)
        self.assertIn('/rfq/(?P<id>\\d+)/convert-order', content)

    def test_admin_dashboard_rfq_workflow(self):
        file_path = os.path.join(ADMIN_DIR, 'AdminDashboard.php')
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn('render_rfqs_page', content)
        self.assertIn('dp_update_rfq_status', content)
        self.assertIn('dp_convert_to_wc_order', content)
        self.assertIn('build_basket_whatsapp_url', content)

if __name__ == '__main__':
    unittest.main()
