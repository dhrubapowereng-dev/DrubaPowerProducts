# Dhruba Power — Catalog Architecture & Database Migration Guide

This document details how the Dhruba Power catalog scales beyond the traditional WordPress `wp_postmeta` bottleneck to comfortably handle 20,000 to 50,000+ technical SKUs with instant query performance.

---

## 1. Architectural Problem with Default WooCommerce at Scale

On standard WooCommerce, each product has 20-40 technical attributes stored across `wp_postmeta` and `wp_termmeta`. At 50,000 products:
- `wp_postmeta` balloons to **1,500,000+ rows**.
- Multi-attribute faceted filtering (e.g. `Rated Current = 20A AND Poles = 1P AND Breaking Capacity = 6kA`) generates **5+ `INNER JOIN` operations** across millions of unindexed rows.
- Query response times degrade from 50ms to 4.5+ seconds, overloading database memory.

---

## 2. The Custom Schema Solution

`dhruba-catalog-core` leaves the core `wp_posts` row for WooCommerce compatibility, but extracts high-cardinality technical parameters into dedicated relational tables:

```sql
-- 1. Optimized Relational Specifications Table
CREATE TABLE IF NOT EXISTS `wp_dp_specs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `spec_key` VARCHAR(64) NOT NULL,
  `spec_label` VARCHAR(128) NOT NULL,
  `spec_value` VARCHAR(255) NOT NULL,
  `spec_unit` VARCHAR(32) DEFAULT '',
  `normalized_value` VARCHAR(64) DEFAULT '',
  `is_primary` TINYINT(1) DEFAULT 0,
  `display_order` SMALLINT UNSIGNED DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_spec_lookup` (`spec_key`, `normalized_value`),
  KEY `idx_fast_filter` (`spec_key`, `spec_value`(64))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Technical Documents & Datasheets
CREATE TABLE IF NOT EXISTS `wp_dp_documents` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `doc_title` VARCHAR(255) NOT NULL,
  `doc_type` VARCHAR(32) NOT NULL, -- 'datasheet', 'manual', 'cad', 'certificate'
  `doc_url` VARCHAR(512) NOT NULL,
  `file_size_kb` INT UNSIGNED DEFAULT 0,
  `sha256_hash` CHAR(64) DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idx_doc_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3. Migration from Existing WooCommerce Products

If your existing WordPress site already has products in standard WooCommerce attributes, run the automated migration command:

```bash
wp dhruba-catalog migrate-existing-postmeta
```

### What this migration command does:
1. Iterates through existing `product` posts in memory-efficient batches of 250 items.
2. Reads WooCommerce attributes (`_product_attributes`) and postmeta.
3. Automatically parses numeric values and standardizes units (e.g. `20 Amps` -> `20`, unit: `A`).
4. Populates `wp_dp_specs` with relational indices.
5. Indexes exact `_mpn` and `_sku` into the primary lookup cache.

---

## 4. Idempotency & Re-running Migrations

The migration routines are fully **idempotent**:
- Running the script twice will **not** create duplicate rows.
- Existing records are matched on `(product_id, spec_key)` and updated in-place via `ON DUPLICATE KEY UPDATE`.
