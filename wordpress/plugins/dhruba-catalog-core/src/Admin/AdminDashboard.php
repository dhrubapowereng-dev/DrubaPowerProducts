<?php
/**
 * Admin Dashboard & Catalog Health Panel
 *
 * Provides real-time visibility into data completeness for 20,000-50,000 products,
 * RFQ management, and engine settings.
 *
 * @package DhrubaCatalog\Admin
 */

declare(strict_types=1);

namespace DhrubaCatalog\Admin;

use DhrubaCatalog\Plugin;
use DhrubaCatalog\Database\Schema;
use DhrubaCatalog\Product\ProductMetaManager;

final class AdminDashboard
{
    private Plugin $plugin;

    public function __construct(Plugin $plugin)
    {
        $this->plugin = $plugin;
        add_action('admin_menu', [$this, 'register_admin_menus']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function register_admin_menus(): void
    {
        add_menu_page(
            __('Dhruba Catalog', 'dhruba-catalog'),
            __('Dhruba Catalog', 'dhruba-catalog'),
            'manage_options',
            'dhruba-catalog',
            [$this, 'render_dashboard_page'],
            'dashicons-hammer',
            56
        );

        add_submenu_page(
            'dhruba-catalog',
            __('RFQ Management', 'dhruba-catalog'),
            __('RFQs', 'dhruba-catalog'),
            'manage_options',
            'dhruba-rfqs',
            [$this, 'render_rfqs_page']
        );

        add_submenu_page(
            'dhruba-catalog',
            __('Database & Migrations', 'dhruba-catalog'),
            __('Database & Health', 'dhruba-catalog'),
            'manage_options',
            'dhruba-database',
            [$this, 'render_database_page']
        );

        add_submenu_page(
            'dhruba-catalog',
            __('Engine Settings', 'dhruba-catalog'),
            __('Settings', 'dhruba-catalog'),
            'manage_options',
            'dhruba-settings',
            [$this, 'render_settings_page']
        );
    }

    public function register_settings(): void
    {
        register_setting('dp_settings_group', 'dp_whatsapp_number');
        register_setting('dp_settings_group', 'dp_meilisearch_host');
        register_setting('dp_settings_group', 'dp_meilisearch_key');
        register_setting('dp_settings_group', 'dp_meilisearch_index');
        register_setting('dp_settings_group', 'dp_importer_secret');
    }

    public function render_dashboard_page(): void
    {
        global $wpdb;
        $total_products = (int)wp_count_posts('product')->publish;
        $specs_count    = (int)$wpdb->get_var("SELECT COUNT(*) FROM " . Schema::get_table_name(Schema::TABLE_SPECS));
        $docs_count     = (int)$wpdb->get_var("SELECT COUNT(*) FROM " . Schema::get_table_name(Schema::TABLE_DOCUMENTS));
        $rfq_count      = (int)$wpdb->get_var("SELECT COUNT(*) FROM " . Schema::get_table_name(Schema::TABLE_RFQS));

        // Missing MPN
        $missing_mpn = (int)$wpdb->get_var("
            SELECT COUNT(*) FROM {$wpdb->posts} p
            WHERE p.post_type = 'product' AND p.post_status = 'publish'
            AND p.ID NOT IN (SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_dp_mpn' AND meta_value != '')
        ");

        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Dhruba Power — Industrial Catalog Health', 'dhruba-catalog') . '</h1>';
        echo '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin:20px 0;">';
        
        $this->render_metric_card(__('Total Products', 'dhruba-catalog'), number_format($total_products), '#0284c7');
        $this->render_metric_card(__('Technical Specifications', 'dhruba-catalog'), number_format($specs_count), '#16a34a');
        $this->render_metric_card(__('Datasheets & Docs', 'dhruba-catalog'), number_format($docs_count), '#9333ea');
        $this->render_metric_card(__('Pending RFQs', 'dhruba-catalog'), number_format($rfq_count), '#ea580c');
        $this->render_metric_card(__('Missing MPN Alert', 'dhruba-catalog'), number_format($missing_mpn), $missing_mpn > 0 ? '#dc2626' : '#64748b');

        echo '</div>';
        echo '<div class="card" style="max-width:100%; padding:20px;">';
        echo '<h2>' . esc_html__('Search & Scalability Engine Status', 'dhruba-catalog') . '</h2>';
        $search_class = get_class($this->plugin->get_search());
        echo '<p><strong>Active Engine:</strong> <code>' . esc_html($search_class) . '</code></p>';
        echo '<p>Meilisearch provides millisecond typo-tolerant full-text search with structured faceting for 50,000+ products. Fallback database search provides zero-dependency resilience.</p>';
        echo '</div>';
        echo '</div>';
    }

    private function render_metric_card(string $label, string $value, string $color): void
    {
        echo '<div style="background:#fff; border-left:4px solid ' . esc_attr($color) . '; padding:16px; border-radius:4px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">';
        echo '<div style="font-size:12px; font-weight:600; text-transform:uppercase; color:#64748b;">' . esc_html($label) . '</div>';
        echo '<div style="font-size:28px; font-weight:700; color:#0f172a; margin-top:4px;">' . esc_html($value) . '</div>';
        echo '</div>';
    }

    public function render_rfqs_page(): void
    {
        global $wpdb;
        $table_rfqs  = Schema::get_table_name(Schema::TABLE_RFQS);
        $table_items = Schema::get_table_name(Schema::TABLE_RFQ_ITEMS);
        $table_files = Schema::get_table_name(Schema::TABLE_RFQ_FILES);

        // Handle single RFQ status update from admin POST
        if (isset($_POST['dp_update_rfq_status']) && check_admin_referer('dp_rfq_action', 'dp_rfq_nonce')) {
            $rfq_id     = (int)$_POST['rfq_id'];
            $new_status = sanitize_text_field($_POST['new_status']);
            $this->plugin->get_rfq()->update_rfq_status($rfq_id, $new_status);
            echo '<div class="notice notice-success is-dismissible"><p>' . esc_html(sprintf(__('RFQ #%d status updated to %s.', 'dhruba-catalog'), $rfq_id, $new_status)) . '</p></div>';
        }

        // Handle RFQ -> WooCommerce Order Conversion from admin POST
        if (isset($_POST['dp_convert_to_wc_order']) && check_admin_referer('dp_rfq_action', 'dp_rfq_nonce')) {
            $rfq_id = (int)$_POST['rfq_id'];
            $res = $this->plugin->get_rfq()->convert_to_wc_order($rfq_id);
            if ($res['success']) {
                echo '<div class="notice notice-success is-dismissible"><p>' . esc_html($res['message']) . '</p></div>';
            } else {
                echo '<div class="notice notice-error is-dismissible"><p>' . esc_html($res['message']) . '</p></div>';
            }
        }

        $view_rfq_number = isset($_GET['rfq']) ? sanitize_text_field($_GET['rfq']) : null;

        if ($view_rfq_number) {
            $detail = $this->plugin->get_rfq()->get_rfq_details($view_rfq_number);
            if (!$detail) {
                echo '<div class="notice notice-error"><p>' . esc_html__('RFQ not found.', 'dhruba-catalog') . '</p></div>';
            } else {
                $r     = $detail['rfq'];
                $items = $detail['items'];
                $files = $detail['files'];

                echo '<div class="wrap">';
                echo '<p><a href="' . esc_url(admin_url('admin.php?page=dhruba-rfqs')) . '" class="button">&larr; ' . esc_html__('Back to All RFQs', 'dhruba-catalog') . '</a></p>';
                echo '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">';
                echo '<h1>' . esc_html(sprintf(__('RFQ: %s', 'dhruba-catalog'), $r['rfq_number'])) . '</h1>';
                echo '<span style="font-size:14px; font-weight:700; background:#f1f5f9; padding:6px 12px; border-radius:4px; border:1px solid #cbd5e1;">Status: ' . esc_html($r['status']) . '</span>';
                echo '</div>';

                echo '<div style="display:grid; grid-template-columns: 2fr 1fr; gap:20px;">';
                
                // Left Column: Items and Files
                echo '<div>';
                echo '<div class="card" style="max-width:100%; padding:16px; margin-bottom:20px;">';
                echo '<h3 style="margin-top:0;">' . esc_html__('Requested Equipment & Line Items', 'dhruba-catalog') . '</h3>';
                echo '<table class="wp-list-table widefat fixed striped">';
                echo '<thead><tr><th>Product / Item</th><th>MPN / SKU</th><th>Qty</th><th>Customer Note</th><th>Quoted Unit Price (BDT)</th></tr></thead>';
                echo '<tbody>';
                if (empty($items)) {
                    echo '<tr><td colspan="5">' . esc_html__('No catalog items. Customer uploaded custom BOQ/drawings.', 'dhruba-catalog') . '</td></tr>';
                } else {
                    foreach ($items as $item) {
                        echo '<tr>';
                        echo '<td><strong>' . esc_html($item['title'] ?: 'Custom Item') . '</strong></td>';
                        echo '<td><code style="font-size:11px;">' . esc_html($item['mpn'] ?: '—') . '</code></td>';
                        echo '<td><strong>' . esc_html((string)$item['quantity']) . '</strong></td>';
                        echo '<td>' . esc_html($item['customer_note'] ?: '—') . '</td>';
                        echo '<td>' . ($item['unit_price'] ? number_format((float)$item['unit_price'], 2) : '<span style="color:#94a3b8;">Pending Quote</span>') . '</td>';
                        echo '</tr>';
                    }
                }
                echo '</tbody></table>';
                echo '</div>';

                // Attached BOQ/BOM Documents
                if (!empty($files)) {
                    echo '<div class="card" style="max-width:100%; padding:16px; margin-bottom:20px;">';
                    echo '<h3 style="margin-top:0;">' . esc_html__('Attached BOQ / Project Drawings', 'dhruba-catalog') . '</h3>';
                    echo '<ul>';
                    foreach ($files as $file) {
                        echo '<li style="margin-bottom:8px;">';
                        echo '📄 <strong>' . esc_html($file['file_name']) . '</strong> (' . round($file['file_size'] / 1024, 1) . ' KB) &bull; ' . esc_html($file['mime_type']);
                        echo '</li>';
                    }
                    echo '</ul>';
                    echo '</div>';
                }

                echo '</div>';

                // Right Column: Client Info & Workflow Actions
                echo '<div>';
                echo '<div class="card" style="max-width:100%; padding:16px; margin-bottom:20px;">';
                echo '<h3 style="margin-top:0;">' . esc_html__('Client & Site Details', 'dhruba-catalog') . '</h3>';
                echo '<p><strong>Company:</strong> ' . esc_html($r['company'] ?: 'Individual / N/A') . '</p>';
                echo '<p><strong>Contact Person:</strong> ' . esc_html($r['contact']) . '</p>';
                echo '<p><strong>Email:</strong> <a href="mailto:' . esc_attr($r['email']) . '">' . esc_html($r['email']) . '</a></p>';
                echo '<p><strong>Phone:</strong> <a href="tel:' . esc_attr($r['phone']) . '">' . esc_html($r['phone']) . '</a></p>';
                if (!empty($r['whatsapp'])) {
                    echo '<p><strong>WhatsApp:</strong> ' . esc_html($r['whatsapp']) . '</p>';
                }
                echo '<p><strong>Delivery Location:</strong> ' . esc_html($r['location'] ?: 'Barishal') . '</p>';
                if (!empty($r['message'])) {
                    echo '<p><strong>Message / Scope:</strong><br><em>' . nl2br(esc_html($r['message'])) . '</em></p>';
                }
                echo '</div>';

                // Actions Card
                echo '<div class="card" style="max-width:100%; padding:16px;">';
                echo '<h3 style="margin-top:0;">' . esc_html__('Quotation Workflow Actions', 'dhruba-catalog') . '</h3>';
                
                // Form 1: Status Change
                echo '<form method="post" style="margin-bottom:16px;">';
                wp_nonce_field('dp_rfq_action', 'dp_rfq_nonce');
                echo '<input type="hidden" name="rfq_id" value="' . (int)$r['id'] . '">';
                echo '<label style="display:block; font-weight:bold; margin-bottom:6px;">' . esc_html__('Change Status:', 'dhruba-catalog') . '</label>';
                echo '<select name="new_status" style="width:100%; margin-bottom:10px;">';
                $statuses = [
                    \DhrubaCatalog\RFQ\RfqService::STATUS_NEW             => 'NEW (Unreviewed)',
                    \DhrubaCatalog\RFQ\RfqService::STATUS_REVIEWING       => 'REVIEWING (Technical Check)',
                    \DhrubaCatalog\RFQ\RfqService::STATUS_MATCHING        => 'MATCHING (Stock & Distributor Check)',
                    \DhrubaCatalog\RFQ\RfqService::STATUS_QUOTED          => 'QUOTED (Price Formalized)',
                    \DhrubaCatalog\RFQ\RfqService::STATUS_CUSTOMER_REVIEW => 'CUSTOMER_REVIEW (Awaiting Approval)',
                    \DhrubaCatalog\RFQ\RfqService::STATUS_ACCEPTED        => 'ACCEPTED (Ready for Procurement)',
                    \DhrubaCatalog\RFQ\RfqService::STATUS_CONVERTED       => 'CONVERTED (Order Generated)',
                    \DhrubaCatalog\RFQ\RfqService::STATUS_REJECTED        => 'REJECTED',
                    \DhrubaCatalog\RFQ\RfqService::STATUS_CLOSED          => 'CLOSED',
                ];
                foreach ($statuses as $st_key => $st_label) {
                    echo '<option value="' . esc_attr($st_key) . '" ' . selected($r['status'], $st_key, false) . '>' . esc_html($st_label) . '</option>';
                }
                echo '</select>';
                echo '<button type="submit" name="dp_update_rfq_status" class="button button-primary" style="width:100%;">' . esc_html__('Update Status', 'dhruba-catalog') . '</button>';
                echo '</form>';

                // WhatsApp Instant Response Button
                $wa_url = \DhrubaCatalog\RFQ\RfqService::build_basket_whatsapp_url($items, $r['rfq_number'], $r['company']);
                echo '<a href="' . esc_url($wa_url) . '" target="_blank" class="button" style="width:100%; text-align:center; background:#22c55e; color:#fff; border-color:#16a34a; font-weight:bold; margin-bottom:12px; display:block; box-sizing:border-box;">💬 ' . esc_html__('Contact Client on WhatsApp', 'dhruba-catalog') . '</a>';

                // Form 2: Convert to WooCommerce Order
                if (empty($r['wc_order_id'])) {
                    echo '<form method="post">';
                    wp_nonce_field('dp_rfq_action', 'dp_rfq_nonce');
                    echo '<input type="hidden" name="rfq_id" value="' . (int)$r['id'] . '">';
                    echo '<button type="submit" name="dp_convert_to_wc_order" class="button button-secondary" style="width:100%; font-weight:bold;" onclick="return confirm(\'Generate official WooCommerce commercial order from this RFQ?\');">' . esc_html__('Convert RFQ &rarr; WooCommerce Order', 'dhruba-catalog') . '</button>';
                    echo '</form>';
                } else {
                    $order_edit_url = admin_url('post.php?post=' . (int)$r['wc_order_id'] . '&action=edit');
                    echo '<div style="background:#ecfdf5; border:1px solid #a7f3d0; padding:10px; border-radius:4px; text-align:center;">';
                    echo '<span style="font-weight:bold; color:#065f46;">✅ ' . esc_html(sprintf(__('Converted to Order #%d', 'dhruba-catalog'), (int)$r['wc_order_id'])) . '</span><br>';
                    echo '<a href="' . esc_url($order_edit_url) . '" style="color:#059669; font-size:12px; font-weight:bold;">' . esc_html__('View WooCommerce Order &rarr;', 'dhruba-catalog') . '</a>';
                    echo '</div>';
                }

                echo '</div>';
                echo '</div>';
                echo '</div>';
                echo '</div>';
                return;
            }
        }

        // Default List View
        $rfqs = $wpdb->get_results("SELECT * FROM {$table_rfqs} ORDER BY created_at DESC LIMIT 50", ARRAY_A);

        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Industrial Quote Requests (RFQs)', 'dhruba-catalog') . '</h1>';
        echo '<table class="wp-list-table widefat fixed striped" style="margin-top:16px;">';
        echo '<thead><tr><th>RFQ Number</th><th>Company</th><th>Contact</th><th>Phone / WhatsApp</th><th>Status</th><th>Order ID</th><th>Date</th><th>Action</th></tr></thead>';
        echo '<tbody>';
        if (empty($rfqs)) {
            echo '<tr><td colspan="8">' . esc_html__('No RFQs recorded yet.', 'dhruba-catalog') . '</td></tr>';
        } else {
            foreach ($rfqs as $r) {
                $view_url = admin_url('admin.php?page=dhruba-rfqs&rfq=' . urlencode($r['rfq_number']));
                $status_color = match ($r['status']) {
                    'NEW'             => '#ea580c',
                    'REVIEWING'       => '#0284c7',
                    'QUOTED'          => '#9333ea',
                    'ACCEPTED'        => '#16a34a',
                    'CONVERTED'       => '#059669',
                    'REJECTED'        => '#dc2626',
                    default           => '#64748b'
                };
                echo '<tr>';
                echo '<td><a href="' . esc_url($view_url) . '" style="font-weight:700; font-family:monospace;">' . esc_html($r['rfq_number']) . '</a></td>';
                echo '<td>' . esc_html($r['company'] ?: 'Individual') . '</td>';
                echo '<td>' . esc_html($r['contact']) . '<br><small>' . esc_html($r['email']) . '</small></td>';
                echo '<td>' . esc_html($r['phone']) . '</td>';
                echo '<td><span class="badge" style="background:#fff; border:1px solid ' . esc_attr($status_color) . '; color:' . esc_attr($status_color) . '; padding:3px 8px; border-radius:4px; font-weight:700; font-size:11px;">' . esc_html($r['status']) . '</span></td>';
                echo '<td>' . ($r['wc_order_id'] ? ('<a href="' . esc_url(admin_url('post.php?post=' . (int)$r['wc_order_id'] . '&action=edit')) . '">#' . (int)$r['wc_order_id'] . '</a>') : '—') . '</td>';
                echo '<td>' . esc_html($r['created_at']) . '</td>';
                echo '<td><a href="' . esc_url($view_url) . '" class="button button-small">' . esc_html__('Inspect & Quote', 'dhruba-catalog') . '</a></td>';
                echo '</tr>';
            }
        }
        echo '</tbody></table>';
        echo '</div>';
    }

    public function render_database_page(): void
    {
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'dhruba-catalog'));
        }

        global $wpdb;

        // Handle manual migration trigger
        $message = '';
        if (isset($_POST['dp_trigger_migration']) && check_admin_referer('dp_trigger_migration_action', 'dp_migration_nonce')) {
            $updated = $this->plugin->get_migrator()->run_migrations();
            $message = $updated
                ? '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Database migration executed successfully.', 'dhruba-catalog') . '</p></div>'
                : '<div class="notice notice-info is-dismissible"><p>' . esc_html__('Database schema is already at the latest version.', 'dhruba-catalog') . '</p></div>';
        }

        $installed_version = get_option('dp_catalog_db_version', '0.0.0');
        $last_migrated     = get_option('dp_catalog_db_last_migrated', 'N/A');

        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Custom Tables & Database Migrations', 'dhruba-catalog') . '</h1>';
        echo $message;

        echo '<div class="card" style="max-width:100%; margin-top:20px; padding:20px;">';
        echo '<h2>' . esc_html__('Schema Versioning Status', 'dhruba-catalog') . '</h2>';
        echo '<table class="form-table">';
        echo '<tr><th>' . esc_html__('Code DB Version') . '</th><td><code>' . esc_html(DHRUBA_CATALOG_DB_VERSION) . '</code></td></tr>';
        echo '<tr><th>' . esc_html__('Installed DB Version') . '</th><td><code>' . esc_html($installed_version) . '</code></td></tr>';
        echo '<tr><th>' . esc_html__('Last Migrated') . '</th><td>' . esc_html($last_migrated) . '</td></tr>';
        echo '</table>';

        echo '<form method="post" style="margin-top:15px;">';
        wp_nonce_field('dp_trigger_migration_action', 'dp_migration_nonce');
        echo '<input type="submit" name="dp_trigger_migration" class="button button-primary" value="' . esc_attr__('Run DB Migration / Verify Schema', 'dhruba-catalog') . '" />';
        echo '</form>';
        echo '</div>';

        // Table status list
        echo '<div class="card" style="max-width:100%; margin-top:20px; padding:20px;">';
        echo '<h2>' . esc_html__('Managed High-Performance Tables', 'dhruba-catalog') . '</h2>';
        echo '<table class="wp-list-table widefat fixed striped">';
        echo '<thead><tr><th>Table Name</th><th>Purpose</th><th>Record Count</th><th>Status</th></tr></thead>';
        echo '<tbody>';

        $tables = [
            Schema::TABLE_SPECS       => ['name' => Schema::get_table_name(Schema::TABLE_SPECS), 'purpose' => 'Numeric & string indexed specs for 50k items'],
            Schema::TABLE_DOCUMENTS   => ['name' => Schema::get_table_name(Schema::TABLE_DOCUMENTS), 'purpose' => 'SHA-256 deduplicated datasheets & manuals'],
            Schema::TABLE_RELATIONS   => ['name' => Schema::get_table_name(Schema::TABLE_RELATIONS), 'purpose' => 'Same-series, accessories, replacement links'],
            Schema::TABLE_RFQS        => ['name' => Schema::get_table_name(Schema::TABLE_RFQS), 'purpose' => 'B2B quote requests & state machine'],
            Schema::TABLE_RFQ_ITEMS   => ['name' => Schema::get_table_name(Schema::TABLE_RFQ_ITEMS), 'purpose' => 'Line items for engineering quote requests'],
            Schema::TABLE_RFQ_FILES   => ['name' => Schema::get_table_name(Schema::TABLE_RFQ_FILES), 'purpose' => 'Customer BOQ/BOM project drawings'],
            Schema::TABLE_IMPORT_JOBS => ['name' => Schema::get_table_name(Schema::TABLE_IMPORT_JOBS), 'purpose' => 'Resumable background staging jobs'],
        ];

        foreach ($tables as $t) {
            $table_name = $t['name'];
            $exists     = $wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table_name)) === $table_name;
            $count      = $exists ? (int)$wpdb->get_var("SELECT COUNT(*) FROM `{$table_name}`") : 0;

            echo '<tr>';
            echo '<td><code>' . esc_html($table_name) . '</code></td>';
            echo '<td>' . esc_html($t['purpose']) . '</td>';
            echo '<td>' . ($exists ? number_format($count) : '—') . '</td>';
            echo '<td>' . ($exists ? '<span style="color:#16a34a; font-weight:600;">ACTIVE</span>' : '<span style="color:#dc2626; font-weight:600;">MISSING</span>') . '</td>';
            echo '</tr>';
        }

        echo '</tbody></table>';
        echo '</div>';

        echo '</div>';
    }

    public function render_settings_page(): void
    {
        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Dhruba Catalog Platform Settings', 'dhruba-catalog') . '</h1>';
        echo '<form method="post" action="options.php">';
        settings_fields('dp_settings_group');
        do_settings_sections('dp_settings_group');
        echo '<table class="form-table">';
        echo '<tr><th scope="row">WhatsApp Hotline</th><td><input type="text" name="dp_whatsapp_number" value="' . esc_attr(get_option('dp_whatsapp_number', '+8801700000000')) . '" class="regular-text" /><p class="description">Used for 1-click WhatsApp quote requests with pre-filled MPN & model.</p></td></tr>';
        echo '<tr><th scope="row">Meilisearch Host URL</th><td><input type="url" name="dp_meilisearch_host" value="' . esc_attr(get_option('dp_meilisearch_host', 'http://127.0.0.1:7700')) . '" class="regular-text" /><p class="description">E.g. http://127.0.0.1:7700</p></td></tr>';
        echo '<tr><th scope="row">Meilisearch Master API Key</th><td><input type="password" name="dp_meilisearch_key" value="' . esc_attr(get_option('dp_meilisearch_key', '')) . '" class="regular-text" /></td></tr>';
        echo '<tr><th scope="row">ETL Importer Secret Key</th><td><input type="password" name="dp_importer_secret" value="' . esc_attr(get_option('dp_importer_secret', '')) . '" class="regular-text" /><p class="description">Secret token used by the external Python crawler to push validated products into WordPress.</p></td></tr>';
        echo '</table>';
        submit_button();
        echo '</form></div>';
    }
}
