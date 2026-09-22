<?php
/**
 * Dhruba Industrial Theme Functions
 *
 * @package DhrubaIndustrial
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

function dhruba_industrial_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'gallery', 'caption', 'style', 'script']);
    
    // WooCommerce Declarations
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    register_nav_menus([
        'primary' => __('Primary Engineering Nav', 'dhruba-industrial'),
        'footer'  => __('Footer Links', 'dhruba-industrial'),
    ]);
}
add_action('after_setup_theme', 'dhruba_industrial_setup');

/**
 * Enqueue lightweight assets
 */
function dhruba_industrial_scripts(): void
{
    wp_enqueue_style('dhruba-industrial-style', get_stylesheet_uri(), [], '1.0.0');

    // RFQ and Search helper script
    wp_enqueue_script(
        'dhruba-industrial-app',
        get_template_directory_uri() . '/assets/js/catalog.js',
        [],
        '1.0.0',
        true
    );

    wp_localize_script('dhruba-industrial-app', 'dhrubaCatalog', [
        'restUrl'  => esc_url_raw(rest_url('dhruba/v1/')),
        'nonce'    => wp_create_nonce('wp_rest'),
        'waNumber' => get_option('dp_whatsapp_number', '+8801700000000'),
    ]);
}
add_action('wp_enqueue_scripts', 'dhruba_industrial_scripts');

/**
 * Custom template routing for SEO Canonical Paths:
 * /eee/, /cctv/, /solar/
 */
function dhruba_industrial_rewrite_rules(): void
{
    add_rewrite_rule(
        '^(eee|cctv|solar)/?$',
        'index.php?product_cat=$matches[1]',
        'top'
    );
    add_rewrite_rule(
        '^(eee|cctv|solar)/([^/]+)/?$',
        'index.php?product_cat=$matches[2]',
        'top'
    );
}
add_action('init', 'dhruba_industrial_rewrite_rules');
