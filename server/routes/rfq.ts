import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { optionalAuth, requireAdmin, AuthRequest } from '../auth.js';

export const rfqRouter = Router();

// GET /api/rfq - Query RFQs
rfqRouter.get('/', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { token, rfqNumber, email } = req.query;

    let rfqs: any[] = [];

    if (user && user.role === 'admin') {
      // Admin sees all RFQs
      rfqs = db.prepare('SELECT * FROM rfqs ORDER BY id DESC').all() as any[];
    } else if (user && user.role === 'customer') {
      // Customer sees their own RFQs
      rfqs = db.prepare('SELECT * FROM rfqs WHERE user_id = ? OR LOWER(email) = ? ORDER BY id DESC').all(
        user.id,
        user.email.toLowerCase()
      ) as any[];
    } else if (token || rfqNumber || email) {
      // Guest lookup by RFQ number, token or email
      const conditions: string[] = [];
      const params: any[] = [];
      if (rfqNumber) {
        conditions.push('LOWER(rfq_number) = ?');
        params.push((rfqNumber as string).toLowerCase().trim());
      }
      if (token) {
        conditions.push('guest_token = ?');
        params.push(token);
      }
      if (email) {
        conditions.push('LOWER(email) = ?');
        params.push((email as string).toLowerCase().trim());
      }
      const sql = `SELECT * FROM rfqs WHERE ${conditions.join(' OR ')} ORDER BY id DESC`;
      rfqs = db.prepare(sql).all(...params) as any[];
    } else {
      res.json({ rfqs: [] });
      return;
    }

    const rfqIds = rfqs.map((r) => r.id);
    let allItems: any[] = [];
    if (rfqIds.length > 0) {
      const placeholders = rfqIds.map(() => '?').join(',');
      allItems = db.prepare(`SELECT * FROM rfq_items WHERE rfq_id IN (${placeholders})`).all(...rfqIds) as any[];
    }

    const formatted = rfqs.map((r) => {
      const items = allItems
        .filter((item) => item.rfq_id === r.id)
        .map((item) => ({
          productId: item.product_id,
          title: item.title,
          mpn: item.mpn,
          brand: item.brand,
          quantity: item.quantity,
          customerNote: item.customer_note,
          unitPrice: item.unit_price,
          lineTotal: item.line_total
        }));

      let files = [];
      try {
        if (r.files_json) files = JSON.parse(r.files_json);
      } catch {}

      return {
        id: r.id,
        rfqNumber: r.rfq_number,
        company: r.company,
        contact: r.contact,
        email: r.email,
        phone: r.phone,
        whatsapp: r.whatsapp || undefined,
        location: r.location,
        message: r.message || undefined,
        status: r.status,
        isGuest: Boolean(r.is_guest),
        guestToken: r.guest_token || undefined,
        userId: r.user_id || undefined,
        quotedTotal: r.quoted_total || undefined,
        currency: r.currency || 'BDT',
        internalNotes: r.internal_notes || undefined,
        wcOrderId: r.wc_order_id || undefined,
        files,
        items,
        createdAt: r.created_at,
        updatedAt: r.updated_at
      };
    });

    res.json({ rfqs: formatted });
  } catch (err: any) {
    console.error('[GET /api/rfq Error]', err);
    res.status(500).json({ error: 'Failed to retrieve RFQ records.' });
  }
});

// POST /api/rfq - Submit New Commercial RFQ
rfqRouter.post('/', optionalAuth, (req: AuthRequest, res: Response) => {
  try {
    const {
      company,
      contact,
      email,
      phone,
      whatsapp,
      location,
      message,
      items,
      files
    } = req.body;

    if (!company || !contact || !email || !phone || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Company, contact name, email, phone, and at least 1 item are required.' });
      return;
    }

    const year = new Date().getFullYear();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const rfqNumber = `RFQ-${year}-${randomSeq}`;
    const guestToken = Math.random().toString(36).substring(2, 10).toUpperCase();
    const now = new Date().toISOString();

    const userId = req.user ? req.user.id : null;
    const isGuest = !req.user;

    const insertRfq = db.prepare(`
      INSERT INTO rfqs (
        rfq_number, company, contact, email, phone, whatsapp, location,
        message, status, is_guest, guest_token, user_id, files_json,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertRfq.run(
      rfqNumber,
      company.trim(),
      contact.trim(),
      email.toLowerCase().trim(),
      phone.trim(),
      whatsapp?.trim() || null,
      location?.trim() || 'Bangladesh',
      message?.trim() || null,
      'NEW',
      isGuest ? 1 : 0,
      guestToken,
      userId,
      JSON.stringify(files || []),
      now,
      now
    );

    const rfqId = Number(result.lastInsertRowid);

    const insertItem = db.prepare(`
      INSERT INTO rfq_items (
        rfq_id, product_id, title, mpn, brand, quantity, customer_note
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      insertItem.run(
        rfqId,
        item.productId || null,
        item.title || item.name || 'Industrial Equipment',
        item.mpn || 'CUSTOM-SPECS',
        item.brand || 'Dhruba Power',
        item.quantity || 1,
        item.customerNote || null
      );
    }

    res.status(201).json({
      message: 'RFQ submitted successfully. Commercial quote department notified.',
      rfqId,
      rfqNumber,
      guestToken
    });
  } catch (err: any) {
    console.error('[Create RFQ Error]', err);
    res.status(500).json({ error: 'Failed to submit commercial RFQ.' });
  }
});

// PATCH /api/rfq/:id/status (Admin only)
rfqRouter.patch('/:id/status', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status, quotedTotal, internalNotes } = req.body;

    const existing = db.prepare('SELECT id FROM rfqs WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({ error: 'RFQ not found.' });
      return;
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE rfqs SET
        status = COALESCE(?, status),
        quoted_total = COALESCE(?, quoted_total),
        internal_notes = COALESCE(?, internal_notes),
        updated_at = ?
      WHERE id = ?
    `).run(status, quotedTotal !== undefined ? quotedTotal : null, internalNotes, now, id);

    res.json({ message: 'RFQ updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update RFQ.' });
  }
});

// POST /api/rfq/:id/convert (Admin only) - Convert to WooCommerce / ERP Order
rfqRouter.post('/:id/convert', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const rfq = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(id) as any;
    if (!rfq) {
      res.status(404).json({ error: 'RFQ not found.' });
      return;
    }

    const orderId = Math.floor(40000 + Math.random() * 9000);
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE rfqs SET
        status = 'CONVERTED',
        wc_order_id = ?,
        updated_at = ?
      WHERE id = ?
    `).run(orderId, now, id);

    res.json({
      message: `RFQ ${rfq.rfq_number} converted to WooCommerce Order #${orderId}`,
      wcOrderId: orderId
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to convert RFQ to order.' });
  }
});
