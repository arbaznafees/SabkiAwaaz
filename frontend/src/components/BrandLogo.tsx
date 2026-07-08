import React from 'react';

export interface BrandLogoProps {
  theme?: 'light' | 'dark'; // 'light' for white/light backgrounds, 'dark' for navy/green backgrounds
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  subtitle?: string; // Optional badge e.g. "GovIndia", "CITIZEN PORTAL", "MP / MLA OFFICE"
  onClick?: () => void;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  theme = 'light',
  size = 'md',
  showTagline = true,
  subtitle,
  onClick,
  className = '',
  layout = 'horizontal'
}) => {
  // Size dimensions for emblem icon
  const iconDimensions = {
    xs: 'w-7 h-7 min-w-[28px]',
    sm: 'w-9 h-9 min-w-[36px]',
    md: 'w-12 h-12 min-w-[48px]',
    lg: 'w-16 h-16 min-w-[64px]',
    xl: 'w-24 h-24 min-w-[96px]'
  }[size];

  // Title typography sizing
  const titleClasses = {
    xs: 'text-sm font-extrabold',
    sm: 'text-lg sm:text-xl font-extrabold',
    md: 'text-xl sm:text-2xl font-black',
    lg: 'text-2xl sm:text-4xl font-black',
    xl: 'text-4xl sm:text-5xl font-black'
  }[size];

  // Tagline sizing
  const taglineClasses = {
    xs: 'text-[9px] font-bold',
    sm: 'text-[11px] sm:text-xs font-bold',
    md: 'text-xs sm:text-sm font-bold',
    lg: 'text-sm sm:text-base font-bold',
    xl: 'text-base sm:text-lg font-bold'
  }[size];

  // Theme colors
  const titleColor = theme === 'light' ? 'text-[#0b1d3a]' : 'text-white';
  const saffronColor = 'text-[#FF9933]';
  const greenColor = theme === 'light' ? 'text-[#138808]' : 'text-[#4ade80]';
  const subtitleBadgeColor = theme === 'light' 
    ? 'bg-blue-100 text-blue-800 border-blue-200' 
    : 'bg-white/15 text-emerald-300 border-white/20';

  return (
    <div 
      onClick={onClick}
      className={`flex ${layout === 'vertical' ? 'flex-col items-center text-center gap-2' : 'items-center gap-3'} ${onClick ? 'cursor-pointer group' : ''} select-none font-sans ${className}`}
    >
      {/* ── LOGO EMBLEM ICON (Exact vector reproduction of Sabki Awaaz Circular Emblem) ── */}
      <div className={`${iconDimensions} relative flex items-center justify-center transition-transform duration-300 ${onClick ? 'group-hover:scale-105' : ''}`}>
        <svg 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Background circular glow/plate */}
          <circle cx="60" cy="60" r="56" fill={theme === 'light' ? '#f8fafc' : '#ffffff'} fillOpacity="0.08" />
          
          {/* Saffron / Orange Arc (Top Left) */}
          <path 
            d="M 22 75 C 10 50, 18 25, 45 12" 
            stroke="#FF9933" 
            strokeWidth="5" 
            strokeLinecap="round" 
            fill="none" 
          />
          {/* Navy Blue Arc (Right) */}
          <path 
            d="M 68 10 C 95 18, 110 45, 102 75" 
            stroke="#0b1d3a" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            fill="none" 
          />
          {/* Green Arc (Bottom) */}
          <path 
            d="M 98 80 C 85 105, 45 110, 20 92" 
            stroke="#138808" 
            strokeWidth="5.5" 
            strokeLinecap="round" 
            fill="none" 
          />

          {/* Indian Flag Badge at Top Center (x=60, y=12) */}
          <g transform="translate(48, 4)">
            <rect x="0" y="0" width="24" height="6" rx="2" fill="#FF9933" />
            <rect x="0" y="6" width="24" height="6" fill="#FFFFFF" />
            <rect x="0" y="12" width="24" height="6" rx="2" fill="#138808" />
            {/* Ashoka Chakra */}
            <circle cx="12" cy="9" r="2.5" stroke="#000080" strokeWidth="0.8" fill="none" />
            <circle cx="12" cy="9" r="0.6" fill="#000080" />
          </g>

          {/* Three Citizens / Figures Raising Arms */}
          {/* Left Figure (Orange/Saffron) */}
          <g>
            <circle cx="42" cy="34" r="5.5" fill="#FF9933" />
            <path d="M 33 55 C 33 46, 38 41, 46 41 C 51 41, 54 44, 49 33" stroke="#FF9933" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
          {/* Right Figure (Green) */}
          <g>
            <circle cx="78" cy="34" r="5.5" fill="#138808" />
            <path d="M 87 55 C 87 46, 82 41, 74 41 C 69 41, 66 44, 71 33" stroke="#138808" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
          {/* Center Figure (Navy Blue - tallest) */}
          <g>
            <circle cx="60" cy="27" r="6.5" fill="#0b1d3a" />
            <path d="M 49 52 C 49 41, 54 36, 60 36 C 66 36, 71 41, 71 52 Z" fill="#0b1d3a" />
            <path d="M 54 39 C 50 31, 46 29, 44 26" stroke="#0b1d3a" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 66 39 C 70 31, 74 29, 76 26" stroke="#0b1d3a" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>

          {/* City Buildings Skyline on Right (x=68 to x=96) */}
          <g fill="#0b1d3a">
            <rect x="70" y="62" width="6" height="18" rx="0.5" />
            <rect x="77" y="52" width="8" height="28" rx="0.5" />
            <rect x="86" y="60" width="6" height="20" rx="0.5" />
            <rect x="93" y="65" width="5" height="15" rx="0.5" />
            {/* Windows in buildings */}
            <rect x="79" y="55" width="1.5" height="2" fill="#ffffff" />
            <rect x="82" y="55" width="1.5" height="2" fill="#ffffff" />
            <rect x="79" y="60" width="1.5" height="2" fill="#ffffff" />
            <rect x="82" y="60" width="1.5" height="2" fill="#ffffff" />
            <rect x="79" y="65" width="1.5" height="2" fill="#ffffff" />
            <rect x="82" y="65" width="1.5" height="2" fill="#ffffff" />
            <rect x="72" y="65" width="2" height="2" fill="#ffffff" />
            <rect x="88" y="64" width="2" height="2" fill="#ffffff" />
          </g>

          {/* Birds in sky above buildings */}
          <path d="M 75 44 Q 77 41, 79 44 Q 81 41, 83 44" stroke="#0b1d3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 86 48 Q 87.5 46, 89 48 Q 90.5 46, 92 48" stroke="#0b1d3a" strokeWidth="1" fill="none" strokeLinecap="round" />

          {/* Megaphone on Left (pointing right towards city) */}
          <g transform="translate(18, 48)">
            {/* Megaphone cone */}
            <path d="M 6 8 L 28 0 L 28 26 L 6 18 Z" fill="#0b1d3a" />
            <path d="M 28 0 A 4 13 0 0 1 28 26 A 4 13 0 0 1 28 0" fill="#ffffff" stroke="#0b1d3a" strokeWidth="3" />
            {/* Megaphone back / cap */}
            <path d="M 6 8 A 2 5 0 0 0 6 18 Z" fill="#0b1d3a" />
            {/* Handle */}
            <path d="M 12 18 L 16 34 L 22 32 L 18 17 Z" fill="#0b1d3a" rx="2" />
            {/* Sound waves propagating right */}
            <path d="M 35 6 A 10 10 0 0 1 35 20" stroke="#0b1d3a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 40 2 A 16 16 0 0 1 40 24" stroke="#0b1d3a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 45 -2 A 22 22 0 0 1 45 28" stroke="#0b1d3a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          </g>

          {/* Bottom Curved Road / River Swoosh */}
          <path d="M 35 84 Q 60 76, 95 80 Q 70 88, 35 84 Z" fill="#0b1d3a" />
          <path d="M 28 92 Q 55 84, 90 92 Q 60 100, 28 92 Z" fill="#138808" />
          <path d="M 58 79 C 53 84, 48 88, 40 92" stroke="#ffffff" strokeWidth="1.5" fill="none" />
          <path d="M 70 80 C 65 85, 60 89, 52 93" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* ── TYPOGRAPHY (Aligned exactly to "सबकी आवाज़ — सबका विकास —") ── */}
      <div className={`flex flex-col justify-center ${layout === 'vertical' ? 'items-center text-center' : 'items-start text-left'}`}>
        
        {/* Top line: Hindi Devanagari Main Title + Optional Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-sans tracking-tight leading-none ${titleClasses} ${titleColor} transition-colors`}>
            सबकी आवाज़
          </span>
          {subtitle && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${subtitleBadgeColor} shadow-2xs whitespace-nowrap`}>
              {subtitle}
            </span>
          )}
        </div>

        {/* Bottom line: Tagline "-- सबका विकास --" in Tricolor Saffron & Green */}
        {showTagline && (
          <div className={`flex items-center gap-1.5 mt-1 tracking-wide ${taglineClasses}`}>
            <span className={`${saffronColor} font-black select-none`}>—</span>
            <span className={`${greenColor} font-extrabold transition-colors`}>सबका विकास</span>
            <span className={`${greenColor} font-black select-none`}>—</span>
            <span className={`text-[10px] font-mono tracking-normal ml-1.5 hidden sm:inline-block ${theme === 'light' ? 'text-slate-500' : 'text-slate-300'}`}>
              | Sabki Awaaz
            </span>
          </div>
        )}

      </div>
    </div>
  );
};
