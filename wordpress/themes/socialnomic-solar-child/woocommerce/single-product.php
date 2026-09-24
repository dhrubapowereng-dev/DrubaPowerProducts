<?php
/**
 * The Template for displaying single technical products
 *
 * Preserves parent theme header and footer while presenting the industrial product details:
 * MPN, Brand, Series, Specifications table, PDF datasheets, Price on Request, and RFQ form.
 *
 * @package SocialnomicSolarChild
 */

defined('ABSPATH') || exit;

get_header('shop');

while (have_posts()): the_post();
    $product_id = get_the_ID();
    $product    = wc_get_product($product_id);
    $mpn        = get_post_meta($product_id, '_dp_mpn', true) ?: $product->get_sku();
    $brands     = wp_get_post_terms($product_id, 'dp_brand', ['fields' => 'names']);
    $brand_name = !empty($brands) ? $brands[0] : 'Industrial';
    $series     = wp_get_post_terms($product_id, 'dp_series', ['fields' => 'names']);
    $series_name= !empty($series) ? $series[0] : 'Standard';

    // Fetch normalized specifications from dhruba catalog core tables or post meta
    global $wpdb;
    $specs_table = $wpdb->prefix . 'dp_product_specs';
    $specs = [];
    if ($wpdb->get_var("SHOW TABLES LIKE '$specs_table'") === $specs_table) {
        $specs = $wpdb->get_results($wpdb->prepare(
            "SELECT spec_key, spec_label, spec_value, unit FROM $specs_table WHERE product_id = %d ORDER BY display_order ASC",
            $product_id
        ), ARRAY_A);
    }
    if (empty($specs)) {
        // Fallback to post meta
        $meta_specs = get_post_meta($product_id, '_dp_specifications', true);
        if (is_array($meta_specs)) {
            $specs = $meta_specs;
        }
    }

    // Fetch documents
    $docs_table = $wpdb->prefix . 'dp_product_documents';
    $docs = [];
    if ($wpdb->get_var("SHOW TABLES LIKE '$docs_table'") === $docs_table) {
        $docs = $wpdb->get_results($wpdb->prepare(
            "SELECT doc_title, doc_type, file_url, file_size FROM $docs_table WHERE product_id = %d",
            $product_id
        ), ARRAY_A);
    }

    $wa_text = rawurlencode("Hello Dhruba Power,\nI need a quotation and delivery ETA for:\nProduct: " . get_the_title() . "\nMPN: " . $mpn . "\nBrand: " . $brand_name . "\nDelivery Location: Barishal");
?>

<div class="dp-single-product-wrapper" style="background-color: #F8FAFC; padding: 2.5rem 1rem; min-height: 80vh;">
    <div style="max-width: 1200px; margin: 0 auto;">
        
        <!-- Breadcrumb -->
        <nav style="font-size: 0.75rem; color: #64748B; margin-bottom: 1.5rem;">
            <a href="<?php echo esc_url(home_url('/')); ?>" style="color:#64748B; text-decoration:none;">Home</a> &gt; 
            <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" style="color:#64748B; text-decoration:none;">Industrial Products</a> &gt; 
            <span style="color:#0F172A; font-weight:600;"><?php the_title(); ?></span>
        </nav>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 2rem; margin-bottom: 2rem;">
            
            <!-- Left: Product Image -->
            <div>
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 2rem; display: flex; align-items: center; justify-content: center; min-height: 380px;">
                    <?php echo $product->get_image('large', ['style' => 'max-height: 340px; width: auto; object-fit: contain;']); ?>
                </div>
                <div style="margin-top: 1rem; display: flex; gap: 0.75rem; font-size: 0.75rem; color: #64748B;">
                    <span>✔ 100% Genuine OEM Sourced</span>
                    <span>✔ Official Manufacturer Warranty</span>
                    <span>✔ Barishal Hub Delivery</span>
                </div>
            </div>

            <!-- Right: Commercial & Technical Overview -->
            <div style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #D97706; background: #FFFBEB; padding: 2px 8px; border-radius: 4px; border: 1px solid #FDE68A;">
                            <?php echo esc_html($brand_name); ?>
                        </span>
                        <span style="font-size: 0.75rem; font-weight: 600; color: #64748B;">
                            Series: <?php echo esc_html($series_name); ?>
                        </span>
                    </div>

                    <h1 style="font-size: 1.5rem; font-weight: 800; color: #0F172A; line-height: 1.3; margin: 0.25rem 0 0.75rem 0;">
                        <?php the_title(); ?>
                    </h1>

                    <div style="font-family: monospace; font-size: 0.8125rem; color: #475569; margin-bottom: 1rem;">
                        Manufacturer Part Number (MPN): <strong style="color: #0F172A;"><?php echo esc_html((string)$mpn); ?></strong>
                    </div>

                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 0.25rem;">Pricing Policy</div>
                        <div style="font-size: 1.125rem; font-weight: 800; color: #0F172A;">Price on Request</div>
                        <p style="font-size: 0.75rem; color: #64748B; margin: 0.35rem 0 0 0;">
                            Official distributor pricing for EPC contractors, industrial factories, and institutions in Bangladesh.
                        </p>
                    </div>

                    <div style="font-size: 0.8125rem; color: #334155; line-height: 1.6; margin-bottom: 1.5rem;">
                        <?php the_excerpt(); ?>
                    </div>
                </div>

                <!-- Commercial Call to Action Buttons -->
                <div style="display: flex; flex-direction: column; gap: 0.75rem; border-top: 1px solid #E2E8F0; padding-top: 1.5rem;">
                    <button type="button" 
                            class="dp-btn-rfq" 
                            style="padding: 0.75rem 1.5rem; font-size: 0.875rem;"
                            onclick="window.DhrubaCatalog && window.DhrubaCatalog.addToRfq(<?php echo esc_attr((string)$product_id); ?>)">
                        <span>Add to RFQ Basket / Request Quote</span>
                    </button>

                    <a href="https://wa.me/8801711197767?text=<?php echo $wa_text; ?>" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="dp-btn-whatsapp"
                       style="padding: 0.65rem 1.5rem; font-size: 0.8125rem;">
                        <span>WhatsApp Sales Desk (+880 1711-197767)</span>
                    </a>
                </div>
            </div>

        </div>

        <!-- Specifications & Technical Documentation Tables -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            
            <!-- Specifications -->
            <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem;">
                <h3 style="font-size: 1rem; font-weight: 800; color: #0F172A; margin: 0 0 1rem 0; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.5rem;">
                    Technical Specifications
                </h3>

                <?php if (!empty($specs)): ?>
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.8125rem;">
                        <tbody>
                            <?php foreach ($specs as $idx => $spec): 
                                $label = $spec['spec_label'] ?? $spec['label'] ?? '';
                                $value = $spec['spec_value'] ?? $spec['value'] ?? '';
                                $unit  = $spec['unit'] ?? '';
                                $bg    = $idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
                            ?>
                                <tr style="background: <?php echo $bg; ?>; border-bottom: 1px solid #F1F5F9;">
                                    <td style="padding: 0.6rem 0.75rem; font-weight: 600; color: #475569; width: 45%;">
                                        <?php echo esc_html($label); ?>
                                    </td>
                                    <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #0F172A;">
                                        <?php echo esc_html($value . ($unit ? ' ' . $unit : '')); ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php else: ?>
                    <p style="font-size: 0.8125rem; color: #64748B;">Contact our engineering team for detailed technical drawings and SLD integration.</p>
                <?php endif; ?>
            </div>

            <!-- Documents & Downloads -->
            <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; height: fit-content;">
                <h3 style="font-size: 1rem; font-weight: 800; color: #0F172A; margin: 0 0 1rem 0; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.5rem;">
                    Datasheets &amp; Certificates
                </h3>

                <?php if (!empty($docs)): ?>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.8125rem;">
                        <?php foreach ($docs as $doc): ?>
                            <li style="margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid #F1F5F9;">
                                <a href="<?php echo esc_url($doc['file_url']); ?>" target="_blank" rel="noopener" style="font-weight: 700; color: #0F172A; text-decoration: none; display: flex; align-items: center; gap: 0.5rem;">
                                    <span>📄 <?php echo esc_html($doc['doc_title']); ?></span>
                                </a>
                                <span style="font-size: 0.6875rem; color: #94A3B8; margin-top: 2px; display: block;">
                                    <?php echo esc_html(strtoupper($doc['doc_type'] ?? 'PDF')); ?> • <?php echo esc_html($doc['file_size'] ?? 'PDF Document'); ?>
                                </span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php else: ?>
                    <p style="font-size: 0.75rem; color: #64748B; line-height: 1.5;">
                        Official manufacturer datasheets and test reports are available on request for authorized projects.
                    </p>
                    <a href="mailto:info@dhrubapower.com?subject=<?php echo rawurlencode('Datasheet Request: ' . $mpn); ?>" style="display: inline-block; font-size: 0.75rem; font-weight: 700; color: #D97706; text-decoration: none; margin-top: 0.5rem;">
                        Request PDF Datasheet &rarr;
                    </a>
                <?php endif; ?>
            </div>

        </div>

    </div>
</div>

<?php
endwhile;

get_footer('shop');
