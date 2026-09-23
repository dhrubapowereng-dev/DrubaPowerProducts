<?php
/**
 * Header Template for Dhruba Industrial Theme
 *
 * @package DhrubaIndustrial
 */

if (!defined('ABSPATH')) {
    exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="profile" href="https://gmpg.org/xfn/11">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="dp-header" id="dp-site-header">
  <!-- Top Utility Bar -->
  <div style="background:#0f172a; color:#94a3b8; font-size:0.75rem; padding:0.35rem 0;">
    <div class="dp-container" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <span>📍 Barishal, Bangladesh</span>
        <span style="margin:0 0.5rem;">|</span>
        <span>Authorized Industrial & Engineering Equipment Distributor</span>
      </div>
      <div>
        <span>Hotline: <strong style="color:#ffffff;">+880 1711-197767</strong></span>
        <span style="margin:0 0.5rem;">|</span>
        <a href="<?php echo esc_url(home_url('/rfq/')); ?>" style="color:#f59e0b; text-decoration:none; font-weight:600;">Request For Quote Portal</a>
      </div>
    </div>
  </div>

  <!-- Main Navigation & Search -->
  <div class="dp-container" style="padding-top:0.75rem; padding-bottom:0.75rem; display:flex; align-items:center; justify-content:space-between; gap:1.5rem;">
    <!-- Logo -->
    <a href="<?php echo esc_url(home_url('/')); ?>" style="text-decoration:none; display:flex; align-items:center; gap:0.5rem;">
      <div style="background:#0f172a; color:#ffffff; font-weight:900; font-size:1.25rem; padding:0.25rem 0.6rem; border-radius:4px; letter-spacing:-0.5px;">DP</div>
      <div>
        <div style="font-weight:800; font-size:1.15rem; color:#0f172a; line-height:1.1;">DHRUBA POWER</div>
        <div style="font-size:0.7rem; color:#64748b; letter-spacing:0.5px; text-transform:uppercase;">Engineering & Industrial Catalog</div>
      </div>
    </a>

    <!-- Big Industrial Search Box -->
    <div style="flex:1; max-width:600px;">
      <form role="search" method="get" action="<?php echo esc_url(home_url('/shop/')); ?>" style="display:flex; position:relative;">
        <input 
          type="search" 
          name="s" 
          value="<?php echo get_search_query(); ?>" 
          placeholder="<?php esc_attr_e('Search 20,000+ products by MPN, model, rating (e.g. ABB SH201-C20, 63A MCCB)...', 'dhruba-industrial'); ?>" 
          style="width:100%; padding:0.65rem 1rem; border:2px solid #cbd5e1; border-radius:6px; font-size:0.875rem; outline:none; transition:border-color 0.2s;"
          id="dp-header-search-input"
        />
        <button type="submit" style="position:absolute; right:4px; top:4px; bottom:4px; background:#0f172a; color:#fff; border:none; padding:0 1rem; border-radius:4px; font-weight:600; cursor:pointer;">
          Search
        </button>
      </form>
    </div>

    <!-- Quick Actions: RFQ Basket, Wishlist & Compare -->
    <div style="display:flex; align-items:center; gap:0.6rem;">
      <a href="<?php echo esc_url(home_url('/wishlist/')); ?>" style="text-decoration:none; color:#475569; font-size:0.875rem; font-weight:600; padding:0.5rem 0.75rem; border:1px solid #e2e8f0; border-radius:6px; display:flex; align-items:center; gap:0.35rem;" title="Saved Project BOM">
        <span>🤍 BOM</span>
        <span class="dp-wishlist-count-badge" style="background:#0f172a; color:#ffffff; border-radius:9999px; padding:0.1rem 0.4rem; font-size:0.75rem; font-weight:700; display:none;">0</span>
      </a>

      <a href="<?php echo esc_url(home_url('/compare/')); ?>" style="text-decoration:none; color:#475569; font-size:0.875rem; font-weight:600; padding:0.5rem 0.75rem; border:1px solid #e2e8f0; border-radius:6px; display:flex; align-items:center; gap:0.35rem;" title="Compare Technical Specs">
        <span>⚖️ Compare</span>
        <span class="dp-compare-count-badge" style="background:#0284c7; color:#ffffff; border-radius:9999px; padding:0.1rem 0.4rem; font-size:0.75rem; font-weight:700; display:none;">0</span>
      </a>

      <a href="<?php echo esc_url(home_url('/rfq/')); ?>" class="dp-btn-rfq-cart" style="text-decoration:none; background:#d97706; color:#ffffff; font-size:0.875rem; font-weight:700; padding:0.55rem 1rem; border-radius:6px; display:flex; align-items:center; gap:0.5rem;">
        <span>RFQ Basket</span>
        <span class="dp-rfq-count-badge" style="background:#ffffff; color:#d97706; border-radius:9999px; padding:0.1rem 0.45rem; font-size:0.75rem; font-weight:800; display:none;">0</span>
      </a>
    </div>
  </div>

  <!-- Category Hierarchy Quick Bar -->
  <nav style="background:#f8fafc; border-top:1px solid #e2e8f0; font-size:0.875rem; font-weight:600;">
    <div class="dp-container" style="display:flex; gap:2rem; overflow-x:auto; padding-top:0.5rem; padding-bottom:0.5rem;">
      <a href="<?php echo esc_url(home_url('/eee/')); ?>" style="color:#0f172a; text-decoration:none; white-space:nowrap;">⚡ Electrical Engineering (EEE)</a>
      <a href="<?php echo esc_url(home_url('/cctv/')); ?>" style="color:#0f172a; text-decoration:none; white-space:nowrap;">📹 CCTV & Security</a>
      <a href="<?php echo esc_url(home_url('/solar/')); ?>" style="color:#0f172a; text-decoration:none; white-space:nowrap;">☀️ Solar Products</a>
      <a href="<?php echo esc_url(home_url('/brands/')); ?>" style="color:#0f172a; text-decoration:none; white-space:nowrap;">🏷️ Brands Directory</a>
      <a href="<?php echo esc_url(home_url('/rfq/')); ?>" style="color:#b45309; text-decoration:none; white-space:nowrap;">📋 Upload BOQ/BOM</a>
    </div>
  </nav>
</header>
