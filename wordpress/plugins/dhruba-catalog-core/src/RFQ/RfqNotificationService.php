<?php
/**
 * Industrial Email Notification Engine for RFQ Lifecycle
 *
 * Sends branded, multipart responsive emails to both customer and Dhruba Power sales engineering desk:
 * - Customer Confirmation (with RFQ number, list of requested SKUs, and engineer direct phone)
 * - Internal Sales Alert (priority flagging, technical notes, direct admin quote link, BOQ details)
 * - Status Update Notification (when quote is finalized, ready for review, or converted)
 *
 * @package DhrubaCatalog\RFQ
 */

declare(strict_types=1);

namespace DhrubaCatalog\RFQ;

final class RfqNotificationService
{
    /**
     * Send instant confirmation to customer and notification to sales desk
     */
    public static function send_rfq_created_notifications(int $rfq_id, string $rfq_number, array $rfq_data, array $items): void
    {
        self::send_customer_confirmation($rfq_number, $rfq_data, $items);
        self::send_internal_sales_alert($rfq_number, $rfq_data, $items);
    }

    /**
     * Customer Confirmation Email
     */
    public static function send_customer_confirmation(string $rfq_number, array $rfq_data, array $items): bool
    {
        $to = $rfq_data['email'] ?? '';
        if (empty($to) || !is_email($to)) {
            return false;
        }

        $contact_name = esc_html($rfq_data['contact'] ?? 'Valued Partner');
        $company      = esc_html($rfq_data['company'] ?? '');
        $subject      = sprintf('[Dhruba Power] Quotation Request Acknowledged — %s', $rfq_number);

        $items_html = '';
        foreach ($items as $item) {
            $name = esc_html($item['name'] ?? ('Product #' . ($item['product_id'] ?? '')));
            $qty  = (int)($item['quantity'] ?? 1);
            $note = !empty($item['note']) ? ' (' . esc_html($item['note']) . ')' : '';
            $items_html .= "<li><strong>{$name}</strong> — Qty: {$qty}{$note}</li>";
        }

        if (empty($items_html)) {
            $items_html = '<li>Custom Technical BOM / Project Drawing uploaded</li>';
        }

        $headers = [
            'Content-Type: text/html; charset=UTF-8',
            'From: Dhruba Power Industrial Desk <sales@dhrubapower.com>',
            'Reply-To: sales@dhrubapower.com',
        ];

        $body = "
        <div style=\"font-family:Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px; border:1px solid #e2e8f0; border-radius:8px; color:#1e293b;\">
            <div style=\"border-bottom:3px solid #d97706; padding-bottom:12px; margin-bottom:16px;\">
                <h2 style=\"margin:0; color:#0f172a;\">Dhruba Power Industrial</h2>
                <div style=\"font-size:12px; color:#64748b; text-transform:uppercase; font-weight:700;\">Electrical Switchgear & Automation Distribution • Barishal</div>
            </div>
            
            <p>Dear {$contact_name}" . ($company ? " ({$company})" : "") . ",</p>
            <p>Thank you for requesting an official industrial quotation. We have received your technical requirements and logged your file under reference number:</p>
            
            <div style=\"background:#f8fafc; border:1px solid #cbd5e1; border-left:4px solid #d97706; padding:12px 16px; margin:16px 0; border-radius:4px;\">
                <div style=\"font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;\">Official RFQ Tracking Number</div>
                <div style=\"font-size:22px; font-weight:900; color:#0f172a; font-family:monospace;\">{$rfq_number}</div>
            </div>

            <h4 style=\"margin:16px 0 8px 0; color:#0f172a;\">Requested Line Items:</h4>
            <ul style=\"padding-left:20px; color:#334155; line-height:1.6;\">
                {$items_html}
            </ul>

            <p style=\"font-size:13px; color:#475569;\">
                Our sales engineering desk will review technical specifications, stock availability at our Barishal warehouse and principal distribution channels (ABB, Schneider, Siemens, Chint), and provide a formal price quotation with warranty details within 2-4 business hours.
            </p>

            <div style=\"margin-top:24px; padding-top:16px; border-top:1px solid #e2e8f0; font-size:12px; color:#64748b;\">
                <strong>Need immediate assistance?</strong><br>
                Hotline / WhatsApp: <a href=\"https://wa.me/8801700000000\" style=\"color:#d97706; font-weight:bold;\">+880 1700-000000</a><br>
                Email: <a href=\"mailto:sales@dhrubapower.com\" style=\"color:#d97706;\">sales@dhrubapower.com</a><br>
                Dhruba Power Engineering Works, Barishal, Bangladesh
            </div>
        </div>
        ";

        return wp_mail($to, $subject, $body, $headers);
    }

    /**
     * Internal Notification to Dhruba Power Sales Desk
     */
    public static function send_internal_sales_alert(string $rfq_number, array $rfq_data, array $items): bool
    {
        $sales_email = get_option('admin_email', 'sales@dhrubapower.com');
        $subject     = sprintf('[NEW RFQ ALERT] %s — %s (%s)', $rfq_number, $rfq_data['company'] ?: 'Individual', $rfq_data['contact']);

        $headers = [
            'Content-Type: text/html; charset=UTF-8',
            'From: Dhruba Catalog Bot <no-reply@dhrubapower.com>',
        ];

        $items_count = count($items);
        $contact     = esc_html($rfq_data['contact']);
        $phone       = esc_html($rfq_data['phone']);
        $email       = esc_html($rfq_data['email']);
        $company     = esc_html($rfq_data['company'] ?: 'N/A');
        $location    = esc_html($rfq_data['location'] ?? 'Barishal');
        $message     = nl2br(esc_html($rfq_data['message'] ?? 'None'));
        $admin_url   = admin_url('admin.php?page=dhruba-rfqs&rfq=' . urlencode($rfq_number));

        $body = "
        <div style=\"font-family:Arial, sans-serif; max-width:600px; padding:20px; color:#0f172a;\">
            <h3 style=\"color:#b45309; margin-top:0;\">🔔 New Industrial Quote Request Received</h3>
            <p>A new RFQ has been submitted via Dhruba Power Catalog:</p>
            <table style=\"width:100%; border-collapse:collapse; font-size:13px;\">
                <tr><td style=\"padding:6px; font-weight:bold; width:140px;\">RFQ Number:</td><td style=\"font-family:monospace; font-weight:bold;\">{$rfq_number}</td></tr>
                <tr><td style=\"padding:6px; font-weight:bold;\">Company:</td><td>{$company}</td></tr>
                <tr><td style=\"padding:6px; font-weight:bold;\">Contact Person:</td><td>{$contact}</td></tr>
                <tr><td style=\"padding:6px; font-weight:bold;\">Email:</td><td><a href=\"mailto:{$email}\">{$email}</a></td></tr>
                <tr><td style=\"padding:6px; font-weight:bold;\">Phone:</td><td><a href=\"tel:{$phone}\">{$phone}</a></td></tr>
                <tr><td style=\"padding:6px; font-weight:bold;\">Delivery Site:</td><td>{$location}</td></tr>
                <tr><td style=\"padding:6px; font-weight:bold;\">Catalog Items:</td><td>{$items_count} items in basket</td></tr>
                <tr><td style=\"padding:6px; font-weight:bold;\">Customer Note:</td><td>{$message}</td></tr>
            </table>
            <div style=\"margin:20px 0;\">
                <a href=\"{$admin_url}\" style=\"background:#0f172a; color:#fff; padding:10px 18px; text-decoration:none; border-radius:4px; font-weight:bold; font-size:13px; display:inline-block;\">Open in RFQ Dashboard &rarr;</a>
            </div>
        </div>
        ";

        return wp_mail($sales_email, $subject, $body, $headers);
    }
}
