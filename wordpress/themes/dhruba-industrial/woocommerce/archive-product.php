<?php
/**
 * Industrial Shop & Category Archive Template
 *
 * Implements high-performance category-aware faceted browsing for 20,000-50,000 products.
 *
 * @package DhrubaIndustrial
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

$current_cat = is_tax('product_cat') ? get_queried_object() : null;
$category_slug = $current_cat ? $current_cat->slug : 'all';

// Determine active category family for dynamic facet rendering
$is_eee   = $category_slug === 'eee' || term_is_ancestor_of(get_term_by('slug', 'eee', 'product_cat')->term_id ?? 0, $current_cat->term_id ?? 0, 'product_cat');
$is_cctv  = $category_slug === 'cctv' || term_is_ancestor_of(get_term_by('slug', 'cctv', 'product_cat')->term_id ?? 0, $current_cat->term_id ?? 0, 'product_cat');
$is_solar = $category_slug === 'solar' || term_is_ancestor_of(get_term_by('slug', 'solar', 'product_cat')->term_id ?? 0, $current_cat->term_id ?? 0, 'product_cat');
?>

<div class="dp-container" style="padding-top:1.5rem; padding-bottom:3rem;">
  <!-- Breadcrumbs -->
  <div class="dp-breadcrumb">
    <a href="<?php echo esc_url(home_url('/')); ?>">Home</a> &gt; 
    <a href="<?php echo esc_url(home_url('/shop/')); ?>">Catalog</a>
    <?php if ($current_cat): ?>
      &gt; <span style="color:#0f172a; font-weight:600;"><?php echo esc_html($current_cat->name); ?></span>
    <?php endif; ?>
  </div>

  <!-- Category Title & Industrial Stats -->
  <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #e2e8f0; padding-bottom:1rem; margin-bottom:1.5rem;">
    <div>
      <h1 style="font-size:1.75rem; font-weight:800; color:#0f172a; margin:0;">
        <?php echo $current_cat ? esc_html($current_cat->name) : 'All Industrial Products'; ?>
      </h1>
      <p style="color:#64748b; font-size:0.875rem; margin:0.35rem 0 0 0;">
        Direct factory-authorized distribution, genuine manufacturer datasheets, and BDT quotes for industrial procurement.
      </p>
    </div>
    <div style="font-size:0.875rem; color:#64748b; font-weight:600;">
      Showing <?php echo wc_get_loop_prop('total'); ?> verified models
    </div>
  </div>

  <!-- Layout: 2-Column Sidebar + Grid -->
  <div style="display:grid; grid-template-columns:260px 1fr; gap:2rem;">
    
    <!-- Left Column: Category-Aware Technical Filter Facets -->
    <aside style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:1.25rem; height:fit-content;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <span style="font-weight:700; font-size:0.95rem; text-transform:uppercase; letter-spacing:0.5px; color:#0f172a;">Technical Filters</span>
        <?php if (!empty($_GET)): ?>
          <a href="<?php echo esc_url(remove_query_arg(array_keys($_GET))); ?>" style="font-size:0.75rem; color:#ef4444; text-decoration:none; font-weight:600;">Clear All</a>
        <?php endif; ?>
      </div>

      <form method="get" action="">
        <!-- Brand Facet -->
        <div style="margin-bottom:1.5rem; border-bottom:1px solid #f1f5f9; padding-bottom:1rem;">
          <label style="display:block; font-weight:700; font-size:0.8125rem; margin-bottom:0.5rem; color:#334155;">Manufacturer / Brand</label>
          <?php
          $brands = get_terms(['taxonomy' => 'dp_brand', 'hide_empty' => true]);
          if (!empty($brands) && !is_wp_error($brands)) {
              foreach (array_slice($brands, 0, 8) as $b) {
                  $checked = isset($_GET['brand']) && (is_array($_GET['brand']) ? in_array($b->slug, $_GET['brand'], true) : $_GET['brand'] === $b->slug);
                  echo '<label style="display:flex; align-items:center; gap:0.5rem; font-size:0.8125rem; color:#475569; margin-bottom:0.35rem; cursor:pointer;">';
                  echo '<input type="checkbox" name="brand[]" value="' . esc_attr($b->slug) . '" ' . ($checked ? 'checked' : '') . ' onchange="this.form.submit()">';
                  echo '<span>' . esc_html($b->name) . '</span>';
                  echo '</label>';
              }
          }
          ?>
        </div>

        <?php if ($is_eee || (!$is_cctv && !$is_solar)): ?>
          <!-- EEE: Rated Current Filter -->
          <div style="margin-bottom:1.5rem; border-bottom:1px solid #f1f5f9; padding-bottom:1rem;">
            <label style="display:block; font-weight:700; font-size:0.8125rem; margin-bottom:0.5rem; color:#334155;">Rated Current (A)</label>
            <div style="display:flex; flex-wrap:wrap; gap:0.35rem;">
              <?php foreach (['6A', '10A', '16A', '20A', '25A', '32A', '40A', '63A', '100A', '250A'] as $curr): ?>
                <a href="<?php echo esc_url(add_query_arg('current', $curr)); ?>" style="padding:0.25rem 0.5rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; font-size:0.75rem; text-decoration:none; color:#334155; font-weight:600;">
                  <?php echo esc_html($curr); ?>
                </a>
              <?php endforeach; ?>
            </div>
          </div>

          <!-- EEE: Poles Filter -->
          <div style="margin-bottom:1.5rem; border-bottom:1px solid #f1f5f9; padding-bottom:1rem;">
            <label style="display:block; font-weight:700; font-size:0.8125rem; margin-bottom:0.5rem; color:#334155;">Poles</label>
            <div style="display:flex; gap:0.5rem;">
              <?php foreach (['1P', '2P', '3P', '4P'] as $pole): ?>
                <a href="<?php echo esc_url(add_query_arg('pole', $pole)); ?>" style="padding:0.25rem 0.6rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; font-size:0.75rem; text-decoration:none; color:#334155; font-weight:600;">
                  <?php echo esc_html($pole); ?>
                </a>
              <?php endforeach; ?>
            </div>
          </div>
        <?php endif; ?>

        <?php if ($is_solar): ?>
          <!-- Solar: Inverter Power Rating -->
          <div style="margin-bottom:1.5rem; border-bottom:1px solid #f1f5f9; padding-bottom:1rem;">
            <label style="display:block; font-weight:700; font-size:0.8125rem; margin-bottom:0.5rem; color:#334155;">Inverter Capacity (kW)</label>
            <div style="display:flex; flex-wrap:wrap; gap:0.35rem;">
              <?php foreach (['3 kW', '5 kW', '6 kW', '10 kW', '15 kW', '20 kW', '50 kW'] as $pwr): ?>
                <a href="<?php echo esc_url(add_query_arg('power', $pwr)); ?>" style="padding:0.25rem 0.5rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; font-size:0.75rem; text-decoration:none; color:#334155; font-weight:600;">
                  <?php echo esc_html($pwr); ?>
                </a>
              <?php endforeach; ?>
            </div>
          </div>
        <?php endif; ?>

        <!-- Availability Toggle -->
        <div style="margin-top:1rem;">
          <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.8125rem; color:#16a34a; font-weight:600; cursor:pointer;">
            <input type="checkbox" name="in_stock" value="1" <?php checked(isset($_GET['in_stock'])); ?> onchange="this.form.submit()">
            <span>Show Only Ready Stock (Barishal)</span>
          </label>
        </div>
      </form>
    </aside>

    <!-- Right Column: Products Stream -->
    <main>
      <?php if (woocommerce_product_loop()): ?>
        <div class="dp-product-grid">
          <?php while (have_posts()): the_post(); ?>
            <?php wc_get_template_part('content', 'product'); ?>
          <?php endwhile; ?>
        </div>

        <!-- Pagination -->
        <div style="margin-top:2.5rem; display:flex; justify-content:center;">
          <?php echo paginate_links(['type' => 'list']); ?>
        </div>
      <?php else: ?>
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:3rem; text-align:center;">
          <h3 style="color:#0f172a; font-weight:700;">No products match current filters.</h3>
          <p style="color:#64748b; font-size:0.875rem;">Try relaxing your filter parameters or search directly by exact manufacturer part number.</p>
          <a href="<?php echo esc_url(home_url('/shop/')); ?>" style="display:inline-block; margin-top:1rem; padding:0.5rem 1rem; background:#0f172a; color:#ffffff; text-decoration:none; border-radius:4px; font-weight:600;">
            Reset All Filters
          </a>
        </div>
      <?php endif; ?>
    </main>
  </div>
</div>

<?php
get_footer();
