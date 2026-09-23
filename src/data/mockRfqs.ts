import { RfqRecord } from '../types/catalog';

export const INITIAL_RFQS: RfqRecord[] = [
  {
    id: 101,
    rfqNumber: 'RFQ-202609-DP481',
    company: 'Meghna Cement Substation Project',
    contact: 'Engr. Tanvir Ahmed',
    email: 'tanvir.ee@meghnacement.com',
    phone: '+880 1711-234567',
    whatsapp: '+880 1711-234567',
    location: 'Rupsha, Khulna / Barishal River Port Terminal',
    message: 'Urgent replacement for 400V distribution switchboard. Need ABB OEM certified certificates and FAT report.',
    status: 'ACCEPTED',
    isGuest: false,
    userId: 42,
    currency: 'BDT',
    quotedTotal: 342500,
    items: [
      {
        productId: 1,
        title: 'ABB SACE Tmax XT2N 160 TMD 160-1600 3p F F',
        mpn: '1SDA067018R1',
        brand: 'ABB',
        quantity: 2,
        customerNote: 'Front terminals with auxiliary contact 1S+1Q',
        unitPrice: 85000,
        lineTotal: 170000
      },
      {
        productId: 2,
        title: 'ABB System Pro M Compact MCB SH201-C20 1P 20A 6kA',
        mpn: '2CDS211001R0204',
        brand: 'ABB',
        quantity: 150,
        customerNote: 'DIN-rail mounted, 6kA breaking capacity',
        unitPrice: 1150,
        lineTotal: 172500
      }
    ],
    files: [
      {
        name: 'Single_Line_Diagram_Substation_Bay3.pdf',
        size: 3840200,
        mime: 'application/pdf',
        sha256: '8f43a1290e21bc19e830f142bc01284a1e94cf21034f81c9a0937a0129bcfe14',
        uploadedAt: '2026-09-20 10:14:00'
      }
    ],
    internalNotes: 'Client agreed to 70% advance, balance on delivery at Barishal site. Approved by Dhruba Commercial Desk.',
    createdAt: '2026-09-20 10:15:22',
    updatedAt: '2026-09-21 14:30:10'
  },
  {
    id: 102,
    rfqNumber: 'RFQ-202609-DP902',
    company: 'Barishal Steel Re-Rolling Mills',
    contact: 'M. Shafiqul Islam (Procurement Head)',
    email: 'procurement@barishalsteel.com.bd',
    phone: '+880 1819-876543',
    whatsapp: '+880 1819-876543',
    location: 'Barishal BSCIC Industrial Estate',
    message: 'Need Schneider ComPact NSX series 4P 250A MCCB with Micrologic trip unit for 500kVA transformer feeder.',
    status: 'QUOTED',
    isGuest: false,
    userId: 88,
    currency: 'BDT',
    quotedTotal: 188000,
    items: [
      {
        productId: 4,
        title: 'Schneider Electric ComPact NSX250F MicroLogic 2.2 4P 250A',
        mpn: 'LV431630',
        brand: 'Schneider Electric',
        quantity: 1,
        customerNote: 'Micrologic 2.2 trip unit included',
        unitPrice: 188000,
        lineTotal: 188000
      }
    ],
    files: [],
    internalNotes: 'Quotation sent via email. Valid until 15 Oct 2026.',
    createdAt: '2026-09-21 16:45:00',
    updatedAt: '2026-09-22 09:20:00'
  },
  {
    id: 103,
    rfqNumber: 'RFQ-202609-DP315',
    company: 'South Bengal Cold Storage Ltd.',
    contact: 'Engr. K. M. Kabir',
    email: 'kabir.eng@southbengalcold.com',
    phone: '+880 1912-334455',
    whatsapp: '+880 1912-334455',
    location: 'Bhola Road, Barishal Sadar',
    message: 'Solar on-grid inverter quotation for 20kW rooftop expansion project with net-metering compliance.',
    status: 'CONVERTED',
    isGuest: true,
    guestToken: 'gst_98df8924b1ac',
    currency: 'BDT',
    quotedTotal: 495000,
    wcOrderId: 1042,
    items: [
      {
        productId: 7,
        title: 'Huawei SUN2000-20KTL-M2 Three Phase Solar Inverter 20kW',
        mpn: '01074316-001',
        brand: 'Huawei Solar',
        quantity: 1,
        customerNote: 'Includes Smart Dongle-WLAN-FE for remote monitoring',
        unitPrice: 495000,
        lineTotal: 495000
      }
    ],
    files: [
      {
        name: 'Rooftop_Solar_BOQ_SouthBengal.xlsx',
        size: 1420500,
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        sha256: '92ba187f4c0291e77103fa723c09b82193b01859381c81ef407a102941bce839',
        uploadedAt: '2026-09-18 11:20:00'
      }
    ],
    internalNotes: 'Converted into WooCommerce Order #1042 for commercial delivery and invoicing.',
    createdAt: '2026-09-18 11:25:30',
    updatedAt: '2026-09-19 15:40:12'
  }
];
