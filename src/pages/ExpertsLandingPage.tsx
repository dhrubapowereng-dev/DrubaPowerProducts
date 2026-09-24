import React from 'react';
import { 
  Users, 
  MessageSquare, 
  ArrowRight, 
  ChevronRight, 
  Award, 
  ShieldCheck, 
  Phone,
  Briefcase
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { ExpertItem } from '../types/catalog';

interface ExpertsLandingPageProps {
  experts: ExpertItem[];
  lang: Language;
  onNavigate: (path: string) => void;
  onRequestQuote: () => void;
}

export const ExpertsLandingPage: React.FC<ExpertsLandingPageProps> = ({
  experts,
  lang,
  onNavigate,
  onRequestQuote
}) => {
  const t = TRANSLATIONS[lang];

  const activeExperts = experts
    .filter((e) => e.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

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
            {lang === 'bn' ? 'বিশেষজ্ঞ প্রকৌশলীগণ' : 'Engineering Experts'}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-[#0F172A] text-white py-14 px-4 border-y border-slate-800 mb-10">
        <div className="max-w-7xl mx-auto text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold text-[#F59E0B]">
            <ShieldCheck className="w-4 h-4 text-[#16A673]" />
            <span>Licensed Power &amp; Industrial Specialists</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {lang === 'bn' ? 'সরাসরি পরামর্শের জন্য আমাদের প্রকৌশলী দল' : 'Certified Engineers Available for Technical Consultation'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {lang === 'bn'
              ? 'সাবস্টেশন, সোলার পিভি, বজ্রপাত সুরক্ষা ও সিসিটিভি বিষয়ে প্রতিটি বিশেষজ্ঞের সাথে সরাসরি প্রোফাইল দেখে বা নিজস্ব হোয়াটসঅ্যাপে যোগাযোগ করুন।'
              : 'Every engineer at Dhruba Power manages dedicated industrial disciplines. Connect directly via their verified WhatsApp line or schedule an on-site site survey.'}
          </p>
        </div>
      </section>

      {/* Experts Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeExperts.map((exp) => {
            const cleanPhone = exp.whatsappNumber.replace(/[^0-9]/g, '');
            const expertSlug = exp.slug || exp.id;
            const profileUrl = `/experts/${expertSlug}/`;
            const whatsappText = encodeURIComponent(
              `Hello ${exp.name}, I found your profile on Dhruba Power website and would like to consult on ${exp.department}.`
            );

            return (
              <div 
                key={exp.id}
                className="bg-white border border-slate-200 hover:border-slate-400 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with Badge */}
                  <div className="h-56 w-full bg-slate-100 overflow-hidden relative">
                    <img 
                      src={exp.photograph} 
                      alt={exp.name} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 left-2 bg-[#0F172A]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                      {exp.department}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-extrabold text-[#0F172A] leading-snug group-hover:text-[#D97706] transition-colors">
                      <button
                        onClick={() => onNavigate(profileUrl)}
                        className="text-left hover:underline cursor-pointer"
                      >
                        {exp.name}
                      </button>
                    </h3>

                    <div className="text-xs font-bold text-[#D97706]">
                      {exp.designation}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {exp.shortBio}
                    </p>
                  </div>
                </div>

                {/* 2 Working Action Buttons: View Profile + WhatsApp */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={() => onNavigate(profileUrl)}
                    className="w-full py-2 bg-slate-100 hover:bg-[#0F172A] text-slate-800 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`https://wa.me/${cleanPhone}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-white hover:bg-emerald-50 text-[#16A673] border border-[#16A673]/40 hover:border-[#16A673] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp ({exp.whatsappNumber})</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
