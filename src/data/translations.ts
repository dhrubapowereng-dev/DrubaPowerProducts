export type Language = 'en' | 'bn';

export interface TranslationDictionary {
  // Top utility bar
  location: string;
  authSupply: string;
  hotline: string;
  email: string;
  whatsapp: string;
  accountLogin: string;
  dealerPortal: string;
  adminPortal: string;

  // Header Nav
  home: string;
  products: string;
  eee: string;
  cctv: string;
  solar: string;
  allProducts: string;
  brands: string;
  applications: string;
  services: string;
  projects: string;
  experts: string;
  blog: string;
  contact: string;

  // Search & Actions
  searchPlaceholder: string;
  searchBtn: string;
  compare: string;
  comparing: string;
  wishlistBom: string;
  rfqBasket: string;
  submitRfq: string;
  requestQuote: string;
  quotePrompt: string;
  priceOnRequest: string;
  inStock: string;
  stockLocation: string;
  readyStockOnly: string;
  viewDetails: string;
  addedToRfq: string;
  addToRfq: string;

  // Catalogue & Filters
  catalogueHeading: string;
  technicalFilters: string;
  manufacturerBrand: string;
  ratedCurrent: string;
  poles: string;
  breakingCapacity: string;
  resetFilters: string;
  clearAll: string;
  activeFilters: string;
  modelsFound: string;
  noProductsFound: string;

  // Core Services
  substationTitle: string;
  substationDesc: string;
  solarSystemTitle: string;
  solarSystemDesc: string;
  lightningTitle: string;
  lightningDesc: string;
  wiringTitle: string;
  wiringDesc: string;
  cctvInstallTitle: string;
  cctvInstallDesc: string;
  panelBoardTitle: string;
  panelBoardDesc: string;

  // Homepage Highlights
  heroHeadline: string;
  heroSubheadline: string;
  yearsExperience: string;
  projectsCompleted: string;
  emergencyResponse: string;
  productServiceConnectionTitle: string;
  productServiceConnectionDesc: string;
  workProcessTitle: string;
  workProcessDesc: string;

  // Specifications & Technical
  techSpecs: string;
  documents: string;
  manufacturer: string;
  officialManufacturerPortal: string;
  compatibleProducts: string;
  verifiedAccessories: string;
  directReplacements: string;
  sameSeriesModels: string;
  datasheet: string;
  manual: string;
  certificate: string;

  // Company & Footer
  companyName: string;
  companyTagline: string;
  barishalAddress: string;
  copyright: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    // Top Bar
    location: 'Barishal Division, Bangladesh',
    authSupply: 'Authorized Engineering & Switchgear Supply',
    hotline: 'Hotline',
    email: 'info@dhrubapower.com',
    whatsapp: 'WhatsApp Support',
    accountLogin: 'Account / Login',
    dealerPortal: 'Customer & Project Hub',
    adminPortal: 'Staff Portal',

    // Header Nav
    home: 'Home',
    products: 'Products',
    eee: 'Electrical Engineering Equipment',
    cctv: 'CCTV & Surveillance',
    solar: 'Solar Energy & Inverters',
    allProducts: 'All Industrial Products',
    brands: 'Brands',
    applications: 'Applications',
    services: 'Services',
    projects: 'Projects',
    experts: 'Experts',
    blog: 'Technical Articles',
    contact: 'Contact',

    // Search & Actions
    searchPlaceholder: 'Search products, brands, models or specifications (e.g. ABB SH201-C20, 100A MCCB, 5kW Inverter)...',
    searchBtn: 'Search',
    compare: 'Compare',
    comparing: 'Comparing',
    wishlistBom: 'BOM / Saved',
    rfqBasket: 'RFQ Basket',
    submitRfq: 'Submit RFQ',
    requestQuote: 'Request Quote',
    quotePrompt: 'Quote',
    priceOnRequest: 'Price on Request',
    inStock: 'In Stock',
    stockLocation: 'Barishal Warehouse',
    readyStockOnly: 'Ready Stock Only (Barishal)',
    viewDetails: 'View Specifications',
    addedToRfq: 'In Basket',
    addToRfq: 'Add to RFQ',

    // Catalogue & Filters
    catalogueHeading: 'Industrial Electrical, CCTV & Solar Products',
    technicalFilters: 'Technical Filters',
    manufacturerBrand: 'Manufacturer / Brand',
    ratedCurrent: 'Rated Current (Amperes)',
    poles: 'Number of Poles',
    breakingCapacity: 'Breaking Capacity (kA)',
    resetFilters: 'Reset',
    clearAll: 'Clear All',
    activeFilters: 'Active Filters',
    modelsFound: 'models',
    noProductsFound: 'No exact models found matching your specification criteria.',

    // Core Services
    substationTitle: 'Sub-Station Engineering',
    substationDesc: 'Turnkey 11kV/0.415kV substation design, transformer supply, HT/LT switchgear, testing, and approval.',
    solarSystemTitle: 'Solar System Installation',
    solarSystemDesc: 'Commercial and industrial on-grid, off-grid, and hybrid solar plant design with net metering integration.',
    lightningTitle: 'Lightning Protection & Earthing',
    lightningDesc: 'Early Streamer Emission (ESE) lightning arresters, surge arresters, copper earthing pits, and chemical grounding.',
    wiringTitle: 'Industrial Electrical Wiring',
    wiringDesc: 'Industrial cable tray design, armored power cable laying, busbar trunking systems (BBT), and factory electrification.',
    cctvInstallTitle: 'CC-TV Installation & Security',
    cctvInstallDesc: 'Industrial IP camera networks, AI AcuSense facial/vehicle detection, NVR storage arrays, and control room setups.',
    panelBoardTitle: 'LT / HT Panel Board Fabrication',
    panelBoardDesc: 'Custom motor control centers (MCC), power factor improvement (PFI) panels, distribution boards, and ATS synchronization.',

    // Homepage Highlights
    heroHeadline: 'Electrical, solar and substation engineering built for reliable growth.',
    heroSubheadline: 'Dhruba Power & Engineering provides switchgear, solar plants, substation, industrial wiring, lightning protection, and turnkey project execution across Bangladesh.',
    yearsExperience: '7+ Years Experience',
    projectsCompleted: '500+ Projects Completed',
    emergencyResponse: '24/7 Emergency Response',
    productServiceConnectionTitle: 'Engineering Products Linked with Turnkey Services',
    productServiceConnectionDesc: 'Every industrial item in our catalogue is supported by certified project installation, testing, and engineering consultation.',
    workProcessTitle: 'Our Engineering Work Process',
    workProcessDesc: 'From initial site survey and engineering drawings to procurement, commissioning, and continuous maintenance.',

    // Specifications & Technical
    techSpecs: 'Full Technical Specifications',
    documents: 'Datasheets & Compliance Documents',
    manufacturer: 'Manufacturer',
    officialManufacturerPortal: 'Verify on Official Manufacturer Portal',
    compatibleProducts: 'Compatible System Components',
    verifiedAccessories: 'Verified Factory Accessories',
    directReplacements: 'Direct Replacement / Superseded Equivalents',
    sameSeriesModels: 'Models in This Same Series',
    datasheet: 'Datasheet',
    manual: 'Manual',
    certificate: 'Certificate',

    // Company & Footer
    companyName: 'Dhruba Power & Engineering',
    companyTagline: 'Authorised industrial electrical switchgear, solar engineering, and security systems supplier in Bangladesh.',
    barishalAddress: 'Khan Sarak, Kazipar, C&B Road, Barishal 8200, Bangladesh',
    copyright: 'Dhruba Power & Engineering. All rights reserved. Industrial specifications verified against manufacturer standards.'
  },

  bn: {
    // Top Bar
    location: 'বরিশাল বিভাগ, বাংলাদেশ',
    authSupply: 'অনুমোদিত ইলেকট্রিক্যাল ও সুইচগিয়ার সাপ্লাই ডেস্ক',
    hotline: 'হটলাইন',
    email: 'info@dhrubapower.com',
    whatsapp: 'হোয়াটসঅ্যাপ সাপোর্ট',
    accountLogin: 'অ্যাকাউন্ট / লগইন',
    dealerPortal: 'কাস্টমার ও প্রজেক্ট হাব',
    adminPortal: 'স্টাফ পোর্টাল',

    // Header Nav
    home: 'হোম',
    products: 'পণ্যসমূহ',
    eee: 'ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং সরঞ্জাম',
    cctv: 'সিসিটিভি ও নজরদারি ব্যবস্থা',
    solar: 'সোলার এনার্জি ও ইনভার্টার',
    allProducts: 'সকল ইন্ডাস্ট্রিয়াল পণ্য',
    brands: 'ব্র্যান্ডসমূহ',
    applications: 'প্রয়োগ ক্ষেত্র',
    services: 'সেবাসমূহ',
    projects: 'প্রকল্পসমূহ',
    experts: 'প্রকৌশলী টিম',
    blog: 'টেকনিক্যাল আর্টিকেল',
    contact: 'যোগাযোগ',

    // Search & Actions
    searchPlaceholder: 'মডেল, পার্ট নম্বর (MPN), ব্র্যান্ড বা স্পেসিফিকেশন দিয়ে খুঁজুন (যেমন ABB SH201-C20, 100A MCCB, 5kW ইনভার্টার)...',
    searchBtn: 'খুঁজুন',
    compare: 'তুলনা করুন',
    comparing: 'তুলনা করা হচ্ছে',
    wishlistBom: 'বিওএম / সংরক্ষিত',
    rfqBasket: 'কোটেশন বাস্কেট',
    submitRfq: 'কোটেশন জমা দিন',
    requestQuote: 'কোটেশনের অনুরোধ',
    quotePrompt: 'কোটেশন',
    priceOnRequest: 'মূল্য জানতে যোগাযোগ করুন',
    inStock: 'স্টকে আছে',
    stockLocation: 'বরিশাল ওয়্যারহাউস',
    readyStockOnly: 'শুধুমাত্র রেডি স্টক (বরিশাল)',
    viewDetails: 'স্পেসিফিকেশন দেখুন',
    addedToRfq: 'বাস্কেটে যুক্ত',
    addToRfq: 'কোটেশনে যোগ করুন',

    // Catalogue & Filters
    catalogueHeading: 'ইন্ডাস্ট্রিয়াল ইলেকট্রিক্যাল, সিসিটিভি ও সোলার ক্যাটালগ',
    technicalFilters: 'টেকনিক্যাল ফিল্টার',
    manufacturerBrand: 'প্রস্তুতকারক / ব্র্যান্ড',
    ratedCurrent: 'রেটেড কারেন্ট (অ্যাম্পিয়ার)',
    poles: 'পোলের সংখ্যা',
    breakingCapacity: 'ব্রেকিং ক্যাপাসিটি (kA)',
    resetFilters: 'রিসেট',
    clearAll: 'সব মুছুন',
    activeFilters: 'সক্রিয় ফিল্টারসমূহ',
    modelsFound: 'মডেল',
    noProductsFound: 'আপনার নির্ধারিত স্পেসিফিকেশনের সাথে কোনো পণ্য মেলেনি।',

    // Core Services
    substationTitle: 'সাব-স্টেশন ইঞ্জিনিয়ারিং',
    substationDesc: '১১কেভি/০.৪১৫কেভি সাব-স্টেশন ডিজাইন, ট্রান্সফরমার সাপ্লাই, এইচটি/এলটি সুইচগিয়ার ও বিদ্যুৎ বোর্ডের অনুমোদন।',
    solarSystemTitle: 'সোলার সিস্টেম ইনস্টলেশন',
    solarSystemDesc: 'শিল্প ও বাণিজ্যিক অন-গ্রিড, অফ-গ্রিড ও হাইব্রিড সোলার প্ল্যান্ট এবং নেট-মিটারিং বাস্তবায়ন।',
    lightningTitle: 'বজ্রপাত সুরক্ষা ও আর্থিং',
    lightningDesc: 'ইএসই লাইটনিং অ্যারেস্টার, সার্জ প্রোটেকশন, কপার রড আর্থিং এবং কেমিক্যাল গ্রাউন্ডিং সিস্টেম।',
    wiringTitle: 'ইন্ডাস্ট্রিয়াল ইলেকট্রিক্যাল ওয়্যারিং',
    wiringDesc: 'কেবল ট্রে স্থাপন, আর্মার্ড পাওয়ার কেবল লেইং, বাসবার ট্রাঙ্কিং সিস্টেম (BBT) এবং ফ্যাক্টরি ইলেকট্রিফিকেশন।',
    cctvInstallTitle: 'সিসিটিভি ও সিকিউরিটি সিস্টেম',
    cctvInstallDesc: 'আইপি বুলেট ও ডোম ক্যামেরা, এআই অ্যাকুসেন্স ট্র্যাকিং, এনভিআর নেটওয়ার্ক ও সার্বক্ষণিক মনিটরিং রুম।',
    panelBoardTitle: 'এলটি / এইচটি প্যানেল বোর্ড তৈরি',
    panelBoardDesc: 'কাস্টম মোটর কন্ট্রোল সেন্টার (MCC), পাওয়ার ফ্যাক্টর ইমপ্রুভমেন্ট (PFI), ডিস্ট্রিবিউশন বোর্ড ও অটো এটিএস।',

    // Homepage Highlights
    heroHeadline: 'নির্ভরযোগ্য প্রবৃদ্ধির জন্য ইলেকট্রিক্যাল, সোলার ও সাবস্টেশন ইঞ্জিনিয়ারিং।',
    heroSubheadline: 'ধ্রুব পাওয়ার অ্যান্ড ইঞ্জিনিয়ারিং দিচ্ছে বাংলাদেশজুড়ে সুইচগিয়ার, সোলার প্ল্যান্ট, সাবস্টেশন, ফ্যাক্টরি ওয়্যারিং ও লাইটনিং প্রটেকশনের সম্পূর্ণ ইঞ্জিনিয়ারিং সেবা।',
    yearsExperience: '৭+ বছরের অভিজ্ঞতা',
    projectsCompleted: '৫০০+ সফল প্রজেক্ট সম্পন্ন',
    emergencyResponse: '২৪/৭ জরুরি কারিগরি সেবা',
    productServiceConnectionTitle: 'পণ্য ও ইঞ্জিনিয়ারিং সেবার সমন্বয়',
    productServiceConnectionDesc: 'আমাদের ক্যাটালগের প্রতিটি ইন্ডাস্ট্রিয়াল পণ্য দক্ষ প্রকৌশলী দ্বারা স্থাপন ও সার্বক্ষণিক পরীক্ষার নিশ্চয়তা পায়।',
    workProcessTitle: 'আমাদের কাজের কর্মপদ্ধতি',
    workProcessDesc: 'সাইট পরিদর্শন থেকে ড্রয়িং তৈরি, মানসম্মত ইকুইপমেন্ট সাপ্লাই, নির্ভুল কমিশনিং এবং নিয়মিত রক্ষণাবেক্ষণ।',

    // Specifications & Technical
    techSpecs: 'প্রযুক্তিগত স্পেসিফিকেশন',
    documents: 'টেকনিক্যাল ডকুমেন্ট ও ডেটাশিট',
    manufacturer: 'প্রস্তুতকারক',
    officialManufacturerPortal: 'অফিসিয়াল প্রস্তুতকারকের পোর্টালে যাচাই করুন',
    compatibleProducts: 'সামঞ্জস্যপূর্ণ সিস্টেম কম্পোনেন্ট',
    verifiedAccessories: 'ভেরিফায়েড ফ্যাক্টরি অ্যাক্সেসরিজ',
    directReplacements: 'সরাসরি প্রতিস্থাপনযোগ্য সমতুল্য মডেল',
    sameSeriesModels: 'একই সিরিজের অন্যান্য মডেল',
    datasheet: 'ডেটাশিট',
    manual: 'ব্যবহারকারী নির্দেশিকা',
    certificate: 'সার্টিফিকেট',

    // Company & Footer
    companyName: 'ধ্রুব পাওয়ার অ্যান্ড ইঞ্জিনিয়ারিং',
    companyTagline: 'বাংলাদেশে অনুমোদিত ইন্ডাস্ট্রিয়াল ইলেকট্রিক্যাল সুইচগিয়ার, সোলার ইঞ্জিনিয়ারিং ও সিকিউরিটি সিস্টেম সরবরাহকারী।',
    barishalAddress: 'খান সড়ক, কাজীপাড়া, সিঅ্যান্ডবি রোড, বরিশাল ৮২০০, বাংলাদেশ',
    copyright: 'ধ্রুব পাওয়ার অ্যান্ড ইঞ্জিনিয়ারিং। সর্বস্বত্ব সংরক্ষিত। সকল স্পেসিফিকেশন প্রস্তুতকারক মান অনুযায়ী নিশ্চিতকৃত।'
  }
};
