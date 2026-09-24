<?php
/**
 * The Template for displaying product archives (Shop, Brand, Series, Category)
 *
 * Preserves the parent theme's header and footer while presenting the clean Dhruba Power
 * technical catalog with fast filters, MPN search, and RFQ actions.
 *
 * @package SocialnomicSolarChild
 */

defined('ABSPATH') || exit;

get_header('shop');
?>

<div class="dp-catalog-archive-wrapper" style="background-color: #F8FAFC; padding: 2.5rem 1rem; min-height: 70vh;">
    <div class="dp-catalog-container" style="max-width: 1280px; margin: 0 auto;">
        
        <!-- Breadcrumb & Title -->
        <div style="margin-bottom: 2rem;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #D97706; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
                Dhruba Power &amp; Engineering — Industrial Catalog
            </div>
            <h1 style="font-size: 1.75rem; font-weight: 800; color: #0F172A; margin: 0;">
                <?php woocommerce_page_title(); ?>
            </h1>
            <p style="font-size: 0.8125rem; color: #64748B; margin-top: 0.35rem; max-width: 680px;">
                Authorized switchgear, solar systems, CCTV, and substation equipment with verified manufacturer part numbers and Barishal warehouse availability.
            </p>
        </div>

        <?php if (woocommerce_product_loop()): ?>

            <div class="dp-catalog-layout" style="display: grid; grid-template-columns: 260px 1fr; gap: 2rem;">
                
                <!-- Left Sidebar Filters -->
                <aside class="dp-catalog-sidebar" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 1.25rem; height: fit-content;">
                    <div style="font-size: 0.8125rem; font-weight: 700; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.75rem; margin-bottom: 1rem;">
                        Technical Filters
                    </div>

                    <!-- Category Navigation -->
                    <div style="margin-bottom: 1.25rem;">
                        <label style="display:block; font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 0.5rem;">
                            Categories
                        </label>
                        <?php
                        $terms = get_terms(['taxonomy' => 'product_cat', 'hide_empty' => true]);
                        if (!empty($terms) && !is_wp_error($terms)):
                            echo '<ul style="list-style:none; padding:0; margin:0; font-size:0.8125rem; space-y:0.35rem;">';
                            foreach ($terms as $term):
                                $link = get_term_link($term);
                                echo '<li style="margin-bottom:0.35rem;"><a href="' . esc_url($link) . '" style="color:#0F172A; text-decoration:none; display:flex; justify-content:space-between;"><span>' . esc_html($term->name) . '</span><span style="color:#94A3B8;">(' . esc_html((string)$term->count) . ')</span></a></li>';
                            endforeach;
                            echo '</ul>';
                        endif;
                        ?>
                    </div>

                    <!-- Brand Navigation -->
                    <div style="margin-bottom: 1.25rem;">
                        <label style="display:block; font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 0.5rem;">
                            Authorized Brands
                        </label>
                        <?php
                        $brands = get_terms(['taxonomy' => 'dp_brand', 'hide_empty' => false]);
                        if (!empty($brands) && !is_wp_error($brands)):
                            echo '<ul style="list-style:none; padding:0; margin:0; font-size:0.8125rem;">';
                            foreach ($brands as $b):
                                $link = get_term_link($b);
                                echo '<li style="margin-bottom:0.35rem;"><a href="' . esc_url($link) . '" style="color:#0F172A; text-decoration:none;">' . esc_html($b->name) . '</a></li>';
                            endforeach;
                            echo '</ul>';
                        endif;
                        ?>
                    </div>

                    <!-- Direct Tender Support -->
                    <div style="padding-top: 1rem; border-top: 1px solid #E2E8F0; font-size: 0.75rem; color: #64748B;">
                        <span style="font-weight: 700; color: #0F172A; display:block; margin-bottom: 0.25rem;">Tender BOQ Pricing?</span>
                        Email your AutoCAD or Excel schedule to <a href="mailto:info@dhrubapower.com" style="color:#D97706; font-weight:700;">info@dhrubapower.com</a> for corporate contractor pricing.
                    </div>
                </aside>

                <!-- Right Products Grid -->
                <main class="dp-catalog-main">
                    <div class="dp-carousel-track" style="grid-template-columns: repeat(3, 1fr); gap: 1.25rem;">
                        <?php while (have_posts()): the_post(); 
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
                                        <a href="<?php the_permalink(); ?>">
                                            <?php echo $product->get_image('medium', ['style' => 'max-height:100%; width:auto; object-fit:contain;']); ?>
                                        </a>
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
                                    <a href="https://wa.me/8801711197767?text=<?php echo rawurlencode('Hello Dhruba Power, I am inquiring about: ' . get_the_title() . ' (MPN: ' . $mpn . ')'); ?>" target="_blank" rel="noopener" class="dp-btn-whatsapp">
                                        <span>WhatsApp Quote</span>
                                    </a>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    </div>

                    <!-- Pagination -->
                    <div style="margin-top: 2rem;">
                        <?php woocommerce_pagination(); ?>
                    </div>
                </main>

            </div>

        <?php else: ?>
            <div style="background:#FFF; border:1px solid #E2E8F0; border-radius:10px; padding:3rem; text-align:center;">
                <p style="font-size:1rem; font-weight:700; color:#0F172A;">No products found in this category.</p>
                <p style="font-size:0.8125rem; color:#64748B;">Contact our Barishal engineering desk directly for customized switchgear sourcing.</p>
                <a href="https://wa.me/8801711197767" target="_blank" rel="noopener" class="dp-btn-whatsapp" style="display:inline-flex; width:auto; padding:0.6rem 1.5rem; margin-top:1rem;">
                    <span>Inquire via WhatsApp</span>
                </a>
            </div>
        <?php endif; ?>

    </div>
</div>

<?php
get_footer('shop');
