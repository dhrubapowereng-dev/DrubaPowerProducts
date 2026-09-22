import React, { useState } from 'react';
import { RfqItem } from '../types/catalog';
import { 
  X, 
  Trash2, 
  FileUp, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText 
} from 'lucide-react';

interface RfqDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: RfqItem[];
  onUpdateQuantity: (productId: number, qty: number) => void;
  onUpdateNote: (productId: number, note: string) => void;
  onRemoveItem: (productId: number) => void;
  onClearBasket: () => void;
}

export const RfqDrawer: React.FC<RfqDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onUpdateNote,
  onRemoveItem,
  onClearBasket
}) => {
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('Barishal Division');
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const [submittedRfq, setSubmittedRfq] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact || !email || !phone) {
      alert('Please fill in required contact fields (Name, Email, Phone).');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to POST /dhruba/v1/rfq
    setTimeout(() => {
      const now = new Date();
      const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const randomId = Math.random().toString(36).substring(2, 7).toUpperCase();
      const generatedRfqNumber = `RFQ-${yearMonth}-${randomId}`;

      setSubmittedRfq(generatedRfqNumber);
      setIsSubmitting(false);
      onClearBasket();
    }, 600);
  };

  const handleReset = () => {
    setSubmittedRfq(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div 
        className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        id="rfq-drawer"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 rounded-md text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">
                Request For Quotation (RFQ)
              </h2>
              <p className="text-xs text-slate-400">
                Direct Engineering Commercial Desk • Barishal
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

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {submittedRfq ? (
            /* Confirmation Success Screen */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Quote Request Dispatched
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Quotation #{submittedRfq}
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  Your specifications have been logged in the Dhruba Catalog commercial database. Our industrial sales engineer will send your formal BDT quotation with stock status within 2-4 business hours.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact:</span>
                  <span className="font-bold text-slate-800">{contact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-slate-800">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono text-slate-800">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="text-slate-800 font-medium">{location}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/8801700000000?text=${encodeURIComponent(`Hello Dhruba Power, I just submitted RFQ #${submittedRfq} on your portal. Please expedite commercial pricing.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify Engineer via WhatsApp</span>
                </a>

                <button
                  onClick={handleReset}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Back to Catalogue
                </button>
              </div>
            </div>
          ) : (
            /* RFQ Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Selected Products */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span>1. Selected Products in Basket</span>
                    <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-mono text-[11px]">
                      {items.length}
                    </span>
                  </h3>
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearBasket}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {items.length === 0 ? (
                  <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center text-xs text-slate-500 bg-slate-50">
                    No products added to quote basket yet. You can still submit an RFQ by uploading your Bill of Quantities (BOQ) below.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div 
                        key={item.productId}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-sky-700">
                              {item.product.brand}
                            </span>
                            <div className="text-xs font-bold text-slate-900 leading-snug">
                              {item.product.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">
                              MPN: {item.product.mpn}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.productId)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quantity and Line Note */}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                          <div className="flex items-center border border-slate-300 rounded bg-white">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => onUpdateQuantity(item.productId, parseInt(e.target.value, 10) || 1)}
                              className="w-12 text-center text-xs font-bold font-mono outline-none border-x border-slate-300 py-0.5"
                            />
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <input
                            type="text"
                            placeholder="Engineering note (e.g. 230V coil, specific trip curve)..."
                            value={item.customerNote}
                            onChange={(e) => onUpdateNote(item.productId, e.target.value)}
                            className="flex-1 text-[11px] bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Attach BOQ / Tender Document */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <FileUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>2. Attach Bill of Quantities (BOQ / SLD)</span>
                </h3>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Upload tender schedule, single-line diagram, or Excel spreadsheet (PDF, XLSX, DOCX up to 25MB).
                </p>

                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded text-xs font-semibold text-slate-700 cursor-pointer transition-colors">
                    <span>Choose File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFileName(file.name);
                      }}
                    />
                  </label>
                  <span className="text-xs text-slate-600 font-mono truncate max-w-[240px]">
                    {fileName || 'No file selected'}
                  </span>
                </div>
              </div>

              {/* 3. Customer & Project Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  3. Contact & Delivery Details
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-500" /> Company / Factory / Substation Name
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Barishal Engineering & Power Works Ltd."
                      className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-slate-900 bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" /> Contact Person *
                      </label>
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Engr. Name"
                        className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-slate-900 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" /> Official Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="engineer@domain.com"
                        className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-slate-900 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" /> Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+880 1700-000000"
                        className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-slate-900 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-emerald-600" /> WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="For faster quoting"
                        className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> Project Delivery Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Barishal Industrial Estate / Dhaka Project Site"
                      className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Technical Requirements / Tender Delivery Schedule
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="State any specific breaking capacities, enclosure specs, or tender submission deadlines..."
                      className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98 disabled:opacity-50"
                  id="btn-submit-rfq-form"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>{isSubmitting ? 'Generating Official Quote...' : 'Submit Request For Quote'}</span>
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-2">
                  🔒 Dhruba Power Commercial Desk • Barishal, Bangladesh
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
