import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { generateContent } from '@/utils/perplexity';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const PARTICLE_COUNT = 35;
const SHATTER_PIECES = 14;
const BREATHING_RING_COUNT = 5;

// Vibrate helper — safe on all platforms
const vibrate = (pattern) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch (_) {}
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// AI THOUGHT REFRAMING SERVICE
// ─────────────────────────────────────────────────────────────────────────────
const REFRAME_SYSTEM_CONTEXT = `You are a compassionate cognitive defusion therapist helping someone with nighttime anxiety. Transform their anxious thoughts into a calming, defused perspective.

CRITICAL RULES:
1. Acknowledge the cognitive trap (what-if spiral, catastrophizing, mind-reading, etc.)
2. Remind them: "What-ifs are lies anxiety tells you — they are NOT predictions."
3. Use defusion language: "I notice I'm having the thought that..." instead of "I am..."
4. Keep it SHORT — 2-3 sentences max
5. End with a grounding reminder for sleep

TONE: Warm, calming, non-judgmental. Like a wise friend at 3am.`;

const reframeThought = async (rawThoughts) => {
  const userPrompt = `Transform this anxious thought into a calming defusion statement. The person is trying to sleep:

"${rawThoughts}"

Remind them they CANNOT predict the future. Keep it brief and comforting.`;

  try {
    const result = await generateContent(REFRAME_SYSTEM_CONTEXT, userPrompt, 0.65);
    return result || getDefaultRef(rawThoughts);
  } catch (error) {
    console.warn('AI reframing failed:', error);
    return getDefaultRef(rawThoughts);
  }
};

const getDefaultRef = (thoughts) => {
  if (/what if/i.test(thoughts)) {
    return "I notice I'm having 'what-if' thoughts. What-ifs are anxiety's lies — they feel like predictions, but they're just stories. Right now, in this moment, I am safe.";
  }
  if (/always|never|ruined|disaster/i.test(thoughts)) {
    return "I notice my mind jumping to extremes. This is a thought pattern, not a prophecy. The worst case is not the only case. I've gotten through hard things before.";
  }
  if (/they think|everyone/i.test(thoughts)) {
    return "I notice I'm trying to read minds. But I can't know what others think. That story is one I'm telling myself. Tonight, I let it go.";
  }
  return "I notice I'm having the thought that something is wrong. But a thought is just a thought — not a fact, not a command. Tonight, I choose rest.";
};

const analyzeCognitiveTraps = (text) => {
  const traps = [];
  if (/what if/i.test(text)) traps.push({ name: 'What-If Spiral', icon: '🔮' });
  if (/always|never/i.test(text)) traps.push({ name: 'All-or-Nothing', icon: '⚖️' });
  if (/they think|everyone/i.test(text)) traps.push({ name: 'Mind-Reading', icon: '🧠' });
  if (/should have|could have/i.test(text)) traps.push({ name: 'Hindsight', icon: '⏪' });
  if (/disaster|ruin|fail/i.test(text)) traps.push({ name: 'Catastrophizing', icon: '💥' });
  return traps;
};

// ─────────────────────────────────────────────────────────────────────────────
// AURORA BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
const AuroraBackground = ({ fadeToBlack, intensity = 1 }) => (
  <motion.div
    className="fixed inset-0 overflow-hidden"
    animate={fadeToBlack ? { backgroundColor: '#000000' } : {}}
    transition={{ duration: 2.5, ease: 'easeInOut' }}
  >
    {!fadeToBlack && (
      <>
        <div className="absolute inset-0 bg-[#020408]" />
        <motion.div
          className="absolute w-[1000px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, #0d1b4b 0%, #050d2e 50%, transparent 70%)',
            filter: 'blur(90px)',
            top: '-15%',
            left: '-20%',
            opacity: 0.35 * intensity,
          }}
          animate={{ x: [0, 80, -40, 0], y: [0, 50, -30, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[800px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, #1a0a3d 0%, #0d0520 50%, transparent 70%)',
            filter: 'blur(100px)',
            top: '15%',
            right: '-15%',
            opacity: 0.28 * intensity,
          }}
          animate={{ x: [0, -60, 40, 0], y: [0, -40, 60, 0], scale: [1, 0.92, 1.08, 1] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, #0f0f3d 0%, transparent 70%)',
            filter: 'blur(120px)',
            top: '35%',
            left: '30%',
            opacity: 0.2 * intensity,
          }}
          animate={{ scale: [1, 1.25, 0.85, 1], opacity: [0.2 * intensity, 0.28 * intensity, 0.12 * intensity, 0.2 * intensity] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat' }} />
      </>
    )}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BREATHING RINGS - Advanced expanding/contracting rings
// ─────────────────────────────────────────────────────────────────────────────
const BreathingRing = ({ index, phase, total }) => {
  const baseRadius = 60 + index * 35;
  const delay = index * 0.1;

  const getRingState = () => {
    switch (phase) {
      case 'inhale': return { scale: 0.6, opacity: 0.6 - index * 0.08 };
      case 'hold1': return { scale: 0.85, opacity: 0.5 - index * 0.07 };
      case 'exhale': return { scale: 1.3, opacity: 0.25 - index * 0.04 };
      case 'hold2': return { scale: 1.0, opacity: 0.35 - index * 0.05 };
      default: return { scale: 1, opacity: 0.4 - index * 0.06 };
    }
  };

  const state = getRingState();
  const hue = 210 + index * 8;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: baseRadius * 2,
        height: baseRadius * 2,
        border: `1.5px solid hsla(${hue}, 70%, 65%, ${0.5 - index * 0.06})`,
        left: '50%',
        top: '50%',
        marginLeft: -baseRadius,
        marginTop: -baseRadius,
        boxShadow: `0 0 ${20 - index * 2}px hsla(${hue}, 80%, 60%, ${0.15 - index * 0.02}), inset 0 0 ${15 - index * 2}px hsla(${hue}, 80%, 60%, ${0.1 - index * 0.015})`,
      }}
      animate={state}
      transition={{ duration: 4, delay, ease: phase === 'inhale' ? 'easeOut' : phase === 'exhale' ? 'easeIn' : 'easeInOut' }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BREATHING ORB - Central pulsing orb
// ─────────────────────────────────────────────────────────────────────────────
const BreathingOrb = ({ phase }) => {
  const getOrbState = () => {
    switch (phase) {
      case 'inhale': return { scale: 1.4, opacity: 0.7 };
      case 'hold1': return { scale: 1.3, opacity: 0.55 };
      case 'exhale': return { scale: 0.7, opacity: 0.25 };
      case 'hold2': return { scale: 0.85, opacity: 0.35 };
      default: return { scale: 1, opacity: 0.45 };
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(99,179,237,0.8) 0%, rgba(49,130,206,0.4) 50%, transparent 80%)',
        filter: 'blur(8px)',
        left: '50%',
        top: '50%',
        marginLeft: -50,
        marginTop: -50,
        pointerEvents: 'none',
      }}
      animate={getOrbState()}
      transition={{ duration: 4, ease: 'easeInOut' }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BREATHING PARTICLES - Floating particles around the orb
// ─────────────────────────────────────────────────────────────────────────────
const BreathingParticle = ({ index, phase, total }) => {
  const angle = (index / total) * 2 * Math.PI;
  const baseRadius = 80 + (index % 4) * 25;
  const size = 2 + (index % 5) * 1.2;

  const getParticleState = () => {
    const pullIn = phase === 'inhale' ? 0.4 : phase === 'exhale' ? 1.1 : 0.7;
    return {
      x: Math.cos(angle + (index % 3) * 0.2) * (baseRadius * pullIn),
      y: Math.sin(angle + (index % 3) * 0.2) * (baseRadius * pullIn),
      opacity: phase === 'inhale' ? 0.9 : phase === 'exhale' ? 0.3 : 0.55,
      scale: phase === 'inhale' ? 1.3 : phase === 'exhale' ? 0.7 : 1,
    };
  };

  const state = getParticleState();
  const hue = 200 + (index * 15) % 60;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: `hsl(${hue}, 75%, 70%)`,
        boxShadow: `0 0 ${size * 4}px ${size * 1.5}px hsla(${hue}, 85%, 75%, 0.6)`,
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      animate={state}
      transition={{ duration: 4, ease: 'easeInOut' }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BREATH TIMER CIRCLE - Circular progress indicator
// ─────────────────────────────────────────────────────────────────────────────
const BreathTimerCircle = ({ phase, progress }) => {
  const circumference = 2 * Math.PI * 180;
  const strokeDashoffset = circumference * (1 - progress);
  const phaseColor = {
    inhale: '#60a5fa',
    hold1: '#818cf8',
    exhale: '#34d399',
    hold2: '#a78bfa',
  }[phase] || '#60a5fa';

  return (
    <svg className="absolute" width="380" height="380" style={{ left: '50%', top: '50%', marginLeft: -190, marginTop: -190 }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Background ring */}
      <circle cx="190" cy="190" r="180" fill="none" stroke="rgba(99,179,237,0.1)" strokeWidth="2" />
      {/* Progress ring */}
      <motion.circle
        cx="190" cy="190" r="180"
        fill="none"
        stroke={phaseColor}
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#glow)"
        strokeDasharray={circumference}
        animate={{ strokeDashoffset }}
        transition={{ duration: 0.3 }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
      />
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// RECORD PLAYER - Full turntable with tonearm
// ─────────────────────────────────────────────────────────────────────────────
const RecordPlayer = ({ children, tonearmActive, spinning }) => (
  <div className="relative" style={{ width: 340, height: 340 }}>
    {/* Turntable Base */}
    <svg viewBox="0 0 340 340" className="absolute inset-0">
      <defs>
        {/* Wood grain for plinth */}
        <linearGradient id="woodGrain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a1f1a" />
          <stop offset="25%" stopColor="#3d2d24" />
          <stop offset="50%" stopColor="#2a1f1a" />
          <stop offset="75%" stopColor="#3d2d24" />
          <stop offset="100%" stopColor="#2a1f1a" />
        </linearGradient>
        {/* Platter gradient */}
        <radialGradient id="platterGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="90%" stopColor="#0d0d0d" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </radialGradient>
        {/* Tonearm metal */}
        <linearGradient id="tonearmMetal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="50%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#3a3a3a" />
        </linearGradient>
      </defs>

      {/* Plinth (base) */}
      <rect x="10" y="10" width="320" height="320" rx="12" fill="url(#woodGrain)" />
      <rect x="10" y="10" width="320" height="320" rx="12" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      
      {/* Platter (silver spinning plate) */}
      <circle cx="150" cy="175" r="115" fill="url(#platterGrad)" />
      <circle cx="150" cy="175" r="115" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      
      {/* Platter dots */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = 150 + Math.cos(angle) * 105;
        const y = 175 + Math.sin(angle) * 105;
        return <circle key={i} cx={x} cy={y} r="2" fill="rgba(255,255,255,0.08)" />;
      })}

      {/* Tonearm assembly */}
      <g>
        {/* Tonearm base/pivot */}
        <circle cx="285" cy="80" r="20" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx="285" cy="80" r="12" fill="#0a0a0a" />
        <circle cx="285" cy="80" r="6" fill="#2a2a2a" />
        
        {/* Tonearm - animated rotation */}
        <motion.g
          style={{ transformOrigin: '285px 80px' }}
          animate={{ rotate: tonearmActive ? 23 : 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Arm tube */}
          <line x1="285" y1="80" x2="175" y2="155" stroke="url(#tonearmMetal)" strokeWidth="6" strokeLinecap="round" />
          {/* Counterweight */}
          <circle cx="290" cy="68" r="10" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Headshell */}
          <rect x="160" y="148" width="30" height="14" rx="3" fill="#2a2a2a" stroke="rgba(255,255,255,0.1)" strokeWidth="1" transform="rotate(-35 175 155)" />
          {/* Cartridge */}
          <rect x="158" y="152" width="18" height="10" rx="2" fill="#1a1a1a" transform="rotate(-35 167 157)" />
          {/* Stylus/Needle */}
          <line x1="155" y1="162" x2="152" y2="172" stroke="#c0c0c0" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="152" cy="173" r="1.5" fill="#e0e0e0" />
        </motion.g>
      </g>

      {/* Power button/LED */}
      <circle cx="300" cy="310" r="6" fill={tonearmActive ? '#4ade80' : '#333'} />
      <circle cx="300" cy="310" r="4" fill={tonearmActive ? '#22c55e' : '#222'} style={tonearmActive ? { filter: 'drop-shadow(0 0 4px #4ade80)' } : {}} />

      {/* Speed selector dots */}
      <circle cx="40" cy="310" r="4" fill="rgba(255,255,255,0.1)" />
      <text x="48" y="313" fontSize="8" fill="rgba(255,255,255,0.3)">33</text>
      <circle cx="75" cy="310" r="4" fill="rgba(99,179,237,0.5)" />
      <text x="83" y="313" fontSize="8" fill="rgba(99,179,237,0.5)">45</text>
    </svg>

    {/* Record positioned on platter */}
    <div style={{ position: 'absolute', left: 30, top: 55 }}>
      {children}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// VINYL RECORD SVG
// ─────────────────────────────────────────────────────────────────────────────
const VinylRecord = ({ lyrics, tapCount, spinning }) => {
  const safeText = lyrics?.slice(0, 160) || 'You are not your thoughts. You are not your thoughts. You are not your thoughts.';
  const redGlow = tapCount >= 2
    ? 'drop-shadow(0 0 20px rgba(220,0,0,0.7)) drop-shadow(0 0 40px rgba(180,0,0,0.4))'
    : tapCount === 1 ? 'drop-shadow(0 0 10px rgba(200,0,0,0.3))' : '';

  return (
    <motion.div
      style={{ filter: redGlow || 'drop-shadow(0 0 25px rgba(99,179,237,0.15))' }}
      animate={spinning ? { rotate: 360 } : {}}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
    >
      <svg viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <radialGradient id="vinylGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="35%" stopColor="#0d0d0d" />
            <stop offset="65%" stopColor="#141414" />
            <stop offset="85%" stopColor="#0a0a0a" />
            <stop offset="100%" stopColor="#1c1c1c" />
          </radialGradient>
          <radialGradient id="labelGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          <path id="lyricsCircle" d="M 100,100 m -62,0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0" />
        </defs>

        <circle cx="100" cy="100" r="98" fill="url(#vinylGrad)" />
        {/* Grooves */}
        {[88, 78, 70, 62, 54, 46, 38].map((r, i) => (
          <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.8" />
        ))}
        {/* Sheen */}
        <ellipse cx="70" cy="60" rx="45" ry="30" fill="rgba(255,255,255,0.03)" transform="rotate(-30 70 60)" />
        
        {/* Label */}
        <circle cx="100" cy="100" r="32" fill="url(#labelGrad)" />
        <circle cx="100" cy="100" r="32" fill="none" stroke="rgba(99,179,237,0.2)" strokeWidth="0.8" />
        
        {/* Spindle */}
        <circle cx="100" cy="100" r="4" fill="#000" />
        <circle cx="100" cy="100" r="2" fill="#1a1a1a" />

        {/* Lyrics text */}
        <text fontSize="4.8" fill="rgba(148,190,240,0.7)" letterSpacing="0.4" fontFamily="'Georgia', serif">
          <textPath href="#lyricsCircle">{safeText}</textPath>
        </text>

        {/* Label text */}
        <text x="100" y="96" textAnchor="middle" fontSize="3.5" fill="rgba(99,179,237,0.4)" fontFamily="'Georgia', serif" letterSpacing="0.8">THE SPIN DOWN</text>
        <text x="100" y="104" textAnchor="middle" fontSize="2.5" fill="rgba(99,179,237,0.25)" letterSpacing="0.4">SIDE A • 33 RPM</text>
        <circle cx="100" cy="74" r="1.2" fill="rgba(99,179,237,0.5)" />

        {/* Edge highlight */}
        <circle cx="100" cy="100" r="98" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Cracks overlay */}
        {tapCount >= 1 && (
          <g stroke="rgba(220,50,50,0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M100,100 L115,72 L108,52" />
            <path d="M100,100 L82,88 L65,95" />
          </g>
        )}
        {tapCount >= 2 && (
          <g stroke="rgba(220,50,50,0.9)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M100,100 L78,65 L88,42" />
            <path d="M100,100 L130,125 L145,142" />
            <circle cx="100" cy="100" r="15" stroke="rgba(180,0,0,0.3)" strokeWidth="5" fill="rgba(180,0,0,0.08)" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SHATTER FRAGMENT
// ─────────────────────────────────────────────────────────────────────────────
const ShatterFragment = ({ index, total }) => {
  const angle = (index / total) * 360;
  const distance = 180 + Math.random() * 280;
  const tx = Math.cos((angle * Math.PI) / 180) * distance;
  const ty = Math.sin((angle * Math.PI) / 180) * distance + 180;
  const rotation = (Math.random() - 0.5) * 800;
  const size = 24 + (index % 5) * 16;
  const shapes = ['polygon(50% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)', 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)', 'polygon(50% 0%, 100% 100%, 0% 100%)'];

  return (
    <motion.div
      className="absolute"
      style={{
        width: size, height: size,
        background: `conic-gradient(from ${angle}deg, #0d0d0d, #1a1a1a, #111)`,
        clipPath: shapes[index % shapes.length],
        left: `calc(50% - ${size / 2}px)`, top: `calc(50% - ${size / 2}px)`,
        border: '1px solid rgba(220,50,50,0.35)',
        boxShadow: '0 0 10px rgba(180,0,0,0.25)',
      }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
      animate={{ x: tx, y: ty, rotate: rotation, opacity: 0, scale: [1, 1.15, 0.25] }}
      transition={{ duration: 1.6, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94], opacity: { duration: 1.5, delay: index * 0.04 + 0.5 } }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COGNITIVE TRAP BADGE
// ─────────────────────────────────────────────────────────────────────────────
const CognitiveTrapBadge = ({ trap, index }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
    style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'rgba(252, 165, 165, 0.9)' }}
  >
    <span>{trap.icon}</span> {trap.name}
  </motion.span>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const TheSpinDown = () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [appState, setAppState] = useState('input');
  const [lyrics, setLyrics] = useState('');
  const [savedLyrics, setSavedLyrics] = useState('');
  const [saving, setSaving] = useState(false);

  // AI
  const [cognitiveTraps, setCognitiveTraps] = useState([]);
  const [reframedThought, setReframedThought] = useState('');
  const [isReframing, setIsReframing] = useState(false);

  // Breathing
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathLabel, setBreathLabel] = useState('Breathe in');
  const [breathProgress, setBreathProgress] = useState(0);
  const [promptVisible, setPromptVisible] = useState(false);

  // Interaction
  const [tapCount, setTapCount] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [shattering, setShattering] = useState(false);
  const [fadeToBlack, setFadeToBlack] = useState(false);

  // Refs
  const crackleRef = useRef(null);
  const shatterRef = useRef(null);
  const breathTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // ── Audio ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    crackleRef.current = new Audio('/audio/crackle.mp3');
    crackleRef.current.loop = true;
    crackleRef.current.volume = 0.15;
    shatterRef.current = new Audio('/audio/shatter.mp3');
    shatterRef.current.volume = 0.8;
    return () => {
      if (crackleRef.current) { crackleRef.current.pause(); crackleRef.current = null; }
      if (shatterRef.current) { shatterRef.current = null; }
    };
  }, []);

  // ── Cognitive trap detection ───────────────────────────────────────────────
  useEffect(() => {
    setCognitiveTraps(lyrics.length > 8 ? analyzeCognitiveTraps(lyrics) : []);
  }, [lyrics]);

  // ── Breathing cycle engine ─────────────────────────────────────────────────
  const startBreathCycle = useCallback(() => {
    const phases = [
      { phase: 'inhale', label: 'Breathe in', duration: 4000 },
      { phase: 'hold1', label: 'Hold', duration: 4000 },
      { phase: 'exhale', label: 'Breathe out', duration: 4000 },
      { phase: 'hold2', label: 'Hold', duration: 4000 },
    ];

    let idx = 0;
    const runPhase = () => {
      const { phase, label, duration } = phases[idx];
      setBreathPhase(phase);
      setBreathLabel(label);
      setBreathProgress(0);

      // Progress animation
      const startTime = Date.now();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setBreathProgress(Math.min(elapsed / duration, 1));
      }, 50);

      breathTimerRef.current = setTimeout(() => {
        clearInterval(progressIntervalRef.current);
        idx++;
        if (idx < phases.length) {
          runPhase();
        } else {
          setBreathProgress(1);
          setTimeout(() => setPromptVisible(true), 500);
        }
      }, duration);
    };
    runPhase();
  }, []);

  // ── Enter vinyl state ──────────────────────────────────────────────────────
  const enterVinylState = useCallback(async (lyricsText) => {
    setAppState('vinyl');
    setSavedLyrics(lyricsText);

    // Wait for tonearm animation, then start audio + breathing
    setTimeout(() => {
      if (crackleRef.current) crackleRef.current.play().catch(() => {});
      startBreathCycle();
    }, 1800);

    // AI reframing in parallel
    if (lyricsText) {
      setIsReframing(true);
      try {
        const reframed = await reframeThought(lyricsText);
        setReframedThought(reframed);
      } catch (err) {
        console.error('AI error:', err);
        setReframedThought(getDefaultRef(lyricsText));
      }
      setIsReframing(false);
    }
  }, [startBreathCycle]);

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!lyrics.trim()) return;
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('anxiety_records').insert([{ user_id: user?.id ?? null, lyrics: lyrics.trim() }]);
    } catch (err) {
      console.warn('Save error:', err.message);
    }

    setSaving(false);
    enterVinylState(lyrics.trim());
  };

  // ── Record tap ─────────────────────────────────────────────────────────────
  const handleRecordTap = useCallback(() => {
    if (!promptVisible || shattering) return;
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount === 1) {
      setShaking(true);
      vibrate(50);
      setTimeout(() => setShaking(false), 200);
    } else if (newCount === 2) {
      setShaking(true);
      vibrate([100, 50, 100]);
      setTimeout(() => setShaking(false), 280);
    } else if (newCount >= 3) {
      setShattering(true);
      vibrate([200, 100, 200, 100, 300]);
      if (crackleRef.current) crackleRef.current.pause();
      if (shatterRef.current) shatterRef.current.play().catch(() => {});
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setAppState('shatter');
      setTimeout(() => {
        setFadeToBlack(true);
        setTimeout(() => setAppState('sleep'), 2500);
      }, 1400);
    }
  }, [tapCount, promptVisible, shattering]);

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const resetAll = () => {
    setAppState('input');
    setLyrics('');
    setSavedLyrics('');
    setTapCount(0);
    setShaking(false);
    setShattering(false);
    setFadeToBlack(false);
    setPromptVisible(false);
    setCognitiveTraps([]);
    setReframedThought('');
    setBreathPhase('inhale');
    setBreathLabel('Breathe in');
    setBreathProgress(0);
    if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <AuroraBackground fadeToBlack={fadeToBlack} intensity={appState === 'input' ? 1 : 0.6} />

      {/* ═══════════════════════════════════════════════════════════════════════
          STATE 1 — INPUT
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {appState === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -15, filter: 'blur(8px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <div
              className="rounded-3xl p-7 flex flex-col gap-5"
              style={{
                background: 'rgba(8, 12, 28, 0.78)',
                backdropFilter: 'blur(32px)',
                border: '1px solid rgba(99,179,237,0.12)',
                boxShadow: '0 12px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              <div className="text-center">
                <p className="text-[10px] tracking-[0.35em] uppercase mb-2" style={{ color: 'rgba(99,179,237,0.45)' }}>The Spin Down</p>
                <h1 className="text-xl sm:text-2xl font-light leading-snug" style={{ color: 'rgba(226,232,240,0.92)', fontFamily: "'Georgia', serif" }}>
                  What's playing in your head tonight?
                </h1>
              </div>

              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="The worries, the what-ifs, the 3am spirals..."
                rows={4}
                maxLength={280}
                className="w-full resize-none outline-none bg-transparent text-[15px] leading-relaxed"
                style={{
                  color: 'rgba(203,213,225,0.88)',
                  fontFamily: "'Georgia', serif",
                  caretColor: 'rgba(99,179,237,0.8)',
                  borderBottom: '1px solid rgba(99,179,237,0.15)',
                  paddingBottom: 10,
                }}
              />
              <div className="flex justify-between items-center -mt-1">
                {cognitiveTraps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {cognitiveTraps.map((t, i) => <CognitiveTrapBadge key={t.name} trap={t} index={i} />)}
                  </div>
                )}
                <span className="text-[10px] ml-auto" style={{ color: 'rgba(100,116,139,0.6)' }}>{lyrics.length}/280</span>
              </div>

              {lyrics.toLowerCase().includes('what if') && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl text-[13px]"
                  style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)', color: 'rgba(252, 165, 165, 0.85)' }}
                >
                  ⚠️ <strong>What-ifs are lies.</strong> They feel like predictions, but they're just stories. You cannot know the future.
                </motion.div>
              )}

              <motion.button
                onClick={handleSubmit}
                disabled={!lyrics.trim() || saving}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-2xl font-medium text-xs tracking-[0.2em] uppercase disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, rgba(30,41,59,0.85), rgba(15,23,42,0.9))',
                  color: 'rgba(148,190,240,0.9)',
                  border: '1px solid rgba(99,179,237,0.18)',
                }}
              >
                {saving ? 'Pressing…' : 'Press onto Vinyl'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          STATE 2 — VINYL + BREATHING
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {(appState === 'vinyl' || appState === 'shatter') && (
          <motion.div
            key="vinyl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            {/* Breathing rings + orb + particles */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <BreathingOrb phase={breathPhase} />
              {Array.from({ length: BREATHING_RING_COUNT }, (_, i) => (
                <BreathingRing key={i} index={i} phase={breathPhase} total={BREATHING_RING_COUNT} />
              ))}
              {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
                <BreathingParticle key={i} index={i} phase={breathPhase} total={PARTICLE_COUNT} />
              ))}
              <BreathTimerCircle phase={breathPhase} progress={breathProgress} />
            </div>

            {/* Record player with vinyl */}
            <div className="relative">
              <AnimatePresence>
                {!shattering && (
                  <motion.div
                    key="player"
                    initial={{ scale: 0.15, opacity: 0, y: 60 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      y: 0,
                      rotate: shaking ? [0, -3, 4, -4, 3, -2, 1, 0] : 0,
                      x: shaking ? [0, -5, 7, -6, 4, -2, 0] : 0,
                    }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }, rotate: { duration: 0.25 }, x: { duration: 0.25 } }}
                  >
                    <RecordPlayer tonearmActive={appState === 'vinyl'} spinning={appState === 'vinyl'}>
                      <VinylRecord lyrics={savedLyrics} tapCount={tapCount} spinning={appState === 'vinyl'} />
                    </RecordPlayer>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Shatter fragments */}
              {shattering && Array.from({ length: SHATTER_PIECES }, (_, i) => <ShatterFragment key={i} index={i} total={SHATTER_PIECES} />)}
            </div>

            {/* Breathing UI */}
            {appState === 'vinyl' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center flex flex-col items-center gap-2.5 mt-2"
              >
                <motion.p
                  key={breathPhase}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm tracking-[0.18em] uppercase font-light"
                  style={{ color: 'rgba(148,190,240,0.6)' }}
                >
                  {breathLabel}
                </motion.p>
                <p className="text-lg font-light" style={{ color: 'rgba(203,213,225,0.65)', fontFamily: "'Georgia', serif" }}>
                  You don't have to listen. Just breathe.
                </p>

                {promptVisible && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 flex flex-col items-center gap-1.5"
                  >
                    <p className="text-sm" style={{ color: 'rgba(99,179,237,0.7)' }}>Tap the record to break the loop</p>
                    <div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: i < tapCount ? 'rgba(220,50,50,0.8)' : 'rgba(99,179,237,0.25)',
                            boxShadow: i < tapCount ? '0 0 8px rgba(220,50,50,0.5)' : 'none',
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Hidden tap target */}
                {promptVisible && (
                  <div
                    onClick={handleRecordTap}
                    className="absolute cursor-pointer"
                    style={{ width: 240, height: 240, top: 0, left: '50%', marginLeft: -120 }}
                  />
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          STATE 3 — SLEEP
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {appState === 'sleep' && (
          <motion.div
            key="sleep"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-md"
          >
            {reframedThought && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base font-light leading-relaxed mb-5"
                style={{ color: 'rgba(148,163,184,0.55)', fontFamily: "'Georgia', serif", fontStyle: 'italic' }}
              >
                "{reframedThought}"
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-xl sm:text-2xl font-light"
              style={{ color: 'rgba(148,163,184,0.6)', fontFamily: "'Georgia', serif" }}
            >
              The track is over.
              <br />
              <span style={{ color: 'rgba(100,116,139,0.45)', fontSize: '0.8em' }}>Time for sleep.</span>
            </motion.p>
            <motion.button
              onClick={resetAll}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              whileHover={{ opacity: 0.6 }}
              transition={{ delay: 4 }}
              className="text-[10px] tracking-[0.3em] uppercase mt-8"
              style={{ color: 'rgba(100,116,139,0.6)' }}
            >
              Play Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TheSpinDown;