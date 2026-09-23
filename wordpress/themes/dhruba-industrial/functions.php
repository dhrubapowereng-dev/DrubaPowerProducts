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

/**
 * 301 Redirect duplicate /product-category/(eee|cctv|solar) URLs to canonical paths
 */
function dhruba_industrial_canonical_redirects(): void
{
    if (is_product_category()) {
        $term = get_queried_object();
        if ($term && in_array($term->slug, ['eee', 'cctv', 'solar'], true)) {
            $uri = $_SERVER['REQUEST_URI'] ?? '';
            if (str_contains($uri, '/product-category/')) {
                wp_safe_redirect(home_url("/{$term->slug}/"), 301);
                exit;
            }
        }
    }
}
add_action('template_redirect', 'dhruba_industrial_canonical_redirects');

/**
 * Output accurate canonical link tag in head to eliminate duplicate URLs
 */
function dhruba_industrial_canonical_tag(): void
{
    if (is_singular('product')) {
        $canonical = get_permalink();
    } elseif (is_product_category()) {
        $term = get_queried_object();
        if ($term && in_array($term->slug, ['eee', 'cctv', 'solar'], true)) {
            $canonical = home_url("/{$term->slug}/");
        } else {
            $canonical = get_term_link($term);
        }
    } elseif (is_shop()) {
        $shop_page_id = wc_get_page_id('shop');
        $canonical = $shop_page_id ? get_permalink($shop_page_id) : home_url('/shop/');
    } elseif (is_front_page()) {
        $canonical = home_url('/');
    } else {
        $canonical = get_permalink();
    }

    if (!empty($canonical) && !is_wp_error($canonical)) {
        echo '<link rel="canonical" href="' . esc_url($canonical) . "\" />\n";
    }
}
add_action('wp_head', 'dhruba_industrial_canonical_tag', 1);

/**
 * Structured Data (Schema.org JSON-LD) for industrial catalog products & organization
 */
function dhruba_industrial_schema_org(): void
{
    if (is_singular('product')) {
        global $post;
        $product_id = $post->ID;
        $product = function_exists('wc_get_product') ? wc_get_product($product_id) : null;
        if (!$product) {
            return;
        }

        $mpn = get_post_meta($product_id, '_dp_mpn', true) ?: $post->post_title;
        $sku = $product->get_sku() ?: ('DP-' . $mpn);
        $brands = wp_get_post_terms($product_id, 'dp_brand', ['fields' => 'names']);
        $brand_name = (!empty($brands) && !is_wp_error($brands)) ? $brands[0] : 'Industrial';

        $schema = [
            '@context' => 'https://schema.org',
            '@type'    => 'Product',
            'name'     => get_the_title(),
            'description' => wp_strip_all_tags(get_the_excerpt() ?: get_the_title()),
            'image'    => get_the_post_thumbnail_url($product_id, 'full') ?: '',
            'sku'      => $sku,
            'mpn'      => $mpn,
            'brand'    => [
                '@type' => 'Brand',
                'name'  => $brand_name,
            ],
            'offers'   => [
                '@type'         => 'Offer',
                'priceCurrency' => 'BDT',
                'price'         => '0.00',
                'availability'  => $product->is_in_stock() ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                'url'           => get_permalink($product_id),
                'priceSpecification' => [
                    '@type'         => 'PriceSpecification',
                    'priceCurrency' => 'BDT',
                    'description'   => 'Project Quoted Pricing via Industrial RFQ',
                ],
            ],
        ];

        echo '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . "</script>\n";
    }
}
add_action('wp_head', 'dhruba_industrial_schema_org', 5);
