import React, { useState, useRef, useEffect } from 'react';
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
  Layers,
  Activity,
  Wrench,
  Shield,
  Cpu
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
  onNavigate: (path: string) => void;
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
  onNavigate,
  isLoggedIn,
  userRole = 'visitor',
  lang,
  onToggleLang
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = TRANSLATIONS[lang];

  const handleNav = (targetPath: string) => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setShopDropdownOpen(false);
    setMobileServicesOpen(false);
    setMobileShopOpen(false);
    if (onNavigate) {
      onNavigate(targetPath);
    }
  };

  const handleServiceMouseEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setServicesDropdownOpen(true);
  };

  const handleServiceMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 180);
  };

  const handleShopMouseEnter = () => {
    if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
    setShopDropdownOpen(true);
  };

  const handleShopMouseLeave = () => {
    shopTimeoutRef.current = setTimeout(() => {
      setShopDropdownOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
      if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs overflow-visible">
      {/* 1. Top Utility Bar (Navy: #0F172A) */}
      <div className="bg-[#0F172A] text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          {/* Headline & Location */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-slate-200 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
              <span>{lang === 'bn' ? 'বরিশাল, বাংলাদেশ — ইলেকট্রিক্যাল, সোলার ও সাবস্টেশন সাপোর্ট' : 'Electrical, solar, substation & industrial service support in Barishal'}</span>
            </span>
          </div>

          {/* Contact Details & Actions */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            {/* Phone */}
            <a 
              href="tel:+8801711197767" 
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#F59E0B] shrink-0" />
              <span>+880 1711-197767</span>
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

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Direct WhatsApp Quote */}
            <a 
              href="https://wa.me/8801711197767?text=Hello%20Dhruba%20Power%2C%20I%20want%20a%20quote." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden sm:flex items-center gap-1 text-[#16A673] hover:text-emerald-300 transition-colors font-semibold"
            >
              <MessageSquare className="w-3 h-3 text-[#16A673] shrink-0" />
              <span>WhatsApp Quote</span>
            </a>

            <span className="text-slate-700">|</span>

            {/* Language Switcher: EN | বাংলা */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 text-xs font-bold text-[#F59E0B] hover:text-amber-300 cursor-pointer px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 transition-colors"
              title="Switch Language / ভাষা পরিবর্তন করুন"
              id="btn-lang-toggle"
            >
              <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Account / Portal Login */}
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

            {/* Protected Admin Desk: Gated for Authenticated Staff Only */}
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

      {/* 2. Main Header Bar (Logo, Global Search, CTAs) */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo - Official Dhruba Power Logo Asset */}
        <a 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onCategorySelect('all');
            handleNav('/');
          }}
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
        >
          <img 
            src="/dhrubapowerlogo.png" 
            alt="Dhruba Power &amp; Engineering" 
            className="h-10 sm:h-12 w-auto max-w-[200px] sm:max-w-[250px] object-contain"
            referrerPolicy="no-referrer"
          />
        </a>

        {/* Global Technical Search Bar */}
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

        {/* Commercial Actions: Compare, BOM/Wishlist, RFQ Basket, WhatsApp */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Saved BOM / Wishlist */}
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

          {/* Technical Comparison Matrix */}
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

          {/* RFQ Basket: Primary Commercial CTA (Restrained Orange) */}
          <button
            onClick={onOpenRfq}
            className="px-3.5 py-2 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-98"
            id="btn-open-rfq"
            title="Open RFQ Quote Basket"
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

          {/* Contextual WhatsApp Button */}
          <a
            href="https://wa.me/8801711197767?text=Hello%20Dhruba%20Power%2C%20I%20want%20to%20inquire%20about%20your%20services%20and%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-[#16A673] hover:bg-[#0F8A60] text-white rounded-lg shadow-sm hidden sm:flex items-center justify-center transition-colors"
            title="WhatsApp Helpline (+8801711197767)"
          >
            <MessageSquare className="w-4 h-4" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 md:hidden cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. Primary Navigation Bar: Real Links with Working Submenu */}
      <nav className="bg-slate-50 border-t border-slate-200 text-xs font-semibold text-slate-700 relative z-40 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between relative overflow-visible">
          <div className="flex items-center space-x-1 sm:space-x-2 py-1 overflow-visible">
            
            {/* 1. Home */}
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); handleNav('/'); }}
              className="px-3 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {t.home}
            </a>

            {/* 2. About Us */}
            <a
              href="/about/"
              onClick={(e) => { e.preventDefault(); handleNav('/about/'); }}
              className="px-3 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
            </a>

            {/* 3. Services Dropdown (Submenu Fix: High z-index, no clipping, fully displayed) */}
            <div 
              className="relative overflow-visible"
              onMouseEnter={handleServiceMouseEnter}
              onMouseLeave={handleServiceMouseLeave}
            >
              <div className="flex items-center">
                <a
                  href="/services/"
                  onClick={(e) => { e.preventDefault(); handleNav('/services/'); }}
                  className={`pl-3 pr-1 py-1.5 rounded-l transition-colors cursor-pointer ${
                    servicesDropdownOpen ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {t.services}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setServicesDropdownOpen(!servicesDropdownOpen);
                    setShopDropdownOpen(false);
                  }}
                  className={`pr-2 pl-1 py-1.5 rounded-r transition-colors cursor-pointer ${
                    servicesDropdownOpen ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-200 text-slate-800'
                  }`}
                  aria-expanded={servicesDropdownOpen}
                >
                  <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Submenu Dropdown Container */}
              {servicesDropdownOpen && (
                <div 
                  className="absolute left-0 top-full mt-0.5 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-[100] animate-in fade-in slide-in-from-top-1 duration-150"
                  style={{ minWidth: '280px' }}
                >
                  <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span>{lang === 'bn' ? 'ধ্রুব পাওয়ারের ৬টি প্রধান সেবা' : 'Core Turnkey Disciplines'}</span>
                    <a 
                      href="/services/"
                      onClick={(e) => { e.preventDefault(); handleNav('/services/'); }}
                      className="text-[#D97706] hover:underline"
                    >
                      View All →
                    </a>
                  </div>

                  {/* 1. Substation */}
                  <a
                    href="/services/substation/"
                    onClick={(e) => { e.preventDefault(); handleNav('/services/substation/'); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-3 transition-colors group"
                  >
                    <div className="p-1.5 bg-amber-50 rounded-lg text-[#D97706] group-hover:bg-[#0F172A] group-hover:text-white transition-colors shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[#D97706] transition-colors">
                        {lang === 'bn' ? 'সাব-স্টেশন ইঞ্জিনিয়ারিং' : 'Substation Engineering'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        11kV/0.415kV Transformers &amp; VCB Panels
                      </div>
                    </div>
                  </a>

                  {/* 2. Solar System */}
                  <a
                    href="/services/solar-system/"
                    onClick={(e) => { e.preventDefault(); handleNav('/services/solar-system/'); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-3 transition-colors group"
                  >
                    <div className="p-1.5 bg-amber-50 rounded-lg text-[#D97706] group-hover:bg-[#0F172A] group-hover:text-white transition-colors shrink-0">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[#D97706] transition-colors">
                        {lang === 'bn' ? 'সোলার সিস্টেম' : 'Solar System'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        On-Grid, Hybrid &amp; Net-Metering
                      </div>
                    </div>
                  </a>

                  {/* 3. Lightning Arrester */}
                  <a
                    href="/services/lightning-arrester/"
                    onClick={(e) => { e.preventDefault(); handleNav('/services/lightning-arrester/'); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-3 transition-colors group"
                  >
                    <div className="p-1.5 bg-amber-50 rounded-lg text-[#D97706] group-hover:bg-[#0F172A] group-hover:text-white transition-colors shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[#D97706] transition-colors">
                        {lang === 'bn' ? 'বজ্রপাত সুরক্ষা' : 'Lightning Arrester'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        NFC 17-102 ESE &amp; Chemical Earth Pits
                      </div>
                    </div>
                  </a>

                  {/* 4. Electrical Wiring */}
                  <a
                    href="/services/electrical-wiring/"
                    onClick={(e) => { e.preventDefault(); handleNav('/services/electrical-wiring/'); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-3 transition-colors group"
                  >
                    <div className="p-1.5 bg-amber-50 rounded-lg text-[#D97706] group-hover:bg-[#0F172A] group-hover:text-white transition-colors shrink-0">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[#D97706] transition-colors">
                        {lang === 'bn' ? 'ইলেকট্রিক্যাল ওয়্যারিং' : 'Electrical Wiring'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        Cable Ladders &amp; HT/LT Distribution
                      </div>
                    </div>
                  </a>

                  {/* 5. CCTV Installation */}
                  <a
                    href="/services/cctv-installation/"
                    onClick={(e) => { e.preventDefault(); handleNav('/services/cctv-installation/'); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-3 transition-colors group"
                  >
                    <div className="p-1.5 bg-amber-50 rounded-lg text-[#D97706] group-hover:bg-[#0F172A] group-hover:text-white transition-colors shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[#D97706] transition-colors">
                        {lang === 'bn' ? 'সিসিটিভি ইনস্টলেশন' : 'CCTV Installation'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        AcuSense AI IP Video &amp; Fiber Backbones
                      </div>
                    </div>
                  </a>

                  {/* 6. Panel Board */}
                  <a
                    href="/services/panel-board/"
                    onClick={(e) => { e.preventDefault(); handleNav('/services/panel-board/'); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-3 transition-colors group"
                  >
                    <div className="p-1.5 bg-amber-50 rounded-lg text-[#D97706] group-hover:bg-[#0F172A] group-hover:text-white transition-colors shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-[#D97706] transition-colors">
                        {lang === 'bn' ? 'প্যানেল বোর্ড' : 'Panel Board'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        Form 2b/3b LT Panels, ATS &amp; PFI Plants
                      </div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* 4. Shop Dropdown */}
            <div 
              className="relative overflow-visible"
              onMouseEnter={handleShopMouseEnter}
              onMouseLeave={handleShopMouseLeave}
            >
              <div className="flex items-center">
                <a
                  href="/shop/"
                  onClick={(e) => {
                    e.preventDefault();
                    onCategorySelect('all');
                    handleNav('/shop/');
                  }}
                  className={`pl-3 pr-1 py-1.5 rounded-l transition-colors cursor-pointer ${
                    shopDropdownOpen ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {lang === 'bn' ? 'শপ' : 'Shop'}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setShopDropdownOpen(!shopDropdownOpen);
                    setServicesDropdownOpen(false);
                  }}
                  className={`pr-2 pl-1 py-1.5 rounded-r transition-colors cursor-pointer ${
                    shopDropdownOpen ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-200 text-slate-800'
                  }`}
                  aria-expanded={shopDropdownOpen}
                >
                  <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${shopDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {shopDropdownOpen && (
                <div 
                  className="absolute left-0 top-full mt-0.5 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-[100] animate-in fade-in slide-in-from-top-1 duration-150"
                  style={{ minWidth: '240px' }}
                >
                  <a
                    href="/shop/"
                    onClick={(e) => {
                      e.preventDefault();
                      onCategorySelect('all');
                      handleNav('/shop/');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-2.5"
                  >
                    <Layers className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>{t.allProducts}</span>
                  </a>

                  <div className="border-t border-slate-100 my-1"></div>

                  <a
                    href="/shop/"
                    onClick={(e) => {
                      e.preventDefault();
                      onCategorySelect('eee');
                      handleNav('/shop/');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-2.5"
                  >
                    <Zap className="w-4 h-4 text-[#D97706] shrink-0" />
                    <span>{t.eee} (MCB, MCCB, ACB)</span>
                  </a>

                  <a
                    href="/shop/"
                    onClick={(e) => {
                      e.preventDefault();
                      onCategorySelect('cctv');
                      handleNav('/shop/');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-2.5"
                  >
                    <Camera className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>{t.cctv}</span>
                  </a>

                  <a
                    href="/shop/"
                    onClick={(e) => {
                      e.preventDefault();
                      onCategorySelect('solar');
                      handleNav('/shop/');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-2.5"
                  >
                    <Sun className="w-4 h-4 text-[#D97706] shrink-0" />
                    <span>{t.solar}</span>
                  </a>
                </div>
              )}
            </div>

            {/* 5. Projects */}
            <a
              href="/projects/"
              onClick={(e) => { e.preventDefault(); handleNav('/projects/'); }}
              className="px-3 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {t.projects}
            </a>

            {/* 6. Experts */}
            <a
              href="/experts/"
              onClick={(e) => { e.preventDefault(); handleNav('/experts/'); }}
              className="px-3 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {t.experts}
            </a>

            {/* 7. Blogs */}
            <a
              href="/blogs/"
              onClick={(e) => { e.preventDefault(); handleNav('/blogs/'); }}
              className="px-3 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {t.blog}
            </a>

            {/* 8. Contact */}
            <a
              href="/contact/"
              onClick={(e) => { e.preventDefault(); handleNav('/contact/'); }}
              className="px-3 py-1.5 rounded hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {t.contact}
            </a>
          </div>

          {/* Right badge: Genuine factory warranty */}
          <div className="hidden xl:flex items-center gap-1.5 text-slate-600 text-[11px] py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A673]"></span>
            <span>{lang === 'bn' ? '১০০% অরিজিনাল ফ্যাক্টরি ওয়্যারেন্টি ও অফিসিয়াল সাপ্লাই' : '100% Genuine OEM Factory Warranties'}</span>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          {/* Mobile Technical Search */}
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

          {/* Mobile Links List */}
          <div className="space-y-1 text-sm font-semibold text-slate-800">
            {/* Home */}
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); handleNav('/'); }}
              className="block w-full text-left p-2 rounded hover:bg-slate-100"
            >
              {t.home}
            </a>

            {/* About */}
            <a
              href="/about/"
              onClick={(e) => { e.preventDefault(); handleNav('/about/'); }}
              className="block w-full text-left p-2 rounded hover:bg-slate-100"
            >
              {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
            </a>

            {/* Services with Mobile Accordion */}
            <div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-slate-100">
                <a
                  href="/services/"
                  onClick={(e) => { e.preventDefault(); handleNav('/services/'); }}
                  className="flex-1"
                >
                  {t.services}
                </a>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="p-1 cursor-pointer"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {mobileServicesOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg my-1">
                  <a href="/services/substation/" onClick={(e) => { e.preventDefault(); handleNav('/services/substation/'); }} className="block w-full text-left py-1.5 text-xs text-slate-700 hover:text-slate-900">
                    • {lang === 'bn' ? 'সাব-স্টেশন' : 'Sub-Station'}
                  </a>
                  <a href="/services/solar-system/" onClick={(e) => { e.preventDefault(); handleNav('/services/solar-system/'); }} className="block w-full text-left py-1.5 text-xs text-slate-700 hover:text-slate-900">
                    • {lang === 'bn' ? 'সোলার সিস্টেম' : 'Solar System'}
                  </a>
                  <a href="/services/lightning-arrester/" onClick={(e) => { e.preventDefault(); handleNav('/services/lightning-arrester/'); }} className="block w-full text-left py-1.5 text-xs text-slate-700 hover:text-slate-900">
                    • {lang === 'bn' ? 'বজ্রপাত সুরক্ষা' : 'Lightning Arrester'}
                  </a>
                  <a href="/services/electrical-wiring/" onClick={(e) => { e.preventDefault(); handleNav('/services/electrical-wiring/'); }} className="block w-full text-left py-1.5 text-xs text-slate-700 hover:text-slate-900">
                    • {lang === 'bn' ? 'ইলেকট্রিক্যাল ওয়্যারিং' : 'Electrical Wiring'}
                  </a>
                  <a href="/services/cctv-installation/" onClick={(e) => { e.preventDefault(); handleNav('/services/cctv-installation/'); }} className="block w-full text-left py-1.5 text-xs text-slate-700 hover:text-slate-900">
                    • {lang === 'bn' ? 'সিসিটিভি ইনস্টলেশন' : 'CCTV Installation'}
                  </a>
                  <a href="/services/panel-board/" onClick={(e) => { e.preventDefault(); handleNav('/services/panel-board/'); }} className="block w-full text-left py-1.5 text-xs text-slate-700 hover:text-slate-900">
                    • {lang === 'bn' ? 'প্যানেল বোর্ড' : 'Panel Board'}
                  </a>
                </div>
              )}
            </div>

            {/* Shop with Mobile Accordion */}
            <div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-slate-100">
                <a
                  href="/shop/"
                  onClick={(e) => {
                    e.preventDefault();
                    onCategorySelect('all');
                    handleNav('/shop/');
                  }}
                  className="flex-1"
                >
                  {lang === 'bn' ? 'শপ' : 'Shop'}
                </a>
                <button
                  onClick={() => setMobileShopOpen(!mobileShopOpen)}
                  className="p-1 cursor-pointer"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileShopOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {mobileShopOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg my-1">
                  <a href="/shop/" onClick={(e) => { e.preventDefault(); onCategorySelect('all'); handleNav('/shop/'); }} className="block w-full text-left py-1.5 text-xs text-slate-700 hover:text-slate-900">
                    • {t.allProducts}
                  </a>
                  <a href="/shop/" onClick={(e) => { e.preventDefault(); onCategorySelect('eee'); handleNav('/shop/'); }} className="block w-full text-left py-1.5 text-xs text-slate-700 hover:text-slate-900">
                    • {t.eee} (MCB, MCCB, ACB)
                  </a>
                  <a href="/shop/" onClick={(e) => { e.preventDefault(); onCategorySelect('cctv'); handleNav('/shop/'); }} className="block w-full text-left py-1.5 text-xs text-slate-700 hover:text-slate-900">
                    • {t.cctv}
                  </a>
                  <a href="/shop/" onClick={(e) => { e.preventDefault(); onCategorySelect('solar'); handleNav('/shop/'); }} className="block w-full text-left py-1.5 text-xs text-slate-700 hover:text-slate-900">
                    • {t.solar}
                  </a>
                </div>
              )}
            </div>

            {/* Projects */}
            <a
              href="/projects/"
              onClick={(e) => { e.preventDefault(); handleNav('/projects/'); }}
              className="block w-full text-left p-2 rounded hover:bg-slate-100"
            >
              {t.projects}
            </a>

            {/* Experts */}
            <a
              href="/experts/"
              onClick={(e) => { e.preventDefault(); handleNav('/experts/'); }}
              className="block w-full text-left p-2 rounded hover:bg-slate-100"
            >
              {t.experts}
            </a>

            {/* Blogs */}
            <a
              href="/blogs/"
              onClick={(e) => { e.preventDefault(); handleNav('/blogs/'); }}
              className="block w-full text-left p-2 rounded hover:bg-slate-100"
            >
              {t.blog}
            </a>

            {/* Contact */}
            <a
              href="/contact/"
              onClick={(e) => { e.preventDefault(); handleNav('/contact/'); }}
              className="block w-full text-left p-2 rounded hover:bg-slate-100"
            >
              {t.contact}
            </a>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <a
              href="tel:+8801711197767"
              className="font-bold text-slate-800 flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#F59E0B]" />
              +880 1711-197767
            </a>
            <button
              onClick={onToggleLang}
              className="font-bold text-[#D97706] bg-amber-50 px-2.5 py-1 rounded border border-amber-200"
            >
              {lang === 'en' ? 'বাংলা সংস্করণ' : 'English Version'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
