<?php
/**
 * Industrial BOM/BOQ Data Model & Excel/CSV Parser Interface
 *
 * Handles customer and project Bill of Materials (BOM) / Bill of Quantities (BOQ),
 * line item extraction, manufacturer code parsing, and staging for quotation conversion.
 *
 * @package DhrubaCatalog\RFQ
 */

declare(strict_types=1);

namespace DhrubaCatalog\RFQ;

final class BoqModel
{
    /**
     * Structure of an individual normalized BOM/BOQ line item
     */
    public static function create_line_item(
        ?int $product_id,
        string $item_description,
        int $quantity,
        string $mpn = '',
        string $brand = '',
        string $unit = 'PCS',
        ?float $estimated_unit_price = null,
        string $technical_notes = ''
    ): array {
        return [
            'product_id'           => $product_id,
            'description'          => sanitize_text_field($item_description),
            'quantity'             => max(1, $quantity),
            'mpn'                  => strtoupper(sanitize_text_field($mpn)),
            'brand'                => sanitize_text_field($brand),
            'unit'                 => sanitize_text_field($unit),
            'estimated_unit_price' => $estimated_unit_price,
            'technical_notes'      => sanitize_text_field($technical_notes),
        ];
    }

    /**
     * Parses structured CSV or plaintext tender schedule lines into BOQ line items
     * Format expected: Description, Quantity, MPN/Model, Brand, Unit
     */
    public static function parse_raw_text_boq(string $text_content): array
    {
        $lines = preg_split('/\r\n|\r|\n/', trim($text_content));
        $items = [];

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || str_starts_with($line, '#')) {
                continue;
            }

            // CSV or Tab-delimited split
            $parts = str_contains($line, "\t") ? explode("\t", $line) : str_getcsv($line);
            if (empty($parts[0])) {
                continue;
            }

            $desc = trim($parts[0]);
            $qty  = isset($parts[1]) ? (int)preg_replace('/[^0-9]/', '', $parts[1]) : 1;
            $mpn  = isset($parts[2]) ? trim($parts[2]) : '';
            $brand = isset($parts[3]) ? trim($parts[3]) : '';
            $unit  = isset($parts[4]) ? trim($parts[4]) : 'PCS';

            $items[] = self::create_line_item(
                null,
                $desc,
                max(1, $qty),
                $mpn,
                $brand,
                $unit
            );
        }

        return $items;
    }
}
