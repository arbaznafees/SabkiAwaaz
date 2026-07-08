import React, { useState } from 'react';
import { Language, translations } from '../locales/translations';
import { AppView, UserState } from '../components/Navbar';
import { BrandLogo } from '../components/BrandLogo';
import { Submission } from '../types';
import { CONSTITUENCIES } from '../constants';
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Bell, 
  User, 
  HelpCircle, 
  LogOut, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  ChevronRight,
  Filter,
  Sparkles,
  MapPin,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';

const bgIllustration = new URL('../national_grievance_portal_bg.jpg', import.meta.url).href;
const mumbaiBg = new URL('../mumbai_south_bg.png', import.meta.url).href;
const bengaluruBg = new URL('../bengaluru_central_bg.png', import.meta.url).href;

interface CitizenDashboardPageProps {
  lang: Language;
  user: UserState;
  submissions: Submission[];
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  onConstituencyChange: (cons: string) => void;
}

export const CitizenDashboardPage: React.FC<CitizenDashboardPageProps> = ({
  lang,
  user,
  submissions,
  onNavigate,
  onLogout,
  onConstituencyChange
}) => {
  const t = translations[lang].dashboardCitizen;
  const commonT = translations[lang].common;
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'notifications' | 'profile'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const handleLandingNavigate = (sectionId: string) => {
    (window as any).preventScrollToTop = true;
    onNavigate('landing');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      (window as any).preventScrollToTop = false;
    }, 100);
  };

  const handleContactNavigate = (sectionId: string) => {
    (window as any).preventScrollToTop = true;
    onNavigate('contact');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      (window as any).preventScrollToTop = false;
    }, 100);
  };

  // Compute stats from real backend submissions if available, fallback to realistic reference stats
  const totalCount = submissions.length > 0 ? submissions.length : 5;
  const inProgressCount = submissions.length > 0 ? submissions.filter(s => s.status === 'PENDING').length : 2;
  const underReviewCount = submissions.length > 0 ? submissions.filter(s => s.status === 'VERIFIED').length : 1;
  const resolvedCount = submissions.length > 0 ? submissions.filter(s => s.status === 'RESOLVED').length : 2;
  const resRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) || 85 : 85;

  // Recent complaints list (use real or fallback)
  const displayComplaints = submissions.length > 0 ? submissions.slice(0, 5) : [
    { id: "SA-UP-2026-102450", content: "Roads — Potholes on main road near sector market", status: "PENDING", timestamp: "17 May 2026", ward: "Sector 4" },
    { id: "SA-UP-2026-102304", content: "Water — Irregular water supply and low pressure", status: "VERIFIED", timestamp: "16 May 2026", ward: "Ward 12" },
    { id: "SA-UP-2026-101987", content: "Sanitation — Garbage not collected for 3 days", status: "RESOLVED", timestamp: "15 May 2026", ward: "Indira Nagar" },
    { id: "SA-UP-2026-101452", content: "Streetlight — Malfunctioning LED lamp post", status: "RESOLVED", timestamp: "12 May 2026", ward: "Sector 4" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>{t.resolved}</span>;
      case 'VERIFIED':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>{t.underReview}</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>{t.inProgress}</span>;
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-100 flex flex-col md:flex-row font-sans relative">
      
      {/* ── MOBILE HEADER (Visible only on mobile/tablet) ────────────── */}
      <div className="md:hidden flex justify-between items-center bg-[#0b1d3a] text-white px-5 py-4 border-b border-blue-950 sticky top-0 z-30 shadow-md w-full">
        <BrandLogo 
          theme="dark" 
          size="xs" 
          subtitle="CITIZEN PORTAL" 
          onClick={() => onNavigate('landing')} 
        />
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white cursor-pointer"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 z-35 bg-black/60 md:hidden animate-fade-in"
        />
      )}

      {/* ── SIDEBAR (Deep Navy Blue matching reference image, hidden on mobile by default) ────────────── */}
      <aside 
        className={`fixed top-[57px] bottom-0 left-0 z-40 w-64 bg-[#0b1d3a] text-white flex flex-col justify-between flex-shrink-0 border-r border-blue-950 transition-transform duration-300 ease-in-out overflow-y-auto md:sticky md:top-0 md:h-[calc(100vh-140px)] md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        <div className="p-6">
          {/* Brand header */}
          <div className="pb-6 border-b border-white/15 mb-6 hidden md:block">
            <BrandLogo 
              theme="dark" 
              size="sm" 
              subtitle="CITIZEN PORTAL" 
              onClick={() => { onNavigate('landing'); setIsSidebarOpen(false); }} 
            />
          </div>

          {/* Sidebar Menu */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>{t.overview}</span>
            </button>

            <button
              onClick={() => { setActiveTab('complaints'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'complaints' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FileText size={18} />
              <span>{t.myComplaints}</span>
              <span className="ml-auto bg-white/20 px-2 py-0.5 rounded text-[10px]">{totalCount}</span>
            </button>

            <button
              onClick={() => { setActiveTab('notifications'); setIsSidebarOpen(false); setHasUnreadNotifications(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'notifications' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Bell size={18} />
              <span>{t.notifications}</span>
              {hasUnreadNotifications && (
                <span className="ml-auto bg-red-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse">3</span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'profile' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <User size={18} />
              <span>{t.profile}</span>
            </button>

            <button
              onClick={() => { onNavigate('faq'); setIsSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <HelpCircle size={18} />
              <span>{t.helpSupport}</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom: Area Improvement CTA Card & Logout */}
        <div className="p-6 space-y-4">
          <div className="bg-gradient-to-br from-blue-900/80 to-blue-950 p-4 rounded-xl border border-blue-800/80 shadow-inner text-center space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.ctaTitle}</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">{t.ctaDesc}</p>
            <button
              onClick={() => { onNavigate('submit'); setIsSidebarOpen(false); }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {t.ctaBtn}
            </button>
          </div>

          <button
            onClick={() => { onLogout(); setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-xs font-bold cursor-pointer border-t border-white/10 pt-4"
          >
            <LogOut size={18} />
            <span>{t.logout}</span>
          </button>
        </div>

      </aside>

      {/* ── MAIN DASHBOARD CONTENT ───────────────────────────────────────── */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {/* Top Header Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-8 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1d3a] tracking-tight">
              {t.welcome} {user.name}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">{t.subtitle}</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Constituency Selector */}
            <select
              value={user.constituency}
              onChange={(e) => onConstituencyChange(e.target.value)}
              className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-[#0b1d3a] shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex-1 sm:flex-none"
            >
              {CONSTITUENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <button onClick={() => onNavigate('submit')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
              <PlusCircle size={15} />
              <span>New Complaint</span>
            </button>
          </div>
        </div>

        {/* OVERVIEW VIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* 5 Statistics Strip Cards matching Reference Image */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">{t.totalComplaints}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-[#0b1d3a]">{totalCount}</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">All time</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs border-l-4 border-l-amber-500">
                <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">{t.inProgress}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-amber-600">{inProgressCount}</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs border-l-4 border-l-blue-500">
                <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">{t.underReview}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-blue-600">{underReviewCount}</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Verifying</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs border-l-4 border-l-emerald-500">
                <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">{t.resolved}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-emerald-600">{resolvedCount}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Closed</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <span className="text-xs font-bold text-blue-900 block mb-2 uppercase">{t.resolutionRate}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-blue-800">{resRate}%</span>
                  <TrendingUp size={18} className="text-emerald-600" />
                </div>
              </div>

            </div>

            {/* Middle Grid: Recent Complaints & Status Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left 8 Cols: Recent Complaints Table/Cards */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-base text-[#0b1d3a] flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    <span>{t.recentTitle}</span>
                  </h3>
                  <button onClick={() => setActiveTab('complaints')} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer">
                    <span>{t.viewAll}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {displayComplaints.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono font-bold text-slate-500">{item.id || `SA-2026-${100 + idx}`}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-medium">{item.timestamp || "17 May 2026"}</span>
                          {item.ward && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold text-[10px]">{item.ward}</span>
                            </>
                          )}
                        </div>
                        <p className="font-bold text-sm text-slate-900 leading-snug">{item.content || item.extracted_concern}</p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {getStatusBadge(item.status)}
                        <button onClick={() => onNavigate('track')} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="View details">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 4 Cols: Complaint Status Chart & Notice Board */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Visual Status Breakdown Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="font-bold text-base text-[#0b1d3a]">{t.statusChartTitle}</h3>
                  
                  {/* Doughnut visualization */}
                  <div className="flex items-center justify-center py-4">
                    <div className="relative w-36 h-36 rounded-full border-8 border-amber-500 flex items-center justify-center shadow-inner" style={{
                      borderColor: '#f97316',
                      borderRightColor: '#10b981',
                      borderBottomColor: '#10b981',
                      borderTopColor: '#3b82f6'
                    }}>
                      <div className="text-center">
                        <span className="text-2xl font-black text-[#0b1d3a] block leading-none">{totalCount}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Total</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-semibold pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>In Progress</span>
                      <span>{inProgressCount} ({Math.round((inProgressCount/totalCount)*100)}%)</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Under Review</span>
                      <span>{underReviewCount} ({Math.round((underReviewCount/totalCount)*100)}%)</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Resolved</span>
                      <span>{resolvedCount} ({Math.round((resolvedCount/totalCount)*100)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Notice Board */}
                <div className="bg-[#0b1d3a] text-white p-6 rounded-2xl border border-blue-900 shadow-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base flex items-center gap-2 text-amber-400">
                      <MessageSquare size={18} />
                      <span>{t.noticeBoard}</span>
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300 divide-y divide-white/10">
                    <p className="pt-2 leading-relaxed flex gap-2"><span className="text-amber-400 font-bold">•</span><span>{t.notice1}</span></p>
                    <p className="pt-2 leading-relaxed flex gap-2"><span className="text-amber-400 font-bold">•</span><span>{t.notice2}</span></p>
                    <p className="pt-2 leading-relaxed flex gap-2"><span className="text-amber-400 font-bold">•</span><span>{t.notice3}</span></p>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Row: Quick Actions */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#0b1d3a]">{t.quickActions}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <button
                  onClick={() => onNavigate('submit')}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-500 transition-all text-left group flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <PlusCircle size={20} />
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{t.qaReport}</h4>
                    <p className="text-xs text-slate-500">Register new civic issue</p>
                  </div>
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => handleLandingNavigate('public-issues-section')}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-500 transition-all text-left group flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Sparkles size={20} />
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{t.qaPublic}</h4>
                    <p className="text-xs text-slate-500">Explore constituency heatmap</p>
                  </div>
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => handleContactNavigate('feedback-form')}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-500 transition-all text-left group flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <HelpCircle size={20} />
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{t.qaFeedback}</h4>
                    <p className="text-xs text-slate-500">Contact support & officers</p>
                  </div>
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </button>

              </div>
            </div>

            {/* Bottom Banner Quote */}
            <div className="bg-gradient-to-r from-blue-900 to-[#0b1d3a] text-white p-6 rounded-2xl shadow-md text-center">
              <p className="text-base font-bold tracking-wide italic">"{t.bannerQuote}"</p>
            </div>

          </div>
        )}

        {/* MY COMPLAINTS VIEW */}
        {activeTab === 'complaints' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-[#0b1d3a]">{t.myComplaints} ({totalCount})</h2>
              <button onClick={() => onNavigate('submit')} className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs">File New Grievance</button>
            </div>

            <div className="divide-y divide-slate-100">
              {displayComplaints.map((item: any, idx: number) => (
                <div key={idx} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="font-mono text-xs text-slate-500">{item.id || `SA-2026-${100+idx}`}</span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{item.content || item.extracted_concern}</h4>
                    <p className="text-xs text-slate-500 mt-1">Submitted on {item.timestamp || "17 May 2026"} • Ward: {item.ward || "Sector 4"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS VIEW */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-[#0b1d3a] border-b border-slate-200 pb-4">Civic Notifications & Alerts</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                <Bell size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-blue-900">Voice Note Registration Live!</h4>
                  <p className="text-xs text-blue-800 mt-1">{t.notice1}</p>
                  <span className="text-[10px] text-blue-600 font-mono mt-2 block">2 hours ago</span>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-900">Swachhata Abhiyan Clean-Up Drive</h4>
                  <p className="text-xs text-emerald-800 mt-1">{t.notice2}</p>
                  <span className="text-[10px] text-emerald-600 font-mono mt-2 block">1 day ago</span>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-900">Scheduled Water Maintenance</h4>
                  <p className="text-xs text-amber-800 mt-1">{t.notice3}</p>
                  <span className="text-[10px] text-amber-600 font-mono mt-2 block">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE VIEW */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in relative">
            {/* Background watermark image */}
            <div className="absolute right-0 bottom-0 w-96 h-96 opacity-[0.03] pointer-events-none z-0">
              <img 
                src={
                  user.constituency === 'Mumbai South' 
                    ? mumbaiBg 
                    : user.constituency === 'Bengaluru Central' 
                      ? bengaluruBg 
                      : bgIllustration
                } 
                alt="Secretariat Emblem" 
                className="w-full h-full object-contain" 
              />
            </div>

            {/* Profile Info Card (Left 7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6 relative z-10">
              <h2 className="text-xl font-bold text-[#0b1d3a] border-b border-slate-200 pb-4">My Citizen Profile</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Full Name</span>
                  <span className="font-bold text-slate-800">{user.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Constituency</span>
                  <span className="font-bold text-blue-700">{user.constituency}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Role</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded text-xs uppercase">Verified Citizen</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Mobile Number</span>
                  <span className="font-bold text-slate-800">+91 9876543210</span>
                </div>
              </div>
            </div>

            {/* Civic Infographic Card (Right 5 Cols) to fill vacant space */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#f0f9ff] to-white rounded-2xl border border-blue-200 shadow-2xs p-6 space-y-6 relative overflow-hidden z-10">
              {/* Secretariat image in miniature */}
              <div className="h-40 rounded-xl overflow-hidden relative border border-blue-100">
                <img 
                  src={
                    user.constituency === 'Mumbai South' 
                      ? mumbaiBg 
                      : user.constituency === 'Bengaluru Central' 
                        ? bengaluruBg 
                        : bgIllustration
                  } 
                  alt="Secretariat Architecture" 
                  className="w-full h-full object-cover opacity-90 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1d3a]/60 via-transparent to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-xs font-bold text-white uppercase tracking-wider bg-blue-600/80 px-2 py-0.5 rounded">
                  {
                    user.constituency === 'Mumbai South'
                      ? 'MUMBAI DISTRICT'
                      : user.constituency === 'Bengaluru Central'
                        ? 'BENGALURU DISTRICT'
                        : 'NEW DELHI DISTRICT'
                  }
                </span>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-[#0b1d3a] uppercase tracking-wider">Citizen Charter</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  As a registered citizen of <strong>{user.constituency}</strong>, you can report local civic hazards like water supply outages, broken roads, sanitation issues, and malfunctioning streetlights directly to your Member of Parliament's office.
                </p>
                <div className="bg-white border border-blue-100 p-3 rounded-lg text-[11px] text-blue-900 font-medium">
                  • Instant SMS tracking updates<br/>
                  • Verified resolution proof<br/>
                  • Direct link with constituency representatives
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
