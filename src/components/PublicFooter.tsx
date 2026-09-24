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
  onNavigate: (path: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  lang,
  onSelectCategory,
  onNavigate
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="bg-[#0F172A] text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Company Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <a 
                href="/"
                onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
                className="bg-white/95 px-2.5 py-1.5 rounded-lg border border-slate-700/60 inline-flex items-center cursor-pointer select-none"
              >
                <img 
                  src="/dhrubapowerlogo.png" 
                  alt="Dhruba Power &amp; Engineering" 
                  className="h-8 w-auto max-w-[180px] object-contain"
                  referrerPolicy="no-referrer"
                />
              </a>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Specialized electrical engineering supplier and turnkey contractor in Barishal, Bangladesh. Design, installation, sales, testing, and maintenance of substations, solar PV arrays, and industrial switchgear.
            </p>

            <div className="space-y-2 text-slate-300 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <span>{t.barishalAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D97706] shrink-0" />
                <a href="tel:+8801711197767" className="hover:text-white font-semibold">
                  +880 1711-197767
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D97706] shrink-0" />
                <a href="mailto:info@dhrubapower.com" className="hover:text-white">
                  info@dhrubapower.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#16A673] shrink-0" />
                <a 
                  href="https://wa.me/8801711197767" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#16A673] hover:underline font-semibold"
                >
                  WhatsApp: +880 1711-197767
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Core Engineering Services */}
          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>{lang === 'bn' ? 'প্রধান ইঞ্জিনিয়ারিং সেবাসমূহ' : 'Turnkey Services'}</span>
              <a 
                href="/services/"
                onClick={(e) => { e.preventDefault(); onNavigate('/services/'); }}
                className="text-[#D97706] hover:underline text-[11px] font-normal"
              >
                All (6) →
              </a>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a 
                  href="/services/substation/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/services/substation/'); }}
                  className="hover:text-[#F59E0B] transition-colors block"
                >
                  1. {t.substationTitle}
                </a>
              </li>
              <li>
                <a 
                  href="/services/solar-system/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/services/solar-system/'); }}
                  className="hover:text-[#F59E0B] transition-colors block"
                >
                  2. {t.solarSystemTitle}
                </a>
              </li>
              <li>
                <a 
                  href="/services/lightning-arrester/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/services/lightning-arrester/'); }}
                  className="hover:text-[#F59E0B] transition-colors block"
                >
                  3. {t.lightningTitle}
                </a>
              </li>
              <li>
                <a 
                  href="/services/electrical-wiring/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/services/electrical-wiring/'); }}
                  className="hover:text-[#F59E0B] transition-colors block"
                >
                  4. {t.wiringTitle}
                </a>
              </li>
              <li>
                <a 
                  href="/services/cctv-installation/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/services/cctv-installation/'); }}
                  className="hover:text-[#F59E0B] transition-colors block"
                >
                  5. {t.cctvInstallTitle}
                </a>
              </li>
              <li>
                <a 
                  href="/services/panel-board/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/services/panel-board/'); }}
                  className="hover:text-[#F59E0B] transition-colors block"
                >
                  6. {t.panelBoardTitle}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              {lang === 'bn' ? 'ওয়েবসাইট লিংক' : 'Site Navigation'}
            </div>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a 
                  href="/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
                  className="hover:text-[#F59E0B] transition-colors block"
                >
                  {t.home}
                </a>
              </li>
              <li>
                <a 
                  href="/about/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/about/'); }}
                  className="hover:text-[#F59E0B] transition-colors block"
                >
                  {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
                </a>
              </li>
              <li>
                <a 
                  href="/shop/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/shop/'); }}
                  className="hover:text-[#F59E0B] transition-colors block"
                >
                  {lang === 'bn' ? 'শপ / ক্যাটালগ' : 'Industrial Shop & Catalog'}
                </a>
              </li>
              <li>
                <a 
                  href="/projects/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/projects/'); }}
                  className="hover:text-[#F59E0B] transition-colors block"
                >
                  {t.projects} (500+ Completed)
                </a>
              </li>
              <li>
                <a 
                  href="/experts/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/experts/'); }}
                  className="hover:text-[#F59E0B] transition-colors block"
                >
                  {t.experts} &amp; WhatsApp Contacts
                </a>
              </li>
              <li>
                <a 
                  href="/blogs/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/blogs/'); }}
                  className="hover:text-[#F59E0B] transition-colors block"
                >
                  {t.blog} (Engineering Articles)
                </a>
              </li>
              <li>
                <a 
                  href="/contact/"
                  onClick={(e) => { e.preventDefault(); onNavigate('/contact/'); }}
                  className="hover:text-[#F59E0B] transition-colors block"
                >
                  {t.contact}
                </a>
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
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">Hager</span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">Hyundai</span>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#16A673]" />
                <span>IEC, BREB &amp; BPDB Technical Compliances</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#16A673]" />
                <span>NFC 17-102 Lightning Protection Standard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap justify-between items-center gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Dhruba Power &amp; Engineering. {lang === 'bn' ? 'সকল স্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">{t.barishalAddress}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
