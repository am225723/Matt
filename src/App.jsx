import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import ExcuseReframe from '@/ExcuseReframe';
import YardageBook from '@/YardageBook';
import ResiliencePlaybook from '@/components/ResiliencePlaybook';
import PlaybookLibrary from '@/components/PlaybookLibrary';
import Achievements from '@/components/Achievements';
import EnhancedHealthDashboard from '@/components/EnhancedHealthDashboard';
import AnxietyTrackerRedesigned from '@/components/AnxietyTrackerRedesigned';
import AISuggestion from '@/components/AISuggestion';
import { getPlanFromLibrary } from '@/utils/planLibraryStorage';
import { updateStreak } from '@/utils/gamificationStorage';
import { Helmet } from 'react-helmet';
import { Toaster } from "@/components/ui/toaster";
import { initializePerplexity } from '@/utils/perplexity.js';
import { motion } from 'framer-motion';
import { BookOpen, MessageSquare as MessageSquareQuote, Gavel as Golf, Library, Trophy, Heart, BrainCircuit, Activity } from 'lucide-react';
import KetamineTherapyRedesigned from '@/components/KetamineTherapyRedesigned';

// Import advanced components (lazy loaded to prevent blocking)
const ExcuseReframerAdvanced = React.lazy(() => import('@/components/ExcuseReframerAdvanced'));
const KetamineJournalAdvanced = React.lazy(() => import('@/components/KetamineJournalAdvanced'));

// Import character images
import matthewCharacter from '@/assets/images/matthew-character.png';
import matthewSmile from '@/assets/images/matthew-smile.jpg';

// Sophisticated Mobile-First Tile Component
const DashboardTile = ({ title, description, icon, to, gradient, delay }) => (
  <Link to={to} className="block w-full">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer h-32 sm:h-36"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 ${gradient}`} />
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
        }}
      />
      
      {/* Content */}
      <div className="relative h-full p-6 flex items-center gap-4">
        {/* Icon with glow */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-white/30 rounded-xl blur-lg group-hover:blur-xl transition-all" />
          <div className="relative bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
            <div className="text-white transform group-hover:scale-110 transition-transform">
              {icon}
            </div>
          </div>
        </div>
        
        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">
            {title}
          </h3>
          <p className="text-white/90 text-sm sm:text-base line-clamp-2">
            {description}
          </p>
        </div>
        
        {/* Arrow */}
        <div className="flex-shrink-0 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {/* Bottom border highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </motion.div>
  </Link>
);

const Dashboard = () => {
  const navigate = useNavigate();
  
  const handleSelectScenario = (scenario) => {
    navigate('/playbook', { state: { scenario } });
  };

  const features = [
    {
      title: "Resilience Playbook",
      description: "Build step-by-step strategies for challenging situations",
      icon: <BookOpen className="w-6 h-6" />,
      to: "/playbook",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      delay: 0.1
    },
    {
      title: "Playbook Library",
      description: "Review and manage your saved playbooks",
      icon: <Library className="w-6 h-6" />,
      to: "/library",
      gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
      delay: 0.15
    },
    {
      title: "Achievements",
      description: "Track your progress and view earned badges",
      icon: <Trophy className="w-6 h-6" />,
      to: "/achievements",
      gradient: "bg-gradient-to-br from-yellow-500 to-amber-600",
      delay: 0.2
    },
    {
      title: "Excuse Reframing",
      description: "Transform limiting beliefs with AI assistance",
      icon: <MessageSquareQuote className="w-6 h-6" />,
      to: "/reframe",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
      delay: 0.25
    },
    {
      title: "Ryder Cup Yardage Book",
      description: "Your personal caddie for the Ryder Cup",
      icon: <Golf className="w-6 h-6" />,
      to: "/yardage",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
      delay: 0.3
    },
    {
      title: "Health Dashboard",
      description: "AI-powered health insights and tracking",
      icon: <Heart className="w-6 h-6" />,
      to: "/health",
      gradient: "bg-gradient-to-br from-rose-500 to-pink-600",
      delay: 0.35
    },
    {
      title: "Ketamine Journal",
      description: "Guided self-exploration and reflection space",
      icon: <BrainCircuit className="w-6 h-6" />,
      to: "/ketamine",
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      delay: 0.4
    },
    {
      title: "Anxiety Tracker",
      description: "Interactive body map for tracking anxiety",
      icon: <Activity className="w-6 h-6" />,
      to: "/anxiety",
      gradient: "bg-gradient-to-br from-teal-500 to-cyan-600",
      delay: 0.45
    }
  ];
  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Helmet>
        <title>Matthew's Playbook</title>
        <meta name="description" content="Your personal development companion." />
      </Helmet>

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content - Mobile-first container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header with character */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white/5 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-white/10">
            {/* Character image */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-xl" />
              <img
                src={matthewSmile}
                alt="Matthew"
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/20 shadow-2xl object-cover"
              />
            </motion.div>
            
            {/* Welcome text */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1 sm:mb-2">
                Hey Matthew! 👋
              </h1>
              <p className="text-base sm:text-lg text-white/80">
                What would you like to work on today?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature tiles grid - Mobile-first: 1 column, sm: 2 columns, lg: 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {features.map((feature, index) => (
            <DashboardTile
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              to={feature.to}
              gradient={feature.gradient}
              delay={feature.delay}
            />
          ))}
        </div>

        {/* Footer hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-white/50 text-sm">
            Tap any card to get started
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Wrapper components that use useNavigate
const PlaybookWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scenario = location.state?.scenario;
  const plan = location.state?.plan;
  
  return <ResiliencePlaybook plan={plan || (scenario ? { scenario, answers: {} } : null)} onBack={() => navigate('/')} />;
};

const LibraryWrapper = () => {
  const navigate = useNavigate();
  
  const handleSelectPlan = (planId) => {
    const plan = getPlanFromLibrary(planId);
    if (plan) {
      navigate('/playbook', { state: { plan } });
    }
  };
  
  return <PlaybookLibrary onSelectPlan={handleSelectPlan} onBack={() => navigate('/')} />;
};

const ExcuseReframerWrapper = () => {
  const navigate = useNavigate();
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ExcuseReframerAdvanced onBack={() => navigate('/')} />
    </React.Suspense>
  );
};

const KetamineJournalWrapper = () => {
  const navigate = useNavigate();
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <KetamineJournalAdvanced onBack={() => navigate('/')} />
    </React.Suspense>
  );
};

const AchievementsWrapper = () => {
  const navigate = useNavigate();
  return <Achievements onBack={() => navigate('/')} />;
};

const YardageBookWrapper = () => {
  const navigate = useNavigate();
  return <YardageBook onBack={() => navigate('/')} />;
};

const HealthDashboardWrapper = () => {
  const navigate = useNavigate();
  return <EnhancedHealthDashboard onBack={() => navigate('/')} />;
};

const AnxietyTrackerWrapper = () => {
  const navigate = useNavigate();
  return <AnxietyTrackerRedesigned onBack={() => navigate('/')} />;
};

const App = () => {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    if (!apiKey) {
      console.error("VITE_PERPLEXITY_API_KEY is not set. Please add it to your .env file.");
    } else {
      initializePerplexity(apiKey);
    }
    updateStreak();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/playbook" element={<PlaybookWrapper />} />
          <Route path="/library" element={<LibraryWrapper />} />
          <Route path="/achievements" element={<AchievementsWrapper />} />
          <Route path="/reframe" element={<ExcuseReframerWrapper />} />
          <Route path="/yardage" element={<YardageBookWrapper />} />
          <Route path="/health" element={<HealthDashboardWrapper />} />
          <Route path="/ketamine" element={<KetamineJournalWrapper />} />
          <Route path="/anxiety" element={<AnxietyTrackerWrapper />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
