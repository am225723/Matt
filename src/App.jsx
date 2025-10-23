import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const Dashboard = () => (
  <div
    className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 text-white"
    style={{ backgroundColor: '#1a202c' }}
  >
    <div className="relative z-10 text-center mb-12">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
        Matthew's Playbook
      </h1>
      <p className="text-lg md:text-xl text-white/80">
        Your space for mental clarity and resilience.
      </p>
    </div>
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
      <div className="relative overflow-hidden rounded-2xl p-6 shadow-2xl bg-blue-500/30">
        <div className="p-3 bg-white/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Resilience Playbook</h2>
        <p className="text-white/80">Build strategies for challenging situations.</p>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Dashboard />
    </div>
  );
};

export default App;
