import React, { useMemo, useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Search, 
  ArrowRight, 
  Building2, 
  Wrench, 
  Sun, 
  Camera, 
  Layers,
  ChevronRight,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { ProductItem } from '../types/catalog';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  catalogProducts: ProductItem[];
  lang: Language;
  onNavigate: (path: string) => void;
  onSelectProduct: (product: ProductItem) => void;
  onAddToRfq: (product: ProductItem, qty?: number) => void;
  isAddedToRfq: (id: number) => boolean;
  onToggleCompare: (product: ProductItem) => void;
  isCompared: (id: number) => boolean;
  onToggleWishlist: (product: ProductItem) => void;
  isWishlisted: (id: number) => boolean;
  onOpenRfq: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: string;
  onCategorySelect: (cat: string) => void;
  selectedBrands: string[];
  onSelectedBrandsChange: (brands: string[]) => void;
  selectedCurrents: string[];
  onSelectedCurrentsChange: (currents: string[]) => void;
  selectedPoles: string[];
  onSelectedPolesChange: (poles: string[]) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (inStock: boolean) => void;
  onResetFilters: () => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  catalogProducts,
  lang,
  onNavigate,
  onSelectProduct,
  onAddToRfq,
  isAddedToRfq,
  onToggleCompare,
  isCompared,
  onToggleWishlist,
  isWishlisted,
  onOpenRfq,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategorySelect,
  selectedBrands,
  onSelectedBrandsChange,
  selectedCurrents,
  onSelectedCurrentsChange,
  selectedPoles,
  onSelectedPolesChange,
  inStockOnly,
  onInStockOnlyChange,
  onResetFilters
}) => {
  const t = TRANSLATIONS[lang];

  // Derived filters
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

  // Filter calculation
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

  // Pagination Support (Crawlable & Scalable)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [activeCategory, selectedBrands, selectedCurrents, selectedPoles, inStockOnly, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, activePage]);

  const goToPage = (p: number) => {
    const target = Math.max(1, Math.min(p, totalPages));
    setCurrentPage(target);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button 
            onClick={() => onNavigate('/')} 
            className="hover:text-slate-900 transition-colors"
          >
            {t.home}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-[#0F172A]">
            {lang === 'bn' ? 'শপ / প্রডাক্ট ক্যাটালগ' : 'Industrial Equipment Shop & Catalog'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading & Category Tabs */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
          <div>
            <div className="text-xs font-bold text-[#D97706] uppercase tracking-wider mb-1">
              {lang === 'bn' ? 'সরাসরি সরবরাহ ও ওরিজিনাল পার্টস' : 'Commercial Equipment Supply'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {lang === 'bn' ? 'ইন্ডাস্ট্রিয়াল প্রডাক্ট ক্যাটালগ' : 'Engineering Equipment Catalogue & Shop'}
            </h1>
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
                    onCategorySelect(tab.id);
                    onSelectedCurrentsChange([]);
                    onSelectedPolesChange([]);
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mb-16">
          
          {/* Filter Sidebar */}
          <aside className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
                <span>{t.technicalFilters}</span>
              </span>

              {(selectedBrands.length > 0 || selectedCurrents.length > 0 || selectedPoles.length > 0 || inStockOnly || searchQuery) && (
                <button
                  onClick={onResetFilters}
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
                  onChange={(e) => onInStockOnlyChange(e.target.checked)}
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
                        if (e.target.checked) onSelectedBrandsChange([...selectedBrands, brand]);
                        else onSelectedBrandsChange(selectedBrands.filter((b) => b !== brand));
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
                          if (e.target.checked) onSelectedCurrentsChange([...selectedCurrents, cur]);
                          else onSelectedCurrentsChange(selectedCurrents.filter((c) => c !== cur));
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
                          if (isSel) onSelectedPolesChange(selectedPoles.filter((p) => p !== pole));
                          else onSelectedPolesChange([...selectedPoles, pole]);
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
                onClick={onOpenRfq}
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
                    onClick={onResetFilters}
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginatedProducts.map((product) => {
                    const isAdded = isAddedToRfq(product.id);
                    const isComp = isCompared(product.id);
                    const isWish = isWishlisted(product.id);

                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={(p) => {
                          onSelectProduct(p);
                          onNavigate(`/product/${p.id}/`);
                        }}
                        onAddToRfq={onAddToRfq}
                        isAddedToRfq={isAdded}
                        isCompared={isComp}
                        onToggleCompare={onToggleCompare}
                        isWishlisted={isWish}
                        onToggleWishlist={onToggleWishlist}
                        lang={lang}
                        onCategoryClick={(cat) => onCategorySelect(cat)}
                      />
                    );
                  })}
                </div>

                {/* Pagination Controls with crawlable anchors */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Showing <span className="font-bold text-slate-800">{(activePage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-bold text-slate-800">{Math.min(activePage * ITEMS_PER_PAGE, filteredProducts.length)}</span> of <span className="font-bold text-slate-800">{filteredProducts.length}</span> products
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => goToPage(activePage - 1)}
                        disabled={activePage <= 1}
                        className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                          activePage <= 1 
                            ? 'border-slate-200 text-slate-300 cursor-not-allowed' 
                            : 'border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer'
                        }`}
                        title="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Prev</span>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                        <a
                          key={pNum}
                          href={`/shop/?page=${pNum}`}
                          onClick={(e) => {
                            e.preventDefault();
                            goToPage(pNum);
                          }}
                          className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                            pNum === activePage
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {pNum}
                        </a>
                      ))}

                      <button
                        onClick={() => goToPage(activePage + 1)}
                        disabled={activePage >= totalPages}
                        className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                          activePage >= totalPages 
                            ? 'border-slate-200 text-slate-300 cursor-not-allowed' 
                            : 'border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer'
                        }`}
                        title="Next page"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
