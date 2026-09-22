<?php
/**
 * Footer Template for Dhruba Industrial Theme
 *
 * @package DhrubaIndustrial
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<footer style="background:#0f172a; color:#94a3b8; font-size:0.875rem; margin-top:4rem; padding-top:3rem; padding-bottom:2rem; border-top:3px solid #d97706;">
  <div class="dp-container">
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:2.5rem; margin-bottom:2.5rem;">
      <!-- Col 1: About -->
      <div>
        <div style="color:#ffffff; font-weight:800; font-size:1.125rem; margin-bottom:1rem;">DHRUBA POWER</div>
        <p style="line-height:1.6; font-size:0.8125rem;">
          Specialized distributor & engineering supplier of high-reliability low & medium voltage electrical switchgear, industrial automation, CCTV surveillance, and solar energy systems in Bangladesh.
        </p>
        <p style="font-size:0.8125rem; color:#cbd5e1; margin-top:0.75rem;">
          <strong>Location:</strong> Barishal Division, Bangladesh<br>
          <strong>Hotline:</strong> +880 1700-000000<br>
          <strong>Email:</strong> dhrubapowereng@gmail.com
        </p>
      </div>

      <!-- Col 2: Top Brands -->
      <div>
        <div style="color:#ffffff; font-weight:700; font-size:0.95rem; margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.5px;">Authorized Brands</div>
        <ul style="list-style:none; padding:0; margin:0; line-height:2; font-size:0.8125rem;">
          <li><a href="<?php echo esc_url(home_url('/brands/abb/')); ?>" style="color:#94a3b8; text-decoration:none;">ABB Switchgear & Automation</a></li>
          <li><a href="<?php echo esc_url(home_url('/brands/schneider-electric/')); ?>" style="color:#94a3b8; text-decoration:none;">Schneider Electric (Acti9/Compact)</a></li>
          <li><a href="<?php echo esc_url(home_url('/brands/siemens/')); ?>" style="color:#94a3b8; text-decoration:none;">Siemens SENTRON Protection</a></li>
          <li><a href="<?php echo esc_url(home_url('/brands/hikvision/')); ?>" style="color:#94a3b8; text-decoration:none;">Hikvision Surveillance</a></li>
          <li><a href="<?php echo esc_url(home_url('/brands/growatt/')); ?>" style="color:#94a3b8; text-decoration:none;">Growatt Solar Inverters</a></li>
          <li><a href="<?php echo esc_url(home_url('/brands/longi/')); ?>" style="color:#94a3b8; text-decoration:none;">LONGi Solar Photovoltaic</a></li>
        </ul>
      </div>

      <!-- Col 3: Product Categories -->
      <div>
        <div style="color:#ffffff; font-weight:700; font-size:0.95rem; margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.5px;">Product Divisions</div>
        <ul style="list-style:none; padding:0; margin:0; line-height:2; font-size:0.8125rem;">
          <li><a href="<?php echo esc_url(home_url('/eee/mcb/')); ?>" style="color:#94a3b8; text-decoration:none;">Miniature Circuit Breakers (MCB)</a></li>
          <li><a href="<?php echo esc_url(home_url('/eee/mccb/')); ?>" style="color:#94a3b8; text-decoration:none;">Moulded Case Circuit Breakers (MCCB)</a></li>
          <li><a href="<?php echo esc_url(home_url('/cctv/ip-camera/')); ?>" style="color:#94a3b8; text-decoration:none;">Industrial IP Cameras & NVRs</a></li>
          <li><a href="<?php echo esc_url(home_url('/solar/hybrid-inverter/')); ?>" style="color:#94a3b8; text-decoration:none;">Hybrid & On-Grid Solar Inverters</a></li>
          <li><a href="<?php echo esc_url(home_url('/rfq/')); ?>" style="color:#f59e0b; text-decoration:none; font-weight:600;">BOQ/BOM File Upload</a></li>
        </ul>
      </div>

      <!-- Col 4: Commercial & RFQ -->
      <div>
        <div style="color:#ffffff; font-weight:700; font-size:0.95rem; margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.5px;">RFQ & Engineering</div>
        <p style="font-size:0.8125rem; line-height:1.6;">
          Submit your tender specifications, single-line diagrams (SLD), or Bill of Quantities (BOQ). Our engineering sales team delivers official formal quotations in BDT.
        </p>
        <a href="<?php echo esc_url(home_url('/rfq/')); ?>" style="display:inline-block; margin-top:0.5rem; background:#d97706; color:#ffffff; padding:0.6rem 1rem; border-radius:4px; font-weight:700; text-decoration:none; font-size:0.8125rem;">
          Open RFQ Portal
        </a>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div style="border-top:1px solid #1e293b; padding-top:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; font-size:0.75rem;">
      <div>
        © <?php echo gmdate('Y'); ?> Dhruba Power. All rights reserved. Engineering specifications subject to manufacturer technical revisions.
      </div>
      <div>
        Built with Dhruba Catalog Core Platform on WooCommerce • High-Performance Search
      </div>
    </div>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
