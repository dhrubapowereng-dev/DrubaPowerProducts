import React from 'react';
import { 
  Search, 
  FileText, 
  Phone, 
  MapPin, 
  Scale, 
  Layers, 
  DownloadCloud, 
  Zap, 
  Camera, 
  Sun,
  ShieldCheck,
  Heart
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: string;
  onCategorySelect: (cat: string) => void;
  rfqCount: number;
  onOpenRfq: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenSystemArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategorySelect,
  rfqCount,
  onOpenRfq,
  compareCount,
  onOpenCompare,
  wishlistCount,
  onOpenWishlist,
  onOpenSystemArchitecture
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Regional Trust Bar */}
      <div className="bg-slate-900 text-slate-400 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> Barishal Division, Bangladesh
            </span>
            <span className="text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-300">
              Authorized Engineering & Switchgear Supply Desk
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="tel:+8801700000000" 
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-500" />
              <span>Hotline: <strong>+880 1700-000000</strong></span>
            </a>
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenSystemArchitecture}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer transition-colors"
              id="btn-arch-inspect"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Installable WordPress ZIPs & Architecture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar: Brand, Search, Commercial CTAs */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          onClick={() => onCategorySelect('all')}
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
        >
          <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xl tracking-tighter shadow-sm border border-slate-800">
            DP
          </div>
          <div>
            <div className="font-extrabold text-lg text-slate-900 leading-tight tracking-tight flex items-center gap-1.5">
              DHRUBA POWER
              <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                Industrial
              </span>
            </div>
            <div className="text-[11px] text-slate-500 tracking-wider uppercase font-semibold">
              Engineering Catalogue & RFQ Portal
            </div>
          </div>
        </div>

        {/* Global Industrial Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 20,000+ items by MPN, model, or specs (e.g. ABB SH201-C20, 100A MCCB, 5kW Inverter)..."
              className="w-full pl-10 pr-24 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-slate-900 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-2xs"
              id="header-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons: Wishlist/BOM, Compare, RFQ Basket */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenWishlist}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              wishlistCount > 0 
                ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            id="btn-open-wishlist"
            title="Project BOM & Saved Items"
          >
            <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden md:inline">BOM</span>
            {wishlistCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenCompare}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              compareCount > 0 
                ? 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            id="btn-open-compare"
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Compare</span>
            {compareCount > 0 && (
              <span className="bg-sky-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenRfq}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-98"
            id="btn-open-rfq"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>RFQ Basket</span>
            {rfqCount > 0 ? (
              <span className="bg-white text-amber-700 text-[11px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                {rfqCount}
              </span>
            ) : (
              <span className="bg-amber-700/60 text-amber-100 text-[10px] px-1.5 py-0.2 rounded">
                Quote
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Product Divisions Bar */}
      <nav className="bg-slate-50 border-t border-slate-200 text-xs font-semibold text-slate-700">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto">
          <div className="flex gap-1 py-1.5">
            <button
              onClick={() => onCategorySelect('all')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'hover:bg-slate-200/70 text-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Engineering Products</span>
            </button>

            <button
              onClick={() => onCategorySelect('eee')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'eee'
                  ? 'bg-sky-700 text-white font-bold'
                  : 'hover:bg-slate-200/70 text-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Electrical Switchgear (EEE)</span>
            </button>

            <button
              onClick={() => onCategorySelect('cctv')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'cctv'
                  ? 'bg-indigo-700 text-white font-bold'
                  : 'hover:bg-slate-200/70 text-slate-700'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-indigo-300" />
              <span>CCTV & Surveillance</span>
            </button>

            <button
              onClick={() => onCategorySelect('solar')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'solar'
                  ? 'bg-amber-700 text-white font-bold'
                  : 'hover:bg-slate-200/70 text-slate-700'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>Solar Energy & Inverters</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-slate-500 py-1 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Genuine Factory Warranties
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
};
