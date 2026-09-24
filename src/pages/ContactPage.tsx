import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Send, 
  ChevronRight, 
  CheckCircle2,
  Building2
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface ContactPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  lang,
  onNavigate
}) => {
  const t = TRANSLATIONS[lang];

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Substation Engineering',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone) {
      alert('Please fill out your name and contact phone number.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button 
            onClick={() => onNavigate('/')} 
            className="hover:text-slate-900 transition-colors"
          >
            {t.home}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-[#0F172A]">
            {lang === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-[#0F172A] text-white py-14 px-4 border-y border-slate-800 mb-10">
        <div className="max-w-7xl mx-auto text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold text-[#F59E0B]">
            <Building2 className="w-4 h-4 text-[#16A673]" />
            <span>Barishal Central Engineering Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {lang === 'bn' ? 'আমাদের সাথে সরাসরি যোগাযোগ করুন' : 'Connect with Dhruba Power Engineering Desk'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {lang === 'bn'
              ? 'আমাদের প্রধান কার্যালয় ও ওয়ারহাউজ বরিশালে অবস্থিত। জরুরি সেবা বা নতুন প্রকল্পের যেকোনো পরামর্শের জন্য আমাদের হটলাইনে কল বা হোয়াটসঅ্যাপ করুন।'
              : 'Our engineering workshop, central stock warehouse, and technical sales desk are ready to assist with industrial switchgear, solar engineering, and substation projects.'}
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Contact Form */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-lg font-extrabold text-[#0F172A] border-b border-slate-100 pb-3">
                {lang === 'bn' ? 'কার্যালয়ের ঠিকানা ও যোগাযোগ' : 'Headquarters & Engineering Workshop'}
              </h2>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg text-[#D97706] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A] text-sm mb-0.5">
                      {lang === 'bn' ? 'প্রধান ঠিকানা' : 'Official Location'}
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Khan Sarak, Kazipar, C&amp;B Road,<br />
                      Barishal 8200, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg text-[#D97706] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A] text-sm mb-0.5">
                      {lang === 'bn' ? 'হটলাইন ও ফোন' : '24/7 Hotline Phone'}
                    </div>
                    <a href="tel:+8801711197767" className="font-mono font-bold text-[#D97706] hover:underline text-sm block">
                      +880 1711-197767
                    </a>
                    <span className="text-[11px] text-slate-500">Available 24/7 for Emergency Dispatch</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-[#16A673] shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A] text-sm mb-0.5">
                      {lang === 'bn' ? 'হোয়াটসঅ্যাপ হেল্পলাইন' : 'Direct WhatsApp Helpdesk'}
                    </div>
                    <a 
                      href="https://wa.me/8801711197767?text=Hello%20Dhruba%20Power%2C%20I%20want%20to%20inquire%20about%20your%20services." 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-mono font-bold text-[#16A673] hover:underline text-sm block"
                    >
                      +880 1711-197767
                    </a>
                    <span className="text-[11px] text-slate-500">Instant Chat &amp; BOQ Document Transmission</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A] text-sm mb-0.5">
                      {lang === 'bn' ? 'ইমেইল ইনকোয়ারি' : 'Official Email Desk'}
                    </div>
                    <a href="mailto:info@dhrubapower.com" className="font-bold text-slate-800 hover:underline text-sm block">
                      info@dhrubapower.com
                    </a>
                    <span className="text-[11px] text-slate-500">Tenders: rfq@dhrubapower.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-700 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A] text-sm mb-0.5">
                      {lang === 'bn' ? 'অফিস সময়' : 'Office & Warehouse Hours'}
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Saturday – Thursday: 9:00 AM – 8:00 PM<br />
                      Friday: Emergency Service &amp; On-Call Dispatch
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="mb-6">
                <h2 className="text-lg font-extrabold text-[#0F172A]">
                  {lang === 'bn' ? 'প্রকৌশল পরামর্শের জন্য বার্তা পাঠান' : 'Send an Engineering Consultation Inquiry'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Our senior engineering staff will respond with preliminary sizing, estimates, and site survey availability within 4 business hours.
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-[#16A673] text-white rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-emerald-950">Inquiry Received Successfully!</h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Thank you, {formState.name}. A senior power engineer from our Barishal desk will review your details and reach out via {formState.phone}.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormState({ name: '', email: '', phone: '', subject: 'Substation Engineering', message: '' });
                      }}
                      className="px-4 py-2 bg-[#0F172A] text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Engr. Tanvir Ahmed" 
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#0F172A]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                      <input 
                        type="text" 
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="e.g. +880 1711-XXXXXX" 
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#0F172A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="e.g. info@company.com" 
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#0F172A]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Engineering Discipline</label>
                      <select 
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#0F172A] bg-white font-medium"
                      >
                        <option value="Substation Engineering">Sub-Station Engineering &amp; Commissioning</option>
                        <option value="Solar Systems">Industrial Solar &amp; Net-Metering</option>
                        <option value="Lightning Protection">Lightning Arrester &amp; Chemical Earthing</option>
                        <option value="Electrical Wiring">Commercial &amp; Factory Electrical Wiring</option>
                        <option value="CCTV Systems">CC-TV Surveillance Network</option>
                        <option value="Panel Boards">Custom HT/LT Switchgear &amp; Panels</option>
                        <option value="Equipment Supply">Bulk Switchgear / Product Sourcing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Project Details or BOQ Requirements</label>
                    <textarea 
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Describe your plant capacity (e.g. 250 kVA transformer, 30 kW solar), facility location, and required completion schedule..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#0F172A]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#D97706] hover:bg-[#B45309] text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                    >
                      <Send className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'বার্তা পাঠান' : 'Submit Consultation Request'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
