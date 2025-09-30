import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BodyPartDetailsModal from './BodyPartDetailsModal';
import HealthMetricsPanel from './HealthMetricsPanel';
import JournalPanel from './JournalPanel';
import { 
  Heart, 
  Activity, 
  Droplet, 
  Zap, 
  Thermometer,
  Clock,
  FileText,
  RotateCcw,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Plus
} from 'lucide-react';

const EnhancedAdvancedBodyMap = ({ onBack, onSave }) => {
  // Enhanced health metrics state
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    temperature: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    bmi: '',
    notes: '',
    timestamp: new Date()
  });

  // Enhanced body parts with detailed symptoms
  const [bodyParts, setBodyParts] = useState({
    head: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
    face: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
    neck: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
    chest: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
    stomach: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
    leftArm: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
    rightArm: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
    leftHand: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
    rightHand: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
    back: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
    leftLeg: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
    rightLeg: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
    leftFoot: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
    rightFoot: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] }
  });

  // Journal and emotional state
  const [journalEntry, setJournalEntry] = useState({
    text: '',
    mood: '',
    triggers: [],
    copingStrategies: [],
    severity: 5,
    duration: '',
    timeOfDay: ''
  });

  // UI state
  const [currentStep, setCurrentStep] = useState('body');
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFront, setShowFront] = useState(true);
  const [savedData, setSavedData] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState('normal');

  // Body part names mapping
  const bodyPartNames = {
    head: 'Head',
    face: 'Face',
    neck: 'Neck',
    chest: 'Chest',
    stomach: 'Stomach',
    leftArm: 'Left Arm',
    rightArm: 'Right Arm',
    leftHand: 'Left Hand',
    rightHand: 'Right Hand',
    back: 'Back',
    leftLeg: 'Left Leg',
    rightLeg: 'Right Leg',
    leftFoot: 'Left Foot',
    rightFoot: 'Right Foot'
  };

  // Handle body part click
  const handleBodyPartClick = (part) => {
    setBodyParts(prev => ({
      ...prev,
      [part]: {
        ...prev[part],
        selected: !prev[part].selected
      }
    }));
  };

  // Handle health metrics change
  const handleHealthMetricsChange = (metric, value) => {
    setHealthMetrics(prev => ({
      ...prev,
      [metric]: value,
      // Auto-calculate BMI if weight and height are provided
      bmi: (metric === 'weight' && prev.height) || (metric === 'height' && prev.weight)
        ? ((parseFloat(metric === 'weight' ? value : prev.weight) * 703) / 
           (parseFloat(metric === 'height' ? value : prev.height) ** 2)).toFixed(1)
        : prev.bmi
    }));
  };

  // Handle journal entry changes
  const handleJournalChange = (field, value) => {
    setJournalEntry(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Open details modal for selected parts
  const handleDetailsModal = () => {
    const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);
    if (selectedParts.length > 0) {
      setShowDetailsModal(true);
    }
  };

  // Save entry
  const handleSave = () => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      bodyParts: bodyParts,
      healthMetrics: healthMetrics,
      journalEntry: journalEntry,
      selectedBodyParts: Object.keys(bodyParts).filter(part => bodyParts[part].selected),
      totalSymptoms: Object.values(bodyParts).reduce((sum, part) => sum + part.symptoms.length + part.feelings.length, 0),
      averageIntensity: Object.values(bodyParts)
        .filter(part => part.selected)
        .reduce((sum, part) => sum + part.intensity, 0) / 
        Math.max(Object.values(bodyParts).filter(part => part.selected).length, 1),
      duration: journalEntry.duration,
      timeOfDay: journalEntry.timeOfDay,
      mood: journalEntry.mood,
      triggers: journalEntry.triggers,
      copingStrategies: journalEntry.copingStrategies
    };

    setSavedData(entry);
    console.log('Saved entry:', entry);
    alert('Entry saved successfully!');
  };

  // Reset all data
  const handleReset = () => {
    setBodyParts({
      head: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
      face: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
      neck: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
      chest: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
      stomach: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
      leftArm: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
      rightArm: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
      leftHand: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
      rightHand: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
      back: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
      leftLeg: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
      rightLeg: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
      leftFoot: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] },
      rightFoot: { selected: false, symptoms: [], intensity: 0, notes: '', feelings: [] }
    });
    setHealthMetrics({
      heartRate: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      temperature: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      bmi: '',
      notes: '',
      timestamp: new Date()
    });
    setJournalEntry({
      text: '',
      mood: '',
      triggers: [],
      copingStrategies: [],
      severity: 5,
      duration: '',
      timeOfDay: ''
    });
    setCurrentStep('body');
  };

  // Advanced SVG body map with rotation and flip
  const renderBodyMap = () => {
    const bodyPartIds = {
      head: 'head-region',
      face: 'face-region',
      neck: 'neck-region',
      chest: 'chest-region',
      stomach: 'stomach-region',
      leftArm: 'left-arm-region',
      rightArm: 'right-arm-region',
      leftHand: 'left-hand-region',
      rightHand: 'right-hand-region',
      back: 'back-region',
      leftLeg: 'left-leg-region',
      rightLeg: 'right-leg-region',
      leftFoot: 'left-foot-region',
      rightFoot: 'right-foot-region'
    };

    const getFillColor = (part) => {
      if (bodyParts[part].selected) {
        return 'url(#selectedGradient)';
      }
      return 'url(#bodyGradient)';
    };

    const getStrokeColor = (part) => {
      return bodyParts[part].selected ? '#3b82f6' : '#64748b';
    };

    const getStrokeWidth = (part) => {
      return bodyParts[part].selected ? '3' : '2';
    };

    return (
      <motion.div
        className="relative flex justify-center"
        animate={{ rotateY: isFlipped ? 180 : 0, rotateZ: rotation }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <svg
          width="400"
          height="600"
          viewBox="0 0 400 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          {/* Gradients and filters */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            
            <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="rgba(59, 130, 246, 0.5)" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feComposite in="SourceGraphic" in2="shadow" operator="over" />
            </filter>
          </defs>

          {/* Background silhouette */}
          <motion.path
            d="M200 80 C150 80, 120 110, 120 160 C120 220, 150 260, 200 260 C250 260, 280 220, 280 160 C280 110, 250 80, 200 80 M200 260 L200 290 M140 290 L140 390 L260 390 L260 290 M140 390 L140 520 L260 520 L260 390 M140 290 L100 290 L70 420 L100 420 L130 330 M260 290 L300 290 L330 420 L300 420 L270 330 M70 420 L50 470 L80 485 L100 420 M330 420 L350 470 L320 485 L300 420 M140 520 L110 550 L290 550 L260 520"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1"
            strokeDasharray="5,3"
            className="opacity-30"
          />

          {/* Body parts with enhanced paths */}
          {Object.entries(bodyPartIds).map(([part, id]) => {
            if (part === 'back' && showFront) return null;
            if (part !== 'back' && !showFront) return null;

            const pathData = {
              head: "M200 80 C150 80, 120 110, 120 160 C120 220, 150 260, 200 260 C250 260, 280 220, 280 160 C280 110, 250 80, 200 80",
              face: "M200 120 C175 120, 155 140, 155 170 C155 200, 175 220, 200 220 C225 220, 245 200, 245 170 C245 140, 225 120, 200 120",
              neck: "M175 260 L175 290 L225 290 L225 260",
              chest: "M140 290 L140 390 L260 390 L260 290",
              stomach: "M140 390 L140 480 L260 480 L260 390",
              leftArm: "M140 290 L100 290 L70 420 L100 420 L130 330",
              rightArm: "M260 290 L300 290 L330 420 L300 420 L270 330",
              leftHand: "M70 420 L50 470 L80 485 L100 420",
              rightHand: "M330 420 L350 470 L320 485 L300 420",
              leftLeg: "M140 480 L140 600 L180 600 L200 480",
              rightLeg: "M260 480 L260 600 L220 600 L200 480",
              leftFoot: "M140 600 L110 630 L190 630 L190 600",
              rightFoot: "M260 600 L290 630 L210 630 L210 600",
              back: "M320 480 L360 480 L360 200 L320 200"
            };

            return (
              <motion.path
                key={part}
                id={id}
                d={pathData[part]}
                fill={getFillColor(part)}
                stroke={getStrokeColor(part)}
                strokeWidth={getStrokeWidth(part)}
                filter={bodyParts[part].selected ? 'url(#glow)' : ''}
                onClick={() => handleBodyPartClick(part)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                style={{ cursor: 'pointer' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * Object.keys(bodyPartIds).indexOf(part) }}
              />
            );
          })}

          {/* Labels */}
          {Object.entries(bodyPartIds).map(([part, id]) => {
            if (part === 'back' && showFront) return null;
            if (part !== 'back' && !showFront) return null;

            const labelData = {
              head: { x: 200, y: 170, rotation: 0 },
              face: { x: 200, y: 195, rotation: 0 },
              neck: { x: 200, y: 275, rotation: 0 },
              chest: { x: 200, y: 340, rotation: 0 },
              stomach: { x: 200, y: 435, rotation: 0 },
              leftArm: { x: 85, y: 355, rotation: 0 },
              rightArm: { x: 315, y: 355, rotation: 0 },
              leftHand: { x: 75, y: 455, rotation: 0 },
              rightHand: { x: 325, y: 455, rotation: 0 },
              leftLeg: { x: 170, y: 540, rotation: 0 },
              rightLeg: { x: 230, y: 540, rotation: 0 },
              leftFoot: { x: 150, y: 615, rotation: 0 },
              rightFoot: { x: 250, y: 615, rotation: 0 },
              back: { x: 340, y: 340, rotation: 90 }
            };

            return (
              <motion.text
                key={`label-${part}`}
                x={labelData[part].x}
                y={labelData[part].y}
                fontSize="12"
                fontWeight="600"
                fill={bodyParts[part].selected ? '#1d4ed8' : '#64748b'}
                textAnchor="middle"
                transform={labelData[part].rotation ? `rotate(${labelData[part].rotation}, ${labelData[part].x}, ${labelData[part].y})` : ''}
                className="pointer-events-none select-none"
              >
                {bodyPartNames[part]}
              </motion.text>
            );
          })}
        </svg>

        {/* Rotation and flip controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setRotation(prev => prev - 90)}
            className="bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
          >
            {showFront ? 'Back' : 'Front'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setRotation(prev => prev + 90)}
            className="bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // Get selected body parts
  const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Button onClick={onBack} className="mb-8">&larr; Back to Dashboard</Button>
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Advanced Anxiety Tracker</h2>
          <p className="text-muted-foreground">
            Comprehensive tracking with body mapping, health metrics, emotional feelings, and detailed symptom analysis.
          </p>
        </motion.div>

        {/* Body Part Details Modal */}
        <BodyPartDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          selectedParts={selectedParts}
          onSave={(details) => {
            setBodyParts(prev => ({ ...prev, ...details }));
            setShowDetailsModal(false);
          }}
          existingDetails={bodyParts}
        />

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-500">
              {currentStep === 'body' && 'Step 1: Body Mapping'}
              {currentStep === 'details' && 'Step 2: Detailed Symptoms & Feelings'}
              {currentStep === 'health' && 'Step 3: Health Metrics'}
              {currentStep === 'journal' && 'Step 4: Emotional Journal'}
              {currentStep === 'summary' && 'Step 5: Review & Save'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(['body', 'details', 'health', 'journal', 'summary'].indexOf(currentStep) + 1) * 20}%` 
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Body Map or Controls */}
          <div>
            {currentStep === 'body' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Body Mapping</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="flex items-center"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    {selectedParts.length > 0 && (
                      <Button
                        size="sm"
                        onClick={handleDetailsModal}
                        className="flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Details
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Click on the body parts where you're experiencing symptoms. You can rotate the view and flip between front and back.
                  </p>
                  
                  {renderBodyMap()}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {selectedParts.length} body part{selectedParts.length !== 1 ? 's' : ''} selected
                  </div>
                  <Button
                    onClick={() => setCurrentStep('details')}
                    disabled={selectedParts.length === 0}
                  >
                    Continue to Details
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 'details' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Detailed Symptoms & Feelings</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDetailsModal}
                    className="flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {selectedParts.map(part => (
                      <motion.div
                        key={part}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{bodyPartNames[part]}</span>
                          <Badge variant="secondary">
                            {bodyParts[part].symptoms.length + bodyParts[part].feelings.length}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Symptoms: {bodyParts[part].symptoms.join(', ') || 'None'}</div>
                          <div>Feelings: {bodyParts[part].feelings.join(', ') || 'None'}</div>
                          <div>Intensity: {bodyParts[part].intensity}/10</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('body')}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Map
                  </Button>
                  <Button
                    onClick={() => setCurrentStep('health')}
                    className="flex-1"
                  >
                    Continue to Health Metrics
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 'health' && (
              <HealthMetricsPanel
                healthMetrics={healthMetrics}
                onChange={handleHealthMetricsChange}
                onNext={() => setCurrentStep('journal')}
                onPrevious={() => setCurrentStep('details')}
                onSave={() => {
                  // Save health metrics to localStorage or API
                  console.log('Health metrics saved:', healthMetrics);
                  alert('Health metrics saved successfully!');
                }}
              />
            )}

            {currentStep === 'journal' && (
              <JournalPanel
                journalEntry={journalEntry}
                onChange={handleJournalChange}
                onNext={() => setCurrentStep('summary')}
                onPrevious={() => setCurrentStep('health')}
                onSave={() => {
                  console.log('Journal entry saved:', journalEntry);
                  alert('Journal entry saved successfully!');
                }}
              />
            )}

            {currentStep === 'summary' && renderSummaryPanel()}
          </div>

          {/* Right side - Summary Panel */}
          <div>
            <Card className="p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-4">Current Session</h3>
              
              <AnimatePresence>
                {selectedParts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="font-medium mb-2">Selected Body Parts</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedParts.map(part => (
                          <Badge key={part} variant="secondary" className="cursor-pointer" onClick={() => setSelectedBodyPart(part)}>
                            {bodyPartNames[part]}
                            {bodyParts[part].symptoms.length + bodyParts[part].feelings.length > 0 && (
                              <span className="ml-1">({bodyParts[part].symptoms.length + bodyParts[part].feelings.length})</span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {Object.values(bodyParts).some(part => part.symptoms.length > 0 || part.feelings.length > 0) && (
                      <div>
                        <h4 className="font-medium mb-2">Symptoms & Feelings Summary</h4>
                        <div className="space-y-2">
                          {Object.entries(bodyParts).map(([part, data]) => (
                            (data.symptoms.length > 0 || data.feelings.length > 0) && (
                              <div key={part} className="text-sm">
                                <span className="font-medium">{bodyPartNames[part]}:</span>
                                <div className="text-gray-600 text-xs">
                                  {data.symptoms.join(', ') || 'No symptoms'} | {data.feelings.join(', ') || 'No feelings'}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {Object.values(bodyParts).some(part => part.selected && part.intensity > 0) && (
                      <div>
                        <h4 className="font-medium mb-2">Intensity Overview</h4>
                        <div className="space-y-2">
                          {Object.entries(bodyParts).map(([part, data]) => (
                            data.selected && data.intensity > 0 && (
                              <div key={part} className="flex items-center justify-between text-sm">
                                <span>{bodyPartNames[part]}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-500 h-2 rounded-full"
                                      style={{ width: `${data.intensity * 10}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-600">{data.intensity}/10</span>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {Object.values(healthMetrics).some(metric => metric !== '') && (
                      <div>
                        <h4 className="font-medium mb-2">Health Metrics</h4>
                        <div className="space-y-1 text-sm">
                          {healthMetrics.heartRate && (
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-2 text-red-500" />
                              <span>{healthMetrics.heartRate} BPM</span>
                            </div>
                          )}
                          {healthMetrics.bloodPressureSystolic && healthMetrics.bloodPressureDiastolic && (
                            <div className="flex items-center">
                              <Activity className="w-4 h-4 mr-2 text-blue-500" />
                              <span>{healthMetrics.bloodPressureSystolic}/{healthMetrics.bloodPressureDiastolic} mmHg</span>
                            </div>
                          )}
                          {healthMetrics.temperature && (
                            <div className="flex items-center">
                              <Thermometer className="w-4 h-4 mr-2 text-orange-500" />
                              <span>{healthMetrics.temperature}°F</span>
                            </div>
                          )}
                          {healthMetrics.oxygenSaturation && (
                            <div className="flex items-center">
                              <Droplet className="w-4 h-4 mr-2 text-cyan-500" />
                              <span>{healthMetrics.oxygenSaturation}% SpO2</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {journalEntry.text && (
                      <div>
                        <h4 className="font-medium mb-2">Journal Entry</h4>
                        <div className="bg-gray-50 p-3 rounded-lg text-sm max-h-40 overflow-y-auto">
                          {journalEntry.text}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Entry time: {new Date().toLocaleString()}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedParts.length === 0 && (
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No body parts selected yet</p>
                  <p className="text-sm">Select body parts on the left to see details here</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdvancedBodyMap;