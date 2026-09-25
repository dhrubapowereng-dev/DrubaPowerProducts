import { db, getTombstone } from './db.js';

export interface PageSeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  ogType: string;
  jsonLd: any[];
  crawlableHtml: string;
  noIndex: boolean;
  lang: 'en' | 'bn';
  is404?: boolean;
  is410?: boolean;
}

export function getSeoForPath(reqUrl: string, hostUrl: string): PageSeoMetadata {
  const urlObj = new URL(reqUrl, 'http://localhost');
  const rawPath = urlObj.pathname;
  const cleanPath = rawPath.replace(/\/+$/, '') || '/';
  const searchParams = urlObj.searchParams;
  const lang = searchParams.get('lang') === 'bn' ? 'bn' : 'en';

  // Canonical Host determination
  // If APP_URL is provided, prioritize it. In production, default to https://dhrubapower.com
  let appUrl = hostUrl.replace(/\/+$/, '');
  if (process.env.APP_URL && !process.env.APP_URL.includes('MY_APP_URL')) {
    appUrl = process.env.APP_URL.replace(/\/+$/, '');
  } else if (process.env.NODE_ENV === 'production' && !hostUrl.includes('localhost') && !hostUrl.includes('run.app')) {
    appUrl = 'https://dhrubapower.com';
  }

  // Canonical URL always points to normalized clean path
  const normalizedPath = cleanPath === '/' ? '/' : `${cleanPath}/`;
  const baseCanonical = `${appUrl}${normalizedPath}`;
  const canonicalUrl = lang === 'bn' ? `${baseCanonical}?lang=bn` : baseCanonical;
  const defaultLogo = `${appUrl}/dhrubapowerlogo.png`;

  // 1. Faceted navigation & search queries -> NOINDEX, FOLLOW to prevent index bloat
  const isFiltered = searchParams.has('q') || 
                     searchParams.has('brand') || 
                     searchParams.has('category') || 
                     searchParams.has('current') || 
                     searchParams.has('poles') || 
                     searchParams.has('sort') || 
                     searchParams.has('inStock') ||
                     cleanPath === '/search';

  // 2. Private, administrative, customer, and internal workflows -> NOINDEX, NOFOLLOW
  const isPrivatePath = 
    cleanPath.startsWith('/admin') ||
    cleanPath.startsWith('/api') ||
    cleanPath.startsWith('/account') ||
    cleanPath.startsWith('/rfq') ||
    cleanPath.startsWith('/internal') ||
    cleanPath.startsWith('/import') ||
    cleanPath.startsWith('/uploads/private');

  const forceNoIndex = process.env.DISALLOW_ALL_INDEXING === 'true';
  const shouldNoIndex = forceNoIndex || isFiltered || isPrivatePath;

  // Real Organization / LocalBusiness Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${appUrl}/#organization`,
    name: lang === 'bn' ? 'ধ্রুব পাওয়ার অ্যান্ড ইঞ্জিনিয়ারিং' : 'Dhruba Power & Engineering',
    alternateName: 'Dhruba Power',
    url: appUrl,
    logo: defaultLogo,
    image: defaultLogo,
    telephone: '+8801711197767',
    email: 'info@dhrubapower.com',
    priceRange: '$$',
    currenciesAccepted: 'BDT',
    paymentAccepted: 'Cash, Bank Transfer, Cheque, L/C',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Khan Sarak, Kazipar, C&B Road',
      addressLocality: 'Barishal',
      postalCode: '8200',
      addressCountry: 'BD'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '22.7010',
      longitude: '90.3535'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '20:00'
      }
    ]
  };

  // Helper for BreadcrumbList Schema
  const createBreadcrumbSchema = (crumbs: { name: string; item: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.name,
      item: c.item.startsWith('http') ? c.item : `${appUrl}${c.item.endsWith('/') || c.item === '/' ? c.item : c.item + '/'}`
    }))
  });

  // 1. Home
  if (cleanPath === '' || cleanPath === '/') {
    const title = lang === 'bn' 
      ? 'ধ্রুব পাওয়ার অ্যান্ড ইঞ্জিনিয়ারিং — সাব-স্টেশন, সোলার ও সুইচগিয়ার ইঞ্জিনিয়ারিং'
      : 'Dhruba Power Platform — Industrial Electrical, Solar & Substation Services';
    const description = lang === 'bn'
      ? 'ধ্রুব পাওয়ার অ্যান্ড ইঞ্জিনিয়ারিং: বরিশাল ও দেশব্যাপী ১১কেভি/০.৪১৫কেভি সাব-স্টেশন, বাণিজ্যিক সোলার, লাইটনিং অ্যারেস্টার ও এইচটি/এলটি সুইচগিয়ার সমাধান।'
      : 'Dhruba Power & Engineering provides certified HT/LT substation engineering, commercial solar solutions, lightning protection, switchgear, and industrial product catalog in Barishal, Bangladesh.';

    return {
      title,
      description,
      canonicalUrl,
      ogImage: defaultLogo,
      ogType: 'website',
      noIndex: shouldNoIndex,
      lang,
      jsonLd: [
        organizationSchema,
        createBreadcrumbSchema([{ name: lang === 'bn' ? 'হোম' : 'Home', item: '/' }])
      ],
      crawlableHtml: `
        <main>
          <h1>${title}</h1>
          <p>${description}</p>
          <nav>
            <a href="/about/">About Us</a> |
            <a href="/services/">Services</a> |
            <a href="/shop/">Industrial Catalog</a> |
            <a href="/projects/">Projects</a> |
            <a href="/experts/">Experts</a> |
            <a href="/blogs/">Engineering Insights</a> |
            <a href="/contact/">Contact</a>
          </nav>
        </main>
      `
    };
  }

  // 2. About
  if (cleanPath === '/about') {
    const title = lang === 'bn'
      ? 'আমাদের সম্পর্কে | ধ্রুব পাওয়ার অ্যান্ড ইঞ্জিনিয়ারিং'
      : 'About Us — 7+ Years Industrial Engineering Leadership | Dhruba Power';
    const description = lang === 'bn'
      ? 'বরিশাল ও দক্ষিণাঞ্চলে বিশ্বস্ত সাব-স্টেশন ও শিল্প বৈদ্যুতিক প্রকৌশল প্রতিষ্ঠান। ৭+ বছরের অভিজ্ঞতা এবং ৫০০+ সফল প্রকল্প।'
      : 'Authorized industrial electrical, solar, and HT/LT substation engineering contractor in Barishal, Bangladesh with over 500+ executed projects.';

    return {
      title,
      description,
      canonicalUrl,
      ogImage: defaultLogo,
      ogType: 'website',
      noIndex: shouldNoIndex,
      lang,
      jsonLd: [
        organizationSchema,
        createBreadcrumbSchema([
          { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
          { name: lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us', item: '/about/' }
        ])
      ],
      crawlableHtml: `
        <article>
          <h1>${title}</h1>
          <p>${description}</p>
          <p>Headquarters: Khan Sarak, Kazipar, C&amp;B Road, Barishal 8200, Bangladesh.</p>
        </article>
      `
    };
  }

  // 3. Contact
  if (cleanPath === '/contact') {
    const title = lang === 'bn'
      ? 'যোগাযোগ ও জরুরি সেবা | ধ্রুব পাওয়ার অ্যান্ড ইঞ্জিনিয়ারিং'
      : 'Contact & 24/7 Emergency Dispatch | Dhruba Power';
    const description = lang === 'bn'
      ? 'সাব-স্টেশন ব্রেকডাউন ও কারিগরি সহায়তায় যোগাযোগ করুন: +৮৮০ ১৭১১-১৯৭৭৬৭। খান সড়ক, কাজীপার, সিঅ্যান্ডবি রোড, বরিশাল।'
      : 'Contact Dhruba Power engineering desk in Barishal: +880 1711-197767. Substation inspection, solar quotes, and 24/7 emergency dispatch.';

    return {
      title,
      description,
      canonicalUrl,
      ogImage: defaultLogo,
      ogType: 'website',
      noIndex: shouldNoIndex,
      lang,
      jsonLd: [
        organizationSchema,
        createBreadcrumbSchema([
          { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
          { name: lang === 'bn' ? 'যোগাযোগ' : 'Contact', item: '/contact/' }
        ])
      ],
      crawlableHtml: `
        <article>
          <h1>${title}</h1>
          <p>${description}</p>
          <p>Hotline: +880 1711-197767 | Email: info@dhrubapower.com</p>
        </article>
      `
    };
  }

  // 4. Services: /services or /services/:slug
  if (cleanPath.startsWith('/services')) {
    const slug = cleanPath.split('/')[2];
    if (slug) {
      const s = db.prepare('SELECT * FROM services WHERE slug = ? OR id = ?').get(slug, slug) as any;
      if (s) {
        const title = lang === 'bn' && s.bengali_title ? `${s.bengali_title} | ধ্রুব পাওয়ার` : `${s.title} | Dhruba Power Services`;
        const description = s.summary || s.description?.slice(0, 160);
        return {
          title,
          description,
          canonicalUrl,
          ogImage: defaultLogo,
          ogType: 'website',
          noIndex: shouldNoIndex,
          lang,
          jsonLd: [
            organizationSchema,
            createBreadcrumbSchema([
              { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
              { name: lang === 'bn' ? 'সেবাসমূহ' : 'Services', item: '/services/' },
              { name: s.title, item: `/services/${s.slug}/` }
            ]),
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: s.title,
              description: s.description,
              serviceType: 'Industrial Electrical Engineering',
              provider: { '@id': `${appUrl}/#organization` },
              areaServed: { '@type': 'Country', name: 'Bangladesh' }
            }
          ],
          crawlableHtml: `
            <article>
              <h1>${title}</h1>
              <p>${s.description}</p>
              <a href="/contact/">Request Engineering Consultation</a>
            </article>
          `
        };
      }
    }

    const title = lang === 'bn' ? 'শিল্প বৈদ্যুতিক ও সাবস্টেশন সেবাসমূহ | ধ্রুব পাওয়ার' : 'Industrial Engineering Services | Dhruba Power';
    return {
      title,
      description: 'Comprehensive HT/LT Substation, Solar PV, Lightning Arresters, Electrical Wiring, CC-TV, and Panel Board Switchgear services.',
      canonicalUrl,
      ogImage: defaultLogo,
      ogType: 'website',
      noIndex: shouldNoIndex,
      lang,
      jsonLd: [
        organizationSchema,
        createBreadcrumbSchema([
          { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
          { name: lang === 'bn' ? 'সেবাসমূহ' : 'Services', item: '/services/' }
        ])
      ],
      crawlableHtml: '<h1>Industrial Engineering Services</h1>'
    };
  }

  // 5. Projects: /projects or /projects/:slug
  if (cleanPath.startsWith('/projects')) {
    const slug = cleanPath.split('/')[2];
    if (slug) {
      const p = db.prepare('SELECT * FROM projects WHERE slug = ? OR id = ?').get(slug, slug) as any;
      if (p) {
        const title = lang === 'bn' 
          ? `${p.title} | ধ্রুব পাওয়ার প্রকল্প পোর্টফোলিও`
          : `${p.title} | Dhruba Power Project Portfolio`;
        const description = lang === 'bn'
          ? `শিল্প প্রকৌশল প্রকল্প কেস স্টাডি: ${p.title} (${p.client}, ${p.location})। স্থিতি: ${p.status}। ধ্রুব পাওয়ার অ্যান্ড ইঞ্জিনিয়ারিং।`
          : `Industrial engineering case study: ${p.title} for ${p.client} at ${p.location}. Status: ${p.status}.`;
        const heroImg = p.hero_image?.startsWith('http') ? p.hero_image : `${appUrl}${p.hero_image || '/dhrubapowerlogo.png'}`;
        return {
          title,
          description,
          canonicalUrl,
          ogImage: heroImg,
          ogType: 'article',
          noIndex: shouldNoIndex,
          lang,
          jsonLd: [
            organizationSchema,
            createBreadcrumbSchema([
              { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
              { name: lang === 'bn' ? 'প্রকল্পসমূহ' : 'Projects', item: '/projects/' },
              { name: p.title, item: `/projects/${p.slug}/` }
            ]),
            {
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              headline: p.title,
              image: heroImg,
              creator: { '@id': `${appUrl}/#organization` },
              locationCreated: { '@type': 'Place', name: p.location }
            }
          ],
          crawlableHtml: `
            <article>
              <h1>${p.title}</h1>
              <p>Client: ${p.client} | Location: ${p.location} | Status: ${p.status}</p>
            </article>
          `
        };
      }
    }

    const title = lang === 'bn' ? 'সম্পন্ন অবকাঠামো ও বৈদ্যুতিক প্রকল্প | ধ্রুব পাওয়ার' : 'Infrastructure & Electrical Projects | Dhruba Power';
    return {
      title,
      description: 'Over 500+ completed electrical substations, commercial solar microgrids, and industrial automation installations across Bangladesh.',
      canonicalUrl,
      ogImage: defaultLogo,
      ogType: 'website',
      noIndex: shouldNoIndex,
      lang,
      jsonLd: [
        organizationSchema,
        createBreadcrumbSchema([
          { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
          { name: lang === 'bn' ? 'প্রকল্পসমূহ' : 'Projects', item: '/projects/' }
        ])
      ],
      crawlableHtml: '<h1>Completed Projects Portfolio</h1>'
    };
  }

  // 6. Products: /product/:idOrMpn, /products/:idOrMpn, or /eee/:brand/:category/:mpn/
  if (cleanPath.startsWith('/product') || cleanPath.startsWith('/products') || (cleanPath.startsWith('/eee/') && cleanPath.split('/').length >= 4)) {
    const segments = cleanPath.split('/').filter(Boolean);
    const idOrMpn = segments[segments.length - 1];

    if (idOrMpn) {
      let p: any;
      if (/^\d+$/.test(idOrMpn)) {
        p = db.prepare('SELECT * FROM products WHERE id = ?').get(parseInt(idOrMpn));
      }
      if (!p) {
        p = db.prepare(`
          SELECT * FROM products 
          WHERE LOWER(mpn) = ? 
             OR LOWER(sku) = ? 
             OR LOWER(REPLACE(mpn, '-', '')) = LOWER(REPLACE(?, '-', ''))
        `).get(idOrMpn.toLowerCase(), idOrMpn.toLowerCase(), idOrMpn);
      }

      // Check for 410 Gone (Permanently removed tombstone)
      if (!p) {
        const tombstone = getTombstone('product', idOrMpn);
        if (tombstone) {
          const tTitle = lang === 'bn' 
            ? 'পণ্যটি অপসারিত (৪১০ গন) | ধ্রুব পাওয়ার ক্যাটালগ' 
            : 'Product Discontinued (410 Gone) | Dhruba Power Catalog';
          const tDesc = lang === 'bn'
            ? 'এই পণ্যটি ধ্রুব পাওয়ার ক্যাটালগ থেকে স্থায়ীভাবে প্রত্যাহার করা হয়েছে।'
            : `This product has been permanently discontinued and removed from the active Dhruba Power catalog: ${tombstone.reason || ''}`;

          return {
            title: tTitle,
            description: tDesc,
            canonicalUrl,
            ogImage: defaultLogo,
            ogType: 'website',
            noIndex: true,
            lang,
            is410: true,
            jsonLd: [organizationSchema],
            crawlableHtml: `<h1>410 — Product Discontinued</h1><p>${tombstone.reason || 'This product is no longer part of our active distribution line.'}</p><a href="/shop/">Browse Active Catalog</a>`
          };
        }
      }

      if (p) {
        const title = lang === 'bn'
          ? `${p.name} (MPN: ${p.mpn}) | ধ্রুব পাওয়ার ক্যাটালগ`
          : `${p.name} (MPN: ${p.mpn}) | Dhruba Power Catalog`;
        const description = lang === 'bn'
          ? `অথরাইজড ${p.brand_name} ${p.category_name}। পার্ট নম্বর (MPN): ${p.mpn}, SKU: ${p.sku}। স্টক স্থিতি: ${p.in_stock ? 'বরিশাল ওয়্যারহাউসে মজুদ আছে' : 'অর্ডারে সরবরাহযোগ্য'}। ধ্রুব পাওয়ার অ্যান্ড ইঞ্জিনিয়ারিং।`
          : `Authorized ${p.brand_name} ${p.category_name} in Barishal, Bangladesh. MPN: ${p.mpn}, SKU: ${p.sku}. In Stock: ${p.in_stock ? 'Yes' : 'Available by Order'}.`;
        const productImg = p.image_url?.startsWith('http') ? p.image_url : `${appUrl}${p.image_url || '/dhrubapowerlogo.png'}`;

        // Fetch real specifications for schema.org additionalProperty
        const specs = db.prepare(`
          SELECT label, value FROM specifications
          WHERE product_id = ?
          ORDER BY display_order ASC
        `).all(p.id) as any[];

        const additionalProps = specs.map((s: any) => ({
          '@type': 'PropertyValue',
          name: s.label,
          value: s.value
        }));

        // Real Product Schema (NO FAKE RATING, NO FAKE REVIEWS, REAL INVENTORY)
        const productSchema: any = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.name,
          image: productImg,
          description,
          sku: p.sku,
          mpn: p.mpn,
          brand: {
            '@type': 'Brand',
            name: p.brand_name
          },
          offers: {
            '@type': 'Offer',
            url: canonicalUrl,
            priceCurrency: 'BDT',
            availability: p.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
            seller: { '@id': `${appUrl}/#organization` }
          }
        };

        if (additionalProps.length > 0) {
          productSchema.additionalProperty = additionalProps;
        }

        return {
          title,
          description,
          canonicalUrl,
          ogImage: productImg,
          ogType: 'product',
          noIndex: shouldNoIndex,
          lang,
          jsonLd: [
            organizationSchema,
            createBreadcrumbSchema([
              { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
              { name: lang === 'bn' ? 'ক্যাটালগ' : 'Shop', item: '/shop/' },
              { name: p.category_name || 'Electrical', item: `/category/${p.category_id}/` },
              { name: p.name, item: `/product/${p.id}/` }
            ]),
            productSchema
          ],
          crawlableHtml: `
            <article itemscope itemtype="https://schema.org/Product">
              <h1 itemprop="name">${p.name}</h1>
              <p>Brand: <span itemprop="brand">${p.brand_name}</span> | MPN: <span itemprop="mpn">${p.mpn}</span> | SKU: <span>${p.sku}</span></p>
              <p>Inventory: ${p.in_stock ? 'In Stock at Barishal Central Warehouse' : 'Available to Order'}</p>
              ${specs.length > 0 ? `<ul>${specs.map((s: any) => `<li><strong>${s.label}:</strong> ${s.value}</li>`).join('')}</ul>` : ''}
              <a href="/rfq/">Request Commercial BDT Quotation</a>
            </article>
          `
        };
      }
    }
  }

  // 7. Series: /series/:slug or /brand/:brandSlug/series/:seriesSlug
  if (cleanPath.startsWith('/series') || cleanPath.includes('/series/')) {
    const segments = cleanPath.split('/').filter(Boolean);
    const seriesSlug = segments[segments.length - 1];
    const series = db.prepare(`
      SELECT s.*, b.name as brand_name, b.slug as brand_slug
      FROM series s
      LEFT JOIN brands b ON s.brand_id = b.id
      WHERE s.slug = ? OR s.id = ?
    `).get(seriesSlug, seriesSlug) as any;

    if (series) {
      const title = lang === 'bn'
        ? `${series.name} সিরিজ — ${series.brand_name || 'ইন্ডাস্ট্রিয়াল'} | ধ্রুব পাওয়ার`
        : `${series.name} Series — ${series.brand_name || 'Industrial'} | Dhruba Power Official Catalog`;
      const description = series.description || `Explore ${series.name} industrial series by ${series.brand_name} available at Dhruba Power with certified technical specifications and Barishal warehouse stock.`;

      return {
        title,
        description,
        canonicalUrl,
        ogImage: defaultLogo,
        ogType: 'website',
        noIndex: shouldNoIndex,
        lang,
        jsonLd: [
          organizationSchema,
          createBreadcrumbSchema([
            { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
            { name: lang === 'bn' ? 'ক্যাটালগ' : 'Shop', item: '/shop/' },
            ...(series.brand_name ? [{ name: series.brand_name, item: `/brand/${series.brand_slug}/` }] : []),
            { name: series.name, item: `/series/${series.slug}/` }
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${series.name} Series`,
            description,
            publisher: { '@id': `${appUrl}/#organization` }
          }
        ],
        crawlableHtml: `
          <article>
            <h1>${series.name} Industrial Series</h1>
            <p>${description}</p>
            <p>Brand: ${series.brand_name || 'Dhruba Power Certified'}</p>
            <a href="/shop/">View all products in ${series.name}</a>
          </article>
        `
      };
    }
  }

  // 8. Categories: /category/:slug, /categories/:slug, /eee, /solar, /cctv
  if (cleanPath.startsWith('/category/') || cleanPath.startsWith('/categories/') || cleanPath === '/eee' || cleanPath === '/solar' || cleanPath === '/cctv' || cleanPath.startsWith('/eee/') || cleanPath.startsWith('/solar/') || cleanPath.startsWith('/cctv/')) {
    const segments = cleanPath.split('/').filter(Boolean);
    const catSlug = segments.length > 1 ? segments[1] : segments[0];
    const cat = db.prepare('SELECT * FROM categories WHERE slug = ? OR id = ?').get(catSlug, catSlug) as any;
    const catName = cat?.name || (catSlug === 'eee' ? 'Electrical & Power Distribution (EEE)' : catSlug === 'solar' ? 'Solar PV & Renewable Energy' : catSlug === 'cctv' ? 'CCTV & Industrial Surveillance' : 'Industrial Electrical Products');

    const title = lang === 'bn'
      ? `${catName} | ধ্রুব পাওয়ার অফিশিয়াল ক্যাটালগ`
      : `${catName} | Dhruba Power Official Catalog`;
    const description = lang === 'bn'
      ? `জেনুইন ${catName} কম্পোনেন্ট, সুইচগিয়ার এবং স্পেসিফিকেশন। বরিশাল ওয়্যারহাউস থেকে দ্রুত ডেলিভারি।`
      : `Browse authorized ${catName} components, switchgear, and technical specifications with Barishal stock availability.`;

    return {
      title,
      description,
      canonicalUrl,
      ogImage: defaultLogo,
      ogType: 'website',
      noIndex: shouldNoIndex,
      lang,
      jsonLd: [
        organizationSchema,
        createBreadcrumbSchema([
          { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
          { name: lang === 'bn' ? 'ক্যাটালগ' : 'Shop', item: '/shop/' },
          { name: catName, item: `/category/${catSlug}/` }
        ])
      ],
      crawlableHtml: `<h1>${catName}</h1><p>${description}</p>`
    };
  }

  // 9. Brands: /brand/:slug or /brands/:slug
  if (cleanPath.startsWith('/brand/') || cleanPath.startsWith('/brands/')) {
    const brandSlug = cleanPath.split('/')[2];
    const brand = db.prepare('SELECT * FROM brands WHERE slug = ? OR id = ?').get(brandSlug, brandSlug) as any;
    const brandName = brand?.name || (brandSlug ? brandSlug.toUpperCase() : 'Industrial Brands');

    const title = lang === 'bn'
      ? `অথরাইজড ${brandName} সুইচগিয়ার ও কম্পোনেন্ট | ধ্রুব পাওয়ার`
      : `Authorized ${brandName} Switchgear & Components | Dhruba Power`;
    const description = lang === 'bn'
      ? `বরিশাল ও বাংলাদেশে জেনুইন ${brandName} পণ্যের অনুমোদিত সরবরাহ ও ইঞ্জিনিয়ারিং সেবা।`
      : `Official distributor and engineering partner for genuine ${brandName} industrial electrical products in Barishal, Bangladesh.`;

    return {
      title,
      description,
      canonicalUrl,
      ogImage: brand?.logo_url || defaultLogo,
      ogType: 'website',
      noIndex: shouldNoIndex,
      lang,
      jsonLd: [
        organizationSchema,
        createBreadcrumbSchema([
          { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
          { name: lang === 'bn' ? 'ব্র্যান্ডসমূহ' : 'Brands', item: '/shop/' },
          { name: brandName, item: `/brand/${brandSlug}/` }
        ])
      ],
      crawlableHtml: `<h1>${brandName} Industrial Products</h1><p>${description}</p>`
    };
  }

  // 10. Experts: /experts or /experts/:slug
  if (cleanPath.startsWith('/experts')) {
    const slug = cleanPath.split('/')[2];
    if (slug) {
      const exp = db.prepare('SELECT * FROM experts WHERE slug = ? OR id = ?').get(slug, slug) as any;
      if (exp) {
        const title = lang === 'bn'
          ? `${exp.name} — ${exp.designation} | ধ্রুব পাওয়ার`
          : `${exp.name} — ${exp.designation} | Dhruba Power`;
        const description = lang === 'bn'
          ? `${exp.name} (${exp.department})। সরাসরি হোয়াটসঅ্যাপ পরামর্শ: ${exp.whatsapp_number}।`
          : `${exp.short_bio} WhatsApp direct consultation: ${exp.whatsapp_number}.`;
        const photoUrl = exp.photograph?.startsWith('http') ? exp.photograph : `${appUrl}${exp.photograph || '/dhrubapowerlogo.png'}`;

        return {
          title,
          description,
          canonicalUrl,
          ogImage: photoUrl,
          ogType: 'profile',
          noIndex: shouldNoIndex,
          lang,
          jsonLd: [
            organizationSchema,
            createBreadcrumbSchema([
              { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
              { name: lang === 'bn' ? 'প্রকৌশলী দল' : 'Experts', item: '/experts/' },
              { name: exp.name, item: `/experts/${exp.slug}/` }
            ]),
            {
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: exp.name,
              jobTitle: exp.designation,
              telephone: exp.whatsapp_number,
              email: exp.email || 'info@dhrubapower.com',
              worksFor: { '@id': `${appUrl}/#organization` }
            }
          ],
          crawlableHtml: `
            <article>
              <h1>${exp.name}</h1>
              <h2>${exp.designation} — ${exp.department}</h2>
              <p>${exp.short_bio}</p>
              <p>Direct WhatsApp: <a href="https://wa.me/${exp.whatsapp_number.replace(/[^0-9]/g, '')}">${exp.whatsapp_number}</a></p>
            </article>
          `
        };
      }
    }

    const title = lang === 'bn' ? 'প্রত্যয়িত প্রকৌশল বিশেষজ্ঞ ও হোয়াটসঅ্যাপ ডিরেক্টরি | ধ্রুব পাওয়ার' : 'Certified Engineering Specialists & WhatsApp Directory | Dhruba Power';
    return {
      title,
      description: 'Connect directly with certified substation, power distribution, and solar engineers at Dhruba Power.',
      canonicalUrl,
      ogImage: defaultLogo,
      ogType: 'website',
      noIndex: shouldNoIndex,
      lang,
      jsonLd: [
        organizationSchema,
        createBreadcrumbSchema([
          { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
          { name: lang === 'bn' ? 'প্রকৌশলী দল' : 'Experts', item: '/experts/' }
        ])
      ],
      crawlableHtml: '<h1>Certified Engineering Team</h1>'
    };
  }

  // 11. Blogs: /blogs or /blog/:slug
  if (cleanPath.startsWith('/blog') || cleanPath.startsWith('/blogs')) {
    const slug = cleanPath.split('/')[2];
    if (slug) {
      const b = db.prepare('SELECT * FROM blogs WHERE slug = ? OR id = ?').get(slug, slug) as any;
      if (b) {
        const title = lang === 'bn' && b.bengali_title ? `${b.bengali_title} | ধ্রুব পাওয়ার` : `${b.title} | Dhruba Power Insights`;
        const description = b.excerpt;
        const blogImg = b.image_url?.startsWith('http') ? b.image_url : `${appUrl}${b.image_url || '/dhrubapowerlogo.png'}`;

        return {
          title,
          description,
          canonicalUrl,
          ogImage: blogImg,
          ogType: 'article',
          noIndex: shouldNoIndex,
          lang,
          jsonLd: [
            organizationSchema,
            createBreadcrumbSchema([
              { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
              { name: lang === 'bn' ? 'ব্লগ' : 'Blogs', item: '/blogs/' },
              { name: b.title, item: `/blog/${b.slug}/` }
            ]),
            {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: b.title,
              image: blogImg,
              author: { '@type': 'Person', name: b.author },
              publisher: { '@id': `${appUrl}/#organization` },
              datePublished: b.publish_date,
              description: b.excerpt
            }
          ],
          crawlableHtml: `
            <article>
              <h1>${b.title}</h1>
              <p>Author: ${b.author} | Date: ${b.publish_date}</p>
              <div>${b.content}</div>
            </article>
          `
        };
      }
    }

    const title = lang === 'bn' ? 'ইঞ্জিনিয়ারিং ব্লগ ও সাব-স্টেশন নির্দেশিকা | ধ্রুব পাওয়ার' : 'Engineering Blog & Substation Guidelines | Dhruba Power';
    return {
      title,
      description: 'Technical engineering publications on HT/LT substation maintenance, net-metering solar, and BNBC compliance in Bangladesh.',
      canonicalUrl,
      ogImage: defaultLogo,
      ogType: 'website',
      noIndex: shouldNoIndex,
      lang,
      jsonLd: [
        organizationSchema,
        createBreadcrumbSchema([
          { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
          { name: lang === 'bn' ? 'ব্লগ' : 'Blogs', item: '/blogs/' }
        ])
      ],
      crawlableHtml: '<h1>Engineering Blog</h1>'
    };
  }

  // 12. Shop / Catalogue Landing
  if (cleanPath === '/shop' || cleanPath === '/catalogue') {
    const title = lang === 'bn' ? 'ইন্ডাস্ট্রিয়াল ইকুইপমেন্ট ক্যাটালগ | ধ্রুব পাওয়ার' : 'Industrial Equipment & Electrical Catalog | Dhruba Power';
    const description = lang === 'bn'
      ? 'এবিবি, স্নাইডার ইলেকট্রিক, সিমেন্স, গ্রোওয়াট ও হিকভিশন পণ্য ক্যাটালগ। লাইভ স্টক ও স্পেসিফিকেশন।'
      : 'Faceted search for ABB, Schneider, Siemens MCBs, MCCBs, contactors, Growatt solar inverters, and Hikvision surveillance with live stock in Barishal.';

    return {
      title,
      description,
      canonicalUrl,
      ogImage: defaultLogo,
      ogType: 'website',
      noIndex: shouldNoIndex,
      lang,
      jsonLd: [
        organizationSchema,
        createBreadcrumbSchema([
          { name: lang === 'bn' ? 'হোম' : 'Home', item: '/' },
          { name: lang === 'bn' ? 'ক্যাটালগ' : 'Shop', item: '/shop/' }
        ])
      ],
      crawlableHtml: `<h1>${title}</h1><p>${description}</p>`
    };
  }

  // Fallback 404
  return {
    title: lang === 'bn' ? 'পৃষ্ঠাটি পাওয়া যায়নি (৪০৪) | ধ্রুব পাওয়ার' : 'Page Not Found (404) | Dhruba Power & Engineering',
    description: 'The requested engineering resource or catalog item could not be located. Browse our industrial catalog or return home.',
    canonicalUrl,
    ogImage: defaultLogo,
    ogType: 'website',
    noIndex: true, // Never index 404 pages!
    lang,
    is404: true,
    jsonLd: [organizationSchema],
    crawlableHtml: '<h1>404 — Page Not Found</h1><p>The requested page does not exist. <a href="/">Return to Homepage</a>.</p>'
  };
}

export function injectSeoIntoHtml(html: string, seo: PageSeoMetadata): string {
  let updated = html;

  // Set <html lang="...">
  updated = updated.replace(/<html(?:\s+lang=["'][^"']*["'])?/i, `<html lang="${seo.lang}"`);

  // Replace <title>
  updated = updated.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);

  // Inject or update meta description
  if (/<meta\s+name=["']description["']/i.test(updated)) {
    updated = updated.replace(/<meta\s+name=["']description["'].*?>/i, `<meta name="description" content="${escapeHtml(seo.description)}" />`);
  } else {
    updated = updated.replace('</head>', `<meta name="description" content="${escapeHtml(seo.description)}" />\n</head>`);
  }

  // Build Robots Tag (respecting indexable content vs noindex filtered/private/404/410)
  let robotsTag = '';
  if (seo.is404 || seo.is410) {
    robotsTag = '<meta name="robots" content="noindex, nofollow" />';
  } else if (seo.noIndex) {
    robotsTag = '<meta name="robots" content="noindex, follow" />';
  } else {
    robotsTag = '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />';
  }

  // Build Hreflang Tags
  const baseCanonicalNoQuery = seo.canonicalUrl.split('?')[0];
  const hreflangTags = `
    <link rel="alternate" hreflang="en" href="${escapeHtml(baseCanonicalNoQuery)}" />
    <link rel="alternate" hreflang="bn" href="${escapeHtml(baseCanonicalNoQuery)}?lang=bn" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(baseCanonicalNoQuery)}" />
  `;

  // Build OpenGraph & Twitter Tags
  const socialTags = `
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:url" content="${escapeHtml(seo.canonicalUrl)}" />
    <meta property="og:image" content="${escapeHtml(seo.ogImage)}" />
    <meta property="og:type" content="${escapeHtml(seo.ogType)}" />
    <meta property="og:site_name" content="Dhruba Power & Engineering" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:image" content="${escapeHtml(seo.ogImage)}" />
  `;

  // Build JSON-LD Scripts
  const jsonLdScripts = seo.jsonLd
    .map((schema) => `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`)
    .join('\n');

  const headAdditions = `
    ${robotsTag}
    <link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />
    ${hreflangTags}
    ${socialTags}
    ${jsonLdScripts}
  `;

  updated = updated.replace('</head>', `${headAdditions}\n</head>`);

  // Crawlable Fallback Content inside <noscript>
  const crawlableBlock = `
    <noscript>
      <div style="padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #0f172a; max-width: 900px; margin: 0 auto; line-height: 1.6;">
        ${seo.crawlableHtml}
      </div>
    </noscript>
  `;

  updated = updated.replace('</body>', `${crawlableBlock}\n</body>`);

  return updated;
}

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
