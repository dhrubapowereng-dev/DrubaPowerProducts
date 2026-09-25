import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { initDatabase } from './server/db.js';
import {
  registerHandler,
  loginHandler,
  staffPasscodeLogin,
  forgotPasswordHandler,
  resetPasswordHandler,
  meHandler,
  optionalAuth
} from './server/auth.js';
import { productsRouter } from './server/routes/products.js';
import { rfqRouter } from './server/routes/rfq.js';
import { expertsRouter } from './server/routes/experts.js';
import { servicesRouter } from './server/routes/services.js';
import { projectsRouter } from './server/routes/projects.js';
import { blogsRouter } from './server/routes/blogs.js';
import { importerRouter } from './server/routes/importer.js';
import { uploadRouter } from './server/routes/upload.js';
import { getSeoForPath, injectSeoIntoHtml } from './server/seo.js';
import { generateSitemapIndex, generateMainSitemap, generateProductsSitemap } from './server/sitemap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Initialize SQLite Production Database
initDatabase();

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Security & Production Headers Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // HSTS on HTTPS / Cloud Run proxy
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Content Security Policy compatible with Google Maps, Unsplash, fonts, and WhatsApp
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https: http:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: wss: ws:; frame-src 'self' https:; object-src 'none';"
  );
  next();
});

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Persistent File Uploads Directory
const uploadsPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// 2. Health Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: 'sqlite_persistent_wal',
    version: '2.0.0'
  });
});

// Helper for host / app URL
function resolveBaseUrl(req: Request): string {
  if (process.env.APP_URL && !process.env.APP_URL.includes('MY_APP_URL')) {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  return `${req.protocol}://${req.get('host')}`.replace(/\/+$/, '');
}

// 3. Search Engine / Agent Discovery Endpoints

// Robots.txt with dynamic sitemap reference and public crawl allowances
app.get('/robots.txt', (req: Request, res: Response) => {
  const baseUrl = resolveBaseUrl(req);

  const body = [
    '# Robots.txt — Dhruba Power & Engineering',
    `# Canonical Host: ${baseUrl}`,
    'User-agent: *',
    'Allow: /',
    '',
    '# Public Catalog, Services, Projects, Brands & Content',
    'Allow: /shop/',
    'Allow: /eee/',
    'Allow: /cctv/',
    'Allow: /solar/',
    'Allow: /brands/',
    'Allow: /brand/',
    'Allow: /categories/',
    'Allow: /category/',
    'Allow: /products/',
    'Allow: /product/',
    'Allow: /series/',
    'Allow: /services/',
    'Allow: /projects/',
    'Allow: /experts/',
    'Allow: /blogs/',
    'Allow: /blog/',
    'Allow: /about/',
    'Allow: /contact/',
    'Allow: /uploads/products/',
    'Allow: /uploads/documents/',
    '',
    '# Private Administrative, API & Protected Endpoints',
    'Disallow: /admin/',
    'Disallow: /api/',
    'Disallow: /account/private/',
    'Disallow: /internal/',
    'Disallow: /uploads/private/',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`
  ].join('\n');

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(body);
});

// Dynamic XML Sitemap Index
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const baseUrl = resolveBaseUrl(req);
  const xml = generateSitemapIndex(baseUrl);
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml);
});

// Dynamic Core Pages Sitemap
app.get('/sitemap-main.xml', (req: Request, res: Response) => {
  const baseUrl = resolveBaseUrl(req);
  const xml = generateMainSitemap(baseUrl);
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml);
});

// Dynamic Chunked Product Sitemaps (Scalable to 50,000+ products)
app.get('/sitemap-products-:page.xml', (req: Request, res: Response) => {
  const baseUrl = resolveBaseUrl(req);
  const page = parseInt(req.params.page, 10) || 1;
  const xml = generateProductsSitemap(baseUrl, page);
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml);
});

// LLMs.txt for Autonomous Agents
app.get('/llms.txt', (_req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'llms.txt');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.sendFile(filePath);
  } else {
    res.status(404).send('# Dhruba Power\nNot found.');
  }
});

// AI.txt for Crawler Guidance
app.get('/ai.txt', (_req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'ai.txt');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.sendFile(filePath);
  } else {
    res.status(404).send('# AI policy file not found.');
  }
});

// 4. Authentication Routes
const authRouter = express.Router();
authRouter.post('/register', registerHandler);
authRouter.post('/login', loginHandler);
authRouter.post('/staff-login', staffPasscodeLogin);
authRouter.post('/forgot-password', forgotPasswordHandler);
authRouter.post('/reset-password', resetPasswordHandler);
authRouter.get('/me', optionalAuth, meHandler);
app.use('/api/auth', authRouter);

// 5. Resource API Routers
app.use('/api/products', productsRouter);
app.use('/api/rfq', rfqRouter);
app.use('/api/experts', expertsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/import', importerRouter);
app.use('/api/upload', uploadRouter);

// Unmatched API 404 handler
app.all('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Requested API endpoint does not exist.' });
});

// 6. Frontend & Dynamic Crawlable SEO Serving
async function setupFrontend() {
  if (!isProd) {
    // Development mode: Mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });

    app.use(vite.middlewares);

    app.get('*', async (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);

        const baseUrl = resolveBaseUrl(req);
        const seo = getSeoForPath(url, baseUrl);
        const html = injectSeoIntoHtml(template, seo);

        const status = seo.is410 ? 410 : (seo.is404 ? 404 : 200);
        res.status(status).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production mode: Serve compiled assets from dist/
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));

    app.get('*', (req: Request, res: Response) => {
      try {
        const indexPath = path.join(distPath, 'index.html');
        if (!fs.existsSync(indexPath)) {
          res.status(503).send('Application build in progress or dist directory missing.');
          return;
        }

        const template = fs.readFileSync(indexPath, 'utf-8');
        const baseUrl = resolveBaseUrl(req);
        const seo = getSeoForPath(req.originalUrl, baseUrl);
        const html = injectSeoIntoHtml(template, seo);

        const status = seo.is410 ? 410 : (seo.is404 ? 404 : 200);
        res.status(status).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html);
      } catch (err) {
        res.status(500).send('Internal Server Error while rendering page.');
      }
    });
  }

  // Global Error Handler (Production Safe, No Stack Leaks)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Production Server Error]', err);
    res.status(500).json({
      error: 'An unexpected internal server error occurred.',
      code: 'SERVER_ERROR'
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Dhruba Power Platform] Production server running on http://0.0.0.0:${PORT} (Node ${process.version})`);
    console.log(`[Dhruba Power Platform] Health check available at http://0.0.0.0:${PORT}/health`);
  });
}

setupFrontend().catch((err) => {
  console.error('[Fatal Startup Error]', err);
  process.exit(1);
});
