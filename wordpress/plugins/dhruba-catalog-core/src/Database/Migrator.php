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

        // Upgrading to 1.1.0: Add UNIQUE KEY on dp_specs(product_id, spec_key) and populate dp_product_index
        if (version_compare($installed_version, '1.1.0', '<')) {
            $specs_table = Schema::get_table_name(Schema::TABLE_SPECS);
            $index_exists = $wpdb->get_var("SHOW INDEX FROM `{$specs_table}` WHERE Key_name = 'uq_prod_spec'");
            if (!$index_exists) {
                // Remove any stale duplicate specs before adding unique constraint
                $wpdb->query("
                    DELETE s1 FROM `{$specs_table}` s1
                    INNER JOIN `{$specs_table}` s2 
                    WHERE s1.id < s2.id AND s1.product_id = s2.product_id AND s1.spec_key = s2.spec_key
                ");
                $wpdb->query("ALTER TABLE `{$specs_table}` ADD UNIQUE KEY `uq_prod_spec` (`product_id`, `spec_key`)");
            }
        }
    }
}
