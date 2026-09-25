import { db } from './db.js';

interface SitemapCacheEntry {
  xml: string;
  timestamp: number;
}

const sitemapCache = new Map<string, SitemapCacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL

export function invalidateSitemapCache(): void {
  sitemapCache.clear();
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(isoString?: string): string {
  if (!isoString) return new Date().toISOString().split('T')[0];
  try {
    return new Date(isoString).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

// 1. Generate Sitemap Index (/sitemap.xml)
export function generateSitemapIndex(baseUrl: string): string {
  const cacheKey = `index_${baseUrl}`;
  const cached = sitemapCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.xml;
  }

  const cleanBase = baseUrl.replace(/\/+$/, '');
  const productCountResult = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  const totalProducts = productCountResult ? productCountResult.count : 0;
  const PRODUCTS_PER_SITEMAP = 10000;
  const productSitemapCount = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_SITEMAP));

  const latestProduct = db.prepare('SELECT updated_at FROM products ORDER BY updated_at DESC LIMIT 1').get() as any;
  const productLastmod = formatDate(latestProduct?.updated_at);
  const mainLastmod = formatDate(new Date().toISOString());

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Core pages sitemap
  xml += `  <sitemap>\n`;
  xml += `    <loc>${escapeXml(`${cleanBase}/sitemap-main.xml`)}</loc>\n`;
  xml += `    <lastmod>${mainLastmod}</lastmod>\n`;
  xml += `  </sitemap>\n`;

  // Product chunks
  for (let i = 1; i <= productSitemapCount; i++) {
    xml += `  <sitemap>\n`;
    xml += `    <loc>${escapeXml(`${cleanBase}/sitemap-products-${i}.xml`)}</loc>\n`;
    xml += `    <lastmod>${productLastmod}</lastmod>\n`;
    xml += `  </sitemap>\n`;
  }

  xml += `</sitemapindex>`;

  sitemapCache.set(cacheKey, { xml, timestamp: Date.now() });
  return xml;
}

// 2. Generate Core Main Sitemap (/sitemap-main.xml)
export function generateMainSitemap(baseUrl: string): string {
  const cacheKey = `main_${baseUrl}`;
  const cached = sitemapCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.xml;
  }

  const cleanBase = baseUrl.replace(/\/+$/, '');
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  const addUrl = (loc: string, lastmod: string, changefreq: string, priority: string, hasBn = true) => {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(`${cleanBase}${loc}`)}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    if (hasBn) {
      xml += `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(`${cleanBase}${loc}`)}" />\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="bn" href="${escapeXml(`${cleanBase}${loc}${loc.includes('?') ? '&' : '?'}lang=bn`)}" />\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${cleanBase}${loc}`)}" />\n`;
    }
    xml += `  </url>\n`;
  };

  const today = formatDate(new Date().toISOString());

  // Static Pillar Pages
  addUrl('/', today, 'daily', '1.0');
  addUrl('/about', today, 'monthly', '0.8');
  addUrl('/services', today, 'weekly', '0.9');
  addUrl('/shop', today, 'daily', '0.9');
  addUrl('/projects', today, 'weekly', '0.8');
  addUrl('/experts', today, 'weekly', '0.8');
  addUrl('/blogs', today, 'weekly', '0.8');
  addUrl('/contact', today, 'monthly', '0.7');

  // Categories and Category Landing Routes (/category/eee, /eee, /solar, /cctv)
  const categories = db.prepare('SELECT slug, created_at FROM categories').all() as any[];
  for (const c of categories) {
    addUrl(`/category/${c.slug}`, formatDate(c.created_at), 'weekly', '0.8');
    addUrl(`/${c.slug}`, formatDate(c.created_at), 'weekly', '0.8');
  }

  // Brands & Brand Hubs (/brands/abb, /brand/abb)
  const brands = db.prepare('SELECT slug, created_at FROM brands').all() as any[];
  for (const b of brands) {
    addUrl(`/brands/${b.slug}`, formatDate(b.created_at), 'weekly', '0.8');
    addUrl(`/brand/${b.slug}`, formatDate(b.created_at), 'weekly', '0.8');
  }

  // Series Pages
  try {
    const seriesRows = db.prepare(`
      SELECT s.slug, s.name, s.brand_id, b.slug as brand_slug
      FROM series s
      LEFT JOIN brands b ON s.brand_id = b.id
    `).all() as any[];
    for (const sr of seriesRows) {
      if (sr.slug) {
        addUrl(`/series/${sr.slug}`, today, 'weekly', '0.7');
        if (sr.brand_slug) {
          addUrl(`/brand/${sr.brand_slug}/series/${sr.slug}`, today, 'weekly', '0.7');
        }
      }
    }
  } catch (err) {
    console.warn('[Sitemap Series Warning]', err);
  }

  // Services
  const services = db.prepare('SELECT slug, updated_at FROM services').all() as any[];
  for (const s of services) {
    addUrl(`/services/${s.slug}`, formatDate(s.updated_at), 'weekly', '0.9');
  }

  // Projects
  const projects = db.prepare('SELECT slug, updated_at FROM projects').all() as any[];
  for (const p of projects) {
    addUrl(`/projects/${p.slug}`, formatDate(p.updated_at), 'monthly', '0.7');
  }

  // Experts
  const experts = db.prepare('SELECT slug, updated_at FROM experts WHERE active = 1').all() as any[];
  for (const e of experts) {
    addUrl(`/experts/${e.slug}`, formatDate(e.updated_at), 'monthly', '0.7');
  }

  // Blogs
  const blogs = db.prepare('SELECT slug, updated_at, publish_date FROM blogs').all() as any[];
  for (const b of blogs) {
    addUrl(`/blog/${b.slug}`, formatDate(b.updated_at || b.publish_date), 'monthly', '0.8');
  }

  xml += `</urlset>`;

  sitemapCache.set(cacheKey, { xml, timestamp: Date.now() });
  return xml;
}

// 3. Generate Product Chunk Sitemap (/sitemap-products-:page.xml)
export function generateProductsSitemap(baseUrl: string, pageNumber: number): string {
  const cacheKey = `products_${baseUrl}_${pageNumber}`;
  const cached = sitemapCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.xml;
  }

  const cleanBase = baseUrl.replace(/\/+$/, '');
  const PRODUCTS_PER_SITEMAP = 10000;
  const offset = (Math.max(1, pageNumber) - 1) * PRODUCTS_PER_SITEMAP;

  const rows = db.prepare(`
    SELECT id, mpn, sku, name, image_url, updated_at
    FROM products
    ORDER BY id ASC
    LIMIT ? OFFSET ?
  `).all(PRODUCTS_PER_SITEMAP, offset) as any[];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  for (const r of rows) {
    const prodUrl = `${cleanBase}/product/${r.id}`;
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(prodUrl)}</loc>\n`;
    xml += `    <lastmod>${formatDate(r.updated_at)}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(prodUrl)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="bn" href="${escapeXml(`${prodUrl}?lang=bn`)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(prodUrl)}" />\n`;
    if (r.image_url) {
      const fullImg = r.image_url.startsWith('http') ? r.image_url : `${cleanBase}${r.image_url}`;
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(fullImg)}</image:loc>\n`;
      xml += `      <image:title>${escapeXml(r.name)}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  sitemapCache.set(cacheKey, { xml, timestamp: Date.now() });
  return xml;
}
