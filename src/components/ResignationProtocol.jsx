import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, Flame, FileText, X, Sparkles, Award, Stamp, Archive, Trash2, Eye, Calendar, Mail, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { saveResignation, getResignations, deleteResignation } from '@/lib/supabase';

const ADDRESSEE_OPTIONS = [
  "To Whom It Definitely Concerns",
  "The Board of Self-Sabotage",
  "The Department of Unrealistic Expectations",
  "The Committee That Lives in My Head",
  "The Management of My Own Worst Nightmare",
  "Human Resources of Self-Destruction",
  "The CEO of My Anxiety",
  "The Shareholders of My Self-Doubt",
  "The Inner Circle of Critics",
  "Everyone I've Ever Disappointed (real or imagined)",
  "The Audience That Doesn't Actually Exist",
  "The Imaginary Judges in Every Room",
  "The Panel of People Who Aren't Watching",
  "The Spotlight That Only I Can See"
];

const ROLE_OPTIONS = [
  "General Manager of the Universe",
  "Chief Fixer of Everything",
  "The Emotional Sponge",
  "The Peacekeeper",
  "Director of Other People's Happiness",
  "CEO of Everyone's Problems But My Own",
  "Head of the Overthinking Department",
  "Chief Worrier",
  "President of the I'm Fine Foundation",
  "The Family Therapist (unlicensed, unpaid)",
  "Manager of Catastrophic Expectations",
  "Supervisor of Walking on Eggshells",
  "Director of the Spotlight Effect",
  "Chief Performance Officer (for an audience of zero)",
  "Head of Imaginary Judgment",
  "Manager of What Everyone Thinks (spoiler: they don't)",
  "VP of Living for Others' Opinions",
  "Curator of Embarrassing Moments No One Remembers"
];

const PAID_IN_OPTIONS = [
  "Panic attacks",
  "Resentment",
  "Fake smiles",
  "Sleepless nights",
  "Chronic exhaustion",
  "Stomach knots",
  "Passive-aggressive emails",
  "Guilt trips",
  "Silent treatments",
  "Unreturned favors",
  "Broken promises",
  "Toxic positivity",
  "Constant performance anxiety",
  "Replaying conversations at 3am",
  "Rehearsing hypothetical arguments",
  "Second-guessing every word I said",
  "Assuming everyone's judging me",
  "Social autopsy of every interaction",
  "The fear of being 'too much'",
  "Shrinking to make others comfortable"
];

const INSTEAD_OF_OPTIONS = [
  "Authenticity",
  "Rest",
  "Joy",
  "Genuine connection",
  "Peaceful sleep",
  "Reciprocity",
  "Boundaries",
  "Self-respect",
  "Actual gratitude",
  "Honest conversations",
  "Time for myself",
  "My own dreams",
  "The freedom to be imperfect",
  "Permission to take up space",
  "Living without an audience",
  "Being gloriously unremarkable",
  "The luxury of not caring",
  "Main character energy (for myself only)",
  "Existing without explanation",
  "The peace of being forgotten sometimes"
];

const CONDITION_OPTIONS = [
  "A limbo contest with a crumb (my standards won)",
  "A staph infection of the soul",
  "A trust fall with no one there to catch",
  "A copay that costs my entire sanity",
  "An open wound I keep picking",
  "A break room where I only break promises to myself",
  "A retirement plan with no return on investment",
  "A performance review that only counts mistakes",
  "A stage with no audience but plenty of stage fright",
  "A spotlight that only I can see shining on me",
  "A theater where I'm the only one watching my own show",
  "A standing ovation from people who weren't even looking",
  "A viral moment that exists only in my head"
];

const KEYS_OPTIONS = [
  "The Photocopying Machine of My Regrets",
  "The Filing Cabinet of Things I Should've Said",
  "The Break Room of Broken Promises",
  "The Conference Room of Catastrophizing",
  "The Corner Office of Imposter Syndrome",
  "The Parking Lot Where I Cry Before Work",
  "The Inbox of Unsent Boundaries",
  "The Desk Drawer of Suppressed Feelings",
  "The Spotlight That Was Never Actually On",
  "The Audience Seating (always empty)",
  "The Recording Studio of Imaginary Judgment",
  "The Gallery of Perceived Stares",
  "The Archive of Conversations Nobody Remembers But Me"
];

const RESPONSIBILITIES_TO_STRIKE = [
  "Fixing everyone else's problems while ignoring my own",
  "Being available 24/7 for emotional emergencies",
  "Reading minds and anticipating needs before they're spoken",
  "Apologizing for things that aren't my fault",
  "Making everyone comfortable at my own expense",
  "Keeping the peace at the cost of my sanity",
  "Carrying secrets that aren't mine to hold",
  "Managing other adults' emotions",
  "Performing for an audience that doesn't exist",
  "Rehearsing every conversation before and after it happens",
  "Assuming everyone noticed that one awkward thing I did",
  "Living as if someone is always watching and judging",
  "Editing myself to be more palatable to strangers",
  "Carrying the weight of opinions that were never spoken",
  "Being the star of a show no one bought tickets to",
  "Cringing at memories that others forgot 5 minutes later"
];

const NEW_POSITION_OPTIONS = [
  "Someone Who Finally Puts Themselves First",
  "Director of Actually Resting",
  "CEO of Not My Problem Anymore",
  "Head of Healthy Boundaries",
  "Chief Officer of Self-Compassion",
  "Manager of My Own Happiness",
  "President of Saying No Without Guilt",
  "Just Me (No Title Required)",
  "Chief Officer of Not Caring What Others Think",
  "Director of Living Without an Audience",
  "VP of Remembering That Nobody's Watching",
  "Head of 'They Forgot About It 5 Minutes Later'",
  "Manager of Taking Up Space Unapologetically",
  "President of the 'Nobody's Thinking About Me' Club",
  "CEO of Main Character Energy (for myself only)",
  "Someone Who Exists Without Performing"
];

const DURATION_OPTIONS = [
  "far too long",
  "my entire adult life",
  "since before I can remember",
  "approximately forever",
  "longer than any reasonable person should",
  "since I learned to put others first",
  "since childhood",
  "decades of thankless service"
];

const HARM_OPTIONS = [
  "my mental health",
  "my sense of self",
  "my relationships",
  "my sleep",
  "my nervous system",
  "my ability to relax",
  "my capacity for joy",
  "my physical wellbeing",
  "my self-esteem",
  "my peace of mind"
];

const DISCOVERY_OPTIONS = [
  "nobody actually cares as much as I thought",
  "the spotlight was never really on me",
  "I was the only one keeping score",
  "most people are too busy with their own lives to judge mine",
  "perfection was never the requirement I thought it was",
  "I've been performing for an empty theater",
  "the criticism I feared was mostly in my head"
];

const REGRET_OPTIONS = [
  "shrinking myself to fit into spaces that were never meant for me",
  "apologizing for existing",
  "putting everyone else's needs before my own",
  "believing I wasn't enough",
  "living according to someone else's expectations",
  "waiting for permission to be myself",
  "letting fear make my decisions"
];

const BENEFIT_OPTIONS = [
  "peace of mind",
  "actual rest",
  "self-acceptance",
  "authentic connections",
  "the freedom to be imperfect",
  "time for what truly matters",
  "the ability to say no",
  "guilt-free boundaries"
];

const playThudSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.15);
    
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.6, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
    
    if (navigator.vibrate) {
      navigator.vibrate([30, 20, 50]);
    }
  } catch (e) {
    if (navigator.vibrate) {
      navigator.vibrate([30, 20, 50]);
    }
  }
};

const playFireSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = audioContext.sampleRate * 2;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.3;
    }
    
    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    
    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(200, audioContext.currentTime);
    lowpass.frequency.linearRampToValueAtTime(100, audioContext.currentTime + 2);
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
    
    whiteNoise.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    whiteNoise.start();
    whiteNoise.stop(audioContext.currentTime + 2);
    
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200, 100, 300]);
    }
  } catch (e) {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200, 100, 300]);
    }
  }
};

const playDrawerSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
    
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.8, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    if (navigator.vibrate) {
      navigator.vibrate([80, 30, 150]);
    }
  } catch (e) {
    if (navigator.vibrate) {
      navigator.vibrate([80, 30, 150]);
    }
  }
};

const playSealSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
    
    if (navigator.vibrate) {
      navigator.vibrate([50]);
    }
  } catch (e) {
    if (navigator.vibrate) {
      navigator.vibrate([50]);
    }
  }
};

const FloatingParticle = ({ delay }) => (
  <motion.div
    className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
    initial={{ 
      x: Math.random() * 100 - 50,
      y: 100,
      opacity: 0 
    }}
    animate={{ 
      y: -100,
      opacity: [0, 1, 0],
      x: Math.random() * 200 - 100
    }}
    transition={{
      duration: 4 + Math.random() * 2,
      delay: delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }}
  />
);

const SealOfApproval = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      playSealSound();
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
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
        className="relative"
        initial={{ scale: 3, opacity: 0, rotate: -45 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: 0.2 
        }}
      >
        <motion.div
          className="w-48 h-48 relative"
          animate={{ 
            boxShadow: ['0 0 0 0 rgba(220, 38, 38, 0.4)', '0 0 60px 30px rgba(220, 38, 38, 0.2)', '0 0 0 0 rgba(220, 38, 38, 0)']
          }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-2xl" />
          <div className="absolute inset-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <Stamp className="w-16 h-16 text-red-200 mb-1" />
            <span className="text-red-100 font-mono text-xs font-bold tracking-wider">APPROVED</span>
          </div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent rounded-full"
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: [0, 0.5, 0], rotate: 45 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>
        
        <motion.p
          className="text-center text-white font-mono text-xl mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Your resignation is official.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

const FullLetterDisplay = ({ formData, signatureData, onContinue }) => {
  const [showSeal, setShowSeal] = useState(false);
  const [sealComplete, setSealComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSeal(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const FilledText = ({ children }) => (
    <span className="font-caveat text-2xl sm:text-3xl text-indigo-800 font-semibold underline decoration-indigo-300 decoration-2 underline-offset-4 bg-indigo-50 px-1 rounded">
      {children}
    </span>
  );

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-slate-100 overflow-auto py-6 px-3 sm:py-8 sm:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="bg-white rounded-xl shadow-2xl p-6 sm:p-10 relative border-2 border-slate-200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-8 pb-6 border-b-4 border-slate-900">
            <h1 className="font-mono text-2xl sm:text-4xl text-slate-900 font-black tracking-widest uppercase">
              Letter of Resignation
            </h1>
            <p className="font-mono text-base text-slate-700 mt-3 font-semibold">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className="space-y-6 text-slate-900 text-lg sm:text-xl leading-loose">
            <p className="font-bold text-xl sm:text-2xl">
              TO: <FilledText>{formData.addressee}</FilledText>
            </p>

            <p className="mt-8">
              Please accept this letter as formal notification that I am resigning from my position as <FilledText>{formData.role}</FilledText>, effective immediately.
            </p>

            <p>
              I have held this position for <FilledText>{formData.duration}</FilledText>. During this time, the role has caused significant damage to <FilledText>{formData.harm}</FilledText>.
            </p>

            <p>
              After careful consideration, I have concluded that this role no longer serves my well-being, my growth, or my fundamental right to exist without constant self-surveillance.
            </p>

            <p>
              The working conditions have become <FilledText>{formData.condition}</FilledText>.
            </p>

            <p>
              For too long, I have been compensated exclusively in <FilledText>{formData.paidIn}</FilledText>, when what I truly deserved was <FilledText>{formData.insteadOf}</FilledText>. This is an unacceptable return on investment for a position I never actually applied for.
            </p>

            <p className="font-semibold italic border-l-4 border-amber-500 pl-4 bg-amber-50 py-2">
              I understand it's customary to give two weeks notice, but I've only got two minutes. The urgency of my departure cannot be overstated.
            </p>

            <p>
              Effective immediately, I am returning the keys to <FilledText>{formData.returningKeys}</FilledText>. I will not be taking any work home with me, as I have been doing so unconsciously for far too long already.
            </p>

            {formData.struckResponsibilities.length > 0 && (
              <div className="my-8 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="font-bold mb-4 text-red-900 text-xl">Furthermore, I will NO LONGER be responsible for:</p>
                <ul className="list-none space-y-3">
                  {formData.struckResponsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" strokeWidth={3} />
                      <span className="line-through text-red-700 decoration-red-600 decoration-[3px] text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p>
              Through this resignation, I have come to realize that <FilledText>{formData.discovery}</FilledText>.
            </p>

            <p>
              My only regret is <FilledText>{formData.regret}</FilledText>. But I am choosing to forgive myself and move forward.
            </p>

            <p className="font-semibold">
              It is my strong suggestion that this position be eliminated altogether. It should never have existed in the first place, and I refuse to train my replacement.
            </p>

            <p>
              Moving forward, I will be accepting a new position as <FilledText>{formData.newPosition}</FilledText>. This new role comes with <FilledText>{formData.benefit}</FilledText>, and the radical freedom of being imperfect.
            </p>

            <p className="font-medium italic text-slate-700">
              Please do not contact me regarding this matter. My inbox is now reserved for things that actually matter.
            </p>

            <div className="mt-10 pt-6 border-t-2 border-slate-300">
              <p className="font-bold text-xl mb-6">
                Respectfully (but not apologetically),
              </p>

              <div className="relative">
                {signatureData && (
                  <img 
                    src={signatureData} 
                    alt="Signature" 
                    className="h-28 object-contain"
                  />
                )}
                <div className="border-b-4 border-slate-900 w-72 mt-2" />
                <p className="text-base text-slate-700 mt-2 font-semibold">The Undersigned</p>
              </div>
            </div>
          </div>

          {sealComplete && (
            <motion.div
              className="absolute bottom-6 right-6 w-28 h-28"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-xl" />
              <div className="absolute inset-3 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center flex-col">
                <Stamp className="w-10 h-10 text-red-200" />
                <span className="text-red-100 text-[10px] font-bold tracking-wider">APPROVED</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {sealComplete && (
          <motion.div
            className="text-center mt-8 pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={onContinue}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xl px-10 py-7 shadow-xl"
            >
              <Mail className="w-6 h-6 mr-3" />
              Seal & Send
            </Button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showSeal && !sealComplete && (
          <SealOfApproval onComplete={() => setSealComplete(true)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EnvelopeAnimation = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),    // Bottom flap folds
      setTimeout(() => setPhase(2), 1200),   // Left & right flaps fold
      setTimeout(() => setPhase(3), 1800),   // Top flap folds
      setTimeout(() => setPhase(4), 2400),   // Wax seal drips
      setTimeout(() => setPhase(5), 3600),   // Wax seal solidifies
      setTimeout(() => onComplete(), 4400)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative w-96 h-full flex items-center justify-center">
        <div className="relative w-80 h-96">
          {/* Envelope back */}
          <motion.div
            className="absolute w-64 h-80 bg-gradient-to-br from-amber-100 to-amber-150 rounded-lg shadow-2xl"
            style={{ left: 'calc(50% - 128px)', top: 'calc(50% - 160px)' }}
          />

          {/* Bottom flap */}
          <motion.div
            className="absolute w-64 h-32 bg-gradient-to-t from-amber-200 to-amber-100 origin-bottom"
            style={{
              left: 'calc(50% - 128px)',
              top: 'calc(50% - 160px)',
              clipPath: 'polygon(0 100%, 0 0, 100% 0, 100% 100%)'
            }}
            initial={{ rotateX: 0, y: 0 }}
            animate={
              phase >= 1 
                ? { rotateX: -75, y: -10 }
                : { rotateX: 0, y: 0 }
            }
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />

          {/* Left flap */}
          <motion.div
            className="absolute w-32 h-80 bg-gradient-to-r from-amber-200 to-amber-100 origin-left"
            style={{
              left: 'calc(50% - 128px)',
              top: 'calc(50% - 160px)',
              clipPath: 'polygon(100% 0, 0 0, 0 100%, 100% 100%)'
            }}
            initial={{ rotateY: 0, x: 0 }}
            animate={
              phase >= 2
                ? { rotateY: -80, x: 5 }
                : { rotateY: 0, x: 0 }
            }
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />

          {/* Right flap */}
          <motion.div
            className="absolute w-32 h-80 bg-gradient-to-l from-amber-200 to-amber-100 origin-right"
            style={{
              right: 'calc(50% - 128px)',
              top: 'calc(50% - 160px)',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            }}
            initial={{ rotateY: 0, x: 0 }}
            animate={
              phase >= 2
                ? { rotateY: 80, x: -5 }
                : { rotateY: 0, x: 0 }
            }
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />

          {/* Top flap (triangular) */}
          <motion.div
            className="absolute w-64 h-32 bg-gradient-to-b from-amber-200 to-amber-100 origin-top"
            style={{
              left: 'calc(50% - 128px)',
              top: 'calc(50% - 160px)',
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)'
            }}
            initial={{ rotateX: 0, y: 0 }}
            animate={
              phase >= 3
                ? { rotateX: 75, y: 10 }
                : { rotateX: 0, y: 0 }
            }
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />

          {/* Sealed envelope front */}
          {phase >= 3 && (
            <motion.div
              className="absolute w-64 h-80 bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg shadow-2xl border-2 border-amber-300"
              style={{ left: 'calc(50% - 128px)', top: 'calc(50% - 160px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Wax seal dripping effect */}
          {phase >= 4 && (
            <>
              {/* Dripping wax drops */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`drip-${i}`}
                  className="absolute w-3 h-3 bg-gradient-to-b from-red-500 to-red-700 rounded-full"
                  style={{
                    left: 'calc(50% - 6px + ' + (Math.random() * 20 - 10) + 'px)',
                    top: 'calc(50% - 120px)'
                  }}
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{
                    opacity: [1, 0.8, 0],
                    y: [0, 40, 80],
                    scale: [0.5, 1, 0.8]
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "easeIn"
                  }}
                />
              ))}

              {/* Main wax seal blob forming */}
              <motion.div
                className="absolute w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-full shadow-lg"
                style={{
                  left: 'calc(50% - 40px)',
                  top: 'calc(50% - 90px)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={phase >= 4 ? { scale: 1, opacity: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
              />
            </>
          )}

          {/* Wax seal final state */}
          {phase >= 5 && (
            <motion.div
              className="absolute w-20 h-20 flex items-center justify-center"
              style={{
                left: 'calc(50% - 40px)',
                top: 'calc(50% - 90px)'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-900 rounded-full shadow-2xl" />
                <div className="absolute inset-3 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                  <Stamp className="w-10 h-10 text-red-100 drop-shadow-lg" />
                </div>
                {/* Wax shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}

          {/* Completion message */}
          {phase >= 5 && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-end pb-12 pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Send className="w-16 h-16 text-amber-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Sealed with Wax</h2>
              <p className="text-amber-200 font-mono text-sm">Your resignation is official...</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const BurnAnimation = ({ onComplete, formData }) => {
  const [phase, setPhase] = useState(0);
  const [canFlick, setCanFlick] = useState(false);
  const [flicked, setFlicked] = useState(false);
  const ballY = useMotionValue(0);
  const ballX = useMotionValue(0);
  
  useEffect(() => {
    playFireSound();
    const timer = setTimeout(() => setCanFlick(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (flicked) {
      const timers = [
        setTimeout(() => setPhase(1), 300),
        setTimeout(() => setPhase(2), 1500),
        setTimeout(() => setPhase(3), 3000),
        setTimeout(() => onComplete(), 5000)
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [flicked, onComplete]);

  const handleFlick = () => {
    if (!canFlick || flicked) return;
    setFlicked(true);
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 100, 50, 200]);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-slate-900 via-orange-950/30 to-slate-900 py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="relative w-48 h-48"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-orange-500 via-red-500 to-yellow-400 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.9, 0.6]
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-6 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-full blur-sm"
            style={{
              left: `${30 + Math.random() * 40}%`,
              bottom: '20%'
            }}
            animate={{
              y: [0, -80 - Math.random() * 60],
              x: [0, (Math.random() - 0.5) * 60],
              opacity: [1, 0],
              scale: [1, 0.3]
            }}
            transition={{
              duration: 0.8 + Math.random() * 0.5,
              repeat: Infinity,
              delay: Math.random() * 0.5
            }}
          />
        ))}
        <div className="absolute inset-8 bg-gradient-to-t from-orange-600 via-red-500 to-yellow-400 rounded-full" />
        <motion.p
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-orange-300 font-mono text-sm whitespace-nowrap"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          The Fire Pit
        </motion.p>
      </motion.div>

      {!flicked && (
        <motion.p
          className="text-white/70 font-mono text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: canFlick ? 1 : 0.3 }}
        >
          {canFlick ? '↑ Flick the paper toward the fire ↑' : 'Preparing the flame...'}
        </motion.p>
      )}

      {!flicked ? (
        <motion.div
          className="relative cursor-grab active:cursor-grabbing"
          drag={canFlick}
          dragConstraints={{ top: -300, bottom: 0, left: -50, right: 50 }}
          dragElastic={0.1}
          onDragEnd={(e, info) => {
            if (info.offset.y < -150) {
              handleFlick();
            }
          }}
          whileDrag={{ scale: 0.95 }}
          style={{ y: ballY, x: ballX }}
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            rotate: [0, 5, -5, 3, -3, 0]
          }}
          transition={{ 
            scale: { type: "spring", stiffness: 200 },
            rotate: { duration: 0.5, delay: 0.5 }
          }}
        >
          <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-2xl transform rotate-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-50">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-full h-px bg-slate-300"
                  style={{ top: `${12 + i * 12}%` }}
                />
              ))}
            </div>
            <div className="absolute inset-4 text-[6px] font-mono text-slate-600 overflow-hidden leading-tight">
              TO: {formData.addressee?.substring(0, 20)}...
              <br />I resign from {formData.role?.substring(0, 15)}...
            </div>
          </div>
          <motion.div
            className="absolute -inset-4 border-2 border-dashed border-orange-400/50 rounded-xl"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      ) : (
        <motion.div
          className="relative"
          initial={{ y: 200, scale: 1, rotate: 12 }}
          animate={{ 
            y: phase >= 1 ? -250 : 0,
            scale: phase >= 1 ? 0.4 : 1,
            rotate: phase >= 1 ? [12, -45, 60, -30, 45] : 12
          }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-32 h-32 rounded-lg relative overflow-hidden shadow-2xl"
            animate={{
              backgroundColor: phase >= 2 
                ? ['#fef3c7', '#f59e0b', '#b45309', '#92400e', '#1c1917', '#0c0a09']
                : '#fef3c7'
            }}
            transition={{ duration: 2.5 }}
          >
            {/* Intense flame layers */}
            {phase >= 1 && phase < 3 && (
              <>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-yellow-400 via-orange-500 to-transparent"
                  initial={{ height: '0%' }}
                  animate={{ height: '120%' }}
                  transition={{ duration: 1 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-red-600 via-orange-400 to-transparent"
                  initial={{ height: '0%' }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 1.2, delay: 0.1 }}
                />
                {/* Flame flickers */}
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-3 bg-orange-300 rounded-full blur-sm"
                    style={{ left: `${Math.random() * 100}%` }}
                    initial={{ bottom: 0, opacity: 0 }}
                    animate={{ 
                      bottom: [0, 160],
                      opacity: [0, 1, 0.5, 0],
                      scale: [0.3, 1.2, 0.5],
                      x: [(Math.random() - 0.5) * 40]
                    }}
                    transition={{
                      duration: 1.2 + Math.random() * 0.6,
                      delay: i * 0.05,
                      repeat: 2
                    }}
                  />
                ))}
              </>
            )}
            
            {/* Bright flash before ash */}
            {phase >= 1 && phase < 2 && (
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            )}
            
            {/* Ash and embers falling */}
            {phase >= 2 && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(18)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute rounded-full ${i % 3 === 0 ? 'bg-red-700' : i % 3 === 1 ? 'bg-slate-500' : 'bg-gray-600'}`}
                    style={{ 
                      width: `${2 + Math.random() * 3}px`,
                      height: `${2 + Math.random() * 3}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ 
                      scale: [1, 0.5, 0],
                      opacity: [0.9, 0.5, 0],
                      y: [0, 30, 80],
                      x: [(Math.random() - 0.5) * 60],
                      rotate: [0, 180 + Math.random() * 180]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 0.8,
                      delay: 0.3 + i * 0.12,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
      
      {phase >= 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-20 h-20 text-amber-400 mx-auto mb-6" />
            </motion.div>
            <motion.h2 
              className="text-5xl font-bold text-white mb-4 tracking-widest"
              style={{ textShadow: '0 0 40px rgba(251, 191, 36, 0.5)' }}
            >
              RELEASED
            </motion.h2>
            <motion.p 
              className="text-amber-200 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              The burden has turned to ash and blown away
            </motion.p>
            
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-slate-400 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: '50%'
                }}
                animate={{
                  y: [0, -200 - Math.random() * 200],
                  x: [(Math.random() - 0.5) * 300],
                  opacity: [0.8, 0],
                  scale: [1, 0.5]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const FileAnimation = ({ onComplete, referenceNumber, formData }) => {
  const [phase, setPhase] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [filed, setFiled] = useState(false);
  const letterY = useMotionValue(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setPhase(1), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (filed) {
      playDrawerSound();
      const timers = [
        setTimeout(() => setPhase(2), 500),
        setTimeout(() => setPhase(3), 1500),
        setTimeout(() => setPhase(4), 2500),
        setTimeout(() => onComplete(), 4000)
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [filed, onComplete]);

  const handleDragEnd = (e, info) => {
    if (info.offset.y < -100) {
      setFiled(true);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="relative mb-8"
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", damping: 20 }}
      >
        {/* Filing Cabinet */}
        <div className="w-72 h-56 bg-gradient-to-b from-amber-700 to-amber-900 rounded-lg shadow-2xl relative overflow-hidden border-2 border-amber-800">
          {/* Cabinet Label */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-t-lg flex items-center justify-center border-b-2 border-amber-800">
            <div className="w-24 h-4 bg-amber-400 rounded opacity-80" />
          </div>
          
          {/* Drawer 1 */}
          <motion.div
            className="absolute top-14 left-3 right-3 h-14 bg-gradient-to-r from-amber-800 to-amber-900 rounded-lg shadow-md border-2 border-amber-700 origin-left"
            animate={
              phase >= 2 && filed 
                ? { scaleX: 0.8, x: -40, opacity: 0.6 } 
                : { scaleX: 1, x: 0, opacity: 1 }
            }
            transition={{ duration: 0.5 }}
          >
            <div className="h-full flex items-center px-4">
              <div className="w-12 h-3 bg-amber-600 rounded-full" />
            </div>
          </motion.div>

          {/* Drawer 2 (Filing drawer - main one) */}
          <motion.div
            className="absolute top-32 left-3 right-3 h-14 bg-gradient-to-r from-amber-800 to-amber-900 rounded-lg shadow-lg border-2 border-amber-700 origin-left"
            animate={
              phase >= 2 && filed 
                ? { scaleX: 0, x: -100, opacity: 0.3 }
                : { scaleX: 1, x: 0, opacity: 1 }
            }
            transition={{ duration: 0.6, ease: "easeIn" }}
          >
            <div className="h-full flex items-center px-4 gap-2">
              <div className="w-14 h-4 bg-amber-600 rounded-full" />
              <div className="flex-1 h-2 bg-amber-700 rounded" />
            </div>
          </motion.div>

          {/* Drawer 3 */}
          <motion.div
            className="absolute bottom-3 left-3 right-3 h-14 bg-gradient-to-r from-amber-800 to-amber-900 rounded-lg shadow-md border-2 border-amber-700 origin-left"
            animate={
              phase >= 2 && filed 
                ? { scaleX: 0.8, x: -40, opacity: 0.6 }
                : { scaleX: 1, x: 0, opacity: 1 }
            }
            transition={{ duration: 0.5 }}
          >
            <div className="h-full flex items-center px-4">
              <div className="w-12 h-3 bg-amber-600 rounded-full" />
            </div>
          </motion.div>
          
          {/* Wax seal on drawer when filed */}
          {phase >= 3 && filed && (
            <motion.div
              className="absolute top-32 left-1/2 -translate-x-1/2 z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center flex-col shadow-2xl border-2 border-red-500">
                <Stamp className="w-12 h-12 text-red-100" />
                <span className="text-red-100 text-[10px] font-bold mt-1">SEALED</span>
              </div>
            </motion.div>
          )}
        </div>
        
        <motion.p
          className="text-amber-300/70 font-mono text-sm text-center mt-6 font-semibold"
          animate={{ opacity: phase >= 1 && !filed ? [0.5, 1, 0.5] : 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ↑ Drag your letter into the filing cabinet ↑
        </motion.p>
      </motion.div>

      {!filed && phase >= 1 && (
        <motion.div
          className="cursor-grab active:cursor-grabbing"
          drag
          dragConstraints={{ top: -200, bottom: 50, left: -50, right: 50 }}
          dragElastic={0.1}
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ y: letterY }}
          whileDrag={{ scale: 0.95, rotate: [-2, 2] }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="relative">
            <div className="w-48 h-64 bg-gradient-to-b from-amber-50 to-white rounded-lg shadow-xl relative overflow-hidden">
              <div className="p-3">
                <div className="text-[8px] font-mono text-slate-600 leading-relaxed">
                  <p className="font-bold border-b border-slate-200 pb-1 mb-2">LETTER OF RESIGNATION</p>
                  <p>TO: {formData.addressee?.substring(0, 25)}...</p>
                  <p className="mt-1">I resign from: {formData.role?.substring(0, 20)}...</p>
                  <p className="mt-1">New position: {formData.newPosition?.substring(0, 20)}...</p>
                </div>
              </div>
              
              <div className="absolute bottom-3 right-3 w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center opacity-80">
                <Stamp className="w-6 h-6 text-red-200" />
              </div>
            </div>
            
            <motion.div
              className="absolute -inset-2 border-2 border-dashed border-amber-400/50 rounded-xl pointer-events-none"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
      
      {phase >= 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center z-20">
            {/* Large animated seal */}
            <motion.div
              className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-full flex items-center justify-center shadow-2xl relative"
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, 8, -8, 0],
                boxShadow: [
                  '0 0 0 0 rgba(220, 38, 38, 0.4)',
                  '0 0 0 20px rgba(220, 38, 38, 0.2)',
                  '0 0 0 0 rgba(220, 38, 38, 0.4)'
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <div className="text-center">
                <Stamp className="w-16 h-16 text-red-100 mx-auto drop-shadow-lg" />
                <span className="text-red-100 text-sm font-black block mt-2 tracking-widest">FILED</span>
              </div>
              {/* Seal shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>

            <motion.h2 
              className="text-5xl font-black text-white mb-8 tracking-widest"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ textShadow: '0 0 30px rgba(220, 38, 38, 0.5)' }}
            >
              BOUNDARY SET
            </motion.h2>

            <motion.div
              className="max-w-sm mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Your resignation is now on record. This boundary is permanent and non-negotiable.
              </p>
              <p className="text-amber-200/80 text-xs italic">
                ✓ We'll remind you if you slip back into old patterns
              </p>
            </motion.div>

            {/* Falling documents animation */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-16 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded shadow-lg"
                style={{
                  left: `${20 + i * 13}%`,
                  top: '-20px'
                }}
                initial={{ opacity: 0, y: -100 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [0, 400],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3 + i * 0.2,
                  delay: 0.5,
                  repeat: Infinity
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const PastLettersView = ({ resignations, onBack, onDelete, onView }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [viewingLetter, setViewingLetter] = useState(null);
  const { toast } = useToast();

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
      toast({
        title: "Letter deleted",
        description: "The resignation has been removed from your records."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete letter. Please try again.",
        variant: "destructive"
      });
    }
    setDeletingId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (viewingLetter) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8"
      >
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={() => setViewingLetter(null)}
            variant="ghost"
            className="text-slate-300 hover:bg-slate-700 mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Letters
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl"
          >
            <div className="text-center mb-6 pb-4 border-b-2 border-slate-200">
              <h1 className="font-mono text-2xl text-slate-900 font-bold">LETTER OF RESIGNATION</h1>
              <p className="font-mono text-sm text-slate-600 mt-1">{formatDate(viewingLetter.created_at)}</p>
              {viewingLetter.reference_number && (
                <p className="font-mono text-xs text-slate-500 mt-1">Ref: {viewingLetter.reference_number}</p>
              )}
            </div>

            <div className="space-y-4 font-mono text-slate-800">
              <p><span className="font-bold">TO:</span> <span className="font-caveat text-xl text-indigo-900">{viewingLetter.addressee}</span></p>
              
              <p className="mt-4">Please accept this letter as formal notification that I am resigning from my position as <span className="font-caveat text-xl text-indigo-900">{viewingLetter.role}</span>, effective immediately.</p>
              
              <p>After careful consideration, I have concluded that this role no longer serves my well-being, my growth, or my fundamental right to exist without constant self-surveillance.</p>
              
              <p className="mt-4">The working conditions have become <span className="font-caveat text-xl text-indigo-900">{viewingLetter.condition}</span>.</p>
              
              <p className="mt-4">For too long, I have been compensated exclusively in <span className="font-caveat text-xl text-indigo-900">{viewingLetter.paid_in}</span>, when what I truly deserved was <span className="font-caveat text-xl text-indigo-900">{viewingLetter.instead_of}</span>. This is an unacceptable return on investment for a position I never actually applied for.</p>
              
              <p>I understand it's customary to give two weeks notice, but I've only got two minutes. The urgency of my departure cannot be overstated.</p>
              
              <p className="mt-4">Effective immediately, I am returning the keys to <span className="font-caveat text-xl text-indigo-900">{viewingLetter.returning_keys}</span>. I will not be taking any work home with me, as I have been doing so unconsciously for far too long already.</p>
              
              {viewingLetter.struck_responsibilities && viewingLetter.struck_responsibilities.length > 0 && (
                <div className="mt-4">
                  <p className="font-bold mb-2">Furthermore, I will no longer be responsible for:</p>
                  <ul className="list-none space-y-1 pl-4">
                    {viewingLetter.struck_responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                        <span className="line-through text-red-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p>It is my strong suggestion that this position be eliminated altogether. It should never have existed in the first place, and I refuse to train my replacement.</p>
              
              <p className="mt-4">Moving forward, I will be accepting a new position as <span className="font-caveat text-xl text-indigo-900">{viewingLetter.new_position}</span>. This new role comes with significantly better benefits, including but not limited to: peace of mind, self-acceptance, and the radical freedom of being imperfect.</p>
              
              <p>Please do not contact me regarding this matter. My inbox is now reserved for things that actually matter.</p>
              
              <p className="mt-6">Respectfully (but not apologetically),</p>
              
              <div className="mt-8 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Released via: <span className={`font-bold ${viewingLetter.release_type === 'burn' ? 'text-orange-600' : 'text-amber-700'}`}>
                    {viewingLetter.release_type === 'burn' ? 'The Burn (Cathartic Release)' : 'The File (Boundary Set)'}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8"
    >
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-slate-300 hover:bg-slate-700 mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to New Letter
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <Archive className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h2 className="font-mono text-2xl text-slate-900 font-bold">Past Contracts</h2>
            <p className="text-slate-600 mt-2">Your filed resignations for future reference</p>
          </div>

          {resignations.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No resignations filed yet.</p>
              <p className="text-slate-400 text-sm mt-2">Your boundary-setting letters will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resignations.map((letter, idx) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 border-2 border-slate-200 rounded-xl hover:border-amber-400/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-slate-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(letter.created_at)}
                      </p>
                      <p className="font-caveat text-xl text-indigo-900 mt-1 truncate">
                        Resigned from: {letter.role}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        New position: <span className="text-emerald-700">{letter.new_position}</span>
                      </p>
                      {letter.reference_number && (
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          {letter.reference_number}
                        </p>
                      )}
                      <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                        letter.release_type === 'burn' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {letter.release_type === 'burn' ? 'Burned' : 'Filed'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-600 hover:text-amber-600 hover:bg-amber-50"
                        onClick={() => setViewingLetter(letter)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(letter.id)}
                        disabled={deletingId === letter.id}
                      >
                        {deletingId === letter.id ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full"
                          />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function ResignationProtocol({ onBack }) {
  const { toast } = useToast();
  const [phase, setPhase] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBurnAnimation, setShowBurnAnimation] = useState(false);
  const [showFileAnimation, setShowFileAnimation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [showPastLetters, setShowPastLetters] = useState(false);
  const [lockedFields, setLockedFields] = useState({});
  const [showFullLetter, setShowFullLetter] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  
  const [formData, setFormData] = useState({
    addressee: '',
    role: '',
    duration: '',
    harm: '',
    condition: '',
    paidIn: '',
    insteadOf: '',
    returningKeys: '',
    struckResponsibilities: [],
    discovery: '',
    regret: '',
    newPosition: '',
    benefit: ''
  });
  
  const [isComplete, setIsComplete] = useState(false);
  const [showPostSubmission, setShowPostSubmission] = useState(false);
  const [isSigningMode, setIsSigningMode] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);

  const [savedResignations, setSavedResignations] = useState([]);
  const [loadingResignations, setLoadingResignations] = useState(true);

  useEffect(() => {
    const loadResignations = async () => {
      try {
        const data = await getResignations();
        setSavedResignations(data);
      } catch (error) {
        console.log('Using localStorage fallback');
        const saved = localStorage.getItem('resignationProtocol_saved');
        if (saved) setSavedResignations(JSON.parse(saved));
      } finally {
        setLoadingResignations(false);
      }
    };
    loadResignations();
  }, []);

  const handleDeleteResignation = async (id) => {
    try {
      await deleteResignation(id);
      setSavedResignations(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      const updated = savedResignations.filter(r => r.id !== id);
      setSavedResignations(updated);
      localStorage.setItem('resignationProtocol_saved', JSON.stringify(updated));
    }
  };

  const phases = [
    {
      id: 'header',
      staticText: 'TO:',
      field: 'addressee',
      options: ADDRESSEE_OPTIONS,
      allowCustom: true
    },
    {
      id: 'role',
      staticText: "Please accept this letter as formal notification that I am resigning from my position as...",
      field: 'role',
      options: ROLE_OPTIONS,
      allowCustom: true,
      subFields: [
        { text: 'I have held this position for...', field: 'duration', options: DURATION_OPTIONS },
        { text: 'This role has caused significant damage to...', field: 'harm', options: HARM_OPTIONS }
      ]
    },
    {
      id: 'grievances',
      staticText: "The working conditions have become...",
      field: 'condition',
      options: CONDITION_OPTIONS,
      allowCustom: true,
      subFields: [
        { text: 'For too long, I have been paid in...', field: 'paidIn', options: PAID_IN_OPTIONS },
        { text: '...when I deserved...', field: 'insteadOf', options: INSTEAD_OF_OPTIONS }
      ]
    },
    {
      id: 'surrender',
      staticText: "I understand it's customary to give two weeks notice, but I've only got two minutes.\n\nEffective immediately, I am returning the keys to...",
      field: 'returningKeys',
      options: KEYS_OPTIONS,
      hasChecklist: true,
      checklistItems: RESPONSIBILITIES_TO_STRIKE
    },
    {
      id: 'discovery',
      staticText: "Through this resignation, I have come to realize that...",
      field: 'discovery',
      options: DISCOVERY_OPTIONS,
      allowCustom: true,
      subFields: [
        { text: 'My only regret is...', field: 'regret', options: REGRET_OPTIONS }
      ]
    },
    {
      id: 'newPosition',
      staticText: "It is my suggestion that this position be eliminated altogether.\n\nMoving forward, I will be accepting a new position as...",
      field: 'newPosition',
      options: NEW_POSITION_OPTIONS,
      allowCustom: true,
      subFields: [
        { text: 'This new role comes with...', field: 'benefit', options: BENEFIT_OPTIONS }
      ]
    }
  ];

  const currentPhase = phases[phase];

  const typewriterEffect = (text, callback) => {
    if (!text) return;
    setIsTyping(true);
    setTypedText('');
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setTypedText(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 25);
    
    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (currentPhase && !isSigningMode && !showPostSubmission && !showFullLetter) {
      typewriterEffect(currentPhase.staticText);
    }
  }, [phase]);

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setShowDropdown(false);
    setActiveDropdown(null);
    setCustomInput('');
    
    playThudSound();
    
    setLockedFields(prev => ({ ...prev, [field]: true }));
    
    setTimeout(() => {
      setLockedFields(prev => ({ ...prev, [field]: false }));
    }, 300);
  };

  const handleStrike = (item) => {
    setFormData(prev => {
      const current = prev.struckResponsibilities;
      if (current.includes(item)) {
        return { ...prev, struckResponsibilities: current.filter(i => i !== item) };
      }
      playThudSound();
      return { ...prev, struckResponsibilities: [...current, item] };
    });
  };

  const canProceed = () => {
    if (!currentPhase) return false;
    
    switch (currentPhase.id) {
      case 'header':
        return !!formData.addressee;
      case 'role':
        return !!formData.role && !!formData.duration && !!formData.harm;
      case 'grievances':
        return !!formData.condition && !!formData.paidIn && !!formData.insteadOf;
      case 'surrender':
        return !!formData.returningKeys && formData.struckResponsibilities.length > 0;
      case 'discovery':
        return !!formData.discovery && !!formData.regret;
      case 'newPosition':
        return !!formData.newPosition && !!formData.benefit;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (phase < phases.length - 1) {
      setPhase(phase + 1);
    } else {
      setIsSigningMode(true);
    }
  };

  const handlePrevious = () => {
    if (phase > 0) {
      setPhase(phase - 1);
    }
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#faf8f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#1a2a3a';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(26, 42, 58, 0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 0.5;
      ctx.shadowOffsetY = 0.5;
    }
  };

  useEffect(() => {
    if (isSigningMode) {
      setTimeout(initCanvas, 100);
    }
  }, [isSigningMode]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    isDrawing.current = true;
    lastPoint.current = getPos(e);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const currentPoint = getPos(e);
    
    // Calculate distance for pressure-sensitive line width (wet ink effect)
    const distance = Math.sqrt(
      Math.pow(currentPoint.x - lastPoint.current.x, 2) + 
      Math.pow(currentPoint.y - lastPoint.current.y, 2)
    );
    
    // Velocity-based line width (faster = thinner, slower = thicker)
    const velocity = Math.min(distance, 8);
    const lineWidth = 5.5 - (velocity * 0.4);
    ctx.lineWidth = Math.max(1.5, lineWidth);
    
    // Draw main stroke
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    
    // Add secondary lighter stroke for wet ink bleed effect
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = 'rgba(26, 42, 58, 0.5)';
    ctx.lineWidth = ctx.lineWidth + 1;
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#1a2a3a';
    
    lastPoint.current = currentPoint;
    
    if (navigator.vibrate) {
      navigator.vibrate(3);
    }
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  const clearSignature = () => {
    initCanvas();
    setSignatureData(null);
  };

  const confirmSignature = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    setSignatureData(dataUrl);
    setIsSigningMode(false);
    setShowFullLetter(true);
  };

  const handleLetterContinue = () => {
    setShowFullLetter(false);
    setShowEnvelope(true);
  };

  const handleEnvelopeComplete = () => {
    setShowEnvelope(false);
    setShowPostSubmission(true);
  };

  const handleBurn = async () => {
    setIsSaving(true);
    setShowPostSubmission(false);
    try {
      const ref = `RES-${Date.now().toString(36).toUpperCase()}`;
      setReferenceNumber(ref);
      const savedData = await saveResignation({
        ...formData,
        signatureData,
        releaseType: 'burn',
        referenceNumber: ref
      });
      setSavedResignations(prev => [savedData, ...prev]);
    } catch (error) {
      console.log('Saving locally as fallback');
      const localData = {
        id: Date.now(),
        ...formData,
        signatureData,
        releaseType: 'burn',
        referenceNumber: `RES-${Date.now().toString(36).toUpperCase()}`,
        created_at: new Date().toISOString()
      };
      const updated = [localData, ...savedResignations];
      localStorage.setItem('resignationProtocol_saved', JSON.stringify(updated));
      setSavedResignations(updated);
    }
    
    setShowBurnAnimation(true);
  };

  const handleFile = async () => {
    setIsSaving(true);
    setShowPostSubmission(false);
    const ref = `RES-${Date.now().toString(36).toUpperCase()}`;
    setReferenceNumber(ref);
    
    try {
      const savedData = await saveResignation({
        ...formData,
        signatureData,
        releaseType: 'file',
        referenceNumber: ref
      });
      setSavedResignations(prev => [savedData, ...prev]);
    } catch (error) {
      console.log('Saving locally as fallback');
      const localData = {
        id: Date.now(),
        ...formData,
        signatureData,
        releaseType: 'file',
        referenceNumber: ref,
        created_at: new Date().toISOString()
      };
      const updated = [localData, ...savedResignations];
      localStorage.setItem('resignationProtocol_saved', JSON.stringify(updated));
      setSavedResignations(updated);
    }
    
    setShowFileAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowBurnAnimation(false);
    setShowFileAnimation(false);
    setIsComplete(true);
    toast({
      title: "Resignation Complete",
      description: "You have been released from your unpaid position.",
    });
  };

  const resetForm = () => {
    setPhase(0);
    setFormData({
      addressee: '',
      role: '',
      duration: '',
      harm: '',
      condition: '',
      paidIn: '',
      insteadOf: '',
      returningKeys: '',
      struckResponsibilities: [],
      discovery: '',
      regret: '',
      newPosition: '',
      benefit: ''
    });
    setIsComplete(false);
    setShowPostSubmission(false);
    setShowFullLetter(false);
    setShowEnvelope(false);
    setSignatureData(null);
    setLockedFields({});
    setIsSaving(false);
  };

  const renderDropdown = (options, field, allowCustom = false) => {
    const value = formData[field];
    const isLocked = lockedFields[field];
    
    return (
      <div className="relative mt-4">
        <motion.div
          className={`border-b-2 border-dashed cursor-pointer py-2 transition-all ${
            value 
              ? 'border-slate-400' 
              : 'border-slate-300 hover:border-amber-400'
          } ${isLocked ? 'transform scale-[1.02]' : ''}`}
          onClick={() => {
            if (!value) {
              setShowDropdown(!showDropdown);
              setActiveDropdown(field);
            }
          }}
          animate={isLocked ? { 
            scale: [1, 1.03, 1],
            y: [0, -2, 0]
          } : {}}
          transition={{ duration: 0.2 }}
        >
          {value ? (
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="font-caveat text-2xl text-indigo-900">{value}</span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <Check className="w-5 h-5 text-emerald-600" />
              </motion.div>
            </motion.div>
          ) : (
            <span className="text-amber-600 font-mono flex items-center justify-between">
              tap to select...
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </motion.div>
        
        <AnimatePresence>
          {showDropdown && activeDropdown === field && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute z-50 mt-2 w-full bg-white border border-slate-300 rounded-xl shadow-2xl max-h-72 overflow-y-auto"
            >
              {options.map((option, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="px-4 py-3 hover:bg-amber-50 cursor-pointer font-caveat text-xl text-slate-800 border-b border-slate-200 last:border-b-0 transition-all hover:pl-6"
                  onClick={() => handleSelect(field, option)}
                >
                  {option}
                </motion.div>
              ))}
              {allowCustom && (
                <motion.div 
                  className="p-3 border-t-2 border-slate-200 bg-slate-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <input
                    type="text"
                    placeholder="Or type your own..."
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customInput.trim()) {
                        handleSelect(field, customInput.trim());
                      }
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-caveat text-xl text-slate-800 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                    autoFocus
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderPhaseContent = () => (
    <motion.div
      key={phase}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <p className="font-mono text-xl text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
        {typedText}
        {isTyping && (
          <motion.span 
            className="inline-block w-0.5 h-5 bg-slate-700 ml-0.5"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </p>
      
      {!isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderDropdown(currentPhase.options, currentPhase.field, currentPhase.allowCustom)}
          
          {currentPhase.subFields && currentPhase.subFields.map((sub, idx) => (
            <motion.div 
              key={idx} 
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
            >
              <p className="font-mono text-xl text-slate-800 font-medium">{sub.text}</p>
              {renderDropdown(sub.options, sub.field)}
            </motion.div>
          ))}
          
          {currentPhase.hasChecklist && formData.returningKeys && (
            <motion.div 
              className="mt-8 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="font-mono text-xl text-slate-800 mb-4 font-medium">
                And I will no longer be responsible for:
              </p>
              <p className="text-sm text-slate-600 mb-4 italic font-medium">
                (Tap to strike through - you must release at least one)
              </p>
              {currentPhase.checklistItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStrike(item)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.struckResponsibilities.includes(item)
                      ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-300 shadow-inner'
                      : 'bg-white border-slate-300 hover:bg-amber-50 hover:border-amber-400/50 shadow-sm'
                  }`}
                >
                  <span className={`font-mono text-base flex items-center font-medium ${
                    formData.struckResponsibilities.includes(item)
                      ? 'line-through text-red-600 decoration-red-500 decoration-[3px]'
                      : 'text-slate-800'
                  }`}>
                    {formData.struckResponsibilities.includes(item) && (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="mr-2"
                      >
                        <X className="w-5 h-5 text-red-500" />
                      </motion.span>
                    )}
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );

  const renderSigningMode = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-6"
    >
      <motion.div 
        className="text-center space-y-2"
        animate={{ 
          scale: [1, 1.02, 1],
          opacity: [0.9, 1, 0.9]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Award className="w-16 h-16 text-amber-600 mx-auto mb-4" />
      </motion.div>
      <h2 style={{ fontFamily: "'Great Vibes', cursive" }} className="text-5xl text-slate-900 font-bold">Sign Your Resignation</h2>
      <p className="text-slate-600 max-w-md font-medium text-lg">
        Use your finger or mouse to sign below. Draw in your most authentic style.
      </p>
      
      <motion.div 
        className="relative w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-transparent to-amber-400/20 rounded-2xl blur-xl" />
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          className="w-full h-48 bg-cream-100 rounded-2xl border-2 border-slate-300 shadow-inner cursor-crosshair touch-none relative z-10"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="absolute bottom-4 left-4 right-4 border-b-2 border-slate-400 z-20 pointer-events-none" />
        <span className="absolute bottom-6 left-4 text-xs text-slate-500 font-mono z-20">Sign here</span>
      </motion.div>
      
      <div className="flex gap-4">
        <Button
          onClick={clearSignature}
          variant="outline"
          className="border-slate-300 text-slate-700"
        >
          Clear
        </Button>
        <Button
          onClick={confirmSignature}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
        >
          Confirm Signature
        </Button>
      </div>
    </motion.div>
  );

  const renderPostSubmission = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-8 py-8"
    >
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-mono text-3xl text-slate-900 font-bold">Choose Your Release</h2>
        <p className="text-slate-600 max-w-md font-medium">
          How would you like to process this resignation?
        </p>
      </motion.div>
      
      <motion.div 
        className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBurn}
          disabled={isSaving}
          className="flex-1 p-8 bg-gradient-to-br from-orange-500 via-red-500 to-red-600 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <Flame className="w-14 h-14 mx-auto mb-4 relative z-10" />
          <h3 className="font-bold text-2xl relative z-10">The Burn</h3>
          <p className="text-lg text-orange-100 mt-2 relative z-10">Cathartic Release</p>
          <p className="text-sm text-orange-200 mt-3 relative z-10">
            Best for: Letting go of anger, trauma, or heavy burdens
          </p>
          <p className="text-xs text-orange-300 mt-2 relative z-10 italic">
            Flick the letter into the fire and watch it turn to ash
          </p>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFile}
          disabled={isSaving}
          className="flex-1 p-8 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-amber-400/20 to-transparent"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <FileText className="w-14 h-14 mx-auto mb-4 relative z-10" />
          <h3 className="font-bold text-2xl relative z-10">The File</h3>
          <p className="text-lg text-amber-100 mt-2 relative z-10">Set a Boundary</p>
          <p className="text-sm text-amber-200 mt-3 relative z-10">
            Best for: Establishing new rules or stopping people-pleasing
          </p>
          <p className="text-xs text-amber-300 mt-2 relative z-10 italic">
            Save for future reference - we'll remind you if you slip
          </p>
        </motion.button>
      </motion.div>
    </motion.div>
  );

  const renderComplete = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-8 py-8 text-center"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Sparkles className="w-20 h-20 text-amber-500" />
      </motion.div>
      
      <h2 className="font-mono text-3xl text-slate-900 font-bold">You Are Free</h2>
      <p className="text-slate-600 max-w-md font-medium">
        You have successfully resigned from <strong className="text-indigo-900 font-caveat text-xl">{formData.role}</strong> and accepted your new position as <strong className="text-emerald-700 font-caveat text-xl">{formData.newPosition}</strong>.
      </p>
      
      {referenceNumber && (
        <p className="font-mono text-sm text-slate-500">
          Reference: {referenceNumber}
        </p>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button
          onClick={resetForm}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
        >
          Write Another Resignation
        </Button>
        <Button
          onClick={() => setShowPastLetters(true)}
          variant="outline"
          className="border-slate-300 text-slate-700"
        >
          <Archive className="w-4 h-4 mr-2" />
          View Past Letters
        </Button>
        <Button
          onClick={onBack}
          variant="outline"
          className="border-slate-300 text-slate-700"
        >
          Return to Dashboard
        </Button>
      </div>
    </motion.div>
  );

  if (showBurnAnimation) {
    return <BurnAnimation onComplete={handleAnimationComplete} formData={formData} />;
  }

  if (showFileAnimation) {
    return <FileAnimation onComplete={handleAnimationComplete} referenceNumber={referenceNumber} formData={formData} />;
  }

  if (showFullLetter) {
    return <FullLetterDisplay formData={formData} signatureData={signatureData} onContinue={handleLetterContinue} />;
  }

  if (showEnvelope) {
    return <EnvelopeAnimation onComplete={handleEnvelopeComplete} />;
  }

  if (showPastLetters) {
    return (
      <PastLettersView
        resignations={savedResignations}
        onBack={() => setShowPastLetters(false)}
        onDelete={handleDeleteResignation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8 relative overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.3} />
      ))}
      
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-slate-300 hover:bg-slate-700 transition-all hover:pl-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
          
          {savedResignations.length > 0 && !isComplete && (
            <Button
              onClick={() => setShowPastLetters(true)}
              variant="ghost"
              className="text-slate-300 hover:bg-slate-700"
            >
              <Archive className="w-4 h-4 mr-2" />
              Past Letters ({savedResignations.length})
            </Button>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative"
        >
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <div className="text-center mb-8 pb-6 border-b-2 border-slate-200">
            <motion.h1 
              className="font-mono text-3xl sm:text-4xl text-slate-900 tracking-wider font-bold"
              initial={{ letterSpacing: '0.05em' }}
              animate={{ letterSpacing: ['0.05em', '0.1em', '0.05em'] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              LETTER OF RESIGNATION
            </motion.h1>
            <motion.p 
              className="font-mono text-sm text-slate-600 mt-2 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </motion.p>
          </div>

          {!isSigningMode && !showPostSubmission && !isComplete && (
            <div className="flex justify-center gap-2 mb-8">
              {phases.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === phase 
                      ? 'bg-amber-500 scale-125' 
                      : idx < phase 
                        ? 'bg-emerald-500' 
                        : 'bg-slate-300'
                  }`}
                  animate={idx === phase ? { 
                    scale: [1.25, 1.4, 1.25],
                    boxShadow: ['0 0 0 0 rgba(245, 158, 11, 0.4)', '0 0 0 8px rgba(245, 158, 11, 0)', '0 0 0 0 rgba(245, 158, 11, 0.4)']
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {isComplete ? (
              renderComplete()
            ) : showPostSubmission ? (
              renderPostSubmission()
            ) : isSigningMode ? (
              renderSigningMode()
            ) : (
              renderPhaseContent()
            )}
          </AnimatePresence>
          
          {!isSigningMode && !showPostSubmission && !isTyping && !isComplete && (
            <motion.div 
              className="flex justify-between mt-10 pt-6 border-t-2 border-slate-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={phase === 0}
                className="border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {phase === phases.length - 1 ? 'Sign Letter' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
