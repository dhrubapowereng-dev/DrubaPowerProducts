import { ProductItem } from '../types/catalog';

export const INDUSTRIAL_PRODUCTS: ProductItem[] = [
  {
    id: 101,
    mpn: 'SH201-C20',
    mfgCode: '2CDS211001R0204',
    sku: 'DP-ABB-SH201-C20',
    name: 'ABB SH201-C20 Miniature Circuit Breaker (MCB) 1P 20A 6kA',
    brand: 'ABB',
    series: 'Compact Home SH200',
    category: 'eee',
    categoryName: 'Miniature Circuit Breakers (MCB)',
    inStock: true,
    stockLocation: 'Barishal Central Warehouse',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    officialUrl: 'https://new.abb.com/products/2CDS211001R0204/sh201-c20',
    specifications: [
      { key: 'rated_current', label: 'Rated Current', value: '20 A', numeric: 20, unit: 'A', normalized: '20 A' },
      { key: 'rated_voltage', label: 'Rated Operational Voltage', value: '230 / 400 V AC', numeric: 230, unit: 'V', normalized: '230 V' },
      { key: 'breaking_capacity', label: 'Rated Breaking Capacity (Icn)', value: '6 kA', numeric: 6, unit: 'kA', normalized: '6 kA' },
      { key: 'poles', label: 'Number of Poles', value: '1', numeric: 1, unit: 'P', normalized: '1P' },
      { key: 'trip_curve', label: 'Tripping Characteristic', value: 'C Curve', normalized: 'C Curve' },
      { key: 'frequency', label: 'Rated Frequency', value: '50 / 60 Hz', numeric: 50, unit: 'Hz', normalized: '50/60 Hz' },
      { key: 'ip_rating', label: 'Degree of Protection', value: 'IP20', normalized: 'IP20' },
      { key: 'standards', label: 'Applicable Standards', value: 'IEC/EN 60898-1', normalized: 'IEC 60898-1' },
      { key: 'mechanical_durability', label: 'Mechanical Durability', value: '20,000 cycles', normalized: '20000' }
    ],
    documents: [
      {
        id: 'doc-abb-01',
        title: 'ABB SH200 Series Official Technical Datasheet',
        type: 'datasheet',
        sourceUrl: 'https://library.e.abb.com/public/datasheet_sh200.pdf',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        size: 420000
      },
      {
        id: 'doc-abb-02',
        title: 'ABB Compact Home Installation & Mounting Manual',
        type: 'manual',
        sourceUrl: 'https://library.e.abb.com/public/manual_sh200.pdf',
        sha256: '9f83c12c4f1234567890abcdef1234567890abcdef1234567890abcdef123456',
        size: 890000
      }
    ],
    sameSeriesModels: [
      { id: 102, name: 'ABB SH201-C16 1P 16A 6kA', mpn: 'SH201-C16' },
      { id: 103, name: 'ABB SH201-C25 1P 25A 6kA', mpn: 'SH201-C25' },
      { id: 104, name: 'ABB SH201-C32 1P 32A 6kA', mpn: 'SH201-C32' },
      { id: 105, name: 'ABB SH201-C40 1P 40A 6kA', mpn: 'SH201-C40' },
      { id: 106, name: 'ABB SH201-C63 1P 63A 6kA', mpn: 'SH201-C63' }
    ],
    compatibleAccessories: [
      { id: 107, name: 'ABB S2C-H6R Auxiliary Contact', relation: 'Auxiliary Contact' },
      { id: 108, name: 'ABB S2C-A1 Shunt Trip 12-60V', relation: 'Shunt Trip' }
    ]
  },
  {
    id: 104,
    mpn: 'SH201-C32',
    mfgCode: '2CDS211001R0324',
    sku: 'DP-ABB-SH201-C32',
    name: 'ABB SH201-C32 Miniature Circuit Breaker (MCB) 1P 32A 6kA',
    brand: 'ABB',
    series: 'Compact Home SH200',
    category: 'eee',
    categoryName: 'Miniature Circuit Breakers (MCB)',
    inStock: true,
    stockLocation: 'Barishal Central Warehouse',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    officialUrl: 'https://new.abb.com/products/2CDS211001R0324/sh201-c32',
    specifications: [
      { key: 'rated_current', label: 'Rated Current', value: '32 A', numeric: 32, unit: 'A', normalized: '32 A' },
      { key: 'rated_voltage', label: 'Rated Operational Voltage', value: '230 / 400 V AC', numeric: 230, unit: 'V', normalized: '230 V' },
      { key: 'breaking_capacity', label: 'Rated Breaking Capacity (Icn)', value: '6 kA', numeric: 6, unit: 'kA', normalized: '6 kA' },
      { key: 'poles', label: 'Number of Poles', value: '1', numeric: 1, unit: 'P', normalized: '1P' },
      { key: 'trip_curve', label: 'Tripping Characteristic', value: 'C Curve', normalized: 'C Curve' },
      { key: 'frequency', label: 'Rated Frequency', value: '50 / 60 Hz', numeric: 50, unit: 'Hz', normalized: '50/60 Hz' },
      { key: 'ip_rating', label: 'Degree of Protection', value: 'IP20', normalized: 'IP20' }
    ],
    documents: [
      {
        id: 'doc-abb-03',
        title: 'ABB SH200 Series Official Technical Datasheet',
        type: 'datasheet',
        sourceUrl: 'https://library.e.abb.com/public/datasheet_sh200.pdf',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        size: 420000
      }
    ],
    sameSeriesModels: [
      { id: 101, name: 'ABB SH201-C20 1P 20A 6kA', mpn: 'SH201-C20' },
      { id: 106, name: 'ABB SH201-C63 1P 63A 6kA', mpn: 'SH201-C63' }
    ],
    compatibleAccessories: []
  },
  {
    id: 109,
    mpn: 'SH203-C63',
    mfgCode: '2CDS213001R0634',
    sku: 'DP-ABB-SH203-C63',
    name: 'ABB SH203-C63 Miniature Circuit Breaker (MCB) 3P 63A 6kA',
    brand: 'ABB',
    series: 'Compact Home SH200',
    category: 'eee',
    categoryName: 'Miniature Circuit Breakers (MCB)',
    inStock: true,
    stockLocation: 'Barishal Central Warehouse',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    officialUrl: 'https://new.abb.com/products/2CDS213001R0634/sh203-c63',
    specifications: [
      { key: 'rated_current', label: 'Rated Current', value: '63 A', numeric: 63, unit: 'A', normalized: '63 A' },
      { key: 'rated_voltage', label: 'Rated Operational Voltage', value: '400 V AC', numeric: 400, unit: 'V', normalized: '400 V' },
      { key: 'breaking_capacity', label: 'Rated Breaking Capacity (Icn)', value: '6 kA', numeric: 6, unit: 'kA', normalized: '6 kA' },
      { key: 'poles', label: 'Number of Poles', value: '3', numeric: 3, unit: 'P', normalized: '3P' },
      { key: 'trip_curve', label: 'Tripping Characteristic', value: 'C Curve', normalized: 'C Curve' },
      { key: 'frequency', label: 'Rated Frequency', value: '50 / 60 Hz', numeric: 50, unit: 'Hz', normalized: '50/60 Hz' }
    ],
    documents: [],
    sameSeriesModels: [],
    compatibleAccessories: []
  },
  {
    id: 110,
    mpn: 'A9F74120',
    mfgCode: 'A9F74120',
    sku: 'DP-SE-A9F74120',
    name: 'Schneider Electric Acti9 iC60N 1P 20A C Curve 6kA MCB',
    brand: 'Schneider Electric',
    series: 'Acti9 iC60N',
    category: 'eee',
    categoryName: 'Miniature Circuit Breakers (MCB)',
    inStock: true,
    stockLocation: 'Barishal Central Warehouse',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    officialUrl: 'https://www.se.com/ww/en/product/A9F74120/acti9-ic60n-1p-20a-c-curve-6000a-500v/',
    specifications: [
      { key: 'rated_current', label: 'Rated Current', value: '20 A', numeric: 20, unit: 'A', normalized: '20 A' },
      { key: 'rated_voltage', label: 'Rated Operational Voltage', value: '230 V AC', numeric: 230, unit: 'V', normalized: '230 V' },
      { key: 'breaking_capacity', label: 'Breaking Capacity', value: '6 kA (EN 60898-1)', numeric: 6, unit: 'kA', normalized: '6 kA' },
      { key: 'poles', label: 'Poles Description', value: '1P', numeric: 1, unit: 'P', normalized: '1P' },
      { key: 'trip_curve', label: 'Curve Code', value: 'C', normalized: 'C Curve' }
    ],
    documents: [
      {
        id: 'doc-se-01',
        title: 'Schneider Acti9 iC60N Product Specification Sheet',
        type: 'datasheet',
        sourceUrl: 'https://download.schneider-electric.com/files?p_Doc_Ref=A9F74120',
        sha256: '4a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
        size: 380000
      }
    ],
    sameSeriesModels: [],
    compatibleAccessories: []
  },
  {
    id: 111,
    mpn: '5SL6120-7',
    mfgCode: '5SL6120-7',
    sku: 'DP-SIE-5SL6120-7',
    name: 'Siemens SENTRON 5SL6 Miniature Circuit Breaker 1P 20A 6kA',
    brand: 'Siemens',
    series: 'SENTRON 5SL6',
    category: 'eee',
    categoryName: 'Miniature Circuit Breakers (MCB)',
    inStock: true,
    stockLocation: 'Barishal Central Warehouse',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    officialUrl: 'https://mall.industry.siemens.com/mall/en/WW/Catalog/Product/5SL6120-7',
    specifications: [
      { key: 'rated_current', label: 'Rated Current', value: '20 A', numeric: 20, unit: 'A', normalized: '20 A' },
      { key: 'breaking_capacity', label: 'Breaking Capacity', value: '6 kA', numeric: 6, unit: 'kA', normalized: '6 kA' },
      { key: 'poles', label: 'Poles', value: '1P', numeric: 1, unit: 'P', normalized: '1P' },
      { key: 'trip_curve', label: 'Tripping Characteristic Class', value: 'C', normalized: 'C Curve' }
    ],
    documents: [],
    sameSeriesModels: [],
    compatibleAccessories: []
  },
  {
    id: 112,
    mpn: '1SDA066804R1',
    mfgCode: 'A1N 125 TMF 100-1000 3p F F',
    sku: 'DP-ABB-A1N125',
    name: 'ABB Formula A1N 125 Fixed 3-Pole 100A Moulded Case Circuit Breaker (MCCB)',
    brand: 'ABB',
    series: 'Formula A1',
    category: 'eee',
    categoryName: 'Moulded Case Circuit Breakers (MCCB)',
    inStock: true,
    stockLocation: 'Barishal Central Warehouse',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    officialUrl: 'https://new.abb.com/products/1SDA066804R1/a1n-125-tmf-100-1000-3p-f-f',
    specifications: [
      { key: 'rated_current', label: 'Rated Current (In)', value: '100 A', numeric: 100, unit: 'A', normalized: '100 A' },
      { key: 'rated_voltage', label: 'Rated Operational Voltage', value: '550 V AC', numeric: 550, unit: 'V', normalized: '550 V' },
      { key: 'breaking_capacity', label: 'Rated Ultimate Short-Circuit Breaking Capacity (Icu)', value: '25 kA', numeric: 25, unit: 'kA', normalized: '25 kA' },
      { key: 'poles', label: 'Number of Poles', value: '3', numeric: 3, unit: 'P', normalized: '3P' },
      { key: 'release_type', label: 'Release Type', value: 'TMF (Thermal-Magnetic Fixed)', normalized: 'TMF' }
    ],
    documents: [
      {
        id: 'doc-abb-form01',
        title: 'ABB Formula A1-A2 Technical Catalogue & Dimensions',
        type: 'datasheet',
        sourceUrl: 'https://library.e.abb.com/public/formula_a1.pdf',
        size: 1450000
      }
    ],
    sameSeriesModels: [],
    compatibleAccessories: []
  },
  {
    id: 201,
    mpn: 'DS-2CD2043G2-I',
    mfgCode: 'DS-2CD2043G2-I (2.8mm)',
    sku: 'DP-HIK-DS2CD2043G2I',
    name: 'Hikvision 4 MP AcuSense Fixed Bullet Network IP Camera',
    brand: 'Hikvision',
    series: 'Pro Series EasyIP 2.0+',
    category: 'cctv',
    categoryName: 'IP Security Cameras & Surveillance',
    inStock: true,
    stockLocation: 'Barishal Central Warehouse',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    officialUrl: 'https://www.hikvision.com/en/products/IP-Products/Network-Cameras/Pro-Series-EasyIP-/DS-2CD2043G2-I/',
    specifications: [
      { key: 'resolution', label: 'Image Resolution', value: '4 MP (2688 × 1520)', numeric: 4, unit: 'MP', normalized: '4 MP' },
      { key: 'lens', label: 'Focal Length', value: '2.8 mm Fixed Lens (FOV 103°)', numeric: 2.8, unit: 'mm', normalized: '2.8 mm' },
      { key: 'ir_range', label: 'IR Night Vision Range', value: 'Up to 40 m', numeric: 40, unit: 'm', normalized: '40 m' },
      { key: 'ip_rating', label: 'Ingress Protection', value: 'IP67 Weatherproof', normalized: 'IP67' },
      { key: 'wdr', label: 'Wide Dynamic Range', value: '120 dB True WDR', normalized: '120 dB' },
      { key: 'poe_support', label: 'Power Supply', value: '12 VDC & PoE (802.3af)', normalized: 'PoE 802.3af' },
      { key: 'ai_analytics', label: 'Deep Learning Analytics', value: 'Human and Vehicle Target Classification (AcuSense)', normalized: 'AcuSense' }
    ],
    documents: [
      {
        id: 'doc-hik-01',
        title: 'Hikvision DS-2CD2043G2-I Official Datasheet',
        type: 'datasheet',
        sourceUrl: 'https://www.hikvision.com/datasheet_2043.pdf',
        size: 720000
      }
    ],
    sameSeriesModels: [
      { id: 202, name: 'Hikvision DS-2CD2043G2-I (4mm Lens)', mpn: 'DS-2CD2043G2-I-4MM' }
    ],
    compatibleAccessories: []
  },
  {
    id: 301,
    mpn: 'MIN 5000TL-X',
    mfgCode: 'MIN 5000TL-X',
    sku: 'DP-GW-MIN5000TLX',
    name: 'Growatt MIN 5000TL-X Single Phase On-Grid Solar Inverter 5kW',
    brand: 'Growatt',
    series: 'MIN 2500-6000TL-X',
    category: 'solar',
    categoryName: 'Solar Grid-Tie & Hybrid Inverters',
    inStock: true,
    stockLocation: 'Barishal Central Warehouse',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    officialUrl: 'https://www.ginverter.com/products/min-2500-6000tl-x',
    specifications: [
      { key: 'rated_power', label: 'Nominal AC Output Power', value: '5000 W (5 kW)', numeric: 5, unit: 'kW', normalized: '5 kW' },
      { key: 'max_pv_power', label: 'Max Recommended PV Power', value: '7000 Wp', numeric: 7000, unit: 'Wp', normalized: '7000 Wp' },
      { key: 'mppt_count', label: 'Number of Independent MPPTs', value: '2 MPPT Trackers', numeric: 2, unit: '', normalized: '2 MPPT' },
      { key: 'mppt_voltage_range', label: 'MPPT Operating Voltage Range', value: '80V - 550V DC', normalized: '80-550 V' },
      { key: 'efficiency', label: 'Maximum Efficiency', value: '98.4 %', numeric: 98.4, unit: '%', normalized: '98.4%' },
      { key: 'phase', label: 'Grid Connection', value: 'Single Phase (230V)', normalized: '1-Phase' },
      { key: 'warranty', label: 'Standard Manufacturer Warranty', value: '5 Years Extendable to 10 Years', normalized: '5 Years' }
    ],
    documents: [
      {
        id: 'doc-gw-01',
        title: 'Growatt MIN 2500-6000TL-X Technical Datasheet & Certificate',
        type: 'datasheet',
        sourceUrl: 'https://www.ginverter.com/datasheet_min5000.pdf',
        size: 960000
      }
    ],
    sameSeriesModels: [
      { id: 302, name: 'Growatt MIN 6000TL-X 6kW Inverter', mpn: 'MIN 6000TL-X' }
    ],
    compatibleAccessories: []
  },
  {
    id: 303,
    mpn: 'LR5-72HPH-570M',
    mfgCode: 'LR5-72HPH-570M',
    sku: 'DP-LONGI-570M',
    name: 'LONGi Hi-MO 6 Explorer 570W Monocrystalline Tier-1 Solar PV Module',
    brand: 'LONGi',
    series: 'Hi-MO 6 Explorer',
    category: 'solar',
    categoryName: 'Solar Photovoltaic Modules',
    inStock: true,
    stockLocation: 'Barishal Central Warehouse',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    officialUrl: 'https://www.longi.com/en/products/modules/hi-mo-6/',
    specifications: [
      { key: 'rated_power', label: 'Max Nominal Power (Pmax)', value: '570 W', numeric: 0.57, unit: 'kW', normalized: '570 W' },
      { key: 'efficiency', label: 'Module Efficiency', value: '22.1 %', numeric: 22.1, unit: '%', normalized: '22.1%' },
      { key: 'cell_type', label: 'Cell Type', value: 'HPBC Monocrystalline (144 Cells)', normalized: 'Mono HPBC' },
      { key: 'warranty', label: 'Product & Performance Warranty', value: '15-Year Product / 25-Year Linear Power', normalized: '15/25 Years' }
    ],
    documents: [],
    sameSeriesModels: [],
    compatibleAccessories: []
  }
];
