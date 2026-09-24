<?php
/**
 * Socialnomic Solar Child Theme Functions
 *
 * Preserves existing Elementor templates and main site styling while fixing submenu
 * z-index/clipping issues, providing WooCommerce technical catalog overrides, and
 * gating internal admin elements from public visitors.
 *
 * @package SocialnomicSolarChild
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/**
 * 1. Enqueue Parent and Child Stylesheets
 */
add_action('wp_enqueue_scripts', function (): void {
    wp_enqueue_style(
        'socialnomic-solar-parent-style',
        get_template_directory_uri() . '/style.css',
        [],
        wp_get_theme()->parent()->get('Version')
    );

    wp_enqueue_style(
        'socialnomic-solar-child-style',
        get_stylesheet_uri(),
        ['socialnomic-solar-parent-style'],
        wp_get_theme()->get('Version')
    );
}, 20);

/**
 * 2. Declare WooCommerce Support
 */
add_action('after_setup_theme', function (): void {
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
});

/**
 * 3. Commercial Logic: Force "Price on Request" for Public Visitors (#28)
 */
add_filter('woocommerce_get_price_html', function ($price, $product) {
    // If not logged in as authorized contractor/dealer, always show "Price on Request"
    if (!current_user_can('manage_woocommerce') && !current_user_can('view_dealer_pricing')) {
        $text = is_rtl() || get_locale() === 'bn_BD' ? 'দর প্রস্তাবের জন্য অনুরোধ' : 'Price on Request';
        return '<span class="dp-price-request">' . esc_html($text) . '</span>';
    }
    return $price;
}, 99, 2);

/**
 * 4. Replace WooCommerce "Add to Cart" Button with "Request Quote" (#26)
 */
add_filter('woocommerce_loop_add_to_cart_link', function ($html, $product) {
    $product_id = $product->get_id();
    $mpn = get_post_meta($product_id, '_dp_mpn', true) ?: $product->get_sku();
    $name = $product->get_name();
    $wa_text = rawurlencode("Hello Dhruba Power,\nI am inquiring for quotation on:\n{$name}\nMPN: {$mpn}\nWarehouse: Barishal");

    ob_start();
    ?>
    <div class="dp-card-actions" style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.35rem;">
        <button type="button" 
                class="dp-btn-rfq dp-add-to-rfq-trigger" 
                data-product-id="<?php echo esc_attr((string)$product_id); ?>"
                data-product-mpn="<?php echo esc_attr((string)$mpn); ?>"
                data-product-name="<?php echo esc_attr((string)$name); ?>"
                onclick="window.DhrubaCatalog && window.DhrubaCatalog.addToRfq(<?php echo esc_attr((string)$product_id); ?>)">
            <span>Request Quote</span>
        </button>
        <a href="https://wa.me/8801711197767?text=<?php echo $wa_text; ?>" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="dp-btn-whatsapp">
            <span>WhatsApp Quote</span>
        </a>
    </div>
    <?php
    return ob_get_clean();
}, 99, 2);

/**
 * 5. Conditional Menu Filtering: Hide Admin & Developer Links from Public Visitors (#1, #7)
 * Ensures "Admin Desk", "RFQ History", and internal management controls never appear for guests.
 */
add_filter('wp_nav_menu_objects', function (array $items): array {
    $is_admin = current_user_can('manage_options');
    $is_logged_in = is_user_logged_in();

    return array_filter($items, function ($item) use ($is_admin, $is_logged_in): bool {
        $title = strtolower((string)$item->title);
        $url   = strtolower((string)$item->url);

        // Admin-only keywords
        if (str_contains($title, 'admin desk') || str_contains($title, 'admin rfq') || str_contains($title, 'architecture')) {
            return $is_admin;
        }

        // Account / History keywords
        if (str_contains($title, 'rfq history') || str_contains($title, 'my quotes')) {
            return $is_logged_in;
        }

        return true;
    });
}, 10, 1);

/**
 * 6. Shortcode for Dynamic 4-Card Latest Products Carousel (#13)
 * [dhruba_latest_products count="15"]
 */
add_shortcode('dhruba_latest_products', function ($atts): string {
    $atts = shortcode_atts([
        'count' => 15,
    ], $atts, 'dhruba_latest_products');

    $query = new WP_Query([
        'post_type'      => 'product',
        'post_status'    => 'publish',
        'posts_per_page' => (int)$atts['count'],
        'orderby'        => 'date',
        'order'          => 'DESC',
    ]);

    if (!$query->have_posts()) {
        return '<p class="dp-no-products">No industrial products found.</p>';
    }

    ob_start();
    ?>
    <div class="dp-products-carousel-container" style="position: relative; margin: 2rem 0;">
        <div class="dp-carousel-track">
            <?php while ($query->have_posts()): $query->the_post(); 
                $product = wc_get_product(get_the_ID());
                $mpn = get_post_meta(get_the_ID(), '_dp_mpn', true) ?: $product->get_sku();
                $brand = wp_get_post_terms(get_the_ID(), 'dp_brand', ['fields' => 'names']);
                $brand_name = !empty($brand) ? $brand[0] : 'Industrial';
            ?>
                <div class="dp-card">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                            <span style="font-size:0.6875rem; font-weight:800; text-transform:uppercase; color:#0F172A;"><?php echo esc_html($brand_name); ?></span>
                            <span class="dp-card-badge dp-badge-instock">In Stock - Barishal</span>
                        </div>
                        <div style="height:140px; display:flex; align-items:center; justify-content:center; background:#F8FAFC; border-radius:8px; overflow:hidden; margin-bottom:0.75rem;">
                            <?php echo $product->get_image('medium', ['style' => 'max-height:100%; width:auto; object-fit:contain;']); ?>
                        </div>
                        <div class="dp-card-mpn">MPN: <strong><?php echo esc_html((string)$mpn); ?></strong></div>
                        <h4 class="dp-card-title">
                            <a href="<?php the_permalink(); ?>" style="color:inherit; text-decoration:none;">
                                <?php the_title(); ?>
                            </a>
                        </h4>
                        <div class="dp-price-request">Price on Request</div>
                    </div>
                    <div style="margin-top:0.75rem;">
                        <a href="<?php the_permalink(); ?>" class="dp-btn-rfq">
                            <span>Request Quote</span>
                        </a>
                        <a href="https://wa.me/8801711197767?text=<?php echo rawurlencode('Inquiring for: ' . get_the_title() . ' (MPN: ' . $mpn . ')'); ?>" target="_blank" rel="noopener" class="dp-btn-whatsapp">
                            <span>WhatsApp Quote</span>
                        </a>
                    </div>
                </div>
            <?php endwhile; wp_reset_postdata(); ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
});

/**
 * 7. Shortcode for Dynamic 4-Card Projects Carousel (#12)
 * [dhruba_projects]
 */
add_shortcode('dhruba_projects', function (): string {
    // 6 Authentic Projects from Repository 1
    $projects = [
        [
            'title'    => 'Commercial Electrical Wiring Renovation',
            'location' => 'Barishal',
            'status'   => 'Ongoing',
            'progress' => '82%',
            'image'    => 'https://dhrubapower.com/wp-content/uploads/2026/05/WhatsApp-Image-2026-03-14-at-5.06.55-PM-2-640x430.jpeg',
            'scope'    => 'Cable tray layout, distribution sub-panels & breaker coordination',
        ],
        [
            'title'    => 'CCTV Security Network for Warehouse',
            'location' => 'Jhalokathi',
            'status'   => 'Ongoing',
            'progress' => '45%',
            'image'    => 'https://dhrubapower.com/wp-content/uploads/2026/05/WhatsApp-Image-2026-03-14-at-5.06.55-PM-2-640x430.jpeg',
            'scope'    => 'Enterprise AcuSense IP camera grid, 32-channel NVR & perimeter alerts',
        ],
        [
            'title'    => 'Industrial Panel Board Commissioning',
            'location' => 'Bhola',
            'status'   => 'Ongoing',
            'progress' => '68%',
            'image'    => 'https://dhrubapower.com/wp-content/uploads/2026/05/WhatsApp-Image-2026-03-14-at-5.06.55-PM-2-640x430.jpeg',
            'scope'    => '630A LT switchboard, automatic changeover & 120 kVAR PFI capacitor',
        ],
        [
            'title'    => 'Lightning Protection for Multi-Storey Building',
            'location' => 'Patuakhali',
            'status'   => 'Completed',
            'progress' => '100%',
            'image'    => 'https://dhrubapower.com/wp-content/uploads/2026/05/WhatsApp-Image-2026-03-14-at-5.06.55-PM-2-640x430.jpeg',
            'scope'    => 'ESE air terminal, down conductor & <1 ohm earthing resistance',
        ],
    ];

    ob_start();
    ?>
    <div class="dp-carousel-track">
        <?php foreach ($projects as $proj): ?>
            <div class="dp-card" style="padding:0; overflow:hidden;">
                <div style="height:150px; background:#0F172A; overflow:hidden; position:relative;">
                    <img src="<?php echo esc_url($proj['image']); ?>" alt="<?php echo esc_attr($proj['title']); ?>" style="width:100%; height:100%; object-fit:cover;" loading="lazy" />
                    <span style="position:absolute; top:8px; right:8px; background:<?php echo $proj['status'] === 'Completed' ? '#16A673' : '#D97706'; ?>; color:#FFF; font-size:10px; font-weight:700; padding:2px 8px; border-radius:12px;">
                        <?php echo esc_html($proj['status']); ?>
                    </span>
                </div>
                <div style="padding:1rem;">
                    <div style="font-size:11px; color:#64748B; font-weight:600; margin-bottom:0.25rem;">📍 <?php echo esc_html($proj['location']); ?></div>
                    <h4 class="dp-card-title" style="margin-top:0; font-size:0.875rem;"><?php echo esc_html($proj['title']); ?></h4>
                    <p style="font-size:0.75rem; color:#64748B; margin-bottom:0.75rem; line-height:1.4;"><?php echo esc_html($proj['scope']); ?></p>
                    <div style="font-size:11px; color:#0F172A; font-weight:700; display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span>Progress</span>
                        <span><?php echo esc_html($proj['progress']); ?></span>
                    </div>
                    <div style="height:6px; background:#E2E8F0; border-radius:3px; overflow:hidden;">
                        <div style="width:<?php echo esc_attr($proj['progress']); ?>; height:100%; background:<?php echo $proj['status'] === 'Completed' ? '#16A673' : '#D97706'; ?>;"></div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    <?php
    return ob_get_clean();
});

/**
 * 9. Official Brand Logo Filter
 * Injects official Dhruba Power brand asset if theme logo is not set via customizer
 */
add_filter('get_custom_logo', function ($html) {
    if (empty($html)) {
        $logo_url = get_stylesheet_directory_uri() . '/assets/images/dhrubapowerlogo.png';
        return sprintf(
            '<a href="%1$s" class="custom-logo-link" rel="home"><img src="%2$s" class="custom-logo" alt="%3$s" style="height:48px; width:auto; max-width:220px; object-fit:contain;" /></a>',
            esc_url(home_url('/')),
            esc_url($logo_url),
            esc_attr(get_bloginfo('name', 'display'))
        );
    }
    return $html;
});

