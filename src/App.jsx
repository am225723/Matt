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
import matthewPhoto from '@/assets/images/matthew-photo.jpg';

// Interactive Feature Bubble Component
const FeatureBubble = ({ title, description, icon, to, delay, position }) => (
  <Link to={to} className="block absolute" style={{ ...position }}>
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        delay,
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.15,
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
      className="group relative"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
      
      {/* Bubble */}
      <div className="relative bg-white rounded-full p-6 shadow-2xl border-4 border-blue-100 group-hover:border-blue-300 transition-all duration-300 w-32 h-32 flex flex-col items-center justify-center">
        <div className="text-blue-600 mb-2 transform group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <p className="text-xs font-bold text-gray-800 text-center leading-tight">{title}</p>
      </div>
      
      {/* Tooltip on hover */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-4 py-2 bg-white rounded-lg shadow-xl border-2 border-blue-200 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
      >
        <p className="text-xs text-gray-700 text-center">{description}</p>
      </motion.div>
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
      title: "Playbook",
      description: "Build strategies for challenging situations",
      icon: <BookOpen className="w-8 h-8" />,
      to: "/playbook",
      position: { top: '10%', left: '15%' },
      delay: 0.2
    },
    {
      title: "Library",
      description: "Review saved resilience playbooks",
      icon: <Library className="w-8 h-8" />,
      to: "/library",
      position: { top: '5%', left: '45%' },
      delay: 0.3
    },
    {
      title: "Achievements",
      description: "Track progress and earned badges",
      icon: <Trophy className="w-8 h-8" />,
      to: "/achievements",
      position: { top: '15%', right: '15%' },
      delay: 0.4
    },
    {
      title: "Reframe",
      description: "Transform limiting beliefs with AI",
      icon: <MessageSquareQuote className="w-8 h-8" />,
      to: "/reframe",
      position: { top: '40%', left: '8%' },
      delay: 0.5
    },
    {
      title: "Yardage",
      description: "Navigate the Ryder Cup with intention",
      icon: <Golf className="w-8 h-8" />,
      to: "/yardage",
      position: { top: '40%', right: '8%' },
      delay: 0.6
    },
    {
      title: "Health",
      description: "AI-powered health insights",
      icon: <Heart className="w-8 h-8" />,
      to: "/health",
      position: { bottom: '20%', left: '12%' },
      delay: 0.7
    },
    {
      title: "Journal",
      description: "Guided self-exploration space",
      icon: <BrainCircuit className="w-8 h-8" />,
      to: "/ketamine",
      position: { bottom: '15%', left: '42%' },
      delay: 0.8
    },
    {
      title: "Anxiety",
      description: "Interactive body map tracker",
      icon: <Activity className="w-8 h-8" />,
      to: "/anxiety",
      position: { bottom: '20%', right: '12%' },
      delay: 0.9
    }
  ];
  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <Helmet>
        <title>Matthew's Playbook</title>
        <meta name="description" content="Your personal development companion." />
      </Helmet>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 mb-4">
            Welcome, Matthew
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light">
            What would you like to work on today?
          </p>
        </motion.div>

        {/* Character with thought bubbles */}
        <div className="relative w-full max-w-6xl h-[600px] flex items-center justify-center">
          {/* Central character image */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className="relative z-20"
          >
            <div className="relative">
              {/* Glow effect behind character */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300/40 to-purple-300/40 rounded-full blur-2xl transform scale-110" />
              
              {/* Character image */}
              <img
                src={matthewCharacter}
                alt="Matthew"
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-white shadow-2xl object-cover"
              />
              
              {/* Pulsing ring animation */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-blue-400/50"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.2, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>

          {/* Feature bubbles positioned around character */}
          {features.map((feature, index) => (
            <FeatureBubble
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              to={feature.to}
              position={feature.position}
              delay={feature.delay}
            />
          ))}
        </div>

        {/* Helper text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-lg font-light mb-2">
            Click any bubble to get started
          </p>
          <p className="text-gray-400 text-sm">
            Hover over each option to learn more
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
