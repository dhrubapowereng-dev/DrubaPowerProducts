<?php
/**
 * Database Migrator for Dhruba Catalog Core
 *
 * @package DhrubaCatalog\Database
 */

declare(strict_types=1);

namespace DhrubaCatalog\Database;

final class Migrator
{
    private Schema $schema;

    public function __construct(Schema $schema)
    {
        $this->schema = $schema;
    }

    /**
     * Run migrations safely using WordPress dbDelta and record migration log
     */
    public function run_migrations(): bool
    {
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $installed_version = get_option('dp_catalog_db_version', '0.0.0');

        if (version_compare($installed_version, DHRUBA_CATALOG_DB_VERSION, '<')) {
            $sql_statements = $this->schema->get_schema_sql();

            foreach ($sql_statements as $sql) {
                dbDelta($sql);
            }

            // Run incremental schema patches if upgrading from older versions
            $this->apply_incremental_upgrades($installed_version);

            update_option('dp_catalog_db_version', DHRUBA_CATALOG_DB_VERSION);
            update_option('dp_catalog_db_last_migrated', current_time('mysql'));

            do_action('dhruba_catalog_database_migrated', DHRUBA_CATALOG_DB_VERSION, $installed_version);
            return true;
        }

        return false;
    }

    /**
     * Execute version-specific delta patches
     */
    private function apply_incremental_upgrades(string $installed_version): void
    {
        global $wpdb;

        // Example: If upgrading from pre-1.0.0, ensure indices exist
        if (version_compare($installed_version, '1.0.0', '<')) {
            $specs_table = Schema::get_table_name(Schema::TABLE_SPECS);
            // Verify table created
            $exists = $wpdb->get_var("SHOW TABLES LIKE '{$specs_table}'");
            if ($exists) {
                // Ensure collation matches WordPress
                $charset_collate = $wpdb->get_charset_collate();
                $wpdb->query("ALTER TABLE {$specs_table} {$charset_collate}");
            }
        }
    }
}
