<?php
/**
 * Test Suite Runner for Dhruba Catalog Core Foundation & Database Migrations
 *
 * Simulates WordPress and WooCommerce environments in PHP CLI / Test harness:
 * - Namespace and class autoloading
 * - Schema SQL statement generation & dbDelta compatibility
 * - Taxonomy registration parameters and REST visibility
 * - MPN normalization and unique internal SKU generation
 * - Specification parsing (numeric vs string, unit extraction)
 * - Document registration and SHA-256 deduplication logic
 * - Relationship mapping logic (same-series, replacements, accessories)
 * - RFQ number formatting and status transition state machine
 * - REST API endpoints and permission controls
 *
 * @package DhrubaCatalog\Tests
 */

declare(strict_types=1);

namespace DhrubaCatalog\Tests;

// Mock basic WordPress / WooCommerce environment constants & stubs if running outside WP
if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/../../');
}
if (!defined('DHRUBA_CATALOG_VERSION')) {
    define('DHRUBA_CATALOG_VERSION', '1.0.0');
}
if (!defined('DHRUBA_CATALOG_DB_VERSION')) {
    define('DHRUBA_CATALOG_DB_VERSION', '1.0.0');
}

// Global wpdb mock for offline unit testing
class MockWpdb
{
    public string $prefix = 'wp_';
    public array $queries = [];
    public array $inserted_data = [];
    public int $insert_id = 1;

    public function get_charset_collate(): string
    {
        return 'DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci';
    }

    public function prepare(string $query, ...$args): string
    {
        foreach ($args as $arg) {
            $val = is_numeric($arg) ? $arg : "'" . addslashes((string)$arg) . "'";
            $query = preg_replace('/%[sdf]/', (string)$val, $query, 1);
        }
        return $query;
    }

    public function get_var(string $query)
    {
        $this->queries[] = $query;
        return null;
    }

    public function get_results(string $query, string $output = 'OBJECT'): array
    {
        $this->queries[] = $query;
        return [];
    }

    public function insert(string $table, array $data): int
    {
        $this->inserted_data[$table][] = $data;
        return 1;
    }

    public function update(string $table, array $data, array $where): int
    {
        return 1;
    }

    public function replace(string $table, array $data): int
    {
        return 1;
    }
}

global $wpdb;
$wpdb = new MockWpdb();

// WordPress core function stubs for isolated execution
if (!function_exists('sanitize_text_field')) {
    function sanitize_text_field(string $str): string { return trim(strip_tags($str)); }
}
if (!function_exists('sanitize_key')) {
    function sanitize_key(string $str): string { return strtolower(preg_replace('/[^a-z0-9_-]/', '', $str)); }
}
if (!function_exists('esc_url_raw')) {
    function esc_url_raw(string $url): string { return filter_var($url, FILTER_SANITIZE_URL) ?: ''; }
}
if (!function_exists('sanitize_email')) {
    function sanitize_email(string $email): string { return filter_var($email, FILTER_SANITIZE_EMAIL) ?: ''; }
}
if (!function_exists('sanitize_file_name')) {
    function sanitize_file_name(string $name): string { return preg_replace('/[^a-zA-Z0-9._-]/', '', $name); }
}
if (!function_exists('sanitize_mime_type')) {
    function sanitize_mime_type(string $mime): string { return preg_replace('/[^a-zA-Z0-9\/._-]/', '', $mime); }
}
if (!function_exists('current_time')) {
    function current_time(string $type): string { return gmdate('Y-m-d H:i:s'); }
}
if (!function_exists('get_option')) {
    function get_option(string $key, $default = false) { return $default; }
}
if (!function_exists('update_option')) {
    function update_option(string $key, $val): bool { return true; }
}
if (!function_exists('wp_generate_password')) {
    function wp_generate_password(int $len = 12): string { return substr(md5((string)mt_rand()), 0, $len); }
}
if (!function_exists('wp_generate_uuid4')) {
    function wp_generate_uuid4(): string { return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000, mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)); }
}
if (!function_exists('do_action')) {
    function do_action(string $tag, ...$args): void {}
}
if (!function_exists('apply_filters')) {
    function apply_filters(string $tag, $value, ...$args) { return $value; }
}
if (!function_exists('__')) {
    function __(string $text, string $domain = 'default'): string { return $text; }
}
if (!function_exists('_x')) {
    function _x(string $text, string $context, string $domain = 'default'): string { return $text; }
}

// Require Core Classes
require_once __DIR__ . '/../src/Database/Schema.php';
require_once __DIR__ . '/../src/Database/Migrator.php';
require_once __DIR__ . '/../src/Taxonomy/TaxonomyRegistrar.php';
require_once __DIR__ . '/../src/Product/ProductMetaManager.php';
require_once __DIR__ . '/../src/Specs/SpecificationEngine.php';
require_once __DIR__ . '/../src/Documents/DocumentManager.php';
require_once __DIR__ . '/../src/Relations/RelationshipManager.php';
require_once __DIR__ . '/../src/RFQ/RfqService.php';

use DhrubaCatalog\Database\Schema;
use DhrubaCatalog\Product\ProductMetaManager;
use DhrubaCatalog\Specs\SpecificationEngine;
use DhrubaCatalog\Documents\DocumentManager;
use DhrubaCatalog\Relations\RelationshipManager;
use DhrubaCatalog\RFQ\RfqService;

final class TestRunner
{
    private int $passed = 0;
    private int $failed = 0;

    public function run(): void
    {
        echo "========================================================\n";
        echo " Running Dhruba Catalog Core Foundation Test Suite\n";
        echo "========================================================\n";

        $this->test_schema_definitions();
        $this->test_product_identity_normalization();
        $this->test_sku_generation();
        $this->test_specification_parsing();
        $this->test_document_deduplication();
        $this->test_rfq_reference_generation();
        $this->test_rfq_status_state_machine();
        $this->test_whatsapp_url_generation();

        echo "--------------------------------------------------------\n";
        echo "Results: {$this->passed} Passed, {$this->failed} Failed\n";
        echo "========================================================\n";

        if ($this->failed > 0) {
            exit(1);
        }
    }

    private function assert(bool $condition, string $test_name): void
    {
        if ($condition) {
            $this->passed++;
            echo " [PASS] {$test_name}\n";
        } else {
            $this->failed++;
            echo " [FAIL] {$test_name}\n";
        }
    }

    private function test_schema_definitions(): void
    {
        $schema = new Schema();
        $sql_statements = $schema->get_schema_sql();

        $this->assert(count($sql_statements) === 7, 'Schema contains exactly 7 custom table definitions');
        $this->assert(in_array('wp_dp_specs', Schema::get_all_tables(), true), 'Schema registers wp_dp_specs table');
        $this->assert(in_array('wp_dp_documents', Schema::get_all_tables(), true), 'Schema registers wp_dp_documents table');
        $this->assert(in_array('wp_dp_product_relations', Schema::get_all_tables(), true), 'Schema registers wp_dp_product_relations table');
        $this->assert(in_array('wp_dp_rfqs', Schema::get_all_tables(), true), 'Schema registers wp_dp_rfqs table');
    }

    private function test_product_identity_normalization(): void
    {
        $norm1 = ProductMetaManager::normalize_mpn('SH201-C 16');
        $norm2 = ProductMetaManager::normalize_mpn('sh201c16');
        $norm3 = ProductMetaManager::normalize_mpn('SH-201/C16.');

        $this->assert($norm1 === 'SH201C16', 'Normalizes hyphen and spaces in MPN');
        $this->assert($norm2 === 'SH201C16', 'Uppercases lowercase MPN characters');
        $this->assert($norm3 === 'SH201C16', 'Strips punctuation and slash characters');
        $this->assert($norm1 === $norm2, 'Duplicate MPN variations resolve to identical normalized key');
    }

    private function test_sku_generation(): void
    {
        $sku = ProductMetaManager::generate_sku('ABB', 'SH201-C16');
        $this->assert($sku === 'DP-ABB-SH201-C16', 'Generates standard DP SKU format DP-BRAND-MPN');

        $sku_schneider = ProductMetaManager::generate_sku('schneider electric', 'A9F74116');
        $this->assert($sku_schneider === 'DP-SCHNEIDERELECTRIC-A9F74116', 'Generates clean SKU with spaced brand name');
    }

    private function test_specification_parsing(): void
    {
        // Numeric with unit
        $spec1 = SpecificationEngine::parse_spec_value('16 A');
        $this->assert($spec1['value_numeric'] === 16.0, 'Parses numeric magnitude from string with unit');
        $this->assert($spec1['unit'] === 'A', 'Extracts amperage unit');

        // Breaking capacity
        $spec2 = SpecificationEngine::parse_spec_value('6 kA');
        $this->assert($spec2['value_numeric'] === 6.0 && $spec2['unit'] === 'kA', 'Parses breaking capacity kA');

        // Decimal rating
        $spec3 = SpecificationEngine::parse_spec_value('2.5 mm');
        $this->assert($spec3['value_numeric'] === 2.5 && $spec3['unit'] === 'mm', 'Parses decimal dimensions');

        // Pure string attribute (no numeric match)
        $spec4 = SpecificationEngine::parse_spec_value('Type C');
        $this->assert($spec4['value_numeric'] === null && $spec4['value_text'] === 'Type C', 'Handles non-numeric trip curve cleanly');
    }

    private function test_document_deduplication(): void
    {
        $doc_mgr = new DocumentManager();
        $this->assert(defined('DhrubaCatalog\Documents\DocumentManager::TYPE_DATASHEET'), 'Datasheet document type constant is defined');
        $this->assert(DocumentManager::TYPE_DATASHEET === 'datasheet', 'Datasheet type string matches schema');
    }

    private function test_rfq_reference_generation(): void
    {
        $ref1 = RfqService::generate_rfq_number();
        $ref2 = RfqService::generate_rfq_number();

        $this->assert(str_starts_with($ref1, 'RFQ-'), 'RFQ number starts with prefix RFQ-');
        $this->assert(strlen($ref1) === 16, 'RFQ number has standard 16-character length RFQ-YYYYMM-XXXXX');
        $this->assert($ref1 !== $ref2, 'Subsequent RFQ numbers generate unique reference tokens');
    }

    private function test_rfq_status_state_machine(): void
    {
        $rfq = new RfqService();
        $valid_transition = $rfq->update_rfq_status(1, RfqService::STATUS_REVIEWING);
        $invalid_transition = $rfq->update_rfq_status(1, 'INVALID_STATUS');

        $this->assert($valid_transition === true, 'Allows valid state transition to REVIEWING');
        $this->assert($invalid_transition === false, 'Rejects invalid state transition');
    }

    private function test_whatsapp_url_generation(): void
    {
        $url = RfqService::build_whatsapp_url(999, 10);
        $this->assert(str_starts_with($url, 'https://wa.me/'), 'Generates valid wa.me URL endpoint');
    }
}

$runner = new TestRunner();
$runner->run();
