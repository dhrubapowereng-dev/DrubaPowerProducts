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
| `dhruba-catalog-core.zip` | `wp-content/plugins/` | Plugin | Database schemas, custom tables, Meilisearch indexer, RFQ engine, WooCommerce order bridge, REST API. |
| `dhruba-industrial-theme.zip` | `wp-content/themes/` | Theme | Industrial design system, category-aware archive templates, single product specification matrices, mobile sticky action bar. |

---

## 3. Step-by-Step Installation

### Step A: Install the Plugin (`dhruba-catalog-core`)
1. In your WordPress Admin Dashboard, navigate to **Plugins > Add New > Upload Plugin**.
2. Select `dhruba-catalog-core.zip` and click **Install Now**.
3. Click **Activate Plugin**.
4. Upon activation, the plugin automatically provisions the 4 custom optimized database tables:
   - `{$wpdb->prefix}dp_specs` (for 50,000+ attribute queries without `wp_postmeta` bottleneck)
   - `{$wpdb->prefix}dp_documents` (for SHA-256 verified PDF datasheets & CAD diagrams)
   - `{$wpdb->prefix}dp_rfqs` (for industrial procurement quotations)
   - `{$wpdb->prefix}dp_rfq_items` (for quote line items and contractor specs)

### Step B: Install the Theme (`dhruba-industrial`)
1. In your WordPress Admin Dashboard, navigate to **Appearance > Themes > Add New > Upload Theme**.
2. Select `dhruba-industrial-theme.zip` and click **Install Now**.
3. Click **Activate**.

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
