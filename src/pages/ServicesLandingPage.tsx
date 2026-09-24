import React from 'react';
import { 
  Activity, 
  Sun, 
  Zap, 
  Wrench, 
  Camera, 
  Cpu, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { SERVICES_DATA } from '../data/servicesData';

interface ServicesLandingPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
  onRequestQuote: () => void;
}

export const ServicesLandingPage: React.FC<ServicesLandingPageProps> = ({
  lang,
  onNavigate,
  onRequestQuote
}) => {
  const t = TRANSLATIONS[lang];

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
            {lang === 'bn' ? 'আমাদের ইঞ্জিনিয়ারিং সেবাসমূহ' : 'Turnkey Engineering Services'}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-[#0F172A] text-white py-14 px-4 border-y border-slate-800 mb-12">
        <div className="max-w-7xl mx-auto text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold text-[#F59E0B]">
            <ShieldCheck className="w-4 h-4 text-[#16A673]" />
            <span>Industrial &amp; Commercial Solutions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {lang === 'bn' 
              ? 'ধ্রুব পাওয়ারের ৬টি প্রধান টার্নকি ইঞ্জিনিয়ারিং সেবা' 
              : 'Six Core Engineering Disciplines for Heavy Industrial Power'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {lang === 'bn'
              ? 'ডিজাইন, সিঙ্গেল-লাইন ডায়াগ্রাম (SLD), লোড শিডিউল ক্যালকুলেশন, যন্ত্রপাতি সরবরাহ, স্থাপন, টেস্টিং এবং সরকারি বিদ্যুৎ বোর্ডের পূর্ণাঙ্গ অনুমোদন।'
              : 'End-to-end design, load calculations, supply of certified switchgear, civil erection, high-voltage testing, and official regulatory clearances across Bangladesh.'}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={onRequestQuote}
              className="px-5 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>{lang === 'bn' ? 'প্রজেক্ট কোটেশন পাঠান' : 'Submit Project BOQ for Quote'}</span>
            </button>
            <a
              href="https://wa.me/8801711197767?text=Hello%20Dhruba%20Power%2C%20I%20am%20inquiring%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#16A673] hover:bg-[#0F8A60] text-white text-xs sm:text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Inquiries</span>
            </a>
          </div>
        </div>
      </section>

      {/* The 6 Core Services Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_DATA.map((service, idx) => {
            const Icon = getServiceIcon(service.id);
            const serviceUrl = `/services/${service.slug}/`;

            return (
              <div
                key={service.id}
                className="bg-white border border-slate-200 hover:border-slate-400 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Service Photo Header */}
                  <div className="h-48 w-full overflow-hidden relative bg-slate-100">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-[#0F172A] text-[#F59E0B] flex items-center justify-center border border-slate-700 shadow-xs">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                          Service 0{idx + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-[#0F172A] leading-snug group-hover:text-[#D97706] transition-colors">
                      <button 
                        onClick={() => onNavigate(serviceUrl)}
                        className="text-left hover:underline cursor-pointer"
                      >
                        {lang === 'bn' ? service.titleBn : service.title}
                      </button>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {lang === 'bn' ? service.shortDescBn : service.shortDesc}
                    </p>

                    {/* Key Scope Preview */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        {lang === 'bn' ? 'কার্যপরিধি:' : 'Scope Preview:'}
                      </div>
                      {service.scopeOfWork.slice(0, 2).map((item, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A673] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onNavigate(serviceUrl)}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-[#0F172A] text-slate-800 hover:text-white border border-slate-300 hover:border-[#0F172A] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>{lang === 'bn' ? 'বিস্তারিত সেবা দেখুন' : 'View Full Service Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
