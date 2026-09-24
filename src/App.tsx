import React, { useState, useMemo, useEffect } from 'react';
import { INDUSTRIAL_PRODUCTS } from './data/mockProducts';
import { ProductItem, RfqItem, RfqRecord, RfqStatus, ExpertItem } from './types/catalog';
import { INITIAL_RFQS } from './data/mockRfqs';
import { INITIAL_EXPERTS } from './data/mockExperts';
import { SERVICES_DATA } from './data/servicesData';
import { PROJECTS_DATA } from './data/projectsData';
import { BLOGS_DATA } from './data/blogsData';
import { Language, TRANSLATIONS } from './data/translations';

import { Header } from './components/Header';
import { HomepageSections } from './components/HomepageSections';
import { PublicFooter } from './components/PublicFooter';

import { AboutPage } from './pages/AboutPage';
import { ServicesLandingPage } from './pages/ServicesLandingPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ProjectsLandingPage } from './pages/ProjectsLandingPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ExpertsLandingPage } from './pages/ExpertsLandingPage';
import { ExpertDetailPage } from './pages/ExpertDetailPage';
import { BlogsLandingPage } from './pages/BlogsLandingPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { ContactPage } from './pages/ContactPage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

import { ProductDetailModal } from './components/ProductDetailModal';
import { RfqDrawer } from './components/RfqDrawer';
import { AccountModal } from './components/AccountModal';
import { AdminDeskModal } from './components/AdminDeskModal';
import { CompareModal } from './components/CompareModal';
import { WishlistModal } from './components/WishlistModal';
import { RfqHistoryModal } from './components/RfqHistoryModal';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = TRANSLATIONS[lang];

  // Routing State synced with window.location.pathname
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    let cleanPath = path;
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }

    if (window.location.pathname !== cleanPath) {
      window.history.pushState({}, '', cleanPath);
      setCurrentPath(cleanPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Catalog Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCurrents, setSelectedCurrents] = useState<string[]>([]);
  const [selectedPoles, setSelectedPoles] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modals & Public Drawers
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [rfqBasket, setRfqBasket] = useState<RfqItem[]>([]);
  const [comparedProducts, setComparedProducts] = useState<ProductItem[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<ProductItem[]>([]);
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCustomerHistoryOpen, setIsCustomerHistoryOpen] = useState(false);

  // Authentication State: Gated for Staff only
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false);
  const [isAdminDeskOpen, setIsAdminDeskOpen] = useState(false);

  // Products State (supports in-memory CRUD for staff testing)
  const [catalogProducts, setCatalogProducts] = useState<ProductItem[]>(INDUSTRIAL_PRODUCTS);

  // Dynamic Experts State (CRUD managed by staff, persisted in localStorage)
  const [experts, setExperts] = useState<ExpertItem[]>(() => {
    try {
      const saved = localStorage.getItem('dp_experts_records');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_EXPERTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('dp_experts_records', JSON.stringify(experts));
    } catch {
      // ignore
    }
  }, [experts]);

  const handleSaveExpert = (expert: ExpertItem) => {
    setExperts((prev) => {
      const exists = prev.some((e) => e.id === expert.id);
      if (exists) {
        return prev.map((e) => (e.id === expert.id ? expert : e));
      }
      return [...prev, expert];
    });
  };

  const handleDeleteExpert = (expertId: string) => {
    setExperts((prev) => prev.filter((e) => e.id !== expertId));
  };

  const handleToggleExpertActive = (expertId: string) => {
    setExperts((prev) =>
      prev.map((e) => (e.id === expertId ? { ...e, active: !e.active } : e))
    );
  };

  // RFQ Store
  const [rfqs, setRfqs] = useState<RfqRecord[]>(() => {
    try {
      const saved = localStorage.getItem('dp_rfq_records');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_RFQS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('dp_rfq_records', JSON.stringify(rfqs));
    } catch {
      // ignore
    }
  }, [rfqs]);

  // RFQ Handlers
  const handleAddToRfq = (product: ProductItem, qty: number = 1) => {
    setRfqBasket((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { productId: product.id, product, quantity: qty, customerNote: '' }];
    });
  };

  const handleQuickQuote = (product: ProductItem, qty: number = 1) => {
    handleAddToRfq(product, qty);
    setIsRfqOpen(true);
  };

  const handleCreateRfq = (rfqData: Omit<RfqRecord, 'id' | 'createdAt' | 'updatedAt'>): RfqRecord => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const nextId = rfqs.length > 0 ? Math.max(...rfqs.map((r) => r.id)) + 1 : 101;
    const newRecord: RfqRecord = {
      ...rfqData,
      id: nextId,
      createdAt: now,
      updatedAt: now
    };

    setRfqs((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const handleUpdateRfqStatus = (rfqId: number, status: RfqStatus, quotedTotal?: number) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setRfqs((prev) =>
      prev.map((r) =>
        r.id === rfqId
          ? {
              ...r,
              status,
              quotedTotal: quotedTotal !== undefined ? quotedTotal : r.quotedTotal,
              updatedAt: now
            }
          : r
      )
    );
  };

  const handleConvertToWcOrder = (rfqId: number): number => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const orderId = Math.floor(1000 + Math.random() * 9000);

    setRfqs((prev) =>
      prev.map((r) =>
        r.id === rfqId
          ? {
              ...r,
              status: 'CONVERTED' as RfqStatus,
              wcOrderId: orderId,
              updatedAt: now
            }
          : r
      )
    );
    return orderId;
  };

  // Compare & Wishlist Handlers
  const handleToggleCompare = (product: ProductItem) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 industrial items simultaneously.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleToggleWishlist = (product: ProductItem) => {
    setWishlistProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSelectedBrands([]);
    setSelectedCurrents([]);
    setSelectedPoles([]);
    setInStockOnly(false);
  };

  const totalRfqUnits = rfqBasket.reduce((sum, item) => sum + item.quantity, 0);

  // Normalize current path for route matching (remove trailing slash except for root)
  const normalizedPath = currentPath.length > 1 && currentPath.endsWith('/')
    ? currentPath.slice(0, -1)
    : currentPath;

  // Sync Document Title
  useEffect(() => {
    let pageTitle = 'Dhruba Power Platform — Industrial Electrical, Solar & Substation Services';

    if (normalizedPath === '/about') {
      pageTitle = 'About Us — Dhruba Power & Engineering';
    } else if (normalizedPath === '/services') {
      pageTitle = 'Core Engineering Services — Dhruba Power & Engineering';
    } else if (normalizedPath.startsWith('/services/')) {
      const slug = normalizedPath.replace('/services/', '');
      const svc = SERVICES_DATA.find((s) => s.slug === slug || s.id === slug);
      if (svc) pageTitle = `${svc.title} — Dhruba Power & Engineering`;
    } else if (normalizedPath === '/projects') {
      pageTitle = 'Engineering Projects & Installations — Dhruba Power & Engineering';
    } else if (normalizedPath.startsWith('/projects/')) {
      const slug = normalizedPath.replace('/projects/', '');
      const prj = PROJECTS_DATA.find((p) => p.slug === slug || p.id === slug);
      if (prj) pageTitle = `${prj.title} — Dhruba Power & Engineering`;
    } else if (normalizedPath === '/experts') {
      pageTitle = 'Certified Engineering Team — Dhruba Power & Engineering';
    } else if (normalizedPath.startsWith('/experts/')) {
      const slug = normalizedPath.replace('/experts/', '');
      const exp = experts.find((e) => (e.slug || e.id) === slug);
      if (exp) pageTitle = `${exp.name} — Dhruba Power Expert Profile`;
    } else if (normalizedPath === '/blogs' || normalizedPath === '/blog') {
      pageTitle = 'Engineering Knowledge & Technical Articles — Dhruba Power';
    } else if (normalizedPath.startsWith('/blog/')) {
      const slug = normalizedPath.replace('/blog/', '');
      const post = BLOGS_DATA.find((b) => b.slug === slug || b.id === slug);
      if (post) pageTitle = `${post.title} — Dhruba Power Articles`;
    } else if (normalizedPath === '/contact') {
      pageTitle = 'Contact Us — Dhruba Power Barishal Headquarters';
    } else if (normalizedPath === '/shop' || normalizedPath === '/catalogue') {
      pageTitle = 'Industrial Equipment Catalogue & Shop — Dhruba Power';
    } else if (normalizedPath.startsWith('/product/')) {
      const idOrSlug = normalizedPath.replace('/product/', '');
      const prod = catalogProducts.find((p) => p.id.toString() === idOrSlug || p.mpn.toLowerCase() === idOrSlug.toLowerCase());
      if (prod) pageTitle = `${prod.name} (MPN: ${prod.mpn}) — Dhruba Power`;
    }

    document.title = pageTitle;
  }, [normalizedPath, catalogProducts, experts]);

  // Route Dispatcher
  const renderCurrentView = () => {
    // 1. About Page (/about/)
    if (normalizedPath === '/about') {
      return (
        <AboutPage
          lang={lang}
          onNavigate={navigateTo}
          onRequestQuote={() => setIsRfqOpen(true)}
        />
      );
    }

    // 2. Services Landing Page (/services/)
    if (normalizedPath === '/services') {
      return (
        <ServicesLandingPage
          lang={lang}
          onNavigate={navigateTo}
          onRequestQuote={() => setIsRfqOpen(true)}
        />
      );
    }

    // 3. Six Individual Service Pages (/services/:slug/)
    if (normalizedPath.startsWith('/services/')) {
      const serviceSlug = normalizedPath.replace('/services/', '');
      const matchedService = SERVICES_DATA.find((s) => s.slug === serviceSlug || s.id === serviceSlug);

      if (matchedService) {
        return (
          <ServiceDetailPage
            service={matchedService}
            lang={lang}
            onNavigate={navigateTo}
            onRequestQuote={() => setIsRfqOpen(true)}
          />
        );
      }
      return (
        <ServicesLandingPage
          lang={lang}
          onNavigate={navigateTo}
          onRequestQuote={() => setIsRfqOpen(true)}
        />
      );
    }

    // 4. Projects Landing Page (/projects/)
    if (normalizedPath === '/projects') {
      return (
        <ProjectsLandingPage
          lang={lang}
          onNavigate={navigateTo}
          onRequestQuote={() => setIsRfqOpen(true)}
        />
      );
    }

    // 5. Individual Project Pages (/projects/:slug/)
    if (normalizedPath.startsWith('/projects/')) {
      const projectSlug = normalizedPath.replace('/projects/', '');
      const matchedProject = PROJECTS_DATA.find((p) => p.slug === projectSlug || p.id === projectSlug);

      if (matchedProject) {
        return (
          <ProjectDetailPage
            project={matchedProject}
            lang={lang}
            onNavigate={navigateTo}
            onRequestQuote={() => setIsRfqOpen(true)}
          />
        );
      }
      return (
        <ProjectsLandingPage
          lang={lang}
          onNavigate={navigateTo}
          onRequestQuote={() => setIsRfqOpen(true)}
        />
      );
    }

    // 6. Experts Landing Page (/experts/)
    if (normalizedPath === '/experts') {
      return (
        <ExpertsLandingPage
          experts={experts}
          lang={lang}
          onNavigate={navigateTo}
          onRequestQuote={() => setIsRfqOpen(true)}
        />
      );
    }

    // 7. Individual Expert Pages (/experts/:slug/)
    if (normalizedPath.startsWith('/experts/')) {
      const expertSlug = normalizedPath.replace('/experts/', '');
      const matchedExpert = experts.find((e) => (e.slug || e.id) === expertSlug);

      if (matchedExpert) {
        return (
          <ExpertDetailPage
            expert={matchedExpert}
            lang={lang}
            onNavigate={navigateTo}
            onRequestQuote={() => setIsRfqOpen(true)}
          />
        );
      }
      return (
        <ExpertsLandingPage
          experts={experts}
          lang={lang}
          onNavigate={navigateTo}
          onRequestQuote={() => setIsRfqOpen(true)}
        />
      );
    }

    // 8. Blogs Landing Page (/blogs/ or /blog/)
    if (normalizedPath === '/blogs' || normalizedPath === '/blog') {
      return (
        <BlogsLandingPage
          lang={lang}
          onNavigate={navigateTo}
        />
      );
    }

    // 9. Individual Blog Post Page (/blog/:slug/)
    if (normalizedPath.startsWith('/blog/')) {
      const blogSlug = normalizedPath.replace('/blog/', '');
      const matchedBlog = BLOGS_DATA.find((b) => b.slug === blogSlug || b.id === blogSlug);

      if (matchedBlog) {
        return (
          <BlogDetailPage
            blog={matchedBlog}
            lang={lang}
            onNavigate={navigateTo}
            onRequestQuote={() => setIsRfqOpen(true)}
          />
        );
      }
      return (
        <BlogsLandingPage
          lang={lang}
          onNavigate={navigateTo}
        />
      );
    }

    // 10. Contact Page (/contact/)
    if (normalizedPath === '/contact') {
      return (
        <ContactPage
          lang={lang}
          onNavigate={navigateTo}
        />
      );
    }

    // 11. Shop / Catalogue Page (/shop/ or /catalogue/)
    if (normalizedPath === '/shop' || normalizedPath === '/catalogue') {
      return (
        <ShopPage
          catalogProducts={catalogProducts}
          lang={lang}
          onNavigate={navigateTo}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToRfq={handleAddToRfq}
          isAddedToRfq={(id) => rfqBasket.some((item) => item.productId === id)}
          onToggleCompare={handleToggleCompare}
          isCompared={(id) => comparedProducts.some((p) => p.id === id)}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={(id) => wishlistProducts.some((p) => p.id === id)}
          onOpenRfq={() => setIsRfqOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategorySelect={setActiveCategory}
          selectedBrands={selectedBrands}
          onSelectedBrandsChange={setSelectedBrands}
          selectedCurrents={selectedCurrents}
          onSelectedCurrentsChange={setSelectedCurrents}
          selectedPoles={selectedPoles}
          onSelectedPolesChange={setSelectedPoles}
          inStockOnly={inStockOnly}
          onInStockOnlyChange={setInStockOnly}
          onResetFilters={handleResetFilters}
        />
      );
    }

    // 12. Individual Product Page (/product/:id/)
    if (normalizedPath.startsWith('/product/')) {
      const productIdStr = normalizedPath.replace('/product/', '');
      const prodId = parseInt(productIdStr, 10);
      const matchedProd = catalogProducts.find((p) => p.id === prodId || p.mpn.toLowerCase() === productIdStr.toLowerCase());

      if (matchedProd) {
        return (
          <ProductDetailPage
            product={matchedProd}
            lang={lang}
            onNavigate={navigateTo}
            onAddToRfq={handleAddToRfq}
            onQuickQuote={handleQuickQuote}
            isAddedToRfq={rfqBasket.some((item) => item.productId === matchedProd.id)}
            onSelectModel={(id) => {
              const target = catalogProducts.find((p) => p.id === id);
              if (target) {
                navigateTo(`/product/${target.id}/`);
              }
            }}
            isWishlisted={wishlistProducts.some((p) => p.id === matchedProd.id)}
            onToggleWishlist={handleToggleWishlist}
            isCompared={comparedProducts.some((p) => p.id === matchedProd.id)}
            onToggleCompare={handleToggleCompare}
          />
        );
      }
      return (
        <ShopPage
          catalogProducts={catalogProducts}
          lang={lang}
          onNavigate={navigateTo}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToRfq={handleAddToRfq}
          isAddedToRfq={(id) => rfqBasket.some((item) => item.productId === id)}
          onToggleCompare={handleToggleCompare}
          isCompared={(id) => comparedProducts.some((p) => p.id === id)}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={(id) => wishlistProducts.some((p) => p.id === id)}
          onOpenRfq={() => setIsRfqOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategorySelect={setActiveCategory}
          selectedBrands={selectedBrands}
          onSelectedBrandsChange={setSelectedBrands}
          selectedCurrents={selectedCurrents}
          onSelectedCurrentsChange={setSelectedCurrents}
          selectedPoles={selectedPoles}
          onSelectedPolesChange={setSelectedPoles}
          inStockOnly={inStockOnly}
          onInStockOnlyChange={setInStockOnly}
          onResetFilters={handleResetFilters}
        />
      );
    }

    // Default: Root Homepage (Preserved Main Website + Integrated Subsystems)
    return (
      <main className="space-y-16">
        <HomepageSections
          lang={lang}
          onExploreProducts={() => navigateTo('/shop/')}
          onRequestQuote={() => setIsRfqOpen(true)}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            navigateTo('/shop/');
          }}
          catalogProducts={catalogProducts}
          experts={experts}
          onProductClick={(p) => navigateTo(`/product/${p.id}/`)}
          onQuickQuote={(p) => {
            handleAddToRfq(p, 1);
            setIsRfqOpen(true);
          }}
          onAddToRfq={(p) => handleAddToRfq(p, 1)}
          isAddedToRfq={(id) => rfqBasket.some((item) => item.productId === id)}
          onToggleCompare={handleToggleCompare}
          isCompared={(id) => comparedProducts.some((p) => p.id === id)}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={(id) => wishlistProducts.some((p) => p.id === id)}
          onNavigate={navigateTo}
        />
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 antialiased selection:bg-amber-100">
      
      {/* 1. Public Header with Unclipped Submenus & Real Navigation Links */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategorySelect={(cat) => {
          setActiveCategory(cat);
          navigateTo('/shop/');
        }}
        rfqCount={totalRfqUnits}
        onOpenRfq={() => setIsRfqOpen(true)}
        compareCount={comparedProducts.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        wishlistCount={wishlistProducts.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAdminDesk={() => setIsAdminDeskOpen(true)}
        onNavigate={navigateTo}
        isLoggedIn={isStaffLoggedIn}
        userRole={isStaffLoggedIn ? 'admin' : 'visitor'}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'bn' : 'en')}
      />

      {/* 2. Page View Container */}
      <div className="flex-1">
        {renderCurrentView()}
      </div>

      {/* 3. Public Footer with Authentic Company Details & Links */}
      <PublicFooter
        lang={lang}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          navigateTo('/shop/');
        }}
        onNavigate={navigateTo}
      />

      {/* 4. Product Detail Modal (for quick overlays) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToRfq={handleAddToRfq}
        onQuickQuote={handleQuickQuote}
        isAddedToRfq={selectedProduct ? rfqBasket.some((i) => i.productId === selectedProduct.id) : false}
        onSelectModel={(id) => {
          const target = catalogProducts.find((p) => p.id === id);
          if (target) setSelectedProduct(target);
        }}
        isWishlisted={selectedProduct ? wishlistProducts.some((p) => p.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        isCompared={selectedProduct ? comparedProducts.some((p) => p.id === selectedProduct.id) : false}
        onToggleCompare={handleToggleCompare}
        lang={lang}
      />

      {/* 5. RFQ Basket Drawer */}
      <RfqDrawer
        isOpen={isRfqOpen}
        onClose={() => setIsRfqOpen(false)}
        items={rfqBasket}
        onUpdateQuantity={(id, qty) => {
          setRfqBasket((prev) => prev.map((item) => (item.productId === id ? { ...item, quantity: qty } : item)));
        }}
        onUpdateNote={(id, note) => {
          setRfqBasket((prev) => prev.map((item) => (item.productId === id ? { ...item, customerNote: note } : item)));
        }}
        onRemoveItem={(id) => {
          setRfqBasket((prev) => prev.filter((item) => item.productId !== id));
        }}
        onClearBasket={() => setRfqBasket([])}
        onSubmitRfq={handleCreateRfq}
        onOpenHistory={() => {
          setIsRfqOpen(false);
          setIsCustomerHistoryOpen(true);
        }}
        isLoggedIn={isStaffLoggedIn}
        onToggleLogin={() => setIsAccountOpen(true)}
      />

      {/* 6. Compare Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={comparedProducts}
        onRemoveFromCompare={(id) => setComparedProducts((prev) => prev.filter((p) => p.id !== id))}
        onClearCompare={() => setComparedProducts([])}
        onAddToRfq={handleAddToRfq}
      />

      {/* 7. Wishlist / Project BOM Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={wishlistProducts}
        onRemoveFromWishlist={(id) => setWishlistProducts((prev) => prev.filter((p) => p.id !== id))}
        onClearWishlist={() => setWishlistProducts([])}
        onMoveToRfq={handleAddToRfq}
        onMoveAllToRfq={() => {
          wishlistProducts.forEach((p) => handleAddToRfq(p));
          setIsWishlistOpen(false);
          setIsRfqOpen(true);
        }}
      />

      {/* 8. Customer RFQ History Lookup Modal */}
      <RfqHistoryModal
        isOpen={isCustomerHistoryOpen}
        onClose={() => setIsCustomerHistoryOpen(false)}
        rfqs={rfqs}
        isLoggedIn={isStaffLoggedIn}
        onOpenRfqDrawer={() => {
          setIsCustomerHistoryOpen(false);
          setIsRfqOpen(true);
        }}
      />

      {/* 9. Account Modal (Customer tracking + Staff login) */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        rfqs={rfqs}
        isLoggedIn={isStaffLoggedIn}
        userRole={isStaffLoggedIn ? 'admin' : 'visitor'}
        onLoginCustomer={() => {
          setIsCustomerHistoryOpen(true);
          setIsAccountOpen(false);
        }}
        onLoginAdmin={(passcode: string) => {
          if (passcode === 'dhruba2026' || passcode === 'admin') {
            setIsStaffLoggedIn(true);
            setIsAdminDeskOpen(true);
            setIsAccountOpen(false);
            return true;
          }
          return false;
        }}
        onLogout={() => {
          setIsStaffLoggedIn(false);
          setIsAdminDeskOpen(false);
          setIsAccountOpen(false);
        }}
        onOpenRfqHistory={() => {
          setIsCustomerHistoryOpen(true);
          setIsAccountOpen(false);
        }}
        onOpenWishlist={() => {
          setIsWishlistOpen(true);
          setIsAccountOpen(false);
        }}
        onOpenAdminPortal={() => {
          setIsAdminDeskOpen(true);
          setIsAccountOpen(false);
        }}
        lang={lang}
      />

      {/* 10. Gated Operations Desk (Conditionally rendered ONLY when staff is logged in) */}
      {isStaffLoggedIn && (
        <AdminDeskModal
          isOpen={isAdminDeskOpen}
          onClose={() => setIsAdminDeskOpen(false)}
          rfqs={rfqs}
          products={catalogProducts}
          experts={experts}
          onUpdateRfqStatus={handleUpdateRfqStatus}
          onConvertToWcOrder={handleConvertToWcOrder}
          onSaveProduct={(savedP) => {
            setCatalogProducts((prev) => {
              const idx = prev.findIndex((p) => p.id === savedP.id);
              if (idx >= 0) {
                 const next = [...prev];
                 next[idx] = savedP;
                 return next;
              }
              return [savedP, ...prev];
            });
          }}
          onDeleteProduct={(id) => {
            setCatalogProducts((prev) => prev.filter((p) => p.id !== id));
          }}
          onSaveExpert={handleSaveExpert}
          onDeleteExpert={handleDeleteExpert}
          onToggleExpertActive={handleToggleExpertActive}
        />
      )}
    </div>
  );
}
