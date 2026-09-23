export interface TechnicalSpecification {
  key: string;
  label: string;
  value: string;
  numeric?: number;
  unit?: string;
  normalized?: string;
}

export interface TechnicalDocument {
  id: string;
  title: string;
  type: 'datasheet' | 'manual' | 'certificate' | 'cad' | 'drawing';
  sourceUrl: string;
  sha256?: string;
  size: number;
}

export interface ProductItem {
  id: number;
  mpn: string;
  mfgCode: string;
  sku: string;
  name: string;
  brand: string;
  series: string;
  category: 'eee' | 'cctv' | 'solar';
  categoryName: string;
  inStock: boolean;
  stockLocation: string;
  image: string;
  officialUrl?: string;
  specifications: TechnicalSpecification[];
  documents: TechnicalDocument[];
  sameSeriesModels: { id: number; name: string; mpn: string }[];
  compatibleAccessories: { id: number; name: string; relation: string }[];
  relatedServiceId?: string;
  relatedServiceName?: string;
}

export interface RfqItem {
  productId: number;
  product: ProductItem;
  quantity: number;
  customerNote: string;
}

export type RfqStatus = 
  | 'NEW' 
  | 'REVIEWING' 
  | 'MATCHING' 
  | 'QUOTED' 
  | 'CUSTOMER_REVIEW' 
  | 'ACCEPTED' 
  | 'CONVERTED' 
  | 'REJECTED' 
  | 'CLOSED';

export interface RfqItemRecord {
  productId?: number;
  title: string;
  mpn: string;
  brand?: string;
  quantity: number;
  customerNote?: string;
  unitPrice?: number;
  lineTotal?: number;
}

export interface RfqFileRecord {
  name: string;
  size: number;
  mime: string;
  sha256: string;
  uploadedAt: string;
}

export interface RfqRecord {
  id: number;
  rfqNumber: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  whatsapp?: string;
  location: string;
  message?: string;
  status: RfqStatus;
  isGuest: boolean;
  guestToken?: string;
  userId?: number;
  items: RfqItemRecord[];
  files: RfqFileRecord[];
  quotedTotal?: number;
  currency: string;
  internalNotes?: string;
  wcOrderId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  brands: string[];
  ratedCurrent: string[];
  poles: string[];
  solarPower: string[];
  cctvResolution: string[];
  inStockOnly: boolean;
}
