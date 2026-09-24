export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  shortDesc: string;
  shortDescBn: string;
  fullDesc: string;
  fullDescBn: string;
  image: string;
  iconName: string;
  category: 'eee' | 'solar' | 'cctv';
  scopeOfWork: string[];
  scopeOfWorkBn: string[];
  equipmentSupplied: { name: string; brand: string; mpn: string; desc: string }[];
  technicalStandards: string[];
  warrantyTerms: string;
  turnaroundTime: string;
  relatedProjectSlug?: string;
  relatedProjectName?: string;
}

export const SERVICES_DATA: ServiceDetail[] = [
  {
    id: 'substation',
    slug: 'substation',
    title: 'Sub-Station Engineering & Commissioning',
    titleBn: 'সাব-স্টেশন ইঞ্জিনিয়ারিং ও কমিশনিং',
    shortDesc: 'Turnkey 11kV/0.415kV industrial substation design, transformer supply, vacuum circuit breakers, and BPDB/BREB utility authorization.',
    shortDescBn: 'টার্নকি ১১কেভি/০.৪১৫কেভি সাব-স্টেশন ডিজাইন, ট্রান্সফরমার সরবরাহ, ভিসিবি এবং বিদ্যুৎ উন্নয়ন বোর্ডের অনুমোদন।',
    fullDesc: 'Dhruba Power & Engineering provides end-to-end design, load calculation, equipment supply, civil construction, erection, and testing for commercial and industrial substations. We handle step-down transformers (oil-immersed and dry-type), High Tension (HT) Vacuum Circuit Breakers (VCB), Low Tension (LT) switchgear, Power Factor Improvement (PFI) plants, and coordinate all regulatory approvals with BPDB, BREB, and WZPDCL in Barishal and nationwide.',
    fullDescBn: 'ধ্রুব পাওয়ার অ্যান্ড ইঞ্জিনিয়ারিং বাণিজ্যিক ও শিল্পপ্রতিষ্ঠানের জন্য পূর্ণাঙ্গ সাব-স্টেশন ডিজাইন, লোড ক্যালকুলেশন, ট্রান্সফরমার সরবরাহ, সিভিল ফাউন্ডেশন এবং টেস্টিং প্রদান করে। আমরা তেল ও ড্রাই-টাইপ ট্রান্সফরমার, এইচটি ভিসিবি প্যানেল, এলটি সুইচগিয়ার, পিএফআই প্ল্যান্ট এবং বিদ্যুৎ উন্নয়ন বোর্ডের সরকারি ছাড়পত্র প্রক্রিয়া পরিচালনা করি।',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Activity',
    category: 'eee',
    scopeOfWork: [
      'Site load schedule analysis and single-line diagram (SLD) preparation',
      'Civil plinth and substation room layout in compliance with BNBC codes',
      'Supply and erection of 11/0.415kV distribution transformers (100kVA to 2500kVA)',
      'HT switchgear panel with 11kV Vacuum Circuit Breaker (VCB) & protection relays',
      'Automatic Power Factor Improvement (PFI) capacitor bank assembly (0.95+ pf guarantee)',
      'Underground cable laying, terminations, and earth pit grid creation (<1.0 Ohm)',
      'High voltage insulation resistance and dielectric breakdown testing',
      'Liaison and sign-off from Chief Electrical Inspector and distribution utilities'
    ],
    scopeOfWorkBn: [
      'সাইটের লোড শিডিউল বিশ্লেষণ এবং বিএনবিসি স্ট্যান্ডার্ড অনুযায়ী সিঙ্গেল লাইন ডায়াগ্রাম (SLD) প্রণয়ন',
      'সাবস্টেশন রুমের সিভিল ফাউন্ডেশন ও লেআউট পরিকল্পনা',
      '১০০ কেভিএ থেকে ২৫০০ কেভিএ ডিস্ট্রিবিউশন ট্রান্সফরমার সরবরাহ ও স্থাপন',
      '১১ কেভি ভিসিবি প্যানেল ও প্রোটেকশন রিলে সংযোজন',
      'অটোমেটিক পিএফআই ক্যাপাসিটর ব্যাংক নির্মাণ (০.৯৫+ পাওয়ার ফ্যাক্টর নিশ্চয়তা)',
      'আন্ডারগ্রাউন্ড ক্যাবল লেইং ও কেমিক্যাল আর্থিং গ্রিড তৈরি (<১.০ ওহম)',
      'এইচটি ইনসুলেশন টেস্ট ও তেল ডায়ালেক্ট্রিক ব্রেকডাউন টেস্ট সম্পাদন',
      'প্রধান বিদ্যুৎ পরিদর্শক দপ্তর ও বিদ্যুৎ বিতরণ কর্তৃপক্ষের চূড়ান্ত অনুমোদন'
    ],
    equipmentSupplied: [
      { name: '250 kVA Oil-Immersed Distribution Transformer', brand: 'Energypac / OEM', mpn: 'TR-250KVA-11/0.415', desc: '11/0.415kV, ONAN cooling, copper wound, with off-circuit tap changer' },
      { name: '11kV Indoor Vacuum Circuit Breaker (VCB) Panel', brand: 'ABB / Siemens', mpn: 'VCB-11KV-630A', desc: '630A 20kA 3-phase vacuum breaker with microprocessor overcurrent/earth fault relay' },
      { name: '120 kVAR Automatic PFI Plant with Microprocessor Controller', brand: 'Dhruba Engineering', mpn: 'PFI-120KVAR-AUTO', desc: 'Step-switched capacitor bank with detuned harmonic filters and dual digital PF meter' },
      { name: '630A 4P Thermal-Magnetic MCCB Main Incomer', brand: 'Schneider Electric', mpn: 'LV432876', desc: 'Compact NSX630F 36kA breaking capacity with Micrologic 2.3 trip unit' }
    ],
    technicalStandards: ['IEC 60076 (Power Transformers)', 'IEC 62271-200 (HT Switchgear)', 'BNBC 2020 Part 8 Chapter 2', 'IEEE 142 Grounding Standards'],
    warrantyTerms: '24 Months Comprehensive Warranty on Transformers and Switchgear Panels with Free Quarterly Preventive Maintenance.',
    turnaroundTime: '15 to 30 Business Days depending on utility sanction clearance.',
    relatedProjectSlug: '250-kva-factory-substation-upgrade',
    relatedProjectName: '250 KVA Factory Substation Upgrade'
  },
  {
    id: 'solar-system',
    slug: 'solar-system',
    title: 'Industrial & Commercial Solar Systems',
    titleBn: 'বাণিজ্যিক ও শিল্প সোলার সিস্টেম',
    shortDesc: 'Rooftop on-grid, hybrid, and solar microgrids with Tier-1 bifacial panels, Growatt/Huawei smart inverters, and net-metering integration.',
    shortDescBn: 'টায়ার-১ বাইফেসিয়াল সোলার প্যানেল, গ্রোওয়াট/হুয়াওয়ে স্মার্ট ইনভার্টার এবং নেট-মিটারিং সুবিধা সহ অন-গ্রিড ও হাইব্রিড সোলার।',
    fullDesc: 'With rising grid electricity tariffs, Dhruba Power engineers high-efficiency solar photovoltaic (PV) power plants for factories, commercial plazas, cold storage units, and institutional buildings across Bangladesh. We handle 3D shading simulations, high-tensile aluminium mounting structures, string and hybrid inverters, battery energy storage systems (BESS), and government net-metering approval to export excess energy back to the national grid.',
    fullDescBn: 'বিদ্যুৎ বিল সাশ্রয়ে ধ্রুব পাওয়ার কারখানা, বাণিজ্যিক ভবন, কোল্ড স্টোরেজ ও শিক্ষাপ্রতিষ্ঠানের জন্য হাই-এফিসিয়েন্সি সোলার পিভি সিস্টেম স্থাপন করে। আমরা থ্রি-ডি শ্যাডো সিমুলেশন, অ্যালুমিনিয়াম স্ট্রাকচার, স্ট্রিং ও হাইব্রিড ইনভার্টার, লিথিয়াম ব্যাটারি ব্যাকআপ এবং সরকারি নেট-মিটারিং অনুমোদন সম্পন্ন করি।',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Sun',
    category: 'solar',
    scopeOfWork: [
      'Detailed site irradiation audit and drone-assisted 3D shading simulation',
      'Structural integrity analysis of factory roofs (tin-shed, RCC slab)',
      'Tier-1 N-Type TOPCon bifacial solar module procurement and installation',
      'Smart grid-tied or hybrid inverters with dual MPPT trackers and remote cloud monitoring',
      'DC surge protection boxes with Type II SPDs and DC disconnect isolators',
      'Bi-directional net metering submission and utility compliance testing',
      'Energy generation dashboard configuration via mobile app & desktop portal'
    ],
    scopeOfWorkBn: [
      'সাইটের সূর্যালোক অডিট এবং ড্রোন সহযোগে থ্রি-ডি শ্যাডো সিমুলেশন',
      'কারখানার ছাদ ও শেডের স্ট্রাকচারাল লোড সক্ষমতা যাচাই',
      'টায়ার-১ এন-টাইপ টপকন বাইফেসিয়াল সোলার মডিউল স্থাপন',
      'ডুয়াল এমপিটিটি সহ গ্রিড-টাইড ও হাইব্রিড ইনভার্টার ইনস্টলেশন ও রিমোট ক্লাউড মনিটরিং',
      'টাইপ-২ এসপিডি সহ ডিসি প্রোটেকশন কম্বাইনার বক্স সংযোজন',
      'দ্বিমুখী নেট-মিটারিং আবেদন ও সরকারি বিদ্যুৎ বিতরণ সংস্থার অনুমোদন',
      'মোবাইল অ্যাপ ও ডেস্কটপে সার্বক্ষণিক বিদ্যুৎ উৎপাদন ট্র্যাকিং ব্যবস্থা'
    ],
    equipmentSupplied: [
      { name: 'Growatt SPH 10000TL3-BH-UP 10kW 3-Phase Hybrid Inverter', brand: 'Growatt', mpn: 'SPH 10000TL3-BH-UP', desc: '10kW AC output, dual MPPT, high voltage lithium battery compatible, IP65' },
      { name: 'LONGi Hi-MO 6 Explorer 575W Mono-Facial Solar Panel', brand: 'LONGi', mpn: 'LR5-72HTH-575M', desc: '22.3% efficiency, HPBC cell architecture, 25-year linear performance warranty' },
      { name: 'Solar Surge Protection Device (SPD) 1000V DC Type II', brand: 'Schneider / Suntree', mpn: 'SUP2H-PV-1000V', desc: '40kA max discharge current, DIN-rail mounting for PV array string protection' }
    ],
    technicalStandards: ['IEC 61215 (Crystalline silicon PV modules)', 'IEC 62109 (Inverter safety)', 'SREDA Net Metering Guidelines 2018'],
    warrantyTerms: '25-Year Performance Warranty on Solar Modules, 5-Year Replacement Warranty on Inverters, 1-Year Free O&M.',
    turnaroundTime: '10 to 20 Business Days for turnkey installation.',
    relatedProjectSlug: 'hybrid-solar-system-for-commercial-building',
    relatedProjectName: 'Hybrid Solar System for Commercial Building'
  },
  {
    id: 'lightning-arrester',
    slug: 'lightning-arrester',
    title: 'Lightning Protection & Earthing Systems',
    titleBn: 'বজ্রপাত সুরক্ষা ও আর্দিং সিস্টেম',
    shortDesc: 'Early Streamer Emission (ESE) air terminals, low-resistance chemical earth pits, and surge protection devices (SPD) protecting lives and assets.',
    shortDescBn: 'আর্লি স্ট্রিমার এমিশন (ESE) এয়ার টার্মিনাল, কেমিক্যাল আর্থিং পিট এবং ভবনের সুরক্ষায় অত্যাধুনিক বজ্রপাত প্রতিরোধ ব্যবস্থা।',
    fullDesc: 'Bangladesh experiences severe lightning storms causing electrical equipment failure and structural hazards. Dhruba Power engineers NFC 17-102 compliant Early Streamer Emission (ESE) lightning protection systems. Our turnkey solutions include high-grade air terminals with wide radius protection, electrolytic copper tape down conductors, strike counters, and specialized chemical earthing pits guaranteed to sustain earth resistance below 1.0 Ohm.',
    fullDescBn: 'বাংলাদেশে বজ্রপাতের তীব্রতা বৃদ্ধি পাওয়ায় ধ্রুব পাওয়ার আন্তর্জাতিক এনএফসি ১৭-১০২ মান অনুযায়ী ESE এয়ার টার্মিনাল ও সার্জনিরোধক ব্যবস্থা বাস্তবায়ন করে। আমাদের প্যাকেজে থাকে বড় রেডিয়াসের সক্রিয় এয়ার টার্মিনাল, তামার ডাউন কন্ডাক্টর, স্ট্রাইক কাউন্টার এবং ১.০ ওহমের নিচে কেমিক্যাল আর্থিং ব্যবস্থা।',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Zap',
    category: 'eee',
    scopeOfWork: [
      'Rolling sphere & NFC 17-102 risk assessment calculation for building height and area',
      'Supply and erection of active Early Streamer Emission (ESE) air terminal mast',
      'Installation of 25x3mm annealed electrolytic bare copper tape down conductors',
      'Electronic lightning strike event counter to log surges and discharge cycles',
      'Deep boring chemical earth pit using Bentonite & conductive ground enhancement material',
      'Earth pit test chamber and digital Wenner 4-pin earth resistance measurement (<1.0 Ohm)',
      'Internal Type 1+2 Surge Protective Devices (SPD) installed at main LT distribution switchboards'
    ],
    scopeOfWorkBn: [
      'ভবনের উচ্চতা ও আয়তনের ওপর রোলিং স্ফিয়ার ও এনএফসি ১৭-১০২ ঝুঁকি মূল্যায়ন',
      'অ্যাক্টিভ ESE এয়ার টার্মিনাল ও জিআই মাউন্ট মাস্ট স্থাপন',
      '২৫x৩মিমি ইলেকট্রোলাইটিক তামা ডাউন কন্ডাক্টর সংযোজন',
      'বজ্রপাতের মাত্রা ও ফ্রিকোয়েন্সি রেকর্ড করতে ইলেকট্রনিক স্ট্রাইক কাউন্টার স্থাপন',
      'বেন্টোনাইট কেমিক্যাল কম্পাউন্ড সহযোগে গভীর ডিপ বোরিং আর্থ পিট নির্মাণ',
      'টেস্ট চেম্বার স্থাপন ও ডিজিটাল মিটার দিয়ে আর্থ রেজিস্ট্যান্স ১.০ ওহমের নিচে নিশ্চিতকরণ',
      'প্রধান এলটি প্যানেল বোর্ডে টাইপ ১+২ এসপিডি ভোল্টেজ সার্জ প্রটেক্টর সংযোগ'
    ],
    equipmentSupplied: [
      { name: 'Forend Petex-S ESE Active Lightning Arrester Terminal (Δt = 60μs)', brand: 'Forend / Cirprotec', mpn: 'PETEX-S-60US', desc: 'Stainless steel 316, 107m protection radius at Level IV, NFC 17-102 certified' },
      { name: 'Mechanical Lightning Strike Event Counter', brand: 'Forend / OEM', mpn: 'LSC-01', desc: 'Inductive sensor, 0-999999 count range, IP67 weatherproof enclosure' },
      { name: '11kV 10kA Metal Oxide Polymeric Lightning Arrester', brand: 'ABB / OEM', mpn: 'LA-11KV-10KA', desc: 'Distribution class zinc oxide varistor arrester for medium voltage lines' }
    ],
    technicalStandards: ['NFC 17-102:2011 (ESE Standard)', 'IEC 62305 (Protection Against Lightning)', 'IEEE 81 (Earth Resistance Testing)'],
    warrantyTerms: '10-Year Manufacturer Hardware Warranty on ESE Terminal, 3-Year Earth Pit Resistance Guarantee.',
    turnaroundTime: '3 to 7 Business Days.',
    relatedProjectSlug: 'lightning-protection-for-multi-storey-building',
    relatedProjectName: 'Lightning Protection for Multi-Storey Building'
  },
  {
    id: 'electrical-wiring',
    slug: 'electrical-wiring',
    title: 'Industrial Electrical Wiring & HT/LT Distribution',
    titleBn: 'শিল্প বৈদ্যুতিক ওয়্যারিং ও এইচটি/এলটি ডিস্ট্রিবিউশন',
    shortDesc: 'Heavy-duty cable tray networks, busbar trunking systems, fire-rated industrial cabling, and balanced three-phase power distribution.',
    shortDescBn: 'হেভি-ডিউটি ক্যাবল ট্রে নেটওয়ার্ক, বাসবার ট্রাঙ্কিং, ফায়ার-রেটেড ক্যাবল এবং ব্যালান্সড থ্রি-ফেজ পাওয়ার ডিস্ট্রিবিউশন।',
    fullDesc: 'Faulty electrical wiring is the leading cause of industrial fires and energy losses. Dhruba Power engineers safe, standardized electrical distribution systems for textile mills, manufacturing plants, hospitals, and high-rise commercial structures. From hot-dip galvanized cable ladder trays to fire-resistant XLPE insulated power cables, our licensed electricians ensure neat, color-coded, and thermally audited electrical infrastructure.',
    fullDescBn: 'শিল্প কারখানায় অগ্নিকাণ্ড ও অপচয় রোধে ধ্রুব পাওয়ার আন্তর্জাতিক স্ট্যান্ডার্ড বজায় রেখে হেভি-ডিউটি ওয়্যারিং সম্পন্ন করে। আমরা হট-ডিপ গ্যালভানাইজড ক্যাবল ট্রে, বাসবার ট্রাঙ্কিং, ফায়ার রেজিস্ট্যান্ট এক্সএলপিই ক্যাবল এবং থ্রি-ফেজ লোড ব্যালান্সিং নিশ্চিত করি।',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Wrench',
    category: 'eee',
    scopeOfWork: [
      'Comprehensive plant electrical load calculation, diversity factor assessment, and breaker grading',
      'Fabrication and installation of perforated cable trays and heavy-duty cable ladders',
      'XLPE and PVC insulated NYY / 2XFY multi-core copper power cabling (BRB/BBS/Eastern)',
      'Sub-distribution board (SDB) and motor control center wiring with proper ferrule labeling',
      'Three-phase load balancing across all electrical phases to prevent neutral overheating',
      'Thermal imaging infrared inspection to detect loose terminations and hotspots',
      'Insulation resistance megger testing across all circuits prior to energization'
    ],
    scopeOfWorkBn: [
      'কারখানার বিদ্যুৎ লোড ক্যালকুলেশন, ডাইভার্সিটি ফ্যাক্টর ও ব্রেকার সমন্বয়',
      'হেভি-ডিউটি পারফোরেটেড ক্যাবল ট্রে ও ক্যাবল ল্যাডার স্থাপন',
      'বিআরবি/বিবিএস/ইস্টার্ন প্রস্তুতকৃত এক্সএলপিই মাল্টি-কোর কপার ক্যাবলিং',
      'সাব-ডিস্ট্রিবিউশন বোর্ড (SDB) ও মোটর কন্ট্রোল ওয়্যারিং এবং নিখুঁত ফেরুল লেবেলিং',
      'ফেজ ব্যালান্সিং করে নিউট্রাল তারের অতিরিক্ত উত্তাপ ও বিদ্যুৎ অপচয় রোধ',
      'থার্মাল ইমেজিং ক্যামেরা দিয়ে লুজ কানেকশন ও হটস্পট ডায়াগনসিস',
      'সংযোগ চালু করার পূর্বে মেগার টেস্টের মাধ্যমে ইনসুলেশন পরীক্ষা'
    ],
    equipmentSupplied: [
      { name: 'ABB SH201-C20 1P 20A 6kA MCB', brand: 'ABB', mpn: 'SH201-C20', desc: 'Miniature circuit breaker for lighting and single-phase sub-circuits' },
      { name: 'Schneider Acti9 iC60N 3P 32A 6kA MCB', brand: 'Schneider Electric', mpn: 'A9F74332', desc: '3-pole C-curve breaker for commercial machinery and motors' },
      { name: 'Siemens 3VL 4P 250A 55kA MCCB', brand: 'Siemens', mpn: '3VL3725-1DC46-0AA0', desc: 'Moulded case circuit breaker with electronic overcurrent release' }
    ],
    technicalStandards: ['BNBC 2020 Electrical Standards', 'IEC 60364 (Low-voltage electrical installations)', 'NFPA 70 National Electrical Code'],
    warrantyTerms: '2-Year Workmanship Warranty, Lifetime Support for Cable Route Documentation.',
    turnaroundTime: 'Flexible based on facility square footage and plant downtime schedules.',
    relatedProjectSlug: 'commercial-electrical-wiring-renovation',
    relatedProjectName: 'Commercial Electrical Wiring Renovation'
  },
  {
    id: 'cctv-installation',
    slug: 'cctv-installation',
    title: 'CC-TV & Advanced Surveillance Systems',
    titleBn: 'সিসিটিভি ও আধুনিক সিকিউরিটি সার্ভেইল্যান্স',
    shortDesc: 'AcuSense AI IP cameras, optical fiber video backbones, enterprise NVR storage, perimeter intrusion sensors, and multi-screen monitoring.',
    shortDescBn: 'হিকভিশন অ্যাকুসেন্স এআই ক্যামেরা, ফাইবার অপটিক নেটওয়ার্ক, এনভিআর সেন্ট্রাল স্টোরেজ এবং রিমোট সিকিউরিটি সার্ভেইল্যান্স।',
    fullDesc: 'Dhruba Power designs and deploys high-definition IP video surveillance networks for industrial premises, river ports, warehouses, retail centers, and residential compounds. Utilizing Hikvision and Dahua AI-powered AcuSense cameras, our systems classify humans and vehicles in real-time, eliminating 90% of false alarms, delivering clear color night vision (ColorVu), and offering remote smartphone streaming alongside multi-terabyte centralized storage.',
    fullDescBn: 'ধ্রুব পাওয়ার শিল্প প্রতিষ্ঠান, নদী বন্দর, গুদাম ও বিপণিবিতানের জন্য উচ্চমানের আইপি সিসিটিভি ক্যামেরা নেটওয়ার্ক তৈরি করে। হিকভিশন ও দাহুয়ার এআই অ্যাকুসেন্স ক্যামেরা দিয়ে মানুষ ও গাড়ির মুভমেন্ট স্বয়ংক্রিয়ভাবে শনাক্ত করা যায় এবং কালারভ্যু প্রযুক্তির মাধ্যমে রাতের বেলাতেও রঙ্গিন ভিডিও পাওয়া যায়।',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Camera',
    category: 'cctv',
    scopeOfWork: [
      'Comprehensive security vulnerability assessment and camera focal length planning',
      'Cat6 outdoor UV-stabilized ethernet cabling and armored optical fiber backbones',
      'Installation of 2MP, 4MP, and 8MP 4K AcuSense motorized varifocal & bullet cameras',
      'Deployment of 16/32/64-channel enterprise Network Video Recorders (NVR) with RAID storage',
      'Perimeter tripwire line crossing and intrusion detection siren/strobe alarms',
      'Central security control room console setup with ultra-HD multi-monitor HDMI displays',
      'Encrypted mobile app (Hik-Connect) configuration for live streaming and push notifications'
    ],
    scopeOfWorkBn: [
      'সাইটের নিরাপত্তা অডিট এবং ক্যামেরার সঠিক পজিশন ও ফোকাল লেন্থ নির্বাচন',
      'ক্যাট-৬ আউটডোর ইউভি প্রোটেক্টেড ক্যাবল ও আর্মার্ড অপটিক্যাল ফাইবার নেটওয়ার্ক',
      '২ মেগাপিক্সেল, ৪ মেগাপিক্সেল ও ৮ মেগাপিক্সেল ফোরকে অ্যাকুসেন্স ক্যামেরা স্থাপন',
      '১৬/৩২/৬৪ চ্যানেল সেন্ট্রাল এনভিআর ও সার্ভিলেন্স হার্ডডিস্ক রেইড স্টোরেজ কনফিগারেশন',
      'বাউন্ডারি ওয়াল ও গেটে ভার্চুয়াল ট্রিপওয়্যার লাইন ক্রস অ্যালার্ম সিস্টেম সংযোজন',
      'মাল্টি-মনিটর সহ সেন্ট্রাল কন্ট্রোল রুম মনিটরিং কনসোল স্থাপন',
      'মোবাইল অ্যাপে এনক্রিপ্টেড লাইভ স্ট্রিমিং ও জরুরি নোটিফিকেশন কনফিগারেশন'
    ],
    equipmentSupplied: [
      { name: 'Hikvision DS-2CD2043G2-I 4MP AcuSense Fixed Bullet IP Camera', brand: 'Hikvision', mpn: 'DS-2CD2043G2-I', desc: '4MP @ 30fps, 2.8mm lens, 40m EXIR night vision, IP67 weatherproof, human/vehicle target classification' },
      { name: 'Hikvision DS-7616NXI-K2 16-Channel 4K AcuSense NVR', brand: 'Hikvision', mpn: 'DS-7616NXI-K2', desc: '16 IP video channels, dual SATA up to 20TB, 4K HDMI output, intelligent video analytics' },
      { name: 'Western Digital Purple 4TB Surveillance Grade Hard Drive', brand: 'Western Digital', mpn: 'WD43PURZ', desc: 'AllFrame 4K technology, engineered specifically for 24/7 continuous surveillance recording' }
    ],
    technicalStandards: ['ONVIF Profile S/G/T Conformant', 'IP67 Ingress Protection', 'IK10 Vandal Resistance'],
    warrantyTerms: '2-Year Official Replacement Warranty on Hikvision Cameras & NVRs, 1-Year Free Maintenance Visits.',
    turnaroundTime: '2 to 5 Business Days depending on camera quantity.',
    relatedProjectSlug: 'cctv-security-network-for-warehouse',
    relatedProjectName: 'CCTV Security Network for Warehouse'
  },
  {
    id: 'panel-board',
    slug: 'panel-board',
    title: 'Custom HT/LT Switchgear & Panel Boards',
    titleBn: 'কাস্টম এইচটি/এলটি সুইচগিয়ার ও প্যানেল বোর্ড',
    shortDesc: 'Form 2b/3b modular electrical panels, Automatic Transfer Switches (ATS), PFI capacitor banks, and Motor Control Centers (MCC).',
    shortDescBn: 'ফর্ম ২বি/৩বি মডুলার প্যানেল, অটোমেটিক ট্রান্সফার সুইচ (ATS), পিএফআই ক্যাপাসিটর ব্যাংক ও মোটর কন্ট্রোল প্যানেল।',
    fullDesc: 'Dhruba Power designs and manufactures custom electrical switchboards tailored to the demanding loads of factories and high-power facilities. Utilizing CNC-punched electro-galvanized sheet steel with 9-tank powder coating, our panels accommodate air circuit breakers (ACB), moulded case circuit breakers (MCCB), motor soft starters, variable frequency drives (VFD), and computerized digital metering.',
    fullDescBn: 'ধ্রুব পাওয়ার কারখানার বিদ্যুৎ লোডের চাহিদামতো সম্পূর্ণ কাস্টমাইজড বৈদ্যুতিক প্যানেল বোর্ড তৈরি করে। সিএনসি শিট মেটাল ও পাউডার কোটেড এনক্লোজারে আন্তর্জাতিক মানের এসিবি, এমসিসিবি, সফট স্টার্টার, ভিএফডি ও অটোমেটিক চেঞ্জওভার সংযুক্ত করা হয়।',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Cpu',
    category: 'eee',
    scopeOfWork: [
      'Design of Form 2b and Form 3b compartmentalized enclosures in AutoCAD and SolidWorks',
      'CNC laser cutting and electro-static powder coating (RAL 7032 / RAL 7035)',
      'High-conductivity 99.9% electrolytic tin-plated copper busbar sizing and bending',
      'Integration of motorized Automatic Transfer Switches (ATS) for seamless generator changeover',
      'Motor Control Center (MCC) panels with star-delta starters, soft starters, and inverter drives',
      'Digital multifunction energy meters with RS485 Modbus connectivity for SCADA / BMS integration',
      'Full factory acceptance testing (FAT): busbar temperature rise, dielectric strength, and functional sequence checks'
    ],
    scopeOfWorkBn: [
      'অটোক্যাড ও সলিডওয়ার্কসে ফর্ম ২বি এবং ৩বি কম্পার্টমেন্টালাইজড প্যানেল ডিজাইন',
      'সিএনসি লেজার কাটিং ও ইলেক্ট্রো-স্ট্যাটিক পাউডার কোটিং ফিনিশিং',
      '৯৯.৯% খাঁটি টিন-প্লেটেড কপার বাসবার সাইজিং ও নিখুঁত হিটিং প্রোটেকশন',
      'জেনারেটর ও মেইন লাইনের স্বয়ংক্রিয় পরিবর্তনের জন্য মটোরাইজড ATS সুইচ সংযোজন',
      'স্টার-ডেল্টা ও সফট স্টার্টার সহ মোটর কন্ট্রোল সেন্টার (MCC) প্যানেল নির্মাণ',
      'স্কার্ডা ও বিএমএস কানেক্টিভিটি সহ ডিজিটাল মাল্টিফাংশন এনার্জি মিটারিং',
      'ফ্যাক্টরি অ্যাকসেপ্ট্যান্স টেস্টিং (FAT): বাসবার ডায়ালেক্ট্রিক ও সিকোয়েন্স পরীক্ষণ'
    ],
    equipmentSupplied: [
      { name: 'ABB Formula A1N 125 3P 100A MCCB', brand: 'ABB', mpn: '1SDA066804R1', desc: 'Moulded case circuit breaker, fixed version, front terminals, 25kA breaking' },
      { name: 'Schneider Electric TeSys D LC1D32M7 3P Contactor', brand: 'Schneider Electric', mpn: 'LC1D32M7', desc: '32A AC-3 15kW 220V AC coil industrial motor contactor' },
      { name: 'Selec MFM384 Digital Multifunction Power Meter', brand: 'Selec', mpn: 'MFM384-C-CE', desc: 'True RMS, 3-phase V, A, kW, kVA, PF, Hz, kWh with RS485 Modbus communication' }
    ],
    technicalStandards: ['IEC 61439-1/2 (Low-voltage switchgear assemblies)', 'IP54 / IP55 Enclosure Rating', 'IEC 60947 (Switchgear and Controlgear)'],
    warrantyTerms: '36 Months Guarantee on Enclosure and Busbar Integrity, 18 Months on Active Switchgear Components.',
    turnaroundTime: '7 to 15 Business Days from technical approval of drawing.',
    relatedProjectSlug: 'industrial-panel-board-commissioning',
    relatedProjectName: 'Industrial Panel Board Commissioning'
  }
];
