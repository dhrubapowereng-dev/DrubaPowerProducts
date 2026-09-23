import React, { useState } from 'react';
import { X, User, Key, FileText, Heart, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { RfqRecord } from '../types/catalog';
import { Language, TRANSLATIONS } from '../data/translations';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfqs: RfqRecord[];
  isLoggedIn: boolean;
  userRole: 'visitor' | 'customer' | 'admin';
  onLoginCustomer: (email: string) => void;
  onLoginAdmin: (passcode: string) => boolean;
  onLogout: () => void;
  onOpenRfqHistory: () => void;
  onOpenWishlist: () => void;
  onOpenAdminPortal: () => void;
  lang: Language;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  rfqs,
  isLoggedIn,
  userRole,
  onLoginCustomer,
  onLoginAdmin,
  onLogout,
  onOpenRfqHistory,
  onOpenWishlist,
  onOpenAdminPortal,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'staff'>('customer');
  const [customerEmail, setCustomerEmail] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [guestLookupToken, setGuestLookupToken] = useState('');
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim()) {
      setErrorMsg('Please enter a valid company email address.');
      return;
    }
    setErrorMsg('');
    onLoginCustomer(customerEmail.trim());
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = onLoginAdmin(adminPasscode);
    if (!success) {
      setErrorMsg('Invalid staff authorization credential.');
    } else {
      setAdminPasscode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0F172A] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold tracking-tight">
              {isLoggedIn 
                ? (userRole === 'admin' ? 'Dhruba Engineering Staff Portal' : 'Customer & Procurement Account') 
                : (lang === 'bn' ? 'কাস্টমার ও অ্যাকাউন্ট পোর্টাল' : 'Customer & Procurement Portal')}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Logged In View */}
        {isLoggedIn ? (
          <div className="p-6 space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Active Session</div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{userRole === 'admin' ? 'Staff Administrator' : 'Verified Commercial Client'}</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenRfqHistory();
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Track RFQ History & Quotes</span>
                </span>
                <span className="bg-slate-300 text-slate-800 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                  {rfqs.length}
                </span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenWishlist();
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>Saved Engineering BOMs</span>
                </span>
              </button>

              {userRole === 'admin' && (
                <div className="pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminPortal();
                    }}
                    className="w-full py-2.5 px-4 bg-[#0F172A] hover:bg-[#172033] text-amber-400 text-xs font-bold rounded-lg flex items-center justify-between transition-colors cursor-pointer border border-slate-700 shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Open Admin Operations Desk</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">
                      Authorized
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Logged Out Login Form */
          <div className="p-6">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-5">
              <button
                onClick={() => {
                  setActiveTab('customer');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
                  activeTab === 'customer' 
                    ? 'border-[#0F172A] text-slate-900' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Customer / Guest Lookup
              </button>
              <button
                onClick={() => {
                  setActiveTab('staff');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
                  activeTab === 'staff' 
                    ? 'border-[#0F172A] text-slate-900' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Engineering Staff Access
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
                {errorMsg}
              </div>
            )}

            {activeTab === 'customer' ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Log in with your corporate email to access saved quotes, track order conversions, and review RFQ history.
                </p>

                <form onSubmit={handleCustomerSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Email</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="engineer@company.com"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-slate-900 outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#0F172A] hover:bg-[#172033] text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-xs"
                  >
                    Access Customer Account
                  </button>
                </form>

                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-700 mb-1.5">Have an RFQ Reference Number?</div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={guestLookupToken}
                      onChange={(e) => setGuestLookupToken(e.target.value)}
                      placeholder="e.g. RFQ-2026-8910"
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenRfqHistory();
                      }}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-md transition-colors cursor-pointer"
                    >
                      Track
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Restricted to authorized Dhruba Power engineers, switchgear sales staff, and system administrators.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Staff Access Passcode</label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      placeholder="Enter administrator credential..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-slate-900 outline-none"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Demo staff key: <code className="font-mono bg-slate-100 px-1 rounded">dhruba2026</code>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Authenticate Staff Session</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
