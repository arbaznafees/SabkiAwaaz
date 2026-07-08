import React, { useState, useEffect } from 'react';
import { Language, translations } from '../locales/translations';
import { AppView, UserState } from '../components/Navbar';
import { BrandLogo } from '../components/BrandLogo';
import { Submission, DashboardData } from '../types';
import { fetchDashboardData, updateSubmissionStatus } from '../api';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Map, 
  BarChart2, 
  MessageSquare, 
  HelpCircle, 
  LogOut, 
  Download, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  Filter, 
  ChevronRight, 
  Check, 
  Loader2,
  MapPin,
  Flame,
  Award,
  Menu,
  X
} from 'lucide-react';

interface RepresentativeDashboardPageProps {
  lang: Language;
  user: UserState;
  submissions: Submission[];
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  onStatusUpdated: () => void;
}

export const RepresentativeDashboardPage: React.FC<RepresentativeDashboardPageProps> = ({
  lang,
  user,
  submissions,
  onNavigate,
  onLogout,
  onStatusUpdated
}) => {
  const t = translations[lang].dashboardRep;
  const [activeTab, setActiveTab] = useState<'dashboard' | 'priorities' | 'heatmap' | 'analytics' | 'messages'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch backend dashboard data if available
  useEffect(() => {
    const loadDashboard = async () => {
      setLoadingData(true);
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.warn("Backend dashboard data fetch offline or fallback mode:", err);
      } finally {
        setLoadingData(false);
      }
    };
    loadDashboard();
  }, []);

  // Handle status update
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateSubmissionStatus(id, newStatus);
      onStatusUpdated();
    } catch (err) {
      console.warn("Offline status update simulated:", err);
      onStatusUpdated();
    } finally {
      setUpdatingId(null);
    }
  };

  // Compute stats from backend data or fallback
  const totalComplaints = dashboardData ? dashboardData.metrics.total_complaints : (submissions.length > 0 ? submissions.length * 12 : 1240);
  const highPriority = dashboardData ? dashboardData.metrics.high_priority_count : 18;
  const inProgressCount = dashboardData ? dashboardData.metrics.pending_count : 412;
  const resolvedCount = dashboardData ? dashboardData.metrics.resolved_count : 810;
  const resRate = Math.round((resolvedCount / (totalComplaints || 1)) * 100) || 88;

  // Top priorities list
  const priorities = (dashboardData && dashboardData.top_priorities && dashboardData.top_priorities.length > 0)
    ? dashboardData.top_priorities
    : [
        { ward: "Sector 4", issue: "Severe road pothole damage and waterlogging causing traffic congestion", priority: "CRITICAL", count: 42, category: "Roads" },
        { ward: "Ward 12", issue: "Contaminated drinking water pipeline leak reported across residential block", priority: "HIGH", count: 28, category: "Water" },
        { ward: "Indira Nagar", issue: "Open garbage dump overflowing near school premises", priority: "HIGH", count: 19, category: "Sanitation" },
        { ward: "Ward 8", issue: "Transformer sparking and street lights non-functional", priority: "MEDIUM", count: 14, category: "Electrical" }
      ];

  // Ward heatmap data
  const wardHeatmap = dashboardData?.ward_heatmap || [
    { ward: "Sector 4", complaints: 184, intensity: "High", color: "bg-red-500" },
    { ward: "Ward 12", complaints: 142, intensity: "High", color: "bg-red-500" },
    { ward: "Indira Nagar", complaints: 98, intensity: "Medium", color: "bg-amber-500" },
    { ward: "Ward 8", complaints: 64, intensity: "Medium", color: "bg-amber-500" },
    { ward: "Civil Lines", complaints: 32, intensity: "Low", color: "bg-emerald-500" },
    { ward: "Green Park", complaints: 18, intensity: "Low", color: "bg-emerald-500" }
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-100 flex flex-col md:flex-row font-sans relative">
      
      {/* ── MOBILE HEADER (Visible only on mobile/tablet) ────────────── */}
      <div className="md:hidden flex justify-between items-center bg-[#082f1e] text-white px-5 py-4 border-b border-emerald-950 sticky top-0 z-30 shadow-md w-full">
        <BrandLogo 
          theme="dark" 
          size="xs" 
          subtitle="MP / MLA OFFICE" 
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

      {/* ── SIDEBAR (Green Accent Theme for MP/MLA Office, hidden on mobile by default) ──────────────── */}
      <aside 
        className={`fixed top-[57px] bottom-0 left-0 z-40 w-64 bg-[#082f1e] text-white flex flex-col justify-between flex-shrink-0 border-r border-emerald-950 transition-transform duration-300 ease-in-out overflow-y-auto md:sticky md:top-0 md:h-[calc(100vh-140px)] md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        <div className="p-6">
          {/* Brand header */}
          <div className="pb-6 border-b border-white/15 mb-6 hidden md:block">
            <BrandLogo 
              theme="dark" 
              size="sm" 
              subtitle="MP / MLA OFFICE" 
              onClick={() => { onNavigate('landing'); setIsSidebarOpen(false); }} 
            />
          </div>

          {/* Sidebar Menu */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>{t.wardDash}</span>
            </button>

            <button
              onClick={() => { setActiveTab('priorities'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'priorities' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <AlertTriangle size={18} className="text-amber-400" />
              <span>{t.aiPriorities}</span>
              <span className="ml-auto bg-red-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{highPriority}</span>
            </button>

            <button
              onClick={() => { setActiveTab('heatmap'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'heatmap' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Map size={18} />
              <span>{t.heatmap}</span>
            </button>

            <button
              onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'analytics' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart2 size={18} />
              <span>{t.analytics}</span>
            </button>

            <button
              onClick={() => { setActiveTab('messages'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'messages' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <MessageSquare size={18} />
              <span>{t.messages}</span>
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

        {/* Sidebar Bottom: Urgent Civic Issues Alert Box & Logout */}
        <div className="p-6 space-y-4">
          <div className="bg-red-950/80 p-4 rounded-xl border border-red-700/80 shadow-inner text-left space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase">
              <Flame size={16} className="animate-bounce" />
              <span>{t.urgentTitle}</span>
            </div>
            <p className="text-[11px] text-red-200 leading-relaxed">{t.urgentDesc}</p>
            <button
              onClick={() => { setActiveTab('priorities'); setIsSidebarOpen(false); }}
              className="w-full py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded shadow-2xs transition-colors cursor-pointer mt-1"
            >
              View Urgent List ({highPriority})
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082f1e] tracking-tight flex items-center gap-2">
              <span>{t.welcome} {user.name}</span>
              <span className="inline-block animate-bounce">🏛️</span>
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Managing Jurisdiction: <strong className="text-slate-900">{user.constituency}</strong> — Municipal Authority Verified
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => alert("Ward analytics dossier downloaded as CSV/PDF report.")}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-4 py-2.5 rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Download size={15} />
              <span>{t.exportBtn}</span>
            </button>

            <button 
              onClick={() => setActiveTab('messages')}
              className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Send size={15} />
              <span>{t.broadcastBtn}</span>
            </button>
          </div>
        </div>

        {/* WARD DASHBOARD VIEW */}
        {(activeTab === 'dashboard' || activeTab === 'priorities') && (
          <div className="space-y-8 animate-fade-in">
            
            {/* 5 Statistics Strip Cards matching Reference Image */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">{t.totalComplaints}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-[#082f1e]">{totalComplaints}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">All Wards</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs border-l-4 border-l-red-500 bg-red-50/30">
                <span className="text-xs font-bold text-red-900 block mb-2 uppercase">{t.highPriority}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-red-600">{highPriority}</span>
                  <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">Action Required</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs border-l-4 border-l-amber-500">
                <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">{t.inProgress}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-amber-600">{inProgressCount}</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Assigned</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs border-l-4 border-l-emerald-500">
                <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">{t.resolved}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-emerald-600">{resolvedCount}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Closed</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                <span className="text-xs font-bold text-emerald-900 block mb-2 uppercase">{t.resolutionRate}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-emerald-800">{resRate}%</span>
                  <TrendingUp size={18} className="text-emerald-600" />
                </div>
              </div>

            </div>

            {/* AI Priority Issues List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-lg text-[#082f1e] flex items-center gap-2">
                    <AlertTriangle size={20} className="text-amber-500" />
                    <span>{t.priorityTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.prioritySub}</p>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  Powered by Google Gemini AI
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {priorities.map((item: any, idx: number) => (
                  <div key={idx} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex items-center gap-3">
                        <span className="bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                          {item.priority || "CRITICAL"}
                        </span>
                        <span className="text-sm font-bold text-slate-800 bg-slate-200 px-3 py-0.5 rounded-full">
                          {item.ward || "Sector 4"}
                        </span>
                        {item.category && (
                          <span className="text-xs font-semibold text-slate-500">• Category: {item.category}</span>
                        )}
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                        {item.issue || item.content}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Geospatial cluster shows <strong>{item.count || 24} individual citizen submissions</strong> mentioning this infrastructure defect.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      <button 
                        onClick={() => alert(`Municipal team dispatched to ${item.ward} for emergency repairs.`)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Assign Team / Work Order
                      </button>
                      <button 
                        onClick={() => alert(`Issue marked as verified and prioritized in municipal docket.`)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Mark Verified
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section: Constituency Heatmap & Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left 7 Cols: Ward Heatmap Table */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="font-bold text-base text-[#082f1e] flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-600" />
                  <span>{t.heatmapTitle}</span>
                </h3>
                <p className="text-xs text-slate-500">Real-time civic density distribution by municipal ward.</p>

                <div className="space-y-3 pt-2">
                  {wardHeatmap.map((w: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold">
                      <span className="w-28 font-bold text-slate-800">{w.ward}</span>
                      <div className="flex-1 mx-4 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${w.color || 'bg-emerald-600'}`} 
                          style={{ width: `${Math.min(100, (w.complaints / 200) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="w-20 text-right font-mono font-bold text-slate-700">{w.complaints} issues</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 5 Cols: Top Categories Chart */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="font-bold text-base text-[#082f1e] flex items-center gap-2">
                  <BarChart2 size={18} className="text-emerald-600" />
                  <span>{t.categoriesTitle}</span>
                </h3>
                <p className="text-xs text-slate-500">Breakdown of reported civic infrastructure complaints.</p>

                <div className="space-y-4 pt-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">Roads & Potholes</span>
                      <span className="text-red-600">38% (471)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: '38%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">Water Supply & Pipeline</span>
                      <span className="text-blue-600">26% (322)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '26%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">Sanitation & Garbage</span>
                      <span className="text-amber-600">21% (260)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '21%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">Streetlights & Electrical</span>
                      <span className="text-emerald-600">15% (187)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* HEATMAP VIEW */}
        {activeTab === 'heatmap' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-8 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
              <Map size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#082f1e]">Geospatial Constituency Heatmap</h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Interactive GIS mapping showing high-density civic complaint zones across New Delhi Central wards.
            </p>
            <div className="bg-slate-100 border border-slate-300 rounded-xl h-80 flex items-center justify-center text-slate-500 font-mono text-sm">
              [Geospatial Heatmap Canvas — Connected to Municipal GIS Layer]
            </div>
          </div>
        )}

        {/* ANALYTICS VIEW */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-8 space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-[#082f1e] border-b border-slate-200 pb-4">Performance & Resolution Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Average Resolution Time</span>
                <p className="text-3xl font-black text-emerald-700">48 Hours</p>
                <p className="text-xs text-slate-600">15% faster than municipal standard benchmark.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Citizen Satisfaction Rating</span>
                <p className="text-3xl font-black text-blue-700">4.7 / 5.0</p>
                <p className="text-xs text-slate-600">Based on 650+ verified citizen resolution feedbacks.</p>
              </div>
            </div>
          </div>
        )}

        {/* MESSAGES / BROADCAST VIEW */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-8 space-y-6 animate-fade-in max-w-2xl">
            <h2 className="text-xl font-bold text-[#082f1e] border-b border-slate-200 pb-4">Broadcast Notice to Citizens</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Target Wards</label>
                <select className="w-full p-3 rounded-lg border border-slate-300 text-sm font-medium">
                  <option>All Constituency Wards</option>
                  <option>Sector 4 Only</option>
                  <option>Ward 12 Only</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Notice Message</label>
                <textarea rows={4} placeholder="Type official announcement or repair schedule update..." className="w-full p-3 rounded-lg border border-slate-300 text-sm" />
              </div>
              <button 
                onClick={() => alert("Notice broadcast successfully published to Citizen Dashboard notice boards.")}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer flex items-center gap-2"
              >
                <Send size={16} />
                <span>Publish Broadcast</span>
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
