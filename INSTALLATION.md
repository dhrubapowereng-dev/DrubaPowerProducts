# Dhruba Power — WordPress & WooCommerce Installation Guide

This document describes how to deploy the **Dhruba Power** industrial catalog engine and theme onto a production WordPress + WooCommerce installation.

---

## 1. System Requirements

- **PHP**: 8.1 or 8.2 (with `ext-pdo`, `ext-mysqli`, `ext-mbstring`, `ext-curl`, `ext-zip`)
- **MySQL / MariaDB**: MySQL 8.0+ or MariaDB 10.6+ (InnoDB storage engine required)
- **WordPress**: 6.4+
- **WooCommerce**: 8.0+ (Tested up to 9.2+)
- **LiteSpeed Cache / Redis**: Supported for object cache and transient acceleration
- **Meilisearch** *(Optional, recommended for >20,000 SKUs)*: v1.6+ (Runs locally or remote via HTTP bearer token)

---

## 2. Package Summary

| Package | Path | Type | Function |
| :--- | :--- | :--- | :--- |
| `dhruba-catalog-core.zip` | `wp-content/plugins/` | Plugin | Database schemas, custom tables, Meilisearch indexer, RFQ engine, Expert management with WhatsApp numbers, WooCommerce order bridge, REST API. |
| `socialnomic-solar-child.zip` | `wp-content/themes/` | Child Theme | **(Recommended)** Preserves existing `socialnomic-solar` design, Elementor templates, and header/footer while fixing submenu z-index/clipping and adding technical catalog templates & 4-card carousels. |
| `dhruba-industrial-theme.zip` | `wp-content/themes/` | Theme | Standalone industrial design system, category-aware archive templates, single product specification matrices, mobile sticky action bar. |
| `DHRUBA-POWER-FINAL-PRODUCTION.zip` | Root Bundle | Master Package | Complete deployment bundle containing plugin, child theme, standalone theme, importer ETL, and all documentation. |

---

## 3. Step-by-Step Installation

### Step A: Install the Plugin (`dhruba-catalog-core`)
1. In your WordPress Admin Dashboard, navigate to **Plugins > Add New > Upload Plugin**.
2. Select `dhruba-catalog-core.zip` (or `dhruba-power-catalog-core.zip`) and click **Install Now**.
3. Click **Activate Plugin**.
4. Upon activation, the plugin automatically:
   - Provisions the 4 custom optimized database tables (`dp_specs`, `dp_documents`, `dp_rfqs`, `dp_rfq_items`).
   - Registers the Certified Experts custom post type (`dp_expert`) with individual WhatsApp consultation links.
   - Bootstraps REST API endpoints (`/wp-json/dhruba/v1/products`, `/wp-json/dhruba/v1/rfq`, `/wp-json/dhruba/v1/experts`).

### Step B: Install the Theme
**For existing production sites running Socialnomic Solar:**
1. In your WordPress Admin Dashboard, navigate to **Appearance > Themes > Add New > Upload Theme**.
2. Select `socialnomic-solar-child.zip` and click **Install Now**.
3. Click **Activate**. This retains all current Elementor pages, header styling, and typography without modifying parent theme files.

**For fresh standalone installations:**
1. Select `dhruba-industrial-theme.zip`, click **Install Now**, and **Activate**.

### Step C: Configure Pages & Permalinks
1. Navigate to **Settings > Permalinks** and ensure **Post name** (`/%postname%/`) is selected. Click **Save Changes** to flush rewrite rules.
2. The plugin will create or register template endpoints:
   - `/rfq/` (Commercial RFQ multi-item basket & BOQ upload)
   - `/compare/` (Side-by-side industrial parameter comparison matrix)
   - `/wishlist/` (Project Bill of Materials builder)

---

## 4. Meilisearch Engine Setup (Optional, for 50,000+ SKUs)

If Meilisearch is running on your server:
1. Define the following in `wp-config.php`:
   ```php
   define('DP_MEILISEARCH_HOST', 'http://127.0.0.1:7700');
   define('DP_MEILISEARCH_KEY', 'your-master-api-key');
   define('DP_MEILISEARCH_INDEX', 'dhruba_products');
   ```
2. Trigger the indexer via WP-CLI:
   ```bash
   wp dhruba-catalog index-all
   ```
   *Note: If Meilisearch is not configured, the plugin automatically falls back to indexed native MySQL queries without errors.*

---

## 5. Security & Verification Checklist

- [x] Non-executable upload directory configured: `/wp-content/uploads/dhruba_rfq/` protected with `.htaccess` and `index.php`.
- [x] REST API endpoints (`/wp-json/dhruba/v1/`) protected with nonce and sanitized payloads.
- [x] Zero admin dashboard leaks to unauthenticated visitors.
- [x] Elementor compatibility: Product cards and service blocks integrate cleanly without causing page-builder query bloat.
