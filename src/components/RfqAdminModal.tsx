import React, { useState } from 'react';
import { RfqRecord, RfqStatus } from '../types/catalog';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  ShoppingCart, 
  MessageSquare, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  DollarSign, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

interface RfqAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfqs: RfqRecord[];
  onUpdateStatus: (rfqId: number, status: RfqStatus, quotedTotal?: number) => void;
  onConvertToWcOrder: (rfqId: number) => number; // returns created order ID
}

export const RfqAdminModal: React.FC<RfqAdminModalProps> = ({
  isOpen,
  onClose,
  rfqs,
  onUpdateStatus,
  onConvertToWcOrder
}) => {
  const [selectedRfqId, setSelectedRfqId] = useState<number | null>(rfqs[0]?.id || null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPriceRfqId, setEditingPriceRfqId] = useState<number | null>(null);
  const [customPriceInput, setCustomPriceInput] = useState<string>('');

  if (!isOpen) return null;

  const filteredRfqs = rfqs.filter((r) => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        r.rfqNumber.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.contact.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeRfq = rfqs.find((r) => r.id === selectedRfqId) || filteredRfqs[0] || null;

  const handlePriceUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRfq) return;
    const num = parseFloat(customPriceInput);
    if (!isNaN(num) && num > 0) {
      onUpdateStatus(activeRfq.id, 'QUOTED', num);
      setEditingPriceRfqId(null);
    }
  };

  const getStatusBadge = (status: RfqStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[11px] font-bold">NEW</span>;
      case 'REVIEWING':
        return <span className="bg-sky-100 text-sky-800 border border-sky-300 px-2 py-0.5 rounded text-[11px] font-bold">REVIEWING</span>;
      case 'MATCHING':
        return <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 px-2 py-0.5 rounded text-[11px] font-bold">MATCHING</span>;
      case 'QUOTED':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded text-[11px] font-bold">QUOTED</span>;
      case 'ACCEPTED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[11px] font-bold">ACCEPTED</span>;
      case 'CONVERTED':
        return <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[11px] font-black">CONVERTED (WC)</span>;
      case 'REJECTED':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded text-[11px] font-bold">REJECTED</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        id="rfq-admin-modal"
      >
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-md text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold leading-tight">
                  Commercial RFQ Sales Desk & Order Converter
                </h2>
                <span className="text-[10px] bg-amber-500/30 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded uppercase font-bold">
                  Admin Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage industrial inquiries, set BDT prices, inspect BOQs, and convert into WooCommerce Orders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: List & Filters */}
          <div className="w-80 md:w-96 border-r border-slate-200 flex flex-col bg-slate-50">
            {/* Filter Controls */}
            <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search RFQ #, company, contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto text-[11px] font-bold">
                {['ALL', 'NEW', 'QUOTED', 'ACCEPTED', 'CONVERTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      filterStatus === st 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
              {filteredRfqs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No RFQs matching selected filter.
                </div>
              ) : (
                filteredRfqs.map((rfq) => (
                  <div
                    key={rfq.id}
                    onClick={() => {
                      setSelectedRfqId(rfq.id);
                      setEditingPriceRfqId(null);
                    }}
                    className={`p-3 cursor-pointer transition-colors border-l-4 ${
                      activeRfq?.id === rfq.id 
                        ? 'bg-amber-50/70 border-l-amber-600' 
                        : 'bg-white hover:bg-slate-100/70 border-l-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {rfq.rfqNumber}
                      </span>
                      {getStatusBadge(rfq.status)}
                    </div>
                    <div className="font-semibold text-xs text-slate-800 truncate">
                      {rfq.company || rfq.contact}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                      <span>{rfq.contact}</span>
                      <span>&bull;</span>
                      <span>{rfq.items.length} item(s)</span>
                    </div>
                    {rfq.quotedTotal && (
                      <div className="text-xs font-bold text-emerald-700 mt-1 font-mono">
                        BDT {rfq.quotedTotal.toLocaleString()}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Selected RFQ Detail View & Operations */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
            {activeRfq ? (
              <>
                {/* Top Inspection Banner */}
                <div className="flex flex-wrap items-start justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono text-lg font-extrabold text-slate-900">
                        {activeRfq.rfqNumber}
                      </h3>
                      {getStatusBadge(activeRfq.status)}
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        activeRfq.isGuest ? 'bg-slate-200 text-slate-700' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {activeRfq.isGuest ? 'Guest Inquiry' : `Account ID #${activeRfq.userId}`}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Logged at: <strong>{activeRfq.createdAt}</strong> &bull; Delivery: <strong>{activeRfq.location}</strong>
                    </div>
                  </div>

                  {/* Actions: Convert to WooCommerce Order */}
                  <div className="flex items-center gap-2">
                    {activeRfq.wcOrderId ? (
                      <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>WooCommerce Order #{activeRfq.wcOrderId}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (confirm(`Convert RFQ ${activeRfq.rfqNumber} into formal WooCommerce Commercial Order?`)) {
                            const newOrderId = onConvertToWcOrder(activeRfq.id);
                            alert(`Order #${newOrderId} successfully created in WooCommerce! Status set to CONVERTED.`);
                          }
                        }}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                        id="btn-convert-wc-order"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                        <span>Convert to WooCommerce Order</span>
                      </button>
                    )}

                    <a
                      href={`https://wa.me/${(activeRfq.whatsapp || activeRfq.phone || '+8801700000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${activeRfq.contact}, regarding your Dhruba Power RFQ ${activeRfq.rfqNumber} for ${activeRfq.company}. Current quotation status: ${activeRfq.status}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Client</span>
                    </a>
                  </div>
                </div>

                {/* Workflow Stepper Controller */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Quotation Lifecycle Workflow
                    </span>
                    <span className="text-xs text-slate-500">
                      Step through pipeline states
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(['NEW', 'REVIEWING', 'MATCHING', 'QUOTED', 'CUSTOMER_REVIEW', 'ACCEPTED', 'CONVERTED', 'REJECTED'] as RfqStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateStatus(activeRfq.id, st)}
                        className={`px-2.5 py-1 text-xs rounded font-bold transition-colors cursor-pointer ${
                          activeRfq.status === st
                            ? 'bg-slate-900 text-white shadow-xs ring-2 ring-amber-400'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Two Columns: Client & Equipment */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Left: Contact Info */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2.5">
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1.5">
                      Client & Site Information
                    </h4>
                    <div>
                      <span className="text-slate-500 block">Company / Plant:</span>
                      <strong className="text-slate-900">{activeRfq.company || 'Individual / Unspecified'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Contact Person:</span>
                      <strong className="text-slate-900">{activeRfq.contact}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Official Email:</span>
                      <a href={`mailto:${activeRfq.email}`} className="text-sky-700 font-mono underline">{activeRfq.email}</a>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Direct Phone:</span>
                      <a href={`tel:${activeRfq.phone}`} className="text-slate-900 font-mono">{activeRfq.phone}</a>
                    </div>
                    {activeRfq.whatsapp && (
                      <div>
                        <span className="text-slate-500 block">WhatsApp:</span>
                        <span className="text-emerald-700 font-mono font-bold">{activeRfq.whatsapp}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500 block">Site Delivery Location:</span>
                      <span className="text-slate-900 font-medium">{activeRfq.location}</span>
                    </div>
                    {activeRfq.message && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-slate-500 block mb-1">Customer Technical Notes:</span>
                        <p className="text-slate-700 italic bg-white p-2 rounded border border-slate-200">
                          "{activeRfq.message}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right 2 cols: Line items & Pricing */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-800">
                        <span>Requested Line Items ({activeRfq.items.length})</span>
                        <span>Quantity & Specifications</span>
                      </div>

                      <div className="divide-y divide-slate-200 text-xs">
                        {activeRfq.items.map((item, idx) => (
                          <div key={idx} className="p-3 bg-white space-y-1">
                            <div className="flex justify-between items-start">
                              <div>
                                {item.brand && (
                                  <span className="text-[10px] font-bold uppercase text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded mr-1.5">
                                    {item.brand}
                                  </span>
                                )}
                                <strong className="text-slate-900">{item.title}</strong>
                              </div>
                              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                                Qty: {item.quantity}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">
                              MPN: {item.mpn || 'N/A'}
                            </div>
                            {item.customerNote && (
                              <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 mt-1">
                                <strong>Client Note:</strong> {item.customerNote}
                              </div>
                            )}
                            {item.unitPrice && (
                              <div className="flex justify-between items-center text-[11px] pt-1 text-slate-600 font-mono">
                                <span>Unit: BDT {item.unitPrice.toLocaleString()}</span>
                                <span className="font-bold text-slate-900">Total: BDT {(item.unitPrice * item.quantity).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Attached Files */}
                    {activeRfq.files && activeRfq.files.length > 0 && (
                      <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-xs space-y-2">
                        <strong className="text-slate-900 block">Attached Project Documents & BOQ:</strong>
                        {activeRfq.files.map((f, i) => (
                          <div key={i} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                            <div>
                              <span className="font-bold text-slate-800 block">{f.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {roundMb(f.size)} &bull; SHA256: {f.sha256.substring(0, 16)}...
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded uppercase">
                              {f.mime.split('/')[1] || 'DOC'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Commercial Pricing & Quotation Total Form */}
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                            Commercial Quotation Valuation
                          </span>
                          <span className="text-xs text-emerald-700">
                            Official BDT quote delivered to customer
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black font-mono text-emerald-900">
                            {activeRfq.quotedTotal ? `BDT ${activeRfq.quotedTotal.toLocaleString()}` : 'Pending Price'}
                          </div>
                        </div>
                      </div>

                      {editingPriceRfqId === activeRfq.id ? (
                        <form onSubmit={handlePriceUpdateSubmit} className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            step="100"
                            placeholder="Enter total BDT quote..."
                            value={customPriceInput}
                            onChange={(e) => setCustomPriceInput(e.target.value)}
                            className="flex-1 p-2 text-xs font-mono font-bold bg-white border border-emerald-400 rounded outline-none"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded cursor-pointer"
                          >
                            Save Quote
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPriceRfqId(null)}
                            className="px-3 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingPriceRfqId(activeRfq.id);
                              setCustomPriceInput(activeRfq.quotedTotal ? String(activeRfq.quotedTotal) : '');
                            }}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>{activeRfq.quotedTotal ? 'Update Quoted Price' : 'Set Commercial Quote (BDT)'}</span>
                          </button>

                          <button
                            onClick={() => alert(`Official Quotation email dispatched to ${activeRfq.email} with RFQ #${activeRfq.rfqNumber}!`)}
                            className="px-3 py-1.5 bg-white border border-emerald-400 text-emerald-800 hover:bg-emerald-100 font-bold text-xs rounded flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email Official Quote</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Select an RFQ from the left list to inspect details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function roundMb(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
