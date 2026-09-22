<?php
/**
 * Template Name: Compare Products
 *
 * Side-by-side technical specification matrix comparison.
 *
 * @package DhrubaIndustrial
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>

<div class="dp-container" style="padding-top:2rem; padding-bottom:4rem;">
  <div style="border-bottom:2px solid #e2e8f0; padding-bottom:1rem; margin-bottom:2rem; display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:1rem;">
    <div>
      <span style="font-size:0.8125rem; font-weight:700; color:#0284c7; text-transform:uppercase;">Engineering Analysis</span>
      <h1 style="font-size:1.875rem; font-weight:900; color:#0f172a; margin:0.25rem 0 0.5rem 0;">Technical Specification Comparison Matrix</h1>
      <p style="color:#64748b; font-size:0.95rem; margin:0;">
        Compare industrial electrical ratings, breaking capacities, poles, and dimensions across multiple models side-by-side.
      </p>
    </div>
    <div style="display:flex; gap:0.5rem;">
      <button type="button" id="dp-compare-clear-btn" style="background:#f1f5f9; color:#ef4444; border:1px solid #e2e8f0; padding:0.5rem 1rem; border-radius:4px; font-weight:600; font-size:0.8125rem; cursor:pointer;">
        Clear Comparison
      </button>
      <a href="<?php echo esc_url(home_url('/shop/')); ?>" style="background:#0f172a; color:#ffffff; padding:0.5rem 1rem; border-radius:4px; font-weight:600; font-size:0.8125rem; text-decoration:none;">
        + Add More Models
      </a>
    </div>
  </div>

  <div id="dp-compare-matrix-wrapper" style="overflow-x:auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:1.5rem; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
    <div id="dp-compare-empty" style="text-align:center; padding:3rem; color:#64748b;">
      <div style="font-size:2.5rem; margin-bottom:0.5rem;">⚖️</div>
      <h3 style="color:#0f172a; font-weight:700; margin:0 0 0.5rem 0;">No products currently selected for comparison.</h3>
      <p style="font-size:0.875rem;">Click "Compare" on any catalog item to analyze technical specifications side-by-side.</p>
    </div>
    <div id="dp-compare-table-container"></div>
  </div>
</div>

<?php
get_footer();
