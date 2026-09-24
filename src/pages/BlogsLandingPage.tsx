import React from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  User, 
  Tag 
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { BLOGS_DATA, BlogPost } from '../data/blogsData';

interface BlogsLandingPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

export const BlogsLandingPage: React.FC<BlogsLandingPageProps> = ({
  lang,
  onNavigate
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
            {lang === 'bn' ? 'ব্লগ ও প্রযুক্তিগত নির্দেশিকা' : 'Engineering Knowledge & Articles'}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-[#0F172A] text-white py-14 px-4 border-y border-slate-800 mb-10">
        <div className="max-w-7xl mx-auto text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold text-[#F59E0B]">
            <FileText className="w-4 h-4 text-[#16A673]" />
            <span>Industrial Insights &amp; Guides</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {lang === 'bn' ? 'ইলেকট্রিক্যাল, সোলার ও সাবস্টেশন প্রকৌশল ব্লগ' : 'Power Engineering, Solar Regulations & Switchgear Insights'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Technical guides, BNBC code breakdowns, transformer safety protocols, and solar net-metering economics authored by Dhruba Power engineers.
          </p>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOGS_DATA.map((blog) => {
            const blogUrl = `/blog/${blog.slug}/`;

            return (
              <div 
                key={blog.id}
                className="bg-white border border-slate-200 hover:border-slate-400 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-56 w-full overflow-hidden relative bg-slate-100">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
                      {blog.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{blog.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{blog.readTime}</span>
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[#0F172A] leading-snug group-hover:text-[#D97706] transition-colors">
                      <button
                        onClick={() => onNavigate(blogUrl)}
                        className="text-left hover:underline cursor-pointer"
                      >
                        {lang === 'bn' ? blog.titleBn : blog.title}
                      </button>
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {lang === 'bn' ? blog.excerptBn : blog.excerpt}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-xs text-slate-700">
                      <User className="w-3.5 h-3.5 text-[#D97706]" />
                      <span className="font-semibold">{blog.author}</span>
                      <span className="text-slate-400 text-[11px]">({blog.authorRole})</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => onNavigate(blogUrl)}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-[#0F172A] text-slate-800 hover:text-white border border-slate-300 hover:border-[#0F172A] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>{lang === 'bn' ? 'সম্পূর্ণ আর্টিকেল পড়ুন' : 'Read Full Engineering Article'}</span>
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
