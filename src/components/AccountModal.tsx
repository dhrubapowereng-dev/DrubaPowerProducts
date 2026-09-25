import React, { useState } from 'react';
import { X, User, Key, FileText, Heart, Shield, LogOut, CheckCircle2, UserPlus, Lock, Building, Phone, Mail, ArrowLeft } from 'lucide-react';
import { RfqRecord } from '../types/catalog';
import { Language, TRANSLATIONS } from '../data/translations';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfqs: RfqRecord[];
  isLoggedIn: boolean;
  userRole: 'visitor' | 'customer' | 'admin';
  currentUser?: { fullName?: string; email?: string; company?: string } | null;
  onLoginCustomer: (userData: any, token: string) => void;
  onLoginAdmin: (userData: any, token: string) => void;
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
  currentUser,
  onLoginCustomer,
  onLoginAdmin,
  onLogout,
  onOpenRfqHistory,
  onOpenWishlist,
  onOpenAdminPortal,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'staff'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStage, setResetStage] = useState<'request' | 'submit'>('request');

  // Staff login state
  const [adminPasscode, setAdminPasscode] = useState('');

  // Status messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [guestLookupToken, setGuestLookupToken] = useState('');

  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please verify your credentials.');
      }

      localStorage.setItem('dp_auth_token', data.token);
      onLoginCustomer(data.user, data.token);
      setSuccessMsg('Logged in successfully.');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName,
          email: regEmail,
          password: regPassword,
          company: regCompany,
          phone: regPhone
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please check details.');
      }

      localStorage.setItem('dp_auth_token', data.token);
      onLoginCustomer(data.user, data.token);
      setSuccessMsg('Account created successfully!');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      setSuccessMsg(data.message || 'If registered, password reset instructions were generated.');
      setResetStage('submit');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          resetToken,
          newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed.');
      }
      setSuccessMsg('Password has been reset securely. You can now log in.');
      setActiveTab('login');
      setLoginEmail(forgotEmail);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: adminPasscode })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid staff authorization key.');
      }

      localStorage.setItem('dp_auth_token', data.token);
      onLoginAdmin(data.user, data.token);
      setAdminPasscode('');
      setSuccessMsg('Authorized as Engineering Staff.');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#0F172A] px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold tracking-tight">
              {isLoggedIn 
                ? (userRole === 'admin' ? 'Dhruba Engineering Staff Operations' : 'Customer & Procurement Account') 
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

        {/* Modal Body */}
        <div className="overflow-y-auto p-6">
          {/* Logged In View */}
          {isLoggedIn ? (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Active Session</div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{currentUser?.fullName || (userRole === 'admin' ? 'Staff Administrator' : 'Commercial Client')}</span>
                  </div>
                  {currentUser?.company && (
                    <div className="text-[11px] text-slate-500 font-medium">{currentUser.company}</div>
                  )}
                  {currentUser?.email && (
                    <div className="text-[11px] font-mono text-slate-400">{currentUser.email}</div>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer bg-rose-50 px-2.5 py-1.5 rounded border border-rose-200"
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
            /* Logged Out Multi-Tab View */
            <div>
              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 mb-4 text-xs font-bold">
                <button
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`py-2 px-3 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'login' ? 'border-[#0F172A] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`py-2 px-3 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'register' ? 'border-[#0F172A] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Register
                </button>
                <button
                  onClick={() => { setActiveTab('staff'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`py-2 px-3 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'staff' ? 'border-[#0F172A] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Staff Key
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* TAB 1: CUSTOMER LOGIN */}
              {activeTab === 'login' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Access your company RFQs, custom project quotes, and approved bill-of-materials.
                  </p>

                  <form onSubmit={handleCustomerLogin} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Company Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="engineer@company.com"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-slate-900 outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700">Password</label>
                        <button
                          type="button"
                          onClick={() => { setActiveTab('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                          className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-slate-900 outline-none"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2 bg-[#0F172A] hover:bg-[#172033] text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isLoading ? 'Authenticating...' : 'Sign In to Account'}
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
              )}

              {/* TAB 2: CUSTOMER REGISTRATION */}
              {activeTab === 'register' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Create a verified procurement profile for fast technical quotation and order conversion.
                  </p>

                  <form onSubmit={handleCustomerRegister} className="space-y-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Engr. Tariqul Islam"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Company / Corporate Email</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="procurement@industrial-group.com"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={regCompany}
                          onChange={(e) => setRegCompany(e.target.value)}
                          placeholder="Beximco Industries"
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                        <input
                          type="text"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+880 1712-000000"
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Create Password (min. 6 characters)</label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md outline-none"
                        required
                        minLength={6}
                      />
                    </div>

                    <p className="text-[10px] text-slate-500">
                      Note: Public registration strictly provisions verified client credentials. Administrator roles are managed via internal infrastructure.
                    </p>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isLoading ? 'Creating Account...' : 'Register Corporate Account'}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: FORGOT PASSWORD */}
              {activeTab === 'forgot' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Reset your industrial client password securely using your registered corporate email address.
                  </p>

                  {resetStage === 'request' ? (
                    <form onSubmit={handleForgotPasswordRequest} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Company Email</label>
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="engineer@company.com"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 bg-[#0F172A] hover:bg-[#172033] text-white text-xs font-bold rounded-md transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? 'Requesting...' : 'Request Password Reset Token'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handlePasswordResetSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Reset Token</label>
                        <input
                          type="text"
                          value={resetToken}
                          onChange={(e) => setResetToken(e.target.value)}
                          placeholder="Enter authorization reset token..."
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md outline-none font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md outline-none"
                          required
                          minLength={6}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-md transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? 'Updating Password...' : 'Save New Password'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 4: STAFF ACCESS */}
              {activeTab === 'staff' && (
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
                      Production staff credential verified via PBKDF2 cryptographic hashing.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>{isLoading ? 'Verifying...' : 'Authenticate Staff Session'}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
