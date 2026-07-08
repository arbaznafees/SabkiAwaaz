import React, { useState } from 'react';
import { Theme } from '../types';
import { WardBadge } from './WardBadge';
import { ChevronDown, ChevronUp, Quote } from 'lucide-react';

interface ThemeCardProps {
  theme: Theme;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className="bg-white border border-parchment-deep p-6 md:p-8 paper-stack relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Official Case Reference Number in Typewriter font */}
      <div className="absolute top-0 right-0 p-4 font-mono text-[11px] text-ink/40 tracking-wider">
        REF-{theme.id}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
        <div className="flex-1">
          {/* Main Headline */}
          <h3 className="font-sans text-xl md:text-2xl font-bold text-seal-maroon mb-3 tracking-tight">
            {theme.title}
          </h3>
          
          {/* Categorization Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-seal-maroon/5 text-seal-maroon border border-seal-maroon/20 px-2.5 py-0.5 font-mono text-[11px] font-bold">
              {theme.tag}
            </span>
            {theme.secondaryTag && (
              <span className="bg-seal-navy/5 text-seal-navy border border-seal-navy/20 px-2.5 py-0.5 font-mono text-[11px] font-bold">
                {theme.secondaryTag}
              </span>
            )}
          </div>

          {/* Ward Badges */}
          <div className="flex flex-wrap gap-1.5">
            {theme.wardBadges.map((badge, idx) => (
              <WardBadge 
                key={idx} 
                name={badge.name} 
                intensity={badge.intensity} 
                submissions={badge.submissions} 
              />
            ))}
          </div>
        </div>

        {/* Circular Double-Ring Sealing Rubber Stamp Badge */}
        <div className="flex flex-col items-center justify-center border-4 border-double border-seal-maroon/80 p-2.5 rounded-full w-24 h-24 rotate-[-6deg] bg-[#fffcf5] stamp-effect flex-shrink-0 select-none shadow-sm">
          {/* Subtle grain/mesh texture effect handled via CSS stamp-effect in index.css */}
          <span className="font-mono text-[9px] text-seal-maroon/70 tracking-widest font-bold">CRIT. SCORE</span>
          <span className="font-sans text-3xl font-extrabold text-seal-maroon leading-none mt-1">
            {theme.score}
          </span>
          <span className="font-mono text-[8px] text-seal-maroon/60 tracking-tighter mt-1">OFFICIAL SEAL</span>
        </div>
      </div>

      {/* Stacked Horizontal Bars & Metric Breakdown Panel */}
      <div className="grid md:grid-cols-2 gap-8 mb-6 border-t border-dashed border-parchment-deep pt-6">
        {/* Progress Meters */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between font-mono text-xs text-ink/75 mb-1.5">
              <span className="font-bold">SUBMISSION VOLUME</span>
              <span className="font-bold">{theme.submissions.length} ACTIVE ENTRIES</span>
            </div>
            <div className="h-4 bg-parchment-dim border border-parchment-deep relative">
              <div 
                className="h-full bg-seal-maroon transition-all duration-1000" 
                style={{ width: `${theme.submissionVolumeWeight}%` }}
              ></div>
              {/* Inner metric ticks to look like survey paper */}
              <div className="absolute inset-y-0 left-1/4 border-r border-ink/10"></div>
              <div className="absolute inset-y-0 left-2/4 border-r border-ink/10"></div>
              <div className="absolute inset-y-0 left-3/4 border-r border-ink/10"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between font-mono text-xs text-ink/75 mb-1.5">
              <span className="font-bold">{theme.secondaryWeightLabel}</span>
              <span className="font-bold">{theme.secondaryWeight}% RATIO</span>
            </div>
            <div className="h-4 bg-parchment-dim border border-parchment-deep relative">
              <div 
                className="h-full bg-seal-navy transition-all duration-1000" 
                style={{ width: `${theme.secondaryWeight}%` }}
              ></div>
              <div className="absolute inset-y-0 left-1/4 border-r border-ink/10"></div>
              <div className="absolute inset-y-0 left-2/4 border-r border-ink/10"></div>
              <div className="absolute inset-y-0 left-3/4 border-r border-ink/10"></div>
            </div>
          </div>
        </div>

        {/* Case Dossier Metrics Breakdown */}
        <div className="bg-parchment-dim p-4 border-l-4 border-seal-maroon/40 flex flex-col justify-between">
          <h4 className="font-mono text-xs text-ink/60 uppercase tracking-wider mb-3 font-bold">
            Gazette Case Directory
          </h4>
          <ul className="space-y-1.5 font-mono text-xs text-ink/90">
            <li className="flex justify-between border-b border-parchment-dark pb-1">
              <span>Frequency Level:</span> 
              <span className="font-bold text-seal-maroon">{theme.frequency}</span>
            </li>
            <li className="flex justify-between border-b border-parchment-dark pb-1">
              <span>Last Gazette Audit:</span> 
              <span className="font-bold">{theme.lastResolution}</span>
            </li>
            <li className="flex justify-between border-b border-parchment-dark pb-1">
              <span>Legal/Status Standing:</span> 
              <span className="font-bold text-seal-green">{theme.legalStanding}</span>
            </li>
            <li className="flex justify-between">
              <span>Official Status:</span> 
              <span className="font-bold">{theme.auditStatus}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Expandable Citizen Testimonies */}
      <div className="border-t border-dashed border-parchment-deep pt-4">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between font-mono text-xs text-seal-maroon hover:text-seal-maroon-dark focus:outline-none cursor-pointer transition-colors"
        >
          <span className="font-bold uppercase tracking-wider">Representative Testimonies ({theme.submissions.length})</span>
          <span className="flex items-center gap-1">
            <span className="text-[10px] text-ink/50 uppercase">{isOpen ? "COLLAPSE" : "EXPAND"}</span>
            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>

        {isOpen && (
          <div className="mt-4 grid md:grid-cols-2 gap-4 animate-fade-in">
            {theme.submissions.map((sub) => (
              <blockquote 
                key={sub.id} 
                className="p-5 bg-parchment/60 border border-parchment-deep relative testimonial-cursive text-ink/90 italic text-[15px]"
              >
                <Quote className="absolute -top-2.5 -left-1 text-seal-maroon/10 w-8 h-8 rotate-180 transform -scale-x-100" />
                <p className="relative z-10 font-serif leading-relaxed">
                  "{sub.content}"
                </p>
                <footer className="mt-3 font-mono text-[10px] text-ink/50 not-italic uppercase tracking-wider flex justify-between">
                  <span>— {sub.residentName}, {sub.residentTitle}</span>
                  <span className="text-seal-maroon font-bold">★ {sub.upvotes} UPVOTES</span>
                </footer>
              </blockquote>
            ))}
            {theme.submissions.length === 0 && (
              <p className="font-mono text-xs text-ink/50 p-4">No citizen entries submitted yet for this theme.</p>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
