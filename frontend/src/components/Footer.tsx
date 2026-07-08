import React from 'react';
import { Language, translations } from '../locales/translations';
import { AppView } from './Navbar';
import { BrandLogo } from './BrandLogo';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  const t = translations[lang].footer;
  const navT = translations[lang].nav;

  const handleAboutNavigate = (sectionId: string) => {
    (window as any).preventScrollToTop = true;
    onNavigate('about');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      (window as any).preventScrollToTop = false;
    }, 100);
  };

  return (
    <footer className="bg-[#0b1d3a] text-slate-300 font-sans border-t-4 border-blue-600 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          
          {/* Column 1: SABKI AWAAZ */}
          <div className="lg:col-span-1 space-y-4">
            <BrandLogo 
              theme="dark" 
              size="sm" 
              onClick={() => onNavigate('landing')} 
            />
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.aboutText}
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#fb" className="hover:text-white transition-colors p-1.5 rounded bg-white/5 hover:bg-white/10"><Facebook size={16} /></a>
              <a href="#tw" className="hover:text-white transition-colors p-1.5 rounded bg-white/5 hover:bg-white/10"><Twitter size={16} /></a>
              <a href="#ig" className="hover:text-white transition-colors p-1.5 rounded bg-white/5 hover:bg-white/10"><Instagram size={16} /></a>
              <a href="#yt" className="hover:text-white transition-colors p-1.5 rounded bg-white/5 hover:bg-white/10"><Youtube size={16} /></a>
            </div>
          </div>

          {/* Column 2: IMPORTANT LINKS */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-blue-500 pl-2.5">
              {t.importantLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer">{navT.home}</button></li>
              <li><button onClick={() => onNavigate('submit')} className="hover:text-white transition-colors cursor-pointer">{navT.submit}</button></li>
              <li><button onClick={() => onNavigate('dashboard-citizen')} className="hover:text-white transition-colors cursor-pointer">{navT.dashboard}</button></li>
            </ul>
          </div>

          {/* Column 3: RESOURCES */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-blue-500 pl-2.5">
              {t.resources}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer">{t.howItWorks}</button></li>
              <li><button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors cursor-pointer">{t.faqs}</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors cursor-pointer">{t.privacy}</button></li>
              <li><button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors cursor-pointer">{t.terms}</button></li>
            </ul>
          </div>

          {/* Column 4: ABOUT US */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-blue-500 pl-2.5">
              {t.aboutUs}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => handleAboutNavigate('about-section')} className="hover:text-white transition-colors cursor-pointer">About Sabki Awaaz</button></li>
              <li><button onClick={() => handleAboutNavigate('mission-section')} className="hover:text-white transition-colors cursor-pointer">{t.mission}</button></li>
              <li><button onClick={() => handleAboutNavigate('vision-section')} className="hover:text-white transition-colors cursor-pointer">{t.vision}</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">{t.contactUs}</button></li>
            </ul>
          </div>

          {/* Column 5: CONTACT US */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-blue-500 pl-2.5">
              {t.contactUs}
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-white font-medium">{t.tollFree}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t.address}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>{t.copyright}</p>
          <p className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart size={13} className="text-red-500 fill-red-500 animate-pulse" />
            <span>for a better India</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
