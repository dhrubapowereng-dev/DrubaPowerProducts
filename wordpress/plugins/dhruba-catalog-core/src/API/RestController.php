<?php
/**
 * REST API Controller for Dhruba Catalog Platform
 *
 * Provides secured REST endpoints for fast search, RFQ creation,
 * catalog browsing, and external ETL data ingestion.
 *
 * @package DhrubaCatalog\API
 */

declare(strict_types=1);

namespace DhrubaCatalog\API;

use DhrubaCatalog\Plugin;
use DhrubaCatalog\Product\ProductMetaManager;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;

final class RestController
{
    private const NAMESPACE = 'dhruba/v1';
    private Plugin $plugin;

    public function __construct(Plugin $plugin)
    {
        $this->plugin = $plugin;
    }

    public function register_routes(): void
    {
        // 1. Search & Filter Endpoint
        register_rest_route(self::NAMESPACE, '/search', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [$this, 'handle_search'],
            'permission_callback' => '__return_true',
            'args'                => [
                'q'        => ['sanitize_callback' => 'sanitize_text_field'],
                'page'     => ['default' => 1, 'sanitize_callback' => 'absint'],
                'per_page' => ['default' => 24, 'sanitize_callback' => 'absint'],
                'sort'     => ['default' => 'relevance', 'sanitize_callback' => 'sanitize_text_field'],
            ],
        ]);

        // 1b. Zero-Result & Search Demand Analytics Endpoint
        register_rest_route(self::NAMESPACE, '/search/analytics/zero-results', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [$this, 'handle_zero_result_analytics'],
            'permission_callback' => [$this, 'check_admin_permissions'],
        ]);

        // 1c. Trigger Product Search Reindexing Endpoint (Batch / Single)
        register_rest_route(self::NAMESPACE, '/search/reindex', [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => [$this, 'handle_search_reindex'],
            'permission_callback' => [$this, 'check_admin_permissions'],
        ]);

        // 2. Product Detail with Specs & Documents
        register_rest_route(self::NAMESPACE, '/products/(?P<id>\d+)', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [$this, 'handle_get_product'],
            'permission_callback' => '__return_true',
        ]);

        // 3. Submit RFQ Endpoint (Public with rate-limiting & nonce check)
        register_rest_route(self::NAMESPACE, '/rfq', [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => [$this, 'handle_create_rfq'],
            'permission_callback' => '__return_true',
        ]);

        // 3b. Secure File Upload for BOQ/BOM/Tender Drawings
        register_rest_route(self::NAMESPACE, '/rfq/upload', [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => [$this, 'handle_upload_rfq_file'],
            'permission_callback' => '__return_true',
        ]);

        // 3c. Customer RFQ History (Logged-in User or Guest Token)
        register_rest_route(self::NAMESPACE, '/rfq/history', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [$this, 'handle_rfq_history'],
            'permission_callback' => '__return_true',
        ]);

        // 4. Check Detailed RFQ Status & Line Items
        register_rest_route(self::NAMESPACE, '/rfq/(?P<number>[a-zA-Z0-9_\-]+)', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [$this, 'handle_get_rfq'],
            'permission_callback' => '__return_true',
        ]);

        // 4b. Update RFQ Status (Admin / Sales Engineer)
        register_rest_route(self::NAMESPACE, '/rfq/(?P<id>\d+)/status', [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => [$this, 'handle_update_rfq_status'],
            'permission_callback' => [$this, 'check_admin_permissions'],
        ]);

        // 4c. Convert RFQ to WooCommerce Order
        register_rest_route(self::NAMESPACE, '/rfq/(?P<id>\d+)/convert-order', [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => [$this, 'handle_convert_to_order'],
            'permission_callback' => [$this, 'check_admin_permissions'],
        ]);

        // 5. External ETL Ingest Endpoint (Requires manage_options or API Secret)
        register_rest_route(self::NAMESPACE, '/importer/ingest', [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => [$this, 'handle_etl_ingest'],
            'permission_callback' => [$this, 'check_importer_permissions'],
        ]);

        // 6. Catalog Health & System Diagnostics
        register_rest_route(self::NAMESPACE, '/health', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [$this, 'handle_health_check'],
            'permission_callback' => [$this, 'check_admin_permissions'],
        ]);
    }

    public function handle_search(WP_REST_Request $request): WP_REST_Response
    {
        $q        = (string)$request->get_param('q');
        $page     = (int)$request->get_param('page') ?: 1;
        $per_page = min(100, (int)$request->get_param('per_page') ?: 24);
        $sort     = (string)$request->get_param('sort') ?: 'relevance';
        $filters  = (array)$request->get_param('filters') ?: [];

        $search_engine = $this->plugin->get_search();
        $results       = $search_engine->search($q, $filters, $page, $per_page, $sort);

        return new WP_REST_Response($results, 200);
    }

    public function handle_zero_result_analytics(WP_REST_Request $request): WP_REST_Response
    {
        $limit = min(100, (int)$request->get_param('limit') ?: 20);
        $zero_results = \DhrubaCatalog\Search\SearchAnalytics::get_top_zero_results($limit);

        return new WP_REST_Response([
            'success' => true,
            'count'   => count($zero_results),
            'items'   => $zero_results,
        ], 200);
    }

    public function handle_search_reindex(WP_REST_Request $request): WP_REST_Response
    {
        $product_id = (int)$request->get_param('product_id');
        $search_engine = $this->plugin->get_search();

        if ($product_id > 0) {
            $success = $search_engine->index_product($product_id);
            return new WP_REST_Response(['success' => $success, 'product_id' => $product_id], 200);
        }

        $product_ids = (array)$request->get_param('product_ids');
        if (!empty($product_ids)) {
            $result = $search_engine->bulk_index($product_ids);
            return new WP_REST_Response(['success' => true, 'result' => $result], 200);
        }

        return new WP_REST_Response(['error' => 'Please provide product_id or product_ids array'], 400);
    }

    public function handle_get_product(WP_REST_Request $request): WP_REST_Response
    {
        $product_id = (int)$request->get_param('id');
        $product    = wc_get_product($product_id);

        if (!$product) {
            return new WP_REST_Response(['error' => 'Product not found'], 404);
        }

        $specs     = $this->plugin->get_specs()->get_product_specs($product_id);
        $documents = $this->plugin->get_documents()->get_product_documents($product_id);
        $series    = $this->plugin->get_relations()->get_same_series_models($product_id);

        $data = [
            'id'          => $product_id,
            'name'        => $product->get_name(),
            'sku'         => $product->get_sku(),
            'mpn'         => get_post_meta($product_id, ProductMetaManager::META_MPN, true) ?: '',
            'mfg_code'    => get_post_meta($product_id, ProductMetaManager::META_MANUFACTURER_CODE, true) ?: '',
            'in_stock'    => $product->is_in_stock(),
            'permalink'   => get_permalink($product_id),
            'specs'       => $specs,
            'documents'   => $documents,
            'same_series' => $series,
            'whatsapp_url'=> $this->plugin->get_rfq()::build_whatsapp_url($product_id),
        ];

        return new WP_REST_Response($data, 200);
    }

    public function handle_create_rfq(WP_REST_Request $request): WP_REST_Response
    {
        $params  = $request->get_json_params() ?: $request->get_body_params();
        $contact = sanitize_text_field($params['contact'] ?? '');
        $email   = sanitize_email($params['email'] ?? '');
        $phone   = sanitize_text_field($params['phone'] ?? '');

        if (empty($contact) || empty($email) || empty($phone)) {
            return new WP_REST_Response([
                'success' => false,
                'message' => __('Contact name, email, and phone number are required.', 'dhruba-catalog'),
            ], 400);
        }

        $items = $params['items'] ?? [];
        $files = $params['files'] ?? [];

        $res = $this->plugin->get_rfq()->create_rfq($params, $items, $files);
        return new WP_REST_Response($res, $res['success'] ? 201 : 400);
    }

    public function handle_upload_rfq_file(WP_REST_Request $request): WP_REST_Response
    {
        $files = $request->get_file_params();
        if (empty($files['file'])) {
            return new WP_REST_Response([
                'success' => false,
                'message' => __('No file uploaded. Key must be "file".', 'dhruba-catalog'),
            ], 400);
        }

        $result = \DhrubaCatalog\RFQ\RfqFileUploader::process_upload($files['file']);
        return new WP_REST_Response($result, $result['success'] ? 200 : 400);
    }

    public function handle_rfq_history(WP_REST_Request $request): WP_REST_Response
    {
        $user_id     = get_current_user_id() ?: null;
        $guest_token = sanitize_text_field($request->get_param('guest_token') ?? '');

        if (empty($user_id) && empty($guest_token)) {
            return new WP_REST_Response([
                'success' => false,
                'message' => __('Authentication or guest_token required to view RFQ history.', 'dhruba-catalog'),
            ], 401);
        }

        $history = $this->plugin->get_rfq()->get_user_rfq_history($user_id, $guest_token);
        return new WP_REST_Response([
            'success' => true,
            'history' => $history,
        ], 200);
    }

    public function handle_get_rfq(WP_REST_Request $request): WP_REST_Response
    {
        $number = sanitize_text_field($request->get_param('number'));
        $data   = $this->plugin->get_rfq()->get_rfq_details($number);

        if (!$data) {
            return new WP_REST_Response(['error' => 'RFQ not found'], 404);
        }

        return new WP_REST_Response($data, 200);
    }

    public function handle_update_rfq_status(WP_REST_Request $request): WP_REST_Response
    {
        $rfq_id     = (int)$request->get_param('id');
        $params     = $request->get_json_params() ?: $request->get_body_params();
        $new_status = sanitize_text_field($params['status'] ?? '');
        $salesperson= isset($params['assigned_salesperson']) ? (int)$params['assigned_salesperson'] : null;

        if (empty($new_status)) {
            return new WP_REST_Response(['error' => 'New status required.'], 400);
        }

        $success = $this->plugin->get_rfq()->update_rfq_status($rfq_id, $new_status, $salesperson);
        if (!$success) {
            return new WP_REST_Response(['error' => 'Failed to update RFQ status.'], 400);
        }

        return new WP_REST_Response([
            'success' => true,
            'message' => sprintf(__('RFQ #%d status updated to %s.', 'dhruba-catalog'), $rfq_id, $new_status),
            'status'  => $new_status,
        ], 200);
    }

    public function handle_convert_to_order(WP_REST_Request $request): WP_REST_Response
    {
        $rfq_id = (int)$request->get_param('id');
        $res    = $this->plugin->get_rfq()->convert_to_wc_order($rfq_id);

        return new WP_REST_Response($res, $res['success'] ? 200 : 400);
    }

    public function handle_etl_ingest(WP_REST_Request $request): WP_REST_Response
    {
        $payload = $request->get_json_params();
        if (empty($payload['mpn']) || empty($payload['brand'])) {
            return new WP_REST_Response(['error' => 'Missing brand or mpn in contract payload.'], 400);
        }

        // Idempotent ingestion logic
        $mpn      = sanitize_text_field($payload['mpn']);
        $norm_mpn = ProductMetaManager::normalize_mpn($mpn);

        // Check if existing
        global $wpdb;
        $existing_id = $wpdb->get_var($wpdb->prepare(
            "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = %s AND meta_value = %s LIMIT 1",
            ProductMetaManager::META_NORMALIZED_MPN,
            $norm_mpn
        ));

        if ($existing_id) {
            $product_id = (int)$existing_id;
            $action = 'updated';
        } else {
            // Create WooCommerce Simple Product
            $product = new \WC_Product_Simple();
            $product->set_name(sanitize_text_field($payload['name'] ?? "{$payload['brand']} {$mpn}"));
            $product->set_status('publish');
            $product_id = $product->save();
            $action = 'created';
        }

        // Set Metadata
        update_post_meta($product_id, ProductMetaManager::META_MPN, $mpn);
        update_post_meta($product_id, ProductMetaManager::META_NORMALIZED_MPN, $norm_mpn);
        update_post_meta($product_id, ProductMetaManager::META_MANUFACTURER_CODE, sanitize_text_field($payload['manufacturer_code'] ?? ''));
        update_post_meta($product_id, ProductMetaManager::META_OFFICIAL_URL, esc_url_raw($payload['official_url'] ?? ''));

        // Assign Brand
        $brand_term = wp_set_object_terms($product_id, sanitize_text_field($payload['brand']), 'dp_brand');

        // Ingest Specs
        if (!empty($payload['specifications']) && is_array($payload['specifications'])) {
            $this->plugin->get_specs()->batch_set_specs($product_id, $payload['specifications']);
        }

        // Ingest Documents
        if (!empty($payload['documents']) && is_array($payload['documents'])) {
            foreach ($payload['documents'] as $doc) {
                $this->plugin->get_documents()->register_document(
                    $product_id,
                    $doc['type'] ?? 'datasheet',
                    $doc['title'] ?? 'Technical Datasheet',
                    $doc['source_url'] ?? '',
                    $doc['local_path'] ?? '',
                    $doc['mime'] ?? 'application/pdf',
                    (int)($doc['size'] ?? 0),
                    $doc['sha256'] ?? ''
                );
            }
        }

        // Sync Search Index
        $this->plugin->get_search()->index_product($product_id);

        return new WP_REST_Response([
            'success'    => true,
            'action'     => $action,
            'product_id' => $product_id,
            'mpn'        => $mpn,
        ], 200);
    }

    public function handle_health_check(): WP_REST_Response
    {
        global $wpdb;
        $specs_count = (int)$wpdb->get_var("SELECT COUNT(*) FROM " . \DhrubaCatalog\Database\Schema::get_table_name(\DhrubaCatalog\Database\Schema::TABLE_SPECS));
        $docs_count  = (int)$wpdb->get_var("SELECT COUNT(*) FROM " . \DhrubaCatalog\Database\Schema::get_table_name(\DhrubaCatalog\Database\Schema::TABLE_DOCUMENTS));
        $rfq_count   = (int)$wpdb->get_var("SELECT COUNT(*) FROM " . \DhrubaCatalog\Database\Schema::get_table_name(\DhrubaCatalog\Database\Schema::TABLE_RFQS));

        return new WP_REST_Response([
            'status'      => 'healthy',
            'version'     => DHRUBA_CATALOG_VERSION,
            'db_version'  => DHRUBA_CATALOG_DB_VERSION,
            'total_specs' => $specs_count,
            'total_docs'  => $docs_count,
            'total_rfqs'  => $rfq_count,
            'search_mode' => get_class($this->plugin->get_search()),
        ], 200);
    }

    public function check_importer_permissions(WP_REST_Request $request): bool
    {
        // 1. Check user capability
        if (current_user_can('manage_options')) {
            return true;
        }

        // 2. Check Bearer API Token
        $auth_header = $request->get_header('Authorization');
        $expected    = get_option('dp_importer_secret', '');
        if (!empty($expected) && !empty($auth_header)) {
            $token = trim(str_replace('Bearer', '', $auth_header));
            return hash_equals($expected, $token);
        }

        return false;
    }

    public function check_admin_permissions(): bool
    {
        return current_user_can('manage_options');
    }
}
