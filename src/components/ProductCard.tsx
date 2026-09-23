import React from 'react';
import { ProductItem } from '../types/catalog';
import { MessageSquare, FileText, Check, Scale, Heart } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface ProductCardProps {
  product: ProductItem;
  onSelect: (product: ProductItem) => void;
  onAddToRfq: (product: ProductItem) => void;
  isAddedToRfq: boolean;
  isCompared: boolean;
  onToggleCompare: (product: ProductItem) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: ProductItem) => void;
  lang?: Language;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToRfq,
  isAddedToRfq,
  isCompared,
  onToggleCompare,
  isWishlisted,
  onToggleWishlist,
  lang = 'en'
}) => {
  const t = TRANSLATIONS[lang];

  // Contextual WhatsApp link per User Requirement 23 with centralized phone (+8801711197767)
  const waMessage = encodeURIComponent(
    `Hello Dhruba Power,\n\nI am interested in:\n${product.name}\nMPN: ${product.mpn}\nBrand: ${product.brand}\n\nQuantity: 1\n\nDelivery Location: Barishal / Bangladesh\nPlease provide official BDT quote and lead time.`
  );
  const waUrl = `https://wa.me/8801711197767?text=${waMessage}`;

  return (
    <article 
      className="bg-white border border-slate-200 hover:border-slate-400 rounded-lg p-4 flex flex-col justify-between transition-all duration-150 hover:shadow-md group relative"
      id={`product-card-${product.id}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            {product.brand}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t.inStock} <span className="text-slate-400 font-normal">({lang === 'bn' ? 'বরিশাল' : 'Barishal'})</span>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              title={isWishlisted ? (lang === 'bn' ? 'বিওএম-এ সংরক্ষিত' : 'In Project BOM') : (lang === 'bn' ? 'বিওএম-এ সংরক্ষণ করুন' : 'Save to Project BOM')}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Image Thumbnail */}
        <div 
          onClick={() => onSelect(product)}
          className="w-full h-40 bg-slate-50 border border-slate-100 rounded-md mb-3 flex items-center justify-center p-3 cursor-pointer overflow-hidden group-hover:bg-slate-100/60 transition-colors"
        >
          <img 
            src={product.image} 
            alt={product.name}
            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-200" 
            loading="lazy"
          />
        </div>

        {/* MPN & Identifier */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            MPN: {product.mpn}
          </span>
          <span className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
            {product.series}
          </span>
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onSelect(product)}
          className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 mb-2.5 cursor-pointer hover:text-slate-700 transition-colors min-h-[2.5rem]"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* 3-5 Key Technical Specifications Matrix */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.specifications.slice(0, 4).map((spec, idx) => (
            <span 
              key={idx}
              className="text-[11px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
            >
              {spec.normalized || `${spec.label}: ${spec.value}`}
            </span>
          ))}
        </div>
      </div>

      {/* Commercial Actions Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {t.priceOnRequest}
          </span>
          <button
            onClick={() => onToggleCompare(product)}
            className={`text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              isCompared ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-3 h-3" />
            {isCompared ? t.comparing : t.compare}
          </button>
        </div>

        {/* Strict Button Hierarchy:
            Primary: REQUEST QUOTE (orange)
            Secondary: WhatsApp (green)
        */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onAddToRfq(product)}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isAddedToRfq 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs active:scale-98'
            }`}
            id={`btn-add-rfq-${product.id}`}
          >
            {isAddedToRfq ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.addedToRfq}</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>{t.requestQuote}</span>
              </>
            )}
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md flex items-center gap-1 transition-colors shadow-xs"
            title="Chat on WhatsApp (+8801711197767)"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
};
