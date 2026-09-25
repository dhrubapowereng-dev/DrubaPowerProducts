import React, { useState, useEffect } from 'react';
import { RfqItem, RfqRecord, RfqFileRecord } from '../types/catalog';
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
  FileText,
  Plus,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';

interface RfqDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: RfqItem[];
  onUpdateQuantity: (productId: number, qty: number) => void;
  onUpdateNote: (productId: number, note: string) => void;
  onRemoveItem: (productId: number) => void;
  onClearBasket: () => void;
  onAddCustomItem?: (name: string, mpn: string, brand: string, qty: number, note: string) => void;
  onSubmitRfq: (rfqData: Omit<RfqRecord, 'id' | 'createdAt' | 'updatedAt'>) => RfqRecord | Promise<RfqRecord>;
  onOpenHistory: () => void;
  isLoggedIn: boolean;
  onToggleLogin: () => void;
}

export const RfqDrawer: React.FC<RfqDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onUpdateNote,
  onRemoveItem,
  onClearBasket,
  onAddCustomItem,
  onSubmitRfq,
  onOpenHistory,
  isLoggedIn,
  onToggleLogin
}) => {
  // Form states
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('Barishal BSCIC Industrial Estate');
  const [message, setMessage] = useState('');
  
  // Custom unlisted item addition
  const [showCustomItemForm, setShowCustomItemForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMpn, setCustomMpn] = useState('');
  const [customBrand, setCustomBrand] = useState('ABB');
  const [customQty, setCustomQty] = useState(1);
  const [customNote, setCustomNote] = useState('');

  // File Upload
  const [attachedFiles, setAttachedFiles] = useState<RfqFileRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Submission result
  const [submittedRecord, setSubmittedRecord] = useState<RfqRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Sync user profile when switching to logged-in
  useEffect(() => {
    if (isLoggedIn) {
      if (!company) setCompany('Industrial Partner Ltd.');
      if (!contact) setContact('Authorized Procurement Officer');
    }
  }, [isLoggedIn]);

  if (!isOpen) return null;

  // Handle Mock File Upload with sha256 simulation and size checking
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 26214400) {
      alert('File size exceeds maximum 25MB limit.');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      // Generate simulated SHA-256
      const randomHash = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      const newFile: RfqFileRecord = {
        name: file.name,
        size: file.size,
        mime: file.type || 'application/octet-stream',
        sha256: randomHash,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      setAttachedFiles((prev) => [...prev, newFile]);
      setIsUploading(false);
    }, 400);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    if (onAddCustomItem) {
      onAddCustomItem(customName, customMpn, customBrand, customQty, customNote);
    }
    setCustomName('');
    setCustomMpn('');
    setCustomQty(1);
    setCustomNote('');
    setShowCustomItemForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim() || !email.trim() || !phone.trim()) {
      alert('Please provide required contact details (Name, Official Email, Phone).');
      return;
    }

    if (items.length === 0 && attachedFiles.length === 0) {
      alert('Please add at least one product or attach a BOQ/BOM file to submit an RFQ.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(async () => {
      const now = new Date();
      const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const generatedRfqNumber = `RFQ-${yearMonth}-${randomSuffix}`;
      const guestToken = isLoggedIn ? undefined : `gst_${Math.random().toString(36).substring(2, 12)}`;

      const lineItems = items.map((item) => ({
        productId: item.productId,
        title: item.product.name,
        mpn: item.product.mpn,
        brand: item.product.brand,
        quantity: item.quantity,
        customerNote: item.customerNote
      }));

      const newRfq = await onSubmitRfq({
        rfqNumber: generatedRfqNumber,
        company: company.trim() || 'Individual Client',
        contact: contact.trim(),
        email: email.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        location: location.trim(),
        message: message.trim(),
        status: 'NEW',
        isGuest: !isLoggedIn,
        guestToken,
        userId: isLoggedIn ? 42 : undefined,
        items: lineItems,
        files: attachedFiles,
        currency: 'BDT'
      });

      setSubmittedRecord(newRfq);
      setIsSubmitting(false);
      onClearBasket();
    }, 600);
  };

  const handleCopyRfqNumber = () => {
    if (!submittedRecord) return;
    navigator.clipboard.writeText(submittedRecord.rfqNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  // Build dynamic WhatsApp link for the entire basket
  const buildWhatsAppUrl = () => {
    if (!submittedRecord) return '';
    let msg = `Hello Dhruba Power Sales Engineering Desk,\n\n`;
    msg += `Regarding RFQ Number: *${submittedRecord.rfqNumber}*\n`;
    msg += `Company: ${submittedRecord.company}\n`;
    msg += `Contact: ${submittedRecord.contact}\n`;
    msg += `Delivery Site: ${submittedRecord.location}\n\n`;
    msg += `Items Requested:\n`;
    submittedRecord.items.forEach((it, idx) => {
      msg += `${idx + 1}. ${it.title} (MPN: ${it.mpn || 'N/A'}) — Qty: ${it.quantity}\n`;
    });
    msg += `\nPlease expedite quotation with official BDT pricing & Barishal delivery schedule.`;
    return `https://wa.me/8801711197767?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div 
        className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        id="rfq-drawer"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-md text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold leading-tight">
                  Commercial RFQ Desk
                </h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">
                  Multi-Item Basket
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct Engineering Commercial Desk • Barishal Distribution Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHistory}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              title="Track Previous RFQs"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Track RFQs</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Account Mode Bar: Guest RFQ vs Commercial Account */}
        <div className="bg-slate-800 text-xs px-6 py-2 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300">Quotation Mode:</span>
            <span className="font-bold text-white">
              {isLoggedIn ? 'Registered Commercial Client Account' : 'Standard Procurement Quote'}
            </span>
          </div>

          <button
            onClick={onToggleLogin}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
          >
            {isLoggedIn ? 'Sign Out / Guest Mode' : 'Customer Account Login'}
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {submittedRecord ? (
            /* Confirmation Success Screen with Dual Notifications Preview */
            <div className="py-6 space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    Official RFQ Dispatched to Engineering Desk
                  </span>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <h3 className="text-2xl font-black font-mono text-slate-900">
                      {submittedRecord.rfqNumber}
                    </h3>
                    <button
                      onClick={handleCopyRfqNumber}
                      className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                      title="Copy RFQ Number"
                    >
                      {copiedNumber ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                    Your industrial inquiry has been logged in the Dhruba Catalog commercial database. 
                    {submittedRecord.isGuest && (
                      <span className="block mt-1 font-mono text-[11px] text-sky-700 bg-sky-50 py-1 px-2 rounded border border-sky-200">
                        Guest Tracking Token: <strong>{submittedRecord.guestToken}</strong> (Saved in browser)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Automated Dual Notifications Simulation Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-3">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  <span>Automated Dual Email Dispatched</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
                    <span className="font-bold text-emerald-700 block">1. Customer Acknowledgment</span>
                    <p className="text-slate-600 text-[11px]">
                      Sent to <strong>{submittedRecord.email}</strong> with RFQ reference, {submittedRecord.items.length} line items, and 2-4 hr response SLA.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
                    <span className="font-bold text-sky-700 block">2. Internal Sales Engineering Alert</span>
                    <p className="text-slate-600 text-[11px]">
                      Routed to <strong>sales@dhrubapower.com</strong> & Barishal warehouse desk with delivery site: {submittedRecord.location}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Line Items Summary */}
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800">
                  Included In This Quotation ({submittedRecord.items.length} items)
                </div>
                <div className="divide-y divide-slate-200 max-h-40 overflow-y-auto">
                  {submittedRecord.items.map((it, i) => (
                    <div key={i} className="p-2.5 bg-white flex justify-between items-center">
                      <div>
                        <strong className="text-slate-900 block">{it.title}</strong>
                        <span className="font-mono text-[11px] text-slate-500">MPN: {it.mpn || 'N/A'}</span>
                      </div>
                      <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                        Qty: {it.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Expedite via WhatsApp with Barishal Sales Desk</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onOpenHistory}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Track RFQ History</span>
                  </button>

                  <button
                    onClick={() => {
                      setSubmittedRecord(null);
                      onClose();
                    }}
                    className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Back to Catalogue
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-Product RFQ Submission Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Multi-Product Basket */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span>1. Equipment in Quotation Basket</span>
                    <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-mono text-[11px]">
                      {items.length}
                    </span>
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCustomItemForm(!showCustomItemForm)}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showCustomItemForm ? 'Cancel Custom Item' : 'Add Custom Part / BOQ Line'}</span>
                    </button>

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
                </div>

                {/* Optional Custom Item Drawer Accordion */}
                {showCustomItemForm && (
                  <div className="mb-4 p-4 bg-amber-50/70 border border-amber-300 rounded-lg text-xs space-y-3">
                    <div className="font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Add Unlisted / Custom Equipment to Basket</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-semibold mb-1">Equipment / Item Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. 500kVA Distribution Transformer 11/0.415kV"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded outline-none focus:border-slate-900"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Brand</label>
                        <select
                          value={customBrand}
                          onChange={(e) => setCustomBrand(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded outline-none"
                        >
                          <option value="ABB">ABB</option>
                          <option value="Schneider Electric">Schneider Electric</option>
                          <option value="Siemens">Siemens</option>
                          <option value="Chint Power">Chint Power</option>
                          <option value="Huawei Solar">Huawei Solar</option>
                          <option value="Hikvision">Hikvision</option>
                          <option value="Custom OEM">Custom OEM</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Model / MPN</label>
                        <input
                          type="text"
                          placeholder="e.g. ONAN-500KVA-11KV"
                          value={customMpn}
                          onChange={(e) => setCustomMpn(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Quantity *</label>
                        <input
                          type="number"
                          min="1"
                          value={customQty}
                          onChange={(e) => setCustomQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                          className="w-full p-2 bg-white border border-slate-300 rounded outline-none font-mono"
                          required
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={handleAddCustom}
                          className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded cursor-pointer transition-colors"
                        >
                          Add to Basket
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Basket List */}
                {items.length === 0 ? (
                  <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center text-xs text-slate-500 bg-slate-50">
                    No products added to quote basket yet. Browse the catalog to add items, or upload your project tender schedule (BOQ) below.
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

                        {/* Quantity Stepper & Line Note */}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                          <div className="flex items-center border border-slate-300 rounded bg-white shrink-0">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer font-bold"
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
                              className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer font-bold"
                            >
                              +
                            </button>
                          </div>

                          <input
                            type="text"
                            placeholder="Engineering spec note (e.g. 230V coil, specific trip curve, auxiliary contact)..."
                            value={item.customerNote}
                            onChange={(e) => onUpdateNote(item.productId, e.target.value)}
                            className="flex-1 text-[11px] bg-white border border-slate-300 rounded px-2.5 py-1 outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Secure BOQ / Tender File Upload */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <FileUp className="w-3.5 h-3.5 text-amber-600" />
                    <span>2. Attach Bill of Quantities (BOQ / SLD / Tender)</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Max 25MB</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Upload PDF specifications, Excel tender schedules (XLS/XLSX/CSV), or AutoCAD DWG diagrams. Secure non-executable server storage with SHA-256 verification.
                </p>

                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-md text-xs font-bold text-slate-800 cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5">
                    <FileUp className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isUploading ? 'Uploading...' : 'Choose BOQ Document'}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.dwg"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                  <span className="text-xs text-slate-500 italic">
                    {attachedFiles.length === 0 ? 'No files attached' : `${attachedFiles.length} file(s) attached`}
                  </span>
                </div>

                {attachedFiles.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {attachedFiles.map((file, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 text-xs"
                      >
                        <div className="truncate pr-2">
                          <strong className="text-slate-800 block truncate">{file.name}</strong>
                          <span className="text-[10px] font-mono text-slate-500">
                            {Math.round(file.size / 1024)} KB &bull; SHA-256: {file.sha256.substring(0, 16)}...
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 3: Customer & Site Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    3. Contact & Delivery Site Details
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    * Required for official quotation
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-500" /> Company / Factory / Substation
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Barishal Engineering & Power Works Ltd."
                      className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-slate-900 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        <Mail className="w-3 h-3 text-slate-500" /> Official Email (For PDF Quote) *
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        <MessageSquare className="w-3 h-3 text-emerald-600" /> WhatsApp (For instant quoting)
                      </label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+880 1700-000000"
                        className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> Delivery / Substation Site Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Barishal Industrial Estate / Payra Substation / Dhaka"
                      className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Technical Requirements / Tender Submission Deadlines
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="State breaking capacity requirements, enclosure protection (IP54/65), or factory acceptance test (FAT) requirements..."
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
                  className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98 disabled:opacity-50"
                  id="btn-submit-rfq-form"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>
                    {isSubmitting 
                      ? 'Logging Quotation in Dhruba System...' 
                      : `Submit RFQ (${items.length} item${items.length === 1 ? '' : 's'})`}
                  </span>
                </button>
                <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 mt-2.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Direct OEM Warranty
                  </span>
                  <span>&bull;</span>
                  <span>⚡ 2-4 Hour Engineering SLA</span>
                  <span>&bull;</span>
                  <span>Barishal Commercial Desk</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
