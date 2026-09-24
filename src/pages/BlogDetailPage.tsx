import React from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  User, 
  Tag,
  Share2,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { BlogPost } from '../data/blogsData';

interface BlogDetailPageProps {
  blog: BlogPost;
  lang: Language;
  onNavigate: (path: string) => void;
  onRequestQuote: () => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  blog,
  lang,
  onNavigate,
  onRequestQuote
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      {/* Breadcrumb Header */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <button 
            onClick={() => onNavigate('/')} 
            className="hover:text-slate-900 transition-colors"
          >
            {t.home}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button 
            onClick={() => onNavigate('/blogs/')} 
            className="hover:text-slate-900 transition-colors"
          >
            {lang === 'bn' ? 'ব্লগ' : 'Blog'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-[#0F172A] truncate max-w-xs">
            {lang === 'bn' ? blog.titleBn : blog.title}
          </span>
        </div>
      </div>

      {/* Article Header & Main Content */}
      <article className="max-w-4xl mx-auto px-4 mb-16 space-y-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-[#0F172A] text-white font-bold px-2.5 py-0.5 rounded">
                {blog.category}
              </span>
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{blog.date}</span>
              </span>
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{blog.readTime}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] leading-tight">
              {lang === 'bn' ? blog.titleBn : blog.title}
            </h1>

            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{blog.author}</div>
                <div className="text-xs text-[#D97706] font-medium">{blog.authorRole}</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-80 object-cover"
            />
          </div>

          {/* Article Body */}
          <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed pt-4 border-t border-slate-100">
            {(lang === 'bn' ? blog.contentBn : blog.content).map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Tags:</span>
            </span>
            {blog.tags.map((tag, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Technical Consultation CTA Card */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#172033] text-white rounded-3xl p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Have Questions About This Engineering Topic?</h3>
            <p className="text-xs text-slate-300 max-w-md">
              Speak directly with our senior power engineers in Barishal for load audits, switchgear sizing, and solar feasibility.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href={`https://wa.me/8801711197767?text=${encodeURIComponent(`Hello Dhruba Power, I read the article "${blog.title}" and would like to ask a technical question.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#16A673] hover:bg-[#0F8A60] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask via WhatsApp</span>
            </a>
            <button
              onClick={onRequestQuote}
              className="px-4 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Request Quote
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};
