import React, { useState, useEffect } from 'react';
import ExcuseReframe from '@/ExcuseReframe';
import YardageBook from '@/YardageBook';
import ResiliencePlaybook from '@/components/ResiliencePlaybook';
import PlaybookLibrary from '@/components/PlaybookLibrary';
import Achievements from '@/components/Achievements';
import EnhancedHealthDashboard from '@/components/EnhancedHealthDashboard';
import AnxietyTracker from '@/components/AnxietyTracker';
import NewAnxietyTracker from '@/components/NewAnxietyTracker';
import AISuggestion from '@/components/AISuggestion';
import { getPlanFromLibrary } from '@/utils/planLibraryStorage';
import { updateStreak } from '@/utils/gamificationStorage';
import { Helmet } from 'react-helmet';
import { Toaster } from "@/components/ui/toaster";
import { initializeGemini } from '@/utils/gemini';
import { motion } from 'framer-motion';
import { BookOpen, MessageSquare as MessageSquareQuote, Gavel as Golf, Library, Trophy, Heart, BrainCircuit, Activity } from 'lucide-react';
import KetamineTherapy from '@/components/KetamineTherapy';

const DashboardTile = ({
  title,
  description,
  icon,
  onClick,
  className
}) => (
  <motion.div
    onClick={onClick}
    className={`relative overflow-hidden rounded-2xl p-6 shadow-2xl cursor-pointer group ${className}`}
    whileHover={{ scale: 1.03, y: -5 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
  >
    <div className="relative z-10 flex flex-col justify-between h-full">
      <div>
        <div className="p-3 bg-white/20 rounded-full w-14 h-14 flex items-center justify-center mb-4 border border-white/30">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-white/80">{description}</p>
      </div>
      <div className="mt-6 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Open &rarr;
      </div>
    </div>
    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
  </motion.div>
);

const Dashboard = ({ onSelect, onSelectScenario }) => (
  <div
    className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 text-white"
    style={{
      backgroundImage: "url('https://horizons-cdn.hostinger.com/2ede1032-5057-4306-b7a4-16441876e852/8ba7f2dee73ececf10b1908d56ce953d.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="absolute inset-0 bg-black/40"></div>
    <Helmet>
      <title>Matthew's Playbook</title>
      <meta name="description" content="Welcome to Matthew's personal development playbook dashboard." />
      <meta property="og:title" content="Matthew's Playbook" />
      <meta property="og:description" content="Welcome to Matthew's personal development playbook dashboard." />
    </Helmet>
    <div className="relative z-10 text-center mb-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4"
      >
        Matthew's Playbook
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-white/80"
      >
        Your space for mental clarity and resilience.
        <br />
        Pick where you would like to start.
      </motion.p>
    </div>
    
    <motion.div
      className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.2, delayChildren: 0.4 } },
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

const AppFixed = () => {
  const [view, setView] = useState('dashboard');
  const [loadedPlan, setLoadedPlan] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("VITE_GEMINI_API_KEY is not set. Please add it to your .env file.");
    } else {
      initializeGemini(apiKey);
    }
    updateStreak();
  }, []);

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
      {view === 'reframe' && <ExcuseReframe onNext={handleBackToDashboard} />}
      {view === 'yardage' && <YardageBook onBack={handleBackToDashboard} />}
      {view === 'playbook' && <ResiliencePlaybook plan={loadedPlan} onBack={handleBackToDashboard} />}
      {view === 'library' && <PlaybookLibrary onSelectPlan={handleSelectPlan} onBack={handleBackToDashboard} />}
      {view === 'achievements' && <Achievements onBack={handleBackToDashboard} />}
      {view === 'health' && <EnhancedHealthDashboard onBack={handleBackToDashboard} />}
        
      {view === 'ketamine' && <KetamineTherapy onBack={handleBackToDashboard} />}
      {view === 'anxiety' && <NewAnxietyTracker onBack={handleBackToDashboard} />}
      <Toaster />
    </div>
  );
};

export default AppFixed;
