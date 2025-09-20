import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ step, total, progressPct }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-white/80">
          Step {step} of {total}
        </span>
        <span className="text-sm text-white/80">
          {Math.round(progressPct)}% Complete
        </span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}