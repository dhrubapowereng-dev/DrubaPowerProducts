export interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  location: string;
  locationBn: string;
  category: string;
  status: 'completed' | 'ongoing';
  statusLabel: string;
  statusLabelBn: string;
  progress: number;
  image: string;
  galleryImages: string[];
  scope: string;
  scopeBn: string;
  clientType: string;
  capacityOrRating: string;
  completionDate: string;
  overview: string;
  overviewBn: string;
  technicalHighlights: string[];
  equipmentInstalled: string[];
  challengesResolved: string;
}

export const PROJECTS_DATA: ProjectDetail[] = [
  {
    id: 'p1',
    slug: 'commercial-electrical-wiring-renovation',
    title: 'Commercial Electrical Wiring Renovation',
    titleBn: 'বাণিজ্যিক বৈদ্যুতিক ওয়্যারিং সংস্কার',
    location: 'Barishal City Center',
    locationBn: 'বরিশাল সিটি সেন্টার',
    category: 'Electrical Wiring',
    status: 'ongoing',
    statusLabel: 'Ongoing',
    statusLabelBn: 'চলমান',
    progress: 82,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    scope: 'Complete rewire of a 6-storey commercial complex with hot-dip galvanized cable trays, sub-panel upgrades, and balanced breaker coordination.',
    scopeBn: '৬ তলা বাণিজ্যিক কমপ্লেক্সের পূর্ণাঙ্গ ওয়্যারিং সংস্কার, ক্যাবল ট্রে নেটওয়ার্ক, সাব-প্যানেল আপগ্রেড ও লোড ব্যালান্সিং।',
    clientType: 'Commercial Shopping Complex & Corporate Suites',
    capacityOrRating: '400A Main Service, 12 Sub-Distribution Boards',
    completionDate: 'Target: Q4 2026',
    overview: 'This project involves replacing aged, fire-hazardous electrical cabling across a multi-tenant commercial plaza with compliant copper wiring, fire-rated conduits, and precision-calibrated Schneider circuit breakers. Our engineering team designed overhead perforated cable trays to keep lines organized, accessible, and compliant with BNBC fire codes.',
    overviewBn: 'এই প্রকল্পে একটি বহুতল বাণিজ্যিক প্লাজার পুরোনো ও ঝুঁকিপূর্ণ ওয়্যারিং সম্পূর্ণ পরিবর্তন করে আন্তর্জাতিক মানের কপার ক্যাবলিং ও ফায়ার-রেটেড ডাক্টিং করা হচ্ছে। এতে লোড ভাগ করে শর্ট সার্কিট ও অগ্নিকাণ্ডের ঝুঁকি স্থায়ীভাবে দূর করা হয়েছে।',
    technicalHighlights: [
      'Over 2,400 meters of BRB XLPE multi-core copper power cables installed',
      'Hot-dip galvanized perforated cable trays with secure partition dividers for data and power',
      'Installation of 12 custom compartmentalized Sub-Distribution Boards (SDB)',
      'Implementation of 30mA Residual Current Circuit Breakers (RCCB) on all consumer outlets for life safety',
      'Phase load balancing achieving under 4% neutral imbalance under peak operating loads'
    ],
    equipmentInstalled: [
      'Schneider Acti9 iC60N MCBs (10A, 16A, 20A, 32A)',
      'Schneider Compact NSX160F 160A 3P MCCBs',
      'BRB 4-Core 70mm² NYY Copper Armored Feeders',
      'Legrand 150x50mm Perforated Cable Trays with Couplers'
    ],
    challengesResolved: 'Executing full rewiring and panel swaps during off-peak weekend hours to prevent business interruption for ground-floor retail tenants.'
  },
  {
    id: 'p2',
    slug: 'cctv-security-network-for-warehouse',
    title: 'CCTV Security Network for Warehouse',
    titleBn: 'গুদামের জন্য সিসিটিভি সিকিউরিটি নেটওয়ার্ক',
    location: 'Jhalokathi Port Road',
    locationBn: 'ঝালকাঠি পোর্ট রোড',
    category: 'Surveillance & Security',
    status: 'ongoing',
    statusLabel: 'Ongoing',
    statusLabelBn: 'চলমান',
    progress: 45,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
    ],
    scope: 'Enterprise AcuSense AI IP camera grid, 32-channel NVR with RAID storage, optical fiber backbone, and perimeter tripwire alarms.',
    scopeBn: '৩৫,০০০ বর্গফুটের গুদামে এআই অ্যাকুসেন্স ক্যামেরা, অপটিক্যাল ফাইবার ব্যাকবোন এবং সেন্ট্রাল রেইড এনভিআর স্টোরেজ।',
    clientType: 'Regional Commodity & Agricultural Storage Logistics Center',
    capacityOrRating: '48 IP Cameras (4MP & 8MP), 64TB Central Storage',
    completionDate: 'Target: Q4 2026',
    overview: 'Deploying an industrial-grade surveillance network across 35,000 square feet of storage bays, loading docks, and exterior gates. The deployment employs optical fiber links connecting remote sheds back to a climate-controlled central security desk equipped with multi-monitor surveillance consoles and battery-backed power systems.',
    overviewBn: 'ঝালকাঠির প্রধান গুদাম এলাকায় নিরাপত্তা নিশ্চিতে ফাইবার অপটিক নেটওয়ার্কের মাধ্যমে ৪৮টি এআই ক্যামেরা ও সেন্ট্রাল কন্ট্রোল কনসোল স্থাপন করা হচ্ছে। গভীর রাতেও রঙ্গিন ছবি এবং বাউন্ডারি পেরোলেই তাৎক্ষণিক সাইরেন বাজার প্রযুক্তি যুক্ত রয়েছে।',
    technicalHighlights: [
      'Multi-mode 6-core armored optical fiber linking 4 independent warehouse sheds',
      'Human and vehicle classification algorithms filtering out wind, rain, and animal motion alerts',
      'ColorVu technology providing crisp 24/7 full-color video under ultra-low ambient light',
      'Dual redundant 24-port PoE gigabit network switches with surge suppression',
      'Offline UPS support offering 4 hours of uninterrupted recording during grid outages'
    ],
    equipmentInstalled: [
      'Hikvision DS-2CD2043G2-I 4MP AcuSense Bullet IP Cameras',
      'Hikvision DS-2CD2T87G2-LSU 8MP ColorVu Fixed Bullet Cameras',
      'Hikvision DS-7732NXI-I4/16P 32-Channel 4K NVR with 4 SATA Bays',
      'Western Digital Purple Pro 8TB 7200RPM Surveillance Drives'
    ],
    challengesResolved: 'Eliminating packet loss and interference over 300+ meter distances between perimeter sheds using fiber media converters and ruggedized enclosures.'
  },
  {
    id: 'p3',
    slug: 'industrial-panel-board-commissioning',
    title: 'Industrial Panel Board Commissioning',
    titleBn: 'ইন্ডাস্ট্রিয়াল প্যানেল বোর্ড কমিশনিং',
    location: 'Bhola Industrial Estate',
    locationBn: 'ভোলা ইন্ডাস্ট্রিয়াল এস্টেট',
    category: 'Panel Board',
    status: 'ongoing',
    statusLabel: 'Ongoing',
    statusLabelBn: 'চলমান',
    progress: 68,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
    ],
    scope: 'Fabrication, assembly, and testing of a 630A LT switchboard, automatic motorized changeover switch (ATS), and 120 kVAR PFI capacitor bank.',
    scopeBn: '৬৩০এ মেইন এলটি সুইচবোর্ড, মটোরাইজড চেঞ্জওভার (ATS) এবং ১২০ কেভিএআর পিএফআই ক্যাপাসিটর প্যানেল নির্মাণ ও কমিশনিং।',
    clientType: 'Rice Milling & Agro-Processing Industrial Plant',
    capacityOrRating: '630A 415V 50Hz, 120 kVAR PFI Step Plant',
    completionDate: 'Target: Q4 2026',
    overview: 'Engineering a custom Form 2b LT distribution switchgear panel designed to control heavy inductive motor loads. The panel features automatic mains-to-generator transfer within 8 seconds and automatic multi-stage capacitor banks to maintain a power factor of 0.98, shielding the facility from utility power factor penalty tariffs.',
    overviewBn: 'ভারী মোটরের ইনডাক্টিভ লোড পরিচালনার জন্য কাস্টমাইজড এলটি প্যানেল ও পিএফআই ব্যাংক তৈরি করা হয়েছে। মেইন বিদ্যুৎ ও জেনারেটরের মধ্যে মাত্র ৮ সেকেন্ডে স্বয়ংক্রিয় পাওয়ার শিফটিং এবং ০.৯৮ পাওয়ার ফ্যাক্টর নিশ্চিত করার মাধ্যমে বিদ্যুৎ বিলের জরিমানা সাশ্রয় করা হয়েছে।',
    technicalHighlights: [
      'Form 2b compartmentalized design isolating busbar, functional breaker units, and cable entries',
      'Electrolytic copper busbars sized for 50°C ambient temperature rise with 36kA 1s withstand',
      'Microprocessor automatic power factor controller with harmonic detuned filter reactors',
      'Dual digital metering with real-time THD (Total Harmonic Distortion) monitoring',
      'Motorized 630A 4-pole mechanical interlocked automatic changeover switch'
    ],
    equipmentInstalled: [
      'Schneider Compact NSX630F 630A 4P 36kA MCCB',
      'ABB Formula A1N 125 3P MCCBs for Motor Feeder Circuits',
      'Epcos / TDK Heavy Duty Power Capacitors (10, 20 & 25 kVAR Steps)',
      'Socomec ATyS d M 630A 4P Motorized Changeover Switch'
    ],
    challengesResolved: 'Filtering severe electrical harmonics generated by heavy variable speed conveyor motors that previously triggered nuisance breaker tripping.'
  },
  {
    id: 'p4',
    slug: 'lightning-protection-for-multi-storey-building',
    title: 'Lightning Protection for Multi-Storey Building',
    titleBn: 'বহুতল ভবনের জন্য বজ্রপাত সুরক্ষা',
    location: 'Patuakhali Medical College Area',
    locationBn: 'পটুয়াখালী মেডিকেল কলেজ এলাকা',
    category: 'Lightning Protection',
    status: 'completed',
    statusLabel: 'Completed',
    statusLabelBn: 'সম্পন্ন',
    progress: 100,
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    ],
    scope: 'NFC 17-102 certified ESE Early Streamer Emission air terminal, electrolytic copper down conductors, and low-resistance chemical earthing pit.',
    scopeBn: 'এনএফসি ১৭-১০২ সার্টিফাইড ESE এয়ার টার্মিনাল, ইলেক্ট্রোলাইটিক কপার ডাউন কন্ডাক্টর ও ০.৬৫ ওহম কেমিক্যাল আর্থিং।',
    clientType: '10-Storey Mixed Residential & Clinical Healthcare Facility',
    capacityOrRating: '107m Protection Radius (Level IV), < 0.65 Ohm Earth Resistance',
    completionDate: 'Completed: August 2026',
    overview: 'Patuakhali coastal belt experiences high flash density during pre-monsoon convective storms. Dhruba Power designed and installed a French standard NFC 17-102 compliant ESE active air terminal mounted 6 meters above the building parapet, safely grounding atmospheric strikes through a specialized chemical earth pit.',
    overviewBn: 'উপকূলীয় পটুয়াখালী এলাকায় উচ্চমাত্রার বজ্রপাত থেকে ১০ তলা বিশিষ্ট হাসপাতাল ও আবাসিক ভবন রক্ষায় ESE সক্রিয় বজ্রপাত প্রতিরোধ ব্যবস্থা স্থাপন করা হয়েছে। এর মাধ্যমে ভবনের চারপাশের ১০৭ মিটার এলাকা সম্পূর্ণ নিরাপদ রাখা সম্ভব হয়েছে।',
    technicalHighlights: [
      'High-grade stainless steel 316 active ESE terminal with Δt = 60 microsecond emission advantage',
      'Dual electrolytic bare copper down conductors anchored with UV-stabilized DC clamps',
      'Electromagnetic surge counter installed at 2 meters above ground level to register direct strikes',
      'Deep bored 80-foot chemical earth pit using carbon-conductive ground enhancement backfill',
      'Final tested earth pit resistance achieved 0.65 Ohm (well below BNBC 1.0 Ohm limit)'
    ],
    equipmentInstalled: [
      'Forend Petex-S ESE Active Lightning Terminal (Δt = 60μs)',
      'Forend Mechanical 6-Digit Lightning Strike Counter',
      '25x3mm Annealed High-Conductivity Copper Flat Tape',
      'Heavy-Duty Cast Iron Ground Inspection Test Well'
    ],
    challengesResolved: 'Reaching low resistance in sandy coastal soil layers by utilizing high-performance bentonite conductive compounds and multi-rod interconnected earth grids.'
  },
  {
    id: 'p5',
    slug: 'hybrid-solar-system-for-commercial-building',
    title: 'Hybrid Solar System for Commercial Building',
    titleBn: 'বাণিজ্যিক ভবনের জন্য হাইব্রিড সোলার সিস্টেম',
    location: 'Barishal Sadar Commercial District',
    locationBn: 'বরিশাল সদর বাণিজ্যিক এলাকা',
    category: 'Solar Power',
    status: 'completed',
    statusLabel: 'Completed',
    statusLabelBn: 'সম্পন্ন',
    progress: 100,
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
    ],
    scope: '30 kW hybrid solar array with lithium battery backup, high-efficiency Growatt inverters, and net metering integration.',
    scopeBn: '৩০ কিলোওয়াট হাইব্রিড সোলার সিস্টেম, লিথিয়াম ব্যাটারি ব্যাকআপ, গ্রোওয়াট ইনভার্টার এবং নেট-মিটারিং সংযোগ।',
    clientType: 'Commercial Corporate Headquarters & Diagnostic Labs',
    capacityOrRating: '30 kWp DC PV Array, 30 kWh Lithium Battery Energy Storage',
    completionDate: 'Completed: July 2026',
    overview: 'Engineered to reduce grid reliance and eliminate silent diesel generator costs during rolling blackouts. The installation combines 54 Tier-1 monofacial modules with intelligent hybrid inverter controllers, prioritizing self-consumption, battery reserve storage, and feeding excess afternoon energy back into the WZPDCL grid.',
    overviewBn: 'বিদ্যুৎ বিভ্রাটে জেনারেটরের উচ্চ ব্যয় বন্ধে এবং গ্রিডের বিদ্যুৎ খরচ অর্ধেকের বেশি কমিয়ে আনতে এই ৩০ কিলোওয়াট হাইব্রিড সোলার সিস্টেম স্থাপন করা হয়েছে। সারাদিন বিদ্যুৎ উৎপাদনের পাশাপাশি অতিরিক্ত বিদ্যুৎ জাতীয় গ্রিডে বিক্রি হচ্ছে।',
    technicalHighlights: [
      'Tier-1 LONGi Hi-MO 6 Explorer 575W modules with high-efficiency HPBC cell structure',
      'Anodized aluminium anti-corrosion ground rails rated for 140 km/h wind gust loads',
      'Three Growatt SPH 10000TL3-BH-UP hybrid inverters running in synchronized parallel mode',
      '30 kWh high-voltage lithium iron phosphate (LiFePO4) rack-mounted battery bank',
      'Net metering approval obtained through WZPDCL Barishal Division within 3 weeks'
    ],
    equipmentInstalled: [
      '54 x LONGi LR5-72HTH-575M Solar PV Modules',
      '3 x Growatt SPH 10000TL3-BH-UP 3-Phase 10kW Hybrid Inverters',
      'Growatt ARK-2.5H-A1 High-Voltage Lithium Battery Stack (30 kWh)',
      'Hager 4P DC Circuit Breakers & Type II 1000V DC Surge Arresters'
    ],
    challengesResolved: 'Custom structural engineering to clear elevated water chiller units and ensure zero rooftop shading across prime daylight hours.'
  },
  {
    id: 'p6',
    slug: '250-kva-factory-substation-upgrade',
    title: '250 KVA Factory Substation Upgrade',
    titleBn: '২৫০ কেভিএ ফ্যাক্টরি সাবস্টেশন আপগ্রেড',
    location: 'Barishal Industrial Area',
    locationBn: 'বরিশাল ইন্ডাস্ট্রিয়াল এলাকা',
    category: 'Substation',
    status: 'completed',
    statusLabel: 'Completed',
    statusLabelBn: 'সম্পন্ন',
    progress: 100,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    scope: '11/0.415 kV distribution transformer overhaul, HT vacuum circuit breaker (VCB) installation, and utility sanction sign-off.',
    scopeBn: '২৫০ কেভিএ তেল ট্রান্সফরমার স্থাপন, ১১ কেভি ভিসিবি প্যানেল ও বিদ্যুৎ উন্নয়ন বোর্ডের চূড়ান্ত ছাড়পত্র।',
    clientType: 'Cold Storage & Agro Production Plant',
    capacityOrRating: '250 kVA 11/0.415 kV, 630A HT/LT Substation',
    completionDate: 'Completed: May 2026',
    overview: 'The factory required expanding production capacity with reliable three-phase power. Dhruba Power managed the entire turnkey project: civil transformer bay construction, transformer rigging, HT switchgear integration, oil dielectric breakdown testing (BDV > 60kV), and formal utility inspection sign-offs.',
    overviewBn: 'উৎপাদন বৃদ্ধির লক্ষ্যে একটি কোল্ড স্টোরেজ কারখানায় পুরোনো ট্রান্সফরমার সরিয়ে নতুন ২৫০ কেভিএ সাবস্টেশন স্থাপন করা হয়েছে। সিভিল ফাউন্ডেশন থেকে শুরু করে ভিসিবি প্যানেল সংযোগ এবং সরকারি বিদ্যুৎ ছাড়পত্র সফলভাবে শেষ করা হয়েছে।',
    technicalHighlights: [
      '250 kVA copper-wound ONAN distribution transformer with high-dielectric mineral oil insulation',
      'Siemens 11kV Vacuum Circuit Breaker panel with dual overcurrent and earth fault protective relays',
      'Main LT switchboard equipped with 400A motorized MCCB incomer and mechanical interlock',
      '100 kVAR automatic PFI capacitor bank maintaining power factor between 0.96 and 0.98',
      'Four interconnected chemical earth pits achieving combined earth grid resistance of 0.52 Ohm'
    ],
    equipmentInstalled: [
      'Energypac 250 kVA 11/0.415 kV Distribution Transformer',
      'Siemens SIMOPRIME 11kV VCB Indoor Switchgear Panel',
      'Schneider Compact NSX400F 400A 3P MCCB',
      'Selec 8-Step Automatic Power Factor Controller'
    ],
    challengesResolved: 'Hot-swapping the main transformer within a strict 18-hour plant shutdown window to protect perishable inventory inside refrigeration units.'
  }
];
