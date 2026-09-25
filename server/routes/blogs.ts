import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const blogsRouter = Router();

blogsRouter.get('/', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM blogs ORDER BY publish_date DESC').all() as any[];
    const blogs = rows.map((r) => {
      let tags = [];
      try {
        if (r.tags_json) tags = JSON.parse(r.tags_json);
      } catch {}

      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        bengaliTitle: r.bengali_title || undefined,
        excerpt: r.excerpt,
        readTime: r.read_time,
        author: r.author,
        publishDate: r.publish_date,
        category: r.category,
        content: r.content,
        tags,
        image: r.image_url
      };
    });
    res.json({ blogs });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve blogs.' });
  }
});

blogsRouter.get('/:slug', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const r = db.prepare('SELECT * FROM blogs WHERE slug = ? OR id = ?').get(slug, slug) as any;
    if (!r) {
      res.status(404).json({ error: 'Article not found.' });
      return;
    }

    let tags = [];
    try {
      if (r.tags_json) tags = JSON.parse(r.tags_json);
    } catch {}

    res.json({
      id: r.id,
      slug: r.slug,
      title: r.title,
      bengaliTitle: r.bengali_title || undefined,
      excerpt: r.excerpt,
      readTime: r.read_time,
      author: r.author,
      publishDate: r.publish_date,
      category: r.category,
      content: r.content,
      tags,
      image: r.image_url
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve article.' });
  }
});
