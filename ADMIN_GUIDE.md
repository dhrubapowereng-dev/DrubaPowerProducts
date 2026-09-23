# Dhruba Power — Commercial Operations & Admin Guide

This guide describes how the Dhruba Power engineering sales desk processes incoming customer Requests for Quotation (RFQ), generates commercial proposals, and converts quotes into official WooCommerce orders.

---

## 1. Commercial Quotation Workflow

```
Customer Submits RFQ (Guest or Account)
                   │
                   ▼
  Staff Receives Notification (Email + Telegram/SMS)
                   │
                   ▼
  Staff Reviews Line Items & BOQ Schedule in Admin Desk
                   │
                   ▼
  Staff Enters Quoted BDT Price & Delivery Lead Times
                   │
                   ▼
  Customer Receives Official Formal Quote (Email & PDF)
                   │
                   ▼
  Staff Clicks "Convert to WooCommerce Order"
                   │
                   ▼
  Native WooCommerce Order Created (#WC-XXXX)
```

---

## 2. Accessing the Central Operations Desk

1. Normal website visitors see **zero** internal tools, developer panels, or admin links.
2. Authorized engineering staff access the desk via:
   - Clicking **Account** in the header.
   - Selecting **Staff Portal** and entering the authorized credentials.
   - Or navigating directly to `https://dhrubapower.com/wp-admin/admin.php?page=dhruba-rfq-desk`.

---

## 3. Managing Incoming RFQs

Inside the RFQ Management screen:
- **Filter by Status**: `NEW`, `REVIEWING`, `QUOTED`, `CONVERTED`, `CANCELLED`.
- **View BOQ Files**: Download attached tender schedules (PDF, Excel XLS/XLSX, AutoCAD DWG).
- **Direct WhatsApp Response**: Click the **WhatsApp Customer** button to initiate instant quotation discussion directly from the Barishal desk with pre-filled line items.
- **Set Commercial Price**: Enter the total BDT quote value, payment terms (e.g. 50% advance, 50% upon delivery), and warranty period.

---

## 4. Converting an RFQ to a WooCommerce Order

When a customer accepts a quotation:
1. Click **Convert to WooCommerce Order** inside the RFQ detail panel.
2. The system automatically:
   - Creates a standard WooCommerce order record.
   - Links the customer's name, email, billing/shipping address, and company.
   - Adds the quoted products as line items with custom quoted prices.
   - Attaches the original RFQ reference number (`DP-RFQ-XXXX`) to the order notes.
   - Marks the RFQ status as `CONVERTED`.
   - Generates the standard WooCommerce invoice and payment link.
