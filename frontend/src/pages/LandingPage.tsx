import React, { useState, useEffect } from 'react';
import { Language, translations } from '../locales/translations';
import { AppView } from '../components/Navbar';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Building2,
  Users,
  MapPin,
  CheckCircle2,
  Search,
  PlusSquare
} from 'lucide-react';

const issueFloodedStreet = new URL('../issue_flooded_street.jpg', import.meta.url).href;
const issueCloggedDrain = new URL('../issue_clogged_drain.jpg', import.meta.url).href;
const issueCyclistFlood = new URL('../issue_cyclist_flood.jpg', import.meta.url).href;
const issueGarbageCanal = new URL('../issue_garbage_canal.jpg', import.meta.url).href;
const heroBg = new URL('../hero_secretariat_bg.jpg', import.meta.url).href;

interface LandingPageProps {
  lang: Language;
  onNavigate: (view: AppView) => void;
  totalSubmissions?: number;
  resolutionRate?: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onNavigate,
  totalSubmissions = 125430,
  resolutionRate = 85
}) => {
  const t = translations[lang].hero;
  const issuesT = translations[lang].majorIssues;
  const statsT = translations[lang].stats;

  const localIssues = [
    {
      title: lang === 'en' ? "Severe Water Logging" : "अत्यधिक जलभराव",
      desc: lang === 'en' 
        ? "Heavy water accumulation on city streets due to inadequate drainage, disrupting traffic and pedestrian safety."
        : "नाकाफी जल निकासी के कारण शहर की सड़कों पर भारी जल संचय, यातायात और पैदल चलने वालों की सुरक्षा को बाधित करता है।",
      image: issueFloodedStreet
    },
    {
      title: lang === 'en' ? "Open & Clogged Drains" : "खुले और बंद नाले",
      desc: lang === 'en'
        ? "Blocked drainage trenches causing foul odors, health hazards, and breeding grounds for mosquitoes."
        : "अवरुद्ध जल निकासी नालियां जिसके कारण दुर्गंध, स्वास्थ्य संबंधी खतरे और मच्छरों का प्रकोप बढ़ता है।",
      image: issueCloggedDrain
    },
    {
      title: lang === 'en' ? "Hazardous Commutes" : "असुरक्षित आवागमन",
      desc: lang === 'en'
        ? "Submerged roadways forcing citizens to navigate deep floodwater on bicycles and two-wheelers."
        : "जलमग्न सड़कें नागरिकों को साइकिल और दोपहिया वाहनों पर गहरे पानी में चलने के लिए मजबूर करती हैं।",
      image: issueCyclistFlood
    },
    {
      title: lang === 'en' ? "Open Sewage Canals" : "कचरे से पटे खुले नाले",
      desc: lang === 'en'
        ? "Accumulation of plastic waste and garbage blockading natural water flow in municipal canals."
        : "स्थानीय नहरों में प्राकृतिक जल प्रवाह को अवरुद्ध करने वाले प्लास्टिक कचरे और गंदगी का जमाव।",
      image: issueGarbageCanal
    }
  ];

  // Carousel State for Section 2
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % localIssues.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + localIssues.length) % localIssues.length);
  };

  const selectSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  // Auto slide every 6 seconds for smooth carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [localIssues.length]);

  return (
    <div className="font-sans text-slate-800 antialiased bg-white overflow-x-hidden">
      
      {/* ───────────────────────────────────────────────────────────────────
          SECTION 1 — HERO / INTRODUCTION
          Exact clone of Image 1: Bright daytime Secretariat background,
          dark navy typography (#0b1d3a), dual CTAs (Solid Blue & White Outline),
          and 4 light cream/beige feature cards overlapping at the bottom.
      ──────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[600px] lg:min-h-[660px] flex flex-col justify-between bg-slate-100 overflow-hidden pt-12 pb-6 border-b border-slate-200">
        
        {/* Bright Daytime Secretariat Building Background matching Image 1 */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Indian Secretariat & Parliament Architecture" 
            className="w-full h-full object-cover object-center opacity-85 scale-100 transition-all duration-1000"
          />
          {/* Subtle light gradient overlay so dark typography reads crisply */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7]/95 via-[#fdfbf7]/80 to-transparent w-full md:w-3/4 lg:w-2/3"></div>
        </div>

        {/* Hero Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto py-10">
          <div className="max-w-2xl space-y-6">
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0b1d3a] leading-[1.12]">
              <span className="block">{t.title1}</span>
              <span className="block mt-1">{t.title2}</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed font-medium max-w-xl">
              {t.subtitle}
            </p>

            {/* Primary CTA matching Image 1 exact button styling */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => onNavigate('submit')}
                className="px-7 py-3.5 rounded-xl bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 border border-blue-600"
              >
                <PlusSquare size={18} className="text-blue-200" />
                <span>{t.primaryCta}</span>
              </button>
            </div>

          </div>
        </div>

        {/* 4 Feature Cards Strip at Bottom of Hero matching Image 1 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-[#fcfbf9]/95 border border-amber-200/60 p-4 rounded-xl shadow-sm backdrop-blur-md flex items-center gap-3.5 hover:bg-white transition-all">
              <div className="w-11 h-11 rounded-lg bg-amber-100/80 flex items-center justify-center text-amber-800 flex-shrink-0 border border-amber-300/50">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#0b1d3a] leading-tight">{t.features[0].title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">{t.features[0].desc}</p>
              </div>
            </div>

            <div className="bg-[#fcfbf9]/95 border border-amber-200/60 p-4 rounded-xl shadow-sm backdrop-blur-md flex items-center gap-3.5 hover:bg-white transition-all">
              <div className="w-11 h-11 rounded-lg bg-blue-100/80 flex items-center justify-center text-blue-800 flex-shrink-0 border border-blue-300/50">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#0b1d3a] leading-tight">{t.features[1].title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">{t.features[1].desc}</p>
              </div>
            </div>

            <div className="bg-[#fcfbf9]/95 border border-amber-200/60 p-4 rounded-xl shadow-sm backdrop-blur-md flex items-center gap-3.5 hover:bg-white transition-all">
              <div className="w-11 h-11 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-800 flex-shrink-0 border border-emerald-300/50">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#0b1d3a] leading-tight">{t.features[2].title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">{t.features[2].desc}</p>
              </div>
            </div>

            <div className="bg-[#fcfbf9]/95 border border-amber-200/60 p-4 rounded-xl shadow-sm backdrop-blur-md flex items-center gap-3.5 hover:bg-white transition-all">
              <div className="w-11 h-11 rounded-lg bg-purple-100/80 flex items-center justify-center text-purple-800 flex-shrink-0 border border-purple-300/50">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#0b1d3a] leading-tight">{t.features[3].title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">{t.features[3].desc}</p>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ───────────────────────────────────────────────────────────────────
          SECTION 2 — WHAT ARE THE MAJOR ISSUES IN YOUR AREA?
          Exact clone of Image 1: Clean white background, centered headline,
          large image carousel with left/right circular arrows, dark navy
          overlay card at bottom-left ("Broken Roads" -> "Report Now ->"),
          and simple carousel dots below.
      ──────────────────────────────────────────────────────────────────── */}
      <section id="public-issues-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0b1d3a] tracking-tight">
              {issuesT.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {issuesT.subtitle}
            </p>
          </div>

          {/* Large Carousel Card matching Image 1 but wider and taller to fill vacant sides */}
          <div className="relative max-w-7xl mx-auto group">
            
            <div className="relative h-[500px] sm:h-[580px] lg:h-[640px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900">
              {localIssues.map((issue, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    {/* Background Image */}
                    <img
                      src={issue.image}
                      alt={issue.title}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Subtle gradient so bottom overlay reads well */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    
                    {/* Glassmorphic Compact Dark Navy Overlay Card */}
                    <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 z-20 max-w-[295px] sm:max-w-sm bg-[#0b1d3a]/90 backdrop-blur-md p-4 sm:p-5.5 rounded-2xl border border-white/10 shadow-xl space-y-2.5 text-left">
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
                        {issue.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-300 leading-normal font-normal">
                        {issue.desc}
                      </p>
                      <div className="pt-1">
                        <button
                          onClick={() => onNavigate('submit')}
                          className="px-4 py-2 bg-[#1d4ed8] hover:bg-blue-600 text-white font-bold text-[10px] sm:text-xs rounded-lg shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95 group/btn"
                        >
                          <span>{issuesT.reportNow}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows matching Image 1 (Dark circular buttons on edges) */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0b1d3a]/80 hover:bg-[#0b1d3a] text-white flex items-center justify-center transition-all shadow-lg cursor-pointer border border-white/20 active:scale-95"
              title="Previous Issue"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0b1d3a]/80 hover:bg-[#0b1d3a] text-white flex items-center justify-center transition-all shadow-lg cursor-pointer border border-white/20 active:scale-95"
              title="Next Issue"
            >
              <ChevronRight size={24} />
            </button>

            {/* Carousel Dots below image matching Image 1 */}
            <div className="flex justify-center items-center gap-2.5 mt-6">
              {localIssues.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => selectSlide(idx)}
                  className={`rounded-full transition-all cursor-pointer ${
                    idx === currentSlide 
                      ? 'w-3.5 h-3.5 bg-[#0b1d3a]' 
                      : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────
          SECTION 3 — STATISTICS STRIP
          Exact clone of Image 1: Light beige/cream horizontal strip with
          icon on the left inside a circular badge, bold numbers & labels.
      ──────────────────────────────────────────────────────────────────── */}
      <section className="bg-[#fdfcf9] border-y border-amber-200/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-100/80 flex items-center justify-center text-amber-800 flex-shrink-0 border border-amber-300/50 shadow-xs">
                <Building2 size={26} />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0b1d3a] block">
                  {totalSubmissions > 0 ? totalSubmissions.toLocaleString() : "1,25,430+"}
                </span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mt-0.5">{statsT.totalComplaints}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-800 flex-shrink-0 border border-emerald-300/50 shadow-xs">
                <Clock size={26} />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0b1d3a] block">
                  {resolutionRate > 0 ? `${resolutionRate}%` : "85%"}
                </span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mt-0.5">{statsT.resolutionRate}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-100/80 flex items-center justify-center text-amber-800 flex-shrink-0 border border-amber-300/50 shadow-xs">
                <Users size={26} />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0b1d3a] block">
                  500+
                </span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mt-0.5">{statsT.activeReps}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100/80 flex items-center justify-center text-blue-800 flex-shrink-0 border border-blue-300/50 shadow-xs">
                <MapPin size={26} />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0b1d3a] block">
                  25
                </span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mt-0.5">{statsT.constituencies}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────
          SECTION 4 — PROFESSIONAL FOOTER
          Rendered immediately below the statistics strip via App.tsx, 
          matching Image 1 layout with 100% precision.
      ──────────────────────────────────────────────────────────────────── */}
    </div>
  );
};
