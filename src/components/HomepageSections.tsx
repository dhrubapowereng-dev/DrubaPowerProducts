import React, { useState } from 'react';
import { 
  Zap, 
  Sun, 
  Activity, 
  Camera, 
  Cpu, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  FileText, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Wrench,
  Building2,
  HardHat,
  MapPin,
  Clock,
  Award,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { ProductItem, ExpertItem } from '../types/catalog';
import { ProductCard } from './ProductCard';
import { PartnerLogoMarquee } from './PartnerLogoMarquee';
import { SERVICES_DATA } from '../data/servicesData';
import { PROJECTS_DATA } from '../data/projectsData';
import { BLOGS_DATA } from '../data/blogsData';

interface HomepageSectionsProps {
  lang: Language;
  onExploreProducts: () => void;
  onRequestQuote: () => void;
  onSelectCategory: (cat: string) => void;
  catalogProducts: ProductItem[];
  experts: ExpertItem[];
  onProductClick?: (product: ProductItem) => void;
  onQuickQuote?: (product: ProductItem) => void;
  onAddToRfq?: (product: ProductItem) => void;
  isAddedToRfq?: (id: number) => boolean;
  onToggleCompare?: (product: ProductItem) => void;
  isCompared?: (id: number) => boolean;
  onToggleWishlist?: (product: ProductItem) => void;
  isWishlisted?: (id: number) => boolean;
  onNavigate: (path: string) => void;
}

export const HomepageSections: React.FC<HomepageSectionsProps> = ({
  lang,
  onExploreProducts,
  onRequestQuote,
  onSelectCategory,
  catalogProducts,
  experts,
  onProductClick,
  onQuickQuote,
  onAddToRfq,
  isAddedToRfq,
  onToggleCompare,
  isCompared,
  onToggleWishlist,
  isWishlisted,
  onNavigate
}) => {
  const t = TRANSLATIONS[lang];

  // Projects State & Filter
  const [projectFilter, setProjectFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  const [projectSlideIndex, setProjectSlideIndex] = useState(0);

  // Dynamic Latest Products Slider State (15 products, 4 visible at once)
  const [productSlideIndex, setProductSlideIndex] = useState(0);

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (projectFilter === 'all') return true;
    return p.status === projectFilter;
  });

  // Slide controls for 4-card project carousel
  const maxProjectSlide = Math.max(0, filteredProjects.length - 4);
  const handlePrevProject = () => {
    setProjectSlideIndex((prev) => Math.max(0, prev - 1));
  };
  const handleNextProject = () => {
    setProjectSlideIndex((prev) => Math.min(maxProjectSlide, prev + 1));
  };

  // Dynamic WooCommerce Products (up to 15 latest products)
  const latestProducts = catalogProducts.slice(0, 15);
  const maxProductSlide = Math.max(0, latestProducts.length - 4);

  const handlePrevProduct = () => {
    setProductSlideIndex((prev) => Math.max(0, prev - 1));
  };
  const handleNextProduct = () => {
    setProductSlideIndex((prev) => Math.min(maxProductSlide, prev + 1));
  };

  // Active Experts (sorted by displayOrder)
  const activeExperts = experts
    .filter((e) => e.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'substation': return Activity;
      case 'solar-system': return Sun;
      case 'lightning-arrester': return Zap;
      case 'electrical-wiring': return Wrench;
      case 'cctv-installation': return Camera;
      case 'panel-board': return Cpu;
      default: return Zap;
    }
  };

  return (
    <div className="space-y-16">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION — PRESERVED FROM REPOSITORY 1                             */}
      {/* ========================================================================= */}
      <section 
        id="hero" 
        className="relative bg-[#0F172A] text-white py-16 lg:py-24 px-4 overflow-hidden border-b border-slate-800"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.94)), url('https://dhrubapower.com/wp-content/uploads/2026/05/panel-room-02.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#F59E0B]">
              <span className="w-2 h-2 rounded-full bg-[#16A673] animate-pulse"></span>
              <span>Dhruba Power &amp; Engineering</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {lang === 'bn' 
                ? 'নির্ভরযোগ্য বৃদ্ধির জন্য নির্মিত ইলেকট্রিক্যাল, সোলার ও সাবস্টেশন ইঞ্জিনিয়ারিং।' 
                : 'Electrical, solar and substation engineering built for reliable growth.'}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'bn'
                ? 'বরিশাল ও দেশব্যাপী আবাসিক, বাণিজ্যিক ভবন, কল-কারখানা ও শিল্পাঞ্চলে ডিজাইন, স্থাপন, বিক্রয়, সেবা এবং নিয়মিত রক্ষণাবেক্ষণ।'
                : 'Design, installation, sales, service, and maintenance for homes, commercial buildings, factories, and industrial power systems across Barishal.'}
            </p>

            {/* Trust Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#F59E0B]">7+</div>
                <div className="text-xs text-slate-400">{t.yearsExperience}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">500+</div>
                <div className="text-xs text-slate-400">{t.projectsCompleted}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#16A673]">24/7</div>
                <div className="text-xs text-slate-400">{t.emergencyResponse}</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('/shop/')}
                className="px-6 py-3 bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-98"
                id="btn-hero-explore-catalogue"
              >
                <Layers className="w-4 h-4" />
                <span>{lang === 'bn' ? 'ইন্ডাস্ট্রিয়াল শপ / ক্যাটালগ দেখুন' : 'Explore Product Catalogue'}</span>
              </button>

              <button
                onClick={onRequestQuote}
                className="px-5 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold rounded-lg flex items-center gap-2 cursor-pointer transition-all"
                id="btn-hero-request-quote"
              >
                <FileText className="w-4 h-4 text-[#F59E0B]" />
                <span>{lang === 'bn' ? 'প্রজেক্ট কোটেশন পাঠান' : 'Request Project Quote'}</span>
              </button>

              <a
                href="https://wa.me/8801711197767?text=Hello%20Dhruba%20Power%2C%20I%20want%20to%20inquire%20about%20your%20services%20and%20engineering%20solutions."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-[#16A673] hover:bg-[#0F8A60] text-white text-xs sm:text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp (+880 1711-197767)</span>
              </a>
            </div>
          </div>

          {/* Quick Contact & Engineering Desk Card */}
          <div className="lg:col-span-4 bg-slate-900/95 border border-slate-700 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-5 h-5 text-[#F59E0B]" />
              <div>
                <div className="text-sm font-bold text-white">Dhruba Power Headquarters</div>
                <div className="text-xs text-slate-400">Barishal Central Engineering Hub</div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Khan Sarak, Kazipar, C&amp;B Road, Barishal 8200, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <a href="tel:+8801711197767" className="text-[#F59E0B] font-bold hover:underline">
                  +880 1711-197767
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>24/7 Field Engineering &amp; Emergency Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#16A673] shrink-0" />
                <span className="text-[#16A673] font-semibold">Authorized OEM Distributor Warranty</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800 text-[11px] text-slate-300">
                <span className="font-bold text-white block mb-1">Turnkey Engineering Execution:</span>
                Substation equipment, solar power arrays, HT/LT panels, and lightning arresters supplied with installation &amp; testing warranties.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PARTNER / BRAND LOGOS — CONTINUOUS RIGHT-TO-LEFT MARQUEE (#6)           */}
      {/* ========================================================================= */}
      <PartnerLogoMarquee lang={lang} />

      {/* ========================================================================= */}
      {/* 3. SIX CORE SERVICES SECTION — REAL LINKS TO SERVICE PAGES (#10, #11, #12) */}
      {/* ========================================================================= */}
      <section id="services" className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
            {lang === 'bn' ? 'আমাদের বিশেষজ্ঞ সেবাসমূহ' : 'Core Engineering Disciplines'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            {lang === 'bn' ? 'ধ্রুব পাওয়ারের ৬টি প্রধান ইঞ্জিনিয়ারিং সেবা' : 'Services Engineered for Safer Power Infrastructure'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === 'bn' 
              ? 'সাব-স্টেশন থেকে সোলার ও সিসিটিভি—শিল্প প্রতিষ্ঠানের বিদ্যুৎ ও সুরক্ষায় পূর্ণাঙ্গ কারিগরি সমাধান।'
              : 'Every service is available as design, supply, installation, testing, maintenance, and upgrade support.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((svc) => {
            const Icon = getServiceIcon(svc.id);
            const serviceUrl = `/services/${svc.slug}/`;

            return (
              <div 
                key={svc.id}
                className="bg-white border border-slate-200 hover:border-slate-400 rounded-2xl p-6 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Service Photo / Icon Header */}
                  <a
                    href={serviceUrl}
                    onClick={(e) => { e.preventDefault(); onNavigate(serviceUrl); }}
                    className="block overflow-hidden rounded-xl h-36 w-full mb-4 bg-slate-100 relative group cursor-pointer"
                  >
                    <img 
                      src={svc.image} 
                      alt={svc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-[#F59E0B] flex items-center justify-center border border-slate-700 shadow-xs">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </a>

                  {/* Title linking to service page (NO DEAD "#") */}
                  <h3 className="text-base font-bold text-[#0F172A] mb-2 leading-snug group-hover:text-[#D97706] transition-colors">
                    <a 
                      href={serviceUrl}
                      onClick={(e) => { e.preventDefault(); onNavigate(serviceUrl); }}
                      className="hover:underline cursor-pointer"
                    >
                      {lang === 'bn' ? svc.titleBn : svc.title}
                    </a>
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {lang === 'bn' ? svc.shortDescBn : svc.shortDesc}
                  </p>
                </div>

                {/* Card Action Button pointing to service page */}
                <div className="pt-3 border-t border-slate-100">
                  <a
                    href={serviceUrl}
                    onClick={(e) => { e.preventDefault(); onNavigate(serviceUrl); }}
                    className="w-full py-2 px-3 bg-slate-50 hover:bg-[#0F172A] text-slate-800 hover:text-white border border-slate-300 hover:border-[#0F172A] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>{lang === 'bn' ? 'সেবার বিবরণ দেখুন' : 'Explore Service'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DYNAMIC HOMEPAGE PRODUCTS — CAROUSEL (4 CARDS VISIBLE)                  */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
              {lang === 'bn' ? 'লেটেস্ট প্রোডাক্টস' : 'Latest Products'}
            </div>
            <h2 className="text-2xl font-extrabold text-[#0F172A]">
              {lang === 'bn' ? 'ইলেকট্রিক্যাল পণ্য ও প্রকৌশল যন্ত্রপাতি' : 'Electrical Products & Engineering Equipment'}
            </h2>
            <p className="text-xs text-slate-600">
              {lang === 'bn' ? 'সরাসরি প্রস্তুতকারক ওয়ারেন্টি সহ আসল সুইচগিয়ার, সোলার ও নিরাপত্তা ডিভাইস।' : 'Shop catalog items, request supply quotes, or connect products with installation support.'}
            </p>
          </div>

          {/* Carousel Slider Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              {lang === 'bn' 
                ? `প্রদর্শন হচ্ছে ${productSlideIndex + 1}–${Math.min(productSlideIndex + 4, latestProducts.length)} / ${latestProducts.length}`
                : `Showing ${productSlideIndex + 1}–${Math.min(productSlideIndex + 4, latestProducts.length)} of ${latestProducts.length}`}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevProduct}
                disabled={productSlideIndex === 0}
                className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextProduct}
                disabled={productSlideIndex >= maxProductSlide}
                className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
                aria-label="Next products"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => onNavigate('/shop/')}
              className="ml-1 text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'bn' ? 'সব পণ্য দেখুন' : 'View All (Shop)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Cards Visible Simultaneously on Desktop Carousel */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${productSlideIndex * 25}%)`
            }}
          >
            {latestProducts.map((prod) => (
              <div 
                key={prod.id}
                className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-2.5 flex"
              >
                <div className="w-full flex flex-col">
                  <ProductCard
                    product={prod}
                    onSelect={(p) => onNavigate(`/product/${p.id}/`)}
                    onAddToRfq={(p) => onAddToRfq && onAddToRfq(p)}
                    isAddedToRfq={isAddedToRfq ? isAddedToRfq(prod.id) : false}
                    isCompared={isCompared ? isCompared(prod.id) : false}
                    onToggleCompare={(p) => onToggleCompare && onToggleCompare(p)}
                    isWishlisted={isWishlisted ? isWishlisted(prod.id) : false}
                    onToggleWishlist={(p) => onToggleWishlist && onToggleWishlist(p)}
                    lang={lang}
                    onCategoryClick={(cat) => onSelectCategory(cat)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOMEPAGE PROJECTS — HORIZONTAL 4-CARD CAROUSEL (#13, #14)               */}
      {/* ========================================================================= */}
      <section id="projects" className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
              {lang === 'bn' ? 'প্রকল্পসমূহ' : 'Projects'}
            </div>
            <h2 className="text-2xl font-extrabold text-[#0F172A]">
              {lang === 'bn' ? 'সম্পন্ন এবং চলমান প্রকৌশল প্রকল্প' : 'Completed & Ongoing Engineering Work'}
            </h2>
            <p className="text-xs text-slate-600">
              {lang === 'bn' ? 'বরিশাল ও দেশব্যাপী সফলভাবে সরবরাহকৃত সুইচগিয়ার ও বিদ্যুৎ অবকাঠামো।' : 'Engineered substations, solar plants, and CCTV architectures across Bangladesh.'}
            </p>
          </div>

          {/* Filter Tabs and Slider Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-bold text-slate-700">
              <button
                onClick={() => { setProjectFilter('all'); setProjectSlideIndex(0); }}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${projectFilter === 'all' ? 'bg-white shadow-2xs text-[#0F172A]' : 'hover:text-slate-900'}`}
              >
                ALL
              </button>
              <button
                onClick={() => { setProjectFilter('ongoing'); setProjectSlideIndex(0); }}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${projectFilter === 'ongoing' ? 'bg-white shadow-2xs text-[#0F172A]' : 'hover:text-slate-900'}`}
              >
                {lang === 'bn' ? 'চলমান' : 'Ongoing'}
              </button>
              <button
                onClick={() => { setProjectFilter('completed'); setProjectSlideIndex(0); }}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${projectFilter === 'completed' ? 'bg-white shadow-2xs text-[#0F172A]' : 'hover:text-slate-900'}`}
              >
                {lang === 'bn' ? 'সম্পন্ন' : 'Completed'}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevProject}
                disabled={projectSlideIndex === 0}
                className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
                aria-label="Previous projects"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextProject}
                disabled={projectSlideIndex >= maxProjectSlide}
                className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
                aria-label="Next projects"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => onNavigate('/projects/')}
              className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Cards Visible at Once Horizontal Carousel with Clean Presentation (#14) */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${projectSlideIndex * 25}%)`
            }}
          >
            {filteredProjects.map((proj) => {
              const projectUrl = `/projects/${proj.slug}/`;

              return (
                <div 
                  key={proj.id}
                  className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-2.5"
                >
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full group">
                    <div>
                      <a
                        href={projectUrl}
                        onClick={(e) => { e.preventDefault(); onNavigate(projectUrl); }}
                        className="h-40 w-full overflow-hidden block relative bg-slate-100 cursor-pointer"
                      >
                        <img 
                          src={proj.image} 
                          alt={proj.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                          proj.status === 'completed' 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-[#D97706] text-white'
                        }`}>
                          {proj.statusLabel}
                        </span>
                      </a>

                      <div className="p-4 space-y-2">
                        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{proj.location}</span>
                        </div>

                        <h4 className="text-sm font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#D97706] transition-colors">
                          <a
                            href={projectUrl}
                            onClick={(e) => { e.preventDefault(); onNavigate(projectUrl); }}
                            className="hover:underline cursor-pointer"
                          >
                            {proj.title}
                          </a>
                        </h4>

                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {proj.scope}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>Progress</span>
                          <span className="font-mono font-bold text-slate-900">{proj.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${proj.status === 'completed' ? 'bg-[#16A673]' : 'bg-[#D97706]'}`}
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Working View Project Link (#14) */}
                      <a
                        href={projectUrl}
                        onClick={(e) => { e.preventDefault(); onNavigate(projectUrl); }}
                        className="w-full py-1.5 px-3 bg-slate-50 hover:bg-[#0F172A] text-slate-700 hover:text-white border border-slate-200 hover:border-[#0F172A] rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <span>View Project</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOMEPAGE EXPERTS — DYNAMIC MANAGEMENT & INDIVIDUAL WHATSAPP (#15, #17)  */}
      {/* ========================================================================= */}
      <section id="experts" className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
            {lang === 'bn' ? 'আমাদের বিশেষজ্ঞ প্রকৌশলী দল' : 'Our Engineering Experts'}
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">
            {lang === 'bn' ? 'সরাসরি পরামর্শের জন্য সার্টিফাইড ইঞ্জিনিয়ারগণ' : 'Certified Engineers Ready for Direct Consultation'}
          </h2>
          <p className="text-xs text-slate-600">
            {lang === 'bn' ? 'দক্ষতা, অভিজ্ঞতা এবং প্রতিটি বিশেষজ্ঞের নিজস্ব হোয়াটসঅ্যাপে সরাসরি যোগাযোগের ব্যবস্থা।' : 'Each profile shows skills, experience, and a direct WhatsApp consultation link.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeExperts.map((exp) => {
            const cleanPhone = exp.whatsappNumber.replace(/[^0-9]/g, '');
            const expertSlug = exp.slug || exp.id;
            const profileUrl = `/experts/${expertSlug}/`;
            const whatsappText = encodeURIComponent(
              `Hello ${exp.name}, I want to consult you from Dhruba Power regarding ${exp.department}.`
            );

            return (
              <div 
                key={exp.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <a
                    href={profileUrl}
                    onClick={(e) => { e.preventDefault(); onNavigate(profileUrl); }}
                    className="h-48 w-full bg-slate-100 overflow-hidden relative block cursor-pointer"
                  >
                    <img 
                      src={exp.photograph} 
                      alt={exp.name} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 left-2 bg-[#0F172A]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                      {exp.department}
                    </span>
                  </a>

                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-bold text-[#0F172A] leading-snug group-hover:text-[#D97706] transition-colors">
                      <a
                        href={profileUrl}
                        onClick={(e) => { e.preventDefault(); onNavigate(profileUrl); }}
                        className="hover:underline cursor-pointer"
                      >
                        {exp.name}
                      </a>
                    </h3>
                    <div className="text-xs font-semibold text-[#D97706]">
                      {exp.designation}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {exp.shortBio}
                    </p>
                  </div>
                </div>

                {/* Homepage expert card must have: View Profile + WhatsApp using THAT expert's number (#17) */}
                <div className="p-4 pt-0 space-y-2">
                  <a
                    href={profileUrl}
                    onClick={(e) => { e.preventDefault(); onNavigate(profileUrl); }}
                    className="w-full py-1.5 bg-slate-100 hover:bg-[#0F172A] text-slate-800 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>

                  <a
                    href={`https://wa.me/${cleanPhone}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-white hover:bg-emerald-50 text-[#16A673] border border-[#16A673]/40 hover:border-[#16A673] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. HOMEPAGE BLOGS SECTION (#10)                                            */}
      {/* ========================================================================= */}
      <section id="blogs" className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
              {lang === 'bn' ? 'ব্লগ ও প্রযুক্তিগত নির্দেশিকা' : 'Technical Engineering Guides'}
            </div>
            <h2 className="text-2xl font-extrabold text-[#0F172A]">
              {lang === 'bn' ? 'সাম্প্রতিক বিদ্যুৎ ও প্রকৌশল আর্টিকেল' : 'Recent Engineering Insights & Field Protocols'}
            </h2>
            <p className="text-xs text-slate-600">
              Transformer safety, net-metering economics, and breaker sizing written by Barishal engineers.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/blogs/')}
            className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>View All Engineering Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOGS_DATA.slice(0, 3).map((blog) => {
            const blogUrl = `/blog/${blog.slug}/`;

            return (
              <div 
                key={blog.id}
                className="bg-white border border-slate-200 hover:border-slate-400 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <a
                    href={blogUrl}
                    onClick={(e) => { e.preventDefault(); onNavigate(blogUrl); }}
                    className="h-44 w-full overflow-hidden block relative bg-slate-100 cursor-pointer"
                  >
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 left-2 bg-[#0F172A]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                      {blog.category}
                    </span>
                  </a>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{blog.date}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#D97706] transition-colors">
                      <a
                        href={blogUrl}
                        onClick={(e) => { e.preventDefault(); onNavigate(blogUrl); }}
                        className="hover:underline cursor-pointer"
                      >
                        {lang === 'bn' ? blog.titleBn : blog.title}
                      </a>
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {lang === 'bn' ? blog.excerptBn : blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <a
                    href={blogUrl}
                    onClick={(e) => { e.preventDefault(); onNavigate(blogUrl); }}
                    className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SYSTEMATIC TURNKEY WORK PROCESS                                         */}
      {/* ========================================================================= */}
      <section className="border-t border-slate-200 bg-slate-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
              {t.workProcessTitle}
            </div>
            <h2 className="text-2xl font-extrabold text-[#0F172A]">
              {lang === 'bn' ? 'সাইট সার্ভে থেকে সাপোর্ট পর্যন্ত আমাদের প্রক্রিয়া' : 'A Clear Path from Survey to Support'}
            </h2>
            <p className="text-xs text-slate-600">
              {t.workProcessDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: lang === 'bn' ? 'সাইট পরিদর্শন ও কনসালটেশন' : 'Site Survey & Engineering Assessment',
                desc: lang === 'bn' ? 'আমাদের রেজিস্টার্ড প্রকৌশলী দল সরেজমিনে লোড ক্যালকুলেশন ও সাইট পরীক্ষা করে।' : 'Our electrical engineering team visits your industrial facility to audit loads and evaluate substation/solar feasibility.'
              },
              {
                step: '02',
                title: lang === 'bn' ? 'ইঞ্জিনিয়ারিং ড্রয়িং ও বিওএম প্রিপারেশন' : 'Single Line Diagram (SLD) & BOQ',
                desc: lang === 'bn' ? 'স্ট্যান্ডার্ড অনুযায়ী ড্রয়িং, উপাদান তালিকা এবং বিস্তারিত কোটেশন প্রস্তুত করা হয়।' : 'Preparation of compliant electrical SLDs, transformer sizing, breaker trip coordination, and Bill of Quantities.'
              },
              {
                step: '03',
                title: lang === 'bn' ? 'জেনুইন ইকুইপমেন্ট ও সুইচগিয়ার সরবরাহ' : 'OEM Equipment Procurement & Supply',
                desc: lang === 'bn' ? 'সরাসরি অফিসিয়াল ম্যানুফ্যাকচারার ওয়ারেন্টি সহ অরিজিনাল সুইচগিয়ার ডেলিভারি।' : 'Direct sourcing from authorized distributors (ABB, Schneider, Siemens, Growatt, Hikvision) with OEM certificates.'
              },
              {
                step: '04',
                title: lang === 'bn' ? 'স্থাপন, টেস্টিং ও অনুমোদন' : 'Installation, Testing & Utility Approval',
                desc: lang === 'bn' ? 'আন্তর্জাতিক মান ও সরকারি বিদ্যুৎ বোর্ডের অনুমোদন অনুযায়ী নিখুঁত স্থাপন।' : 'Rigorous insulation resistance testing, primary/secondary injection tests, and utility authority approvals.'
              },
              {
                step: '05',
                title: lang === 'bn' ? '২৪/৭ রক্ষণাবেক্ষণ ও ইমার্জেন্সি সাপোর্ট' : 'Ongoing Maintenance & 24/7 Support',
                desc: lang === 'bn' ? 'যেকোনো ত্রুটিতে বরিশাল ও সারাদেশে দ্রুততম সময়ে কারিগরি সাপোর্ট নিশ্চয়তা।' : 'Preventive maintenance contracts, thermal imaging audits, and 24/7 rapid emergency dispatch across Bangladesh.'
              }
            ].map((s, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-2xs relative"
              >
                <div className="text-2xl font-black text-slate-300 font-mono mb-2">
                  {s.step}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] mb-1.5 leading-snug">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. CONSULTATION & DIRECT HELPLINE BANNER                                   */}
      {/* ========================================================================= */}
      <section id="contact" className="bg-[#0F172A] text-white py-12 px-4 rounded-3xl max-w-7xl mx-auto shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 bg-slate-800 text-[#F59E0B] text-xs px-3 py-1 rounded-full font-semibold border border-slate-700">
              <HardHat className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ইঞ্জিনিয়ারিং কনসালটেশন' : 'Licensed Electrical Engineering Support'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'bn' 
                ? 'আপনার শিল্প কারখানা বা ভবনের বিদ্যুৎ পরিকাঠামো নিয়ে আলোচনা করুন' 
                : 'Need a Professional Engineering Review for Your Facility?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'bn'
                ? 'আমাদের প্রধান প্রকৌশলী দল আপনার লোড শিডিউল, সিঙ্গেল লাইন ডায়াগ্রাম এবং বিওএম পর্যালোচনা করতে প্রস্তুত।'
                : 'Speak directly with our senior power engineers in Barishal for load audits, switchgear breaker sizing, and solar feasibility.'}
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <a
              href="tel:+8801711197767"
              className="py-3 px-4 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm text-center"
            >
              <Phone className="w-4 h-4" />
              <span>Call Hotline: +880 1711-197767</span>
            </a>
            <a
              href="https://wa.me/8801711197767?text=Hello%20Dhruba%20Power%2C%20I%20want%20to%20consult%20an%20engineer%20for%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-[#16A673] hover:bg-[#0F8A60] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm text-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Consultation</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
