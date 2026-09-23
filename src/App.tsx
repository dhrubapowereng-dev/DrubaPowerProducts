import React, { useState, useMemo, useEffect } from 'react';
import { INDUSTRIAL_PRODUCTS } from './data/mockProducts';
import { ProductItem, RfqItem, RfqRecord, RfqStatus } from './types/catalog';
import { INITIAL_RFQS } from './data/mockRfqs';
import { Language, TRANSLATIONS } from './data/translations';
import { Header } from './components/Header';
import { HomepageSections } from './components/HomepageSections';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { RfqDrawer } from './components/RfqDrawer';
import { AccountModal } from './components/AccountModal';
import { AdminDeskModal } from './components/AdminDeskModal';
import { CompareModal } from './components/CompareModal';
import { WishlistModal } from './components/WishlistModal';
import { RfqHistoryModal } from './components/RfqHistoryModal';
import { PublicFooter } from './components/PublicFooter';
import { 
  RotateCcw, 
  SlidersHorizontal,
  Search,
  ArrowRight,
  Building2,
  Wrench,
  Sun,
  Camera,
  Layers
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = TRANSLATIONS[lang];

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

  // Authentication State: Gated for Admin / Staff only
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false);
  const [isAdminDeskOpen, setIsAdminDeskOpen] = useState(false);

  // Products State (supports in-memory CRUD for staff testing)
  const [catalogProducts, setCatalogProducts] = useState<ProductItem[]>(INDUSTRIAL_PRODUCTS);

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

  // Derived Filter Options
  const availableBrands = useMemo(() => {
    return Array.from(new Set(catalogProducts.map((p) => p.brand))).sort();
  }, [catalogProducts]);

  const availableCurrents = useMemo(() => {
    const currents = new Set<string>();
    catalogProducts.forEach((p) => {
      const spec = p.specifications.find((s) => s.key === 'rated_current');
      if (spec && spec.value) currents.add(spec.value);
    });
    return Array.from(currents).sort((a, b) => {
      const numA = parseInt(a, 10) || 0;
      const numB = parseInt(b, 10) || 0;
      return numA - numB;
    });
  }, [catalogProducts]);

  const availablePoles = useMemo(() => {
    const poles = new Set<string>();
    catalogProducts.forEach((p) => {
      const spec = p.specifications.find((s) => s.key === 'poles');
      if (spec && spec.normalized) poles.add(spec.normalized);
    });
    return Array.from(poles).sort();
  }, [catalogProducts]);

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    return catalogProducts.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      if (selectedCurrents.length > 0) {
        const spec = p.specifications.find((s) => s.key === 'rated_current');
        if (!spec || !selectedCurrents.includes(spec.value)) {
          return false;
        }
      }
      if (selectedPoles.length > 0) {
        const spec = p.specifications.find((s) => s.key === 'poles');
        if (!spec || !selectedPoles.includes(spec.normalized || '')) {
          return false;
        }
      }
      if (inStockOnly && !p.inStock) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesMpn = p.mpn.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesSeries = p.series.toLowerCase().includes(q);
        const matchesSpecs = p.specifications.some(
          (s) => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
        );

        if (!matchesName && !matchesMpn && !matchesSku && !matchesBrand && !matchesSeries && !matchesSpecs) {
          return false;
        }
      }
      return true;
    });
  }, [catalogProducts, activeCategory, selectedBrands, selectedCurrents, selectedPoles, inStockOnly, searchQuery]);

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

  // Navigation scroll helper
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalRfqUnits = rfqBasket.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 antialiased selection:bg-amber-100">
      
      {/* 1. Public Header (2-Level Navigation, Zero Admin Badges) */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategorySelect={(cat) => {
          setActiveCategory(cat);
          handleNavigateSection('catalogue');
        }}
        rfqCount={totalRfqUnits}
        onOpenRfq={() => setIsRfqOpen(true)}
        compareCount={comparedProducts.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        wishlistCount={wishlistProducts.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAdminDesk={() => setIsAdminDeskOpen(true)}
        onNavigateSection={handleNavigateSection}
        isLoggedIn={isStaffLoggedIn}
        userRole={isStaffLoggedIn ? 'admin' : 'visitor'}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'bn' : 'en')}
      />

      {/* 2. Authentic Homepage Sections (Hero, About, 6 Core Services, Work Process, Experts, Projects, Testimonials, Contact) */}
      <HomepageSections
        lang={lang}
        onExploreProducts={() => handleNavigateSection('catalogue')}
        onRequestQuote={() => setIsRfqOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleNavigateSection('catalogue');
        }}
      />

      {/* 3. Public Industrial Product Catalog Showcase */}
      <section id="catalogue" className="py-12 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Section Heading & Category Tabs */}
          <div className="flex flex-wrap items-end justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold text-[#D97706] uppercase tracking-wider mb-1">
                {lang === 'bn' ? 'সরাসরি সরবরাহ ও ওরিজিনাল পার্টস' : 'Commercial Equipment Supply'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {lang === 'bn' ? 'ইন্ডাস্ট্রিয়াল প্রডাক্ট ক্যাটালগ' : 'Engineering Equipment Catalogue'}
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                {lang === 'bn'
                  ? 'ABB, Schneider, Siemens, Hikvision ও Growatt-এর আসল সুইচগিয়ার, সিসিটিভি ও সোলার উপাদান সরাসরি বরিশাল ওয়ারহাউজ থেকে।'
                  : 'Independent manufacturer part numbers with verified technical ratings, CAD datasheets, and Barishal warehouse availability.'}
              </p>
            </div>

            {/* Division Switcher */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: t.allProducts, icon: Layers },
                { id: 'eee', label: t.eee, icon: Wrench },
                { id: 'cctv', label: t.cctv, icon: Camera },
                { id: 'solar', label: t.solar, icon: Sun }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveCategory(tab.id);
                      setSelectedCurrents([]);
                      setSelectedPoles([]);
                    }}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#0F172A] text-white shadow-xs' 
                        : 'bg-white hover:bg-slate-200/80 text-slate-700 border border-slate-300'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D97706]' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2-Column Grid: Left Filters + Right Products */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Filter Sidebar */}
            <aside className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t.technicalFilters}</span>
                </span>

                {(selectedBrands.length > 0 || selectedCurrents.length > 0 || selectedPoles.length > 0 || inStockOnly || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.resetFilters}</span>
                  </button>
                )}
              </div>

              {/* Ready Stock Toggle */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#16A673] focus:ring-[#16A673] accent-[#16A673]"
                  />
                  <span className="text-xs font-bold text-emerald-950">
                    {t.readyStockOnly}
                  </span>
                </label>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  {t.brands}
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedBrands([...selectedBrands, brand]);
                          else setSelectedBrands(selectedBrands.filter((b) => b !== brand));
                        }}
                        className="rounded text-[#0F172A] accent-[#0F172A]"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rated Current Filter (EEE Category) */}
              {activeCategory === 'eee' && availableCurrents.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                    {t.ratedCurrent}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                    {availableCurrents.map((cur) => (
                      <label key={cur} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCurrents.includes(cur)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedCurrents([...selectedCurrents, cur]);
                            else setSelectedCurrents(selectedCurrents.filter((c) => c !== cur));
                          }}
                          className="rounded text-[#0F172A] accent-[#0F172A]"
                        />
                        <span className="font-mono text-[11px]">{cur}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Poles Filter */}
              {activeCategory === 'eee' && availablePoles.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                    {t.poles}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availablePoles.map((pole) => {
                      const isSel = selectedPoles.includes(pole);
                      return (
                        <button
                          key={pole}
                          type="button"
                          onClick={() => {
                            if (isSel) setSelectedPoles(selectedPoles.filter((p) => p !== pole));
                            else setSelectedPoles([...selectedPoles, pole]);
                          }}
                          className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                            isSel
                              ? 'bg-[#0F172A] text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {pole}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Assistance Callout */}
              <div className="pt-4 border-t border-slate-200/80 text-xs text-slate-500 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{lang === 'bn' ? 'প্রজেক্ট টেন্ডার শিডিউল?' : 'Have a Project Schedule?'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {lang === 'bn'
                    ? 'আপনার প্রজেক্টের BOQ এক্সেল বা স্পেসিফিকেশন শিডিউল আপলোড করতে RFQ বাস্কেটে যান।'
                    : 'Submit your complete tender BOQ or AutoCAD drawing via RFQ basket for direct pricing.'}
                </p>
                <button
                  onClick={() => setIsRfqOpen(true)}
                  className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'BOQ আপলোড করুন' : 'Upload BOQ Schedule'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-slate-700">
                  {filteredProducts.length} {t.modelsFound}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Barishal Division Commercial Desk
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {searchQuery ? `No exact catalog match for "${searchQuery}"` : t.noProductsFound}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                      Dhruba Power maintains authorized distribution links with ABB, Schneider, Siemens, and Hikvision. Even unlisted exact MPNs can be sourced directly.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      {t.resetFilters}
                    </button>
                    <a
                      href={`https://wa.me/8801711197767?text=${encodeURIComponent(`Hello Dhruba Power Sales Desk, I am sourcing industrial equipment: "${searchQuery || 'custom specifications'}" for quotation.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#16A673] hover:bg-[#0F8A60] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Direct WhatsApp Sourcing</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => {
                    const isAdded = rfqBasket.some((i) => i.productId === product.id);
                    const isCompared = comparedProducts.some((p) => p.id === product.id);
                    const isWishlisted = wishlistProducts.some((p) => p.id === product.id);

                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={(p) => setSelectedProduct(p)}
                        onAddToRfq={handleAddToRfq}
                        isAddedToRfq={isAdded}
                        isCompared={isCompared}
                        onToggleCompare={handleToggleCompare}
                        isWishlisted={isWishlisted}
                        onToggleWishlist={handleToggleWishlist}
                        lang={lang}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Public Footer (Authentic Company Details, Zero Admin Links) */}
      <PublicFooter
        lang={lang}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleNavigateSection('catalogue');
        }}
        onNavigateSection={handleNavigateSection}
      />

      {/* 5. Product Detail Modal */}
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

      {/* 6. RFQ Basket Drawer */}
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

      {/* 7. Compare Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={comparedProducts}
        onRemoveFromCompare={(id) => setComparedProducts((prev) => prev.filter((p) => p.id !== id))}
        onClearCompare={() => setComparedProducts([])}
        onAddToRfq={handleAddToRfq}
      />

      {/* 8. Wishlist / Project BOM Modal */}
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

      {/* 9. Customer RFQ History Lookup Modal */}
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

      {/* 10. Account Modal (Customer tracking + Staff login) */}
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

      {/* 11. Gated Operations Desk (Conditionally rendered ONLY when staff is logged in) */}
      {isStaffLoggedIn && (
        <AdminDeskModal
          isOpen={isAdminDeskOpen}
          onClose={() => setIsAdminDeskOpen(false)}
          rfqs={rfqs}
          products={catalogProducts}
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
        />
      )}
    </div>
  );
}
