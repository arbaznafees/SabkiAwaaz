import React, { useState } from 'react';
import { Language, translations } from '../locales/translations';
import { AppView } from '../components/Navbar';
import { Submission } from '../types';
import { Search, CheckCircle2, Clock, AlertCircle, FileText, MapPin, User, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface TrackComplaintPageProps {
  lang: Language;
  submissions: Submission[];
  onNavigate: (view: AppView) => void;
}

export const TrackComplaintPage: React.FC<TrackComplaintPageProps> = ({
  lang,
  submissions,
  onNavigate
}) => {
  const t = translations[lang].trackPage;
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(true);

  // Find matching submission or show default demonstration complaint
  const match = submissions.find(s => s.id?.toLowerCase() === searchQuery.trim().toLowerCase()) || {
    id: searchQuery || "SA-UP-2026-102450",
    content: "Roads — Potholes on main road near sector market causing waterlogging during rains.",
    status: "VERIFIED",
    timestamp: "17 May 2026, 10:30 AM",
    ward: "Sector 4",
    constituency: "New Delhi Central"
  };

  const getStepStatus = (stepIndex: number, currentStatus: string) => {
    if (currentStatus === 'RESOLVED') return 'completed';
    if (currentStatus === 'VERIFIED') {
      if (stepIndex <= 2) return 'completed';
      if (stepIndex === 3) return 'active';
      return 'pending';
    }
    // PENDING
    if (stepIndex === 1) return 'completed';
    if (stepIndex === 2) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-100 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-widest inline-block">
            Real-Time Citizen Tracking
          </span>
          <h1 className="text-3xl font-extrabold text-[#0b1d3a] tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Search Bar Box */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200">
          <form onSubmit={(e) => { e.preventDefault(); setSearched(true); }} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.placeholder}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#0b1d3a] hover:bg-blue-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{t.btnTrack}</span>
              <ArrowRight size={16} />
            </button>
          </form>
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-500">
            <span>Try demo sample IDs:</span>
            <button onClick={() => { setSearchQuery("SA-UP-2026-102450"); setSearched(true); }} className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100">SA-UP-2026-102450</button>
            <button onClick={() => { setSearchQuery("SA-UP-2026-102304"); setSearched(true); }} className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100">SA-UP-2026-102304</button>
          </div>
        </div>

        {/* Tracking Timeline & Dossier */}
        {searched && match && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden animate-fade-in">
            
            {/* Dossier Header */}
            <div className="bg-[#0b1d3a] text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block">Grievance Dossier Status</span>
                <h3 className="text-xl sm:text-2xl font-black font-mono tracking-tight">{match.id}</h3>
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <MapPin size={14} className="text-blue-400" />
                  <span>Ward: <strong className="text-white">{match.ward || "Sector 4"}</strong> — Jurisdiction: <strong className="text-white">{match.constituency || "New Delhi Central"}</strong></span>
                </p>
              </div>

              <div className="flex items-center gap-2 bg-blue-900/80 px-4 py-2 rounded-xl border border-blue-400/40">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {match.status === 'RESOLVED' ? 'Resolved & Closed' : match.status === 'VERIFIED' ? 'Under Municipal Review' : 'In Progress / Assigned'}
                </span>
              </div>
            </div>

            {/* 5-Step Visual Timeline */}
            <div className="p-6 sm:p-10 border-b border-slate-200 bg-slate-50/50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8 text-center">{t.timelineTitle}</h4>
              
              <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 sm:gap-0 max-w-3xl mx-auto">
                
                {/* Connecting Line (Desktop) */}
                <div className="hidden sm:block absolute top-5 left-10 right-10 h-1 bg-slate-200 -z-0">
                  <div className="h-full bg-emerald-500 transition-all duration-700" style={{
                    width: match.status === 'RESOLVED' ? '100%' : match.status === 'VERIFIED' ? '60%' : '30%'
                  }}></div>
                </div>

                {/* Step 1 */}
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 z-10 sm:text-center w-full sm:w-32">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md font-bold text-sm flex-shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{t.stepSubmitted}</h5>
                    <span className="text-[10px] text-slate-500 block font-mono">17 May, 10:30 AM</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 z-10 sm:text-center w-full sm:w-32">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md font-bold text-sm flex-shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{t.stepVerified}</h5>
                    <span className="text-[10px] text-emerald-600 font-bold block">AI Geotagged</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 z-10 sm:text-center w-full sm:w-32">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    match.status === 'VERIFIED' || match.status === 'RESOLVED' 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-[#0b1d3a] text-white ring-4 ring-blue-100 shadow-md animate-pulse'
                  }`}>
                    {match.status === 'VERIFIED' || match.status === 'RESOLVED' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{t.stepAssigned}</h5>
                    <span className="text-[10px] text-blue-700 font-bold block">Officer Docket #402</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 z-10 sm:text-center w-full sm:w-32">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    match.status === 'RESOLVED' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-400 border border-slate-300'
                  }`}>
                    {match.status === 'RESOLVED' ? <CheckCircle2 size={20} /> : 4}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{t.stepResolved}</h5>
                    <span className="text-[10px] text-slate-400 block">Pending verification</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Grievance Summary Details */}
            <div className="p-6 sm:p-8 space-y-6">
              <h4 className="font-bold text-base text-[#0b1d3a] border-b border-slate-200 pb-3">{t.detailsTitle}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-500 font-semibold uppercase block mb-1">Reported Concern</span>
                    <p className="font-bold text-slate-900 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm leading-relaxed">
                      "{match.content}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-semibold uppercase block text-[10px]">Assigned Officer</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">Eng. S. K. Sharma</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-500 font-semibold uppercase block text-[10px]">Estimated SLA</span>
                      <span className="font-bold text-emerald-700 text-sm mt-0.5 block">Within 48 Hours</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-slate-500 font-semibold uppercase block mb-1">Geospatial Evidence & Geotag Layer</span>
                  <div className="border border-slate-300 rounded-xl overflow-hidden relative h-40 bg-slate-100 flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80" 
                      alt="Evidence thumbnail" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1">
                      <MapPin size={12} className="text-emerald-400" />
                      <span>28.6139° N, 77.2090° E (Verified)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Need escalation or follow-up?</span>
              <button onClick={() => onNavigate('contact')} className="font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer">
                Contact Municipal Grievance Officer →
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
