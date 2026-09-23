import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface PublicFooterProps {
  lang: Language;
  onSelectCategory: (cat: string) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  lang,
  onSelectCategory,
  onNavigateSection
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="bg-[#0F172A] text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Company Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-white text-base">
                DP
              </div>
              <span className="font-extrabold text-white text-sm tracking-tight">
                {t.companyName}
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              {t.companyTagline}
            </p>

            <div className="space-y-2 text-slate-300 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{t.barishalAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="tel:+8801711197767" className="hover:text-white font-semibold">
                  +880 1711-197767
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="mailto:info@dhrubapower.com" className="hover:text-white">
                  info@dhrubapower.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#16A673] shrink-0" />
                <a href="https://wa.me/8801711197767" target="_blank" rel="noopener noreferrer" className="text-[#16A673] hover:underline font-semibold">
                  WhatsApp: +880 1711-197767
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Core Engineering Services */}
          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              {lang === 'bn' ? 'প্রধান ইঞ্জিনিয়ারিং সেবাসমূহ' : 'Turnkey Services'}
            </div>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button 
                  onClick={() => onNavigateSection && onNavigateSection('services')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  1. {t.substationTitle}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection && onNavigateSection('services')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  2. {t.solarSystemTitle}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection && onNavigateSection('services')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  3. {t.lightningTitle}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection && onNavigateSection('services')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  4. {t.wiringTitle}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection && onNavigateSection('services')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  5. {t.cctvInstallTitle}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection && onNavigateSection('services')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  6. {t.panelBoardTitle}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Industrial Product Divisions */}
          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              {lang === 'bn' ? 'পণ্য বিভাগসমূহ' : 'Product Categories'}
            </div>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button 
                  onClick={() => {
                    onSelectCategory('eee');
                    onNavigateSection && onNavigateSection('catalogue');
                  }}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Miniature Circuit Breakers (MCB 1P-4P)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onSelectCategory('eee');
                    onNavigateSection && onNavigateSection('catalogue');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Moulded Case Circuit Breakers (MCCB 16A-1600A)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onSelectCategory('eee');
                    onNavigateSection && onNavigateSection('catalogue');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Distribution Transformers & Substation Gear
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onSelectCategory('cctv');
                    onNavigateSection && onNavigateSection('catalogue');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Hikvision AcuSense IP Cameras & NVRs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onSelectCategory('solar');
                    onNavigateSection && onNavigateSection('catalogue');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  On-Grid & Hybrid Solar Inverters (Growatt)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onSelectCategory('solar');
                    onNavigateSection && onNavigateSection('catalogue');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Tier-1 Monocrystalline PV Modules
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Brands & Standards */}
          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              {lang === 'bn' ? 'অনুমোদিত ব্র্যান্ড ও মান' : 'OEM Brands & Standards'}
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Direct procurement channels and verified compliance certificates for:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-300">
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">ABB</span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">Schneider</span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">Siemens</span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">Hikvision</span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">Growatt</span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">LONGi</span>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#16A673]" />
                <span>IEC, BREB & BPDB Technical Compliances</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap justify-between items-center gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {t.companyName}. {lang === 'bn' ? 'সকল স্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">{t.barishalAddress}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
