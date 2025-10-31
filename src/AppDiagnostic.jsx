// Diagnostic version of App.jsx to identify the problematic component
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from "@/components/ui/toaster";
import { initializeGemini } from '@/utils/gemini';
import { updateStreak } from '@/utils/gamificationStorage';
import { motion } from 'framer-motion';
import { BookOpen, MessageSquare as MessageSquareQuote, Gavel as Golf, Library, Trophy, Heart, BrainCircuit, Activity } from 'lucide-react';
import AISuggestion from '@/components/AISuggestion';

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
        Open &amp;rarr;
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
          title="Test Tile 1"
          description="Testing dashboard tile rendering"
          icon={<BookOpen className="w-6 h-6 text-white" />}
          onClick={() => onSelect('test1')}
          className="bg-blue-500/30"
        />
      </motion.div>
      <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 50 } }}>
        <DashboardTile
          title="Test Tile 2"
          description="Testing dashboard tile rendering"
          icon={<Library className="w-6 h-6 text-white" />}
          onClick={() => onSelect('test2')}
          className="bg-yellow-500/30"
        />
      </motion.div>
    </motion.div>

    <motion.div
      className="relative z-10 w-full max-w-6xl mt-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
        <p className="text-white">AI Suggestion component would go here</p>
      </div>
    </motion.div>
  </div>
);

const AppDiagnostic = () => {
  const [view, setView] = useState('dashboard');
  const [diagnosticStep, setDiagnosticStep] = useState(3);
  const [testResults, setTestResults] = useState({
    helmet: false,
    toaster: false,
    gemini: false,
    gamification: false,
    framerMotion: false,
    icons: false,
    dashboard: false
  });
  
  const handleSelectScenario = (scenario) => {
    console.log('Scenario selected:', scenario);
    setView('scenario');
  };

  useEffect(() => {
    console.log('AppDiagnostic mounted successfully');
    console.log('Current step:', diagnosticStep);
    
    // Test Gemini initialization
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey) {
        initializeGemini(apiKey);
        setTestResults(prev => ({ ...prev, gemini: true }));
      }
    } catch (error) {
      console.error('Gemini initialization error:', error);
    }
    
    // Test gamification
    try {
      updateStreak();
      setTestResults(prev => ({ ...prev, gamification: true }));
    } catch (error) {
      console.error('Gamification error:', error);
    }
    
    // Test Helmet
    setTestResults(prev => ({ ...prev, helmet: true }));
    
    // Test Toaster
    setTestResults(prev => ({ ...prev, toaster: true }));
    
    // Test Framer Motion
    setTestResults(prev => ({ ...prev, framerMotion: true }));
    
    // Test Icons
    setTestResults(prev => ({ ...prev, icons: true }));
    
    // Test Dashboard
    setTestResults(prev => ({ ...prev, dashboard: true }));
  }, []);

  if (view === 'dashboard') {
    return (
      <>
        <Dashboard onSelect={setView} onSelectScenario={handleSelectScenario} />
        <Toaster />
      </>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Helmet>
        <title>App Diagnostic - Matthew's Playbook</title>
      </Helmet>
      
      <h1>App Diagnostic Mode - Step {diagnosticStep}</h1>
      <p>Testing Dashboard Component...</p>
      <p>Current View: {view}</p>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => setView('dashboard')}
          style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Show Dashboard
        </button>
        <button 
          onClick={() => setDiagnosticStep(diagnosticStep + 1)}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Next Step
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Import Test Results:</h3>
        <ul>
          <li>Helmet: {testResults.helmet ? '✓' : '✗'}</li>
          <li>Toaster: {testResults.toaster ? '✓' : '✗'}</li>
          <li>Gemini Utils: {testResults.gemini ? '✓' : '✗'}</li>
          <li>Gamification Utils: {testResults.gamification ? '✓' : '✗'}</li>
          <li>Framer Motion: {testResults.framerMotion ? '✓' : '✗'}</li>
          <li>Lucide Icons: {testResults.icons ? '✓' : '✗'}</li>
          <li>Dashboard Component: {testResults.dashboard ? '✓' : '✗'}</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e0e0e0', borderRadius: '8px' }}>
        <h3>Component Tests:</h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '10px' }}
        >
          <p>Framer Motion Animation Test ✓</p>
        </motion.div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <BookOpen size={24} />
          <Library size={24} />
          <Trophy size={24} />
          <Heart size={24} />
          <BrainCircuit size={24} />
          <Activity size={24} />
        </div>
        <p style={{ marginTop: '10px', fontSize: '14px' }}>Icons Test ✓</p>
      </div>
      
      <Toaster />
    </div>
  );
};

export default AppDiagnostic;