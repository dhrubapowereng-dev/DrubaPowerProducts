# Dhruba Power — Bulk Product Import & ETL Guide (50,000+ SKUs)

This guide explains how to import and synchronize large-scale industrial product catalogs into Dhruba Power using CSV, XLSX, or Python ETL pipelines.

---

## 1. Catalog Architecture Principles

1. **Independent MPN Products**: Each distinct manufacturer part number (e.g. `ABB SH201-C6`, `ABB SH201-C10`, `ABB SH201-C16`) is an independent product record. Do not merge distinct physical products into generic variations.
2. **Quote-First Commercial Model**: Industrial items are priced on request. Prices in import sheets can be left empty (`0.00` or `null`).
3. **Barishal Stock Classification**: Products are flagged as `In Stock` (Barishal Warehouse) or `Indent / Factory Lead Time`.

---

## 2. Standard CSV Import Schema

Prepare your CSV according to the following header specification:

```csv
mpn,brand,series,product_name,category,in_stock,stock_location,rated_current,poles,breaking_capacity,rated_voltage,datasheet_url,image_url
2CDS211001R0204,ABB,SH201,ABB SH201-C20 1P 20A Miniature Circuit Breaker,eee,1,Barishal Depot,20A,1P,6kA,230/400V,https://library.e.abb.com/public/datasheet.pdf,https://dhrubapower.com/images/sh201.jpg
A9F74120,Schneider,Acti9,Schneider iC60N 1P 20A C-Curve MCB,eee,1,Barishal Depot,20A,1P,6kA,230/400V,https://se.com/docs/ic60n.pdf,https://dhrubapower.com/images/ic60n.jpg
5SL6120-7,Siemens,5SL6,Siemens 5SL6120-7 1P 20A MCB 6kA,eee,1,Barishal Depot,20A,1P,6kA,230/400V,https://siemens.com/5sl6.pdf,https://dhrubapower.com/images/5sl6.jpg
DS-2CD2047G2-LU,Hikvision,ColorVu,Hikvision 4MP ColorVu Bullet IP Camera,cctv,1,Barishal Depot,12V DC / PoE,N/A,N/A,12V DC,https://hikvision.com/docs/colorvu.pdf,https://dhrubapower.com/images/cctv.jpg
MOD 5000TL3-X,Growatt,MOD,Growatt MOD 5000TL3-X 5kW 3-Phase Solar Inverter,solar,1,Barishal Depot,8.3A,3-Phase,N/A,230/400V,https://ginverter.com/mod5k.pdf,https://dhrubapower.com/images/mod5k.jpg
```

---

## 3. Importing via WP-CLI (Fastest)

For large files (>5,000 rows), use WP-CLI to avoid browser timeout:

```bash
# Preview first 10 rows without inserting
wp dhruba-catalog import /path/to/products.csv --dry-run

# Execute import with batch size of 500
wp dhruba-catalog import /path/to/products.csv --batch=500
```

---

## 4. Importing via Python ETL Pipeline

The included Python ETL script in `/importer/` provides automated validation, unit normalization, and direct database batch insertion:

```bash
cd importer
python3 etl_pipeline.py --file master_pricing_matrix.xlsx --sync-meilisearch
```

### Automatic ETL Validations:
- **MPN Uniqueness**: Duplicate part numbers are merged or updated according to primary key.
- **Specification Normalization**: Strings like `6 kA`, `6KA`, `6000 A` are normalized to `6kA` for unified filtering.
- **Image Integrity**: Verifies image URLs or assigns the authorized high-resolution OEM asset.
