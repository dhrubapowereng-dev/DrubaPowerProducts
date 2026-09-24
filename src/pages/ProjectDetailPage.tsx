import React from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2,
  ShieldCheck,
  Award,
  Layers,
  FileText,
  MessageSquare,
  Wrench
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { ProjectDetail } from '../data/projectsData';

interface ProjectDetailPageProps {
  project: ProjectDetail;
  lang: Language;
  onNavigate: (path: string) => void;
  onRequestQuote: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  lang,
  onNavigate,
  onRequestQuote
}) => {
  const t = TRANSLATIONS[lang];
  const whatsappUrl = `https://wa.me/8801711197767?text=${encodeURIComponent(`Hello Dhruba Power Engineering Desk, I reviewed the project "${project.title}" and would like to consult on a similar installation for our facility.`)}`;

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
            onClick={() => onNavigate('/projects/')} 
            className="hover:text-slate-900 transition-colors"
          >
            {lang === 'bn' ? 'প্রকল্পসমূহ' : 'Projects'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-[#0F172A]">
            {lang === 'bn' ? project.titleBn : project.title}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-[#0F172A] text-white py-12 px-4 border-y border-slate-800 mb-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                project.status === 'completed' ? 'bg-[#16A673] text-white' : 'bg-[#D97706] text-white'
              }`}>
                {lang === 'bn' ? project.statusLabelBn : project.statusLabel}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700">
                {project.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#D97706]" />
                <span>{lang === 'bn' ? project.locationBn : project.location}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {lang === 'bn' ? project.titleBn : project.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {lang === 'bn' ? project.overviewBn : project.overview}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onRequestQuote}
                className="px-6 py-3 bg-[#D97706] hover:bg-[#B45309] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <FileText className="w-4 h-4" />
                <span>{lang === 'bn' ? 'অনুরূপ প্রজেক্টের জন্য কোটেশন নিন' : 'Inquire for Similar Project'}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-[#16A673] hover:bg-[#0F8A60] text-white text-xs sm:text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Consult Lead Project Engineer</span>
              </a>
            </div>
          </div>

          {/* Quick Project Spec Card */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-52 object-cover"
            />
            <div className="p-5 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Client / Facility:</span>
                <span className="font-bold text-white text-right">{project.clientType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Capacity / Rating:</span>
                <span className="font-bold text-amber-400 text-right font-mono">{project.capacityOrRating}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Timeline / Date:</span>
                <span className="font-bold text-white text-right">{project.completionDate}</span>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                  <span>Execution Milestone:</span>
                  <span className="font-mono font-bold text-[#16A673]">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${project.status === 'completed' ? 'bg-[#16A673]' : 'bg-[#D97706]'}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 space-y-12 mb-16">
        
        {/* Technical Highlights Grid */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#16A673] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">
                {lang === 'bn' ? 'প্রকৌশল বৈশিষ্ট্য ও বাস্তবায়ন বিবরণ' : 'Key Engineering Highlights & Execution Standards'}
              </h2>
              <p className="text-xs text-slate-500">
                Detailed compliance methods implemented by Dhruba Power technicians on-site
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {project.technicalHighlights.map((highlight, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70"
              >
                <span className="w-6 h-6 rounded-full bg-[#0F172A] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                  {idx + 1}
                </span>
                <span className="text-xs text-slate-800 leading-relaxed font-medium">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Installed & Challenges Overcome */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Equipment Installed */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-[#D97706]" />
              <h3 className="text-base font-extrabold text-[#0F172A]">
                {lang === 'bn' ? 'স্থাপিত প্রধান সরঞ্জাম ও সুইচগিয়ার' : 'Switchgear & Components Installed'}
              </h3>
            </div>
            <div className="space-y-2">
              {project.equipmentInstalled.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <ShieldCheck className="w-4 h-4 text-[#16A673] shrink-0" />
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Challenge Resolved */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="w-5 h-5 text-[#D97706]" />
                <h3 className="text-base font-extrabold text-[#0F172A]">
                  {lang === 'bn' ? 'সমাধানকৃত প্রধান চ্যালেঞ্জ' : 'Engineering Challenge Resolved'}
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-slate-800">
                {project.challengesResolved}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Have a similar facility challenge?</span>
              <button
                onClick={onRequestQuote}
                className="font-bold text-[#D97706] hover:underline cursor-pointer"
              >
                Upload BOQ / Schematics →
              </button>
            </div>
          </div>
        </div>

        {/* Gallery / On-Site Photos */}
        {project.galleryImages.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0F172A]">
              {lang === 'bn' ? 'প্রজেক্টের সাইট ফটো গ্যালারি' : 'Project Site Visual Records'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.galleryImages.map((img, idx) => (
                <div key={idx} className="h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img 
                    src={img} 
                    alt={`${project.title} Photo ${idx + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
