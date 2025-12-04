import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, Flame, FileText, X, Sparkles, Award, Stamp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { saveResignation, getResignations } from '@/lib/supabase';

const ADDRESSEE_OPTIONS = [
  "The Anxiety",
  "The Inner Critic", 
  "The Past Version of Me",
  "The Committee",
  "My Mother's Expectations",
  "My Father's Expectations",
  "Society's Standards",
  "The Fear of Judgment",
  "The Imposter Within",
  "The Perfectionist"
];

const ROLE_OPTIONS = [
  "General Manager of the Universe",
  "Chief Fixer",
  "The Emotional Sponge",
  "The Peacekeeper",
  "Director of People Pleasing",
  "Chief Worrier",
  "The Constant Apologizer",
  "Guardian of Everyone's Feelings",
  "The Mind Reader",
  "CEO of Overthinking"
];

const CONDITION_OPTIONS = [
  "Unbearable",
  "Soul-crushing",
  "Unsustainable",
  "Exhausting",
  "Suffocating",
  "Overwhelming",
  "Toxic beyond measure"
];

const PAID_IN_OPTIONS = [
  "Panic attacks",
  "Resentment",
  "Fake smiles",
  "Sleepless nights",
  "Chronic tension",
  "Self-doubt",
  "Endless guilt",
  "Burnout"
];

const INSTEAD_OF_OPTIONS = [
  "Authenticity",
  "Rest",
  "Joy",
  "Peace",
  "Self-respect",
  "Freedom",
  "Genuine connection",
  "Inner calm"
];

const KEYS_OPTIONS = [
  "The Control Room",
  "Tomorrow's Problems",
  "Other People's Crises",
  "The Worry Factory",
  "The Approval Office",
  "The Guilt Warehouse"
];

const RESPONSIBILITIES_TO_STRIKE = [
  "Predicting catastrophic futures",
  "Managing emotions that aren't mine",
  "Apologizing for taking up space",
  "Fixing everyone else's problems",
  "Being available 24/7",
  "Making everyone comfortable at my expense",
  "Reading minds and anticipating needs",
  "Carrying generational trauma"
];

const NEW_POSITION_OPTIONS = [
  "The Protector of My Peace",
  "The Architect of My Own Life",
  "Just Matt",
  "Chief Joy Officer",
  "Guardian of My Boundaries",
  "The One Who Rests",
  "Director of Self-Compassion",
  "CEO of My Own Happiness"
];

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

const FileAnimation = ({ referenceNumber, onComplete }) => {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => onComplete(), 3500)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95">
      <div className="relative">
        <motion.div
          className="w-72 h-96 bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg shadow-2xl relative overflow-hidden"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <div className="absolute top-4 left-4 right-4 h-2 bg-slate-600 rounded" />
          <div className="absolute top-10 left-4 right-4 h-2 bg-slate-600 rounded w-3/4" />
          
          {phase >= 1 && (
            <motion.div
              className="absolute inset-4 top-16 bg-cream-100 rounded shadow-inner"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="p-4 text-center">
                <FileText className="w-12 h-12 text-amber-800 mx-auto mb-3" />
                <p className="font-mono text-xs text-amber-900">OFFICIAL RECORD</p>
              </div>
            </motion.div>
          )}
          
          {phase >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2"
            >
              <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <Check className="w-4 h-4" />
                <span className="font-mono text-sm">FILED</span>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <p className="text-slate-400 font-mono text-sm mb-2">Reference Number</p>
            <motion.p 
              className="text-2xl font-bold text-white font-mono"
              animate={{ 
                textShadow: ["0 0 10px rgba(251,191,36,0)", "0 0 20px rgba(251,191,36,0.5)", "0 0 10px rgba(251,191,36,0)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {referenceNumber}
            </motion.p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const ResignationProtocol = ({ onBack }) => {
  const { toast } = useToast();
  const [phase, setPhase] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [showBurnAnimation, setShowBurnAnimation] = useState(false);
  const [showFileAnimation, setShowFileAnimation] = useState(false);
  const [fileReferenceNumber, setFileReferenceNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
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
      staticText: 'Please accept this letter as formal notification that I am resigning from my position as...',
      field: 'role',
      options: ROLE_OPTIONS,
      allowCustom: true
    },
    {
      id: 'grievances',
      staticText: 'I am stepping down because the working conditions have become...',
      field: 'condition',
      options: CONDITION_OPTIONS,
      subFields: [
        { text: 'For too long, I have been paid in...', field: 'paidIn', options: PAID_IN_OPTIONS },
        { text: '...instead of...', field: 'insteadOf', options: INSTEAD_OF_OPTIONS }
      ]
    },
    {
      id: 'surrender',
      staticText: 'Effective immediately, I am returning the keys to...',
      field: 'returningKeys',
      options: KEYS_OPTIONS,
      hasChecklist: true,
      checklistItems: RESPONSIBILITIES_TO_STRIKE
    },
    {
      id: 'newPosition',
      staticText: 'Moving forward, I will be accepting a new position as...',
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
    
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const handleStrike = (item) => {
    setFormData(prev => {
      const current = prev.struckResponsibilities;
      if (current.includes(item)) {
        return { ...prev, struckResponsibilities: current.filter(i => i !== item) };
      }
      if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
      return { ...prev, struckResponsibilities: [...current, item] };
    });
  };

  const canProceed = () => {
    if (!currentPhase) return false;
    
    switch (currentPhase.id) {
      case 'header':
        return !!formData.addressee;
      case 'role':
        return !!formData.role;
      case 'grievances':
        return !!formData.condition && !!formData.paidIn && !!formData.insteadOf;
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
      const referenceNumber = `RES-${Date.now().toString(36).toUpperCase()}`;
      await saveResignation({
        ...formData,
        signatureData,
        releaseType: 'burn',
        referenceNumber
      });
    } catch (error) {
      console.log('Saving locally as fallback');
    }
    
    setShowBurnAnimation(true);
  };

  const handleFile = async () => {
    setIsSaving(true);
    const referenceNumber = `RES-${Date.now().toString(36).toUpperCase()}`;
    setFileReferenceNumber(referenceNumber);
    
    try {
      await saveResignation({
        ...formData,
        signatureData,
        releaseType: 'file',
        referenceNumber
      });
      
      const data = await getResignations();
      setSavedResignations(data);
    } catch (error) {
      console.log('Saving locally as fallback');
      const resignation = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...formData,
        signature: signatureData,
        referenceNumber
      };
      const updated = [...savedResignations, resignation];
      localStorage.setItem('resignationProtocol_saved', JSON.stringify(updated));
      setSavedResignations(updated);
    }
    
    setShowFileAnimation(true);
  };

  const openDropdown = (field) => {
    setActiveDropdown(field);
    setShowDropdown(true);
  };

  const renderDropdown = (options, field, allowCustom = false) => (
    <div className="relative mt-4">
      <motion.div 
        className="border-b-2 border-dashed border-amber-800/40 pb-2 cursor-pointer min-h-[40px] flex items-end group"
        onClick={() => openDropdown(field)}
        whileHover={{ borderColor: 'rgba(146, 64, 14, 0.6)' }}
        whileTap={{ scale: 0.995 }}
      >
        {formData[field] ? (
          <motion.span 
            className="font-caveat text-2xl text-indigo-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {formData[field]}
          </motion.span>
        ) : (
          <span className="text-amber-800/50 italic group-hover:text-amber-800/70 transition-colors">
            tap to select...
          </span>
        )}
        <motion.div
          className="absolute right-0 bottom-2"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronRight className="w-4 h-4 text-amber-800/40" />
        </motion.div>
      </motion.div>
      
      <AnimatePresence>
        {showDropdown && activeDropdown === field && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute z-50 mt-2 w-full bg-cream-100 border border-amber-800/20 rounded-xl shadow-2xl max-h-72 overflow-y-auto backdrop-blur-sm"
          >
            {options.map((option, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="px-4 py-3 hover:bg-amber-100 cursor-pointer font-caveat text-xl text-indigo-800 border-b border-amber-800/10 last:border-b-0 transition-all hover:pl-6"
                onClick={() => handleSelect(field, option)}
              >
                {option}
              </motion.div>
            ))}
            {allowCustom && (
              <motion.div 
                className="p-3 border-t-2 border-amber-800/20 bg-amber-50/50"
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
                  className="w-full px-3 py-2 bg-white border border-amber-800/20 rounded-lg font-caveat text-xl text-indigo-800 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                  autoFocus
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderPhaseContent = () => {
    if (!currentPhase) return null;

    return (
      <motion.div
        key={phase}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-6"
      >
        <p className="font-mono text-lg text-amber-900 leading-relaxed whitespace-pre-wrap">
          {typedText}
          {isTyping && (
            <motion.span 
              className="inline-block w-0.5 h-5 bg-amber-800 ml-0.5"
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
                <p className="font-mono text-lg text-amber-900">{sub.text}</p>
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
                <p className="font-mono text-lg text-amber-900 mb-4">
                  And I will no longer be responsible for:
                </p>
                <p className="text-sm text-amber-700 mb-4 italic">
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
                        : 'bg-white border-amber-800/20 hover:bg-amber-50 hover:border-amber-400/50 shadow-sm'
                    }`}
                  >
                    <span className={`font-mono text-base flex items-center ${
                      formData.struckResponsibilities.includes(item)
                        ? 'line-through text-red-600 decoration-red-500 decoration-[3px]'
                        : 'text-amber-900'
                    }`}>
                      {formData.struckResponsibilities.includes(item) && (
                        <motion.span
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="mr-3"
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
  };

  const renderSigningMode = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] space-y-6"
    >
      <motion.div 
        className="text-center space-y-4 mb-6"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, -5, 5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Award className="w-16 h-16 text-amber-600 mx-auto mb-4" />
        </motion.div>
        <h2 className="font-mono text-2xl text-amber-900">Sign Your Resignation</h2>
        <p className="text-amber-700 max-w-md">
          Use your finger to sign below. This makes your commitment binding.
        </p>
      </motion.div>
      
      <motion.div 
        className="relative w-full max-w-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
      >
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 rounded-xl opacity-50 blur"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          className="relative w-full border-2 border-amber-800/30 rounded-xl shadow-inner touch-none"
          style={{ backgroundColor: '#faf8f5' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="absolute bottom-4 left-4 right-4 border-b border-amber-800/40" />
        <p className="absolute bottom-1 left-4 text-xs text-amber-800/50 font-mono">SIGNATURE</p>
      </motion.div>
      
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={clearSignature}
          className="border-amber-800/30 hover:bg-amber-100"
        >
          Clear
        </Button>
        <Button
          onClick={confirmSignature}
          className="bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white shadow-lg"
        >
          <Check className="w-4 h-4 mr-2" />
          Confirm Signature
        </Button>
      </div>
    </motion.div>
  );

  const renderPostSubmission = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex flex-col items-center justify-center min-h-[70vh] space-y-8"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 0.3, stiffness: 200 }}
        className="relative"
      >
        <motion.div
          className="absolute -inset-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-lg opacity-50"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl">
          <Check className="w-12 h-12 text-white" />
        </div>
      </motion.div>
      
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-mono text-3xl text-amber-900">Resignation Complete</h2>
        <p className="text-amber-700 max-w-md">
          You have formally resigned from your unpaid position as{' '}
          <strong className="text-indigo-800 font-caveat text-xl">{formData.role}</strong>.
        </p>
      </motion.div>
      
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="font-mono text-lg text-amber-800">How would you like to process this resignation?</p>
      </motion.div>
      
      <motion.div 
        className="flex flex-col sm:flex-row gap-6 w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <motion.div
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBurn}
          className="flex-1 p-6 rounded-2xl bg-gradient-to-br from-orange-100 via-red-100 to-orange-100 border-2 border-orange-200 cursor-pointer text-center space-y-3 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="w-14 h-14 text-orange-500 mx-auto" />
          </motion.div>
          <h3 className="font-mono text-xl text-orange-900 font-bold">The Burn</h3>
          <p className="text-sm text-orange-700">
            Release anger, trauma, or heavy burdens. Watch it turn to ash.
          </p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleFile}
          className="flex-1 p-6 rounded-2xl bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-100 border-2 border-blue-200 cursor-pointer text-center space-y-3 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <motion.div
            animate={{ 
              y: [0, -3, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <FileText className="w-14 h-14 text-blue-500 mx-auto" />
          </motion.div>
          <h3 className="font-mono text-xl text-blue-900 font-bold">The File</h3>
          <p className="text-sm text-blue-700">
            Set a boundary. Save it for future reference when old habits return.
          </p>
        </motion.div>
      </motion.div>
      
      <WaxSeal signed={true} />
    </motion.div>
  );

  if (showBurnAnimation) {
    return <BurnAnimation onComplete={() => onBack()} />;
  }

  if (showFileAnimation) {
    return <FileAnimation referenceNumber={fileReferenceNumber} onComplete={() => onBack()} />;
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e6 100%)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundBlendMode: 'soft-light'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Caveat:wght@400;500;600;700&display=swap');
        .font-mono { font-family: 'Courier Prime', 'Courier New', monospace; }
        .font-caveat { font-family: 'Caveat', cursive; }
        .bg-cream-100 { background-color: #faf8f5; }
      `}</style>
      
      {[...Array(15)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.3} />
      ))}
      
      <div className="container mx-auto px-4 py-6 max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-amber-800 hover:bg-amber-100 transition-all hover:pl-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cream-100/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-800/10 relative"
        >
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <div className="text-center mb-8 pb-6 border-b-2 border-amber-800/20">
            <motion.h1 
              className="font-mono text-3xl sm:text-4xl text-amber-900 tracking-wider"
              initial={{ letterSpacing: '0.05em' }}
              animate={{ letterSpacing: ['0.05em', '0.1em', '0.05em'] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              LETTER OF RESIGNATION
            </motion.h1>
            <motion.p 
              className="font-mono text-sm text-amber-700 mt-2"
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
          
          <AnimatePresence mode="wait">
            {isSigningMode ? (
              renderSigningMode()
            ) : showPostSubmission ? (
              renderPostSubmission()
            ) : (
              renderPhaseContent()
            )}
          </AnimatePresence>
          
          {!isSigningMode && !showPostSubmission && !isTyping && (
            <motion.div 
              className="flex justify-between mt-10 pt-6 border-t-2 border-amber-800/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={phase === 0}
                className="border-amber-800/30 text-amber-800 hover:bg-amber-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {phases.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === phase 
                        ? 'bg-amber-600 w-4' 
                        : idx < phase 
                          ? 'bg-amber-400' 
                          : 'bg-amber-200'
                    }`}
                    animate={idx === phase ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ))}
              </div>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {phase === phases.length - 1 ? 'Sign' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </motion.div>
        
        {savedResignations.length > 0 && !isSigningMode && !showPostSubmission && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 p-4 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm rounded-2xl border border-amber-800/10 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FileText className="w-5 h-5 text-amber-700" />
              </motion.div>
              <p className="font-mono text-sm text-amber-800">
                You have <strong>{savedResignations.length}</strong> filed resignation{savedResignations.length > 1 ? 's' : ''} on record.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResignationProtocol;
