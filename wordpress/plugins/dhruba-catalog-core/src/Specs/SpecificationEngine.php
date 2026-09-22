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
     * Set or update a specification entry idempotently
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

        // Check existing
        $existing = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT id FROM {$table} WHERE product_id = %d AND spec_key = %s",
                $product_id,
                $spec_key
            )
        );

        $data = [
            'product_id'       => $product_id,
            'spec_key'         => sanitize_key($spec_key),
            'label'            => sanitize_text_field($label),
            'value_text'       => sanitize_text_field($parsed['value_text']),
            'value_numeric'    => $parsed['value_numeric'],
            'unit'             => sanitize_text_field($parsed['unit']),
            'normalized_value' => sanitize_text_field($parsed['normalized_value']),
            'source_url'       => esc_url_raw($source_url),
            'source_type'      => sanitize_key($source_type),
            'sort_order'       => $sort_order,
        ];

        if ($existing) {
            return (bool)$wpdb->update($table, $data, ['id' => $existing]);
        }

        return (bool)$wpdb->insert($table, $data);
    }

    /**
     * Batch import specs for high-speed ETL imports
     */
    public function batch_set_specs(int $product_id, array $specs): void
    {
        foreach ($specs as $index => $spec) {
            $key = $spec['key'] ?? sanitize_key($spec['label']);
            $this->set_spec(
                $product_id,
                $key,
                $spec['label'],
                (string)$spec['value'],
                $spec['unit'] ?? '',
                $spec['source_url'] ?? '',
                $spec['source_type'] ?? 'etl',
                $spec['sort_order'] ?? $index
            );
        }
    }
}
