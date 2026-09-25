import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const projectsRouter = Router();

projectsRouter.get('/', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM projects ORDER BY id ASC').all() as any[];
    const projects = rows.map((r) => {
      let images = [];
      let scope = [];
      let technicalDetails = {};
      try {
        if (r.images_json) images = JSON.parse(r.images_json);
        if (r.scope_json) scope = JSON.parse(r.scope_json);
        if (r.technical_details_json) technicalDetails = JSON.parse(r.technical_details_json);
      } catch {}

      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        bengaliTitle: r.bengali_title || undefined,
        client: r.client,
        category: r.category,
        capacity: r.capacity || undefined,
        location: r.location,
        completionDate: r.completion_date || undefined,
        status: r.status,
        progressPercent: r.progress_percent,
        heroImage: r.hero_image,
        images,
        scope,
        technicalDetails
      };
    });
    res.json({ projects });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve engineering projects.' });
  }
});

projectsRouter.get('/:slug', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const r = db.prepare('SELECT * FROM projects WHERE slug = ? OR id = ?').get(slug, slug) as any;
    if (!r) {
      res.status(404).json({ error: 'Engineering project not found.' });
      return;
    }

    let images = [];
    let scope = [];
    let technicalDetails = {};
    try {
      if (r.images_json) images = JSON.parse(r.images_json);
      if (r.scope_json) scope = JSON.parse(r.scope_json);
      if (r.technical_details_json) technicalDetails = JSON.parse(r.technical_details_json);
    } catch {}

    res.json({
      id: r.id,
      slug: r.slug,
      title: r.title,
      bengaliTitle: r.bengali_title || undefined,
      client: r.client,
      category: r.category,
      capacity: r.capacity || undefined,
      location: r.location,
      completionDate: r.completion_date || undefined,
      status: r.status,
      progressPercent: r.progress_percent,
      heroImage: r.hero_image,
      images,
      scope,
      technicalDetails
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve project details.' });
  }
});
