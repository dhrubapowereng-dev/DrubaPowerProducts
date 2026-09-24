import React from 'react';
import { 
  Building2, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Zap, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface AboutPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
  onRequestQuote: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  lang,
  onNavigate,
  onRequestQuote
}) => {
  const t = TRANSLATIONS[lang];

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
            {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-[#0F172A] text-white py-16 px-4 border-y border-slate-800 relative overflow-hidden mb-12">
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold text-[#F59E0B]">
              <ShieldCheck className="w-4 h-4 text-[#16A673]" />
              <span>Dhruba Power &amp; Engineering</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {lang === 'bn'
                ? 'নির্ভরযোগ্য বিদ্যুৎ পরিকাঠামো নির্মাণে দক্ষিণাঞ্চলের শীর্ষ প্রকৌশল প্রতিষ্ঠান'
                : 'Building Resilient Electrical & Solar Infrastructure Across Bangladesh'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {lang === 'bn'
                ? 'বরিশাল সদর থেকে দেশজুড়ে শিল্প কারখানা, বাণিজ্যিক ভবন ও আবাসিক প্রকল্পের সাবস্টেশন, সোলার পিভি, বজ্রপাত সুরক্ষা ও সুইচগিয়ার ইঞ্জিনিয়ারিং সেবায় বিশ্বস্ত নাম।'
                : 'Headquartered in Barishal, Dhruba Power & Engineering specializes in turnkey industrial substations, high-efficiency solar plants, lightning protection, and authorized switchgear supply with uncompromising safety.'}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onRequestQuote}
                className="px-6 py-3 bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>{lang === 'bn' ? 'প্রজেক্ট কোটেশন চান?' : 'Request Engineering Quote'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/8801711197767?text=Hello%20Dhruba%20Power%2C%20I%20am%20inquiring%20about%20your%20company%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-[#16A673] hover:bg-[#0F8A60] text-white text-xs sm:text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp (+880 1711-197767)</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-700 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F59E0B]" />
              <span>Proven Track Record</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <div className="text-2xl font-black text-[#F59E0B]">7+</div>
                <div className="text-[11px] text-slate-400 mt-1">{t.yearsExperience}</div>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <div className="text-2xl font-black text-white">500+</div>
                <div className="text-[11px] text-slate-400 mt-1">{t.projectsCompleted}</div>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <div className="text-2xl font-black text-[#16A673]">24/7</div>
                <div className="text-[11px] text-slate-400 mt-1">{t.emergencyResponse}</div>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <div className="text-2xl font-black text-blue-400">100%</div>
                <div className="text-[11px] text-slate-400 mt-1">BNBC &amp; IEC Compliance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Details */}
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Company Overview & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
              {lang === 'bn' ? 'আমাদের ইতিহাস ও লক্ষ্য' : 'Our Story & Purpose'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
              {lang === 'bn' 
                ? 'দক্ষিণবঙ্গের বিদ্যুৎ পরিকাঠামোয় আন্তর্জাতিক মান আনয়ন' 
                : 'Elevating Power Engineering Standards in Southern Bangladesh'}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Founded in Barishal, Dhruba Power &amp; Engineering emerged to fill a critical gap: providing industrial facilities, factories, hospitals, and real-estate developers with tier-1 engineering expertise locally, eliminating the need to outsource critical power design and switchgear manufacturing to distant metropolitan vendors.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Today, our licensed electrical engineers oversee full-cycle substation commissioning, 11kV/0.415kV step-down transformer installations, high-voltage vacuum circuit breakers (VCB), commercial solar microgrids with net-metering, NFC 17-102 compliant ESE lightning arresters, and custom LT switchboards.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A673] shrink-0" />
                <span>Licensed Electrical Engineers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A673] shrink-0" />
                <span>Authorized OEM Distribution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A673] shrink-0" />
                <span>Barishal Central Warehouse Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A673] shrink-0" />
                <span>Full Regulatory Approvals Liaison</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80" 
              alt="Dhruba Power Engineering Workshop" 
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <div className="text-white space-y-1">
                <span className="text-xs font-bold text-[#F59E0B] uppercase">Local Commitment, Global Quality</span>
                <h4 className="text-lg font-bold">Khan Sarak, Kazipar, C&amp;B Road, Barishal</h4>
                <p className="text-xs text-slate-300">Central Engineering Workshop &amp; Distribution Warehouse</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
              {lang === 'bn' ? 'আমাদের মূলনীতি' : 'Core Engineering Pillars'}
            </div>
            <h2 className="text-2xl font-extrabold text-[#0F172A]">
              {lang === 'bn' ? 'কেন গ্রাহকরা ধ্রুব পাওয়ারের ওপর আস্থা রাখেন' : 'Why Industrial Clients Rely on Dhruba Power'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">
                {lang === 'bn' ? '১০০% আসল ওরিজিনাল পার্টস' : 'Genuine OEM Equipment'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct distribution links with ABB, Schneider Electric, Siemens, Growatt, and Hikvision ensure all switchgear carries factory test reports and genuine warranties.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#16A673] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">
                {lang === 'bn' ? '২৪/৭ ইমার্জেন্সি সাপোর্ট' : '24/7 Field Rapid Response'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rapid emergency dispatch across Barishal Division and surrounding industrial belts minimizes downtime during unexpected transformer trips or plant outages.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">
                {lang === 'bn' ? 'টার্নকি এক্সিকিউশন' : 'Turnkey Commissioning'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                From Single-Line Diagrams (SLD) and load calculations to civil foundation, cable laying, and government utility authorization, we deliver complete solutions.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">
                {lang === 'bn' ? 'সার্টিফাইড প্রকৌশলী দল' : 'Registered Engineering Team'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our engineers hold IEB credentials, Chief Electrical Inspectorate licenses, and specialized manufacturer certifications in solar and surveillance.
              </p>
            </div>
          </div>
        </div>

        {/* Office & Facility Contact Block */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#0F172A] font-bold text-sm">
                <MapPin className="w-4 h-4 text-[#D97706]" />
                <span>Headquarters &amp; Warehouse</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Khan Sarak, Kazipar, C&amp;B Road,<br />
                Barishal 8200, Bangladesh
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#0F172A] font-bold text-sm">
                <Phone className="w-4 h-4 text-[#D97706]" />
                <span>Phone &amp; Hotline</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct Hotline: <a href="tel:+8801711197767" className="font-bold text-[#0F172A] hover:underline">+880 1711-197767</a><br />
                24/7 Field Dispatch Service
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#0F172A] font-bold text-sm">
                <Mail className="w-4 h-4 text-[#D97706]" />
                <span>Official Inquiries</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Email: <a href="mailto:info@dhrubapower.com" className="font-bold text-[#0F172A] hover:underline">info@dhrubapower.com</a><br />
                Tender BOQs: <a href="mailto:rfq@dhrubapower.com" className="font-bold text-[#D97706] hover:underline">rfq@dhrubapower.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
