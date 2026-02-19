import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Home as HomeIcon, BookOpen, ClipboardList, BookHeart, Handshake, LogOut } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import ClientPINLogin from './components/ClientPINLogin';
import PINAuthDiagnostic from './components/PINAuthDiagnostic';
import TestClientCreator from './components/TestClientCreator';
import Home from './pages/Home';
import CurriculumSystem from './components/CurriculumSystem';
import LearningModuleRenderer from './components/LearningModuleRenderer';
import CheatSheet from './pages/CheatSheet';
import Wounds from './pages/Wounds';
import Qualities from './pages/Qualities';
import PartsMapping from './pages/PartsMapping';
import Exercises from './pages/Exercises';
import Assessment from './pages/Assessment';
import Assessments from './pages/Assessments';
import Resources from './pages/Resources';
import Journal from './pages/Journal';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PartsStudio from './pages/PartsStudio';
import MicroLearning from './pages/MicroLearning';
import Affirmations from './pages/Affirmations';
import TherapyIntegration from './pages/TherapyIntegration';
import AdminDashboardEnhanced from './pages/AdminDashboardEnhanced';
import TherapistDashboard from './pages/TherapistDashboard';
import ProgressTimeline from './pages/ProgressTimeline';
import MoodTracker from './pages/MoodTracker';
import GamificationHub from './pages/GamificationHub';
import PartsDialogue from './pages/PartsDialogue';
import AuthDebug from './components/AuthDebug';
import PINEntry from './components/PINEntry';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PartsProvider } from './contexts/PartsContext';
import { clientAuth } from './lib/supabasePersonalization';

function BottomNav() {
  const location = useLocation();
  const { theme } = useTheme();
  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/curriculum', icon: BookOpen, label: 'Curriculum' },
    { path: '/assessments', icon: ClipboardList, label: 'Assessments' },
    { path: '/journal', icon: BookHeart, label: 'Journal' },
    { path: '/therapy', icon: Handshake, label: 'Integration' },
  ];

  const accentMap = {
    blue: { active: 'text-blue-600', bg: 'bg-blue-100' },
    emerald: { active: 'text-emerald-600', bg: 'bg-emerald-100' },
    amber: { active: 'text-amber-600', bg: 'bg-amber-100' },
    purple: { active: 'text-purple-600', bg: 'bg-purple-100' },
    indigo: { active: 'text-indigo-400', bg: 'bg-indigo-900' },
  };
  const accent = accentMap[theme.accent] || accentMap.purple;

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg border-t shadow-[0_-2px_10px_rgba(0,0,0,0.06)] ${theme.isDark ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white/95 border-gray-200/50'}`}>
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[60px] ${
                isActive
                  ? accent.active
                  : theme.isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all duration-200 ${isActive ? accent.bg : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              </div>
              <span className={`text-[10px] leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  useEffect(() => {
    // Check for existing session and handle token authentication
    const initializeAuth = async () => {
      // First check for token in URL
      const tokenResult = await clientAuth.handleTokenFromURL();
      
      if (tokenResult && tokenResult.success) {
        setIsAuthenticated(true);
        setCurrentClient(tokenResult.client);
        return;
      }

      // Check for existing session
      const client = clientAuth.getCurrentClientValidated();
      if (client) {
        setIsAuthenticated(true);
        setCurrentClient(client);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (pin) => {
    const result = await clientAuth.authenticateWithPIN(pin);
    if (result.success) {
      setIsAuthenticated(true);
      setCurrentClient(result.client);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    clientAuth.logout();
    setIsAuthenticated(false);
    setCurrentClient(null);
  };

  return (
    <ThemeProvider>
    <PartsProvider>
    <DataProvider>
      <Router>
        <AppContent
          isAuthenticated={isAuthenticated}
          currentClient={currentClient}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
      </Router>
    </DataProvider>
    </PartsProvider>
    </ThemeProvider>
  );
}

function AppContent({ isAuthenticated, currentClient, handleLogin, handleLogout }) {
  const { theme } = useTheme();
  const bgClass = isAuthenticated ? `bg-gradient-to-br ${theme.primary}` : '';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/" element={<ClientPINLogin onLogin={handleLogin} />} />
          <Route path="/test-client" element={<TestClientCreator />} />
          <Route path="/diagnostic" element={<PINAuthDiagnostic />} />
          <Route path="/auth-debug" element={<AuthDebug />} />
          <Route path="*" element={<ClientPINLogin onLogin={handleLogin} />} />
        </Routes>
      ) : (
        <>
          <header className={`sticky top-0 z-50 backdrop-blur-lg border-b shadow-sm ${theme.isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-gray-200/50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-14">
                    <Link to="/" className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">✦</span>
                      </div>
                      <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        IFS Healing
                      </h1>
                    </Link>
                    <div className="flex items-center gap-1">
                      {currentClient?.user_role === 'therapist' && (
                        <Link
                          to="/admin"
                          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                          title="Admin Dashboard"
                        >
                          <ClipboardList className="w-5 h-5" />
                        </Link>
                      )}
                      <Link
                        to="/settings"
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        title="Settings"
                      >
                        <SettingsIcon className="w-5 h-5" />
                      </Link>
                      <Link
                        to="/profile"
                        className="p-2 hover:bg-purple-50 rounded-lg transition-all"
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                          {currentClient?.name?.charAt(0) || '?'}
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                        title="Logout"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </header>
              
              <div className="pb-20">
              <Routes>
                <Route path="/" element={<Home clientId={currentClient?.id} client={currentClient} />} />
                <Route path="/curriculum" element={<CurriculumSystem clientId={currentClient?.id} userProgress={{}} />} />
                <Route path="/curriculum/module/:moduleId" element={<LearningModuleRenderer userProgress={{}} />} />
                <Route path="/cheat-sheet" element={<CheatSheet />} />
                <Route path="/wounds" element={<Wounds />} />
                <Route path="/qualities" element={<Qualities />} />
                <Route path="/parts-mapping" element={<PartsMapping />} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/assessments" element={<Assessments />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/profile" element={<Profile client={currentClient} />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/parts-studio" element={<PartsStudio />} />
                <Route path="/micro-learning" element={<MicroLearning />} />
                <Route path="/affirmations" element={<Affirmations />} />
                <Route path="/therapy" element={<TherapyIntegration />} />
                <Route path="/admin" element={
                  currentClient?.user_role === 'therapist' 
                    ? <AdminDashboardEnhanced /> 
                    : <Home clientId={currentClient?.id} client={currentClient} />
                } />
                <Route path="/therapist-dashboard" element={
                  currentClient?.user_role === 'therapist'
                    ? <TherapistDashboard />
                    : <Home clientId={currentClient?.id} client={currentClient} />
                } />
                <Route path="/progress-timeline" element={<ProgressTimeline />} />
                <Route path="/mood-tracker" element={<MoodTracker />} />
                <Route path="/gamification" element={<GamificationHub />} />
                <Route path="/parts-dialogue" element={<PartsDialogue />} />
                <Route path="/test-client" element={<TestClientCreator />} />
                <Route path="/diagnostic" element={<PINAuthDiagnostic />} />
                <Route path="/auth-debug" element={<AuthDebug />} />
                <Route path="*" element={<Home clientId={currentClient?.id} />} />
              </Routes>
              </div>

              <BottomNav />
            </>
          )}
        </div>
  );
}

export default App;
