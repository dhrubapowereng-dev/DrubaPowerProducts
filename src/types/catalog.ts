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
}

export interface RfqItem {
  productId: number;
  product: ProductItem;
  quantity: number;
  customerNote: string;
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
