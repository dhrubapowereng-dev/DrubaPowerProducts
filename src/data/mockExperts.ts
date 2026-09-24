import { ExpertItem } from '../types/catalog';

export const INITIAL_EXPERTS: ExpertItem[] = [
  {
    id: 'exp-1',
    slug: 'binay-sikder',
    name: 'Binay Sikder',
    photograph: 'https://dhrubapower.com/wp-content/uploads/2026/05/IMG-20260604-WA0001-616x430.jpg',
    designation: 'Solar System Specialist',
    department: 'Solar Power Engineering',
    shortBio: 'Certified solar engineer with over 6 years of expertise in on-grid, off-grid, and commercial rooftop solar installation, net-metering compliance, and inverter sizing.',
    whatsappNumber: '+8801711197767',
    displayOrder: 1,
    active: true,
    email: 'binay@dhrubapower.com',
    experienceYears: 6,
    certifications: ['SREDA Certified Solar Engineer', 'Growatt Certified Inverter Specialist', 'NABCEP Associate']
  },
  {
    id: 'exp-2',
    slug: 'md-asiq-islam',
    name: 'Md. Asiq Islam – CCTV',
    photograph: 'https://dhrubapower.com/wp-content/uploads/2026/05/WhatsApp-Image-2026-02-04-at-1.36.20-PM-591x430.jpeg',
    designation: 'Certified CCTV & Surveillance Specialist',
    department: 'Security & Surveillance Systems',
    shortBio: 'Certified surveillance engineer specializing in industrial Hikvision and Dahua AcuSense IP camera networks, enterprise NVR topologies, optical fiber backbones, and remote monitoring.',
    whatsappNumber: '+8801711197767',
    displayOrder: 2,
    active: true,
    email: 'asiq@dhrubapower.com',
    experienceYears: 7,
    certifications: ['Hikvision Certified Security Associate (HCSA)', 'Dahua Certified Systems Professional', 'Fiber Optic Network Specialist']
  },
  {
    id: 'exp-3',
    slug: 'engr-fatima-begum',
    name: 'Engr. Fatima Begum',
    photograph: 'https://dhrubapower.com/wp-content/uploads/2026/05/WhatsApp-Image-2026-03-14-at-5.06.55-PM-2-640x430.jpeg',
    designation: 'Lightning Protection & Earthing Specialist',
    department: 'Lightning & Grounding Systems',
    shortBio: 'High-voltage surge protection engineer experienced in Early Streamer Emission (ESE) lightning arresters, chemical earth pits, and transient surge suppression for industrial factories.',
    whatsappNumber: '+8801711197767',
    displayOrder: 3,
    active: true,
    email: 'fatima@dhrubapower.com',
    experienceYears: 8,
    certifications: ['NFC 17-102 French Standard Certified', 'IEEE 142 Grounding Systems Master', 'B.Sc. in Electrical Engineering (IEB)']
  },
  {
    id: 'exp-4',
    slug: 'engr-anup-roy',
    name: 'Engr. Anup Roy',
    photograph: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    designation: 'Senior Substation & Switchgear Engineer',
    department: 'HT/LT Substation & Switchgear',
    shortBio: 'Power systems engineer overseeing 11kV/0.415kV substation design, transformer installations, BPDB/BREB utility approvals, PFI plants, and motor control center (MCC) panels.',
    whatsappNumber: '+8801711197767',
    displayOrder: 4,
    active: true,
    email: 'anup@dhrubapower.com',
    experienceYears: 10,
    certifications: ['Chief Electrical Inspectorate A-Class License', 'Siemens Switchgear Commissioning Expert', 'B.Sc. in Electrical Engineering (RUET)']
  }
];
