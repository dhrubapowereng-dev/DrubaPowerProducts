import React from 'react';
import { 
  Users, 
  MessageSquare, 
  ArrowRight, 
  ChevronRight, 
  Award, 
  ShieldCheck, 
  Phone,
  Briefcase,
  Mail,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { ExpertItem } from '../types/catalog';

interface ExpertDetailPageProps {
  expert: ExpertItem;
  lang: Language;
  onNavigate: (path: string) => void;
  onRequestQuote: () => void;
}

export const ExpertDetailPage: React.FC<ExpertDetailPageProps> = ({
  expert,
  lang,
  onNavigate,
  onRequestQuote
}) => {
  const t = TRANSLATIONS[lang];
  const cleanPhone = expert.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${expert.name}, I am contacting you through your Dhruba Power profile regarding ${expert.department}.`
  )}`;

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
            onClick={() => onNavigate('/experts/')} 
            className="hover:text-slate-900 transition-colors"
          >
            {lang === 'bn' ? 'বিশেষজ্ঞ প্রকৌশলীগণ' : 'Experts'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-[#0F172A]">
            {expert.name}
          </span>
        </div>
      </div>

      {/* Main Profile Header */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Photograph & Badges */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 aspect-square max-w-sm mx-auto lg:max-w-none">
                <img 
                  src={expert.photograph} 
                  alt={expert.name} 
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
                <div className="text-xs font-bold text-emerald-900 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#16A673]" />
                  <span>Verified Direct WhatsApp Line</span>
                </div>
                <div className="font-mono font-bold text-sm text-[#0F8A60]">
                  {expert.whatsappNumber}
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#16A673] hover:bg-[#0F8A60] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Right Column: Bio & Credentials */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-bold mb-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{expert.department}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A]">
                  {expert.name}
                </h1>
                <div className="text-sm font-bold text-[#D97706] mt-1">
                  {expert.designation}
                </div>
              </div>

              {/* About & Bio */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Professional Engineering Overview
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {expert.shortBio}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Oversees field testing, single-line diagram approvals, load optimization, and regulatory compliance directly with BPDB, BREB, and local electrical authorities across Barishal Division.
                </p>
              </div>

              {/* Key Credentials / Certifications */}
              {expert.certifications && expert.certifications.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Certifications &amp; Accreditations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {expert.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                        <Award className="w-4 h-4 text-[#D97706] shrink-0" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
                <button
                  onClick={onRequestQuote}
                  className="px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>Request Site Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('/services/')}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Explore Related Engineering Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
