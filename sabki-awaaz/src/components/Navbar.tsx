import React, { useState } from 'react';
import { Language, translations } from '../locales/translations';
import { BrandLogo } from './BrandLogo';
import { Menu, X, User as UserIcon, LogOut, Shield, ChevronDown } from 'lucide-react';

export type AppView = 
  | 'landing' 
  | 'submit' 
  | 'track' 
  | 'dashboard-citizen' 
  | 'dashboard-rep' 
  | 'login' 
  | 'register' 
  | 'about' 
  | 'contact' 
  | 'privacy' 
  | 'terms' 
  | 'faq';

export interface UserState {
  isLoggedIn: boolean;
  name: string;
  role: 'citizen' | 'rep';
  constituency: string;
}

interface NavbarProps {
  lang: Language;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  user: UserState;
  onLogout: () => void;
  onToggleRole: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  currentView,
  onNavigate,
  user,
  onLogout,
  onToggleRole
}) => {
  const t = translations[lang].nav;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { label: t.home, view: 'landing' as AppView },
    { label: t.submit, view: 'submit' as AppView },
    { 
      label: t.dashboard, 
      view: (user.isLoggedIn && user.role === 'rep' ? 'dashboard-rep' : 'dashboard-citizen') as AppView 
    },
    { label: t.about, view: 'about' as AppView },
    { label: t.contact, view: 'contact' as AppView },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Aligned Brand Logo */}
          <BrandLogo 
            theme="light" 
            size="md" 
            subtitle="GovIndia" 
            onClick={() => onNavigate('landing')} 
            className="scale-90 origin-left xl:scale-100 transition-all duration-300"
          />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1.5 xl:space-x-6 text-xs xl:text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = currentView === link.view || 
                (link.view.startsWith('dashboard') && currentView.startsWith('dashboard'));
              return (
                <button
                  key={link.view}
                  onClick={() => onNavigate(link.view)}
                  className={`px-3 py-2 rounded-md transition-all cursor-pointer ${
                    isActive
                      ? 'text-blue-700 font-bold bg-blue-50/80 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-[#0b1d3a] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {!user.isLoggedIn ? (
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-300 cursor-pointer"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="hidden sm:inline-flex px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold text-white bg-[#0b1d3a] hover:bg-blue-900 transition-all shadow-xs hover:shadow-md cursor-pointer"
                >
                  {t.register}
                </button>
              </div>
            ) : (
              <div className="relative">
                <div 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full cursor-pointer transition-all"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    user.role === 'rep' ? 'bg-emerald-700' : 'bg-[#0b1d3a]'
                  }`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left text-xs hidden md:block">
                    <p className="font-bold text-slate-800 leading-tight">{user.name}</p>
                    <p className={`text-[10px] font-semibold leading-none ${user.role === 'rep' ? 'text-emerald-700' : 'text-blue-600'}`}>
                      {user.role === 'rep' ? 'MP / MLA Representative' : 'Citizen Member'}
                    </p>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 animate-fade-in text-xs">
                    <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-slate-500 font-medium">Constituency</p>
                      <p className="font-bold text-slate-800">{user.constituency}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate(user.role === 'rep' ? 'dashboard-rep' : 'dashboard-citizen');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium cursor-pointer"
                    >
                      <UserIcon size={14} className="text-blue-600" />
                      <span>{user.role === 'rep' ? t.repDash : t.citizenDash}</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onToggleRole();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-indigo-700 font-medium border-t border-slate-100 cursor-pointer"
                    >
                      <Shield size={14} className="text-indigo-600" />
                      <span>Switch Role: {user.role === 'rep' ? 'Citizen' : 'MP/MLA'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 font-medium border-t border-slate-100 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-fade-in shadow-md">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  onNavigate(link.view);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2.5 rounded-md font-medium text-sm ${
                  currentView === link.view
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            {!user.isLoggedIn ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 rounded-md text-center text-sm font-semibold border border-slate-300 text-slate-700 bg-slate-50"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 rounded-md text-center text-sm font-semibold text-white bg-[#0b1d3a]"
                >
                  {t.register}
                </button>
              </div>
            ) : (
              <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.constituency} — {user.role.toUpperCase()}</p>
                  </div>
                  <button
                    onClick={() => { onToggleRole(); setMobileMenuOpen(false); }}
                    className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded font-bold"
                  >
                    Switch Role
                  </button>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full py-2 bg-red-50 text-red-600 text-sm font-bold rounded flex items-center justify-center gap-2 mt-2"
                >
                  <LogOut size={16} />
                  <span>{t.logout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
