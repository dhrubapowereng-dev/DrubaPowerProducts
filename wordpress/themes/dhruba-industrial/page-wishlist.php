<?php
/**
 * Template Name: Wishlist & Project BOM
 *
 * Client-side offline-first engineering wishlist and project bill of materials.
 *
 * @package DhrubaIndustrial
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>

<div class="dp-container" style="padding-top:2rem; padding-bottom:4rem;">
  <div style="border-bottom:2px solid #e2e8f0; padding-bottom:1.5rem; margin-bottom:2rem; display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:1rem;">
    <div>
      <span style="font-size:0.8125rem; font-weight:700; color:#0284c7; text-transform:uppercase; letter-spacing:0.5px;">Engineering Projects</span>
      <h1 style="font-size:2rem; font-weight:900; color:#0f172a; margin:0.25rem 0 0.5rem 0;">Saved Products & Project Wishlist</h1>
      <p style="color:#64748b; font-size:0.95rem; margin:0;">
        Manage your saved electrical switchgear, solar components, and surveillance models. Move entire project lists to the RFQ basket with one click.
      </p>
    </div>
    <div style="display:flex; gap:0.75rem;">
      <button type="button" id="dp-wishlist-move-to-rfq-all" class="dp-btn-primary" style="background:#0f172a; color:#fff; font-weight:700; font-size:0.875rem; padding:0.65rem 1.25rem; border-radius:6px; border:none; cursor:pointer;">
        📋 Move All Items to RFQ Basket
      </button>
      <button type="button" id="dp-wishlist-clear-all" style="background:#f1f5f9; color:#ef4444; font-weight:600; font-size:0.875rem; padding:0.65rem 1rem; border-radius:6px; border:1px solid #e2e8f0; cursor:pointer;">
        Clear List
      </button>
    </div>
  </div>

  <div id="dp-wishlist-container" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:1.5rem; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
    <table style="width:100%; border-collapse:collapse; font-size:0.875rem;">
      <thead>
        <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; text-align:left;">
          <th style="padding:0.75rem;">Product & Part Number</th>
          <th style="padding:0.75rem;">Brand</th>
          <th style="padding:0.75rem;">Key Rating</th>
          <th style="padding:0.75rem; text-align:center;">Action</th>
          <th style="padding:0.75rem; width:40px;"></th>
        </tr>
      </thead>
      <tbody id="dp-wishlist-tbody">
        <!-- Injected via JavaScript -->
      </tbody>
    </table>
    <div id="dp-wishlist-empty" style="text-align:center; padding:3.5rem 1rem; color:#64748b;">
      <div style="font-size:2.5rem; margin-bottom:0.75rem;">📑</div>
      <h3 style="color:#0f172a; font-weight:700; margin:0 0 0.5rem 0;">Your project wishlist is currently empty.</h3>
      <p style="font-size:0.875rem; margin:0 0 1.25rem 0;">Save models while browsing the catalog to build tender schedules or multi-line bills of materials.</p>
      <a href="<?php echo esc_url(home_url('/shop/')); ?>" style="display:inline-block; background:#0f172a; color:#ffffff; padding:0.6rem 1.25rem; border-radius:4px; text-decoration:none; font-weight:700; font-size:0.875rem;">
        Browse Industrial Catalog
      </a>
    </div>
  </div>
</div>

<?php
get_footer();
