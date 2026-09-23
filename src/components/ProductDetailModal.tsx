import React from 'react';
import { ProductItem } from '../types/catalog';
import { 
  X, 
  FileText, 
  Download, 
  ExternalLink, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Check, 
  Layers,
  Heart,
  Scale
} from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToRfq: (product: ProductItem, qty?: number) => void;
  onQuickQuote?: (product: ProductItem, qty?: number) => void;
  isAddedToRfq: boolean;
  onSelectModel: (modelId: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: ProductItem) => void;
  isCompared: boolean;
  onToggleCompare: (product: ProductItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToRfq,
  onQuickQuote,
  isAddedToRfq,
  onSelectModel,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare
}) => {
  const [quoteQty, setQuoteQty] = React.useState<number>(1);

  React.useEffect(() => {
    setQuoteQty(1);
  }, [product?.id]);

  if (!product) return null;

  const waMessage = encodeURIComponent(
    `Hello Dhruba Power,\n\nI am requesting official pricing and delivery timeline for:\nProduct: ${product.name}\nMPN: ${product.mpn}\nQuantity Required: ${quoteQty} units\nSKU: ${product.sku}\n\nPlease prepare an official quote for Barishal / Bangladesh supply.`
  );
  const waUrl = `https://wa.me/8801700000000?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        id="product-detail-modal"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-100 border border-sky-200 px-2.5 py-1 rounded">
              {product.brand}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Category: {product.categoryName}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            id="btn-close-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Grid: Image + Primary Identifiers & Commercial Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Image Container */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
              <img 
                src={product.image} 
                alt={product.name}
                className="max-h-64 max-w-full object-contain mix-blend-multiply" 
              />
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{product.stockLocation}</span>
              </div>
            </div>

            {/* Right: Identifiers & CTAs */}
            <div>
              <div className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Series: {product.series}
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-snug mb-3">
                {product.name}
              </h2>

              {/* Technical Identity Table */}
              <div className="bg-slate-100/80 border border-slate-200 rounded-md p-3 mb-4 font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">MPN:</span>
                  <span className="font-bold text-slate-900">{product.mpn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dhruba SKU:</span>
                  <span className="font-bold text-slate-900">{product.sku}</span>
                </div>
                {product.mfgCode && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Manufacturer Code:</span>
                    <span className="font-bold text-slate-900">{product.mfgCode}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Warranty:</span>
                  <span className="font-bold text-emerald-700">Official Factory Warranty</span>
                </div>
              </div>

              {/* Price Note & Action Buttons */}
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1">
                  Pricing Information
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Industrial engineering products are quoted based on required quantities, project delivery destination, and current import tariff schedules.
                </p>
              </div>

              {/* Quantity Stepper & RFQ Buttons */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Required Quantity (Units):
                  </span>
                  <div className="flex items-center border border-slate-300 rounded bg-white">
                    <button
                      type="button"
                      onClick={() => setQuoteQty(Math.max(1, quoteQty - 1))}
                      className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quoteQty}
                      onChange={(e) => setQuoteQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-14 text-center text-xs font-bold font-mono outline-none border-x border-slate-300 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => setQuoteQty(quoteQty + 1)}
                      className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => onAddToRfq(product, quoteQty)}
                    className={`py-2.5 px-4 text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs ${
                      isAddedToRfq 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                    id="modal-btn-add-rfq"
                  >
                    {isAddedToRfq ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>In RFQ Basket</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add {quoteQty > 1 ? `${quoteQty} Qty` : ''} to RFQ Basket</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (onQuickQuote) {
                        onQuickQuote(product, quoteQty);
                      } else {
                        onAddToRfq(product, quoteQty);
                      }
                    }}
                    className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                    id="modal-btn-quick-rfq"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Direct Quick Quote</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`py-2 px-3 border rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isWishlisted 
                      ? 'bg-rose-50 border-rose-300 text-rose-700' 
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Save in Project BOM"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isWishlisted ? 'Saved BOM' : 'Save BOM'}</span>
                </button>

                <button
                  onClick={() => onToggleCompare(product)}
                  className={`py-2 px-3 border rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isCompared 
                      ? 'bg-sky-50 border-sky-300 text-sky-800' 
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                </button>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Quote</span>
                </a>
              </div>

              {product.officialUrl && (
                <div className="mt-3 text-right">
                  <a 
                    href={product.officialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:text-sky-900 hover:underline"
                  >
                    <span>Verify on official {product.brand} portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Complete Technical Specifications */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center justify-between">
              <span>Full Engineering Specifications</span>
              <span className="text-[11px] font-mono text-slate-500 font-normal">
                {product.specifications.length} verified parameters
              </span>
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                {product.specifications.map((s, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    <td className="py-2.5 px-4 font-semibold text-slate-600 border-b border-slate-100 w-2/5">
                      {s.label}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900 border-b border-slate-100">
                      {s.value} {s.unit && !s.value.includes(s.unit) ? `(${s.unit})` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: Technical Documents & Datasheets */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Datasheets, Manuals & Regulatory Compliance</span>
            </h4>

            {product.documents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="border border-slate-200 bg-slate-50 rounded-lg p-3 flex items-center justify-between gap-3"
                  >
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs text-slate-900 truncate" title={doc.title}>
                        {doc.title}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5 mt-0.5">
                        <span className="font-bold text-sky-700">{doc.type}</span>
                        <span>•</span>
                        <span>PDF ({(doc.size / 1024).toFixed(0)} KB)</span>
                        {doc.sha256 && (
                          <span className="text-emerald-700 font-mono font-bold" title={`SHA256: ${doc.sha256}`}>
                            • SHA-256 Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <a
                      href={doc.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-md shrink-0 transition-colors"
                      title="Download Datasheet"
                    >
                      <Download className="w-4 h-4 text-sky-700" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-200">
                Official technical datasheet PDF is included with your formal RFQ submission.
              </div>
            )}
          </div>

          {/* Section 4: Same-Series Models Switcher */}
          {product.sameSeriesModels.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-700" />
                <span>Other Ratings in this Series ({product.series})</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.sameSeriesModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelectModel(m.id)}
                    className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-100 border border-slate-300 hover:border-slate-400 rounded text-slate-800 transition-colors cursor-pointer"
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Compatible Accessories & System Modules */}
          {product.compatibleAccessories.length > 0 && (
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center justify-between">
                <span>Verified Compatible Accessories & Attachments</span>
                <span className="text-[10px] text-slate-500 font-normal">Factory OEM Interoperable</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.compatibleAccessories.map((acc) => (
                  <div 
                    key={acc.id}
                    className="p-2.5 bg-white border border-slate-200 rounded flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">{acc.name}</div>
                      <div className="text-[10px] text-sky-700 font-semibold">{acc.relation}</div>
                    </div>
                    <button
                      onClick={() => onAddToRfq({
                        id: acc.id,
                        name: acc.name,
                        mpn: acc.name,
                        brand: product.brand,
                        sku: `DP-ACC-${acc.id}`,
                        mfgCode: '',
                        series: product.series,
                        category: product.category,
                        categoryName: product.categoryName,
                        inStock: true,
                        stockLocation: product.stockLocation,
                        image: product.image,
                        specifications: [],
                        documents: [],
                        sameSeriesModels: [],
                        compatibleAccessories: []
                      })}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded cursor-pointer shrink-0"
                    >
                      + RFQ
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Official Dhruba Power Distribution Warranty
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
