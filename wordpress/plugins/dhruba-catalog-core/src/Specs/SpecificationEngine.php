<?php
/**
 * Custom Technical Specification Engine for Dhruba Catalog
 *
 * Implements high-performance indexed spec storage in wp_dp_specs.
 * Separates raw manufacturer text from normalized numeric values and units.
 * Supports category-aware specification dictionaries for EEE, CCTV, and Solar.
 *
 * @package DhrubaCatalog\Specs
 */

declare(strict_types=1);

namespace DhrubaCatalog\Specs;

use DhrubaCatalog\Database\Schema;

final class SpecificationEngine
{
    /**
     * Standardized attribute dictionary with categories and units
     */
    public const ATTRIBUTE_DICTIONARY = [
        // EEE Specs
        'rated_current' => [
            'label' => 'Rated Current',
            'unit' => 'A',
            'category' => 'eee',
            'is_numeric' => true,
        ],
        'rated_voltage' => [
            'label' => 'Rated Voltage',
            'unit' => 'V',
            'category' => 'eee',
            'is_numeric' => true,
        ],
        'breaking_capacity' => [
            'label' => 'Breaking Capacity',
            'unit' => 'kA',
            'category' => 'eee',
            'is_numeric' => true,
        ],
        'poles' => [
            'label' => 'Poles',
            'unit' => 'P',
            'category' => 'eee',
            'is_numeric' => true,
        ],
        'trip_curve' => [
            'label' => 'Trip Curve',
            'unit' => '',
            'category' => 'eee',
            'is_numeric' => false,
        ],
        'frequency' => [
            'label' => 'Frequency',
            'unit' => 'Hz',
            'category' => 'eee',
            'is_numeric' => true,
        ],
        'phase' => [
            'label' => 'Phase',
            'unit' => '',
            'category' => 'eee',
            'is_numeric' => false,
        ],
        'ip_rating' => [
            'label' => 'IP Rating',
            'unit' => '',
            'category' => 'common',
            'is_numeric' => false,
        ],

        // CCTV Specs
        'camera_type' => [
            'label' => 'Camera Type',
            'unit' => '',
            'category' => 'cctv',
            'is_numeric' => false,
        ],
        'resolution' => [
            'label' => 'Resolution',
            'unit' => 'MP',
            'category' => 'cctv',
            'is_numeric' => true,
        ],
        'lens' => [
            'label' => 'Lens Focal Length',
            'unit' => 'mm',
            'category' => 'cctv',
            'is_numeric' => true,
        ],
        'ir_range' => [
            'label' => 'IR Range',
            'unit' => 'm',
            'category' => 'cctv',
            'is_numeric' => true,
        ],
        'poe_support' => [
            'label' => 'PoE Support',
            'unit' => '',
            'category' => 'cctv',
            'is_numeric' => false,
        ],
        'ai_analytics' => [
            'label' => 'AI Analytics',
            'unit' => '',
            'category' => 'cctv',
            'is_numeric' => false,
        ],

        // Solar Specs
        'rated_power' => [
            'label' => 'Rated Power',
            'unit' => 'kW',
            'category' => 'solar',
            'is_numeric' => true,
        ],
        'max_pv_power' => [
            'label' => 'Maximum PV Power',
            'unit' => 'Wp',
            'category' => 'solar',
            'is_numeric' => true,
        ],
        'mppt_voltage_range' => [
            'label' => 'MPPT Voltage Range',
            'unit' => 'V',
            'category' => 'solar',
            'is_numeric' => false,
        ],
        'mppt_count' => [
            'label' => 'MPPT Trackers',
            'unit' => '',
            'category' => 'solar',
            'is_numeric' => true,
        ],
        'battery_chemistry' => [
            'label' => 'Battery Chemistry',
            'unit' => '',
            'category' => 'solar',
            'is_numeric' => false,
        ],
        'efficiency' => [
            'label' => 'Max Efficiency',
            'unit' => '%',
            'category' => 'solar',
            'is_numeric' => true,
        ],
    ];

    /**
     * Parse raw string value into numeric magnitude, unit, and normalized string
     * e.g. "20 A" -> [20.0, "A", "20 A"]
     * e.g. "6 kA" -> [6.0, "kA", "6 kA"]
     */
    public static function parse_spec_value(string $raw_value, string $default_unit = ''): array
    {
        $trimmed = trim($raw_value);
        $numeric = null;
        $unit = $default_unit;

        if (preg_match('/^([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z%]+)?$/', $trimmed, $matches)) {
            $numeric = (float)$matches[1];
            if (!empty($matches[2])) {
                $unit = $matches[2];
            }
        }

        $normalized = $numeric !== null ? ($unit ? "{$numeric} {$unit}" : (string)$numeric) : $trimmed;

        return [
            'value_text'       => $trimmed,
            'value_numeric'    => $numeric,
            'unit'             => $unit,
            'normalized_value' => $normalized,
        ];
    }

    /**
     * Get all specs for a product ordered by sort_order
     */
    public function get_product_specs(int $product_id): array
    {
        global $wpdb;
        $table = Schema::get_table_name(Schema::TABLE_SPECS);

        $results = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT spec_key, label, value_text, value_numeric, unit, normalized_value, source_url, source_type, sort_order 
                 FROM {$table} 
                 WHERE product_id = %d 
                 ORDER BY sort_order ASC, label ASC",
                $product_id
            ),
            ARRAY_A
        );

        return $results ?: [];
    }

    /**
     * Set or update a specification entry idempotently using atomic UPSERT
     */
    public function set_spec(
        int $product_id,
        string $spec_key,
        string $label,
        string $raw_value,
        string $unit = '',
        string $source_url = '',
        string $source_type = 'manual',
        int $sort_order = 0
    ): bool {
        global $wpdb;
        $table = Schema::get_table_name(Schema::TABLE_SPECS);

        $parsed = self::parse_spec_value($raw_value, $unit);
        $clean_key = sanitize_key($spec_key);
        $clean_label = sanitize_text_field($label);
        $clean_text = sanitize_text_field($parsed['value_text']);
        $numeric_val = $parsed['value_numeric'];
        $clean_unit = sanitize_text_field($parsed['unit']);
        $clean_norm = sanitize_text_field($parsed['normalized_value']);
        $clean_url = esc_url_raw($source_url);
        $clean_src = sanitize_key($source_type);

        $sql = "INSERT INTO `{$table}` 
                (product_id, spec_key, label, value_text, value_numeric, unit, normalized_value, source_url, source_type, sort_order)
                VALUES (%d, %s, %s, %s, %s, %s, %s, %s, %s, %d)
                ON DUPLICATE KEY UPDATE 
                label = VALUES(label),
                value_text = VALUES(value_text),
                value_numeric = VALUES(value_numeric),
                unit = VALUES(unit),
                normalized_value = VALUES(normalized_value),
                source_url = VALUES(source_url),
                source_type = VALUES(source_type),
                sort_order = VALUES(sort_order)";

        $res = $wpdb->query($wpdb->prepare(
            $sql,
            $product_id,
            $clean_key,
            $clean_label,
            $clean_text,
            $numeric_val,
            $clean_unit,
            $clean_norm,
            $clean_url,
            $clean_src,
            $sort_order
        ));

        return $res !== false;
    }

    /**
     * Batch import specs for high-speed ETL imports (Single multi-row query, eliminates N+1 queries)
     */
    public function batch_set_specs(int $product_id, array $specs): void
    {
        if (empty($specs)) {
            return;
        }

        global $wpdb;
        $table = Schema::get_table_name(Schema::TABLE_SPECS);

        $placeholders = [];
        $values = [];

        foreach ($specs as $index => $spec) {
            $key = $spec['key'] ?? sanitize_key($spec['label']);
            $parsed = self::parse_spec_value((string)$spec['value'], $spec['unit'] ?? '');

            $placeholders[] = "(%d, %s, %s, %s, %s, %s, %s, %s, %s, %d)";
            $values[] = $product_id;
            $values[] = sanitize_key($key);
            $values[] = sanitize_text_field($spec['label']);
            $values[] = sanitize_text_field($parsed['value_text']);
            $values[] = $parsed['value_numeric'];
            $values[] = sanitize_text_field($parsed['unit']);
            $values[] = sanitize_text_field($parsed['normalized_value']);
            $values[] = esc_url_raw($spec['source_url'] ?? '');
            $values[] = sanitize_key($spec['source_type'] ?? 'etl');
            $values[] = (int)($spec['sort_order'] ?? $index);
        }

        $sql = "INSERT INTO `{$table}` 
                (product_id, spec_key, label, value_text, value_numeric, unit, normalized_value, source_url, source_type, sort_order)
                VALUES " . implode(', ', $placeholders) . "
                ON DUPLICATE KEY UPDATE 
                label = VALUES(label),
                value_text = VALUES(value_text),
                value_numeric = VALUES(value_numeric),
                unit = VALUES(unit),
                normalized_value = VALUES(normalized_value),
                source_url = VALUES(source_url),
                source_type = VALUES(source_type),
                sort_order = VALUES(sort_order)";

        $wpdb->query($wpdb->prepare($sql, $values));
    }
}
