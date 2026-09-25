import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

// Ensure data and uploads directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const PRODUCT_UPLOADS_DIR = path.join(UPLOADS_DIR, 'products');
const DOC_UPLOADS_DIR = path.join(UPLOADS_DIR, 'documents');

for (const dir of [DATA_DIR, UPLOADS_DIR, PRODUCT_UPLOADS_DIR, DOC_UPLOADS_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, 'dhruba_power.db');
export const db = new DatabaseSync(DB_PATH);

// Enable WAL mode & foreign keys for high-performance concurrent transactions
db.exec(`PRAGMA journal_mode = WAL;`);
db.exec(`PRAGMA foreign_keys = ON;`);

export function initDatabase() {
  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      full_name TEXT NOT NULL,
      company TEXT,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer', 'admin', 'engineer')),
      reset_token TEXT,
      reset_token_expiry TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  `);

  // 2. Brands Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      country TEXT,
      logo_url TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
  `);

  // 3. Categories Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
  `);

  // 4. Series Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS series (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      brand_id TEXT,
      category_id TEXT,
      description TEXT,
      FOREIGN KEY(brand_id) REFERENCES brands(id) ON DELETE SET NULL,
      FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_series_brand ON series(brand_id);
    CREATE INDEX IF NOT EXISTS idx_series_category ON series(category_id);
  `);

  // 5. Products Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mpn TEXT UNIQUE NOT NULL,
      mfg_code TEXT,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      brand_id TEXT,
      brand_name TEXT NOT NULL,
      series_id TEXT,
      series_name TEXT,
      category_id TEXT NOT NULL,
      category_name TEXT NOT NULL,
      in_stock INTEGER NOT NULL DEFAULT 1,
      stock_location TEXT DEFAULT 'Barishal Central Warehouse',
      image_url TEXT,
      official_url TEXT,
      related_service_id TEXT,
      related_service_name TEXT,
      same_series_json TEXT,
      accessories_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_products_mpn ON products(mpn);
    CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_name);
    CREATE INDEX IF NOT EXISTS idx_products_stock ON products(in_stock);
  `);

  // 6. Specifications Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS specifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      key TEXT NOT NULL,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      numeric REAL,
      unit TEXT,
      normalized TEXT,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_specifications_product ON specifications(product_id);
    CREATE INDEX IF NOT EXISTS idx_specifications_key ON specifications(key);
  `);

  // 7. Documents Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      product_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('datasheet', 'manual', 'certificate', 'cad', 'drawing')),
      source_url TEXT NOT NULL,
      sha256 TEXT,
      size INTEGER DEFAULT 0,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_documents_product ON documents(product_id);
  `);

  // 8. Services Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      bengali_title TEXT,
      summary TEXT NOT NULL,
      icon_name TEXT,
      description TEXT NOT NULL,
      features_json TEXT,
      deliverables_json TEXT,
      related_products_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
  `);

  // 9. Projects Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      bengali_title TEXT,
      client TEXT NOT NULL,
      category TEXT NOT NULL,
      capacity TEXT,
      location TEXT NOT NULL,
      completion_date TEXT,
      status TEXT NOT NULL,
      progress_percent INTEGER DEFAULT 100,
      hero_image TEXT NOT NULL,
      images_json TEXT,
      scope_json TEXT,
      technical_details_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
  `);

  // 10. Experts Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS experts (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      bengali_name TEXT,
      photograph TEXT NOT NULL,
      designation TEXT NOT NULL,
      department TEXT NOT NULL,
      short_bio TEXT NOT NULL,
      whatsapp_number TEXT NOT NULL,
      email TEXT,
      experience_years INTEGER DEFAULT 5,
      certifications_json TEXT,
      display_order INTEGER DEFAULT 1,
      active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_experts_slug ON experts(slug);
    CREATE INDEX IF NOT EXISTS idx_experts_active ON experts(active);
  `);

  // 11. Blogs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      bengali_title TEXT,
      excerpt TEXT NOT NULL,
      read_time TEXT,
      author TEXT NOT NULL,
      publish_date TEXT NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      tags_json TEXT,
      image_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
  `);

  // 12. RFQs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS rfqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rfq_number TEXT UNIQUE NOT NULL,
      company TEXT NOT NULL,
      contact TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      whatsapp TEXT,
      location TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'NEW' CHECK(status IN ('NEW', 'REVIEWING', 'MATCHING', 'QUOTED', 'CUSTOMER_REVIEW', 'ACCEPTED', 'CONVERTED', 'REJECTED', 'CLOSED')),
      is_guest INTEGER DEFAULT 1,
      guest_token TEXT,
      user_id INTEGER,
      quoted_total REAL DEFAULT 0,
      currency TEXT DEFAULT 'BDT',
      internal_notes TEXT,
      wc_order_id INTEGER,
      files_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_rfqs_number ON rfqs(rfq_number);
    CREATE INDEX IF NOT EXISTS idx_rfqs_email ON rfqs(email);
    CREATE INDEX IF NOT EXISTS idx_rfqs_status ON rfqs(status);
    CREATE INDEX IF NOT EXISTS idx_rfqs_user ON rfqs(user_id);
  `);

  // 13. RFQ Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS rfq_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rfq_id INTEGER NOT NULL,
      product_id INTEGER,
      title TEXT NOT NULL,
      mpn TEXT NOT NULL,
      brand TEXT,
      quantity INTEGER NOT NULL DEFAULT 1,
      customer_note TEXT,
      unit_price REAL DEFAULT 0,
      line_total REAL DEFAULT 0,
      FOREIGN KEY(rfq_id) REFERENCES rfqs(id) ON DELETE CASCADE,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_rfq_items_rfq ON rfq_items(rfq_id);
  `);

  // 14. Import Jobs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS import_jobs (
      id TEXT PRIMARY KEY,
      job_type TEXT NOT NULL CHECK(job_type IN ('csv', 'xlsx', 'json', 'url', 'bulk_urls', 'pdf')),
      source_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED')),
      total_items INTEGER DEFAULT 0,
      processed_items INTEGER DEFAULT 0,
      error_count INTEGER DEFAULT 0,
      started_at TEXT NOT NULL,
      completed_at TEXT,
      log_json TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON import_jobs(status);
  `);

  // 15. Import Errors Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS import_errors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id TEXT NOT NULL,
      row_number INTEGER,
      error_message TEXT NOT NULL,
      raw_data_json TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(job_id) REFERENCES import_jobs(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_import_errors_job ON import_errors(job_id);
  `);

  // 16. Tombstones Table for 410 Gone tracking of permanently removed entities
  db.exec(`
    CREATE TABLE IF NOT EXISTS tombstones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      reason TEXT,
      deleted_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_tombstones_lookup ON tombstones(entity_type, entity_id);
  `);

  // Seed default data if empty
  seedDatabaseIfEmpty();
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function seedDatabaseIfEmpty() {
  const usersCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  const now = new Date().toISOString();

  if (usersCount === 0) {
    console.log('[DB] Seeding initial users...');
    // Seed Admin
    const adminSalt = crypto.randomBytes(32).toString('hex');
    const adminHash = hashPassword(process.env.ADMIN_DEFAULT_PASSWORD || 'dhruba2026', adminSalt);
    db.prepare(`
      INSERT INTO users (email, password_hash, salt, full_name, company, phone, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'admin@dhrubapower.com',
      adminHash,
      adminSalt,
      'Dhruba Power Chief Engineer',
      'Dhruba Power & Engineering',
      '+8801711197767',
      'admin',
      now,
      now
    );

    // Seed Demo Verified Customer
    const custSalt = crypto.randomBytes(32).toString('hex');
    const custHash = hashPassword('customer2026', custSalt);
    db.prepare(`
      INSERT INTO users (email, password_hash, salt, full_name, company, phone, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'engineer@beximco.com',
      custHash,
      custSalt,
      'Engr. Tariqul Islam',
      'Beximco Industrial Parks',
      '+8801712000000',
      'customer',
      now,
      now
    );
  }

  const brandsCount = (db.prepare('SELECT COUNT(*) as count FROM brands').get() as { count: number }).count;
  if (brandsCount === 0) {
    console.log('[DB] Seeding brands...');
    const brands = [
      { id: 'abb', name: 'ABB', slug: 'abb', country: 'Switzerland', logo_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200' },
      { id: 'schneider', name: 'Schneider Electric', slug: 'schneider-electric', country: 'France', logo_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200' },
      { id: 'siemens', name: 'Siemens', slug: 'siemens', country: 'Germany', logo_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200' },
      { id: 'hager', name: 'Hager', slug: 'hager', country: 'Germany', logo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200' },
      { id: 'hyundai', name: 'Hyundai Electric', slug: 'hyundai-electric', country: 'South Korea', logo_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=200' },
      { id: 'growatt', name: 'Growatt', slug: 'growatt', country: 'China', logo_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=200' },
      { id: 'hikvision', name: 'Hikvision', slug: 'hikvision', country: 'China', logo_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=200' },
      { id: 'legrand', name: 'Legrand', slug: 'legrand', country: 'France', logo_url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=200' }
    ];
    const insertBrand = db.prepare('INSERT INTO brands (id, name, slug, country, logo_url, created_at) VALUES (?, ?, ?, ?, ?, ?)');
    for (const b of brands) {
      insertBrand.run(b.id, b.name, b.slug, b.country, b.logo_url, now);
    }
  }

  const categoriesCount = (db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number }).count;
  if (categoriesCount === 0) {
    console.log('[DB] Seeding categories...');
    const categories = [
      { id: 'eee', name: 'Electrical & Power Distribution (EEE)', slug: 'eee', description: 'MCB, MCCB, ACB, Magnetic Contactors, VFDs, and HT/LT Switchgear accessories.' },
      { id: 'solar', name: 'Solar PV & Renewable Energy', slug: 'solar', description: 'On-grid inverters, hybrid inverters, solar charge controllers, and surge protection.' },
      { id: 'cctv', name: 'CCTV & Industrial Surveillance', slug: 'cctv', description: 'IP cameras, NVR recorders, PTZ perimeter surveillance, and PoE infrastructure.' }
    ];
    const insertCategory = db.prepare('INSERT INTO categories (id, name, slug, description, created_at) VALUES (?, ?, ?, ?, ?)');
    for (const c of categories) {
      insertCategory.run(c.id, c.name, c.slug, c.description, now);
    }
  }

  const seriesCount = (db.prepare('SELECT COUNT(*) as count FROM series').get() as { count: number }).count;
  if (seriesCount === 0) {
    console.log('[DB] Seeding product series...');
    const seriesList = [
      { id: 'compact-home-sh200', name: 'Compact Home SH200', slug: 'compact-home-sh200', brand_id: 'abb', category_id: 'eee', description: 'ABB Compact Home miniature circuit breaker series.' },
      { id: 'formula-a1', name: 'Formula A1', slug: 'formula-a1', brand_id: 'abb', category_id: 'eee', description: 'ABB Formula A1 molded case circuit breaker series.' },
      { id: 'acti9-ic60n', name: 'Acti9 iC60N', slug: 'acti9-ic60n', brand_id: 'schneider', category_id: 'eee', description: 'Schneider Acti9 high performance modular circuit breakers.' },
      { id: 'tesys-deca', name: 'TeSys Deca', slug: 'tesys-deca', brand_id: 'schneider', category_id: 'eee', description: 'Schneider TeSys industrial magnetic contactors.' },
      { id: 'sentron-5sl6', name: 'SENTRON 5SL6', slug: 'sentron-5sl6', brand_id: 'siemens', category_id: 'eee', description: 'Siemens SENTRON 5SL6 6kA miniature circuit breakers.' },
      { id: 'min-2500-6000tl-x', name: 'MIN 2500-6000TL-X', slug: 'min-2500-6000tl-x', brand_id: 'growatt', category_id: 'solar', description: 'Growatt commercial grid-tied string inverters.' },
      { id: 'sph-4000-10000tl3', name: 'SPH 4000-10000TL3 BH-UP', slug: 'sph-4000-10000tl3', brand_id: 'growatt', category_id: 'solar', description: 'Growatt three-phase hybrid solar storage inverters.' },
      { id: 'pro-series-easyip', name: 'Pro Series EasyIP 2.0+', slug: 'pro-series-easyip', brand_id: 'hikvision', category_id: 'cctv', description: 'Hikvision smart IP infrared perimeter surveillance cameras.' },
      { id: 'acusense-k-series', name: 'AcuSense K Series NVR', slug: 'acusense-k-series', brand_id: 'hikvision', category_id: 'cctv', description: 'Hikvision smart AcuSense network video recorders.' }
    ];
    const insertSeries = db.prepare('INSERT INTO series (id, name, slug, brand_id, category_id, description) VALUES (?, ?, ?, ?, ?, ?)');
    for (const s of seriesList) {
      insertSeries.run(s.id, s.name, s.slug, s.brand_id, s.category_id, s.description);
    }
  }

  const productsCount = (db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number }).count;
  if (productsCount === 0) {
    console.log('[DB] Seeding products with full technical specifications and documents...');
    import('./seedDataDirect.js').then((module) => {
      module.seedProductsDirect(db, now);
    }).catch((err) => {
      console.error('[DB] Error seeding products:', err);
    });
  }

  const servicesCount = (db.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number }).count;
  if (servicesCount === 0) {
    console.log('[DB] Seeding engineering services...');
    import('./seedDataDirect.js').then((module) => {
      module.seedServicesAndProjects(db, now);
    }).catch((err) => {
      console.error('[DB] Error seeding services/projects:', err);
    });
  }
}

export function recordTombstone(entityType: string, entityId: string, reason = 'Permanently discontinued or removed resource'): void {
  try {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO tombstones (entity_type, entity_id, reason, deleted_at)
      VALUES (?, ?, ?, ?)
    `).run(entityType, String(entityId), reason, now);
  } catch (err) {
    console.error('[Tombstone Error]', err);
  }
}

export function getTombstone(entityType: string, entityId: string): { reason: string; deleted_at: string } | null {
  try {
    return db.prepare(`
      SELECT reason, deleted_at FROM tombstones
      WHERE entity_type = ? AND entity_id = ?
      LIMIT 1
    `).get(entityType, String(entityId)) as any || null;
  } catch {
    return null;
  }
}

