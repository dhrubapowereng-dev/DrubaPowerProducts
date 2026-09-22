<?php
/**
 * Taxonomy Template for Brands (dp_brand)
 *
 * Provides dedicated manufacturer landing pages (ABB, Siemens, Schneider, Hikvision, etc.)
 * with series breakdown, authorized distributor badges, and series-based filtering.
 *
 * @package DhrubaIndustrial
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

$brand = get_queried_object();
?>

<div class="dp-container" style="padding-top:1.5rem; padding-bottom:3rem;">
  <div class="dp-breadcrumb">
    <a href="<?php echo esc_url(home_url('/')); ?>">Home</a> &gt; 
    <a href="<?php echo esc_url(home_url('/brands/')); ?>">Brands</a> &gt; 
    <span style="color:#0f172a; font-weight:600;"><?php echo esc_html($brand->name); ?></span>
  </div>

  <!-- Brand Hero Banner -->
  <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:2rem; margin-bottom:2rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.5rem;">
    <div>
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <h1 style="font-size:2rem; font-weight:900; color:#0f172a; margin:0;"><?php echo esc_html($brand->name); ?></h1>
        <span style="background:#e0f2fe; color:#0284c7; font-size:0.75rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:4px;">Authorized Supply</span>
      </div>
      <p style="color:#475569; max-width:650px; font-size:0.875rem; margin:0.5rem 0 0 0;">
        <?php echo esc_html($brand->description ?: "Complete authorized engineering portfolio of genuine {$brand->name} industrial components with verified datasheets, manufacturer warranties, and local Bangladesh stock delivery."); ?>
      </p>
    </div>

    <div>
      <a href="<?php echo esc_url(home_url('/rfq/')); ?>" style="background:#d97706; color:#ffffff; padding:0.75rem 1.25rem; font-weight:700; border-radius:6px; text-decoration:none; font-size:0.875rem;">
        Request Bulk <?php echo esc_html($brand->name); ?> Quote
      </a>
    </div>
  </div>

  <!-- Product Stream -->
  <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin-bottom:1rem;">
    <?php echo esc_html($brand->name); ?> Models in Stock
  </h2>

  <?php if (have_posts()): ?>
    <div class="dp-product-grid">
      <?php while (have_posts()): the_post(); ?>
        <?php wc_get_template_part('content', 'product'); ?>
      <?php endwhile; ?>
    </div>

    <div style="margin-top:2rem; display:flex; justify-content:center;">
      <?php echo paginate_links(['type' => 'list']); ?>
    </div>
  <?php else: ?>
    <div style="background:#fff; padding:2rem; border-radius:6px; border:1px solid #e2e8f0; text-align:center;">
      No models catalogued for this manufacturer yet.
    </div>
  <?php endif; ?>
</div>

<?php
get_footer();
