import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const servicesRouter = Router();

servicesRouter.get('/', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM services ORDER BY id ASC').all() as any[];
    const services = rows.map((r) => {
      let features = [];
      let deliverables = [];
      let relatedProducts = [];
      try {
        if (r.features_json) features = JSON.parse(r.features_json);
        if (r.deliverables_json) deliverables = JSON.parse(r.deliverables_json);
        if (r.related_products_json) relatedProducts = JSON.parse(r.related_products_json);
      } catch {}

      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        bengaliTitle: r.bengali_title || undefined,
        summary: r.summary,
        iconName: r.icon_name,
        description: r.description,
        features,
        deliverables,
        relatedProducts
      };
    });
    res.json({ services });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve engineering services.' });
  }
});

servicesRouter.get('/:slug', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const r = db.prepare('SELECT * FROM services WHERE slug = ? OR id = ?').get(slug, slug) as any;
    if (!r) {
      res.status(404).json({ error: 'Engineering service not found.' });
      return;
    }

    let features = [];
    let deliverables = [];
    let relatedProducts = [];
    try {
      if (r.features_json) features = JSON.parse(r.features_json);
      if (r.deliverables_json) deliverables = JSON.parse(r.deliverables_json);
      if (r.related_products_json) relatedProducts = JSON.parse(r.related_products_json);
    } catch {}

    res.json({
      id: r.id,
      slug: r.slug,
      title: r.title,
      bengaliTitle: r.bengali_title || undefined,
      summary: r.summary,
      iconName: r.icon_name,
      description: r.description,
      features,
      deliverables,
      relatedProducts
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve service details.' });
  }
});
