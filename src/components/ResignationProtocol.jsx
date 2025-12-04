import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, Flame, FileText, X, Sparkles, Award, Stamp, Archive, Trash2, Eye, Calendar } from 'lucide-react';
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

const WaxSeal = ({ signed }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={signed ? { scale: 1, rotate: 0 } : { scale: 0 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
    className="absolute -bottom-8 right-8 w-20 h-20"
  >
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-lg" />
      <div className="absolute inset-2 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
        <Stamp className="w-8 h-8 text-red-200/80" />
      </div>
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full"
        animate={{ opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  </motion.div>
);

const BurnAnimation = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => onComplete(), 4500)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative">
        <motion.div
          className="w-64 h-80 bg-cream-100 rounded-lg relative overflow-hidden"
          animate={phase >= 2 ? { 
            scale: [1, 1.02, 0.98, 1],
            rotate: [0, -1, 1, 0]
          } : {}}
          transition={{ duration: 0.5, repeat: phase >= 2 ? Infinity : 0 }}
        >
          {phase >= 1 && (
            <>
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-500 via-red-500 to-transparent"
                initial={{ height: 0 }}
                animate={{ height: phase >= 2 ? "100%" : "30%" }}
                transition={{ duration: 1.5 }}
              />
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-orange-400 rounded-full blur-sm"
                  initial={{ bottom: 0, left: `${10 + Math.random() * 80}%`, opacity: 0 }}
                  animate={{ 
                    bottom: [0, 100, 200],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={{
                    duration: 1 + Math.random(),
                    delay: i * 0.1,
                    repeat: Infinity
                  }}
                />
              ))}
            </>
          )}
          {phase >= 2 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-orange-900/50 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
          )}
        </motion.div>
        
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              className="text-center"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">RELEASED</h2>
              <p className="text-amber-200">The burden has turned to ash</p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const FileAnimation = ({ onComplete, referenceNumber }) => {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => onComplete(), 4000)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative">
        <motion.div
          className="w-64 h-80 bg-cream-100 rounded-lg shadow-xl relative"
          animate={phase >= 1 ? {
            rotateX: [0, -10, 0],
            y: [0, -20, 0],
            scale: [1, 0.9, 0.8]
          } : {}}
          transition={{ duration: 1 }}
        />
        
        {phase >= 2 && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 w-72 h-48 bg-gradient-to-b from-amber-700 to-amber-900 rounded-lg shadow-2xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="absolute top-0 left-0 right-0 h-8 bg-amber-600 rounded-t-lg flex items-center justify-center">
              <div className="w-16 h-2 bg-amber-400 rounded" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 h-32 bg-amber-800/50 rounded" />
          </motion.div>
        )}
        
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              className="text-center"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Stamp className="w-12 h-12 text-red-200" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">CASE CLOSED</h2>
              <p className="text-amber-200 font-mono text-sm">{referenceNumber}</p>
            </motion.div>
          </motion.div>
        )}
      </div>
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
              
              <p className="mt-4">Please accept this letter as formal notification that I am resigning from my position as <span className="font-caveat text-xl text-indigo-900">{viewingLetter.role}</span>.</p>
              
              <p className="mt-4">The working conditions have become <span className="font-caveat text-xl text-indigo-900">{viewingLetter.condition}</span>.</p>
              
              <p className="mt-4">For too long, I have been paid in <span className="font-caveat text-xl text-indigo-900">{viewingLetter.paid_in}</span> when I deserved <span className="font-caveat text-xl text-indigo-900">{viewingLetter.instead_of}</span>.</p>
              
              <p className="mt-4">I am returning the keys to <span className="font-caveat text-xl text-indigo-900">{viewingLetter.returning_keys}</span>.</p>
              
              {viewingLetter.struck_responsibilities && viewingLetter.struck_responsibilities.length > 0 && (
                <div className="mt-4">
                  <p className="font-bold mb-2">I will no longer be responsible for:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    {viewingLetter.struck_responsibilities.map((item, idx) => (
                      <li key={idx} className="line-through text-red-600">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p className="mt-4">Moving forward, I will be accepting a new position as <span className="font-caveat text-xl text-indigo-900">{viewingLetter.new_position}</span>.</p>
              
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
            <h1 className="font-mono text-2xl text-slate-900 font-bold">Past Resignations</h1>
            <p className="text-slate-600 mt-2">Your filed letters and released burdens</p>
          </div>

          {resignations.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-mono">No resignations filed yet</p>
              <p className="text-slate-400 text-sm mt-2">Your letters will appear here after you complete them</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resignations.map((letter, idx) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-amber-300 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {letter.release_type === 'burn' ? (
                          <Flame className="w-4 h-4 text-orange-500" />
                        ) : (
                          <FileText className="w-4 h-4 text-amber-600" />
                        )}
                        <span className="font-mono text-sm text-slate-500">
                          {formatDate(letter.created_at)}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900">
                        Resigned from: <span className="font-caveat text-xl text-indigo-900">{letter.role}</span>
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Now serving as: <span className="font-caveat text-lg text-emerald-700">{letter.new_position}</span>
                      </p>
                      {letter.reference_number && (
                        <p className="font-mono text-xs text-slate-400 mt-2">
                          Ref: {letter.reference_number}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
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
  
  const [formData, setFormData] = useState({
    addressee: '',
    role: '',
    condition: '',
    paidIn: '',
    insteadOf: '',
    returningKeys: '',
    struckResponsibilities: [],
    newPosition: ''
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
        { text: 'For too long, I have been paid in...', field: 'paidIn', options: PAID_IN_OPTIONS },
        { text: '...instead of...', field: 'insteadOf', options: INSTEAD_OF_OPTIONS }
      ]
    },
    {
      id: 'grievances',
      staticText: "The working conditions have become...",
      field: 'condition',
      options: CONDITION_OPTIONS,
      allowCustom: true
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
      id: 'newPosition',
      staticText: "It is my suggestion that this position be eliminated altogether.\n\nMoving forward, I will be accepting a new position as...",
      field: 'newPosition',
      options: NEW_POSITION_OPTIONS,
      allowCustom: true
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
    if (currentPhase && !isSigningMode && !showPostSubmission) {
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
        return !!formData.role && !!formData.paidIn && !!formData.insteadOf;
      case 'grievances':
        return !!formData.condition;
      case 'surrender':
        return !!formData.returningKeys && formData.struckResponsibilities.length > 0;
      case 'newPosition':
        return !!formData.newPosition;
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
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
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
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    
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
    setShowPostSubmission(true);
  };

  const handleBurn = async () => {
    setIsSaving(true);
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
      condition: '',
      paidIn: '',
      insteadOf: '',
      returningKeys: '',
      struckResponsibilities: [],
      newPosition: ''
    });
    setIsComplete(false);
    setShowPostSubmission(false);
    setSignatureData(null);
    setLockedFields({});
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
      <h2 className="font-mono text-2xl text-slate-900 font-bold">Sign Your Resignation</h2>
      <p className="text-slate-600 max-w-md font-medium">
        Use your finger to sign below. This makes your commitment binding.
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
        className="w-32 h-32 relative"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-xl" />
        <div className="absolute inset-3 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
          <Stamp className="w-12 h-12 text-red-200" />
        </div>
      </motion.div>
      
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-mono text-3xl text-slate-900 font-bold">Resignation Complete</h2>
        <p className="text-slate-600 max-w-md font-medium">
          You have formally resigned from your unpaid position as{' '}
          <strong className="text-indigo-900 font-caveat text-xl">{formData.role}</strong>.
        </p>
      </motion.div>
      
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="font-mono text-lg text-slate-700 font-medium">How would you like to process this resignation?</p>
      </motion.div>
      
      <motion.div 
        className="flex flex-col sm:flex-row gap-6 w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBurn}
          disabled={isSaving}
          className="flex-1 p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Flame className="w-10 h-10 mx-auto mb-3" />
          <h3 className="font-bold text-lg">The Burn</h3>
          <p className="text-sm text-orange-100 mt-2">Cathartic Release</p>
          <p className="text-xs text-orange-200 mt-1">Let go of anger & trauma</p>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFile}
          disabled={isSaving}
          className="flex-1 p-6 bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all"
        >
          <FileText className="w-10 h-10 mx-auto mb-3" />
          <h3 className="font-bold text-lg">The File</h3>
          <p className="text-sm text-amber-100 mt-2">Set a Boundary</p>
          <p className="text-xs text-amber-200 mt-1">Save for future reference</p>
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
    return <BurnAnimation onComplete={handleAnimationComplete} />;
  }

  if (showFileAnimation) {
    return <FileAnimation onComplete={handleAnimationComplete} referenceNumber={referenceNumber} />;
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
