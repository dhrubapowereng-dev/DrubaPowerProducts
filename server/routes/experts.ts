import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';
import { invalidateSitemapCache } from '../sitemap.js';

export const expertsRouter = Router();

// GET /api/experts
expertsRouter.get('/', (req: Request, res: Response) => {
  try {
    const onlyActive = req.query.all !== 'true';
    const sql = onlyActive
      ? 'SELECT * FROM experts WHERE active = 1 ORDER BY display_order ASC, id ASC'
      : 'SELECT * FROM experts ORDER BY display_order ASC, id ASC';

    const rows = db.prepare(sql).all() as any[];
    const experts = rows.map((r) => {
      let certs = [];
      try {
        if (r.certifications_json) certs = JSON.parse(r.certifications_json);
      } catch {}

      return {
        id: r.id,
        slug: r.slug,
        name: r.name,
        bengaliName: r.bengali_name || undefined,
        photograph: r.photograph,
        designation: r.designation,
        department: r.department,
        shortBio: r.short_bio,
        whatsappNumber: r.whatsapp_number,
        email: r.email || 'info@dhrubapower.com',
        experienceYears: r.experience_years,
        certifications: certs,
        displayOrder: r.display_order,
        active: Boolean(r.active)
      };
    });

    res.json({ experts });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve experts.' });
  }
});

// GET /api/experts/:idOrSlug
expertsRouter.get('/:idOrSlug', (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;
    const r = db.prepare('SELECT * FROM experts WHERE id = ? OR slug = ?').get(idOrSlug, idOrSlug) as any;
    if (!r) {
      res.status(404).json({ error: 'Expert profile not found.' });
      return;
    }

    let certs = [];
    try {
      if (r.certifications_json) certs = JSON.parse(r.certifications_json);
    } catch {}

    res.json({
      id: r.id,
      slug: r.slug,
      name: r.name,
      bengaliName: r.bengali_name || undefined,
      photograph: r.photograph,
      designation: r.designation,
      department: r.department,
      shortBio: r.short_bio,
      whatsappNumber: r.whatsapp_number,
      email: r.email || 'info@dhrubapower.com',
      experienceYears: r.experience_years,
      certifications: certs,
      displayOrder: r.display_order,
      active: Boolean(r.active)
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve expert profile.' });
  }
});

// POST /api/experts (Admin only)
expertsRouter.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const {
      name,
      photograph,
      designation,
      department,
      shortBio,
      whatsappNumber,
      email,
      experienceYears,
      certifications,
      displayOrder,
      active
    } = req.body;

    if (!name || !designation || !department || !whatsappNumber) {
      res.status(400).json({ error: 'Name, designation, department, and WhatsApp number are required.' });
      return;
    }

    const id = `exp-${Date.now()}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO experts (
        id, slug, name, photograph, designation, department, short_bio,
        whatsapp_number, email, experience_years, certifications_json,
        display_order, active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      slug,
      name.trim(),
      photograph || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600',
      designation.trim(),
      department.trim(),
      shortBio?.trim() || '',
      whatsappNumber.trim(),
      email?.trim() || 'info@dhrubapower.com',
      experienceYears || 5,
      JSON.stringify(certifications || []),
      displayOrder || 1,
      active !== undefined ? (active ? 1 : 0) : 1,
      now,
      now
    );

    invalidateSitemapCache();
    res.status(201).json({ message: 'Expert created successfully.', id, slug });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create expert profile.' });
  }
});

// PUT /api/experts/:id (Admin only)
expertsRouter.put('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      photograph,
      designation,
      department,
      shortBio,
      whatsappNumber,
      email,
      experienceYears,
      certifications,
      displayOrder,
      active
    } = req.body;

    const existing = db.prepare('SELECT id FROM experts WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({ error: 'Expert not found.' });
      return;
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE experts SET
        name = COALESCE(?, name),
        photograph = COALESCE(?, photograph),
        designation = COALESCE(?, designation),
        department = COALESCE(?, department),
        short_bio = COALESCE(?, short_bio),
        whatsapp_number = COALESCE(?, whatsapp_number),
        email = COALESCE(?, email),
        experience_years = COALESCE(?, experience_years),
        certifications_json = COALESCE(?, certifications_json),
        display_order = COALESCE(?, display_order),
        active = COALESCE(?, active),
        updated_at = ?
      WHERE id = ?
    `).run(
      name,
      photograph,
      designation,
      department,
      shortBio,
      whatsappNumber,
      email,
      experienceYears,
      certifications ? JSON.stringify(certifications) : null,
      displayOrder,
      active !== undefined ? (active ? 1 : 0) : null,
      now,
      id
    );

    invalidateSitemapCache();
    res.json({ message: 'Expert profile updated.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update expert.' });
  }
});

// PATCH /api/experts/:id/toggle-active (Admin only)
expertsRouter.patch('/:id/toggle-active', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT active FROM experts WHERE id = ?').get(id) as any;
    if (!existing) {
      res.status(404).json({ error: 'Expert not found.' });
      return;
    }

    const newActive = existing.active ? 0 : 1;
    const now = new Date().toISOString();
    db.prepare('UPDATE experts SET active = ?, updated_at = ? WHERE id = ?').run(newActive, now, id);

    invalidateSitemapCache();
    res.json({ message: 'Expert status toggled.', active: Boolean(newActive) });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to toggle expert status.' });
  }
});

// DELETE /api/experts/:id (Admin only)
expertsRouter.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM experts WHERE id = ?').run(id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Expert not found.' });
      return;
    }
    invalidateSitemapCache();
    res.json({ message: 'Expert profile removed.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete expert.' });
  }
});
