import React, { useState } from 'react';
import { Language, translations } from '../locales/translations';
import { AppView, UserState } from '../components/Navbar';
import { BrandLogo } from '../components/BrandLogo';
import { CONSTITUENCIES } from '../constants';
import { Shield, User, Lock, Phone, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

const authBg = new URL('../auth_page_bg.png', import.meta.url).href;

interface AuthPageProps {
  lang: Language;
  initialMode: 'login' | 'register';
  onNavigate: (view: AppView) => void;
  onLoginSuccess: (user: UserState) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  lang,
  initialMode,
  onNavigate,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const t = translations[lang].auth;

  // Form states
  const [role, setRole] = useState<'citizen' | 'rep'>('citizen');
  const [fullName, setFullName] = useState('');
  const [mobileEmail, setMobileEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [constituency, setConstituency] = useState(CONSTITUENCIES[0] || 'New Delhi Central');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (!mobileEmail.trim() || !password.trim()) {
        setError('Please enter your mobile number/email and password.');
        return;
      }
    } else {
      if (!fullName.trim() || !mobileEmail.trim() || !password.trim()) {
        setError('Please fill in all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setError('You must agree to the Terms & Conditions.');
        return;
      }
    }

    setLoading(true);

    // Simulate backend auth check while maintaining compatibility
    setTimeout(() => {
      setLoading(false);
      const nameToUse = mode === 'register' ? fullName : (role === 'rep' ? 'Hon. Ravi Kumar' : 'Ravi Kumar');
      const newUser: UserState = {
        isLoggedIn: true,
        name: nameToUse,
        role: role,
        constituency: constituency
      };
      onLoginSuccess(newUser);
      onNavigate(role === 'rep' ? 'dashboard-rep' : 'dashboard-citizen');
    }, 800);
  };

  return (
    <div 
      className="w-full min-h-[calc(100vh-140px)] bg-cover bg-center flex flex-col justify-center items-center py-10 px-4 md:px-8 font-sans relative"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      {/* Subtle overlay screen to keep card text highly contrastive */}
      <div className="absolute inset-0 bg-slate-900/5 z-0 pointer-events-none" />

      {/* Centered glassmorphic container */}
      <div className={`relative z-10 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-5 sm:p-10 w-full animate-fade-in ${
        mode === 'login' ? 'max-w-md' : 'max-w-lg'
      }`}>
        {/* Tricolor top border accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        {/* Brand logo & header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-6">
          <BrandLogo 
            theme="light" 
            size="sm" 
            subtitle="GOVERNMENT OF INDIA" 
            onClick={() => onNavigate('landing')} 
            layout="vertical"
          />
          <div className="pt-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#0b1d3a]">
              {mode === 'login' ? t.loginTitle : t.registerTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {mode === 'login' ? t.loginSub : t.registerSub}
            </p>
          </div>
        </div>

        {/* Role selection tabs centered */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs w-full max-w-[260px] mx-auto mb-6">
          <button
            type="button"
            onClick={() => setRole('citizen')}
            className={`flex-1 py-1.5 rounded font-bold transition-all cursor-pointer text-center ${
              role === 'citizen' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.roleCitizen}
          </button>
          <button
            type="button"
            onClick={() => setRole('rep')}
            className={`flex-1 py-1.5 rounded font-bold transition-all cursor-pointer text-center ${
              role === 'rep' 
                ? 'bg-emerald-700 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.roleRep}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2 mb-4 animate-fade-in">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Constituency selector for Registration or Representative */}
          {(mode === 'register' || role === 'rep') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Constituency
              </label>
              <select
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              >
                {CONSTITUENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Full Name (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.fullName} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Mobile / Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {mode === 'login' ? t.mobileEmail : t.mobile} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={mobileEmail}
                onChange={(e) => setMobileEmail(e.target.value)}
                placeholder={mode === 'login' ? t.mobileEmailPlaceholder : t.mobilePlaceholder}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.password} <span className="text-red-500">*</span>
              </label>
              {mode === 'login' && (
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to registered mobile/email."); }} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
                  {t.forgotPass}
                </a>
              )}
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Confirm Password (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.confirmPassword} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.confirmPasswordPlaceholder}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Terms Checkbox (Register only) */}
          {mode === 'register' && (
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer">
                {t.termsCheck}
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              role === 'rep' ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-[#0b1d3a] hover:bg-blue-900'
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'login' ? t.loginBtn : t.registerBtn}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-600 mt-4">
          {mode === 'login' ? (
            <p>
              {t.noAccount}{' '}
              <button
                onClick={() => setMode('register')}
                className="font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                {t.registerHere}
              </button>
            </p>
          ) : (
            <p>
              {t.haveAccount}{' '}
              <button
                onClick={() => setMode('login')}
                className="font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                {t.loginHere}
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
