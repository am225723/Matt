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
import matthewAvatar from '@/assets/images/matthew-avatar.jpg';

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
        
        {/* Sophisticated Header with Character */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 sm:mb-10"
        >
          {/* Main title card */}
          <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 p-6 sm:p-8 lg:p-10 shadow-2xl">
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.3) 50%, rgba(236, 72, 153, 0.3) 100%)",
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8">
              {/* Character avatar */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="relative"
              >
                {/* Outer glow ring */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full blur-2xl opacity-60 scale-110" />
                
                {/* Rotating gradient ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                    padding: "3px",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full rounded-full bg-slate-900" />
                </motion.div>
                
                {/* Avatar image */}
                <img
                  src={matthewAvatar}
                  alt="Matthew"
                  className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-white/30 shadow-2xl object-cover"
                />
                
                {/* Sparkle effect */}
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ✨
                </motion.div>
              </motion.div>
              
              {/* Title section */}
              <div className="text-center space-y-3 sm:space-y-4">
                {/* Main title with gradient and effects */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <h1 className="relative inline-block">
                    {/* Glow effect behind text */}
                    <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50" aria-hidden="true">
                      Matthew's Playbook
                    </span>
                    
                    {/* Main text */}
                    <span className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                      <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl">
                        Matthew's Playbook
                      </span>
                    </span>
                    
                    {/* Animated shimmer overlay */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                      animate={{
                        x: ['-200%', '200%'],
                        opacity: [0, 0.3, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut"
                      }}
                      style={{
                        backgroundSize: '50% 100%',
                      }}
                    />
                  </h1>
                </motion.div>
                
                {/* Subtitle with elegant styling */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light tracking-wide"
                >
                  <span className="inline-block">Your Personal Journey to</span>{' '}
                  <span className="font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Mental Clarity & Resilience
                  </span>
                </motion.p>
                
                {/* Decorative divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="mx-auto w-32 sm:w-40 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
                />
                
                {/* Call to action */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  className="text-sm sm:text-base text-white/70 font-light italic"
                >
                  Choose your path below
                </motion.p>
              </div>
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
