import { useState, useEffect, useCallback } from 'react';
import { MAPS_BY_CONSTITUENCY, CONSTITUENCIES } from './constants';
import { Theme, Submission, AppView, mapApiCluster, mapApiSubmission } from './types';
import { fetchDashboard, fetchSubmissions, recomputeAll } from './api';
import { ThemeCard } from './components/ThemeCard';
import { SubmitForm } from './components/SubmitForm';
import { 
  Flame, 
  FileText, 
  FolderOpen, 
  Rss, 
  Map, 
  Settings, 
  LogOut, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  Award, 
  PlusCircle, 
  User, 
  ChevronRight, 
  ArrowLeft,
  Layers,
  HelpCircle,
  Loader2
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [constituency, setConstituency] = useState<string>('New Delhi Central');
  const [quarter, setQuarter] = useState<string>('Q3 2024 REPORT');
  const [isRecomputing, setIsRecomputing] = useState<boolean>(false);
  const [recomputeFinished, setRecomputeFinished] = useState<boolean>(false);

  // Data from the backend
  const [themes, setThemes] = useState<Theme[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Data fetching ─────────────────────────────────────────────────────

  const loadDashboard = useCallback(async (cons: string) => {
    setIsLoadingDashboard(true);
    setError(null);
    try {
      const clusters = await fetchDashboard(cons);
      setThemes(clusters.map(mapApiCluster));
    } catch (err: any) {
      console.error('Dashboard fetch failed:', err);
      setError(err.message);
      setThemes([]);
    } finally {
      setIsLoadingDashboard(false);
    }
  }, []);

  const loadSubmissions = useCallback(async (cons: string) => {
    setIsLoadingFeed(true);
    setError(null);
    try {
      const subs = await fetchSubmissions(cons);
      setSubmissions(subs.map(mapApiSubmission));
    } catch (err: any) {
      console.error('Submissions fetch failed:', err);
      setError(err.message);
      setSubmissions([]);
    } finally {
      setIsLoadingFeed(false);
    }
  }, []);

  // Load data whenever constituency or view changes
  useEffect(() => {
    if (view === 'dashboard' || view === 'map') {
      loadDashboard(constituency);
    }
    if (view === 'feed') {
      loadSubmissions(constituency);
    }
  }, [view, constituency, loadDashboard, loadSubmissions]);

  // Handle recomputing — triggers backend cluster + rank, then refreshes
  const handleRecompute = async () => {
    setIsRecomputing(true);
    setRecomputeFinished(false);
    setError(null);

    try {
      await recomputeAll();
      // Refresh dashboard data after recomputation
      await loadDashboard(constituency);
      setRecomputeFinished(true);
      setTimeout(() => setRecomputeFinished(false), 3000);
    } catch (err: any) {
      console.error('Recompute failed:', err);
      setError(err.message);
    } finally {
      setIsRecomputing(false);
    }
  };

  // After a submission, refresh data
  const handleSubmissionSuccess = () => {
    if (view === 'dashboard' || view === 'map') {
      loadDashboard(constituency);
    }
  };

  // Stats
  const totalSubmissionsCount = submissions.length;
  const verifiedCount = submissions.filter(s => s.status === 'VERIFIED').length;
  const resolutionRate = totalSubmissionsCount > 0 
    ? Math.round((verifiedCount / totalSubmissionsCount) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-parchment text-ink flex flex-col font-sans selection:bg-seal-maroon/10 selection:text-seal-maroon">
      
      {/* Top Navigation Bar with glassmorphism paper texture */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-10 h-16 bg-parchment/80 backdrop-blur-md border-b border-parchment-deep shadow-sm">
        <div className="flex items-center gap-3">
          <span 
            onClick={() => setView('landing')} 
            className="font-sans text-xl md:text-2xl font-black text-seal-maroon tracking-tighter uppercase cursor-pointer hover:opacity-90 transition-opacity"
          >
            SABKI AWAAZ
          </span>
          <span className="hidden sm:inline-block bg-seal-maroon/10 text-seal-maroon text-[10px] font-mono font-bold px-2 py-0.5 border border-seal-maroon/20">
            LIVE
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs">
          <button 
            onClick={() => setView('landing')}
            className={`cursor-pointer uppercase tracking-wider pb-1 transition-colors ${
              view === 'landing' ? 'text-seal-maroon font-bold border-b-2 border-seal-maroon' : 'text-ink/60 hover:text-seal-maroon'
            }`}
          >
            Preamble
          </button>
          <button 
            onClick={() => setView('dashboard')}
            className={`cursor-pointer uppercase tracking-wider pb-1 transition-colors ${
              view === 'dashboard' || view === 'feed' || view === 'map' ? 'text-seal-maroon font-bold border-b-2 border-seal-maroon' : 'text-ink/60 hover:text-seal-maroon'
            }`}
          >
            MP Gazette
          </button>
          <button 
            onClick={() => setView('submit')}
            className={`cursor-pointer uppercase tracking-wider pb-1 transition-colors ${
              view === 'submit' ? 'text-seal-maroon font-bold border-b-2 border-seal-maroon' : 'text-ink/60 hover:text-seal-maroon'
            }`}
          >
            Lodge Grievance
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('submit')}
            className="bg-seal-maroon text-white font-mono text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 hover:bg-seal-maroon-dark transition-colors duration-150 active:scale-95 flex items-center gap-1.5"
          >
            <PlusCircle size={14} />
            New Entry
          </button>
          <div className="w-8 h-8 rounded-full bg-parchment-deep border border-parchment-deep flex items-center justify-center text-seal-maroon">
            <User size={16} />
          </div>
        </div>
      </header>

      {/* Main Container Setup */}
      <div className="flex-1 pt-16 flex flex-col md:flex-row">
        
        {/* Left Sidebar Menu (Visible only when in MP Gazette views) */}
        {(view === 'dashboard' || view === 'feed' || view === 'map') && (
          <aside className="w-full md:w-64 bg-parchment-dim border-b md:border-b-0 md:border-r border-parchment-deep flex flex-col justify-between flex-shrink-0">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-full bg-seal-maroon/10 flex items-center justify-center border border-seal-maroon/20 overflow-hidden">
                  <img 
                    className="w-7 h-7 object-contain grayscale opacity-80" 
                    alt="Indian National Emblem" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlcKkAE7UQ21wcatJOuVS5E6-M-w6CMaBPgSMpHiGyet9fLQ5tENAXUlFs9KpOGwG0bYt2DN_YnTE-AdJc29ndm6g6arp0zZ3oKH88jifmqI1kyTXrWfeU35bxgjjjOmcm4IIPuZk_2O3xCqM7YRrQyuNHEonsgiRKEk2pPSmjtREbzPGdP-wf5ZUJhCshOzbdk-mKfq337B9fgzhxSAY-QDTwKzRjJ21qGtljCqEhroOQ6vwfjfN7G-8mnb_75tbhRvfFyc1T2cs"
                  />
                </div>
                <div>
                  <h4 className="font-sans text-md font-extrabold text-seal-maroon leading-tight">Official Gazette</h4>
                  <p className="font-mono text-[10px] text-ink/50 uppercase tracking-widest">Registry No. 2024/IND</p>
                </div>
              </div>

              {/* Sub-Views within the Gazette Tab */}
              <nav className="space-y-1 font-mono text-xs">
                <button
                  onClick={() => setView('dashboard')}
                  className={`w-full flex items-center gap-3 p-3 transition-all ${
                    view === 'dashboard' 
                      ? 'bg-seal-maroon/5 text-seal-maroon border-r-4 border-seal-maroon font-bold' 
                      : 'text-ink/70 hover:bg-parchment-dark'
                  }`}
                >
                  <FolderOpen size={16} />
                  <span>Dossiers (Themes)</span>
                </button>

                <button
                  onClick={() => setView('feed')}
                  className={`w-full flex items-center gap-3 p-3 transition-all ${
                    view === 'feed' 
                      ? 'bg-seal-maroon/5 text-seal-maroon border-r-4 border-seal-maroon font-bold' 
                      : 'text-ink/70 hover:bg-parchment-dark'
                  }`}
                >
                  <Rss size={16} />
                  <span>Live Ledger Feed</span>
                  <span className="ml-auto bg-seal-maroon/10 text-seal-maroon text-[9px] px-1.5 py-0.2">
                    {totalSubmissionsCount}
                  </span>
                </button>

                <button
                  onClick={() => setView('map')}
                  className={`w-full flex items-center gap-3 p-3 transition-all ${
                    view === 'map' 
                      ? 'bg-seal-maroon/5 text-seal-maroon border-r-4 border-seal-maroon font-bold' 
                      : 'text-ink/70 hover:bg-parchment-dark'
                  }`}
                >
                  <Map size={16} />
                  <span>Ward Survey Map</span>
                </button>
              </nav>

              {/* Dashboard Info Rules Bulletins */}
              <div className="mt-8 p-4 bg-parchment border border-parchment-deep rounded space-y-3">
                <span className="font-mono text-[10px] text-seal-maroon font-extrabold block uppercase tracking-wider">
                  Gazette Bulletins
                </span>
                <p className="font-serif text-[11px] leading-relaxed text-ink/75">
                  Civil submissions are automatically clustered using spatial constraints (HDBSCAN Fallback) and categorized for maximum local urgency metrics.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-parchment-deep">
              <button 
                onClick={() => setView('landing')}
                className="w-full flex items-center gap-3 p-2 font-mono text-xs text-ink/60 hover:text-seal-maroon hover:bg-parchment-dark transition-all"
              >
                <LogOut size={16} />
                <span>Return to Preamble</span>
              </button>
            </div>
          </aside>
        )}

        {/* Content Area Switch Board */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          
          {/* Global Error Banner */}
          {error && (
            <div className="bg-red-50 text-red-800 border border-red-200 px-4 py-3 font-mono text-xs uppercase flex items-center gap-2 mb-6 animate-fade-in">
              <AlertTriangle size={16} />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-900 font-bold">✕</button>
            </div>
          )}

          {/* VIEW: LANDING PAGE */}
          {view === 'landing' && (
            <div className="space-y-12 animate-fade-in max-w-4xl mx-auto py-6">
              
              {/* Grand Emblem Header */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-seal-maroon/5 flex items-center justify-center border-2 border-double border-seal-maroon/30 p-2 overflow-hidden">
                    <img 
                      className="w-14 h-14 object-contain grayscale" 
                      alt="National Emblem of India" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlcKkAE7UQ21wcatJOuVS5E6-M-w6CMaBPgSMpHiGyet9fLQ5tENAXUlFs9KpOGwG0bYt2DN_YnTE-AdJc29ndm6g6arp0zZ3oKH88jifmqI1kyTXrWfeU35bxgjjjOmcm4IIPuZk_2O3xCqM7YRrQyuNHEonsgiRKEk2pPSmjtREbzPGdP-wf5ZUJhCshOzbdk-mKfq337B9fgzhxSAY-QDTwKzRjJ21qGtljCqEhroOQ6vwfjfN7G-8mnb_75tbhRvfFyc1T2cs"
                    />
                  </div>
                </div>
                
                <h1 className="font-sans text-4xl md:text-5xl font-black text-seal-maroon uppercase tracking-tight">
                  Sabki Awaaz
                </h1>
                <p className="font-serif text-lg md:text-xl italic text-ink/80 tracking-tight max-w-2xl mx-auto">
                  "Har Awaaz Suniye. Har Samasya Samjhiye."
                </p>
                
                <div className="perforation max-w-md mx-auto my-3"></div>
                
                <p className="font-mono text-xs text-ink/60 uppercase tracking-widest">
                  OFFICIAL PARLIAMENTARY GRIEVANCE CLUSTERING & ANALYSIS REGISTRY
                </p>
              </div>

              {/* Stacked Paper intro section */}
              <div className="bg-white border border-parchment-deep p-6 md:p-8 paper-stack text-center space-y-6 max-w-2xl mx-auto">
                <h2 className="font-sans text-xl md:text-2xl font-bold text-seal-maroon uppercase tracking-tight">
                  Preamble to Civic Democracy
                </h2>
                <p className="font-serif text-sm md:text-base leading-relaxed text-ink/80">
                  Sabki Awaaz connects the sovereign voice of local citizens with direct legislative intervention. Using modern semantic sorting and geographic clustering, we aggregate raw text, recorded audio dictations, and photographic evidence into structured 
                  <strong> Gazette Dossiers</strong> for respective Members of Parliament (MPs).
                </p>
                <div className="perforation"></div>
                
                {/* Simulated signature block for vintage authenticity */}
                <div className="flex justify-around items-center pt-2 font-mono text-[11px] text-ink/55">
                  <div className="text-center">
                    <span className="block italic text-seal-maroon font-serif text-[13px] font-bold">A. K. Sharma, IAS</span>
                    <span className="block border-t border-ink/20 mt-1 pt-0.5 uppercase">Gazette Registrar</span>
                  </div>
                  <div className="text-center">
                    <span className="block italic text-seal-maroon font-serif text-[13px] font-bold">New Delhi</span>
                    <span className="block border-t border-ink/20 mt-1 pt-0.5 uppercase">Central Assembly</span>
                  </div>
                </div>
              </div>

              {/* Large Touch-Friendly Navigation CTA Cards */}
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* CTA Card 1: Citizen */}
                <button
                  onClick={() => setView('submit')}
                  className="bg-white border border-parchment-deep p-6 text-left hover:border-seal-maroon cursor-pointer group hover:-translate-y-1 transition-all duration-300 paper-stack relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-seal-maroon/5 flex items-center justify-center border-l border-b border-parchment-deep group-hover:bg-seal-maroon/10">
                    <PlusCircle className="text-seal-maroon" size={20} />
                  </div>
                  
                  <span className="font-mono text-[10px] text-seal-maroon font-bold uppercase tracking-widest block mb-2">
                    I am a Resident Citizen
                  </span>
                  <h3 className="font-sans text-lg md:text-xl font-bold text-ink group-hover:text-seal-maroon transition-colors mb-2">
                    Lodge a Local Grievance 📝
                  </h3>
                  <p className="font-serif text-xs text-ink/75 leading-relaxed">
                    Submit text descriptions, real voice memos, or photo records from your smartphone. Obtain a printable, timestamped Gazette receipt of your lodgement.
                  </p>
                  
                  <div className="mt-4 flex items-center gap-1 font-mono text-[11px] text-seal-maroon font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    <span>Initiate Submission Form</span>
                    <ChevronRight size={14} />
                  </div>
                </button>

                {/* CTA Card 2: MP Dashboard */}
                <button
                  onClick={() => setView('dashboard')}
                  className="bg-white border border-parchment-deep p-6 text-left hover:border-seal-navy cursor-pointer group hover:-translate-y-1 transition-all duration-300 paper-stack relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-seal-navy/5 flex items-center justify-center border-l border-b border-parchment-deep group-hover:bg-seal-navy/10">
                    <Layers className="text-seal-navy" size={20} />
                  </div>
                  
                  <span className="font-mono text-[10px] text-seal-navy font-bold uppercase tracking-widest block mb-2">
                    I am a Member of Parliament
                  </span>
                  <h3 className="font-sans text-lg md:text-xl font-bold text-ink group-hover:text-seal-navy transition-colors mb-2">
                    Access MP Dossier Dashboard 📊
                  </h3>
                  <p className="font-serif text-xs text-ink/75 leading-relaxed">
                    Review spatial heatmaps of urgent civic queries, inspect automatically prioritized theme dossiers, and recompute statistical intensity metrics for your constituency.
                  </p>
                  
                  <div className="mt-4 flex items-center gap-1 font-mono text-[11px] text-seal-navy font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    <span>Open MP Dashboard</span>
                    <ChevronRight size={14} />
                  </div>
                </button>
              </div>

              {/* Fine Print Footer */}
              <div className="perforation max-w-md mx-auto my-6"></div>
              <p className="text-center font-mono text-[10px] text-ink/40 leading-relaxed uppercase tracking-wider">
                Authorized Platform. Developed strictly for Indian Administrative Excellence.
              </p>
            </div>
          )}

          {/* VIEW: CITIZEN FORM */}
          {view === 'submit' && (
            <div className="space-y-6 animate-fade-in py-4">
              <button 
                onClick={() => setView('landing')}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-seal-maroon font-bold hover:underline mb-2 cursor-pointer"
              >
                <ArrowLeft size={14} />
                BACK TO PREAMBLE
              </button>

              <SubmitForm 
                constituency={constituency}
                onSubmissionSuccess={handleSubmissionSuccess}
              />
            </div>
          )}

          {/* VIEW: MP DOSSIER LIST (THEMES) */}
          {view === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Filter and Control Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-dashed border-parchment-deep">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50 font-bold block mb-1">
                    Constituency Analytics Register
                  </span>
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Constituency Selector dropdown */}
                    <div className="relative">
                      <select 
                        value={constituency}
                        onChange={(e) => setConstituency(e.target.value)}
                        className="bg-transparent border-b-2 border-seal-maroon/40 focus:border-seal-maroon font-sans text-2xl font-black text-seal-maroon cursor-pointer outline-none focus:ring-0 pb-1 pr-6"
                      >
                        {CONSTITUENCIES.map((c, idx) => (
                          <option key={idx} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Quarter Selector */}
                    <select
                      value={quarter}
                      onChange={(e) => setQuarter(e.target.value)}
                      className="bg-parchment-dim border border-parchment-deep px-2 py-1 font-mono text-xs text-ink/70 cursor-pointer focus:outline-none"
                    >
                      <option>Q3 2024 REPORT</option>
                      <option>Q2 2024 REPORT</option>
                      <option>Q1 2024 REPORT</option>
                    </select>
                  </div>
                </div>

                {/* Recompute Data Button */}
                <button 
                  onClick={handleRecompute}
                  disabled={isRecomputing}
                  className="flex items-center gap-2 border-2 border-seal-maroon text-seal-maroon px-5 py-2.5 font-mono text-xs font-bold uppercase hover:bg-seal-maroon hover:text-white transition-all duration-150 active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={14} className={isRecomputing ? "animate-spin" : ""} />
                  {isRecomputing ? "COMPUTING MATRIX..." : recomputeFinished ? "✓ COMPLETED" : "Recompute Data"}
                </button>
              </div>

              {/* Toast Feedback for Recompute */}
              {recomputeFinished && (
                <div className="bg-seal-green/10 text-seal-green border border-seal-green/20 px-4 py-3 font-mono text-xs uppercase flex items-center gap-2 animate-bounce">
                  <Check size={16} />
                  <span>Success: Dynamic spatial density metrics and cluster categories recalculated successfully.</span>
                </div>
              )}

              {/* Loading State */}
              {isLoadingDashboard && (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin text-seal-maroon" />
                    <span className="font-mono text-xs text-ink/50 uppercase tracking-wider">Loading Gazette Dossiers...</span>
                  </div>
                </div>
              )}

              {/* Main Two-Column Dashboard Content */}
              {!isLoadingDashboard && (
                <div className="grid lg:grid-cols-3 gap-8">
                  
                  {/* Dossiers (Theme list) - Takes 2 cols */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center pb-2 border-b border-ink/10">
                      <span className="font-mono text-xs font-bold uppercase text-ink/65">
                        Prioritized Civic Themes ({themes.length})
                      </span>
                      <span className="font-mono text-[10px] text-ink/40 uppercase">Sorted by Critical Score</span>
                    </div>

                    {themes.map((theme) => (
                      <ThemeCard key={theme.id} theme={theme} />
                    ))}

                    {themes.length === 0 && !error && (
                      <div className="p-8 bg-white border border-parchment-deep text-center paper-stack">
                        <p className="font-serif text-ink/60 mb-3">No dossiers registered under this constituency yet.</p>
                        <p className="font-mono text-xs text-ink/40">Submit grievances and click "Recompute Data" to generate clustered theme dossiers.</p>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Dynamic Statistics and Heatmap Cards */}
                  <div className="space-y-6">
                    
                    {/* Resolution Rate Card */}
                    <div className="bg-seal-maroon p-6 text-white paper-stack relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 font-mono text-[9px] opacity-20">STAT-0992</div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-white/70 block mb-2 font-bold">
                        RESOLVED RATIO
                      </span>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="font-sans text-5xl font-black leading-none">{resolutionRate}%</span>
                        <span className="bg-white/15 text-white text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          ▲ +4.1%
                        </span>
                      </div>
                      <p className="font-serif text-[13px] leading-relaxed text-white/90">
                        Based on verified on-ground physical inspection audits of logged grievances.
                      </p>
                    </div>

                    {/* Urgent Actions card */}
                    <div className="bg-white border border-parchment-deep p-6 paper-stack">
                      <div className="border-b border-dashed border-parchment-deep pb-2 mb-4">
                        <h4 className="font-mono text-xs font-bold uppercase text-seal-maroon">
                          Immediate Directives
                        </h4>
                        <p className="font-mono text-[9px] text-ink/40 uppercase">Action required by MP</p>
                      </div>

                      <ul className="space-y-4 font-mono text-xs text-ink/90">
                        {themes.length > 0 && themes.slice(0, 2).map((theme, idx) => (
                          <li key={idx} className="flex items-start gap-3 border-b border-parchment-dim pb-3">
                            <AlertTriangle className="text-seal-maroon flex-shrink-0 mt-0.5" size={16} />
                            <div>
                              <span className="font-bold text-seal-maroon block mb-0.5">{theme.title.toUpperCase()}</span>
                              <span className="text-[11px] text-ink/75 leading-relaxed">
                                Critical score: {theme.score}/100. {theme.submissions.length > 0 ? theme.submissions[0].content.slice(0, 80) + '...' : 'Multiple citizen reports logged.'}
                              </span>
                            </div>
                          </li>
                        ))}

                        {themes.length === 0 && (
                          <li className="text-ink/50 text-center py-2">No active directives</li>
                        )}
                      </ul>
                    </div>

                    {/* High Quality Mini-Map Widget */}
                    <div className="bg-white border border-parchment-deep p-4 paper-stack">
                      <span className="font-mono text-xs font-bold uppercase text-ink/60 mb-2 block">
                        Constituency Mapping Overlay
                      </span>
                      <div className="aspect-square bg-parchment-dim border border-parchment-deep relative overflow-hidden">
                        <img 
                          src={MAPS_BY_CONSTITUENCY[constituency]}
                          alt="Vintage Administrative Survey Map"
                          className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-seal-maroon/5 pointer-events-none"></div>
                        <div className="absolute top-1/3 left-1/2 w-12 h-12 bg-seal-maroon/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-seal-navy/25 rounded-full blur-xl animate-pulse"></div>
                      </div>
                      <span className="font-mono text-[9px] text-ink/40 mt-2 block text-center uppercase tracking-wider">
                        © Surveyor General of India Archives
                      </span>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* VIEW: LIVE FEED (RAW SUBMISSIONS) */}
          {view === 'feed' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-dashed border-parchment-deep pb-4 mb-4 flex justify-between items-end">
                <div>
                  <h3 className="font-sans text-2xl font-bold text-seal-maroon">Grievance Ledger Feed</h3>
                  <p className="font-mono text-xs text-ink/50 uppercase mt-1">
                    Raw, unedited citizen requests for {constituency}
                  </p>
                </div>
                <span className="bg-seal-maroon text-white font-mono text-xs font-bold px-2 py-1">
                  TOTAL RECORDED: {submissions.length}
                </span>
              </div>

              {/* Loading State */}
              {isLoadingFeed && (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin text-seal-maroon" />
                    <span className="font-mono text-xs text-ink/50 uppercase tracking-wider">Loading Submissions...</span>
                  </div>
                </div>
              )}

              {/* Submission Ledger Cards */}
              {!isLoadingFeed && (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div 
                      key={sub.id} 
                      className="bg-white border border-parchment-deep p-5 paper-stack relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-seal-maroon transition-all"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                          <span className="text-seal-maroon font-bold uppercase">{sub.id}</span>
                          <span className="text-ink/40">•</span>
                          <span className="bg-parchment-deep text-ink/70 px-2 py-0.5 rounded font-bold">
                            {sub.ward.toUpperCase()}
                          </span>
                          <span className="text-ink/40">•</span>
                          <span className="text-seal-navy font-bold uppercase">{sub.type} MEDIUM</span>
                          <span className="text-ink/40">•</span>
                          <span className="text-ink/50">{new Date(sub.timestamp).toLocaleDateString()}</span>
                        </div>
                        
                        <p className="font-serif text-sm text-ink leading-relaxed">
                          "{sub.content}"
                        </p>

                        <div className="font-mono text-[10px] text-ink/50 uppercase">
                          Lodged By: <span className="font-bold text-ink/80">{sub.residentName}</span> ({sub.residentTitle})
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-auto border-t md:border-t-0 border-dashed border-parchment-deep pt-3 md:pt-0">
                        {/* Verify Badge */}
                        <span className="bg-seal-green/10 text-seal-green border border-seal-green/20 px-3 py-1 font-mono text-[10px] font-bold uppercase">
                          ✓ {sub.status}
                        </span>
                      </div>
                    </div>
                  ))}

                  {submissions.length === 0 && !isLoadingFeed && (
                    <div className="bg-white border border-parchment-deep p-12 text-center">
                      <p className="font-serif text-ink/60">No local claims registered under {constituency}.</p>
                      <button 
                        onClick={() => setView('submit')}
                        className="mt-4 bg-seal-maroon text-white font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-seal-maroon-dark transition-colors cursor-pointer"
                      >
                        Lodge First Record
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW: SURVEY MAP (FULL SCREEN) */}
          {view === 'map' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-dashed border-parchment-deep pb-4 mb-4">
                <h3 className="font-sans text-2xl font-bold text-seal-maroon">Territorial Survey Heatmap</h3>
                <p className="font-mono text-xs text-ink/50 uppercase mt-1">
                  Spatial distribution overlays for {constituency}
                </p>
              </div>

              <div className="bg-white border border-parchment-deep p-6 paper-stack space-y-4">
                <div className="relative aspect-video bg-parchment-dim border border-parchment-deep overflow-hidden">
                  <img 
                    src={MAPS_BY_CONSTITUENCY[constituency]}
                    alt="Vintage Survey Map"
                    className="w-full h-full object-cover grayscale opacity-80"
                  />
                  
                  {/* Dynamic cluster pins from real data */}
                  {themes.slice(0, 3).map((theme, idx) => {
                    const positions = [
                      { top: '25%', left: '33%', rotate: '-3deg', color: 'seal-maroon' },
                      { top: '66%', left: '25%', rotate: '2deg', color: 'seal-navy' },
                      { top: '33%', left: '66%', rotate: '-1deg', color: 'seal-green' },
                    ];
                    const pos = positions[idx];
                    return (
                      <div 
                        key={theme.id}
                        className={`absolute p-2 bg-white border-2 border-${pos.color} font-mono text-[10px] font-bold text-${pos.color} rounded shadow animate-pulse`}
                        style={{ top: pos.top, left: pos.left, transform: `rotate(${pos.rotate})` }}
                      >
                        ▲ {theme.title.toUpperCase()} ({theme.submissions.length} CLAIMS)
                      </div>
                    );
                  })}

                  {/* Compass overlay for administrative feel */}
                  <div className="absolute bottom-4 right-4 w-16 h-16 border border-ink/20 rounded-full flex items-center justify-center font-mono text-[10px] text-ink/40 select-none">
                    <span className="absolute -top-1 font-bold">N</span>
                    <span className="absolute -bottom-1 font-bold">S</span>
                    <span className="absolute -left-1 font-bold">W</span>
                    <span className="absolute -right-1 font-bold">E</span>
                    <div className="w-0.5 h-10 bg-seal-maroon/50 transform rotate-45"></div>
                  </div>
                </div>

                <div className="perforation"></div>

                <div className="grid md:grid-cols-3 gap-6 pt-2 font-mono text-xs">
                  <div>
                    <span className="text-seal-maroon font-bold block mb-1">MAROON OVERLAY (CRITICAL)</span>
                    <p className="text-[11px] text-ink/70 leading-relaxed">
                      Wards showing high intensity concentration thresholds. Immediate physical desilting or grid replacement prioritized.
                    </p>
                  </div>
                  <div>
                    <span className="text-seal-navy font-bold block mb-1">NAVY OVERLAY (MODERATE)</span>
                    <p className="text-[11px] text-ink/70 leading-relaxed">
                      Wards with energy audits and civic infrastructure updates undergoing formal budgetary clearance cycles.
                    </p>
                  </div>
                  <div>
                    <span className="text-seal-green font-bold block mb-1">GREEN SHADINGS (VERIFIED)</span>
                    <p className="text-[11px] text-ink/70 leading-relaxed">
                      Active public resolutions. Resolved entries logged into physical assemblies and archival ledgers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Footer styled as official administrative imprint */}
      <footer className="w-full bg-parchment-deep py-10 mt-12 border-t border-dashed border-parchment-deep">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <h4 className="font-sans text-md font-extrabold text-seal-maroon-dark tracking-wide uppercase">
              Sabki Awaaz
            </h4>
            <p className="font-mono text-[10px] text-ink/55 uppercase tracking-widest mt-1 max-w-sm">
              © 2026 OFFICIAL GAZETTE OF CIVIL DEMANDS. ALL ACTION CRITERIA REGISTERED ACCORDING TO ADMINISTRATIVE STANDARDS.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-[11px] text-ink/60">
            <a href="#" className="hover:text-seal-maroon transition-colors underline decoration-seal-maroon/30">Privacy Policy</a>
            <a href="#" className="hover:text-seal-maroon transition-colors underline decoration-seal-maroon/30">Terms of Service</a>
            <a href="#" className="hover:text-seal-maroon transition-colors underline decoration-seal-maroon/30">Administrative Rules</a>
            <a href="#" className="hover:text-seal-maroon transition-colors underline decoration-seal-maroon/30">Grievance Cell</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
