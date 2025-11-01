import React, { useState, useEffect } from 'react';
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

const DashboardTile = ({
  title,
  description,
  icon,
  onClick,
  className
}) => (
  <motion.div
    onClick={onClick}
    className={`relative overflow-hidden rounded-3xl cursor-pointer group h-72 ${className}`}
    whileHover={{ 
      scale: 1.05, 
      y: -8,
    }}
    whileTap={{ scale: 0.97 }}
    transition={{ 
      type: "spring", 
      stiffness: 400, 
      damping: 25,
    }}
  >
    {/* Glass morphism card */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl group-hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-500" />
    
    {/* Animated gradient background */}
    <motion.div 
      className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
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
    
    {/* Shimmer effect */}
    <motion.div
      className="absolute inset-0 opacity-0 group-hover:opacity-100"
      style={{
        background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
        backgroundSize: "200% 200%",
      }}
      animate={{
        backgroundPosition: ['-200% -200%', '200% 200%'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    
    {/* Content */}
    <div className="relative z-10 flex flex-col justify-between h-full p-8">
      <div>
        {/* Icon container with enhanced glow */}
        <motion.div 
          className="relative mb-6 w-fit"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 scale-110" />
          <div className="relative p-5 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl w-24 h-24 flex items-center justify-center border border-white/30 shadow-xl backdrop-blur-md">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="transform scale-150"
            >
              {icon}
            </motion.div>
          </div>
        </motion.div>
        
        {/* Title with gradient */}
        <h2 className="text-2xl font-bold text-white mb-3 tracking-tight leading-tight group-hover:tracking-wide transition-all duration-300">
          <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
            {title}
          </span>
        </h2>
        
        {/* Description */}
        <p className="text-white/90 text-sm leading-relaxed font-light tracking-wide">
          {description}
        </p>
      </div>
      
      {/* Call to action */}
      <motion.div 
        className="flex items-center gap-2 text-white/80 group-hover:text-white font-semibold text-base"
        initial={{ opacity: 0, x: -10 }}
        whileHover={{ x: 5 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ 
          opacity: { duration: 2, repeat: Infinity },
          x: { type: "spring", stiffness: 300 }
        }}
      >
        <span>Explore</span>
        <motion.svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </motion.div>
    </div>
    
    {/* Subtle top highlight */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
  </motion.div>
);

const Dashboard = ({ onSelect, onSelectScenario }) => (
  <div
    className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 text-white overflow-hidden"
    style={{
      backgroundImage: 'url(https://efgtznvrnzqcxmfmjuue.supabase.co/storage/v1/object/public/bg-playbook/bg-main.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    {/* Enhanced gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>
    
    {/* Animated floating orbs for depth */}
    <motion.div
      className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
      animate={{
        x: [0, 50, 0],
        y: [0, 30, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div
      className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
      animate={{
        x: [0, -50, 0],
        y: [0, -30, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div
      className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
      animate={{
        x: [-50, 50, -50],
        y: [-30, 30, -30],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <Helmet>
      <title>Matthew's Playbook</title>
      <meta name="description" content="Welcome to Matthew's personal development playbook dashboard." />
      <meta property="og:title" content="Matthew's Playbook" />
      <meta property="og:description" content="Welcome to Matthew's personal development playbook dashboard." />
    </Helmet>
    <div className="relative z-10 text-center mb-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-6"
      >
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-2">
          <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Matthew's Playbook
          </span>
        </h1>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full" />
        <p className="relative text-lg md:text-xl lg:text-2xl text-white/90 font-light leading-relaxed tracking-wide">
          Your space for mental clarity and resilience.
          <br />
          <span className="text-white/70">Pick where you would like to start.</span>
        </p>
      </motion.div>
    </div>
    
    <motion.div
      className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-7xl px-4"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
      }}
    >
      <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 50 } }}>
        <DashboardTile
          title="Resilience Playbook"
          description="Build a new step-by-step strategy for challenging situations."
          icon={<BookOpen className="w-6 h-6 text-white" />}
          onClick={() => onSelect('playbook')}
          className="bg-blue-500/30"
        />
      </motion.div>
      <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 50 } }}>
        <DashboardTile
          title="Playbook Library"
          description="Review and manage your saved resilience playbooks."
          icon={<Library className="w-6 h-6 text-white" />}
          onClick={() => onSelect('library')}
          className="bg-yellow-500/30"
        />
      </motion.div>
      <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 50 } }}>
        <DashboardTile
          title="Achievements"
          description="Track your progress and view your earned badges."
          icon={<Trophy className="w-6 h-6 text-white" />}
          onClick={() => onSelect('achievements')}
          className="bg-red-500/30"
        />
      </motion.div>
      <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 50 } }}>
        <DashboardTile
          title="Excuse Reframing"
          description="Transform limiting beliefs into empowering perspectives with AI."
          icon={<MessageSquareQuote className="w-6 h-6 text-white" />}
          onClick={() => onSelect('reframe')}
          className="bg-purple-500/30"
        />
      </motion.div>
      <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 50 } }}>
        <DashboardTile
          title="Ryder Cup Yardage Book"
          description="Your personal caddie to navigate the Ryder Cup with intention."
          icon={<Golf className="w-6 h-6 text-white" />}
          onClick={() => onSelect('yardage')}
          className="bg-green-500/30"
        />
      </motion.div>
      <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 50 } }}>
        <DashboardTile
            title="Enhanced Health Dashboard"
            description="AI-powered health insights with real-time tracking, advanced analytics, and personalized recommendations."
          icon={<Heart className="w-6 h-6 text-white" />}
          onClick={() => onSelect('health')}
          className="bg-cyan-500/40"
        />
      </motion.div>
      <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 50 } }}>
        <DashboardTile
          title="Ketamine Journal"
          description="A space for reflection and guided self-exploration."
          icon={<BrainCircuit className="w-6 h-6 text-white" />}
          onClick={() => onSelect('ketamine')}
          className="bg-indigo-500/30"
        />
      </motion.div>
      <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 50 } }}>
        <DashboardTile
          title="Anxiety Tracker"
          description="Track and manage anxiety symptoms and patterns with an interactive body map."
          icon={<Activity className="w-6 h-6 text-white" />}
          onClick={() => onSelect('anxiety')}
          className="bg-teal-500/30"
        />
      </motion.div>
    </motion.div>

    <motion.div
      className="relative z-10 w-full max-w-6xl mt-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <AISuggestion onSelectScenario={onSelectScenario} />
    </motion.div>
  </div>
);

const App = () => {
  const [view, setView] = useState('dashboard');
  const [loadedPlan, setLoadedPlan] = useState(null);

  // --- FIXED SECTION ---
  useEffect(() => {
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY; // <-- Use Perplexity Key
    if (!apiKey) {
      console.error("VITE_PERPLEXITY_API_KEY is not set. Please add it to your .env file.");
    } else {
      initializePerplexity(apiKey); // <-- Initialize Perplexity
    }
    updateStreak();
  }, []);
  // --- END FIXED SECTION ---

  const handleSelectPlan = (planId) => {
    const plan = getPlanFromLibrary(planId);
    if (plan) {
      setLoadedPlan(plan);
      setView('playbook');
    }
  };

  const handleSelectScenario = (scenario) => {
    setLoadedPlan({ scenario, answers: {} });
    setView('playbook');
  };

  const handleBackToDashboard = () => {
    setLoadedPlan(null);
    setView('dashboard');
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {view === 'dashboard' && <Dashboard onSelect={setView} onSelectScenario={handleSelectScenario} />}
      {view === 'reframe' && (
        <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <ExcuseReframerAdvanced onBack={handleBackToDashboard} />
        </React.Suspense>
      )}
      {view === 'yardage' && <YardageBook onBack={handleBackToDashboard} />}
      {view === 'playbook' && <ResiliencePlaybook plan={loadedPlan} onBack={handleBackToDashboard} />}
      {view === 'library' && <PlaybookLibrary onSelectPlan={handleSelectPlan} onBack={handleBackToDashboard} />}
      {view === 'achievements' && <Achievements onBack={handleBackToDashboard} />}
      {view === 'health' && <EnhancedHealthDashboard onBack={handleBackToDashboard} />}
      {view === 'ketamine' && (
        <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <KetamineJournalAdvanced onBack={handleBackToDashboard} />
        </React.Suspense>
      )}
      {view === 'anxiety' && <AnxietyTrackerRedesigned onBack={handleBackToDashboard} />}
      <Toaster />
    </div>
  );
};

export default App;
