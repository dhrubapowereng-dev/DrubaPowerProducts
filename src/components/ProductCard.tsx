import React from 'react';
import { ProductItem } from '../types/catalog';
import { MessageSquare, Plus, Check, Scale, Heart } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  onSelect: (product: ProductItem) => void;
  onAddToRfq: (product: ProductItem) => void;
  isAddedToRfq: boolean;
  isCompared: boolean;
  onToggleCompare: (product: ProductItem) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToRfq,
  isAddedToRfq,
  isCompared,
  onToggleCompare,
  isWishlisted,
  onToggleWishlist
}) => {
  const waMessage = encodeURIComponent(
    `Hello Dhruba Power,\n\nI need an official quote for:\nModel: ${product.name}\nMPN: ${product.mpn}\nBrand: ${product.brand}\n\nPlease share current Bangladesh BDT pricing and delivery timeline.`
  );
  const waUrl = `https://wa.me/8801700000000?text=${waMessage}`;

  return (
    <article 
      className="bg-white border border-slate-200 hover:border-slate-400 rounded-lg p-4 flex flex-col justify-between transition-all duration-150 hover:shadow-md group relative"
      id={`product-card-${product.id}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded">
            {product.brand}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Ready Stock
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              title={isWishlisted ? "In Project BOM" : "Add to Project BOM / Wishlist"}
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
          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            MPN: {product.mpn}
          </span>
          <span className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
            {product.series}
          </span>
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onSelect(product)}
          className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 mb-2.5 cursor-pointer hover:text-sky-700 transition-colors min-h-[2.5rem]"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Key Technical Specifications Matrix */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.specifications.slice(0, 4).map((spec, idx) => (
            <span 
              key={idx}
              className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80"
            >
              {spec.normalized || `${spec.label}: ${spec.value}`}
            </span>
          ))}
        </div>
      </div>

      {/* Commercial Actions Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wide">
            Price on RFQ
          </span>
          <button
            onClick={() => onToggleCompare(product)}
            className={`text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              isCompared ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-3 h-3" />
            {isCompared ? 'Comparing' : 'Compare'}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onAddToRfq(product)}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isAddedToRfq 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
            }`}
            id={`btn-add-rfq-${product.id}`}
          >
            {isAddedToRfq ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Basket</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to RFQ</span>
              </>
            )}
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Ask via WhatsApp"
            className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md flex items-center justify-center cursor-pointer transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        </div>
      </div>
    </article>
  );
};
