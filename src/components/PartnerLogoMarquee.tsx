import React from 'react';
import { Language } from '../data/translations';

interface PartnerLogoMarqueeProps {
  lang: Language;
}

interface PartnerBrand {
  name: string;
  tagline: string;
  src?: string;
  badgeColor: string;
  textColor: string;
  borderHover: string;
}

export const PartnerLogoMarquee: React.FC<PartnerLogoMarqueeProps> = ({ lang }) => {
  const partners: PartnerBrand[] = [
    {
      name: 'Siemens',
      tagline: 'SENTRON Switchgear & VCB',
      src: 'https://dhrubapower.com/wp-content/uploads/2026/05/partner-siemens.png',
      badgeColor: '#00646E',
      textColor: '#00646E',
      borderHover: 'hover:border-[#00646E]'
    },
    {
      name: 'ABB',
      tagline: 'Breakers & Automation',
      src: 'https://dhrubapower.com/wp-content/uploads/2026/05/partner-abb.png',
      badgeColor: '#FF000F',
      textColor: '#FF000F',
      borderHover: 'hover:border-[#FF000F]'
    },
    {
      name: 'Schneider Electric',
      tagline: 'Acti9 & Compact NSX',
      src: 'https://dhrubapower.com/wp-content/uploads/2026/05/partner-schneider-electric.png',
      badgeColor: '#3DCD58',
      textColor: '#009530',
      borderHover: 'hover:border-[#3DCD58]'
    },
    {
      name: 'Hager',
      tagline: 'Modular Protection',
      src: 'https://dhrubapower.com/wp-content/uploads/2026/05/partner-hager.png',
      badgeColor: '#004B87',
      textColor: '#004B87',
      borderHover: 'hover:border-[#004B87]'
    },
    {
      name: 'Hyundai',
      tagline: 'Heavy Electric Systems',
      src: 'https://dhrubapower.com/wp-content/uploads/2026/05/partner-hyundai.png',
      badgeColor: '#002C6C',
      textColor: '#002C6C',
      borderHover: 'hover:border-[#002C6C]'
    },
    {
      name: 'Hikvision',
      tagline: 'AcuSense AI Surveillance',
      badgeColor: '#E60012',
      textColor: '#E60012',
      borderHover: 'hover:border-[#E60012]'
    },
    {
      name: 'Growatt',
      tagline: 'Commercial Solar Inverters',
      badgeColor: '#78BE20',
      textColor: '#78BE20',
      borderHover: 'hover:border-[#78BE20]'
    },
    {
      name: 'LONGi Solar',
      tagline: 'Tier-1 TOPCon Bifacial',
      badgeColor: '#0066B3',
      textColor: '#0066B3',
      borderHover: 'hover:border-[#0066B3]'
    }
  ];

  // Duplicated list to create a seamless infinite loop with zero jumps or gaps
  const marqueeItems = [...partners, ...partners];

  return (
    <section className="border-y border-slate-200 bg-slate-50/80 py-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {lang === 'bn' ? 'অনুমোদিত পার্টনার ও ব্র্যান্ড ইকোসিস্টেম' : 'Trusted Equipment Manufacturers & Brand Ecosystem'}
        </p>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          {lang === 'bn' ? 'সরাসরি প্রস্তুতকারক ওয়ারেন্টি' : 'Direct Authorized OEM Distribution'}
        </span>
      </div>

      {/* Marquee Container with subtle gradient edge fades for smooth appearance */}
      <div className="relative w-full overflow-hidden select-none">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        {/* Continuous RIGHT -> LEFT Marquee Track */}
        <div className="dp-marquee-track flex gap-4 sm:gap-6 py-2">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className={`bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-2xs hover:shadow-md transition-all duration-200 flex items-center gap-3.5 h-16 w-52 sm:w-60 shrink-0 ${brand.borderHover} cursor-pointer group`}
            >
              <div 
                className="w-2.5 h-9 rounded-full shrink-0 transition-transform group-hover:scale-y-110"
                style={{ backgroundColor: brand.badgeColor }}
              />

              <div className="flex flex-col justify-center min-w-0 flex-1">
                <span className="text-sm font-extrabold text-slate-900 group-hover:text-slate-950 transition-colors truncate">
                  {brand.name}
                </span>
                <span className="text-[10px] text-slate-500 truncate font-medium">
                  {brand.tagline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
