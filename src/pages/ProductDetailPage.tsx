import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  Scale, 
  Heart, 
  MessageSquare, 
  Building2, 
  Check, 
  ChevronRight, 
  ArrowRight,
  Package,
  Layers,
  Award
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { ProductItem } from '../types/catalog';

interface ProductDetailPageProps {
  product: ProductItem;
  lang: Language;
  onNavigate: (path: string) => void;
  onAddToRfq: (product: ProductItem, qty?: number) => void;
  onQuickQuote: (product: ProductItem, qty?: number) => void;
  isAddedToRfq: boolean;
  onSelectModel: (id: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: ProductItem) => void;
  isCompared: boolean;
  onToggleCompare: (product: ProductItem) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  lang,
  onNavigate,
  onAddToRfq,
  onQuickQuote,
  isAddedToRfq,
  onSelectModel,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare
}) => {
  const t = TRANSLATIONS[lang];
  const [quantity, setQuantity] = useState(1);

  const whatsappUrl = `https://wa.me/8801711197767?text=${encodeURIComponent(`Hello Dhruba Power Sales Desk, I am requesting formal quotation for "${product.name}" (MPN: ${product.mpn}, Quantity: ${quantity}).`)}`;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <button 
            onClick={() => onNavigate('/')} 
            className="hover:text-slate-900 transition-colors"
          >
            {t.home}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button 
            onClick={() => onNavigate('/shop/')} 
            className="hover:text-slate-900 transition-colors"
          >
            {lang === 'bn' ? 'শপ' : 'Shop'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 uppercase font-semibold">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-[#0F172A] truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-16 space-y-8">
        {/* Main Product Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Image & Stock */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square flex items-center justify-center p-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Ready Stock Badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#16A673] animate-pulse" />
                  <div>
                    <div className="text-xs font-bold text-emerald-950">
                      {product.inStock ? 'Ready Stock in Barishal Warehouse' : 'Available for Immediate Indent'}
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      {product.stockLocation}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                  Verified OEM
                </span>
              </div>
            </div>

            {/* Right Column: Title, MPN, RFQ & Actions */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#0F172A] text-white text-xs font-bold px-2.5 py-0.5 rounded">
                    {product.brand}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Series: {product.series}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F172A] leading-snug">
                  {product.name}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>MPN: <strong className="text-slate-800">{product.mpn}</strong></span>
                  <span>•</span>
                  <span>SKU: {product.sku}</span>
                </div>
              </div>

              {/* Price Note & Commercial Action */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-500 block">
                      Commercial Pricing:
                    </span>
                    <span className="text-lg font-black text-[#0F172A]">
                      Pricing on Request (Official Tender/RFQ)
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Currency: BDT (+VAT)
                  </span>
                </div>

                {/* Quantity & CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 text-center font-bold text-xs py-2 outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => onQuickQuote(product, quantity)}
                    className="px-5 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Request Formal Quote</span>
                  </button>

                  <button
                    onClick={() => onAddToRfq(product, quantity)}
                    className={`px-4 py-2.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                      isAddedToRfq 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isAddedToRfq ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Added to RFQ Basket</span>
                      </>
                    ) : (
                      <>
                        <Package className="w-4 h-4 text-slate-500" />
                        <span>Add to RFQ</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Secondary Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/80">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-[#16A673] hover:bg-[#0F8A60] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Direct WhatsApp Quote</span>
                  </a>

                  <button
                    onClick={() => onToggleCompare(product)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border flex items-center gap-1.5 cursor-pointer ${
                      isCompared ? 'bg-slate-800 text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isCompared ? 'In Compare List' : 'Compare Specs'}</span>
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border flex items-center gap-1.5 cursor-pointer ${
                      isWishlisted ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{isWishlisted ? 'Saved in BOM' : 'Save to BOM'}</span>
                  </button>
                </div>
              </div>

              {/* Related Service Connection */}
              {product.relatedServiceId && (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-center justify-between">
                  <div>
                    <span className="font-bold block">Need Turnkey Installation &amp; Testing?</span>
                    <span className="text-[11px] text-blue-800">{product.relatedServiceName}</span>
                  </div>
                  <button
                    onClick={() => onNavigate(`/services/${product.relatedServiceId}/`)}
                    className="px-3 py-1.5 bg-[#0F172A] text-white rounded-lg text-xs font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    View Service
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D97706]" />
            <h2 className="text-xl font-extrabold text-[#0F172A]">
              Full Technical Specifications &amp; Operational Ratings
            </h2>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-slate-100">
                {product.specifications.map((spec, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}>
                    <td className="p-3.5 font-bold text-slate-700 w-1/3 sm:w-1/4 border-r border-slate-200/60">
                      {spec.label}
                    </td>
                    <td className="p-3.5 font-mono text-slate-900 font-semibold">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Documents & Downloads */}
        {product.documents.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              <Download className="w-4 h-4 text-[#D97706]" />
              <span>Datasheets, CAD Drawings &amp; Installation Manuals</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.documents.map((doc) => (
                <div key={doc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-slate-500 shrink-0" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">{doc.title}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{doc.type} • {(doc.size / 1024).toFixed(0)} KB</div>
                    </div>
                  </div>
                  <a
                    href={doc.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Same Series Models */}
        {product.sameSeriesModels.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0F172A]">
              Alternative Ratings in Same {product.series} Series
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {product.sameSeriesModels.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onSelectModel(m.id);
                    onNavigate(`/product/${m.id}/`);
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left cursor-pointer transition-colors"
                >
                  <div className="font-bold text-xs text-slate-900">{m.name}</div>
                  <div className="text-[11px] font-mono text-slate-500 mt-1">MPN: {m.mpn}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
