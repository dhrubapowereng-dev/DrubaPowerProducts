import React from 'react';
import { 
  Zap, 
  Sun, 
  ShieldCheck, 
  Activity, 
  Camera, 
  Cpu, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  FileText, 
  ArrowRight,
  Clock,
  Award,
  Layers,
  Wrench,
  Building2,
  HardHat
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface HomepageSectionsProps {
  lang: Language;
  onExploreProducts: () => void;
  onRequestQuote: () => void;
  onSelectCategory: (cat: string) => void;
}

export const HomepageSections: React.FC<HomepageSectionsProps> = ({
  lang,
  onExploreProducts,
  onRequestQuote,
  onSelectCategory
}) => {
  const t = TRANSLATIONS[lang];

  const coreServices = [
    {
      id: 'substation',
      icon: Activity,
      title: t.substationTitle,
      desc: t.substationDesc,
      category: 'eee',
      linkedProduct: '250 kVA Oil-Immersed Distribution Transformer',
      mpn: 'TR-250KVA-11/0.415'
    },
    {
      id: 'solar',
      icon: Sun,
      title: t.solarSystemTitle,
      desc: t.solarSystemDesc,
      category: 'solar',
      linkedProduct: 'Growatt SPH 10kW 3-Phase Hybrid Inverter',
      mpn: 'SPH 10000TL3-BH-UP'
    },
    {
      id: 'lightning',
      icon: Zap,
      title: t.lightningTitle,
      desc: t.lightningDesc,
      category: 'eee',
      linkedProduct: '11kV 10kA Metal Oxide Polymeric Lightning Arrester',
      mpn: 'LA-11KV-10KA'
    },
    {
      id: 'wiring',
      icon: Wrench,
      title: t.wiringTitle,
      desc: t.wiringDesc,
      category: 'eee',
      linkedProduct: 'ABB SH201-C20 1P 20A 6kA MCB',
      mpn: 'SH201-C20'
    },
    {
      id: 'cctv',
      icon: Camera,
      title: t.cctvInstallTitle,
      desc: t.cctvInstallDesc,
      category: 'cctv',
      linkedProduct: 'Hikvision 4 MP AcuSense Fixed Bullet IP Camera',
      mpn: 'DS-2CD2043G2-I'
    },
    {
      id: 'panel_board',
      icon: Cpu,
      title: t.panelBoardTitle,
      desc: t.panelBoardDesc,
      category: 'eee',
      linkedProduct: 'ABB Formula A1N 125 3P 100A MCCB',
      mpn: '1SDA066804R1'
    }
  ];

  const workSteps = [
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
  ];

  const featuredProjects = [
    {
      title: lang === 'bn' ? '৩১৫ কেভিএ ইন্ডাস্ট্রিয়াল সাবস্টেশন' : '315 kVA Industrial Substation & LT Panel',
      client: lang === 'bn' ? 'রাইস মিল ও এগ্রো প্রসেসিং প্ল্যান্ট, বরিশাল' : 'Agro Processing Facility, Barishal',
      specs: '11/0.415 kV Transformer, 630A LT Panel, 100 kVAR PFI'
    },
    {
      title: lang === 'bn' ? '৫০ কিলোওয়াট কমার্শিয়াল অন-গ্রিড সোলার' : '50 kW Commercial Rooftop Solar Plant',
      client: lang === 'bn' ? 'ম্যানুফ্যাকচারিং কমপ্লেক্স, বরিশাল বিভাগ' : 'Manufacturing Complex, Barishal Division',
      specs: 'Growatt Inverters, Tier-1 Mono Solar Modules, Net Metering'
    },
    {
      title: lang === 'bn' ? 'ইন্ডাস্ট্রিয়াল অ্যাকুসেন্স সিসিটিভি নেটওয়ার্ক' : 'Enterprise IP Surveillance Network (48 Cameras)',
      client: lang === 'bn' ? 'কোল্ড স্টোরেজ ও গুদামজাতকরণ ডিপো' : 'Cold Storage & Logistics Depot',
      specs: 'Hikvision 4K AcuSense IP Cameras, 32-Channel NVR, Fiber Backbone'
    },
    {
      title: lang === 'bn' ? 'বজ্রপাত সুরক্ষা ও কেমিক্যাল আর্থিং' : 'Lightning Protection & Chemical Grounding',
      client: lang === 'bn' ? 'বহুতল বাণিজ্যিক ভবন ও আইটি হাব' : 'Commercial High-Rise & Regional Data Hub',
      specs: 'ESE Arrester (60m Protection Radius), < 1 Ohm Earth Resistance'
    }
  ];

  return (
    <div className="space-y-16">
      {/* 1. Hero Section */}
      <section id="hero" className="bg-[#0F172A] text-white py-16 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.authSupply}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t.heroHeadline}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {t.heroSubheadline}
            </p>

            {/* Trust Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 max-w-xl">
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-400">7+</div>
                <div className="text-xs text-slate-400">{t.yearsExperience}</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">500+</div>
                <div className="text-xs text-slate-400">{t.projectsCompleted}</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#16A673]">24/7</div>
                <div className="text-xs text-slate-400">{t.emergencyResponse}</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreProducts}
                className="px-5 py-3 bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>{lang === 'bn' ? 'ইন্ডাস্ট্রিয়াল ক্যাটালগ দেখুন' : 'Explore Product Catalogue'}</span>
              </button>

              <button
                onClick={onRequestQuote}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold rounded-lg flex items-center gap-2 cursor-pointer transition-all"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? 'প্রজেক্ট কোটেশন অনুরোধ' : 'Request Project Quote'}</span>
              </button>

              <a
                href="https://wa.me/8801711197767"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-[#16A673] hover:bg-[#0F8A60] text-white text-xs sm:text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp (+8801711197767)</span>
              </a>
            </div>
          </div>

          {/* Quick Contact & Engineering Desk Card */}
          <div className="lg:col-span-4 bg-slate-800/90 border border-slate-700 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
              <Building2 className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-sm font-bold text-white">Dhruba Power Headquarters</div>
                <div className="text-xs text-slate-400">Barishal Central Engineering Hub</div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-400 shrink-0">Address:</span>
                <span>Khan Sarak, Kazipar, C&B Road, Barishal 8200, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-400 shrink-0">Hotline:</span>
                <a href="tel:+8801711197767" className="text-amber-400 font-bold hover:underline">
                  +880 1711-197767
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-400 shrink-0">Email:</span>
                <a href="mailto:info@dhrubapower.com" className="text-slate-300 hover:text-white">
                  info@dhrubapower.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-400 shrink-0">Warehouse:</span>
                <span className="text-emerald-400 font-semibold">Ready Stock (Barishal Central)</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-700 text-[11px] text-slate-300">
                <span className="font-bold text-white block mb-1">Turnkey Engineering Execution:</span>
                Substation equipment, solar power arrays, HT/LT panels, and lightning arresters supplied with installation & testing warranties.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Six Core Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
            {lang === 'bn' ? 'আমাদের বিশেষজ্ঞ সেবাসমূহ' : 'Core Engineering Disciplines'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {lang === 'bn' ? 'ধ্রুব পাওয়ারের ৬টি প্রধান ইঞ্জিনিয়ারিং সেবা' : 'Six Core Engineering Services'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === 'bn' 
              ? 'সাব-স্টেশন থেকে সোলার ও সিসিটিভি—শিল্প প্রতিষ্ঠানের বিদ্যুৎ ও সুরক্ষায় পূর্ণাঙ্গ কারিগরি সমাধান।'
              : 'Complete turnkey execution for industrial substations, commercial solar, switchgear, and safety.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <div 
                key={svc.id}
                className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-slate-100 group-hover:bg-[#0F172A] group-hover:text-white flex items-center justify-center text-slate-900 transition-colors mb-4">
                    <Icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {svc.desc}
                  </p>
                </div>

                {/* Product to Service Connection Banner */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">
                    {lang === 'bn' ? 'সংশ্লিষ্ট ক্যাটালগ ইকুইপমেন্ট:' : 'Supplied Equipment:'}
                  </div>
                  <button
                    onClick={() => {
                      onSelectCategory(svc.category);
                      onExploreProducts();
                    }}
                    className="text-xs font-bold text-[#D97706] hover:text-[#B45309] flex items-center gap-1 cursor-pointer text-left"
                  >
                    <span>{svc.linkedProduct}</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Product + Service Connection Callout */}
      <section className="bg-slate-50 border-y border-slate-200 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.productServiceConnectionTitle}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {lang === 'bn' 
                ? 'শুধু পণ্য বিক্রি নয়—ইঞ্জিনিয়ারিং ডিজাইন, সরবরাহ ও ইনস্টলেশনের পূর্ণ নিশ্চয়তা।'
                : 'Not Just Component Supply — Fully Integrated Engineering, Testing & Certification'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.productServiceConnectionDesc}
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={onRequestQuote}
              className="py-3 px-4 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>{lang === 'bn' ? 'বিওএম / টেন্ডার কোটেশন পাঠান' : 'Submit BOQ / Tender for Pricing'}</span>
            </button>
            <a
              href="tel:+8801711197767"
              className="py-3 px-4 bg-[#0F172A] hover:bg-[#172033] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{lang === 'bn' ? 'সরাসরি কথা বলুন: ০১৭১১-১৯৭৭৬৭' : 'Call Engineer: +880 1711-197767'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Engineering Work Process */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
            {t.workProcessTitle}
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {lang === 'bn' ? 'সাইট সার্ভে থেকে কমিশনিং পর্যন্ত আমাদের প্রক্রিয়া' : 'Systematic Turnkey Delivery Framework'}
          </h2>
          <p className="text-xs text-slate-600">
            {t.workProcessDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {workSteps.map((s, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-2xs relative"
            >
              <div className="text-2xl font-black text-slate-300 font-mono mb-2">
                {s.step}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1.5 leading-snug">
                  {s.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Projects Section */}
      <section id="projects" className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {lang === 'bn' ? 'সম্পন্ন প্রকল্পসমূহ' : 'Proven Track Record'}
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {lang === 'bn' ? 'সাম্প্রতিক শিল্প ও বাণিজ্যিক প্রজেক্ট' : 'Recent Engineering Projects & Installations'}
          </h2>
          <p className="text-xs text-slate-600">
            {lang === 'bn' ? 'বরিশাল ও দেশব্যাপী সফলভাবে সরবরাহকৃত সুইচগিয়ার ও বিদ্যুৎ অবকাঠামো।' : 'Engineered substations, solar plants, and CCTV architectures across Bangladesh.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProjects.map((p, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3"
            >
              <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-700">
                <Building2 className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                  {p.title}
                </h4>
                <div className="text-xs text-slate-500 font-medium mb-2">
                  {p.client}
                </div>
                <div className="text-[11px] font-mono text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                  {p.specs}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Technical Experts & Consultation Section */}
      <section id="experts" className="bg-[#0F172A] text-white py-12 px-4 rounded-2xl max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-slate-800 text-amber-400 text-xs px-3 py-1 rounded-full font-semibold border border-slate-700">
              <HardHat className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'অভিজ্ঞ প্রকৌশলী দলের পরামর্শ' : 'Licensed Electrical Engineering Team'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              {lang === 'bn' 
                ? 'আপনার কারখানার সাবস্টেশন বা সোলার প্রজেক্টে বিশেষজ্ঞ মতামত প্রয়োজন?' 
                : 'Need a Professional Engineering Review for Your Facility?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'bn'
                ? 'আমাদের প্রধান প্রকৌশলী এবং টেকনিক্যাল কনসালট্যান্টরা আপনার বিওএম, লোড শিডিউল ও সিঙ্গেল লাইন ডায়াগ্রাম পর্যালোচনা করে সেরা সমাধান নিশ্চিত করবেন।'
                : 'Speak directly with our senior power engineers in Barishal for load audits, switchgear breaker calculations, and solar feasibility analysis.'}
            </p>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <a
              href="tel:+8801711197767"
              className="w-full py-3 px-4 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call Helpline: +880 1711-197767</span>
            </a>
            <a
              href="https://wa.me/8801711197767"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#16A673] hover:bg-[#0F8A60] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Engineering Consultation</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
