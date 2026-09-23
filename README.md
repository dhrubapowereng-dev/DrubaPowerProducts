# Dhruba Power & Engineering — Production Web Platform & WordPress Engine

**Dhruba Power & Engineering** is an authorized industrial electrical, solar, and substation engineering provider based in Barishal, Bangladesh. This repository houses the modernized public-facing web platform and the native WordPress + WooCommerce plugin/theme suite.

---

## 🌟 Business Overview

- **Company**: Dhruba Power & Engineering
- **Address**: Khan Sarak, Kazipar, C&B Road, Barishal 8200, Bangladesh
- **Phone / Hotline**: +880 1711-197767
- **Email**: info@dhrubapower.com
- **WhatsApp**: +880 1711-197767
- **Core Engineering Services**:
  1. Sub-Station Engineering & Commissioning
  2. Industrial & Commercial Solar Systems
  3. Lightning Protection & Arresters
  4. Industrial Electrical Wiring & HT/LT Distribution
  5. CC-TV & Surveillance Systems
  6. Custom HT/LT Switchgear & Panel Boards
- **Track Record**: 7+ Years Experience | 500+ Projects Completed | 24/7 Emergency Response

---

## 📦 Deliverables & Repository Structure

- `wordpress/plugins/dhruba-catalog-core/`: Custom WordPress plugin for high-scale catalog schemas, Meilisearch full-text indexing, multi-item RFQ desk, and WooCommerce order conversion.
- `wordpress/themes/dhruba-industrial/`: Lightweight industrial WordPress theme tailored to technical buyers, zero-pill typography, category-aware faceted archives, and mobile action bars.
- `public/downloads/`: Pre-packaged, production-ready `.zip` archives:
  - `dhruba-catalog-core.zip` (68 KB)
  - `dhruba-industrial-theme.zip` (33 KB)
- `src/`: Public React web application providing instant prototyping, interactive RFQ basket, English/Bengali localization, and auth-gated admin operations desk.
- `INSTALLATION.md`: Step-by-step setup guide for WordPress + WooCommerce.
- `MIGRATION.md`: Technical database schema and postmeta migration strategy for 50,000+ SKUs.
- `IMPORT_GUIDE.md`: Bulk CSV/XLSX and Python ETL importing instructions.
- `ADMIN_GUIDE.md`: Commercial RFQ handling and WooCommerce order conversion instructions.

---

## 🎨 Design Tokens & Branding

The design system enforces strict industrial engineering visual discipline:

- **Deep Navy** (`--dp-navy: #0F172A`, `--dp-navy-2: #172033`): Primary headings, site header, and footer.
- **Restrained Orange** (`--dp-orange: #D97706`, `--dp-orange-dark: #B45309`): Primary commercial CTA ("Request Quote", "Add to RFQ").
- **Restrained Green** (`--dp-green: #16A673`): Positive availability ("In Stock"), WhatsApp communication.
- **Clean Surfaces** (`#FFFFFF`, `#F8FAFC`, `#E2E8F0`): Clean technical specification tables, high-contrast typography, and zero-pill buttons.

---

## 🔒 Security & Admin Separation

- **Zero Public Leaks**: Public visitors see only customer-facing content. Internal platform architecture, developer status badges, deployment status, and database controls are completely absent from public view.
- **Authorization Gating**: Administrative features (RFQ Desk, Product Manager, Bulk Import, Data Quality Auditor, and WordPress ZIP downloads) are conditionally rendered exclusively for authenticated staff.
