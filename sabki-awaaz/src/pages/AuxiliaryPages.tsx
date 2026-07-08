import React, { useState } from 'react';
import { Language, translations } from '../locales/translations';
import { AppView } from '../components/Navbar';
import { Shield, Phone, Mail, MapPin, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, Send, Building, Award, Users } from 'lucide-react';

// ── ABOUT PAGE ──────────────────────────────────────────────────────────────
export const AboutPage: React.FC<{ lang: Language; onNavigate: (view: AppView) => void }> = ({ lang, onNavigate }) => {
  const t = translations[lang].aboutSection;
  
  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 py-16 px-4 font-sans">
      <div className="max-w-5xl mx-auto space-y-16 animate-fade-in">
        
        {/* Header */}
        <div id="about-section" className="text-center space-y-4">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-widest inline-block">
            National Civic Governance Initiative
          </span>
          <h1 className="text-4xl font-extrabold text-[#0b1d3a] tracking-tight">
            About Sabki Awaaz
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Empowering every Indian citizen through AI-driven transparency, participatory democracy, and direct municipal accountability.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div id="vision-section" className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 space-y-4 border-t-4 border-t-blue-600">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#0b1d3a]">Our Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To transform urban and rural civic governance across India by eliminating bureaucratic friction and bridging the gap between citizens and their elected representatives through real-time artificial intelligence and geospatial verification.
            </p>
          </div>

          <div id="mission-section" className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 space-y-4 border-t-4 border-t-emerald-600">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-[#0b1d3a]">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To ensure that no citizen complaint goes unheard. By deploying multilingual voice processing and automated geotagged evidence classification, Sabki Awaaz guarantees 100% transparent tracking from initial report to final resolution.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-[#0b1d3a] text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Why Sabki Awaaz Matters</span>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">Direct Integration with Parliamentary & Municipal Offices</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional grievance systems often suffer from delays, lack of status transparency, and complex paper trails. Sabki Awaaz leverages cutting-edge Google Gemini AI to automatically summarize long citizen narratives, extract precise ward coordinates, and categorize issues instantly into officer work orders.
            </p>
            <div className="pt-4">
              <button onClick={() => onNavigate('submit')} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md cursor-pointer transition-all">
                Submit a Grievance Now →
              </button>
            </div>
          </div>
          <div className="md:col-span-5">
            <img 
              src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80" 
              alt="Civic Governance" 
              className="rounded-2xl shadow-lg border border-white/20 w-full h-64 object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// ── CONTACT PAGE ────────────────────────────────────────────────────────────
export const ContactPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang].footer;
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 py-16 px-4 font-sans">
      <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-widest inline-block">
            24/7 Citizen Helpdesk
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1d3a] tracking-tight">
            Contact & Support Directory
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Reach out to national grievance officers or submit a general support inquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left info cards */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-[#0b1d3a] border-b border-slate-100 pb-3">Official Helplines</h3>
              
              <div className="flex items-start gap-3 text-sm">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block">Toll-Free Helpline</span>
                  <span className="font-bold text-slate-900 text-base">1800-11-2026</span>
                  <span className="text-xs text-slate-500 block mt-0.5">(Available Mon-Sat, 8:00 AM to 8:00 PM)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm pt-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block">Grievance Support Email</span>
                  <span className="font-bold text-slate-900 text-sm">support@sabkiawaaz.gov.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm pt-2">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block">Headquarters Address</span>
                  <span className="font-bold text-slate-900 text-xs leading-relaxed">National Civic Center, Parliament Street, New Delhi – 110001, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right inquiry form */}
          <div id="feedback-form" className="md:col-span-7 bg-white p-8 rounded-2xl shadow-md border border-slate-200">
            {!sent ? (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <h3 className="text-xl font-bold text-[#0b1d3a] mb-2">Send an Inquiry to Officer Desk</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Your Name</label>
                    <input required type="text" placeholder="Full Name" className="w-full p-3 rounded-lg border border-slate-300 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile / Email</label>
                    <input required type="text" placeholder="Contact Info" className="w-full p-3 rounded-lg border border-slate-300 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subject</label>
                  <select className="w-full p-3 rounded-lg border border-slate-300 text-sm font-medium">
                    <option>General Technical Assistance</option>
                    <option>Grievance Escalation Request</option>
                    <option>Representative Office Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Message</label>
                  <textarea required rows={4} placeholder="Describe your inquiry in detail..." className="w-full p-3 rounded-lg border border-slate-300 text-sm" />
                </div>

                <button type="submit" className="w-full py-3.5 bg-[#0b1d3a] hover:bg-blue-900 text-white font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <span>Send Message</span>
                  <Send size={16} />
                </button>
              </form>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-[#0b1d3a]">Message Received</h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Thank you! An official from our technical helpdesk will contact you within 24 working hours.
                </p>
                <button onClick={() => setSent(false)} className="px-6 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 cursor-pointer">
                  Send Another Inquiry
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

// ── FAQ PAGE ────────────────────────────────────────────────────────────────
export const FaqPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does Sabki Awaaz ensure my complaint reaches the right MP or MLA?",
      a: "Sabki Awaaz integrates geospatial mapping and Google Gemini AI to automatically identify the municipal ward and legislative constituency from your location and text description. Once verified, the complaint is pushed directly to the representative's dashboard."
    },
    {
      q: "Can I report a complaint using voice in regional languages?",
      a: "Yes! Our platform supports multilingual voice recording. Simply tap the mic icon in step 3 of the submission flow and speak naturally in Hindi or English. Our AI transcriber will process and translate the concern."
    },
    {
      q: "What is an estimated SLA for issue resolution?",
      a: "Standard civic infrastructure complaints (like streetlights, garbage collection, and water leaks) are assigned a 48 to 72-hour Service Level Agreement (SLA) for preliminary verification and action by municipal teams."
    },
    {
      q: "Is my personal identity kept confidential?",
      a: "Yes. While your mobile number is required to verify your citizen identity and prevent spam, your personal name and contact details are encrypted and only accessible by authorized grievance redressal officers."
    },
    {
      q: "How can representatives switch between citizen and official views?",
      a: "If you are logged in as an MP/MLA representative, you can use the profile dropdown in the top navbar to instantly toggle between the Representative Ward Dashboard and the Citizen view."
    }
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 py-16 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-widest inline-block">
            Knowledge Base
          </span>
          <h1 className="text-3xl font-extrabold text-[#0b1d3a]">Frequently Asked Questions</h1>
          <p className="text-sm text-slate-600">Everything you need to know about reporting and tracking civic issues.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50 cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp size={18} className="text-blue-600 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

// ── LEGAL PAGES (Privacy & Terms) ───────────────────────────────────────────
export const PrivacyPolicyPage: React.FC = () => (
  <div className="min-h-[calc(100vh-140px)] bg-slate-50 py-16 px-4 font-sans">
    <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-md border border-slate-200 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
      <h1 className="text-3xl font-extrabold text-[#0b1d3a] border-b border-slate-200 pb-4">Privacy Policy & Data Security</h1>
      <p>Last Updated: May 2026. Government of India Civic Portal Guidelines.</p>
      <h3 className="text-base font-bold text-slate-900">1. Information Collection and Verification</h3>
      <p>Sabki Awaaz collects mobile numbers, location coordinates, and photographic evidence solely for the purpose of authenticating citizen grievances and enabling direct municipal action.</p>
      <h3 className="text-base font-bold text-slate-900">2. AI Data Processing</h3>
      <p>All voice recordings and text descriptions submitted to the portal are processed via secure artificial intelligence pipelines to extract key civic concerns without storing personally identifiable information in public logs.</p>
      <h3 className="text-base font-bold text-slate-900">3. Data Sharing</h3>
      <p>Your grievance data is shared exclusively with designated Member of Parliament (MP), Member of Legislative Assembly (MLA), and municipal ward offices responsible for your jurisdiction.</p>
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="min-h-[calc(100vh-140px)] bg-slate-50 py-16 px-4 font-sans">
    <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-md border border-slate-200 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
      <h1 className="text-3xl font-extrabold text-[#0b1d3a] border-b border-slate-200 pb-4">Terms & Conditions of Service</h1>
      <p>Welcome to Sabki Awaaz. By accessing or submitting a complaint on this national platform, you agree to the following terms:</p>
      <h3 className="text-base font-bold text-slate-900">1. Authentic Citizen Reporting</h3>
      <p>Users must submit factual and verified civic issues. Submitting false alarms, malicious spam, or doctored evidence is strictly prohibited under IT Act guidelines.</p>
      <h3 className="text-base font-bold text-slate-900">2. Representative Office Commitments</h3>
      <p>Elected representatives using the MP/MLA dashboard commit to reviewing priority AI clusters and updating grievance resolution statuses in a timely and transparent manner.</p>
    </div>
  </div>
);
