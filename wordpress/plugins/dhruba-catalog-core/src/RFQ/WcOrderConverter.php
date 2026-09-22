<?php
/**
 * WooCommerce Order Converter for Industrial RFQs
 *
 * Bridges the gap between industrial quotes and transactional e-commerce:
 * - Checks WooCommerce availability
 * - Finds or creates matching customer user account
 * - Creates formal WC_Order with custom quoted unit prices & line items
 * - Associates RFQ reference number and company metadata
 * - Transitions RFQ status to CONVERTED
 *
 * @package DhrubaCatalog\RFQ
 */

declare(strict_types=1);

namespace DhrubaCatalog\RFQ;

use DhrubaCatalog\Database\Schema;

final class WcOrderConverter
{
    /**
     * Convert an approved/accepted RFQ into a WooCommerce order
     */
    public static function convert_rfq_to_order(int $rfq_id, ?string $order_status = 'pending'): array
    {
        if (!function_exists('wc_create_order')) {
            return [
                'success' => false,
                'message' => __('WooCommerce is not active. Unable to create transactional order.', 'dhruba-catalog'),
            ];
        }

        global $wpdb;
        $table_rfqs  = Schema::get_table_name(Schema::TABLE_RFQS);
        $table_items = Schema::get_table_name(Schema::TABLE_RFQ_ITEMS);

        $rfq = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table_rfqs} WHERE id = %d", $rfq_id), ARRAY_A);
        if (!$rfq) {
            return [
                'success' => false,
                'message' => __('RFQ record not found.', 'dhruba-catalog'),
            ];
        }

        if (!empty($rfq['wc_order_id'])) {
            return [
                'success' => false,
                'message' => sprintf(__('This RFQ has already been converted to Order #%d.', 'dhruba-catalog'), (int)$rfq['wc_order_id']),
                'order_id'=> (int)$rfq['wc_order_id'],
            ];
        }

        $items = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$table_items} WHERE rfq_id = %d", $rfq_id), ARRAY_A);
        if (empty($items)) {
            return [
                'success' => false,
                'message' => __('RFQ has no line items to convert.', 'dhruba-catalog'),
            ];
        }

        // Determine or create customer
        $user_id = (int)($rfq['user_id'] ?? 0);
        if ($user_id === 0 && !empty($rfq['email'])) {
            $existing_user = get_user_by('email', $rfq['email']);
            if ($existing_user) {
                $user_id = $existing_user->ID;
            }
        }

        // Create the WooCommerce Order
        $order = wc_create_order([
            'customer_id'   => $user_id ?: null,
            'customer_note' => $rfq['message'] ?: ('Created from RFQ: ' . $rfq['rfq_number']),
            'status'        => $order_status ?: 'pending',
        ]);

        if (is_wp_error($order)) {
            return [
                'success' => false,
                'message' => $order->get_error_message(),
            ];
        }

        // Add line items with quoted prices
        foreach ($items as $item) {
            $product_id = (int)($item['product_id'] ?? 0);
            $qty        = max(1, (int)($item['quantity'] ?? 1));
            $unit_price = $item['unit_price'] !== null ? (float)$item['unit_price'] : null;

            if ($product_id > 0 && function_exists('wc_get_product')) {
                $product = wc_get_product($product_id);
                if ($product) {
                    $item_args = [];
                    if ($unit_price !== null) {
                        $item_args['subtotal'] = $unit_price * $qty;
                        $item_args['total']    = $unit_price * $qty;
                    }
                    $order->add_product($product, $qty, $item_args);
                    continue;
                }
            }

            // Custom unlisted product or BOQ line
            $item_name = !empty($item['custom_name']) ? $item['custom_name'] : ('Custom Equipment / MPN: ' . ($item['custom_sku'] ?? 'N/A'));
            $fee_item  = new \WC_Order_Item_Fee();
            $fee_item->set_name($item_name . ' (Qty: ' . $qty . ')');
            $fee_item->set_amount($unit_price !== null ? ($unit_price * $qty) : 0);
            $fee_item->set_total($unit_price !== null ? ($unit_price * $qty) : 0);
            $order->add_item($fee_item);
        }

        // Set Billing and Shipping Address
        $name_parts = explode(' ', trim($rfq['contact']), 2);
        $first_name = $name_parts[0];
        $last_name  = $name_parts[1] ?? '';

        $address = [
            'first_name' => $first_name,
            'last_name'  => $last_name,
            'company'    => $rfq['company'] ?? '',
            'email'      => $rfq['email'],
            'phone'      => $rfq['phone'],
            'address_1'  => $rfq['location'] ?? 'Barishal',
            'city'       => 'Barishal',
            'country'    => 'BD',
        ];

        $order->set_address($address, 'billing');
        $order->set_address($address, 'shipping');

        // Attach custom RFQ meta
        $order->update_meta_data('_dp_source_rfq_number', $rfq['rfq_number']);
        $order->update_meta_data('_dp_source_rfq_id', $rfq_id);
        $order->update_meta_data('_dp_whatsapp', $rfq['whatsapp']);

        $order->calculate_totals();
        $order->save();

        $wc_order_id = $order->get_id();

        // Update RFQ record
        $wpdb->update(
            $table_rfqs,
            [
                'status'       => RfqService::STATUS_CONVERTED,
                'wc_order_id'  => $wc_order_id,
                'converted_at' => current_time('mysql'),
                'updated_at'   => current_time('mysql'),
            ],
            ['id' => $rfq_id]
        );

        do_action('dhruba_rfq_converted_to_order', $rfq_id, $wc_order_id, $rfq);

        return [
            'success'     => true,
            'order_id'    => $wc_order_id,
            'order_number'=> $order->get_order_number(),
            'message'     => sprintf(__('RFQ %s successfully converted to WooCommerce Order #%d.', 'dhruba-catalog'), $rfq['rfq_number'], $wc_order_id),
        ];
    }
}
