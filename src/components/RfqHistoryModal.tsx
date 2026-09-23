import React, { useState } from 'react';
import { RfqRecord, RfqStatus } from '../types/catalog';
import { 
  X, 
  Search, 
  Clock, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface RfqHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfqs: RfqRecord[];
  isLoggedIn: boolean;
  onOpenRfqDrawer: () => void;
}

export const RfqHistoryModal: React.FC<RfqHistoryModalProps> = ({
  isOpen,
  onClose,
  rfqs,
  isLoggedIn,
  onOpenRfqDrawer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRfqNumber, setSelectedRfqNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter RFQs: if logged in show user's RFQs; if not logged in show guest RFQs
  const userRfqs = rfqs.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.rfqNumber.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.contact.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      );
    }
    // Default list
    return isLoggedIn ? !r.isGuest : r.isGuest;
  });

  const activeRfq = rfqs.find((r) => r.rfqNumber === selectedRfqNumber) || userRfqs[0] || null;

  const PIPELINE_STEPS: { key: RfqStatus; title: string; desc: string }[] = [
    { key: 'NEW', title: '1. RFQ Logged', desc: 'Requirements recorded in Dhruba system' },
    { key: 'REVIEWING', title: '2. Spec Review', desc: 'Engineer verifying ratings, curves & BOM' },
    { key: 'MATCHING', title: '3. Stock & Import', desc: 'Checking Barishal warehouse & factory' },
    { key: 'QUOTED', title: '4. Formal BDT Quote', desc: 'Quotation prepared with price & delivery' },
    { key: 'CUSTOMER_REVIEW', title: '5. Client Review', desc: 'Commercial approval by customer' },
    { key: 'ACCEPTED', title: '6. Confirmed Order', desc: 'Procurement ready for fulfillment' },
  ];

  const getStepIndex = (status: RfqStatus): number => {
    switch (status) {
      case 'NEW': return 0;
      case 'REVIEWING': return 1;
      case 'MATCHING': return 2;
      case 'QUOTED': return 3;
      case 'CUSTOMER_REVIEW': return 4;
      case 'ACCEPTED':
      case 'CONVERTED': return 5;
      default: return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        id="rfq-history-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-md text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold leading-tight">
                  Quotation Tracking & RFQ History
                </h2>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                  {isLoggedIn ? 'Commercial Corporate Account' : 'Guest Inquiries Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Track status, review engineering specifications, and download formalized quotes
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

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Look up quotation by reference number (e.g. RFQ-202609-DP481) or company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-slate-900"
            />
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenRfqDrawer();
            }}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Submit New RFQ</span>
          </button>
        </div>

        {/* Content Body: Left List & Right Detail */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: List */}
          <div className="w-72 md:w-80 border-r border-slate-200 overflow-y-auto divide-y divide-slate-200 bg-slate-50">
            {userRfqs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No past RFQs found. Submit your first quotation request to track it here!
              </div>
            ) : (
              userRfqs.map((rfq) => {
                const isActive = activeRfq?.rfqNumber === rfq.rfqNumber;
                return (
                  <div
                    key={rfq.id}
                    onClick={() => setSelectedRfqNumber(rfq.rfqNumber)}
                    className={`p-3.5 cursor-pointer transition-colors border-l-4 ${
                      isActive 
                        ? 'bg-white border-l-amber-600 shadow-2xs' 
                        : 'bg-slate-50 hover:bg-slate-100/80 border-l-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {rfq.rfqNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rfq.status === 'CONVERTED' 
                          ? 'bg-emerald-600 text-white' 
                          : rfq.status === 'QUOTED' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rfq.status}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-slate-800 truncate">
                      {rfq.company || rfq.contact}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {rfq.items.length} product(s) &bull; {rfq.createdAt.split(' ')[0]}
                    </div>
                    {rfq.quotedTotal && (
                      <div className="text-xs font-bold text-emerald-700 font-mono mt-1">
                        BDT {rfq.quotedTotal.toLocaleString()}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Tracking Progress & Full Specifications */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {activeRfq ? (
              <>
                {/* Header Summary */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                      Official Reference
                    </span>
                    <h3 className="text-xl font-black font-mono text-slate-900">
                      {activeRfq.rfqNumber}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Submitted for: <strong>{activeRfq.company || activeRfq.contact}</strong> &bull; Destination: {activeRfq.location}
                    </p>
                  </div>

                  <div className="text-right">
                    {activeRfq.quotedTotal ? (
                      <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2.5">
                        <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                          Official Quoted Value
                        </span>
                        <div className="text-lg font-black font-mono text-emerald-800">
                          BDT {activeRfq.quotedTotal.toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-center">
                        <span className="text-xs font-bold text-amber-800">Pricing in Review</span>
                        <p className="text-[10px] text-amber-700">SLA: 2-4 business hours</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visual Pipeline Stepper */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Live Procurement Progress
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {PIPELINE_STEPS.map((step, idx) => {
                      const currentIdx = getStepIndex(activeRfq.status);
                      const isComplete = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div 
                          key={step.key}
                          className={`p-2.5 rounded-lg border transition-all ${
                            isCurrent 
                              ? 'bg-amber-50 border-amber-400 shadow-xs' 
                              : isComplete 
                              ? 'bg-slate-50 border-slate-300' 
                              : 'bg-white border-slate-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            {isComplete ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                            )}
                            <span className={isCurrent ? 'text-amber-900' : 'text-slate-800'}>
                              {step.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {step.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Line Items Matrix */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 flex justify-between">
                    <span>Quoted Products & Quantities</span>
                    <span>Specifications</span>
                  </div>

                  <div className="divide-y divide-slate-200 text-xs">
                    {activeRfq.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-white flex justify-between items-center gap-4">
                        <div>
                          {item.brand && (
                            <span className="text-[10px] font-bold uppercase text-sky-700 mr-1.5">
                              {item.brand}
                            </span>
                          )}
                          <strong className="text-slate-900 block">{item.title}</strong>
                          <span className="font-mono text-[11px] text-slate-500">
                            MPN: {item.mpn || 'Custom BOQ Item'}
                          </span>
                          {item.customerNote && (
                            <div className="text-[11px] text-slate-600 italic mt-0.5">
                              Note: {item.customerNote}
                            </div>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                            Qty: {item.quantity}
                          </span>
                          {item.unitPrice && (
                            <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-1">
                              @ BDT {item.unitPrice.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Expedite Button */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">
                      Need priority processing or tender technical clarification?
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Connect directly with our Barishal sales desk via WhatsApp with this RFQ pre-loaded.
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/8801700000000?text=${encodeURIComponent(`Hello Dhruba Power, I am inquiring about my RFQ #${activeRfq.rfqNumber} (${activeRfq.company || activeRfq.contact}). Please provide an update.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Sales Desk</span>
                  </a>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Select an RFQ to view detailed tracking.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
