<?php
/**
 * Database Schema Definitions for Dhruba Catalog Core
 *
 * @package DhrubaCatalog\Database
 */

declare(strict_types=1);

namespace DhrubaCatalog\Database;

final class Schema
{
    public const TABLE_SPECS = 'dp_specs';
    public const TABLE_DOCUMENTS = 'dp_documents';
    public const TABLE_RELATIONS = 'dp_product_relations';
    public const TABLE_RFQS = 'dp_rfqs';
    public const TABLE_RFQ_ITEMS = 'dp_rfq_items';
    public const TABLE_RFQ_FILES = 'dp_rfq_files';
    public const TABLE_IMPORT_JOBS = 'dp_import_jobs';
    public const TABLE_SEARCH_LOGS = 'dp_search_logs';
    public const TABLE_PRODUCT_INDEX = 'dp_product_index';

    /**
     * Get full table name with WordPress prefix
     */
    public static function get_table_name(string $table): string
    {
        global $wpdb;
        return $wpdb->prefix . $table;
    }

    /**
     * Return SQL definitions formatted for dbDelta() execution
     */
    public function get_schema_sql(): array
    {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        $specs_table     = self::get_table_name(self::TABLE_SPECS);
        $docs_table      = self::get_table_name(self::TABLE_DOCUMENTS);
        $relations_table = self::get_table_name(self::TABLE_RELATIONS);
        $rfqs_table      = self::get_table_name(self::TABLE_RFQS);
        $rfq_items_table = self::get_table_name(self::TABLE_RFQ_ITEMS);
        $rfq_files_table = self::get_table_name(self::TABLE_RFQ_FILES);
        $import_table    = self::get_table_name(self::TABLE_IMPORT_JOBS);
        $search_logs_table = self::get_table_name(self::TABLE_SEARCH_LOGS);
        $product_index_table = self::get_table_name(self::TABLE_PRODUCT_INDEX);

        return [
            // 1. Technical Specifications Table (Normalized, Numeric-Searchable for 50k products)
            "CREATE TABLE {$specs_table} (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                product_id bigint(20) unsigned NOT NULL,
                spec_key varchar(64) NOT NULL,
                label varchar(128) NOT NULL,
                value_text text NOT NULL,
                value_numeric decimal(14,4) DEFAULT NULL,
                unit varchar(32) DEFAULT '',
                normalized_value varchar(255) DEFAULT '',
                source_url text DEFAULT NULL,
                source_type varchar(32) DEFAULT 'manual',
                sort_order int(11) DEFAULT 0,
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY  (id),
                UNIQUE KEY uq_prod_spec (product_id, spec_key),
                KEY idx_product_id (product_id),
                KEY idx_spec_key (spec_key),
                KEY idx_spec_numeric (spec_key, value_numeric),
                KEY idx_normalized_val (spec_key, normalized_value(64))
            ) {$charset_collate};",

            // 2. Technical Documents & Datasheets (SHA-256 Deduplicated)
            "CREATE TABLE {$docs_table} (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                product_id bigint(20) unsigned NOT NULL,
                document_type varchar(32) NOT NULL,
                title varchar(255) NOT NULL,
                source_url text NOT NULL,
                local_path text DEFAULT NULL,
                mime_type varchar(64) DEFAULT 'application/pdf',
                file_size bigint(20) unsigned DEFAULT 0,
                sha256 char(64) DEFAULT NULL,
                manufacturer_revision varchar(64) DEFAULT '',
                language varchar(10) DEFAULT 'en',
                last_checked_at datetime DEFAULT NULL,
                is_current tinyint(1) DEFAULT 1,
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY  (id),
                KEY idx_product_id (product_id),
                KEY idx_doc_type (document_type),
                KEY idx_sha256 (sha256),
                KEY idx_is_current (is_current)
            ) {$charset_collate};",

            // 3. Product Relationships (Compatible, Accessory, Replacement, Same-Series, Alternative)
            "CREATE TABLE {$relations_table} (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                source_product_id bigint(20) unsigned NOT NULL,
                target_product_id bigint(20) unsigned NOT NULL,
                relation_type varchar(32) NOT NULL,
                confidence decimal(5,2) DEFAULT 100.00,
                source varchar(32) DEFAULT 'manual',
                sort_order int(11) DEFAULT 0,
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY  (id),
                UNIQUE KEY uq_relation (source_product_id, target_product_id, relation_type),
                KEY idx_source_rel (source_product_id, relation_type),
                KEY idx_target_rel (target_product_id, relation_type)
            ) {$charset_collate};",

            // 4. RFQ Master Table (Industrial Quote Requests)
            "CREATE TABLE {$rfqs_table} (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                rfq_number varchar(32) NOT NULL,
                user_id bigint(20) unsigned DEFAULT NULL,
                guest_token varchar(64) DEFAULT NULL,
                company varchar(191) DEFAULT '',
                contact varchar(128) NOT NULL,
                email varchar(191) NOT NULL,
                phone varchar(32) NOT NULL,
                whatsapp varchar(32) DEFAULT '',
                location varchar(191) DEFAULT '',
                message text DEFAULT NULL,
                status varchar(32) NOT NULL DEFAULT 'NEW',
                assigned_salesperson bigint(20) unsigned DEFAULT NULL,
                quoted_total decimal(14,2) DEFAULT NULL,
                currency varchar(10) DEFAULT 'BDT',
                quotation_valid_until date DEFAULT NULL,
                internal_notes text DEFAULT NULL,
                wc_order_id bigint(20) unsigned DEFAULT NULL,
                converted_at datetime DEFAULT NULL,
                source varchar(32) DEFAULT 'web',
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY  (id),
                UNIQUE KEY uq_rfq_number (rfq_number),
                KEY idx_user_id (user_id),
                KEY idx_guest_token (guest_token),
                KEY idx_status (status),
                KEY idx_wc_order (wc_order_id),
                KEY idx_created_at (created_at),
                KEY idx_email (email)
            ) {$charset_collate};",

            // 5. RFQ Line Items
            "CREATE TABLE {$rfq_items_table} (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                rfq_id bigint(20) unsigned NOT NULL,
                product_id bigint(20) unsigned DEFAULT NULL,
                custom_sku varchar(64) DEFAULT '',
                custom_name varchar(255) DEFAULT '',
                quantity int(11) unsigned NOT NULL DEFAULT 1,
                unit_price decimal(14,2) DEFAULT NULL,
                line_total decimal(14,2) DEFAULT NULL,
                customer_note text DEFAULT NULL,
                engineer_spec_override text DEFAULT NULL,
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY  (id),
                KEY idx_rfq_id (rfq_id),
                KEY idx_product_id (product_id)
            ) {$charset_collate};",

            // 6. RFQ Attachments (BOQ/BOM/Project drawings)
            "CREATE TABLE {$rfq_files_table} (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                rfq_id bigint(20) unsigned NOT NULL,
                file_name varchar(255) NOT NULL,
                file_path text NOT NULL,
                mime_type varchar(64) NOT NULL,
                file_size bigint(20) unsigned NOT NULL,
                sha256 char(64) NOT NULL,
                uploaded_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY  (id),
                KEY idx_rfq_id (rfq_id)
            ) {$charset_collate};",

            // 7. Background Import Jobs & Resumable Staging Pipeline
            "CREATE TABLE {$import_table} (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                job_uuid varchar(64) NOT NULL,
                source varchar(64) NOT NULL,
                status varchar(32) NOT NULL DEFAULT 'PENDING',
                total_items int(11) unsigned DEFAULT 0,
                processed_items int(11) unsigned DEFAULT 0,
                failed_items int(11) unsigned DEFAULT 0,
                error_log longtext DEFAULT NULL,
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY  (id),
                UNIQUE KEY uq_job_uuid (job_uuid),
                KEY idx_status (status)
            ) {$charset_collate};",

            // 8. Zero-Result & Search Analytics Logging Table (For demand sensing & missing catalog identification)
            "CREATE TABLE {$search_logs_table} (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                query varchar(255) NOT NULL,
                normalized_query varchar(255) NOT NULL,
                results_count int(11) unsigned NOT NULL DEFAULT 0,
                filters_json text DEFAULT NULL,
                user_ip varchar(45) DEFAULT '',
                user_agent text DEFAULT NULL,
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY  (id),
                KEY idx_query (query(64)),
                KEY idx_normalized_query (normalized_query(64)),
                KEY idx_results_count (results_count),
                KEY idx_created_at (created_at)
            ) {$charset_collate};",

            // 9. Fast Product Lookup & Search Flat Index (Scalable to 50,000+ products without postmeta table scans)
            "CREATE TABLE {$product_index_table} (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                product_id bigint(20) unsigned NOT NULL,
                normalized_mpn varchar(64) NOT NULL,
                mpn varchar(128) NOT NULL,
                sku varchar(64) NOT NULL,
                mfg_code varchar(128) DEFAULT '',
                brand_slug varchar(64) DEFAULT '',
                series_slug varchar(64) DEFAULT '',
                category_slug varchar(64) DEFAULT '',
                title varchar(255) NOT NULL,
                thumbnail_url text DEFAULT NULL,
                is_in_stock tinyint(1) NOT NULL DEFAULT 1,
                specs_json longtext DEFAULT NULL,
                updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY  (id),
                UNIQUE KEY uq_product_id (product_id),
                UNIQUE KEY uq_norm_mpn (normalized_mpn),
                KEY idx_mpn (mpn),
                KEY idx_sku (sku),
                KEY idx_brand_series (brand_slug, series_slug),
                KEY idx_stock (is_in_stock)
            ) {$charset_collate};"
        ];
    }

    /**
     * Get all managed custom tables
     *
     * @return string[]
     */
    public static function get_all_tables(): array
    {
        return [
            self::get_table_name(self::TABLE_SPECS),
            self::get_table_name(self::TABLE_DOCUMENTS),
            self::get_table_name(self::TABLE_RELATIONS),
            self::get_table_name(self::TABLE_RFQS),
            self::get_table_name(self::TABLE_RFQ_ITEMS),
            self::get_table_name(self::TABLE_RFQ_FILES),
            self::get_table_name(self::TABLE_IMPORT_JOBS),
            self::get_table_name(self::TABLE_SEARCH_LOGS),
            self::get_table_name(self::TABLE_PRODUCT_INDEX),
        ];
    }

    /**
     * Drop all custom tables (Used strictly during plugin uninstall or automated test teardown)
     */
    public static function drop_tables(): void
    {
        global $wpdb;
        foreach (self::get_all_tables() as $table) {
            $wpdb->query("DROP TABLE IF EXISTS `{$table}`");
        }
    }
}
