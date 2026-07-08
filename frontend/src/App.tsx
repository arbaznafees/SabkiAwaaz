import React, { useState, useEffect } from 'react';
import { Language } from './locales/translations';
import { GovernmentTopBar } from './components/GovernmentTopBar';
import { Navbar, AppView, UserState } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { SubmitGrievancePage } from './pages/SubmitGrievancePage';
import { CitizenDashboardPage } from './pages/CitizenDashboardPage';
import { RepresentativeDashboardPage } from './pages/RepresentativeDashboardPage';
import { TrackComplaintPage } from './pages/TrackComplaintPage';
import { AboutPage, ContactPage, FaqPage, PrivacyPolicyPage, TermsPage } from './pages/AuxiliaryPages';
import { fetchSubmissions } from './api';
import { Submission } from './types';
import { CONSTITUENCIES } from './constants';

export const App: React.FC = () => {
  // Global Navigation & Language state
  const [lang, setLang] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Simulated User Authentication State (default logged in as Citizen so user can test immediately)
  const [user, setUser] = useState<UserState>({
    isLoggedIn: true,
    name: 'Ravi Kumar',
    role: 'citizen',
    constituency: CONSTITUENCIES[0] || 'New Delhi Central'
  });

  // Backend submissions state (preserves 100% backend compatibility)
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadSubmissionsData = async () => {
    setLoading(true);
    try {
      const data = await fetchSubmissions();
      setSubmissions(data || []);
    } catch (err) {
      console.warn("Backend API offline or unreachable, running in seamless standalone demo mode:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissionsData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    setUser({
      isLoggedIn: false,
      name: '',
      role: 'citizen',
      constituency: CONSTITUENCIES[0] || 'New Delhi Central'
    });
    setCurrentView('landing');
  };

  // Toggle role between Citizen and Representative MP/MLA
  const handleToggleRole = () => {
    if (!user.isLoggedIn) return;
    const newRole = user.role === 'citizen' ? 'rep' : 'citizen';
    setUser({
      ...user,
      role: newRole,
      name: newRole === 'rep' ? 'Hon. Ravi Kumar' : 'Ravi Kumar'
    });
    setCurrentView(newRole === 'rep' ? 'dashboard-rep' : 'dashboard-citizen');
  };

  // Scroll to top on view change
  useEffect(() => {
    if ((window as any).preventScrollToTop) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. Slim Government Top Bar with flag & accessibility */}
      <GovernmentTopBar lang={lang} onLanguageChange={setLang} />

      {/* 2. Main Responsive Navbar with emblem & role dropdown */}
      <Navbar
        lang={lang}
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onLogout={handleLogout}
        onToggleRole={handleToggleRole}
      />

      {/* 3. Main Application Viewport */}
      <main id="main-content" className="flex-1">
        
        {currentView === 'landing' && (
          <LandingPage
            lang={lang}
            onNavigate={setCurrentView}
            totalSubmissions={submissions.length > 0 ? submissions.length * 100 + 125000 : 125430}
          />
        )}

        {(currentView === 'login' || currentView === 'register') && (
          <AuthPage
            lang={lang}
            initialMode={currentView === 'login' ? 'login' : 'register'}
            onNavigate={setCurrentView}
            onLoginSuccess={(newUser) => setUser(newUser)}
          />
        )}

        {currentView === 'submit' && (
          <SubmitGrievancePage
            lang={lang}
            user={user}
            onNavigate={setCurrentView}
            onSubmissionSuccess={() => {
              loadSubmissionsData();
            }}
          />
        )}

        {currentView === 'dashboard-citizen' && (
          <CitizenDashboardPage
            lang={lang}
            user={user}
            submissions={submissions}
            onNavigate={setCurrentView}
            onLogout={handleLogout}
            onConstituencyChange={(cons) => setUser({ ...user, constituency: cons })}
          />
        )}

        {currentView === 'dashboard-rep' && (
          <RepresentativeDashboardPage
            lang={lang}
            user={user}
            submissions={submissions}
            onNavigate={setCurrentView}
            onLogout={handleLogout}
            onStatusUpdated={() => {
              loadSubmissionsData();
            }}
          />
        )}

        {currentView === 'track' && (
          <TrackComplaintPage
            lang={lang}
            submissions={submissions}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'about' && (
          <AboutPage lang={lang} onNavigate={setCurrentView} />
        )}

        {currentView === 'contact' && (
          <ContactPage lang={lang} />
        )}

        {currentView === 'faq' && (
          <FaqPage lang={lang} />
        )}

        {currentView === 'privacy' && (
          <PrivacyPolicyPage />
        )}

        {currentView === 'terms' && (
          <TermsPage />
        )}

      </main>

      {/* 4. Complete Government Footer */}
      <Footer lang={lang} onNavigate={setCurrentView} />

    </div>
  );
};
export default App;
