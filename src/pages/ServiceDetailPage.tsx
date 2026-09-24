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
  MessageSquare,
  Clock,
  Layers,
  Award,
  Phone
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { ServiceDetail } from '../data/servicesData';

interface ServiceDetailPageProps {
  service: ServiceDetail;
  lang: Language;
  onNavigate: (path: string) => void;
  onRequestQuote: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  service,
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

  const Icon = getServiceIcon(service.id);
  const whatsappUrl = `https://wa.me/8801711197767?text=${encodeURIComponent(`Hello Dhruba Power Engineering Team, I want to inquire about "${service.title}" for our project.`)}`;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <button 
            onClick={() => onNavigate('/')} 
            className="hover:text-slate-900 transition-colors"
          >
            {t.home}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button 
            onClick={() => onNavigate('/services/')} 
            className="hover:text-slate-900 transition-colors"
          >
            {lang === 'bn' ? 'সেবাসমূহ' : 'Services'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-[#0F172A]">
            {lang === 'bn' ? service.titleBn : service.title}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-[#0F172A] text-white py-12 px-4 border-y border-slate-800 mb-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold text-[#F59E0B]">
              <Icon className="w-4 h-4 text-[#F59E0B]" />
              <span>Turnkey Industrial Engineering Discipline</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {lang === 'bn' ? service.titleBn : service.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {lang === 'bn' ? service.fullDescBn : service.fullDesc}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onRequestQuote}
                className="px-6 py-3 bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <FileText className="w-4 h-4" />
                <span>{lang === 'bn' ? 'এই সেবার জন্য কোটেশন নিন' : 'Request Quote for this Service'}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-[#16A673] hover:bg-[#0F8A60] text-white text-xs sm:text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Direct WhatsApp Consultation</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-xl overflow-hidden border border-slate-700 shadow-xl bg-slate-900">
            <img 
              src={service.image} 
              alt={service.title} 
              className="w-full h-64 object-cover"
            />
            <div className="p-4 space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Execution Speed:</span>
                <span className="font-bold text-white font-mono">{service.turnaroundTime}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Standard Warranty:</span>
                <span className="font-bold text-[#16A673]">{service.warrantyTerms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Location Availability:</span>
                <span className="font-bold text-white">Barishal &amp; Nationwide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 space-y-12 mb-16">
        
        {/* Scope of Work Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">
                {lang === 'bn' ? 'কার্যপরিধি ও প্রকৌশল প্রক্রিয়া' : 'Comprehensive Scope of Work & Deliverables'}
              </h2>
              <p className="text-xs text-slate-500">
                Turnkey execution adhering strictly to Bangladesh National Building Code (BNBC) &amp; IEC guidelines
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(lang === 'bn' ? service.scopeOfWorkBn : service.scopeOfWork).map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-[#0F172A] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                  {idx + 1}
                </span>
                <span className="text-xs text-slate-800 leading-relaxed font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment & Switchgear Supplied */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0F172A]">
                  {lang === 'bn' ? 'সরবরাহকৃত প্রধান যন্ত্রপাতি ও সুইচগিয়ার' : 'Primary Equipment & Switchgear Deployed'}
                </h2>
                <p className="text-xs text-slate-500">
                  Direct authorized supply with manufacturer test certificates and local Barishal warehouse stock
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/shop/')}
              className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Full Equipment Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.equipmentSupplied.map((eq, idx) => (
              <div 
                key={idx}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                    <span className="text-[#0F172A] uppercase">{eq.brand}</span>
                    <span className="font-mono text-slate-400">MPN: {eq.mpn}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {eq.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                    {eq.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                    OEM Warranty Backed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Standards & Related Case Studies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Technical Compliance */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D97706]" />
              <span>International Engineering Standards Complied</span>
            </h3>
            <div className="space-y-2">
              {service.technicalStandards.map((std, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-[#16A673] shrink-0" />
                  <span className="font-medium font-mono">{std}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Project Showcase */}
          {service.relatedProjectSlug && (
            <div className="bg-gradient-to-br from-[#0F172A] to-[#172033] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#F59E0B] font-bold">
                  Demonstrated Implementation
                </span>
                <h3 className="text-lg font-bold">
                  {service.relatedProjectName}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  See how Dhruba Power engineered and commissioned this exact solution under live facility requirements in Barishal.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => onNavigate(`/projects/${service.relatedProjectSlug}/`)}
                  className="px-4 py-2 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View Project Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
