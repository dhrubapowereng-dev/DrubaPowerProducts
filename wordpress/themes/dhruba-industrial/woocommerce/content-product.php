<?php
/**
 * Industrial Product Card Component
 *
 * Reusable, high-performance responsive card for 50,000+ products.
 * Includes MPN, brand tag, key spec pills, Ready Stock indicator,
 * Compare, Wishlist, RFQ, and direct WhatsApp buttons.
 *
 * @package DhrubaIndustrial
 */

if (!defined('ABSPATH')) {
    exit;
}

$product_id = get_the_ID();
$mpn        = get_post_meta($product_id, '_dp_mpn', true) ?: get_the_title();
$mfg_code   = get_post_meta($product_id, '_dp_mfg_code', true) ?: '';
$sku        = (isset($product) && is_object($product)) ? $product->get_sku() : get_post_meta($product_id, '_sku', true);

$brand_terms = wp_get_post_terms($product_id, 'dp_brand', ['fields' => 'names']);
$brand_name  = !empty($brand_terms) ? $brand_terms[0] : 'Industrial';

$plugin = function_exists('dhruba_catalog') ? dhruba_catalog() : null;
$specs  = $plugin ? $plugin->get_specs()->get_product_specs($product_id) : [];
$key_specs = array_slice($specs, 0, 3);

$wa_url = \DhrubaCatalog\RFQ\RfqService::build_whatsapp_url($product_id);
?>
<article class="dp-card" id="dp-card-<?php echo esc_attr($product_id); ?>">
  <!-- Card Header: Brand, Stock Status & Quick Wishlist Icon -->
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
    <span style="font-size:0.75rem; font-weight:800; color:#0284c7; text-transform:uppercase; letter-spacing:0.5px;">
      <?php echo esc_html($brand_name); ?>
    </span>
    <div style="display:flex; align-items:center; gap:0.5rem;">
      <span style="font-size:0.7rem; color:#16a34a; font-weight:700;">● Stock Barishal</span>
      <button 
        type="button" 
        class="dp-btn-wishlist-toggle" 
        data-product-id="<?php echo esc_attr($product_id); ?>" 
        data-product-name="<?php echo esc_attr(get_the_title()); ?>"
        data-brand="<?php echo esc_attr($brand_name); ?>"
        data-mpn="<?php echo esc_attr($mpn); ?>"
        data-url="<?php echo esc_url(get_permalink()); ?>"
        title="Add to Project BOM / Wishlist"
        style="background:none; border:none; color:#94a3b8; font-size:1rem; cursor:pointer; padding:0; line-height:1;"
      >
        🤍
      </button>
    </div>
  </div>

  <!-- Product Image Thumbnail -->
  <a href="<?php the_permalink(); ?>" style="text-decoration:none; display:flex; justify-content:center; align-items:center; background:#f8fafc; border-radius:4px; height:160px; margin-bottom:0.75rem; overflow:hidden; position:relative;">
    <?php if (has_post_thumbnail()): ?>
      <?php the_post_thumbnail('medium', ['style' => 'max-height:140px; width:auto; object-fit:contain;']); ?>
    <?php else: ?>
      <div style="color:#94a3b8; font-size:0.75rem; font-weight:600; text-align:center; padding:1rem;">
        <?php echo esc_html($mpn); ?><br><span style="font-size:0.6875rem; font-weight:normal;">Genuine Industrial Equipment</span>
      </div>
    <?php endif; ?>
  </a>

  <!-- MPN / Part Number -->
  <div style="font-size:0.8125rem; font-weight:700; color:#64748b; font-family:monospace; margin-bottom:0.25rem;">
    MPN: <?php echo esc_html($mpn); ?>
  </div>

  <!-- Product Title -->
  <h2 style="font-size:0.9375rem; font-weight:700; color:#0f172a; margin:0 0 0.5rem 0; line-height:1.3; height:2.6em; overflow:hidden;">
    <a href="<?php the_permalink(); ?>" style="color:#0f172a; text-decoration:none;">
      <?php the_title(); ?>
    </a>
  </h2>

  <!-- Technical Spec Pills -->
  <div style="margin-bottom:0.75rem; min-height:26px;">
    <?php foreach ($key_specs as $spec): ?>
      <span class="dp-spec-pill" title="<?php echo esc_attr($spec['label']); ?>">
        <?php echo esc_html($spec['normalized_value'] ?: ($spec['label'] . ': ' . $spec['value_text'])); ?>
      </span>
    <?php endforeach; ?>
  </div>

  <!-- Pricing / RFQ Notice -->
  <div style="font-size:0.75rem; font-weight:700; color:#b45309; background:#fffbeb; border:1px solid #fef3c7; border-radius:4px; padding:0.25rem 0.5rem; margin-bottom:0.75rem; text-align:center;">
    B2B BDT Pricing Available on RFQ
  </div>

  <!-- Action Bar: Add to RFQ, Compare, WhatsApp -->
  <div style="margin-top:auto; padding-top:0.75rem; border-top:1px solid #f1f5f9; display:flex; gap:0.35rem; align-items:center;">
    <button 
      type="button" 
      class="dp-btn-rfq-add" 
      data-product-id="<?php echo esc_attr($product_id); ?>" 
      data-product-name="<?php echo esc_attr(get_the_title()); ?>"
      style="flex:1; background:#0f172a; color:#ffffff; font-size:0.8125rem; font-weight:700; padding:0.45rem 0.6rem; border:none; border-radius:4px; cursor:pointer;"
    >
      + RFQ
    </button>

    <button 
      type="button" 
      class="dp-btn-compare-toggle" 
      data-product-id="<?php echo esc_attr($product_id); ?>" 
      data-product-name="<?php echo esc_attr(get_the_title()); ?>"
      data-mpn="<?php echo esc_attr($mpn); ?>"
      data-brand="<?php echo esc_attr($brand_name); ?>"
      data-url="<?php echo esc_url(get_permalink()); ?>"
      title="Add to Compare Matrix"
      style="background:#f1f5f9; color:#334155; border:1px solid #cbd5e1; border-radius:4px; padding:0.45rem 0.55rem; font-size:0.75rem; font-weight:600; cursor:pointer;"
    >
      ⚖️
    </button>

    <a 
      href="<?php echo esc_url($wa_url); ?>" 
      target="_blank" 
      rel="noopener" 
      title="Inquire on WhatsApp"
      style="background:#22c55e; color:#ffffff; padding:0.45rem 0.65rem; border-radius:4px; text-decoration:none; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.8125rem;"
    >
      WA
    </a>
  </div>
</article>
