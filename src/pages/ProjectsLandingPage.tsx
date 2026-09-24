import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { PROJECTS_DATA, ProjectDetail } from '../data/projectsData';

interface ProjectsLandingPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
  onRequestQuote: () => void;
}

export const ProjectsLandingPage: React.FC<ProjectsLandingPageProps> = ({
  lang,
  onNavigate,
  onRequestQuote
}) => {
  const t = TRANSLATIONS[lang];
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'completed'>('all');

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

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
            {lang === 'bn' ? 'প্রকল্পসমূহ' : 'Engineering Projects'}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-[#0F172A] text-white py-14 px-4 border-y border-slate-800 mb-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold text-[#F59E0B]">
              <Building2 className="w-4 h-4 text-[#16A673]" />
              <span>500+ Projects Completed &amp; Commissioned</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {lang === 'bn' ? 'আমাদের সম্পন্ন এবং চলমান প্রকৌশল প্রকল্পসমূহ' : 'Industrial Power, Solar & Substation Projects'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {lang === 'bn'
                ? 'বরিশাল ও দেশজুড়ে সফলভাবে বাস্তবায়িত সাবস্টেশন, হাইব্রিড সোলার সিস্টেম, বজ্রপাত প্রতিরোধ ও কারখানা ওয়্যারিং প্রকল্প।'
                : 'Engineered solutions delivered with strict adherence to BNBC building codes, utility authorization, and authorized switchgear components.'}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onRequestQuote}
              className="px-5 py-3 bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>{lang === 'bn' ? 'প্রজেক্ট আলোচনা করুন' : 'Discuss Your Project'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                filter === 'all' 
                  ? 'bg-[#0F172A] text-white shadow-xs' 
                  : 'hover:bg-white hover:text-slate-900 text-slate-600'
              }`}
            >
              All Projects ({PROJECTS_DATA.length})
            </button>
            <button
              onClick={() => setFilter('ongoing')}
              className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                filter === 'ongoing' 
                  ? 'bg-[#0F172A] text-white shadow-xs' 
                  : 'hover:bg-white hover:text-slate-900 text-slate-600'
              }`}
            >
              {lang === 'bn' ? 'চলমান' : 'Ongoing Execution'} ({PROJECTS_DATA.filter(p => p.status === 'ongoing').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                filter === 'completed' 
                  ? 'bg-[#0F172A] text-white shadow-xs' 
                  : 'hover:bg-white hover:text-slate-900 text-slate-600'
              }`}
            >
              {lang === 'bn' ? 'সম্পন্ন' : 'Completed Work'} ({PROJECTS_DATA.filter(p => p.status === 'completed').length})
            </button>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Showing {filteredProjects.length} Verified Installations
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => {
            const projectUrl = `/projects/${proj.slug}/`;

            return (
              <div 
                key={proj.id}
                className="bg-white border border-slate-200 hover:border-slate-400 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Header */}
                  <div className="h-52 w-full overflow-hidden relative bg-slate-100">
                    <img 
                      src={proj.image} 
                      alt={proj.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
                        proj.status === 'completed' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-[#D97706] text-white'
                      }`}>
                        {lang === 'bn' ? proj.statusLabelBn : proj.statusLabel}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
                      {proj.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{lang === 'bn' ? proj.locationBn : proj.location}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#0F172A] leading-snug group-hover:text-[#D97706] transition-colors">
                      <button
                        onClick={() => onNavigate(projectUrl)}
                        className="text-left hover:underline cursor-pointer"
                      >
                        {lang === 'bn' ? proj.titleBn : proj.title}
                      </button>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {lang === 'bn' ? proj.scopeBn : proj.scope}
                    </p>

                    {/* Progress Bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                        <span>Milestone Progress</span>
                        <span className="font-mono font-bold text-slate-900">{proj.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            proj.status === 'completed' ? 'bg-[#16A673]' : 'bg-[#D97706]'
                          }`}
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onNavigate(projectUrl)}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-[#0F172A] text-slate-800 hover:text-white border border-slate-300 hover:border-[#0F172A] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>{lang === 'bn' ? 'প্রজেক্টের বিবরণ দেখুন' : 'View Project Case Study'}</span>
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
