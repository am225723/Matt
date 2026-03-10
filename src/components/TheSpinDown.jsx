import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const PARTICLE_COUNT = 28;
const SHATTER_PIECES = 12;

// Vibrate helper — safe on all platforms
const vibrate = (pattern) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch (_) {}
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// AI THOUGHT REFRAMING SERVICE
// ─────────────────────────────────────────────────────────────────────────────
const reframeThought = async (rawThoughts) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return getDefaultRef(rawThoughts);
  }

  const systemContext = `You are a compassionate cognitive defusion therapist helping someone with nighttime anxiety. Your task is to take their anxious, spiraling thoughts and transform them into a calming, defused perspective.

CRITICAL RULES:
1. Start by explicitly acknowledging the cognitive trap they've fallen into (e.g., "what-if spiral," "fortune-telling," "catastrophizing," "mind-reading")
2. Firmly but gently remind them that "What-ifs are lies your anxiety tells you — they are NOT predictions."
3. Use defusion language: "I notice I'm having the thought that..." instead of "I am..."
4. Be SHORT — 2-3 sentences maximum
5. End with a grounding reminder they can hold onto as they sleep

TONE: Warm, calming, non-judgmental, like a wise friend at 3am
Avoid toxic positivity. Validate that the fear feels real, then gently separate them from it.`;

  const userPrompt = `Transform this anxious thought spiral into a calming defusion statement. The person is trying to sleep and their brain won't shut off:

"${rawThoughts}"

Remind them explicitly that they CANNOT predict the future and that "what-ifs" are anxiety's lies, not facts. Keep it brief and comforting.`;

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/perplexity-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        systemContext,
        userPrompt,
        temperature: 0.6
      })
    });

    if (!response.ok) return getDefaultRef(rawThoughts);

    const data = await response.json();
    return data.content || getDefaultRef(rawThoughts);
  } catch (error) {
    console.warn('AI reframing failed, using fallback:', error);
    return getDefaultRef(rawThoughts);
  }
};

// Fallback defusion messages when AI unavailable
const getDefaultRef = (thoughts) => {
  const hasWhatIf = /what if/i.test(thoughts);
  const hasCatastrophizing = /always|never|ruined|disaster|fail/i.test(thoughts);
  const hasMindReading = /they think|everyone thinks|they'll judge/i.test(thoughts);

  if (hasWhatIf) {
    return "I notice I'm having 'what-if' thoughts. What-ifs are anxiety's lies — they feel like predictions, but they're just stories. I don't have a crystal ball. Right now, in this moment, I am safe.";
  }
  if (hasCatastrophizing) {
    return "I notice my mind jumping to the worst-case scenario. This is catastrophizing — a thought pattern, not a prophecy. The worst case is not the only case. I've gotten through hard things before.";
  }
  if (hasMindReading) {
    return "I notice I'm trying to read minds — assuming I know what others think. But I can't know their thoughts. That story is one I'm telling myself. Let me let that story go for tonight.";
  }
  return "I notice I'm having the thought that something is wrong. But a thought is just a thought — it's not a fact, not a command, not a prophecy. Tonight, I choose rest.";
};

// Detect cognitive traps
const analyzeCognitiveTraps = (text) => {
  const traps = [];
  if (/what if/i.test(text)) {
    traps.push({ name: 'What-If Spiral', description: "Your brain is trying to predict an unpredictable future" });
  }
  if (/always|never/i.test(text)) {
    traps.push({ name: 'All-or-Nothing', description: "Thinking in extremes cuts out the gray areas where life actually happens" });
  }
  if (/they think|everyone|people will/i.test(text)) {
    traps.push({ name: 'Mind-Reading', description: "You're assuming you know what others think — but you can't" });
  }
  if (/should have|could have|if only/i.test(text)) {
    traps.push({ name: 'Hindsight Trap', description: "Rewriting the past only steals from your present" });
  }
  if (/disaster|catastrophe|ruin|fail|lose everything/i.test(text)) {
    traps.push({ name: 'Catastrophizing', description: "Your mind is jumping to the worst-case — not the likely case" });
  }
  return traps;
};

// ─────────────────────────────────────────────────────────────────────────────
// AURORA BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
const AuroraBackground = ({ fadeToBlack, intensity = 1 }) => {
  return (
    <motion.div
      className="fixed inset-0 overflow-hidden"
      animate={fadeToBlack ? { backgroundColor: '#000000' } : {}}
      transition={{ duration: 2.5, ease: 'easeInOut' }}
    >
      {!fadeToBlack && (
        <>
          <div className="absolute inset-0 bg-[#020408]" />
          <motion.div
            className="absolute w-[900px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, #0d1b4b 0%, #050d2e 50%, transparent 70%)',
              filter: 'blur(80px)',
              top: '-10%',
              left: '-15%',
              opacity: 0.3 * intensity,
            }}
            animate={{ x: [0, 60, -30, 0], y: [0, 40, -20, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[700px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, #1a0a3d 0%, #0d0520 50%, transparent 70%)',
              filter: 'blur(100px)',
              top: '20%',
              right: '-10%',
              opacity: 0.25 * intensity,
            }}
            animate={{ x: [0, -50, 30, 0], y: [0, -30, 50, 0], scale: [1, 0.9, 1.05, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, #0f0f3d 0%, transparent 70%)',
              filter: 'blur(120px)',
              top: '40%',
              left: '35%',
              opacity: 0.15 * intensity,
            }}
            animate={{ scale: [1, 1.2, 0.85, 1], opacity: [0.15 * intensity, 0.22 * intensity, 0.10 * intensity, 0.15 * intensity] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
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
      case 'inhale': return { x: Math.cos(angle) * (baseRadius * 0.45), y: Math.sin(angle) * (baseRadius * 0.45), opacity: 0.9, scale: 1.4 };
      case 'hold1':
      case 'hold2': return { x: Math.cos(angle) * (baseRadius * 0.55), y: Math.sin(angle) * (baseRadius * 0.55), opacity: 0.7, scale: 1.0 };
      case 'exhale': return { x: Math.cos(angle) * (baseRadius * 0.95), y: Math.sin(angle) * (baseRadius * 0.95), opacity: 0.35, scale: 0.7 };
      default: return { x: Math.cos(angle) * (baseRadius * 0.7), y: Math.sin(angle) * (baseRadius * 0.7), opacity: 0.55, scale: 1.0 };
    }
  };

  const state = getParticleState();
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
      transition={{ duration: 4, ease: phase === 'inhale' ? 'easeIn' : phase === 'exhale' ? 'easeOut' : 'easeInOut' }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BREATHING ORB
// ─────────────────────────────────────────────────────────────────────────────
const BreathingOrb = ({ phase }) => {
  const getOrbState = () => {
    switch (phase) {
      case 'inhale': return { scale: 1.25, opacity: 0.55 };
      case 'hold1': return { scale: 1.2, opacity: 0.45 };
      case 'exhale': return { scale: 0.85, opacity: 0.2 };
      case 'hold2': return { scale: 0.88, opacity: 0.25 };
      default: return { scale: 1.0, opacity: 0.35 };
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
      transition={{ duration: 4 }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COGNITIVE TRAP BADGE
// ─────────────────────────────────────────────────────────────────────────────
const CognitiveTrapBadge = ({ trap, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.15 }}
    className="px-3 py-1.5 rounded-full text-xs"
    style={{
      background: 'rgba(239, 68, 68, 0.15)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      color: 'rgba(252, 165, 165, 0.9)',
    }}
  >
    {trap.name}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SVG CRACK OVERLAYS
// ─────────────────────────────────────────────────────────────────────────────
const CrackOverlay = ({ tapCount }) => {
  if (tapCount === 0) return null;
  return (
    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none', borderRadius: '50%' }}>
      {tapCount >= 1 && (
        <g stroke="rgba(220,50,50,0.85)" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M100,100 L115,72 L108,55 L125,38" />
          <path d="M100,100 L118,115 L130,108" />
          <path d="M100,100 L83,88 L70,95 L55,78" />
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
          <circle cx="100" cy="100" r="18" stroke="rgba(200,0,0,0.4)" strokeWidth="6" fill="rgba(180,0,0,0.08)" />
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
const VinylRecord = ({ lyrics, tapCount }) => {
  const safeText = lyrics
    ? (lyrics.length > 180 ? lyrics.slice(0, 180) + '…' : lyrics)
    : 'You are not your thoughts. You are not your thoughts. You are not your thoughts.';

  const redGlow = tapCount >= 2
    ? 'drop-shadow(0 0 18px rgba(220,0,0,0.7)) drop-shadow(0 0 35px rgba(180,0,0,0.4))'
    : tapCount === 1
    ? 'drop-shadow(0 0 8px rgba(200,0,0,0.3))'
    : 'drop-shadow(0 0 20px rgba(99,179,237,0.15))';

  return (
    <div className="relative" style={{ width: 240, height: 240, filter: redGlow }}>
      <svg viewBox="0 0 200 200" width="240" height="240" style={{ borderRadius: '50%' }}>
        <defs>
          <radialGradient id="vinylGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="40%" stopColor="#0d0d0d" />
            <stop offset="70%" stopColor="#141414" />
            <stop offset="85%" stopColor="#0a0a0a" />
            <stop offset="100%" stopColor="#1c1c1c" />
          </radialGradient>
          <radialGradient id="labelGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#0d1628" />
          </radialGradient>
          <linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
            <stop offset="50%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
          </linearGradient>
          <path id="lyricsCircle" d="M 100,100 m -68,0 a 68,68 0 1,1 136,0 a 68,68 0 1,1 -136,0" />
        </defs>

        <circle cx="100" cy="100" r="97" fill="url(#vinylGrad)" />
        {[85, 76, 67, 58, 49, 40].map((r, i) => (
          <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
        ))}
        <circle cx="100" cy="100" r="97" fill="url(#sheen)" />
        <circle cx="100" cy="100" r="36" fill="url(#labelGrad)" />
        <circle cx="100" cy="100" r="36" fill="none" stroke="rgba(99,179,237,0.2)" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(99,179,237,0.12)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="3.5" fill="#000" />
        <circle cx="100" cy="100" r="2" fill="#111" />

        <text fontSize="5.2" fill="rgba(148,190,240,0.75)" letterSpacing="0.5" fontFamily="'Georgia', serif">
          <textPath href="#lyricsCircle" startOffset="0%">{safeText}</textPath>
        </text>

        <circle cx="100" cy="72" r="1.5" fill="rgba(99,179,237,0.6)" />
        <text x="100" y="97" textAnchor="middle" fontSize="4" fill="rgba(99,179,237,0.45)" fontFamily="'Georgia', serif" letterSpacing="1">THE SPIN DOWN</text>
        <text x="100" y="105" textAnchor="middle" fontSize="3" fill="rgba(99,179,237,0.3)" fontFamily="'Georgia', serif" letterSpacing="0.5">SIDE A</text>
        <circle cx="100" cy="100" r="97" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>
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
  const ty = Math.sin(rad) * distance + 150;
  const rotation = (Math.random() - 0.5) * 720;

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
      animate={{ x: tx, y: ty, rotate: rotation, opacity: 0, scale: [1, 1.1, 0.3] }}
      transition={{ duration: 1.4, delay, ease: [0.25, 0.46, 0.45, 0.94], opacity: { duration: 1.4, delay: delay + 0.4 } }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const TheSpinDown = () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [appState, setAppState] = useState('input');
  const [lyrics, setLyrics] = useState('');
  const [savedLyrics, setSavedLyrics] = useState('');
  const [saving, setSaving] = useState(false);

  // AI Reframing
  const [cognitiveTraps, setCognitiveTraps] = useState([]);
  const [reframedThought, setReframedThought] = useState('');
  const [isReframing, setIsReframing] = useState(false);

  // Breathing
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathLabel, setBreathLabel] = useState('Breathe in…');
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

  // ── Analyze cognitive traps on input change ────────────────────────────────
  useEffect(() => {
    if (lyrics.length > 10) {
      const traps = analyzeCognitiveTraps(lyrics);
      setCognitiveTraps(traps);
    } else {
      setCognitiveTraps([]);
    }
  }, [lyrics]);

  // ── Breathing cycle engine ─────────────────────────────────────────────────
  const startBreathCycle = useCallback(() => {
    const phases = [
      { phase: 'inhale', label: 'Breathe in…', duration: 4000 },
      { phase: 'hold1', label: 'Hold…', duration: 4000 },
      { phase: 'exhale', label: 'Breathe out…', duration: 4000 },
      { phase: 'hold2', label: 'Hold…', duration: 4000 },
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
        setTimeout(() => setPromptVisible(true), 800);
      }
    };
    advance();
  }, []);

  // ── Enter vinyl state with AI reframing ────────────────────────────────────
  const enterVinylState = useCallback(async () => {
    setAppState('vinyl');
    if (crackleRef.current) crackleRef.current.play().catch(() => {});

    // Start AI reframing in background
    if (savedLyrics) {
      setIsReframing(true);
      try {
        const reframed = await reframeThought(savedLyrics);
        setReframedThought(reframed);
      } catch (_) {
        setReframedThought(getDefaultRef(savedLyrics));
      }
      setIsReframing(false);
    }

    setTimeout(startBreathCycle, 1200);
  }, [savedLyrics, startBreathCycle]);

  // ── Save to Supabase ───────────────────────────────────────────────────────
  const handlePressOntoVinyl = async () => {
    if (!lyrics.trim()) return;
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('anxiety_records').insert([{
        user_id: user?.id ?? null,
        lyrics: lyrics.trim(),
      }]);
    } catch (err) {
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
      setShattering(true);
      vibrate([200, 100, 200, 100, 300]);
      if (crackleRef.current) crackleRef.current.pause();
      if (shatterRef.current) shatterRef.current.play().catch(() => {});
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
      setAppState('shatter');
      setTimeout(() => {
        setFadeToBlack(true);
        setTimeout(() => setAppState('sleep'), 2600);
      }, 1500);
    }
  }, [tapCount, promptVisible, shattering]);

  // ── Cleanup ───────────────────────────────────────────────────────────────
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
      <AuroraBackground fadeToBlack={fadeToBlack} intensity={appState === 'input' ? 1 : 0.7} />

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
            <div
              className="rounded-3xl p-8 flex flex-col gap-5"
              style={{
                background: 'rgba(10, 15, 35, 0.72)',
                backdropFilter: 'blur(28px) saturate(160%)',
                border: '1px solid rgba(99,179,237,0.14)',
                boxShadow: '0 8px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {/* Title */}
              <div className="text-center">
                <motion.p
                  className="text-xs tracking-[0.3em] uppercase mb-3"
                  style={{ color: 'rgba(99,179,237,0.55)' }}
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
                >
                  What's playing in your head tonight?
                </motion.h1>
              </div>

              {/* Textarea */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="relative"
              >
                <textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Type the thoughts on repeat… the worries, the what-ifs, the 3am spirals."
                  rows={5}
                  maxLength={280}
                  className="w-full resize-none outline-none bg-transparent text-base leading-relaxed"
                  style={{
                    color: 'rgba(203,213,225,0.9)',
                    fontFamily: "'Georgia', serif",
                    caretColor: 'rgba(99,179,237,0.8)',
                    borderBottom: '1px solid rgba(99,179,237,0.18)',
                    paddingBottom: '12px',
                  }}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>
                    {lyrics.length} / 280
                  </p>
                </div>
              </motion.div>

              {/* Cognitive Trap Detection */}
              <AnimatePresence>
                {cognitiveTraps.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 items-center"
                  >
                    <span className="text-xs text-slate-400 mr-1">Detected:</span>
                    {cognitiveTraps.map((trap, i) => (
                      <CognitiveTrapBadge key={trap.name} trap={trap} index={i} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Warning message about what-ifs */}
              {lyrics.toLowerCase().includes('what if') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-xl text-sm"
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: 'rgba(252, 165, 165, 0.85)',
                  }}
                >
                  ⚠️ <strong>What-ifs are lies anxiety tells you.</strong> They feel like predictions, but they're just stories. You cannot know the future — no one can.
                </motion.div>
              )}

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
                  boxShadow: '0 0 20px rgba(99,179,237,0.08)',
                }}
              >
                {saving ? 'Pressing…' : 'Press onto Vinyl'}
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
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center justify-center gap-8 w-full px-4"
          >
            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
              <BreathingOrb phase={breathPhase} />
              {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
                <BreathingParticle key={i} index={i} phase={breathPhase} total={PARTICLE_COUNT} />
              ))}
            </div>

            {/* Record */}
            <div className="relative flex items-center justify-center">
              <AnimatePresence>
                {appState !== 'shatter' || !shattering ? (
                  <motion.div
                    key="record"
                    initial={{ scale: 0.2, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      rotate: shaking ? [0, -4, 5, -6, 4, -3, 2, 0] : undefined,
                      x: shaking ? [0, -6, 8, -10, 7, -4, 3, 0] : undefined,
                    }}
                    exit={{ scale: 0.01, opacity: 0 }}
                    onClick={handleRecordTap}
                    style={{ cursor: promptVisible ? 'pointer' : 'default' }}
                  >
                    <motion.div
                      animate={appState === 'vinyl' ? { rotate: 360 } : {}}
                      transition={{ rotate: { duration: 2.8, repeat: Infinity, ease: 'linear' } }}
                    >
                      <VinylRecord lyrics={savedLyrics} tapCount={tapCount} />
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {shattering && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: SHATTER_PIECES }, (_, i) => (
                    <ShatterFragment key={i} index={i} total={SHATTER_PIECES} />
                  ))}
                </div>
              )}
            </div>

            {/* Breathing UI */}
            <AnimatePresence mode="wait">
              {appState === 'vinyl' && (
                <motion.div
                  key="breath-ui"
                  className="text-center flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={breathPhase}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="text-sm tracking-[0.15em] uppercase"
                      style={{ color: 'rgba(148,190,240,0.65)' }}
                    >
                      {breathLabel}
                    </motion.p>
                  </AnimatePresence>

                  <motion.p
                    className="text-lg sm:text-xl font-light"
                    style={{ color: 'rgba(203,213,225,0.7)', fontFamily: "'Georgia', serif" }}
                  >
                    You don't have to listen. Just breathe.
                  </motion.p>

                  <AnimatePresence>
                    {promptVisible && tapCount < 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 flex flex-col items-center gap-1"
                      >
                        <motion.p
                          className="text-sm"
                          style={{ color: 'rgba(99,179,237,0.75)' }}
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2.4, repeat: Infinity }}
                        >
                          Tap the record to break the loop.
                        </motion.p>
                        <div className="flex gap-2 mt-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: i < tapCount ? 'rgba(220,50,50,0.8)' : 'rgba(99,179,237,0.3)',
                                boxShadow: i < tapCount ? '0 0 6px rgba(220,50,50,0.6)' : 'none',
                              }}
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
          STATE 4 — SLEEP SCREEN (with AI reframed message)
      ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {appState === 'sleep' && (
          <motion.div
            key="sleep-screen"
            className="relative z-20 flex flex-col items-center justify-center gap-6 text-center px-8 max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, delay: 0.4 }}
          >
            {/* AI Reframed Thought */}
            {reframedThought && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, delay: 0.8 }}
                className="mb-4"
              >
                <p
                  className="text-base sm:text-lg font-light leading-relaxed"
                  style={{
                    color: 'rgba(148,163,184,0.6)',
                    fontFamily: "'Georgia', serif",
                    fontStyle: 'italic',
                  }}
                >
                  "{reframedThought}"
                </p>
              </motion.div>
            )}

            {/* Main sleep message */}
            <motion.p
              className="text-2xl sm:text-3xl font-light leading-relaxed"
              style={{ color: 'rgba(148,163,184,0.65)', fontFamily: "'Georgia', serif" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, delay: 1.2 }}
            >
              The track is over.
              <br />
              <span style={{ color: 'rgba(100,116,139,0.5)', fontSize: '0.85em' }}>
                Time for sleep.
              </span>
            </motion.p>

            {/* Restart */}
            <motion.button
              onClick={() => {
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
                setBreathLabel('Breathe in…');
                if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              whileHover={{ opacity: 0.65 }}
              transition={{ delay: 4 }}
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