import { DatabaseSync } from 'node:sqlite';
import { INDUSTRIAL_PRODUCTS } from '../src/data/mockProducts';
import { SERVICES_DATA } from '../src/data/servicesData';
import { PROJECTS_DATA } from '../src/data/projectsData';
import { INITIAL_EXPERTS } from '../src/data/mockExperts';
import { BLOGS_DATA } from '../src/data/blogsData';
import { INITIAL_RFQS } from '../src/data/mockRfqs';

export function seedProductsDirect(db: DatabaseSync, now: string) {
  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, mpn, mfg_code, sku, name, brand_id, brand_name, series_id, series_name,
      category_id, category_name, in_stock, stock_location, image_url, official_url,
      related_service_id, related_service_name, same_series_json, accessories_json,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSpec = db.prepare(`
    INSERT INTO specifications (
      product_id, key, label, value, numeric, unit, normalized, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertDoc = db.prepare(`
    INSERT INTO documents (
      id, product_id, title, type, source_url, sha256, size
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of INDUSTRIAL_PRODUCTS) {
    insertProduct.run(
      p.id,
      p.mpn,
      p.mfgCode || '',
      p.sku,
      p.name,
      p.brand.toLowerCase(),
      p.brand,
      p.series ? p.series.toLowerCase().replace(/\s+/g, '-') : null,
      p.series || null,
      p.category,
      p.categoryName,
      p.inStock ? 1 : 0,
      p.stockLocation,
      p.image,
      p.officialUrl || null,
      p.relatedServiceId || null,
      p.relatedServiceName || null,
      JSON.stringify(p.sameSeriesModels || []),
      JSON.stringify(p.compatibleAccessories || []),
      now,
      now
    );

    if (p.specifications && p.specifications.length > 0) {
      p.specifications.forEach((s, idx) => {
        insertSpec.run(
          p.id,
          s.key,
          s.label,
          s.value,
          s.numeric ?? null,
          s.unit ?? null,
          s.normalized ?? null,
          idx
        );
      });
    }

    if (p.documents && p.documents.length > 0) {
      p.documents.forEach((d) => {
        insertDoc.run(
          d.id,
          p.id,
          d.title,
          d.type,
          d.sourceUrl,
          d.sha256 || null,
          d.size || 0
        );
      });
    }
  }
}

export function seedServicesAndProjects(db: DatabaseSync, now: string) {
  // Services
  const insertService = db.prepare(`
    INSERT OR REPLACE INTO services (
      id, slug, title, bengali_title, summary, icon_name, description,
      features_json, deliverables_json, related_products_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const s of SERVICES_DATA) {
    insertService.run(
      s.id,
      s.slug,
      s.title,
      s.titleBn || null,
      s.shortDesc,
      s.iconName || 'Zap',
      s.fullDesc,
      JSON.stringify(s.scopeOfWork || []),
      JSON.stringify(s.equipmentSupplied || []),
      JSON.stringify(s.technicalStandards || []),
      now,
      now
    );
  }

  // Projects
  const insertProject = db.prepare(`
    INSERT OR REPLACE INTO projects (
      id, slug, title, bengali_title, client, category, capacity, location,
      completion_date, status, progress_percent, hero_image, images_json,
      scope_json, technical_details_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of PROJECTS_DATA) {
    insertProject.run(
      p.id,
      p.slug,
      p.title,
      p.titleBn || null,
      p.clientType || 'Industrial Client',
      p.category,
      p.capacityOrRating || null,
      p.location,
      p.completionDate || null,
      p.status,
      p.progress || 100,
      p.image,
      JSON.stringify(p.galleryImages || []),
      JSON.stringify(p.scope ? [p.scope] : []),
      JSON.stringify(p.technicalHighlights || []),
      now,
      now
    );
  }

  // Experts
  const insertExpert = db.prepare(`
    INSERT OR REPLACE INTO experts (
      id, slug, name, bengali_name, photograph, designation, department,
      short_bio, whatsapp_number, email, experience_years, certifications_json,
      display_order, active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const e of INITIAL_EXPERTS) {
    const slug = e.slug || e.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    insertExpert.run(
      e.id,
      slug,
      e.name,
      null,
      e.photograph,
      e.designation,
      e.department,
      e.shortBio,
      e.whatsappNumber,
      e.email || 'info@dhrubapower.com',
      e.experienceYears || 8,
      JSON.stringify(e.certifications || []),
      e.displayOrder || 1,
      e.active ? 1 : 0,
      now,
      now
    );
  }

  // Blogs
  const insertBlog = db.prepare(`
    INSERT OR REPLACE INTO blogs (
      id, slug, title, bengali_title, excerpt, read_time, author,
      publish_date, category, content, tags_json, image_url, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const b of BLOGS_DATA) {
    insertBlog.run(
      b.id,
      b.slug,
      b.title,
      b.titleBn || null,
      b.excerpt,
      b.readTime || '5 min read',
      b.author,
      b.date || '2026-08-01',
      b.category,
      Array.isArray(b.content) ? b.content.join('\n\n') : String(b.content),
      JSON.stringify(b.tags || []),
      b.image,
      now,
      now
    );
  }

  // RFQs
  const insertRfq = db.prepare(`
    INSERT OR REPLACE INTO rfqs (
      id, rfq_number, company, contact, email, phone, whatsapp, location,
      message, status, is_guest, guest_token, user_id, quoted_total, currency,
      internal_notes, wc_order_id, files_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertRfqItem = db.prepare(`
    INSERT INTO rfq_items (
      rfq_id, product_id, title, mpn, brand, quantity, customer_note, unit_price, line_total
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const r of INITIAL_RFQS) {
    insertRfq.run(
      r.id,
      r.rfqNumber,
      r.company,
      r.contact,
      r.email,
      r.phone,
      r.whatsapp || null,
      r.location,
      r.message || null,
      r.status,
      r.isGuest ? 1 : 0,
      r.guestToken || null,
      r.userId || null,
      r.quotedTotal || 0,
      r.currency || 'BDT',
      r.internalNotes || null,
      r.wcOrderId || null,
      JSON.stringify(r.files || []),
      r.createdAt,
      r.updatedAt
    );

    if (r.items && r.items.length > 0) {
      for (const item of r.items) {
        insertRfqItem.run(
          r.id,
          item.productId || null,
          item.title,
          item.mpn,
          item.brand || null,
          item.quantity || 1,
          item.customerNote || null,
          item.unitPrice || 0,
          item.lineTotal || 0
        );
      }
    }
  }
}
