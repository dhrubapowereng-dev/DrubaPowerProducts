import React from 'react';
import { ProductItem } from '../types/catalog';
import { X, Trash2, Plus, Scale } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  onRemoveFromCompare: (productId: number) => void;
  onClearCompare: () => void;
  onAddToRfq: (product: ProductItem) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveFromCompare,
  onClearCompare,
  onAddToRfq
}) => {
  if (!isOpen) return null;

  // Aggregate all unique specification labels across compared products
  const allSpecKeys = Array.from(
    new Set(products.flatMap((p) => p.specifications.map((s) => s.label)))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        id="compare-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 rounded-md text-sky-800">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                Industrial Specification Comparison Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Analyzing {products.length} electrical models side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {products.length > 0 && (
              <button
                onClick={onClearCompare}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {products.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Scale className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No products selected for comparison.</p>
              <p className="text-xs text-slate-400">
                Click the "Compare" link on any product card in the catalog to evaluate ratings side-by-side.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="p-3 font-bold text-slate-600 border border-slate-200 w-48">
                      Parameters
                    </th>
                    {products.map((p) => (
                      <th key={p.id} className="p-3 border border-slate-200 min-w-[200px] align-top bg-white">
                        <div className="flex justify-between items-start gap-1 mb-2">
                          <span className="text-[10px] font-black uppercase text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                            {p.brand}
                          </span>
                          <button
                            onClick={() => onRemoveFromCompare(p.id)}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="font-bold text-xs text-slate-900 leading-snug mb-1">
                          {p.name}
                        </div>
                        <div className="font-mono text-[11px] font-bold text-slate-600 mb-2">
                          MPN: {p.mpn}
                        </div>
                        <button
                          onClick={() => onAddToRfq(p)}
                          className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add to RFQ</span>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-slate-50/50">
                    <td className="p-2.5 font-bold text-slate-700 border border-slate-200">
                      Product Series
                    </td>
                    {products.map((p) => (
                      <td key={p.id} className="p-2.5 border border-slate-200 font-semibold text-slate-800">
                        {p.series}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-white">
                    <td className="p-2.5 font-bold text-slate-700 border border-slate-200">
                      Dhruba SKU
                    </td>
                    {products.map((p) => (
                      <td key={p.id} className="p-2.5 border border-slate-200 font-mono text-slate-700">
                        {p.sku}
                      </td>
                    ))}
                  </tr>

                  {allSpecKeys.map((label, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/40' : 'bg-white'}>
                      <td className="p-2.5 font-semibold text-slate-600 border border-slate-200">
                        {label}
                      </td>
                      {products.map((p) => {
                        const spec = p.specifications.find((s) => s.label === label);
                        return (
                          <td key={p.id} className="p-2.5 border border-slate-200 font-mono font-bold text-slate-900">
                            {spec ? (spec.normalized || `${spec.value} ${spec.unit || ''}`) : '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
