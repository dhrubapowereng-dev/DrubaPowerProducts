<?php
/**
 * Taxonomy Template for Product Series (dp_series)
 *
 * Implements series-level industrial catalogue view (e.g., ABB SH200 Series).
 *
 * @package DhrubaIndustrial
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

$series = get_queried_object();
?>

<div class="dp-container" style="padding-top:1.5rem; padding-bottom:3rem;">
  <div class="dp-breadcrumb">
    <a href="<?php echo esc_url(home_url('/')); ?>">Home</a> &gt; 
    <a href="<?php echo esc_url(home_url('/shop/')); ?>">Catalog</a> &gt; 
    <span>Series</span> &gt; 
    <span style="color:#0f172a; font-weight:600;"><?php echo esc_html($series->name); ?></span>
  </div>

  <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:2rem; margin-bottom:2rem;">
    <span style="font-size:0.75rem; font-weight:700; color:#d97706; text-transform:uppercase;">Product Series Family</span>
    <h1 style="font-size:1.875rem; font-weight:900; color:#0f172a; margin:0.25rem 0 0.5rem 0;"><?php echo esc_html($series->name); ?></h1>
    <p style="color:#475569; font-size:0.875rem; margin:0; max-width:700px;">
      <?php echo esc_html($series->description ?: "Standardized modular engineering line. Browse all configurations, amperages, pole options, and trip characteristics within this product family."); ?>
    </p>
  </div>

  <h2 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin-bottom:1rem;">
    All Available Models in <?php echo esc_html($series->name); ?>
  </h2>

  <?php if (have_posts()): ?>
    <div class="dp-product-grid">
      <?php while (have_posts()): the_post(); ?>
        <?php wc_get_template_part('content', 'product'); ?>
      <?php endwhile; ?>
    </div>
    <div style="margin-top:2.5rem; display:flex; justify-content:center;">
      <?php echo paginate_links(['type' => 'list']); ?>
    </div>
  <?php else: ?>
    <div style="background:#fff; padding:2.5rem; border-radius:6px; border:1px solid #e2e8f0; text-align:center;">
      <h3 style="color:#0f172a; margin:0 0 0.5rem 0;">No active models catalogued for this series yet.</h3>
      <p style="color:#64748b; font-size:0.875rem;">Submit an inquiry for custom amp ratings or legacy replacements.</p>
    </div>
  <?php endif; ?>
</div>

<?php
get_footer();
