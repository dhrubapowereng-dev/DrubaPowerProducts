import { Router, Request, Response } from 'express';
import { db, recordTombstone } from '../db.js';
import { requireAdmin, optionalAuth } from '../auth.js';
import { invalidateSitemapCache } from '../sitemap.js';

export const productsRouter = Router();

// GET /api/products - High performance paginated product query
productsRouter.get('/', (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const q = (req.query.q as string || '').trim().toLowerCase();
    const category = (req.query.category as string || '').trim().toLowerCase();
    const brand = (req.query.brand as string || '').trim();
    const inStockOnly = req.query.inStock === 'true';

    const conditions: string[] = [];
    const params: any[] = [];

    if (q) {
      conditions.push('(LOWER(p.name) LIKE ? OR LOWER(p.mpn) LIKE ? OR LOWER(p.sku) LIKE ? OR LOWER(p.brand_name) LIKE ?)');
      const wild = `%${q}%`;
      params.push(wild, wild, wild, wild);
    }

    if (category && category !== 'all') {
      conditions.push('p.category_id = ?');
      params.push(category);
    }

    if (brand && brand !== 'all') {
      conditions.push('LOWER(p.brand_name) = ?');
      params.push(brand.toLowerCase());
    }

    if (inStockOnly) {
      conditions.push('p.in_stock = 1');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count query
    const countSql = `SELECT COUNT(*) as total FROM products p ${whereClause}`;
    const totalResult = db.prepare(countSql).get(...params) as { total: number };
    const total = totalResult ? totalResult.total : 0;

    // Fetch items with limit & offset
    const querySql = `
      SELECT p.*
      FROM products p
      ${whereClause}
      ORDER BY p.id ASC
      LIMIT ? OFFSET ?
    `;
    const rows = db.prepare(querySql).all(...params, limit, offset) as any[];

    // Fetch specifications & documents for returned products in batch
    const productIds = rows.map((r) => r.id);
    let allSpecs: any[] = [];
    let allDocs: any[] = [];

    if (productIds.length > 0) {
      const placeholders = productIds.map(() => '?').join(',');
      allSpecs = db.prepare(`
        SELECT * FROM specifications
        WHERE product_id IN (${placeholders})
        ORDER BY display_order ASC
      `).all(...productIds) as any[];

      allDocs = db.prepare(`
        SELECT * FROM documents
        WHERE product_id IN (${placeholders})
      `).all(...productIds) as any[];
    }

    const products = rows.map((r) => {
      const specs = allSpecs
        .filter((s) => s.product_id === r.id)
        .map((s) => ({
          key: s.key,
          label: s.label,
          value: s.value,
          numeric: s.numeric ?? undefined,
          unit: s.unit ?? undefined,
          normalized: s.normalized ?? undefined
        }));

      const docs = allDocs
        .filter((d) => d.product_id === r.id)
        .map((d) => ({
          id: d.id,
          title: d.title,
          type: d.type,
          sourceUrl: d.source_url,
          sha256: d.sha256 || undefined,
          size: d.size
        }));

      let sameSeries = [];
      let accessories = [];
      try {
        if (r.same_series_json) sameSeries = JSON.parse(r.same_series_json);
        if (r.accessories_json) accessories = JSON.parse(r.accessories_json);
      } catch {
        // ignore parse error
      }

      return {
        id: r.id,
        mpn: r.mpn,
        mfgCode: r.mfg_code || '',
        sku: r.sku,
        name: r.name,
        brand: r.brand_name,
        series: r.series_name || '',
        category: r.category_id,
        categoryName: r.category_name,
        inStock: Boolean(r.in_stock),
        stockLocation: r.stock_location || 'Barishal Central Warehouse',
        image: r.image_url || '',
        officialUrl: r.official_url || undefined,
        relatedServiceId: r.related_service_id || undefined,
        relatedServiceName: r.related_service_name || undefined,
        specifications: specs,
        documents: docs,
        sameSeriesModels: sameSeries,
        compatibleAccessories: accessories
      };
    });

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    });
  } catch (err: any) {
    console.error('[GET /api/products error]', err);
    res.status(500).json({ error: 'Failed to retrieve products catalog.' });
  }
});

// GET /api/products/:idOrMpn
productsRouter.get('/:idOrMpn', (req: Request, res: Response) => {
  try {
    const { idOrMpn } = req.params;
    let row: any;

    if (/^\d+$/.test(idOrMpn)) {
      row = db.prepare('SELECT * FROM products WHERE id = ?').get(parseInt(idOrMpn));
    }

    if (!row) {
      row = db.prepare('SELECT * FROM products WHERE LOWER(mpn) = ? OR LOWER(sku) = ?').get(idOrMpn.toLowerCase(), idOrMpn.toLowerCase());
    }

    if (!row) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    const specs = (db.prepare('SELECT * FROM specifications WHERE product_id = ? ORDER BY display_order ASC').all(row.id) as any[])
      .map((s) => ({
        key: s.key,
        label: s.label,
        value: s.value,
        numeric: s.numeric ?? undefined,
        unit: s.unit ?? undefined,
        normalized: s.normalized ?? undefined
      }));

    const docs = (db.prepare('SELECT * FROM documents WHERE product_id = ?').all(row.id) as any[])
      .map((d) => ({
        id: d.id,
        title: d.title,
        type: d.type,
        sourceUrl: d.source_url,
        sha256: d.sha256 || undefined,
        size: d.size
      }));

    let sameSeries = [];
    let accessories = [];
    try {
      if (row.same_series_json) sameSeries = JSON.parse(row.same_series_json);
      if (row.accessories_json) accessories = JSON.parse(row.accessories_json);
    } catch {}

    res.json({
      id: row.id,
      mpn: row.mpn,
      mfgCode: row.mfg_code || '',
      sku: row.sku,
      name: row.name,
      brand: row.brand_name,
      series: row.series_name || '',
      category: row.category_id,
      categoryName: row.category_name,
      inStock: Boolean(row.in_stock),
      stockLocation: row.stock_location || 'Barishal Central Warehouse',
      image: row.image_url || '',
      officialUrl: row.official_url || undefined,
      relatedServiceId: row.related_service_id || undefined,
      relatedServiceName: row.related_service_name || undefined,
      specifications: specs,
      documents: docs,
      sameSeriesModels: sameSeries,
      compatibleAccessories: accessories
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve product details.' });
  }
});

// POST /api/products (Admin only)
productsRouter.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const {
      mpn,
      name,
      brand,
      category,
      categoryName,
      series,
      mfgCode,
      inStock,
      stockLocation,
      image,
      officialUrl,
      specifications,
      documents
    } = req.body;

    if (!mpn || !name || !brand || !category) {
      res.status(400).json({ error: 'MPN, Product Name, Brand, and Category are required.' });
      return;
    }

    const sku = `DP-${brand.toUpperCase().replace(/\s+/g, '')}-${mpn.toUpperCase().replace(/\s+/g, '')}`;
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO products (
        mpn, mfg_code, sku, name, brand_id, brand_name, series_id, series_name,
        category_id, category_name, in_stock, stock_location, image_url, official_url,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      mpn.trim(),
      mfgCode || '',
      sku,
      name.trim(),
      brand.toLowerCase(),
      brand.trim(),
      series ? series.toLowerCase().replace(/\s+/g, '-') : null,
      series?.trim() || null,
      category.toLowerCase(),
      categoryName || category.toUpperCase(),
      inStock ? 1 : 0,
      stockLocation || 'Barishal Central Warehouse',
      image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
      officialUrl || null,
      now,
      now
    );

    const newId = Number(result.lastInsertRowid);

    if (Array.isArray(specifications)) {
      const insertSpec = db.prepare(`
        INSERT INTO specifications (product_id, key, label, value, numeric, unit, normalized, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      specifications.forEach((s: any, idx: number) => {
        insertSpec.run(newId, s.key, s.label, s.value, s.numeric ?? null, s.unit ?? null, s.normalized ?? null, idx);
      });
    }

    if (Array.isArray(documents)) {
      const insertDoc = db.prepare(`
        INSERT INTO documents (id, product_id, title, type, source_url, sha256, size)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      documents.forEach((d: any) => {
        insertDoc.run(d.id || `doc-${Date.now()}-${Math.random().toString(36).substring(7)}`, newId, d.title, d.type || 'datasheet', d.sourceUrl, d.sha256 || null, d.size || 0);
      });
    }

    invalidateSitemapCache();
    res.status(201).json({ message: 'Product created successfully.', id: newId });
  } catch (err: any) {
    console.error('[Create Product Error]', err);
    res.status(500).json({ error: 'Failed to create product in database.' });
  }
});

// PUT /api/products/:id (Admin only)
productsRouter.put('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const {
      name,
      brand,
      category,
      categoryName,
      series,
      inStock,
      stockLocation,
      image,
      officialUrl,
      specifications
    } = req.body;

    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE products SET
        name = COALESCE(?, name),
        brand_name = COALESCE(?, brand_name),
        category_id = COALESCE(?, category_id),
        category_name = COALESCE(?, category_name),
        series_name = COALESCE(?, series_name),
        in_stock = COALESCE(?, in_stock),
        stock_location = COALESCE(?, stock_location),
        image_url = COALESCE(?, image_url),
        official_url = COALESCE(?, official_url),
        updated_at = ?
      WHERE id = ?
    `).run(
      name,
      brand,
      category,
      categoryName,
      series,
      inStock !== undefined ? (inStock ? 1 : 0) : null,
      stockLocation,
      image,
      officialUrl,
      now,
      id
    );

    if (Array.isArray(specifications)) {
      db.prepare('DELETE FROM specifications WHERE product_id = ?').run(id);
      const insertSpec = db.prepare(`
        INSERT INTO specifications (product_id, key, label, value, numeric, unit, normalized, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      specifications.forEach((s: any, idx: number) => {
        insertSpec.run(id, s.key, s.label, s.value, s.numeric ?? null, s.unit ?? null, s.normalized ?? null, idx);
      });
    }

    invalidateSitemapCache();
    res.json({ message: 'Product updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// DELETE /api/products/:id (Admin only)
productsRouter.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const existing = db.prepare('SELECT mpn, name FROM products WHERE id = ?').get(id) as any;
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    recordTombstone('product', String(id), `Product ${existing?.name || id} (MPN: ${existing?.mpn || 'N/A'}) permanently discontinued from Dhruba Power catalog`);
    if (existing?.mpn) {
      recordTombstone('product', existing.mpn.toLowerCase(), `Product MPN ${existing.mpn} discontinued`);
    }
    invalidateSitemapCache();
    res.json({ message: 'Product removed from catalog.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});
