<?php
/**
 * Plugin Name: Dhruba Catalog Core
 * Plugin URI: https://dhrubapower.com/
 * Description: Industrial Product Information, Technical Specs Engine, Documents, Meilisearch & RFQ Platform on WooCommerce for Dhruba Power.
 * Version: 1.0.0
 * Author: Dhruba Power Engineering Team
 * Author URI: https://dhrubapower.com/
 * Text Domain: dhruba-catalog
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 8.1
 * WC requires at least: 8.0
 * WC tested up to: 9.2
 *
 * @package DhrubaCatalog
 */

declare(strict_types=1);

namespace DhrubaCatalog;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

define('DHRUBA_CATALOG_VERSION', '1.1.0');
define('DHRUBA_CATALOG_DB_VERSION', '1.1.0');
define('DHRUBA_CATALOG_FILE', __FILE__);
define('DHRUBA_CATALOG_PATH', plugin_dir_path(__FILE__));
define('DHRUBA_CATALOG_URL', plugin_dir_url(__FILE__));

// PSR-4 Style Autoloader for DhrubaCatalog Namespace
spl_autoload_register(function (string $class): void {
    $prefix = 'DhrubaCatalog\\';
    $base_dir = DHRUBA_CATALOG_PATH . 'src/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});

/**
 * Main Singleton Container for Dhruba Catalog Core
 */
final class Plugin
{
    private static ?Plugin $instance = null;

    private Database\Schema $schema;
    private Database\Migrator $migrator;
    private Taxonomy\TaxonomyRegistrar $taxonomies;
    private Product\ProductMetaManager $product_meta;
    private Specs\SpecificationEngine $specs;
    private Documents\DocumentManager $documents;
    private Relations\RelationshipManager $relations;
    private RFQ\RfqService $rfq;
    private Search\SearchInterface $search;
    private API\RestController $api;
    private Admin\AdminDashboard $admin;
    private Experts\ExpertManager $experts;

    public static function instance(): Plugin
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        $this->init_components();
        $this->register_hooks();
    }

    private function init_components(): void
    {
        $this->schema       = new Database\Schema();
        $this->migrator     = new Database\Migrator($this->schema);
        $this->taxonomies   = new Taxonomy\TaxonomyRegistrar();
        $this->product_meta = new Product\ProductMetaManager();
        $this->specs        = new Specs\SpecificationEngine();
        $this->documents    = new Documents\DocumentManager();
        $this->relations    = new Relations\RelationshipManager();
        $this->rfq          = new RFQ\RfqService();
        $this->experts      = new Experts\ExpertManager();

        // Search engine resolution via SearchManager strategy context
        $this->search       = new Search\SearchManager();

        $this->api   = new API\RestController($this);
        $this->admin = new Admin\AdminDashboard($this);
    }

    private function register_hooks(): void
    {
        register_activation_hook(DHRUBA_CATALOG_FILE, [$this, 'activate']);
        register_deactivation_hook(DHRUBA_CATALOG_FILE, [$this, 'deactivate']);

        add_action('plugins_loaded', [$this, 'on_plugins_loaded']);
        add_action('init', [$this->taxonomies, 'register']);
        $this->experts->register();
        add_action('rest_api_init', [$this->api, 'register_routes']);

        // Declare HPOS Compatibility (WooCommerce High-Performance Order Storage)
        add_action('before_woocommerce_init', function () {
            if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
                \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
                    'custom_order_tables',
                    DHRUBA_CATALOG_FILE,
                    true
                );
            }
        });
    }

    public function activate(): void
    {
        $this->migrator->run_migrations();
        $this->taxonomies->register();
        flush_rewrite_rules();
    }

    public function deactivate(): void
    {
        flush_rewrite_rules();
    }

    public function on_plugins_loaded(): void
    {
        load_plugin_textdomain('dhruba-catalog', false, dirname(plugin_basename(DHRUBA_CATALOG_FILE)) . '/languages');

        // Self-healing database migration: auto-migrate on version bump even if activation hook wasn't triggered
        if (get_option('dp_catalog_db_version') !== DHRUBA_CATALOG_DB_VERSION) {
            $this->migrator->run_migrations();
        }
    }

    // Accessors
    public function get_schema(): Database\Schema { return $this->schema; }
    public function get_migrator(): Database\Migrator { return $this->migrator; }
    public function get_taxonomies(): Taxonomy\TaxonomyRegistrar { return $this->taxonomies; }
    public function get_product_meta(): Product\ProductMetaManager { return $this->product_meta; }
    public function get_specs(): Specs\SpecificationEngine { return $this->specs; }
    public function get_documents(): Documents\DocumentManager { return $this->documents; }
    public function get_relations(): Relations\RelationshipManager { return $this->relations; }
    public function get_rfq(): RFQ\RfqService { return $this->rfq; }
    public function get_search(): Search\SearchInterface { return $this->search; }
    public function get_experts(): Experts\ExpertManager { return $this->experts; }
}

function dhruba_catalog(): Plugin
{
    return Plugin::instance();
}

// Boot plugin
dhruba_catalog();
