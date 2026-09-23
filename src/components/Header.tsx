import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Phone, 
  MapPin, 
  Scale, 
  Zap, 
  Camera, 
  Sun, 
  Heart,
  MessageSquare,
  User,
  Menu,
  X,
  ChevronDown,
  Mail,
  Layers
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

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
  onOpenAccount: () => void;
  onOpenAdminDesk?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  isLoggedIn: boolean;
  userRole?: 'visitor' | 'customer' | 'admin';
  lang: Language;
  onToggleLang: () => void;
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
  onOpenAccount,
  onOpenAdminDesk,
  onNavigateSection,
  isLoggedIn,
  userRole = 'visitor',
  lang,
  onToggleLang
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleNav = (target: string) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(target);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Top Utility Bar (Navy: #0F172A) */}
      <div className="bg-[#0F172A] text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          {/* Location & Certification */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1 text-slate-200 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{t.location}</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden md:inline text-slate-400">
              {t.authSupply}
            </span>
          </div>

          {/* Contact Details & Utilities */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            {/* Real Hotline */}
            <a 
              href="tel:+8801711197767" 
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{t.hotline}: <strong className="text-white">+880 1711-197767</strong></span>
            </a>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Email */}
            <a 
              href="mailto:info@dhrubapower.com" 
              className="hidden lg:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span>info@dhrubapower.com</span>
            </a>

            <span className="text-slate-700 hidden lg:inline">|</span>

            {/* WhatsApp Link */}
            <a 
              href="https://wa.me/8801711197767" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden md:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageSquare className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>WhatsApp</span>
            </a>

            <span className="text-slate-700">|</span>

            {/* Language Switcher: EN | বাংলা */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer px-1 py-0.5 rounded transition-colors"
              title="Switch Language / ভাষা পরিবর্তন করুন"
              id="btn-lang-toggle"
            >
              <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Account / Customer Portal */}
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-1 text-slate-200 hover:text-white font-medium cursor-pointer transition-colors"
              id="btn-header-account"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">
                {isLoggedIn ? (userRole === 'admin' ? t.adminPortal : t.dealerPortal) : t.accountLogin}
              </span>
            </button>

            {isLoggedIn && userRole === 'admin' && onOpenAdminDesk && (
              <>
                <span className="text-slate-700">|</span>
                <button
                  onClick={onOpenAdminDesk}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors"
                  id="btn-header-admin-desk"
                >
                  Admin Desk
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          onClick={() => {
            onCategorySelect('all');
            handleNav('hero');
          }}
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
        >
          <div className="w-10 h-10 bg-[#0F172A] text-white rounded-lg flex items-center justify-center font-black text-xl tracking-tighter shadow-sm border border-slate-800">
            DP
          </div>
          <div>
            <div className="font-extrabold text-lg text-slate-900 leading-tight tracking-tight flex items-center gap-1.5">
              <span>DHRUBA POWER</span>
              <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">
                Engineering
              </span>
            </div>
            <div className="text-[11px] text-slate-500 tracking-wider uppercase font-semibold">
              {lang === 'bn' ? 'সুইচগিয়ার, সোলার ও সাবস্টেশন সাপ্লাই' : 'Switchgear, Solar & Substation Supply'}
            </div>
          </div>
        </div>

        {/* Global Industrial Search Bar */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-20 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#0F172A] rounded-lg text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-2xs"
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

        {/* Action Buttons: Compare, BOM/Wishlist, RFQ Basket, WhatsApp */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Wishlist / BOM */}
          <button
            onClick={onOpenWishlist}
            className={`px-2.5 py-2 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              wishlistCount > 0 
                ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            id="btn-open-wishlist"
            title="Saved Engineering BOM"
          >
            <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden lg:inline">{t.wishlistBom}</span>
            {wishlistCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Compare Button */}
          <button
            onClick={onOpenCompare}
            className={`px-2.5 py-2 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              compareCount > 0 
                ? 'bg-slate-100 border-slate-400 text-slate-900 hover:bg-slate-200' 
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            id="btn-open-compare"
            title="Technical Comparison Matrix"
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.compare}</span>
            {compareCount > 0 && (
              <span className="bg-[#0F172A] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {compareCount}
              </span>
            )}
          </button>

          {/* Primary CTA: RFQ Basket (Restrained Orange: #F59E0B / #D97706) */}
          <button
            onClick={onOpenRfq}
            className="px-3.5 py-2 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-98"
            id="btn-open-rfq"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="font-extrabold">{t.rfqBasket}</span>
            {rfqCount > 0 ? (
              <span className="bg-white text-[#B45309] text-[11px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                {rfqCount}
              </span>
            ) : (
              <span className="bg-amber-800/40 text-amber-100 text-[10px] px-1.5 py-0.2 rounded">
                {t.quotePrompt}
              </span>
            )}
          </button>

          {/* WhatsApp Direct (Restrained Green: #16A673) */}
          <a
            href="https://wa.me/8801711197767"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-[#16A673] hover:bg-[#0F8A60] text-white rounded-lg shadow-sm hidden sm:flex items-center justify-center transition-colors"
            title="WhatsApp Support (+8801711197767)"
          >
            <MessageSquare className="w-4 h-4" />
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 md:hidden cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. Public Navigation Links Bar (Navy & Slate Clean Styling) */}
      <nav className="bg-slate-50 border-t border-slate-200 text-xs font-semibold text-slate-700">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2 py-1 overflow-x-auto">
            {/* Home */}
            <button
              onClick={() => handleNav('hero')}
              className="px-2.5 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {t.home}
            </button>

            {/* Products with Subcategories */}
            <div className="relative">
              <button
                onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                onMouseEnter={() => setProductsDropdownOpen(true)}
                className={`px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  productsDropdownOpen ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-200 text-slate-800'
                }`}
              >
                <span>{t.products}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {productsDropdownOpen && (
                <div 
                  onMouseLeave={() => setProductsDropdownOpen(false)}
                  className="absolute left-0 top-full mt-0.5 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50 animate-in fade-in duration-100"
                >
                  <button
                    onClick={() => {
                      onCategorySelect('all');
                      setProductsDropdownOpen(false);
                      handleNav('catalogue');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t.allProducts}</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      onCategorySelect('eee');
                      setProductsDropdownOpen(false);
                      handleNav('catalogue');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.eee} (MCB, MCCB, ACB)</span>
                  </button>

                  <button
                    onClick={() => {
                      onCategorySelect('cctv');
                      setProductsDropdownOpen(false);
                      handleNav('catalogue');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t.cctv}</span>
                  </button>

                  <button
                    onClick={() => {
                      onCategorySelect('solar');
                      setProductsDropdownOpen(false);
                      handleNav('catalogue');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.solar}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Brands */}
            <button
              onClick={() => handleNav('brands')}
              className="px-2.5 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {t.brands}
            </button>

            {/* Applications */}
            <button
              onClick={() => handleNav('applications')}
              className="px-2.5 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {t.applications}
            </button>

            {/* Services */}
            <button
              onClick={() => handleNav('services')}
              className="px-2.5 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer font-bold text-slate-900"
            >
              {t.services}
            </button>

            {/* Projects */}
            <button
              onClick={() => handleNav('projects')}
              className="px-2.5 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {t.projects}
            </button>

            {/* Experts */}
            <button
              onClick={() => handleNav('experts')}
              className="px-2.5 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {t.experts}
            </button>

            {/* Blog */}
            <button
              onClick={() => handleNav('blog')}
              className="px-2.5 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {t.blog}
            </button>

            {/* Contact */}
            <button
              onClick={() => handleNav('contact')}
              className="px-2.5 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {t.contact}
            </button>
          </div>

          {/* Right badge: Genuine factory warranty */}
          <div className="hidden xl:flex items-center gap-1.5 text-slate-600 text-[11px] py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A673]"></span>
            <span>{lang === 'bn' ? '১০০% অরিজিনাল ফ্যাক্টরি ওয়্যারেন্টি' : '100% Genuine OEM Factory Warranties'}</span>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3 shadow-lg">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-800 pt-2">
            <button
              onClick={() => {
                onCategorySelect('all');
                handleNav('catalogue');
              }}
              className="p-2 rounded bg-slate-50 text-left hover:bg-slate-100"
            >
              {t.allProducts}
            </button>
            <button
              onClick={() => {
                onCategorySelect('eee');
                handleNav('catalogue');
              }}
              className="p-2 rounded bg-slate-50 text-left hover:bg-slate-100"
            >
              {t.eee}
            </button>
            <button
              onClick={() => {
                onCategorySelect('cctv');
                handleNav('catalogue');
              }}
              className="p-2 rounded bg-slate-50 text-left hover:bg-slate-100"
            >
              {t.cctv}
            </button>
            <button
              onClick={() => {
                onCategorySelect('solar');
                handleNav('catalogue');
              }}
              className="p-2 rounded bg-slate-50 text-left hover:bg-slate-100"
            >
              {t.solar}
            </button>
            <button
              onClick={() => handleNav('services')}
              className="p-2 rounded bg-slate-50 text-left hover:bg-slate-100 font-bold"
            >
              {t.services}
            </button>
            <button
              onClick={() => handleNav('projects')}
              className="p-2 rounded bg-slate-50 text-left hover:bg-slate-100"
            >
              {t.projects}
            </button>
            <button
              onClick={() => handleNav('experts')}
              className="p-2 rounded bg-slate-50 text-left hover:bg-slate-100"
            >
              {t.experts}
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="p-2 rounded bg-slate-50 text-left hover:bg-slate-100"
            >
              {t.contact}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <a
              href="tel:+8801711197767"
              className="font-bold text-slate-800 flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              +880 1711-197767
            </a>
            <button
              onClick={onToggleLang}
              className="font-bold text-[#D97706] bg-amber-50 px-2 py-1 rounded border border-amber-200"
            >
              {lang === 'en' ? 'বাংলা সংস্করণ' : 'English Version'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
