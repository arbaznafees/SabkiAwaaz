import React from 'react';

interface WardBadgeProps {
  name: string;
  intensity: 'High' | 'Moderate' | 'Low';
  submissions?: number;
}

export const WardBadge: React.FC<WardBadgeProps> = ({ name, intensity, submissions }) => {
  const getStyles = () => {
    switch (intensity) {
      case 'High':
        return 'bg-seal-maroon/5 text-seal-maroon border-seal-maroon/20';
      case 'Moderate':
        return 'bg-seal-navy/5 text-seal-navy border-seal-navy/20';
      case 'Low':
        return 'bg-seal-green/5 text-seal-green border-seal-green/20';
      default:
        return 'bg-ink/5 text-ink border-ink/20';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[11px] font-bold border ${getStyles()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {name.toUpperCase()} — {intensity.toUpperCase()}{submissions !== undefined ? ` (${submissions} ENTRIES)` : ''}
    </span>
  );
};
