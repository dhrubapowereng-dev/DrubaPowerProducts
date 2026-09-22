import React, { useState, useMemo } from 'react';
import { INDUSTRIAL_PRODUCTS } from './data/mockProducts';
import { ProductItem, RfqItem } from './types/catalog';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { RfqDrawer } from './components/RfqDrawer';
import { CompareModal } from './components/CompareModal';
import { WishlistModal } from './components/WishlistModal';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';
import { 
  Filter, 
  RotateCcw, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  SlidersHorizontal,
  Search
} from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCurrents, setSelectedCurrents] = useState<string[]>([]);
  const [selectedPoles, setSelectedPoles] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [rfqBasket, setRfqBasket] = useState<RfqItem[]>([]);
  const [comparedProducts, setComparedProducts] = useState<ProductItem[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<ProductItem[]>([]);
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);

  // Unique Filter Options derived from catalog
  const availableBrands = useMemo(() => {
    return Array.from(new Set(INDUSTRIAL_PRODUCTS.map((p) => p.brand)));
  }, []);

  const availableCurrents = useMemo(() => {
    const currents = new Set<string>();
    INDUSTRIAL_PRODUCTS.forEach((p) => {
      const spec = p.specifications.find((s) => s.key === 'rated_current');
      if (spec && spec.value) currents.add(spec.value);
    });
    return Array.from(currents).sort();
  }, []);

  const availablePoles = useMemo(() => {
    const poles = new Set<string>();
    INDUSTRIAL_PRODUCTS.forEach((p) => {
      const spec = p.specifications.find((s) => s.key === 'poles');
      if (spec && spec.normalized) poles.add(spec.normalized);
    });
    return Array.from(poles).sort();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return INDUSTRIAL_PRODUCTS.filter((p) => {
      // Category Filter
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }

      // Brand Filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }

      // Rated Current Filter
      if (selectedCurrents.length > 0) {
        const spec = p.specifications.find((s) => s.key === 'rated_current');
        if (!spec || !selectedCurrents.includes(spec.value)) {
          return false;
        }
      }

      // Poles Filter
      if (selectedPoles.length > 0) {
        const spec = p.specifications.find((s) => s.key === 'poles');
        if (!spec || !selectedPoles.includes(spec.normalized || '')) {
          return false;
        }
      }

      // Ready Stock
      if (inStockOnly && !p.inStock) {
        return false;
      }

      // Search Query (MPN, SKU, Name, Brand, Series, Specs)
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
  }, [activeCategory, selectedBrands, selectedCurrents, selectedPoles, inStockOnly, searchQuery]);

  // Handlers for RFQ
  const handleAddToRfq = (product: ProductItem) => {
    setRfqBasket((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId: product.id, product, quantity: 1, customerNote: '' }];
    });
  };

  const handleUpdateRfqQuantity = (productId: number, qty: number) => {
    setRfqBasket((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleUpdateRfqNote = (productId: number, note: string) => {
    setRfqBasket((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, customerNote: note } : item))
    );
  };

  const handleRemoveRfqItem = (productId: number) => {
    setRfqBasket((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Handlers for Compare
  const handleToggleCompare = (product: ProductItem) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 industrial items simultaneously.');
        return prev;
      }
      return [...prev, product];
    });
  };

  // Handlers for Wishlist / Project BOM
  const handleToggleWishlist = (product: ProductItem) => {
    setWishlistProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleMoveWishlistToRfq = (product: ProductItem) => {
    handleAddToRfq(product);
  };

  const handleMoveAllWishlistToRfq = () => {
    wishlistProducts.forEach((p) => handleAddToRfq(p));
    setIsWishlistOpen(false);
    setIsRfqOpen(true);
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-amber-200">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategorySelect={(cat) => {
          setActiveCategory(cat);
          setSelectedCurrents([]);
          setSelectedPoles([]);
        }}
        rfqCount={totalRfqUnits}
        onOpenRfq={() => setIsRfqOpen(true)}
        compareCount={comparedProducts.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        wishlistCount={wishlistProducts.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSystemArchitecture={() => setIsArchOpen(true)}
      />

      {/* Main Body: Sidebar Filters + Products Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Breadcrumb & Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">
              Catalogue &gt; {activeCategory === 'all' ? 'All Divisions' : activeCategory.toUpperCase()}
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Industrial Products & Technical Ratings</span>
              <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                {filteredProducts.length} models
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsArchOpen(true)}
              className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-md shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <span>Inspect WordPress Core & Themes</span>
            </button>
          </div>
        </div>

        {/* 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Left Column: Filter Sidebar */}
          <aside className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
                <span>Technical Filters</span>
              </span>

              {(selectedBrands.length > 0 || selectedCurrents.length > 0 || selectedPoles.length > 0 || inStockOnly || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Ready Stock Toggle */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-md p-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <span className="text-xs font-bold text-emerald-900">
                  Ready Stock Only (Barishal)
                </span>
              </label>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Manufacturer / Brand
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {availableBrands.map((brand) => (
                  <label 
                    key={brand}
                    className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands([...selectedBrands, brand]);
                        } else {
                          setSelectedBrands(selectedBrands.filter((b) => b !== brand));
                        }
                      }}
                      className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-sky-500 accent-slate-900"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Electrical Rated Current (for EEE / MCB / MCCB) */}
            {(activeCategory === 'all' || activeCategory === 'eee') && (
              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Rated Current (Amperes)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableCurrents.map((curr) => {
                    const isSelected = selectedCurrents.includes(curr);
                    return (
                      <button
                        key={curr}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedCurrents(selectedCurrents.filter((c) => c !== curr));
                          } else {
                            setSelectedCurrents([...selectedCurrents, curr]);
                          }
                        }}
                        className={`text-[11px] font-mono font-bold px-2 py-1 rounded border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {curr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Poles Filter */}
            {(activeCategory === 'all' || activeCategory === 'eee') && (
              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Number of Poles
                </label>
                <div className="flex gap-1.5">
                  {availablePoles.map((pole) => {
                    const isSelected = selectedPoles.includes(pole);
                    return (
                      <button
                        key={pole}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedPoles(selectedPoles.filter((p) => p !== pole));
                          } else {
                            setSelectedPoles([...selectedPoles, pole]);
                          }
                        }}
                        className={`flex-1 text-[11px] font-bold py-1 rounded border text-center transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pole}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* Right Column: Product Cards Stream */}
          <div className="lg:col-span-3 space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-10 text-center space-y-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {searchQuery ? `No exact catalog match for "${searchQuery}"` : 'No matching industrial products found'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                    Dhruba Power maintains direct distribution links with ABB, Schneider, Siemens, Chint, and Hikvision. Even if a specific part number is unlisted, our Barishal sales desk can provide direct manufacturer quotation.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-md shadow-2xs transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>

                  <a
                    href={`https://wa.me/8801700000000?text=${encodeURIComponent(`Hello Dhruba Power Sales Desk, I am searching for industrial equipment / MPN: "${searchQuery || 'custom specifications'}" for quotation.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Request WhatsApp Sourcing</span>
                    <span className="text-[10px] bg-emerald-700/60 px-1 py-0.2 rounded font-mono">0-Result Tracked</span>
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
                    />
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Industrial Commercial Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t-4 border-amber-600 mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1 */}
            <div>
              <div className="text-white font-extrabold text-base tracking-tight mb-2">
                DHRUBA POWER
              </div>
              <p className="text-slate-400 leading-relaxed mb-4 text-[11px]">
                Authorized engineering distributor supplying low and medium voltage industrial switchgear, CCTV surveillance equipment, and solar grid-tie inverters across Bangladesh.
              </p>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Barishal Division, Bangladesh</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>+880 1700-000000</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>dhrubapowereng@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Authorized Brands
              </div>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li>ABB Low Voltage & Switchgear</li>
                <li>Schneider Electric (Acti9 / Compact NSX)</li>
                <li>Siemens SENTRON Circuit Breakers</li>
                <li>Hikvision Network Surveillance</li>
                <li>Growatt Solar Inverters</li>
                <li>LONGi Tier-1 Solar PV Modules</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Engineering Divisions
              </div>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li>Miniature Circuit Breakers (MCB 1P, 2P, 3P, 4P)</li>
                <li>Moulded Case Circuit Breakers (MCCB 16A-1600A)</li>
                <li>Industrial AcuSense IP Cameras & NVRs</li>
                <li>Hybrid & On-Grid Solar Inverters (3kW - 100kW)</li>
                <li>Bill of Quantities (BOQ) Upload & Tenders</li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Platform Architecture
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
                Built on high-performance custom WordPress schemas, Meilisearch indexing, and Python ETL pipelines for 50,000+ industrial SKUs.
              </p>
              <button
                onClick={() => setIsArchOpen(true)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded text-xs font-bold transition-colors cursor-pointer"
              >
                Download WordPress ZIPs
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-wrap justify-between items-center gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} Dhruba Power. All rights reserved. Engineering datasheets subject to manufacturer revisions.
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Tested & Verified for High-Volume Production Deployment</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToRfq={handleAddToRfq}
        isAddedToRfq={selectedProduct ? rfqBasket.some((i) => i.productId === selectedProduct.id) : false}
        onSelectModel={(id) => {
          const target = INDUSTRIAL_PRODUCTS.find((p) => p.id === id);
          if (target) setSelectedProduct(target);
        }}
        isWishlisted={selectedProduct ? wishlistProducts.some((p) => p.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        isCompared={selectedProduct ? comparedProducts.some((p) => p.id === selectedProduct.id) : false}
        onToggleCompare={handleToggleCompare}
      />

      {/* RFQ Drawer */}
      <RfqDrawer
        isOpen={isRfqOpen}
        onClose={() => setIsRfqOpen(false)}
        items={rfqBasket}
        onUpdateQuantity={handleUpdateRfqQuantity}
        onUpdateNote={handleUpdateRfqNote}
        onRemoveItem={handleRemoveRfqItem}
        onClearBasket={() => setRfqBasket([])}
      />

      {/* Compare Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={comparedProducts}
        onRemoveFromCompare={(id) => setComparedProducts((prev) => prev.filter((p) => p.id !== id))}
        onClearCompare={() => setComparedProducts([])}
        onAddToRfq={handleAddToRfq}
      />

      {/* Wishlist / Project BOM Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={wishlistProducts}
        onRemoveFromWishlist={(id) => setWishlistProducts((prev) => prev.filter((p) => p.id !== id))}
        onClearWishlist={() => setWishlistProducts([])}
        onMoveToRfq={handleMoveWishlistToRfq}
        onMoveAllToRfq={handleMoveAllWishlistToRfq}
      />

      {/* System Architecture & ZIP Explorer Modal */}
      <SystemArchitectureModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />
    </div>
  );
}
