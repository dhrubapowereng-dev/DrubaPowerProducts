<?php
/**
 * Single Industrial Product Template
 *
 * Implements high-conversion engineering layout:
 * - Technical specs table
 * - Datasheets & manual downloads
 * - Same-series model picker table (e.g. ABB SH200 6A-63A)
 * - Sticky mobile RFQ bar & WhatsApp integration
 *
 * @package DhrubaIndustrial
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

while (have_posts()): the_post();
    global $product;
    $product_id = get_the_ID();

    $mpn        = get_post_meta($product_id, '_dp_mpn', true) ?: get_the_title();
    $mfg_code   = get_post_meta($product_id, '_dp_mfg_code', true) ?: '';
    $sku        = $product->get_sku() ?: 'DP-ABB-' . $mpn;
    $official   = get_post_meta($product_id, '_dp_official_url', true) ?: '';

    // Taxonomies
    $brands     = wp_get_post_terms($product_id, 'dp_brand');
    $brand_obj  = !empty($brands) ? $brands[0] : null;
    $brand_name = $brand_obj ? $brand_obj->name : 'Industrial';

    $series_terms = wp_get_post_terms($product_id, 'dp_series');
    $series_obj   = !empty($series_terms) ? $series_terms[0] : null;

    $plugin = function_exists('dhruba_catalog') ? dhruba_catalog() : null;
    $specs         = $plugin ? $plugin->get_specs()->get_product_specs($product_id) : [];
    $documents     = $plugin ? $plugin->get_documents()->get_product_documents($product_id) : [];
    $series_models = $plugin ? $plugin->get_relations()->get_same_series_models($product_id) : [];
    $compatible    = $plugin ? $plugin->get_relations()->get_related_products($product_id, \DhrubaCatalog\Relations\RelationshipManager::REL_COMPATIBLE, 6) : [];
    $accessories   = $plugin ? $plugin->get_relations()->get_related_products($product_id, \DhrubaCatalog\Relations\RelationshipManager::REL_ACCESSORY, 6) : [];
    $replacements  = $plugin ? $plugin->get_relations()->get_related_products($product_id, \DhrubaCatalog\Relations\RelationshipManager::REL_REPLACEMENT, 4) : [];
    $wa_url        = \DhrubaCatalog\RFQ\RfqService::build_whatsapp_url($product_id);
?>

<div class="dp-container" style="padding-top:1.5rem; padding-bottom:4rem;">
  <!-- 1. Breadcrumbs -->
  <div class="dp-breadcrumb">
    <a href="<?php echo esc_url(home_url('/')); ?>">Home</a> &gt; 
    <a href="<?php echo esc_url(home_url('/shop/')); ?>">Catalog</a> &gt; 
    <?php if ($brand_obj): ?>
      <a href="<?php echo esc_url(get_term_link($brand_obj)); ?>"><?php echo esc_html($brand_name); ?></a> &gt; 
    <?php endif; ?>
    <?php if ($series_obj): ?>
      <a href="<?php echo esc_url(get_term_link($series_obj)); ?>"><?php echo esc_html($series_obj->name); ?></a> &gt; 
    <?php endif; ?>
    <span style="color:#0f172a; font-weight:600;"><?php echo esc_html($mpn); ?></span>
  </div>

  <!-- 2. Hero Section: Image Gallery (Left) + Engineering Identifiers & RFQ (Right) -->
  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:2.5rem; margin-top:1rem; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:2rem;">
    <!-- Gallery -->
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f8fafc; border:1px solid #f1f5f9; border-radius:6px; min-height:380px; padding:1.5rem;">
      <?php if (has_post_thumbnail()): ?>
        <?php the_post_thumbnail('large', ['style' => 'max-height:340px; width:auto; object-fit:contain;']); ?>
      <?php else: ?>
        <div style="color:#94a3b8; font-size:0.95rem; font-weight:600;">Industrial Product Photo</div>
      <?php endif; ?>
    </div>

    <!-- Product Header & Key Data -->
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
        <span style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.8125rem; padding:0.25rem 0.6rem; border-radius:4px; text-transform:uppercase;">
          <?php echo esc_html($brand_name); ?>
        </span>
        <span style="color:#16a34a; font-weight:700; font-size:0.8125rem;">● In Stock (Barishal Warehouse)</span>
      </div>

      <h1 style="font-size:1.625rem; font-weight:800; color:#0f172a; margin:0 0 0.5rem 0; line-height:1.25;">
        <?php the_title(); ?>
      </h1>

      <!-- Technical Identification Matrix -->
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:0.875rem 1rem; margin-bottom:1.25rem; font-family:monospace; font-size:0.8125rem; display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
        <div><strong>MPN:</strong> <?php echo esc_html($mpn); ?></div>
        <div><strong>SKU:</strong> <?php echo esc_html($sku); ?></div>
        <?php if ($mfg_code): ?>
          <div><strong>Mfg Code:</strong> <?php echo esc_html($mfg_code); ?></div>
        <?php endif; ?>
        <?php if ($series_obj): ?>
          <div><strong>Series:</strong> <?php echo esc_html($series_obj->name); ?></div>
        <?php endif; ?>
      </div>

      <!-- Key Specs Pills Bar -->
      <?php if (!empty($specs)): ?>
        <div style="margin-bottom:1.5rem;">
          <div style="font-size:0.75rem; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:0.5rem;">Key Technical Ratings</div>
          <div>
            <?php foreach (array_slice($specs, 0, 5) as $sp): ?>
              <span class="dp-spec-pill" style="font-size:0.8125rem; padding:0.3rem 0.6rem;">
                <strong><?php echo esc_html($sp['label']); ?>:</strong> <?php echo esc_html($sp['normalized_value'] ?: $sp['value_text']); ?>
              </span>
            <?php endforeach; ?>
          </div>
        </div>
      <?php endif; ?>

      <!-- Commercial Action Box (No Public Price, RFQ Primary Conversion) -->
      <div style="border-top:1px solid #e2e8f0; padding-top:1.25rem;">
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
          <span style="font-size:0.875rem; font-weight:600; color:#475569;">Price:</span>
          <span style="font-size:0.875rem; font-weight:700; color:#b45309; background:#fef3c7; padding:0.25rem 0.65rem; border-radius:4px;">
            Request Quote for BDT Pricing
          </span>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:0.75rem;">
          <button 
            type="button" 
            class="dp-btn-rfq-add" 
            data-product-id="<?php echo esc_attr($product_id); ?>" 
            data-product-name="<?php echo esc_attr(get_the_title()); ?>"
            style="flex:1; min-width:180px; background:#0f172a; color:#ffffff; font-size:0.95rem; font-weight:700; padding:0.8rem 1.25rem; border:none; border-radius:6px; cursor:pointer;"
          >
            📋 Add to RFQ Basket
          </button>

          <button 
            type="button" 
            class="dp-btn-wishlist-toggle" 
            data-product-id="<?php echo esc_attr($product_id); ?>" 
            data-product-name="<?php echo esc_attr(get_the_title()); ?>"
            data-brand="<?php echo esc_attr($brand_name); ?>"
            data-mpn="<?php echo esc_attr($mpn); ?>"
            data-url="<?php echo esc_url(get_permalink()); ?>"
            style="background:#f8fafc; color:#334155; font-size:0.875rem; font-weight:700; padding:0.8rem 1rem; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer;"
          >
            🤍 Save / BOM
          </button>

          <button 
            type="button" 
            class="dp-btn-compare-toggle" 
            data-product-id="<?php echo esc_attr($product_id); ?>" 
            data-product-name="<?php echo esc_attr(get_the_title()); ?>"
            data-mpn="<?php echo esc_attr($mpn); ?>"
            data-brand="<?php echo esc_attr($brand_name); ?>"
            data-url="<?php echo esc_url(get_permalink()); ?>"
            style="background:#f8fafc; color:#334155; font-size:0.875rem; font-weight:700; padding:0.8rem 1rem; border:1px solid #cbd5e1; border-radius:6px; cursor:pointer;"
          >
            ⚖️ Compare
          </button>

          <a 
            href="<?php echo esc_url($wa_url); ?>" 
            target="_blank" 
            rel="noopener" 
            style="background:#22c55e; color:#ffffff; font-size:0.95rem; font-weight:700; padding:0.8rem 1.25rem; border-radius:6px; text-decoration:none; display:flex; align-items:center; gap:0.5rem;"
          >
            <span>💬 Quick WhatsApp Quote</span>
          </a>
        </div>

        <?php if ($official): ?>
          <div style="margin-top:1rem; font-size:0.75rem; color:#64748b;">
            Official Manufacturer URL: 
            <a href="<?php echo esc_url($official); ?>" target="_blank" rel="noopener" style="color:#0284c7; text-decoration:none;">
              Verify on <?php echo esc_html($brand_name); ?> Global Portal ↗
            </a>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>

  <!-- 3. Comprehensive Technical Specifications Table -->
  <div style="margin-top:2.5rem; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:1.75rem;">
    <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:0 0 1rem 0; border-bottom:2px solid #0f172a; padding-bottom:0.5rem;">
      Full Technical Specifications
    </h2>

    <?php if (!empty($specs)): ?>
      <table class="dp-specs-table">
        <tbody>
          <?php foreach ($specs as $s): ?>
            <tr>
              <th><?php echo esc_html($s['label']); ?></th>
              <td><strong><?php echo esc_html($s['value_text']); ?></strong> <?php if ($s['unit']) echo esc_html('(' . $s['unit'] . ')'); ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php else: ?>
      <p style="color:#64748b; font-size:0.875rem;">Detailed engineering specifications are being verified against manufacturer master catalogs.</p>
    <?php endif; ?>
  </div>

  <!-- 4. Technical Documents & Datasheets -->
  <div style="margin-top:2.5rem; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:1.75rem;">
    <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:0 0 1rem 0; border-bottom:2px solid #0f172a; padding-bottom:0.5rem;">
      Datasheets, Manuals & Compliance Documents
    </h2>

    <?php if (!empty($documents)): ?>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:1rem;">
        <?php foreach ($documents as $doc): ?>
          <div style="border:1px solid #e2e8f0; border-radius:6px; padding:1rem; display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
            <div>
              <div style="font-weight:700; font-size:0.875rem; color:#0f172a;"><?php echo esc_html($doc['title']); ?></div>
              <div style="font-size:0.75rem; color:#64748b; text-transform:uppercase; margin-top:0.25rem;">
                <?php echo esc_html($doc['document_type']); ?> • PDF
                <?php if (!empty($doc['sha256'])): ?>
                  • <span title="SHA-256 Hash Verified">SHA-256 ✓</span>
                <?php endif; ?>
              </div>
            </div>
            <a 
              href="<?php echo esc_url($doc['source_url']); ?>" 
              target="_blank" 
              rel="noopener" 
              style="padding:0.4rem 0.8rem; background:#0284c7; color:#ffffff; font-size:0.75rem; font-weight:700; border-radius:4px; text-decoration:none;"
            >
              Download
            </a>
          </div>
        <?php endforeach; ?>
      </div>
    <?php else: ?>
      <p style="color:#64748b; font-size:0.875rem;">Datasheet PDF available upon RFQ submission.</p>
    <?php endif; ?>
  </div>

  <!-- 5. Same-Series Models Switcher (e.g. ABB SH201-C6, C10, C16, C20, C25, C32) -->
  <?php if (!empty($series_models)): ?>
    <div style="margin-top:2.5rem; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:1.75rem;">
      <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:0 0 1rem 0; border-bottom:2px solid #0f172a; padding-bottom:0.5rem;">
        Other Models in this Series (<?php echo esc_html($series_obj ? $series_obj->name : 'Family'); ?>)
      </h2>
      <div style="display:flex; flex-wrap:wrap; gap:0.6rem;">
        <?php foreach ($series_models as $sm): ?>
          <a 
            href="<?php echo esc_url(get_permalink($sm['target_product_id'])); ?>" 
            style="padding:0.5rem 0.85rem; background:#f8fafc; border:1px solid #cbd5e1; border-radius:4px; text-decoration:none; font-size:0.8125rem; font-weight:700; color:#0f172a;"
          >
            <?php echo esc_html($sm['post_title']); ?>
          </a>
        <?php endforeach; ?>
      </div>
    </div>
  <?php endif; ?>

  <!-- 6. Compatible System Components (e.g. Inverter + Battery, Breaker + Enclosure) -->
  <?php if (!empty($compatible)): ?>
    <div style="margin-top:2.5rem; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:1.75rem;">
      <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:0 0 0.5rem 0;">
        Compatible System Components & Cross-Equipment
      </h2>
      <p style="color:#64748b; font-size:0.875rem; margin:0 0 1.25rem 0;">
        Verified electrical and physical interoperability for unified panel builds and solar plant arrays.
      </p>
      <div class="dp-product-grid" style="grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));">
        <?php foreach ($compatible as $rel): 
          $c_id = $rel['target_product_id'];
          $post = get_post($c_id);
          if (!$post) continue;
          setup_postdata($post);
          wc_get_template_part('content', 'product');
        endforeach; 
        wp_reset_postdata(); ?>
      </div>
    </div>
  <?php endif; ?>

  <!-- 7. Compatible Accessories (Aux Contacts, Shunt Trips, Busbars, Mounting Kits) -->
  <?php if (!empty($accessories)): ?>
    <div style="margin-top:2.5rem; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:1.75rem;">
      <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:0 0 0.5rem 0;">
        Verified Factory Accessories & Add-Ons
      </h2>
      <p style="color:#64748b; font-size:0.875rem; margin:0 0 1.25rem 0;">
        OEM auxiliary switches, shunt trips, undervoltage releases, and DIN-rail mounting busbars.
      </p>
      <div class="dp-product-grid" style="grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));">
        <?php foreach ($accessories as $rel): 
          $a_id = $rel['target_product_id'];
          $post = get_post($a_id);
          if (!$post) continue;
          setup_postdata($post);
          wc_get_template_part('content', 'product');
        endforeach; 
        wp_reset_postdata(); ?>
      </div>
    </div>
  <?php endif; ?>

  <!-- 8. Direct Drop-In Replacements / Superseded Models -->
  <?php if (!empty($replacements)): ?>
    <div style="margin-top:2.5rem; background:#fffbeb; border:1px solid #fef3c7; border-radius:8px; padding:1.75rem;">
      <h2 style="font-size:1.25rem; font-weight:800; color:#92400e; margin:0 0 0.5rem 0;">
        Direct Replacement / Superseded Equivalents
      </h2>
      <p style="color:#78350f; font-size:0.875rem; margin:0 0 1.25rem 0;">
        Upgraded generation models with matching mounting footprint, electrical terminal pitch, and trip curve ratings.
      </p>
      <div class="dp-product-grid" style="grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));">
        <?php foreach ($replacements as $rel): 
          $r_id = $rel['target_product_id'];
          $post = get_post($r_id);
          if (!$post) continue;
          setup_postdata($post);
          wc_get_template_part('content', 'product');
        endforeach; 
        wp_reset_postdata(); ?>
      </div>
    </div>
  <?php endif; ?>

  <!-- Sticky Mobile Bottom CTA Bar -->
  <div class="dp-sticky-mobile-cta">
    <button 
      type="button" 
      class="dp-btn-rfq-add" 
      data-product-id="<?php echo esc_attr($product_id); ?>" 
      data-product-name="<?php echo esc_attr(get_the_title()); ?>"
      style="flex:1; background:#0f172a; color:#fff; font-weight:700; border:none; padding:0.75rem; border-radius:4px; font-size:0.875rem;"
    >
      Request Quote
    </button>
    <a 
      href="<?php echo esc_url($wa_url); ?>" 
      target="_blank" 
      rel="noopener"
      style="background:#22c55e; color:#fff; font-weight:700; text-decoration:none; padding:0.75rem 1rem; border-radius:4px; font-size:0.875rem; display:flex; align-items:center;"
    >
      WhatsApp
    </a>
  </div>
</div>

<?php
endwhile;
get_footer();
