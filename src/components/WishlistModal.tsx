import React from 'react';
import { ProductItem } from '../types/catalog';
import { X, Trash2, ArrowRight, Heart } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  onRemoveFromWishlist: (productId: number) => void;
  onClearWishlist: () => void;
  onMoveToRfq: (product: ProductItem) => void;
  onMoveAllToRfq: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveFromWishlist,
  onClearWishlist,
  onMoveToRfq,
  onMoveAllToRfq
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        id="wishlist-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 rounded-md text-rose-700">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                Saved Engineering Items & Project BOM
              </h2>
              <p className="text-xs text-slate-500">
                {products.length} saved models ready for project RFQ generation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {products.length > 0 && (
              <button
                onClick={onClearWishlist}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {products.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">Your saved project list is empty</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Save circuit breakers, solar inverters, or surveillance cameras while browsing to assemble a project Bill of Materials (BOM).
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              {products.map((product) => (
                <div 
                  key={product.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-14 h-14 object-contain rounded bg-slate-100 p-1 border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                          {product.brand}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-600">
                          MPN: {product.mpn}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <span>● {product.stockLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => onMoveToRfq(product)}
                      className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>+ Add to RFQ</span>
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(product.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {products.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              Total {products.length} models ready
            </span>
            <div className="flex gap-2">
              <button
                onClick={onMoveAllToRfq}
                className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span>Move All to RFQ Basket</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
