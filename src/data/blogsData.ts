export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  excerpt: string;
  excerptBn: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: string[];
  contentBn: string[];
  tags: string[];
}

export const BLOGS_DATA: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'substation-maintenance-and-safety-protocols',
    title: 'Essential Substation Maintenance & Safety Protocols for Factories in Bangladesh',
    titleBn: 'বাংলাদেশে শিল্প কারখানার সাবস্টেশন রক্ষণাবেক্ষণ ও জরুরি নিরাপত্তা বিধি',
    excerpt: 'Key preventive measures to avoid transformer overheating, dielectric breakdown, and costly factory downtime during peak monsoon and summer loads.',
    excerptBn: 'গ্রীষ্ম ও বর্ষা মৌসুমে শিল্প কারখানার ট্রান্সফরমার গরম হওয়া, তেলের কার্যক্ষমতা হ্রাস ও বিদ্যুৎ বিপর্যয় এড়াতে করণীয়।',
    author: 'Engr. Anup Roy',
    authorRole: 'Senior Substation & Switchgear Engineer',
    date: 'August 14, 2026',
    readTime: '6 min read',
    category: 'Substation Engineering',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    tags: ['Substation', 'Transformers', 'Industrial Safety', 'Maintenance'],
    content: [
      'Industrial electrical substations operate under severe environmental stress in Bangladesh. High ambient temperatures, excessive humidity during the monsoon season, and dust accumulation can accelerate insulation degradation, leading to catastrophic equipment failure.',
      '1. Regular Transformer Oil Dielectric Breakdown Voltage (BDV) Testing: Transformer oil serves a dual purpose — electrical insulation and thermal cooling. We recommend carrying out BDV testing at least once every 6 months. For an 11kV distribution transformer, the breakdown voltage should never fall below 40kV.',
      '2. Thermal Imaging Inspections: Infrared thermography is the fastest non-intrusive way to identify loose bolted connections, unbalanced loads, and overheated busbar joints. Overheating joints will eventually arc, causing phase-to-phase short circuits.',
      '3. Cleaning Silica Gel Breathers: The silica gel in the conservator tank breather absorbs atmospheric moisture. When the gel transitions from deep cobalt blue to pale pink, it indicates moisture saturation. Saturated gel must be regenerated in an oven at 150°C or immediately replaced to prevent moisture ingress into the transformer core.',
      '4. Power Factor Improvement (PFI) Capacitor Audits: Swelling or leaking capacitor cans must be decommissioned immediately. Ensure your PFI controller switches steps smoothly to keep the overall plant power factor above 0.95 and avoid steep penalty surcharges on your monthly utility bills.'
    ],
    contentBn: [
      'বাংলাদেশের আবহাওয়ায় উচ্চ আর্দ্রতা, ধুলাবালি এবং গ্রীষ্মের অতিরিক্ত তাপমাত্রা শিল্প কারখানার সাবস্টেশনের যন্ত্রাংশের ওপর মারাত্মক চাপ সৃষ্টি করে। সঠিক রক্ষণাবেক্ষণ না করলে ট্রান্সফরমার নষ্ট হয়ে উৎপাদন মারাত্মকভাবে ব্যাহত হতে পারে।',
      '১. ট্রান্সফরমার অয়েল বিডিভি টেস্ট: প্রতি ৬ মাসে অন্তত একবার ট্রান্সফরমার তেলের ডাই-ইলেকট্রিক ব্রেকডাউন ভোল্টেজ পরীক্ষা করা অপরিহার্য। ১১ কেভি সাবস্টেশনের জন্য তেলের বিডিভি মান ৪০ কেভির নিচে নামা উচিত নয়।',
      '২. থার্মাল ইমেজিং পর্যবেক্ষণ: ইনফ্রারেড থার্মাল ক্যামেরার সাহায্যে সংযোগস্থলের অতিরিক্ত তাপ বা লুজ কানেকশন চিহ্নিত করা যায়, যা অগ্নিকাণ্ড রোধে কার্যকর।',
      '৩. সিলিকা জেল ব্রিদার নিয়মিত পরীক্ষা: সিলিকা জেলের স্বাভাবিক রং নীল। আর্দ্রতা শুষে এটি হালকা গোলাপি হলে দ্রুত পরিবর্তন করা জরুরি, অন্যথায় ট্রান্সফরমারের মূল ট্যাংকে জলীয় বাষ্প প্রবেশ করবে।',
      '৪. পিএফআই ক্যাপাসিটর পর্যবেক্ষণ: ক্যাপাসিটর ফুলে গেলে বা ফেটে গেলে দ্রুত পরিবর্তন করুন এবং বিদ্যুৎ বিলের সারচার্জ এড়াতে পাওয়ার ফ্যাক্টর ০.৯৫ এর ওপরে রাখুন।'
    ]
  },
  {
    id: 'blog-2',
    slug: 'solar-net-metering-guidelines-bangladesh',
    title: 'How Industrial Facilities Can Maximize ROI with Solar Net-Metering in Bangladesh',
    titleBn: 'বাংলাদেশে নেট-মিটারিং সোলার সিস্টেম স্থাপন করে কীভাবে বিদ্যুৎ বিল সাশ্রয় করবেন',
    excerpt: 'An engineering overview of SREDA net-metering guidelines, utility connection steps with BPDB/WZPDCL, and financial payback models.',
    excerptBn: 'সরকারি স্রেডা নেট-মিটারিং নীতিমালা, বিদ্যুৎ উন্নয়ন বোর্ড অনুমোদন এবং কারখানার বিদ্যুৎ খরচ কমানোর উপায়।',
    author: 'Binay Sikder',
    authorRole: 'Solar Power System Specialist',
    date: 'July 28, 2026',
    readTime: '8 min read',
    category: 'Solar Energy',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    tags: ['Solar Power', 'Net Metering', 'Renewable Energy', 'SREDA'],
    content: [
      'With grid electricity tariffs climbing steadily across commercial and industrial tariff classes (E and F categories), rooftop solar photovoltaic (PV) systems combined with net-metering offer one of the highest returns on investment in Bangladesh.',
      'Under the Sustainable and Renewable Energy Development Authority (SREDA) Net Metering Guidelines, consumers can install grid-tied solar systems up to 70% of their sanctioned electrical load. During bright sunny hours, any excess solar electricity generated beyond plant consumption is exported to the national grid.',
      'At the end of the billing cycle, the distribution utility (WZPDCL, BPDB, BREB, or DESCO) deducts the exported units from your imported grid units. If you export more than you import, the credit rolls over to the following month.',
      'To guarantee a rapid payback within 3.5 to 4.5 years, factories must prioritize Tier-1 N-Type TOPCon bifacial modules, high-efficiency European or Tier-1 string inverters (such as Growatt, Huawei, or Sungrow), and hot-dip galvanized mounting structures engineered to withstand 140 km/h coastal cyclonic gusts.'
    ],
    contentBn: [
      'শিল্প কারখানায় বিদ্যুৎ বিল প্রতিনিয়ত বৃদ্ধির কারণে ছাদের খালি জায়গায় সোলার নেট-মিটারিং স্থাপন এখন সবচেয়ে লাভজনক বিনিয়োগ।',
      'সরকারি স্রেডা (SREDA) নীতিমালা অনুযায়ী অনুমোদিত লোডের সর্বোচ্চ ৭০% পর্যন্ত সোলার সিস্টেম স্থাপন করা যায়। কারখানা চলাকালীন উৎপাদিত বিদ্যুৎ কারখানায় ব্যবহৃত হয় এবং অতিরিক্ত বিদ্যুৎ দ্বিমুখী মিটারের মাধ্যমে জাতীয় গ্রিডে রপ্তানি হয়।',
      'মাস শেষে বিতরণকারী সংস্থা (ওজোপাডিকো, পিডিবি বা পল্লী বিদ্যুৎ) আমদানি করা ইউনিট থেকে রপ্তানিকৃত ইউনিট বিয়োগ করে বিল তৈরি করে। ফলে কারখানার বিদ্যুৎ বিল ৫০% থেকে ৭০% পর্যন্ত কমে যায়।',
      'মাত্র ৩.৫ থেকে ৪ বছরে বিনিয়োগ তুলে আনতে উচ্চক্ষমতার এন-টাইপ বাইফেসিয়াল সোলার প্যানেল এবং উন্নত ইনভার্টার ব্যবহার করা উচিত।'
    ]
  },
  {
    id: 'blog-3',
    slug: 'lightning-protection-ese-arrester-calculation',
    title: 'Early Streamer Emission (ESE) vs Conventional Franklins: Sizing Arrester Protection Radii',
    titleBn: 'বজ্রপাত প্রতিরোধে ESE এয়ার টার্মিনাল বনাম সাধারণ ফ্রাঙ্কলিন রডের কার্যকারিতা',
    excerpt: 'Understanding NFC 17-102 radius formulas, triggering advance time (Δt), and soil conductivity enhancement for effective earthing.',
    excerptBn: 'এনএফসি ১৭-১০২ আন্তর্জাতিক মান, আর্লি স্ট্রিমার এমিশন প্রযুক্তির রেডিয়াস এবং কেমিক্যাল আর্থিংয়ের গুরুত্ব।',
    author: 'Engr. Fatima Begum',
    authorRole: 'Lightning & Grounding Specialist',
    date: 'June 19, 2026',
    readTime: '5 min read',
    category: 'Lightning Protection',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    tags: ['Lightning Arrester', 'ESE', 'Earthing', 'Safety'],
    content: [
      'Bangladesh is recognized internationally as one of the regions most prone to frequent and deadly lightning strikes. For expansive factories, multi-storey commercial towers, and industrial plots, traditional Franklin lightning rods offer narrow protection cones requiring dozens of roof penetrations.',
      'By comparison, Early Streamer Emission (ESE) air terminals initiate an upward leader earlier than surrounding grounded points when an approaching downward step leader is detected. This triggering advance time (typically Δt = 60 microseconds) generates a significantly larger protective envelope covering up to a 107-meter radius from a single elevated mast.',
      'However, even the most advanced air terminal is rendered completely useless without a low-impedance earthing grid. Lightning surge currents exceed 100 kiloamperes with microsecond rise times. Dhruba Power utilizes deep-bored chemical earth pits with conductive backfill compounds to consistently achieve earth resistance below 1.0 Ohm, preventing back-flashover hazards.'
    ],
    contentBn: [
      'বাংলাদেশে বজ্রপাতের সংখ্যা অত্যন্ত বেশি। বড় কারখানা ও বহুতল ভবনে সাধারণ রডের তুলনায় আধুনিক ESE (Early Streamer Emission) এয়ার টার্মিনাল অনেক বেশি কার্যকর।',
      'ESE টার্মিনাল মেঘের বিদ্যুতের উপস্থিতি আগেভাগে বুঝতে পেরে আপওয়ার্ড লিডার তৈরি করে এবং বিদ্যুৎকে নিজের দিকে আকর্ষণ করে দ্রুত মাটিতে পাঠিয়ে দেয়। একটি ESE টার্মিনাল দিয়ে প্রায় ১০৭ মিটার ব্যাসার্ধ পর্যন্ত এলাকা সুরক্ষিত রাখা সম্ভব।',
      'বজ্রপাতের কারেন্ট নিরাপদে মাটিতে ছড়াতে হলে মাটির আর্থিং রেজিস্ট্যান্স ১ ওহমের নিচে থাকতে হবে। আমরা গভীর বোরিং ও কেমিক্যাল আর্থিংয়ের মাধ্যমে এই সুরক্ষা নিশ্চিত করি।'
    ]
  },
  {
    id: 'blog-4',
    slug: 'mccb-vs-mcb-selection-guide-industrial-panels',
    title: 'Selecting the Right Circuit Protection: MCB vs MCCB vs ACB in Industrial Distribution',
    titleBn: 'শিল্প কারখানায় সার্কিট ব্রেকার নির্বাচন: MCB, MCCB নাকি ACB কখন কোনটি ব্যবহার করবেন?',
    excerpt: 'Detailed comparison of breaking capacity (Icu/Ics), tripping curves, adjustable thermal-magnetic releases, and selective breaker coordination.',
    excerptBn: 'ব্রেকিং ক্যাপাসিটি, ট্রিপিং কার্ভ এবং শর্ট সার্কিট সুরক্ষায় সঠিক রেটিংয়ের ব্রেকার নির্বাচনের প্রকৌশল নির্দেশিকা।',
    author: 'Engr. Anup Roy',
    authorRole: 'Senior Substation & Switchgear Engineer',
    date: 'May 10, 2026',
    readTime: '7 min read',
    category: 'Switchgear & Breakers',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    tags: ['Circuit Breakers', 'MCCB', 'MCB', 'ACB', 'Switchgear'],
    content: [
      'Choosing the right circuit breaker for an industrial panel is essential for protecting valuable machinery, preventing plant fires, and ensuring selective coordination so that a local fault does not trip your entire factory incomer.',
      'Miniature Circuit Breakers (MCB): Designed for low current applications (typically 0.5A to 63A, occasionally up to 100A or 125A), with fixed tripping characteristics (B, C, or D curves) and breaking capacities between 4.5kA and 10kA. MCBs are ideal for lighting circuits, single-phase motors, and small branch distribution.',
      'Moulded Case Circuit Breakers (MCCB): Engineered for industrial distribution feeders ranging from 16A up to 1600A. MCCBs offer high breaking capacities (typically 16kA, 25kA, 36kA, up to 70kA) and adjustable thermal (overload) and magnetic (short circuit) trip settings.',
      'Air Circuit Breakers (ACB): Deployed as main incomers for high-capacity power systems from 630A up to 6300A. ACBs incorporate microprocessor trip units (such as ABB Ekip or Schneider Micrologic), withstand heavy short-circuit stress (50kA to 100kA for 1 second), and allow motorized racking and remote SCADA monitoring.'
    ],
    contentBn: [
      'শিল্প কারখানায় সঠিক ব্রেকার নির্বাচন না করলে ছোটখাটো ত্রুটিতেও পুরো কারখানার বিদ্যুৎ বন্ধ হয়ে যেতে পারে অথবা যন্ত্রাংশ পুড়ে যেতে পারে।',
      'MCB (মিনিয়েচার সার্কিট ব্রেকার): ০.৫ থেকে ৬৩ অ্যাম্পিয়ার পর্যন্ত লাইটিং ও ছোট মোটরের ক্ষেত্রে ব্যবহৃত হয়। এর ব্রেকিং ক্যাপাসিটি সাধারণত ৬ থেকে ১০ কেএ।',
      'MCCB (মোল্ডেড কেস সার্কিট ব্রেকার): ১৬ থেকে ১৬০০ অ্যাম্পিয়ার পর্যন্ত ভারী যন্ত্রপাতি ও ডিস্ট্রিবিউশন প্যানেলে ব্যবহৃত হয়। এর ট্রিপিং কারেন্ট প্রয়োজনমতো অ্যাডজাস্ট করা যায়।',
      'ACB (এয়ার সার্কিট ব্রেকার): ৬৩০ থেকে ৬৩০০ অ্যাম্পিয়ার পর্যন্ত সাবস্টেশনের মূল ইনকামার হিসেবে ব্যবহৃত হয়। এতে আধুনিক মাইক্রোপ্রসেসর ও দূরনিয়ন্ত্রণ সুবিধা থাকে।'
    ]
  }
];
