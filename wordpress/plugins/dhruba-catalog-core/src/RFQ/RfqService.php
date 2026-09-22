<?php
/**
 * Request For Quote (RFQ) Service & State Machine
 *
 * Implements industrial quote workflow, RFQ basket management,
 * BOQ attachment processing, and WhatsApp message generation.
 *
 * @package DhrubaCatalog\RFQ
 */

declare(strict_types=1);

namespace DhrubaCatalog\RFQ;

use DhrubaCatalog\Database\Schema;
use DhrubaCatalog\Product\ProductMetaManager;

final class RfqService
{
    public const STATUS_NEW             = 'NEW';
    public const STATUS_REVIEWING       = 'REVIEWING';
    public const STATUS_MATCHING        = 'MATCHING';
    public const STATUS_QUOTED          = 'QUOTED';
    public const STATUS_CUSTOMER_REVIEW = 'CUSTOMER_REVIEW';
    public const STATUS_ACCEPTED        = 'ACCEPTED';
    public const STATUS_CONVERTED       = 'CONVERTED';
    public const STATUS_REJECTED        = 'REJECTED';
    public const STATUS_CLOSED          = 'CLOSED';

    public function __construct()
    {
        // Hook notification sender to rfq creation
        add_action('dhruba_rfq_created', [RfqNotificationService::class, 'send_rfq_created_notifications'], 10, 4);
    }

    /**
     * Generate structured industrial RFQ reference number: RFQ-YYYYMM-XXXXX
     */
    public static function generate_rfq_number(): string
    {
        $prefix = 'RFQ-' . gmdate('Ym') . '-';
        $random = strtoupper(wp_generate_password(5, false, false));
        return $prefix . $random;
    }

    /**
     * Create a new RFQ entry in database
     */
    public function create_rfq(array $payload, array $items = [], array $files = []): array
    {
        global $wpdb;
        $table_rfqs  = Schema::get_table_name(Schema::TABLE_RFQS);
        $table_items = Schema::get_table_name(Schema::TABLE_RFQ_ITEMS);
        $table_files = Schema::get_table_name(Schema::TABLE_RFQ_FILES);

        $rfq_number = self::generate_rfq_number();
        $user_id    = get_current_user_id() ?: null;
        $guest_token = empty($user_id) ? sanitize_text_field($payload['guest_token'] ?? wp_generate_uuid4()) : null;

        $rfq_data = [
            'rfq_number'   => $rfq_number,
            'user_id'      => $user_id,
            'guest_token'  => $guest_token,
            'company'      => sanitize_text_field($payload['company'] ?? ''),
            'contact'      => sanitize_text_field($payload['contact'] ?? ''),
            'email'        => sanitize_email($payload['email'] ?? ''),
            'phone'        => sanitize_text_field($payload['phone'] ?? ''),
            'whatsapp'     => sanitize_text_field($payload['whatsapp'] ?? ''),
            'location'     => sanitize_text_field($payload['location'] ?? ''),
            'message'      => sanitize_textarea_field($payload['message'] ?? ''),
            'status'       => self::STATUS_NEW,
            'source'       => sanitize_text_field($payload['source'] ?? 'web'),
            'created_at'   => current_time('mysql'),
            'updated_at'   => current_time('mysql'),
        ];

        $wpdb->insert($table_rfqs, $rfq_data);
        $rfq_id = (int)$wpdb->insert_id;

        if ($rfq_id === 0) {
            return ['success' => false, 'message' => __('Failed to insert RFQ record.', 'dhruba-catalog')];
        }

        // Insert line items
        foreach ($items as $item) {
            $product_id = isset($item['product_id']) && $item['product_id'] > 0 ? (int)$item['product_id'] : null;
            $qty        = max(1, (int)($item['quantity'] ?? 1));
            $note       = sanitize_text_field($item['note'] ?? ($item['customer_note'] ?? ''));
            $custom_name= sanitize_text_field($item['custom_name'] ?? ($item['name'] ?? ''));
            $custom_sku = sanitize_text_field($item['custom_sku'] ?? ($item['mpn'] ?? ''));

            $wpdb->insert($table_items, [
                'rfq_id'        => $rfq_id,
                'product_id'    => $product_id,
                'custom_name'   => $custom_name,
                'custom_sku'    => $custom_sku,
                'quantity'      => $qty,
                'customer_note' => $note,
                'created_at'    => current_time('mysql'),
            ]);
        }

        // Process attachments (BOQ/BOM/drawings)
        foreach ($files as $file) {
            $wpdb->insert($table_files, [
                'rfq_id'      => $rfq_id,
                'file_name'   => sanitize_file_name($file['name']),
                'file_path'   => sanitize_text_field($file['path']),
                'mime_type'   => sanitize_mime_type($file['mime']),
                'file_size'   => (int)$file['size'],
                'sha256'      => sanitize_text_field($file['sha256'] ?? ''),
                'uploaded_at' => current_time('mysql'),
            ]);
        }

        // Trigger Notification Hook
        do_action('dhruba_rfq_created', $rfq_id, $rfq_number, $rfq_data, $items);

        return [
            'success'     => true,
            'rfq_id'      => $rfq_id,
            'rfq_number'  => $rfq_number,
            'guest_token' => $guest_token,
            'message'     => __('Your RFQ has been submitted successfully. A Dhruba Power engineer will contact you shortly.', 'dhruba-catalog')
        ];
    }

    /**
     * Retrieve complete RFQ record by ID or Number including line items and attachments
     */
    public function get_rfq_details(int|string $identifier): ?array
    {
        global $wpdb;
        $table_rfqs  = Schema::get_table_name(Schema::TABLE_RFQS);
        $table_items = Schema::get_table_name(Schema::TABLE_RFQ_ITEMS);
        $table_files = Schema::get_table_name(Schema::TABLE_RFQ_FILES);

        if (is_numeric($identifier)) {
            $rfq = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table_rfqs} WHERE id = %d", (int)$identifier), ARRAY_A);
        } else {
            $rfq = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table_rfqs} WHERE rfq_number = %s", sanitize_text_field($identifier)), ARRAY_A);
        }

        if (!$rfq) {
            return null;
        }

        $rfq_id = (int)$rfq['id'];
        $items = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$table_items} WHERE rfq_id = %d ORDER BY id ASC", $rfq_id), ARRAY_A);
        $files = $wpdb->get_results($wpdb->prepare("SELECT id, file_name, mime_type, file_size, uploaded_at FROM {$table_files} WHERE rfq_id = %d", $rfq_id), ARRAY_A);

        // Enrich items with catalog post titles & MPN if product_id exists
        foreach ($items as &$item) {
            if (!empty($item['product_id'])) {
                $post = get_post((int)$item['product_id']);
                if ($post) {
                    $item['title'] = $post->post_title;
                    $item['mpn']   = get_post_meta((int)$item['product_id'], ProductMetaManager::META_MPN, true) ?: '';
                    $item['url']   = get_permalink((int)$item['product_id']);
                }
            } else {
                $item['title'] = $item['custom_name'];
                $item['mpn']   = $item['custom_sku'];
                $item['url']   = null;
            }
        }
        unset($item);

        return [
            'rfq'   => $rfq,
            'items' => $items,
            'files' => $files,
        ];
    }

    /**
     * Retrieve RFQ History for a logged-in user or guest token
     */
    public function get_user_rfq_history(?int $user_id = null, ?string $guest_token = null, int $limit = 20): array
    {
        global $wpdb;
        $table_rfqs = Schema::get_table_name(Schema::TABLE_RFQS);

        if (!empty($user_id) && $user_id > 0) {
            return $wpdb->get_results(
                $wpdb->prepare("SELECT id, rfq_number, company, contact, status, quoted_total, currency, wc_order_id, created_at FROM {$table_rfqs} WHERE user_id = %d ORDER BY created_at DESC LIMIT %d", $user_id, $limit),
                ARRAY_A
            );
        }

        if (!empty($guest_token)) {
            return $wpdb->get_results(
                $wpdb->prepare("SELECT id, rfq_number, company, contact, status, quoted_total, currency, wc_order_id, created_at FROM {$table_rfqs} WHERE guest_token = %s ORDER BY created_at DESC LIMIT %d", sanitize_text_field($guest_token), $limit),
                ARRAY_A
            );
        }

        return [];
    }

    /**
     * Convert an approved RFQ into WooCommerce Order
     */
    public function convert_to_wc_order(int $rfq_id): array
    {
        return WcOrderConverter::convert_rfq_to_order($rfq_id);
    }

    /**
     * Transition RFQ State safely
     */
    public function update_rfq_status(int $rfq_id, string $new_status, ?int $assigned_salesperson = null): bool
    {
        global $wpdb;
        $table_rfqs = Schema::get_table_name(Schema::TABLE_RFQS);

        $allowed_statuses = [
            self::STATUS_NEW,
            self::STATUS_REVIEWING,
            self::STATUS_MATCHING,
            self::STATUS_QUOTED,
            self::STATUS_CUSTOMER_REVIEW,
            self::STATUS_ACCEPTED,
            self::STATUS_CONVERTED,
            self::STATUS_REJECTED,
            self::STATUS_CLOSED,
        ];

        if (!in_array($new_status, $allowed_statuses, true)) {
            return false;
        }

        $update_data = [
            'status'     => $new_status,
            'updated_at' => current_time('mysql'),
        ];

        if ($assigned_salesperson !== null) {
            $update_data['assigned_salesperson'] = $assigned_salesperson;
        }

        $res = $wpdb->update($table_rfqs, $update_data, ['id' => $rfq_id]);

        if ($res !== false) {
            do_action('dhruba_rfq_status_changed', $rfq_id, $new_status);
            return true;
        }

        return false;
    }

    /**
     * Build contextual WhatsApp URL for instant mobile inquiries
     */
    public static function build_whatsapp_url(int $product_id, int $quantity = 1): string
    {
        $whatsapp_number = get_option('dp_whatsapp_number', '+8801700000000');
        $clean_phone     = preg_replace('/[^0-9]/', '', $whatsapp_number);

        $post = get_post($product_id);
        if (!$post) {
            return "https://wa.me/{$clean_phone}";
        }

        $mpn = get_post_meta($product_id, ProductMetaManager::META_MPN, true) ?: $post->post_title;
        $url = get_permalink($product_id);

        $msg  = "Hello Dhruba Power,\n\n";
        $msg .= "I am interested in requesting a quote for:\n";
        $msg .= "Product: " . $post->post_title . "\n";
        $msg .= "MPN: " . $mpn . "\n";
        $msg .= "Quantity: " . $quantity . "\n";
        $msg .= "Link: " . $url . "\n\n";
        $msg .= "Please provide availability and pricing for Barishal / Bangladesh delivery.";

        return "https://wa.me/{$clean_phone}?text=" . rawurlencode($msg);
    }

    /**
     * Build contextual WhatsApp URL for an entire multi-product RFQ Basket or existing RFQ
     */
    public static function build_basket_whatsapp_url(array $items, ?string $rfq_number = null, ?string $company = null): string
    {
        $whatsapp_number = get_option('dp_whatsapp_number', '+8801700000000');
        $clean_phone     = preg_replace('/[^0-9]/', '', $whatsapp_number);

        $msg  = "Hello Dhruba Power Sales Desk,\n\n";
        if ($rfq_number) {
            $msg .= "Regarding RFQ Ref: *" . $rfq_number . "*\n";
        }
        if ($company) {
            $msg .= "Client: " . $company . "\n";
        }
        $msg .= "\nI would like an expedited quotation for the following items:\n";

        $i = 1;
        foreach ($items as $item) {
            $name = $item['name'] ?? ($item['title'] ?? ('Product #' . ($item['product_id'] ?? $i)));
            $mpn  = !empty($item['mpn']) ? " (MPN: " . $item['mpn'] . ")" : "";
            $qty  = $item['quantity'] ?? 1;
            $msg .= "{$i}. {$name}{$mpn} — Qty: {$qty}\n";
            $i++;
        }

        $msg .= "\nPlease confirm stock availability and pricing for delivery to Barishal / site destination.";

        return "https://wa.me/{$clean_phone}?text=" . rawurlencode($msg);
    }
}
