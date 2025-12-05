import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  TrendingDown, ArrowLeft, DollarSign, Clock, Activity, AlertTriangle,
  Check, X, Zap, Moon, Gamepad2, Code, Music, Dog, FileText, 
  BarChart3, PieChart, Briefcase, Flame, Target, RefreshCw,
  ChevronDown, Plus, Minus, ArrowUpRight, ArrowDownRight, Wallet,
  Scale, Brain, Loader2, Sparkles, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const playClickSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {}
};

const playStampSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  } catch (e) {}
};

const playSuccessSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, audioContext.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3);
      osc.start(audioContext.currentTime + i * 0.1);
      osc.stop(audioContext.currentTime + i * 0.1 + 0.3);
    });
  } catch (e) {}
};

const TICKER_SUGGESTIONS = ['$FIRED', '$MOM', '$HEALTH', '$MONEY', '$FUTURE', '$MISTAKE', '$DEADLINE', '$SOCIAL', '$FAILURE'];

const LIFE_ACTIVITIES = [
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'from-purple-500 to-purple-700' },
  { id: 'coding', label: 'Coding', icon: Code, color: 'from-blue-500 to-blue-700' },
  { id: 'walking', label: 'Walking', icon: Dog, color: 'from-green-500 to-green-700' },
  { id: 'sleep', label: 'Sleep', icon: Moon, color: 'from-indigo-500 to-indigo-700' },
  { id: 'music', label: 'Music', icon: Music, color: 'from-pink-500 to-pink-700' },
];

const CircularDial = ({ value, onChange, max = 240, label }) => {
  const dialRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDrag = useCallback((e) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    let degrees = (angle * 180 / Math.PI + 90 + 360) % 360;
    const newValue = Math.round((degrees / 360) * max);
    onChange(Math.min(max, Math.max(0, newValue)));
    playClickSound();
  }, [max, onChange]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleDrag(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      onChange(Math.min(max, value + 5));
      playClickSound();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onChange(Math.max(0, value - 5));
      playClickSound();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) handleDrag(e);
    };
    const handleMouseUp = () => setIsDragging(false);
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleDrag]);

  const rotation = (value / max) * 360;
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  const displayTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-slate-400 text-sm font-mono uppercase tracking-wider">{label}</p>
      <div
        ref={dialRef}
        className="relative w-36 h-36 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#dialGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(rotation / 360) * 283} 283`}
            transform="rotate(-90 50 50)"
          />
          <defs>
            <linearGradient id="dialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-b from-orange-400 to-red-500 rounded-full shadow-lg border-2 border-slate-800"
          style={{
            transformOrigin: '50% 68px',
            transform: `translateX(-50%) rotate(${rotation}deg)`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold text-white font-mono">{displayTime}</span>
          <span className="text-xs text-slate-500">invested</span>
        </div>
      </div>
    </div>
  );
};

const VolatilitySlider = ({ value, onChange }) => {
  const levels = ['Low', 'Medium', 'High', 'Panic'];
  const colors = ['#22c55e', '#eab308', '#f97316', '#ef4444'];
  
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      onChange(Math.min(3, value + 1));
      playClickSound();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onChange(Math.max(0, value - 1));
      playClickSound();
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-slate-400 text-sm font-mono uppercase tracking-wider">Emotional Volatility</p>
      <div 
        className="relative h-40 w-16 bg-slate-800/50 rounded-full border border-slate-700 overflow-hidden focus:outline-none focus:ring-2 focus:ring-orange-500"
        tabIndex={0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={value}
        aria-label="Emotional Volatility"
        onKeyDown={handleKeyDown}
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-b-full"
          style={{ backgroundColor: colors[value] }}
          animate={{ height: `${(value + 1) * 25}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        {levels.map((_, i) => (
          <button
            key={i}
            className="absolute left-0 right-0 h-1/4 hover:bg-white/5 transition-colors"
            style={{ bottom: `${i * 25}%` }}
            onClick={() => {
              onChange(i);
              playClickSound();
            }}
            aria-label={`Set volatility to ${levels[i]}`}
          />
        ))}
      </div>
      <span className="text-lg font-bold" style={{ color: colors[value] }}>
        {levels[value]}
      </span>
    </div>
  );
};

const CrashChart = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const points = [];
  for (let i = 0; i <= progress; i += 2) {
    const x = (i / 100) * 280 + 20;
    const crash = Math.pow(i / 100, 0.5);
    const noise = Math.sin(i * 0.5) * 5 + Math.sin(i * 0.3) * 3;
    const y = 30 + crash * 140 + noise;
    points.push(`${x},${y}`);
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute top-2 left-4 flex items-center gap-2">
        <ArrowDownRight className="w-5 h-5 text-red-500" />
        <span className="text-red-500 font-mono font-bold text-lg">-100%</span>
      </div>
      <svg viewBox="0 0 320 200" className="w-full h-48">
        <defs>
          <linearGradient id="crashGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="20" y1="30" x2="20" y2="180" stroke="#334155" strokeWidth="1" />
        <line x1="20" y1="180" x2="300" y2="180" stroke="#334155" strokeWidth="1" />
        {points.length > 1 && (
          <>
            <path
              d={`M ${points.join(' L ')} L ${300},180 L 20,180 Z`}
              fill="url(#crashGradient)"
            />
            <polyline
              points={points.join(' ')}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1]?.split(',')[0]}
            cy={points[points.length - 1]?.split(',')[1]}
            r="6"
            fill="#ef4444"
          >
            <animate attributeName="r" values="6;8;6" dur="0.5s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
      <div className="text-center text-slate-500 font-mono text-xs mt-2">
        TIME → ZERO RETURNS
      </div>
    </div>
  );
};

const BalanceSheet = ({ timeInvested, volatility }) => {
  const hours = Math.floor(timeInvested / 60);
  const minutes = timeInvested % 60;
  const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutes`;
  const volatilityLabels = ['Mild', 'Moderate', 'High', 'Extreme'];
  const energyCost = Math.round(timeInvested * (volatility + 1) * 1.5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
    >
      <div className="grid grid-cols-2 divide-x divide-slate-700">
        <div className="p-4">
          <h4 className="text-green-400 font-mono text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4" /> Assets (Returns)
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex justify-between">
              <span>Problems Solved:</span>
              <span className="text-red-400 font-mono">0</span>
            </li>
            <li className="flex justify-between">
              <span>Future Predicted:</span>
              <span className="text-red-400 font-mono">No</span>
            </li>
            <li className="flex justify-between">
              <span>Solutions Found:</span>
              <span className="text-red-400 font-mono">0</span>
            </li>
          </ul>
        </div>
        <div className="p-4">
          <h4 className="text-red-400 font-mono text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4" /> Liabilities (Costs)
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex justify-between">
              <span>Time Lost:</span>
              <span className="text-orange-400 font-mono">{timeDisplay}</span>
            </li>
            <li className="flex justify-between">
              <span>Cortisol Spike:</span>
              <span className="text-orange-400 font-mono">{volatilityLabels[volatility]}</span>
            </li>
            <li className="flex justify-between">
              <span>Sleep Quality:</span>
              <span className="text-orange-400 font-mono">Degraded</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-700 p-4 bg-slate-900/50">
        <div className="flex justify-between items-center">
          <span className="text-slate-300 font-mono font-bold">NET PROFIT:</span>
          <span className="text-3xl font-black text-red-500 font-mono">-{energyCost} EP</span>
        </div>
        <p className="text-slate-500 text-xs mt-1 text-right">Energy Points</p>
      </div>
    </motion.div>
  );
};

const ToxicAssetStamp = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      playStampSound();
    }, 300);
    const completeTimer = setTimeout(onComplete, 2000);
    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ scale: 3, opacity: 0, rotate: -30 }}
        animate={{ scale: 1, opacity: 1, rotate: -15 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
        className="relative"
      >
        <div className="bg-gradient-to-br from-red-600 to-red-800 px-12 py-8 rounded-lg border-4 border-red-400 shadow-2xl">
          <AlertTriangle className="w-16 h-16 text-red-100 mx-auto mb-4" />
          <h2 className="text-4xl font-black text-red-100 tracking-wider text-center">
            TOXIC ASSET
          </h2>
          <p className="text-red-200 text-center font-mono mt-2">DETECTED</p>
        </div>
        <motion.div
          className="absolute -inset-4 border-4 border-red-500/50 rounded-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
};

const ReallocationBubble = ({ activity, frozenFunds, onDrop, isDropTarget }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onDrop}
      className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${activity.color} flex flex-col items-center justify-center cursor-pointer shadow-lg border-2 ${isDropTarget ? 'border-green-400 shadow-green-400/50' : 'border-white/20'}`}
    >
      <activity.icon className="w-8 h-8 text-white mb-1" />
      <span className="text-white text-xs font-medium">{activity.label}</span>
      {isDropTarget && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-green-400"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

const FundsTransferredScreen = ({ activity, timeInvested, onNewAudit, onViewPortfolio }) => {
  useEffect(() => {
    playSuccessSound();
  }, []);

  const hours = Math.floor(timeInvested / 60);
  const minutes = timeInvested % 60;
  const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutes`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="mb-8"
      >
        <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${activity.color} flex items-center justify-center shadow-2xl`}>
          <activity.icon className="w-16 h-16 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-4xl font-black text-green-400 mb-4 tracking-wider">
          FUNDS TRANSFERRED
        </h2>
        <p className="text-slate-300 text-xl mb-2">
          {timeDisplay} reallocated to <span className="text-green-400 font-bold">{activity.label}</span>
        </p>
        <p className="text-slate-500 text-lg mb-8">
          The market is now <span className="text-red-400">CLOSED</span> on Worry
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button
          onClick={onNewAudit}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          New Audit
        </Button>
        <Button
          onClick={onViewPortfolio}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg"
        >
          <Briefcase className="w-5 h-5 mr-2" />
          View Portfolio
        </Button>
      </motion.div>
    </motion.div>
  );
};

const PortfolioView = ({ history, onBack, onNewAudit }) => {
  const totalTimeSaved = history.reduce((acc, h) => acc + h.timeInvested, 0);
  const hours = Math.floor(totalTimeSaved / 60);
  const minutes = totalTimeSaved % 60;
  const weeklyReport = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const activityStats = LIFE_ACTIVITIES.map(act => ({
    ...act,
    count: history.filter(h => h.reallocatedTo === act.id).length,
    time: history.filter(h => h.reallocatedTo === act.id).reduce((acc, h) => acc + h.timeInvested, 0)
  })).filter(a => a.count > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-white">Weekly Portfolio</h1>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm font-mono uppercase">Total Saved</p>
              <p className="text-4xl font-black text-green-400">{weeklyReport}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm font-mono uppercase">Audits</p>
              <p className="text-4xl font-black text-cyan-400">{history.length}</p>
            </div>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <p className="text-slate-500 text-sm mt-2">Mental liquidity up 40%</p>
        </motion.div>

        {activityStats.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-cyan-400" />
              Reallocation Breakdown
            </h3>
            <div className="space-y-3">
              {activityStats.map(stat => (
                <div key={stat.id} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-white font-medium">{stat.label}</span>
                      <span className="text-slate-400 font-mono text-sm">{Math.floor(stat.time / 60)}h {stat.time % 60}m</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${stat.color}`}
                        style={{ width: `${(stat.time / totalTimeSaved) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {history.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              Recent Audits
            </h3>
            <div className="space-y-3">
              {history.slice(-5).reverse().map((entry, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div>
                    <span className="text-orange-400 font-mono font-bold">{entry.ticker}</span>
                    <p className="text-slate-500 text-sm truncate max-w-[200px]">{entry.context}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-red-400 font-mono">-{entry.timeInvested}m</span>
                    <p className="text-green-400 text-sm">→ {LIFE_ACTIVITIES.find(a => a.id === entry.reallocatedTo)?.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <Button
          onClick={onNewAudit}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Cognitive Audit
        </Button>
      </div>
    </motion.div>
  );
};

const FactsAnalysis = ({ ticker, context, factsFor, factsAgainst, onFactsForChange, onFactsAgainstChange, aiAnalysis, isAnalyzing, onAnalyze, onSkip, onContinue }) => {
  const [newFactFor, setNewFactFor] = useState('');
  const [newFactAgainst, setNewFactAgainst] = useState('');

  const addFactFor = () => {
    if (newFactFor.trim()) {
      onFactsForChange([...factsFor, newFactFor.trim()]);
      setNewFactFor('');
      playClickSound();
    }
  };

  const addFactAgainst = () => {
    if (newFactAgainst.trim()) {
      onFactsAgainstChange([...factsAgainst, newFactAgainst.trim()]);
      setNewFactAgainst('');
      playClickSound();
    }
  };

  const removeFactFor = (index) => {
    onFactsForChange(factsFor.filter((_, i) => i !== index));
    playClickSound();
  };

  const removeFactAgainst = (index) => {
    onFactsAgainstChange(factsAgainst.filter((_, i) => i !== index));
    playClickSound();
  };

  return (
    <motion.div
      key="facts"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <Scale className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Evidence Review</h2>
        <p className="text-slate-400">
          Let's examine the facts about <span className="text-orange-400 font-mono">{ticker}</span>
        </p>
        <p className="text-slate-500 text-sm mt-1">{context}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Facts Supporting the Worry */}
        <div className="bg-gradient-to-br from-red-950/40 to-slate-900 rounded-2xl p-5 border border-red-900/30">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsDown className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-bold text-red-400">Evidence Supporting Worry</h3>
          </div>
          <p className="text-slate-500 text-sm mb-4">What facts suggest this worry is valid?</p>
          
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {factsFor.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-red-950/30 rounded-lg p-3 group"
              >
                <span className="text-red-400 font-mono text-sm">•</span>
                <p className="text-slate-300 text-sm flex-1">{fact}</p>
                <button
                  onClick={() => removeFactFor(index)}
                  className="text-red-400/50 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newFactFor}
              onChange={(e) => setNewFactFor(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addFactFor()}
              placeholder="Add supporting evidence..."
              className="flex-1 bg-slate-800/50 border border-red-900/30 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
            <Button
              onClick={addFactFor}
              disabled={!newFactFor.trim()}
              className="bg-red-600 hover:bg-red-700 text-white px-3"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Facts Against the Worry */}
        <div className="bg-gradient-to-br from-green-950/40 to-slate-900 rounded-2xl p-5 border border-green-900/30">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-bold text-green-400">Evidence Against Worry</h3>
          </div>
          <p className="text-slate-500 text-sm mb-4">What facts suggest this worry is unfounded?</p>
          
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {factsAgainst.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-green-950/30 rounded-lg p-3 group"
              >
                <span className="text-green-400 font-mono text-sm">•</span>
                <p className="text-slate-300 text-sm flex-1">{fact}</p>
                <button
                  onClick={() => removeFactAgainst(index)}
                  className="text-green-400/50 hover:text-green-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newFactAgainst}
              onChange={(e) => setNewFactAgainst(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addFactAgainst()}
              placeholder="Add counter evidence..."
              className="flex-1 bg-slate-800/50 border border-green-900/30 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-green-500"
            />
            <Button
              onClick={addFactAgainst}
              disabled={!newFactAgainst.trim()}
              className="bg-green-600 hover:bg-green-700 text-white px-3"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      {aiAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-cyan-950/40 to-slate-900 rounded-2xl p-6 border border-cyan-900/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-cyan-400">AI Analysis</h3>
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{aiAnalysis}</p>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!aiAnalysis ? (
          <>
            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing || (factsFor.length === 0 && factsAgainst.length === 0)}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 text-lg disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Evidence...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
            <Button
              onClick={onSkip}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-400 hover:bg-slate-800 py-6 text-lg"
            >
              Skip Analysis
            </Button>
          </>
        ) : (
          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg"
          >
            <Check className="w-5 h-5 mr-2" />
            Continue to Reallocation
          </Button>
        )}
      </div>
    </motion.div>
  );
};

const WorryROI = ({ onBack }) => {
  const [phase, setPhase] = useState('ticker');
  const [ticker, setTicker] = useState('');
  const [context, setContext] = useState('');
  const [timeInvested, setTimeInvested] = useState(30);
  const [volatility, setVolatility] = useState(1);
  const [showStamp, setShowStamp] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [factsFor, setFactsFor] = useState([]);
  const [factsAgainst, setFactsAgainst] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('worryROI_history') || '[]');
    } catch {
      return [];
    }
  });

  const saveHistory = (entry) => {
    const updated = [...history, entry];
    setHistory(updated);
    localStorage.setItem('worryROI_history', JSON.stringify(updated));
  };

  const handleTickerSubmit = () => {
    if (ticker.trim().length >= 2 && context.trim().length >= 5) {
      playClickSound();
      setPhase('investment');
    }
  };

  const handleInvestmentSubmit = () => {
    if (timeInvested < 5) {
      return;
    }
    playClickSound();
    setPhase('analysis');
  };

  const handleAnalysisChoice = (hasDividend) => {
    playClickSound();
    if (hasDividend) {
      setPhase('dividend');
    } else {
      setPhase('crash');
    }
  };

  const handleCrashComplete = () => {
    setShowStamp(true);
  };

  const handleStampComplete = () => {
    setShowStamp(false);
    setPhase('facts');
  };

  const handleFactsAnalyze = async () => {
    if (factsFor.length === 0 && factsAgainst.length === 0) return;
    
    setAiAnalysis('');
    setIsAnalyzing(true);
    playClickSound();
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      
      if (!supabaseUrl) {
        throw new Error('Supabase not configured');
      }

      const systemContext = `You are a cognitive behavioral therapy assistant helping users analyze their worries objectively. 
Your role is to provide balanced, compassionate analysis of the evidence they've gathered about their worry.
Keep responses concise (3-4 paragraphs max), warm but professional, and focus on helping them see their situation more clearly.
Use the fin-tech metaphor: treat worries as "investments" and help them see if this worry is worth their "emotional capital".`;

      const userPrompt = `The user is worried about: "${ticker}" - ${context}

Evidence they've gathered SUPPORTING the worry (reasons to be concerned):
${factsFor.length > 0 ? factsFor.map((f, i) => `${i + 1}. ${f}`).join('\n') : 'None provided'}

Evidence they've gathered AGAINST the worry (reasons not to be concerned):
${factsAgainst.length > 0 ? factsAgainst.map((f, i) => `${i + 1}. ${f}`).join('\n') : 'None provided'}

Please analyze this evidence and help them:
1. Objectively weigh the evidence on both sides
2. Identify any cognitive distortions or biases in their thinking
3. Suggest a more balanced perspective
4. Give a brief "investment recommendation" - is this worry worth their emotional capital?`;

      const response = await fetch(`${supabaseUrl}/functions/v1/perplexity-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          systemContext,
          userPrompt,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error('AI analysis failed');
      }

      const data = await response.json();
      setAiAnalysis(data.content);
      playSuccessSound();
    } catch (error) {
      console.error('AI Analysis error:', error);
      setAiAnalysis(`Unable to connect to AI service. Here's a self-reflection prompt instead:

Looking at your evidence, consider:
• Does the supporting evidence represent facts or fears?
• Are the counter-points being minimized?
• What would you tell a friend in this situation?
• Is the worry proportional to the actual risk?

Remember: Most worries never materialize, and even when challenges arise, you've handled difficult situations before.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFactsSkip = () => {
    playClickSound();
    setPhase('reallocation');
  };

  const handleFactsContinue = () => {
    playClickSound();
    setPhase('reallocation');
  };

  const handleReallocation = (activity) => {
    setSelectedActivity(activity);
    saveHistory({
      ticker,
      context,
      timeInvested,
      volatility,
      factsFor,
      factsAgainst,
      aiAnalysis,
      reallocatedTo: activity.id,
      date: new Date().toISOString()
    });
    setPhase('transferred');
  };

  const handleNewAudit = () => {
    setTicker('');
    setContext('');
    setTimeInvested(30);
    setVolatility(1);
    setSelectedActivity(null);
    setFactsFor([]);
    setFactsAgainst([]);
    setAiAnalysis('');
    setIsAnalyzing(false);
    setPhase('ticker');
  };

  const energyCost = Math.round(timeInvested * (volatility + 1) * 1.5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <AnimatePresence>
        {showStamp && <ToxicAssetStamp onComplete={handleStampComplete} />}
      </AnimatePresence>

      {phase === 'portfolio' ? (
        <PortfolioView
          history={history}
          onBack={() => setPhase('ticker')}
          onNewAudit={handleNewAudit}
        />
      ) : phase === 'transferred' ? (
        <FundsTransferredScreen
          activity={selectedActivity}
          timeInvested={timeInvested}
          onNewAudit={handleNewAudit}
          onViewPortfolio={() => setPhase('portfolio')}
        />
      ) : (
        <>
          <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <span className="hidden sm:inline">WORRY</span> ROI AUDIT
              </h1>
              <button
                onClick={() => setPhase('portfolio')}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Briefcase className="w-5 h-5" />
                <span className="hidden sm:inline">Portfolio</span>
              </button>
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              {phase === 'ticker' && (
                <motion.div
                  key="ticker"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  {/* Hero Image */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="hidden md:flex items-center justify-center"
                  >
                    <img 
                      src="/worry-roi-trader.png" 
                      alt="Financial Analyst" 
                      className="max-w-full h-auto rounded-2xl shadow-2xl border border-slate-700"
                    />
                  </motion.div>

                  <div className="space-y-8">
                    <div className="text-center md:text-left mb-8">
                      <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-2">
                        INITIAL PUBLIC OFFERING
                      </h2>
                      <p className="text-slate-400">Define the asset for analysis</p>
                    </div>

                    <div className="space-y-6">
                    <div>
                      <label className="block text-slate-400 text-sm font-mono uppercase tracking-wider mb-3">
                        Select Ticker for Analysis
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-400" />
                        <input
                          type="text"
                          value={ticker}
                          onChange={(e) => setTicker(e.target.value.toUpperCase())}
                          placeholder="FIRED"
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-2xl font-mono font-bold text-orange-400 placeholder-slate-600 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {TICKER_SUGGESTIONS.map(t => (
                          <button
                            key={t}
                            onClick={() => {
                              setTicker(t);
                              playClickSound();
                            }}
                            className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-400 hover:text-orange-400 hover:border-orange-500/50 transition-colors"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-sm font-mono uppercase tracking-wider mb-3">
                        Context / Worry Description
                      </label>
                      <textarea
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="I'm worried I missed something in the patient files..."
                        rows={3}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500 resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleTickerSubmit}
                      disabled={ticker.trim().length < 2 || context.trim().length < 5}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed text-white py-6 text-lg font-bold"
                    >
                      <Target className="w-5 h-5 mr-2" />
                      Calculate Investment Cost
                    </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === 'investment' && (
                <motion.div
                  key="investment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 font-mono mb-4">
                      <DollarSign className="w-4 h-4" />
                      {ticker}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Capital Injection</h2>
                    <p className="text-slate-400">How much did you invest in this worry?</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <CircularDial
                      value={timeInvested}
                      onChange={setTimeInvested}
                      max={240}
                      label="Time Invested"
                    />
                    <VolatilitySlider
                      value={volatility}
                      onChange={setVolatility}
                    />
                  </div>

                  <motion.div
                    className="text-center py-6 bg-slate-800/30 rounded-2xl border border-slate-700"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <p className="text-slate-400 text-sm font-mono uppercase mb-2">Total Cost</p>
                    <p className="text-5xl font-black text-red-500 font-mono">-{energyCost} EP</p>
                    <p className="text-slate-500 text-sm mt-1">Energy Points</p>
                  </motion.div>

                  <Button
                    onClick={handleInvestmentSubmit}
                    disabled={timeInvested < 5}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed text-white py-6 text-lg font-bold"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Analyze Returns
                  </Button>
                  {timeInvested < 5 && (
                    <p className="text-center text-slate-500 text-sm mt-2">
                      Invest at least 5 minutes to analyze
                    </p>
                  )}
                </motion.div>
              )}

              {phase === 'analysis' && (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
                    <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Trade Confirmation</h3>
                    <p className="text-slate-400 mb-6">
                      Did this investment yield a tangible solution or change the outcome?
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={() => handleAnalysisChoice(true)}
                        className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white py-6"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        <div className="text-left">
                          <p className="font-bold">YES</p>
                          <p className="text-xs opacity-80">Dividend Paid</p>
                        </div>
                      </Button>
                      <Button
                        onClick={() => handleAnalysisChoice(false)}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6"
                      >
                        <X className="w-5 h-5 mr-2" />
                        <div className="text-left">
                          <p className="font-bold">NO</p>
                          <p className="text-xs opacity-80">Market Loss</p>
                        </div>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === 'dividend' && (
                <motion.div
                  key="dividend"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Check className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-green-400">Dividend Received!</h2>
                  <p className="text-slate-400 max-w-md mx-auto">
                    This worry led to a productive outcome. While the energy cost was real, 
                    the investment paid off. Consider if the same result could be achieved 
                    with less emotional capital next time.
                  </p>
                  <Button
                    onClick={handleNewAudit}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    New Audit
                  </Button>
                </motion.div>
              )}

              {phase === 'crash' && (
                <motion.div
                  key="crash"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Market Crash Detected</h2>
                    <p className="text-slate-400">Visualizing your loss...</p>
                  </div>

                  <CrashChart />
                  <BalanceSheet timeInvested={timeInvested} volatility={volatility} />
                  
                  <Button
                    onClick={handleCrashComplete}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6 text-lg font-bold"
                  >
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Verify Verdict
                  </Button>
                </motion.div>
              )}

              {phase === 'facts' && (
                <FactsAnalysis
                  ticker={ticker}
                  context={context}
                  factsFor={factsFor}
                  factsAgainst={factsAgainst}
                  onFactsForChange={setFactsFor}
                  onFactsAgainstChange={setFactsAgainst}
                  aiAnalysis={aiAnalysis}
                  isAnalyzing={isAnalyzing}
                  onAnalyze={handleFactsAnalyze}
                  onSkip={handleFactsSkip}
                  onContinue={handleFactsContinue}
                />
              )}

              {phase === 'reallocation' && (
                <motion.div
                  key="reallocation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <Wallet className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Divest & Diversify</h2>
                    <p className="text-slate-400 mb-2">
                      You have <span className="text-orange-400 font-bold">{Math.floor(timeInvested / 60)}h {timeInvested % 60}m</span> of frozen capital
                    </p>
                    <p className="text-slate-500 text-sm">
                      Where would you like to reallocate these funds?
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6">
                    {LIFE_ACTIVITIES.map((activity) => (
                      <ReallocationBubble
                        key={activity.id}
                        activity={activity}
                        frozenFunds={timeInvested}
                        onDrop={() => handleReallocation(activity)}
                        isDropTarget={false}
                      />
                    ))}
                  </div>

                  <p className="text-center text-slate-500 text-sm">
                    Tap an activity to transfer your emotional capital
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </>
      )}
    </div>
  );
};

export default WorryROI;
