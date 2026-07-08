import React from 'react';
import { Language, translations } from '../locales/translations';
import { Globe } from 'lucide-react';

interface GovernmentTopBarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const GovernmentTopBar: React.FC<GovernmentTopBarProps> = ({ lang, onLanguageChange }) => {
  const t = translations[lang].topBar;

  return (
    <div className="bg-[#0b1d3a] text-white text-xs py-1.5 px-4 md:px-10 border-b border-blue-950 flex justify-between items-center z-50 relative font-sans">
      {/* Left side */}
      <div className="flex items-center gap-2.5">
        <span className="inline-block w-4 h-3 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] rounded-2xs border border-white/20 shadow-2xs" title={t.flagAlt}></span>
        <span className="font-semibold tracking-wide text-[11px] md:text-xs text-slate-200">{t.govIndia}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 text-[11px] md:text-xs text-slate-300">
        <a href="#main-content" className="hover:text-white transition-colors hidden sm:inline-block underline decoration-slate-600 underline-offset-2">
          {t.skipContent}
        </a>
        <span className="hidden sm:inline-block text-slate-600">|</span>
        
        {/* Text size controls */}
        <div className="hidden md:flex items-center gap-1.5 font-mono">
          <button className="hover:text-white px-1 font-bold" title="Increase font size">A+</button>
          <button className="hover:text-white px-1 font-normal" title="Normal font size">A</button>
          <button className="hover:text-white px-1 text-[10px]" title="Decrease font size">A-</button>
        </div>
        <span className="hidden md:inline-block text-slate-600">|</span>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-800/60 cursor-pointer hover:border-blue-500 transition-colors">
          <Globe size={13} className="text-blue-400" />
          <select 
            value={lang}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-[11px]"
          >
            <option value="en" className="bg-[#0b1d3a] text-white">English</option>
            <option value="hi" className="bg-[#0b1d3a] text-white">हिन्दी</option>
          </select>
        </div>
      </div>
    </div>
  );
};
