import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, Flame, FileText, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ADDRESSEE_OPTIONS = [
  "The Anxiety",
  "The Inner Critic", 
  "The Past Version of Me",
  "The Committee",
  "My Mother's Expectations",
  "My Father's Expectations",
  "Society's Standards",
  "The Fear of Judgment"
];

const ROLE_OPTIONS = [
  "General Manager of the Universe",
  "Chief Fixer",
  "The Emotional Sponge",
  "The Peacekeeper",
  "Director of People Pleasing",
  "Chief Worrier",
  "The Constant Apologizer",
  "Guardian of Everyone's Feelings"
];

const CONDITION_OPTIONS = [
  "Unbearable",
  "Soul-crushing",
  "Unsustainable",
  "Exhausting",
  "Suffocating",
  "Overwhelming"
];

const PAID_IN_OPTIONS = [
  "Panic attacks",
  "Resentment",
  "Fake smiles",
  "Sleepless nights",
  "Chronic tension",
  "Self-doubt"
];

const INSTEAD_OF_OPTIONS = [
  "Authenticity",
  "Rest",
  "Joy",
  "Peace",
  "Self-respect",
  "Freedom"
];

const KEYS_OPTIONS = [
  "The Control Room",
  "Tomorrow's Problems",
  "Other People's Crises",
  "The Worry Factory",
  "The Approval Office"
];

const RESPONSIBILITIES_TO_STRIKE = [
  "Predicting catastrophic futures",
  "Managing emotions that aren't mine",
  "Apologizing for taking up space",
  "Fixing everyone else's problems",
  "Being available 24/7",
  "Making everyone comfortable at my expense"
];

const NEW_POSITION_OPTIONS = [
  "The Protector of My Peace",
  "The Architect of My Own Life",
  "Just Matt",
  "Chief Joy Officer",
  "Guardian of My Boundaries",
  "The One Who Rests"
];

const ResignationProtocol = ({ onBack }) => {
  const { toast } = useToast();
  const [phase, setPhase] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [customInput, setCustomInput] = useState('');
  
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

  const [savedResignations, setSavedResignations] = useState(() => {
    const saved = localStorage.getItem('resignationProtocol_saved');
    return saved ? JSON.parse(saved) : [];
  });

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
    setIsTyping(true);
    setTypedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setTypedText(prev => prev + text[i]);
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 30);
  };

  useEffect(() => {
    if (currentPhase && !isSigningMode && !showPostSubmission) {
      typewriterEffect(currentPhase.staticText);
    }
  }, [phase]);

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setShowDropdown(false);
    setCustomInput('');
  };

  const handleStrike = (item) => {
    setFormData(prev => {
      const current = prev.struckResponsibilities;
      if (current.includes(item)) {
        return { ...prev, struckResponsibilities: current.filter(i => i !== item) };
      }
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
      navigator.vibrate(5);
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

  const handleBurn = () => {
    toast({
      title: "RELEASED",
      description: "You have formally resigned. The burden has been released.",
    });
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const handleFile = () => {
    const resignation = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...formData,
      signature: signatureData
    };
    
    const updated = [...savedResignations, resignation];
    localStorage.setItem('resignationProtocol_saved', JSON.stringify(updated));
    setSavedResignations(updated);
    
    toast({
      title: "CASE CLOSED",
      description: `Your resignation has been filed. Reference: RES-${resignation.id}`,
    });
    
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const renderDropdown = (options, field, allowCustom = false) => (
    <div className="relative mt-4">
      <div 
        className="border-b-2 border-dashed border-amber-800/40 pb-2 cursor-pointer min-h-[40px] flex items-end"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {formData[field] ? (
          <span className="font-caveat text-2xl text-indigo-800">{formData[field]}</span>
        ) : (
          <span className="text-amber-800/50 italic">tap to select...</span>
        )}
      </div>
      
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 w-full bg-cream-100 border border-amber-800/20 rounded-lg shadow-xl max-h-60 overflow-y-auto"
          >
            {options.map((option, idx) => (
              <div
                key={idx}
                className="px-4 py-3 hover:bg-amber-100 cursor-pointer font-caveat text-xl text-indigo-800 border-b border-amber-800/10 last:border-b-0"
                onClick={() => handleSelect(field, option)}
              >
                {option}
              </div>
            ))}
            {allowCustom && (
              <div className="p-3 border-t border-amber-800/20">
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
                  className="w-full px-3 py-2 bg-white border border-amber-800/20 rounded font-caveat text-xl text-indigo-800"
                />
              </div>
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
          {isTyping && <span className="animate-pulse">|</span>}
        </p>
        
        {!isTyping && (
          <>
            {renderDropdown(currentPhase.options, currentPhase.field, currentPhase.allowCustom)}
            
            {currentPhase.subFields && currentPhase.subFields.map((sub, idx) => (
              <div key={idx} className="mt-6">
                <p className="font-mono text-lg text-amber-900">{sub.text}</p>
                {renderDropdown(sub.options, sub.field)}
              </div>
            ))}
            
            {currentPhase.hasChecklist && formData.returningKeys && (
              <div className="mt-8 space-y-3">
                <p className="font-mono text-lg text-amber-900 mb-4">
                  And I will no longer be responsible for:
                </p>
                {currentPhase.checklistItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStrike(item)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.struckResponsibilities.includes(item)
                        ? 'bg-red-50 border-red-300'
                        : 'bg-white border-amber-800/20 hover:bg-amber-50'
                    }`}
                  >
                    <span className={`font-mono text-base ${
                      formData.struckResponsibilities.includes(item)
                        ? 'line-through text-red-600 decoration-red-500 decoration-2'
                        : 'text-amber-900'
                    }`}>
                      {formData.struckResponsibilities.includes(item) && (
                        <X className="inline w-4 h-4 mr-2 text-red-500" />
                      )}
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </>
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
      <div className="text-center space-y-4 mb-6">
        <h2 className="font-mono text-2xl text-amber-900">Sign Your Resignation</h2>
        <p className="text-amber-700 max-w-md">
          Use your finger to sign below. This makes your commitment binding.
        </p>
      </div>
      
      <div className="relative w-full max-w-lg">
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          className="w-full border-2 border-amber-800/30 rounded-lg shadow-inner touch-none"
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
      </div>
      
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={clearSignature}
          className="border-amber-800/30"
        >
          Clear
        </Button>
        <Button
          onClick={confirmSignature}
          className="bg-amber-800 hover:bg-amber-900 text-white"
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
      className="flex flex-col items-center justify-center min-h-[70vh] space-y-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.3 }}
        className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center"
      >
        <Check className="w-12 h-12 text-green-600" />
      </motion.div>
      
      <div className="text-center space-y-4">
        <h2 className="font-mono text-3xl text-amber-900">Resignation Complete</h2>
        <p className="text-amber-700 max-w-md">
          You have formally resigned from your unpaid position as <strong className="text-indigo-800">{formData.role}</strong>.
        </p>
      </div>
      
      <div className="text-center space-y-2">
        <p className="font-mono text-lg text-amber-800">How would you like to process this resignation?</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBurn}
          className="flex-1 p-6 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 border border-orange-200 cursor-pointer text-center space-y-3"
        >
          <Flame className="w-12 h-12 text-orange-500 mx-auto" />
          <h3 className="font-mono text-xl text-orange-900">The Burn</h3>
          <p className="text-sm text-orange-700">
            Release anger, trauma, or heavy burdens. Watch it turn to ash.
          </p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFile}
          className="flex-1 p-6 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 cursor-pointer text-center space-y-3"
        >
          <FileText className="w-12 h-12 text-blue-500 mx-auto" />
          <h3 className="font-mono text-xl text-blue-900">The File</h3>
          <p className="text-sm text-blue-700">
            Set a boundary. Save it for future reference when old habits return.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div 
      className="min-h-screen"
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
      
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-amber-800 hover:bg-amber-100"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cream-100/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-800/10"
        >
          <div className="text-center mb-8 pb-6 border-b border-amber-800/20">
            <h1 className="font-mono text-3xl sm:text-4xl text-amber-900 tracking-wide">
              LETTER OF RESIGNATION
            </h1>
            <p className="font-mono text-sm text-amber-700 mt-2">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
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
            <div className="flex justify-between mt-10 pt-6 border-t border-amber-800/20">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={phase === 0}
                className="border-amber-800/30 text-amber-800"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="text-amber-800/60 font-mono text-sm self-center">
                {phase + 1} / {phases.length}
              </div>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-amber-800 hover:bg-amber-900 text-white"
              >
                {phase === phases.length - 1 ? 'Sign' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </motion.div>
        
        {savedResignations.length > 0 && !isSigningMode && !showPostSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-amber-50/50 rounded-xl border border-amber-800/10"
          >
            <p className="font-mono text-sm text-amber-800">
              <FileText className="inline w-4 h-4 mr-2" />
              You have {savedResignations.length} filed resignation{savedResignations.length > 1 ? 's' : ''} on record.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResignationProtocol;
