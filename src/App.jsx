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
import { BookOpen, MessageSquare as MessageSquareQuote, Gavel as Golf, Library, Trophy, Heart, BrainCircuit, Activity, FileSignature, TrendingDown, Compass } from 'lucide-react';
import KetamineTherapyRedesigned from '@/components/KetamineTherapyRedesigned';
import ResignationProtocol from '@/components/ResignationProtocol';
import WorryROI from '@/components/WorryROI';
import NorthStar from '@/components/NorthStar';
import InstallPrompt from '@/components/InstallPrompt';

// Import advanced components (lazy loaded to prevent blocking)
const ExcuseReframerAdvanced = React.lazy(() => import('@/components/ExcuseReframerAdvanced'));
const KetamineJournalAdvanced = React.lazy(() => import('@/components/KetamineJournalAdvanced'));

// Import character images
import matthewAvatar from '@/assets/images/matthew-main.png';
import featurePlaybook from '@/assets/images/feature-playbook.png';
import featureLibrary from '@/assets/images/feature-library.png';
import featureAchievements from '@/assets/images/feature-achievements.png';
import featureReframer from '@/assets/images/feature-reframer.png';
import featureYardage from '@/assets/images/feature-yardage.png';
import featureHealth from '@/assets/images/feature-health.png';
import featureKetamine from '@/assets/images/feature-ketamine.png';
import featureAnxiety from '@/assets/images/feature-anxiety.png';
import featureResignation from '@/assets/images/feature-resignation.png';
import featureWorryROI from '@/assets/images/feature-worry-roi.png';

// Sophisticated Mobile-First Tile Component with Large Character Images
const DashboardTile = ({ title, description, icon, to, gradient, delay, image }) => (
  <Link to={to} className="block w-full">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer h-52 sm:h-56"
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
      <div className="relative h-full p-4 flex items-stretch gap-3">
        {/* Character Image - Full Height */}
        {image && (
          <motion.div
            className="relative flex-shrink-0 w-32 sm:w-36"
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src={image}
              alt={title}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>
        )}
        
        {/* Text Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center py-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight leading-tight">
            {title}
          </h3>
          <p className="text-white/90 text-sm sm:text-base line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Arrow */}
        <div className="flex-shrink-0 self-center text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all">
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
      title: "North Star Goals",
      description: "Define your vision and get AI-powered SMART goal roadmaps",
      icon: <Compass className="w-6 h-6" />,
      to: "/north-star",
      gradient: "bg-gradient-to-br from-indigo-600 to-purple-700",
      image: featurePlaybook,
      delay: 0.1
    },
    {
      title: "Resilience Playbook",
      description: "Build step-by-step strategies for challenging situations",
      icon: <BookOpen className="w-6 h-6" />,
      to: "/playbook",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      image: featurePlaybook,
      delay: 0.15
    },
    {
      title: "Playbook Library",
      description: "Review and manage your saved playbooks",
      icon: <Library className="w-6 h-6" />,
      to: "/library",
      gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
      image: featureLibrary,
      delay: 0.15
    },
    {
      title: "Achievements",
      description: "Track your progress and view earned badges",
      icon: <Trophy className="w-6 h-6" />,
      to: "/achievements",
      gradient: "bg-gradient-to-br from-yellow-500 to-amber-600",
      image: featureAchievements,
      delay: 0.2
    },
    {
      title: "Excuse Reframing",
      description: "Transform limiting beliefs with AI assistance",
      icon: <MessageSquareQuote className="w-6 h-6" />,
      to: "/reframe",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
      image: featureReframer,
      delay: 0.25
    },
    {
      title: "Ryder Cup Yardage Book",
      description: "Your personal caddie for the Ryder Cup",
      icon: <Golf className="w-6 h-6" />,
      to: "/yardage",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
      image: featureYardage,
      delay: 0.3
    },
    {
      title: "Health Dashboard",
      description: "AI-powered health insights and tracking",
      icon: <Heart className="w-6 h-6" />,
      to: "/health",
      gradient: "bg-gradient-to-br from-rose-500 to-pink-600",
      image: featureHealth,
      delay: 0.35
    },
    {
      title: "Ketamine Journal",
      description: "Guided self-exploration and reflection space",
      icon: <BrainCircuit className="w-6 h-6" />,
      to: "/ketamine",
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      image: featureKetamine,
      delay: 0.4
    },
    {
      title: "Anxiety Tracker",
      description: "Interactive body map for tracking anxiety",
      icon: <Activity className="w-6 h-6" />,
      to: "/anxiety",
      gradient: "bg-gradient-to-br from-teal-500 to-cyan-600",
      image: featureAnxiety,
      delay: 0.45
    },
    {
      title: "Resignation Protocol",
      description: "Formally resign from unpaid emotional roles you never signed up for",
      icon: <FileSignature className="w-6 h-6" />,
      to: "/resignation",
      gradient: "bg-gradient-to-br from-amber-600 to-orange-700",
      image: featureResignation,
      delay: 0.5
    },
    {
      title: "Worry ROI",
      description: "Prove that worry is a toxic asset class with zero returns",
      icon: <TrendingDown className="w-6 h-6" />,
      to: "/worry-roi",
      gradient: "bg-gradient-to-br from-slate-700 to-slate-900",
      image: featureWorryROI,
      delay: 0.6
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
        
        {/* Sophisticated Horizontal Header with Character */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 sm:mb-10"
        >
          {/* Main title card - Horizontal layout */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 p-6 sm:p-8 shadow-2xl">
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
            
            {/* Content - Horizontal flex layout */}
            <div className="relative z-10 flex flex-col sm:flex-row items-stretch gap-6 sm:gap-8 min-h-[200px] sm:min-h-[250px]">
              {/* Character avatar on the side - Full div height */}
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="relative flex-shrink-0 flex items-center justify-center"
              >
                {/* Glow effect behind character */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/40 via-purple-400/40 to-pink-400/40 blur-2xl" />
                
                {/* Character image - fills full height of header div */}
                <img
                  src={matthewAvatar}
                  alt="Matthew"
                  className="relative h-[200px] sm:h-[250px] w-auto object-contain drop-shadow-2xl"
                />
                
                {/* Sparkle effect */}
                <motion.div
                  className="absolute top-2 right-2 w-8 h-8 text-yellow-400 text-2xl"
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
              
              {/* Title section - flex-1 to take remaining space */}
              <div className="flex-1 text-center space-y-3 sm:space-y-4">
                {/* Decorative flourish top */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="hidden sm:flex items-center gap-2 justify-center"
                >
                  <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold-400/50 to-gold-400/20" />
                  <span className="text-gold-400/60 text-2xl">✦</span>
                  <div className="h-px w-20 bg-gradient-to-l from-transparent via-gold-400/50 to-gold-400/20" />
                </motion.div>
                
                {/* Main title with calligraphy font */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <h1 className="relative inline-block">
                    {/* Multiple glow layers for depth */}
                    <span className="absolute inset-0 blur-3xl bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 opacity-40" aria-hidden="true">
                      Matthew's Playbook
                    </span>
                    <span className="absolute inset-0 blur-xl bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 opacity-30" aria-hidden="true">
                      Matthew's Playbook
                    </span>
                    
                    {/* Main title text */}
                    <span className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide font-bold">
                      <span className="bg-gradient-to-r from-amber-100 via-rose-100 to-purple-100 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(251,191,36,0.4)]">
                        Matthew's Playbook
                      </span>
                    </span>
                    
                    {/* Animated shimmer overlay */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                      animate={{
                        x: ['-200%', '200%'],
                        opacity: [0, 0.4, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut"
                      }}
                    />
                  </h1>
                </motion.div>
                
                {/* Decorative divider */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.65, duration: 0.6 }}
                  className="flex items-center gap-3 justify-center"
                >
                  <span className="text-amber-400/40 text-sm">◆</span>
                  <div className="h-px w-16 bg-gradient-to-r from-amber-400/40 via-amber-400/20 to-transparent" />
                  <span className="text-amber-400/40 text-sm">◆</span>
                  <div className="h-px w-16 bg-gradient-to-l from-amber-400/40 via-amber-400/20 to-transparent" />
                  <span className="text-amber-400/40 text-sm">◆</span>
                </motion.div>
                
                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75, duration: 0.8 }}
                  className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 tracking-wide leading-relaxed"
                >
                  <span className="inline-block italic">Your Personal Journey to</span>{' '}
                  <span className="font-bold bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 bg-clip-text text-transparent">
                    Mental Clarity & Resilience
                  </span>
                </motion.p>
                
                {/* Decorative bottom flourish */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="flex items-center gap-2 text-xs sm:text-sm text-amber-200/60 italic justify-center"
                >
                  <span className="text-amber-400/40">✧</span>
                  <span>Choose your path below</span>
                  <span className="text-amber-400/40">✧</span>
                </motion.div>
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
              image={feature.image}
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

const ResignationProtocolWrapper = () => {
  const navigate = useNavigate();
  return <ResignationProtocol onBack={() => navigate('/')} />;
};

const WorryROIWrapper = () => {
  const navigate = useNavigate();
  return <WorryROI onBack={() => navigate('/')} />;
};

const NorthStarWrapper = () => {
  const navigate = useNavigate();
  return <NorthStar onBack={() => navigate('/')} />;
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
          <Route path="/resignation" element={<ResignationProtocolWrapper />} />
          <Route path="/worry-roi" element={<WorryROIWrapper />} />
          <Route path="/north-star" element={<NorthStarWrapper />} />
        </Routes>
        <Toaster />
        <InstallPrompt />
      </div>
    </Router>
  );
};

export default App;
