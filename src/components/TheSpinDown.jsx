import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const BREATHING_CYCLE = 16000; // 4-4-4-4 box breathing = 16s
const BREATHING_PHASE_DURATION = 4000;
const PARTICLE_COUNT = 28;
const SHATTER_PIECES = 12;

// Vibrate helper — safe on all platforms
const vibrate = (pattern) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch (_) {}
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// AURORA BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
const AuroraBackground = ({ fadeToBlack }) => {
  return (
    <motion.div
      className="fixed inset-0 overflow-hidden"
      animate={fadeToBlack ? { backgroundColor: '#000000' } : {}}
      transition={{ duration: 2.5, ease: 'easeInOut' }}
    >
      {!fadeToBlack && (
        <>
          {/* Base deep black */}
          <div className="absolute inset-0 bg-[#020408]" />

          {/* Aurora blob 1 — deep midnight blue */}
          <motion.div
            className="absolute w-[900px] h-[600px] rounded-full opacity-30"
            style={{
              background: 'radial-gradient(ellipse at center, #0d1b4b 0%, #050d2e 50%, transparent 70%)',
              filter: 'blur(80px)',
              top: '-10%',
              left: '-15%',
            }}
            animate={{
              x: [0, 60, -30, 0],
              y: [0, 40, -20, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Aurora blob 2 — dark violet */}
          <motion.div
            className="absolute w-[700px] h-[500px] rounded-full opacity-25"
            style={{
              background: 'radial-gradient(ellipse at center, #1a0a3d 0%, #0d0520 50%, transparent 70%)',
              filter: 'blur(100px)',
              top: '20%',
              right: '-10%',
            }}
            animate={{
              x: [0, -50, 30, 0],
              y: [0, -30, 50, 0],
              scale: [1, 0.9, 1.05, 1],
            }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />

          {/* Aurora blob 3 — deep teal accent */}
          <motion.div
            className="absolute w-[600px] h-[400px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(ellipse at center, #001a2e 0%, #001020 50%, transparent 70%)',
              filter: 'blur(90px)',
              bottom: '-5%',
              left: '20%',
            }}
            animate={{
              x: [0, 40, -60, 0],
              y: [0, 30, -20, 0],
              scale: [1, 1.15, 0.9, 1],
            }}
            transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
          />

          {/* Aurora blob 4 — subtle indigo center */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full opacity-15"
            style={{
              background: 'radial-gradient(ellipse at center, #0f0f3d 0%, transparent 70%)',
              filter: 'blur(120px)',
              top: '40%',
              left: '35%',
            }}
            animate={{
              scale: [1, 1.2, 0.85, 1],
              opacity: [0.15, 0.22, 0.10, 0.15],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />

          {/* Fine noise overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
        </>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BREATHING PARTICLE
// ─────────────────────────────────────────────────────────────────────────────
const BreathingParticle = ({ index, phase, total }) => {
  const angle = (index / total) * 2 * Math.PI;
  const baseRadius = 120 + (index % 3) * 30;
  const size = 2 + (index % 4) * 1.5;

  const getParticleState = () => {
    switch (phase) {
      case 'inhale':
        return {
          x: Math.cos(angle) * (baseRadius * 0.45),
          y: Math.sin(angle) * (baseRadius * 0.45),
          opacity: 0.9,
          scale: 1.4,
        };
      case 'hold1':
      case 'hold2':
        return {
          x: Math.cos(angle) * (baseRadius * 0.55),
          y: Math.sin(angle) * (baseRadius * 0.55),
          opacity: 0.7,
          scale: 1.0,
        };
      case 'exhale':
        return {
          x: Math.cos(angle) * (baseRadius * 0.95),
          y: Math.sin(angle) * (baseRadius * 0.95),
          opacity: 0.35,
          scale: 0.7,
        };
      default:
        return {
          x: Math.cos(angle) * (baseRadius * 0.7),
          y: Math.sin(angle) * (baseRadius * 0.7),
          opacity: 0.55,
          scale: 1.0,
        };
    }
  };

  const state = getParticleState();
  const duration = phase === 'inhale' || phase === 'exhale' ? 4 : 4;

  // Color varies by position for depth
  const hue = 200 + (index * 12) % 120;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: `hsl(${hue}, 70%, 75%)`,
        boxShadow: `0 0 ${size * 3}px ${size}px hsla(${hue}, 80%, 80%, 0.5)`,
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      animate={state}
      transition={{
        duration,
        ease: phase === 'inhale' ? 'easeIn' : phase === 'exhale' ? 'easeOut' : 'easeInOut',
      }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BREATHING ORB (central glow)
// ─────────────────────────────────────────────────────────────────────────────
const BreathingOrb = ({ phase }) => {
  const getOrbState = () => {
    switch (phase) {
      case 'inhale':
        return { scale: 1.25, opacity: 0.55 };
      case 'hold1':
        return { scale: 1.2, opacity: 0.45 };
      case 'exhale':
        return { scale: 0.85, opacity: 0.2 };
      case 'hold2':
        return { scale: 0.88, opacity: 0.25 };
      default:
        return { scale: 1.0, opacity: 0.35 };
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{
        width: 260,
        height: 260,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,179,237,0.35) 0%, rgba(49,130,206,0.15) 40%, transparent 70%)',
        filter: 'blur(18px)',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
      animate={getOrbState()}
      transition={{
        duration: 4,
        ease: phase === 'inhale' ? 'easeIn' : phase === 'exhale' ? 'easeOut' : 'easeInOut',
      }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SVG CRACK OVERLAYS
// ─────────────────────────────────────────────────────────────────────────────
const CrackOverlay = ({ tapCount }) => {
  if (tapCount === 0) return null;
  return (
    <svg
      viewBox="0 0 200 200"
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none', borderRadius: '50%' }}
    >
      {tapCount >= 1 && (
        <g stroke="rgba(220,50,50,0.85)" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M100,100 L115,72 L108,55 L125,38" />
          <path d="M100,100 L118,115 L130,108" />
          <path d="M100,100 L83,88 L70,95 L55,78" />
          {/* hairline radiating cracks */}
          <path d="M115,72 L122,65 L118,58" strokeWidth="0.8" opacity="0.6" />
          <path d="M83,88 L75,80 L68,84" strokeWidth="0.8" opacity="0.6" />
        </g>
      )}
      {tapCount >= 2 && (
        <g stroke="rgba(220,50,50,0.9)" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M100,100 L78,68 L85,50 L72,32" />
          <path d="M100,100 L125,130 L118,148 L132,165" />
          <path d="M100,100 L140,90 L158,100 L170,88" />
          <path d="M100,100 L60,115 L48,105" />
          {/* deep red glow bleed */}
          <circle cx="100" cy="100" r="18" stroke="rgba(200,0,0,0.4)" strokeWidth="6" fill="rgba(180,0,0,0.08)" />
          {/* extra hairlines */}
          <path d="M78,68 L70,60 L62,66" strokeWidth="0.8" opacity="0.6" />
          <path d="M125,130 L133,138 L128,146" strokeWidth="0.8" opacity="0.6" />
          <path d="M140,90 L148,82 L156,88" strokeWidth="0.8" opacity="0.6" />
          <path d="M60,115 L52,122 L44,115" strokeWidth="0.8" opacity="0.6" />
        </g>
      )}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VINYL RECORD SVG
// ─────────────────────────────────────────────────────────────────────────────
const VinylRecord = ({ lyrics, tapCount, spinning }) => {
  const circumference = 2 * Math.PI * 68; // textPath radius
  const safeText = lyrics
    ? (lyrics.length > 180 ? lyrics.slice(0, 180) + '…' : lyrics)
    : 'You are not your thoughts. You are not your thoughts. You are not your thoughts.';

  // Red inner glow intensity based on tap count
  const redGlow = tapCount >= 2
    ? 'drop-shadow(0 0 18px rgba(220,0,0,0.7)) drop-shadow(0 0 35px rgba(180,0,0,0.4))'
    : tapCount === 1
    ? 'drop-shadow(0 0 8px rgba(200,0,0,0.3))'
    : 'drop-shadow(0 0 20px rgba(99,179,237,0.15))';

  return (
    <div className="relative" style={{ width: 240, height: 240, filter: redGlow }}>
      <svg viewBox="0 0 200 200" width="240" height="240" style={{ borderRadius: '50%' }}>
        <defs>
          {/* Vinyl groove gradient */}
          <radialGradient id="vinylGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="40%" stopColor="#0d0d0d" />
            <stop offset="70%" stopColor="#141414" />
            <stop offset="85%" stopColor="#0a0a0a" />
            <stop offset="100%" stopColor="#1c1c1c" />
          </radialGradient>

          {/* Label gradient */}
          <radialGradient id="labelGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#0d1628" />
          </radialGradient>

          {/* Sheen */}
          <linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
            <stop offset="50%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
          </linearGradient>

          {/* Text path circle — wraps around label */}
          <path
            id="lyricsCircle"
            d="M 100,100 m -68,0 a 68,68 0 1,1 136,0 a 68,68 0 1,1 -136,0"
          />
        </defs>

        {/* Outer vinyl disc */}
        <circle cx="100" cy="100" r="97" fill="url(#vinylGrad)" />

        {/* Groove rings — subtle concentric circles */}
        {[85, 76, 67, 58, 49, 40].map((r, i) => (
          <circle
            key={i}
            cx="100" cy="100" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.6"
          />
        ))}

        {/* Sheen overlay */}
        <circle cx="100" cy="100" r="97" fill="url(#sheen)" />

        {/* Label area */}
        <circle cx="100" cy="100" r="36" fill="url(#labelGrad)" />
        <circle cx="100" cy="100" r="36" fill="none" stroke="rgba(99,179,237,0.2)" strokeWidth="0.8" />

        {/* Label inner ring */}
        <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(99,179,237,0.12)" strokeWidth="0.5" />

        {/* Spindle hole */}
        <circle cx="100" cy="100" r="3.5" fill="#000" />
        <circle cx="100" cy="100" r="2" fill="#111" />

        {/* Lyrics text path around the label */}
        <text
          fontSize="5.2"
          fill="rgba(148,190,240,0.75)"
          letterSpacing="0.5"
          fontFamily="'Georgia', serif"
        >
          <textPath href="#lyricsCircle" startOffset="0%">
            {safeText}
          </textPath>
        </text>

        {/* Label accent — tiny glowing dot */}
        <circle cx="100" cy="72" r="1.5" fill="rgba(99,179,237,0.6)" />

        {/* Subtle label text */}
        <text
          x="100" y="97"
          textAnchor="middle"
          fontSize="4"
          fill="rgba(99,179,237,0.45)"
          fontFamily="'Georgia', serif"
          letterSpacing="1"
        >
          THE SPIN DOWN
        </text>
        <text
          x="100" y="105"
          textAnchor="middle"
          fontSize="3"
          fill="rgba(99,179,237,0.3)"
          fontFamily="'Georgia', serif"
          letterSpacing="0.5"
        >
          SIDE A
        </text>

        {/* Outer edge rim highlight */}
        <circle cx="100" cy="100" r="97" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>

      {/* Crack overlay on top */}
      <CrackOverlay tapCount={tapCount} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SHATTER FRAGMENT
// ─────────────────────────────────────────────────────────────────────────────
const ShatterFragment = ({ index, total }) => {
  const angle = (index / total) * 360;
  const rad = (angle * Math.PI) / 180;
  const distance = 200 + Math.random() * 250;
  const tx = Math.cos(rad) * distance;
  const ty = Math.sin(rad) * distance + 150; // gravity pull downward
  const rotation = (Math.random() - 0.5) * 720;

  // Fragment shape varies
  const shapes = [
    'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    'polygon(50% 0%, 100% 100%, 0% 100%)',
    'polygon(20% 0%, 80% 0%, 100% 60%, 50% 100%, 0% 60%)',
    'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  ];
  const clipPath = shapes[index % shapes.length];
  const size = 28 + (index % 4) * 14;
  const delay = index * 0.035;

  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(from ${angle}deg, #0d0d0d, #1a1a1a, #111, #0a0a0a)`,
        clipPath,
        left: `calc(50% - ${size / 2}px)`,
        top: `calc(50% - ${size / 2}px)`,
        border: '1px solid rgba(220,50,50,0.4)',
        boxShadow: '0 0 8px rgba(200,0,0,0.3)',
      }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
      animate={{
        x: tx,
        y: ty,
        rotate: rotation,
        opacity: 0,
        scale: [1, 1.1, 0.3],
      }}
      transition={{
        duration: 1.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        opacity: { duration: 1.4, delay: delay + 0.4 },
      }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const TheSpinDown = () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [appState, setAppState] = useState('input'); // input | vinyl | shatter | sleep
  const [lyrics, setLyrics] = useState('');
  const [savedLyrics, setSavedLyrics] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Breathing
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathLabel, setBreathLabel] = useState('Breathe in…');
  const [cycleComplete, setCycleComplete] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);

  // Tap mechanic
  const [tapCount, setTapCount] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [shattering, setShattering] = useState(false);
  const [fadeToBlack, setFadeToBlack] = useState(false);

  // Audio
  const crackleRef = useRef(null);
  const shatterRef = useRef(null);
  const breathTimerRef = useRef(null);

  // ── Audio setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    crackleRef.current = new Audio('/audio/crackle.mp3');
    crackleRef.current.loop = true;
    crackleRef.current.volume = 0.18;

    shatterRef.current = new Audio('/audio/shatter.mp3');
    shatterRef.current.volume = 0.85;

    return () => {
      if (crackleRef.current) { crackleRef.current.pause(); crackleRef.current = null; }
      if (shatterRef.current) { shatterRef.current.pause(); shatterRef.current = null; }
    };
  }, []);

  // ── Breathing cycle engine ─────────────────────────────────────────────────
  const startBreathCycle = useCallback(() => {
    const phases = [
      { phase: 'inhale', label: 'Breathe in…', duration: 4000 },
      { phase: 'hold1',  label: 'Hold…',        duration: 4000 },
      { phase: 'exhale', label: 'Breathe out…', duration: 4000 },
      { phase: 'hold2',  label: 'Hold…',        duration: 4000 },
    ];

    let idx = 0;
    const advance = () => {
      const { phase, label, duration } = phases[idx];
      setBreathPhase(phase);
      setBreathLabel(label);
      idx++;
      if (idx < phases.length) {
        breathTimerRef.current = setTimeout(advance, duration);
      } else {
        // One full cycle complete
        setCycleComplete(true);
        setTimeout(() => setPromptVisible(true), 800);
      }
    };
    advance();
  }, []);

  // ── Enter vinyl state ──────────────────────────────────────────────────────
  const enterVinylState = useCallback(() => {
    setAppState('vinyl');
    // Start crackle audio
    if (crackleRef.current) {
      crackleRef.current.play().catch(() => {});
    }
    // Start breathing after 1.2s (record animation settles)
    setTimeout(startBreathCycle, 1200);
  }, [startBreathCycle]);

  // ── Save to Supabase ───────────────────────────────────────────────────────
  const handlePressOntoVinyl = async () => {
    if (!lyrics.trim()) return;
    setSaving(true);
    setSaveError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('anxiety_records').insert([{
        user_id: user?.id ?? null,
        lyrics: lyrics.trim(),
      }]);
      if (error) throw error;
    } catch (err) {
      // Non-blocking — still proceed to vinyl state
      setSaveError('Could not save (offline mode)');
      console.warn('Supabase save error:', err.message);
    }

    setSavedLyrics(lyrics.trim());
    setSaving(false);
    enterVinylState();
  };

  // ── Tap the record ─────────────────────────────────────────────────────────
  const handleRecordTap = useCallback(() => {
    if (!promptVisible || shattering) return;

    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount === 1) {
      setShaking(true);
      vibrate(50);
      setTimeout(() => setShaking(false), 220);
    } else if (newCount === 2) {
      setShaking(true);
      vibrate([100, 50, 100]);
      setTimeout(() => setShaking(false), 300);
    } else if (newCount >= 3) {
      // THE SHATTER
      setShattering(true);
      vibrate([200, 100, 200, 100, 300]);

      // Stop crackle, play shatter
      if (crackleRef.current) { crackleRef.current.pause(); }
      if (shatterRef.current) { shatterRef.current.play().catch(() => {}); }

      // Clear breath timer
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);

      setAppState('shatter');

      // Fade to black after fragments fly
      setTimeout(() => {
        setFadeToBlack(true);
        setTimeout(() => setAppState('sleep'), 2600);
      }, 1500);
    }
  }, [tapCount, promptVisible, shattering]);

  // ── Cleanup timers ─────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* ── AURORA BACKGROUND ── */}
      <AuroraBackground fadeToBlack={fadeToBlack} />

      {/* ════════════════════════════════════════════════════
          STATE 1 — INPUT
      ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {appState === 'input' && (
          <motion.div
            key="input-modal"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: -20, filter: 'blur(12px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            {/* Glassmorphism card */}
            <div
              className="rounded-3xl p-8 flex flex-col gap-6"
              style={{
                background: 'rgba(10, 15, 35, 0.72)',
                backdropFilter: 'blur(28px) saturate(160%)',
                WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                border: '1px solid rgba(99,179,237,0.14)',
                boxShadow: '0 8px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {/* Title */}
              <div className="text-center">
                <motion.p
                  className="text-xs tracking-[0.3em] uppercase mb-3"
                  style={{ color: 'rgba(99,179,237,0.55)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  The Spin Down
                </motion.p>
                <motion.h1
                  className="text-2xl sm:text-3xl font-light leading-snug"
                  style={{
                    color: 'rgba(226,232,240,0.95)',
                    textShadow: '0 0 40px rgba(99,179,237,0.2)',
                    fontFamily: "'Georgia', serif",
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  What's playing in your head tonight?
                </motion.h1>
              </div>

              {/* Textarea */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="relative"
              >
                <textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Type the thoughts on repeat… the worries, the what-ifs, the 3am spirals."
                  rows={5}
                  maxLength={280}
                  className="w-full resize-none outline-none bg-transparent text-base leading-relaxed placeholder-shown:text-slate-500"
                  style={{
                    color: 'rgba(203,213,225,0.9)',
                    fontFamily: "'Georgia', serif",
                    fontSize: '15px',
                    caretColor: 'rgba(99,179,237,0.8)',
                    borderBottom: '1px solid rgba(99,179,237,0.18)',
                    paddingBottom: '12px',
                  }}
                />
                {/* Character count */}
                <p
                  className="text-right text-xs mt-1"
                  style={{ color: 'rgba(100,116,139,0.7)' }}
                >
                  {lyrics.length} / 280
                </p>
              </motion.div>

              {/* Error message */}
              <AnimatePresence>
                {saveError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-amber-400/70 text-center -mt-2"
                  >
                    {saveError}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* CTA Button */}
              <motion.button
                onClick={handlePressOntoVinyl}
                disabled={!lyrics.trim() || saving}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(99,179,237,0.2)' }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl font-medium text-sm tracking-widest uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: saving
                    ? 'rgba(30,41,59,0.6)'
                    : 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))',
                  color: 'rgba(148,190,240,0.9)',
                  border: '1px solid rgba(99,179,237,0.22)',
                  boxShadow: '0 0 20px rgba(99,179,237,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
                  letterSpacing: '0.18em',
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-3 h-3 border border-blue-400/50 border-t-blue-300 rounded-full"
                    />
                    Pressing…
                  </span>
                ) : 'Press onto Vinyl'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════
          STATE 2 — VINYL RECORD + BREATHING
      ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {(appState === 'vinyl' || appState === 'shatter') && (
          <motion.div
            key="vinyl-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="relative z-10 flex flex-col items-center justify-center gap-8 w-full px-4"
          >
            {/* Particles layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
              <div className="relative w-full h-full">
                <BreathingOrb phase={breathPhase} />
                {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
                  <BreathingParticle
                    key={i}
                    index={i}
                    phase={breathPhase}
                    total={PARTICLE_COUNT}
                  />
                ))}
              </div>
            </div>

            {/* Record + shatter fragments */}
            <div className="relative flex items-center justify-center">
              {/* The spinning record */}
              <AnimatePresence>
                {appState !== 'shatter' || !shattering ? (
                  <motion.div
                    key="record"
                    initial={{ scale: 0.2, opacity: 0, rotate: -10 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      rotate: shaking ? [0, -4, 5, -6, 4, -3, 2, 0] : undefined,
                      x: shaking ? [0, -6, 8, -10, 7, -4, 3, 0] : undefined,
                    }}
                    exit={{ scale: 0.01, opacity: 0, transition: { duration: 0.15 } }}
                    transition={{
                      scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                      opacity: { duration: 0.9 },
                      rotate: shaking ? { duration: 0.25, ease: 'easeOut' } : undefined,
                      x: shaking ? { duration: 0.25, ease: 'easeOut' } : undefined,
                    }}
                    onClick={handleRecordTap}
                    style={{ cursor: promptVisible ? 'pointer' : 'default' }}
                  >
                    {/* Continuous spin wrapper */}
                    <motion.div
                      animate={appState === 'vinyl' ? { rotate: 360 } : {}}
                      transition={{
                        rotate: {
                          duration: 2.8,
                          repeat: Infinity,
                          ease: 'linear',
                        },
                      }}
                    >
                      <VinylRecord
                        lyrics={savedLyrics}
                        tapCount={tapCount}
                        spinning={appState === 'vinyl'}
                      />
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Shatter fragments */}
              {shattering && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: SHATTER_PIECES }, (_, i) => (
                    <ShatterFragment key={i} index={i} total={SHATTER_PIECES} />
                  ))}
                </div>
              )}
            </div>

            {/* Breathing instruction text */}
            <AnimatePresence mode="wait">
              {appState === 'vinyl' && (
                <motion.div
                  key="breath-ui"
                  className="text-center flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {/* Breath phase label */}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={breathPhase}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4 }}
                      className="text-sm tracking-[0.15em] uppercase"
                      style={{ color: 'rgba(148,190,240,0.65)' }}
                    >
                      {breathLabel}
                    </motion.p>
                  </AnimatePresence>

                  {/* Main tagline */}
                  <motion.p
                    className="text-lg sm:text-xl font-light"
                    style={{
                      color: 'rgba(203,213,225,0.7)',
                      fontFamily: "'Georgia', serif",
                      textShadow: '0 0 20px rgba(99,179,237,0.1)',
                    }}
                  >
                    You don't have to listen. Just breathe.
                  </motion.p>

                  {/* Tap prompt — appears after 1 full cycle */}
                  <AnimatePresence>
                    {promptVisible && tapCount < 3 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="mt-2 flex flex-col items-center gap-1"
                      >
                        <motion.p
                          className="text-sm tracking-wider"
                          style={{ color: 'rgba(99,179,237,0.75)' }}
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2.4, repeat: Infinity }}
                        >
                          Tap the record to break the loop.
                        </motion.p>
                        {/* Tap indicator dots */}
                        <div className="flex gap-2 mt-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: i < tapCount
                                  ? 'rgba(220,50,50,0.8)'
                                  : 'rgba(99,179,237,0.3)',
                                boxShadow: i < tapCount
                                  ? '0 0 6px rgba(220,50,50,0.6)'
                                  : 'none',
                              }}
                              animate={i < tapCount ? { scale: [1, 1.4, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════
          STATE 4 — SLEEP SCREEN
      ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {appState === 'sleep' && (
          <motion.div
            key="sleep-screen"
            className="relative z-20 flex flex-col items-center justify-center gap-6 text-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.4 }}
          >
            {/* Soft gray sleep text */}
            <motion.p
              className="text-2xl sm:text-3xl font-light leading-relaxed"
              style={{
                color: 'rgba(148,163,184,0.65)',
                fontFamily: "'Georgia', serif",
                textShadow: 'none',
                letterSpacing: '0.01em',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: 'easeOut', delay: 0.6 }}
            >
              The track is over.
              <br />
              <span style={{ color: 'rgba(100,116,139,0.5)', fontSize: '0.85em' }}>
                Time for sleep.
              </span>
            </motion.p>

            {/* Tiny restart affordance */}
            <motion.button
              onClick={() => {
                setAppState('input');
                setLyrics('');
                setSavedLyrics('');
                setTapCount(0);
                setShaking(false);
                setShattering(false);
                setFadeToBlack(false);
                setCycleComplete(false);
                setPromptVisible(false);
                setBreathPhase('inhale');
                setBreathLabel('Breathe in…');
                if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              whileHover={{ opacity: 0.65 }}
              transition={{ delay: 4, duration: 1.5 }}
              className="text-xs tracking-[0.25em] uppercase mt-8"
              style={{ color: 'rgba(100,116,139,0.7)' }}
            >
              play again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TheSpinDown;