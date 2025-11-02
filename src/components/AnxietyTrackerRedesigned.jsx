import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Brain, BarChart3, Lightbulb, ChevronLeft, ChevronRight, 
  RotateCcw, Plus, Settings, Target, Sparkles, Heart, MapPin,
  Clock, TrendingUp, Calendar, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import BodyPartDetailsModal from './BodyPartDetailsModal';
import AnxietyVisualizations from './AnxietyVisualizations';
import AnxietyResources from './AnxietyResources';
import BodyMapCalibrationRedesigned from './BodyMapCalibrationRedesigned';

// Enhanced data arrays
const sensations = [
  'Tightness', 'Racing Heart', 'Numbness', 'Tingling', 'Dizziness', 
  'Nausea', 'Sweating', 'Trembling', 'Shortness of Breath', 'Chest Pain',
  'Choking Feeling', 'Hot Flashes', 'Chills', 'Lightheadedness'
];

const activities = [
  'Working', 'Exercising', 'Socializing', 'Resting', 'In Transit', 
  'Eating', 'Before Sleep', 'Upon Waking', 'During Meeting', 'Public Speaking',
  'Conflict Situation', 'Making Decisions', 'Alone', 'In Crowds'
];

const reliefMethods = [
  'Deep Breathing', 'Went for a walk', 'Drank water', 'Meditation', 
  'Talked to someone', 'Took a break', 'Stretching', 'Listened to music',
  'Grounding techniques', 'Progressive muscle relaxation', 'Mindfulness exercise'
];

const bodyPartSensationMap = {
  'Head': ['Dizziness', 'Lightheadedness', 'Tingling'],
  'Face': ['Sweating', 'Hot Flashes', 'Tingling'],
  'Neck': ['Tightness', 'Tingling'],
  'Chest': ['Racing Heart', 'Chest Pain', 'Shortness of Breath', 'Tightness', 'Choking Feeling'],
  'Stomach': ['Nausea', 'Tightness'],
  'Left Arm': ['Numbness', 'Tingling'],
  'Right Arm': ['Numbness', 'Tingling'],
  'Left Hand': ['Numbness', 'Tingling', 'Sweating', 'Trembling'],
  'Right Hand': ['Numbness', 'Tingling', 'Sweating', 'Trembling'],
  'Back': ['Tightness'],
  'Left Leg': ['Numbness', 'Tingling', 'Trembling'],
  'Right Leg': ['Numbness', 'Tingling', 'Trembling'],
  'Left Foot': ['Numbness', 'Tingling'],
  'Right Foot': ['Numbness', 'Tingling']
};

const AnxietyTrackerRedesigned = ({ onBack }) => {
  const { toast } = useToast();
  
  // Core state
  const [bodyParts, setBodyParts] = useState({
    head: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    face: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    neck: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    chest: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    stomach: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    leftArm: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    rightArm: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    leftHand: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    rightHand: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    leftShoulder: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    rightShoulder: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    upperBack: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    midBack: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    lowerBack: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    leftGlute: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    rightGlute: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    leftLeg: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    rightLeg: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    leftCalf: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    rightCalf: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    leftFoot: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    rightFoot: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' }
  });

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSensations, setSelectedSensations] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedReliefMethods, setSelectedReliefMethods] = useState([]);
  const [entries, setEntries] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentBodyPartIndex, setCurrentBodyPartIndex] = useState(0);
  const [customReliefMethod, setCustomReliefMethod] = useState('');
  const [filteredSensations, setFilteredSensations] = useState(sensations);
  const [activeTab, setActiveTab] = useState('track');
  
  // Enhanced UI state
  const [showCalibration, setShowCalibration] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calibrationData, setCalibrationData] = useState({});
  const [showFront, setShowFront] = useState(true);

  // Load data on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('anxietyTrackerEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    
    const savedCalibration = localStorage.getItem('bodyMapCalibration');
    if (savedCalibration) {
      setCalibrationData(JSON.parse(savedCalibration));
    }
    
    setStartTime(new Date());
  }, []);

  // Save entries when they change
  useEffect(() => {
    localStorage.setItem('anxietyTrackerEntries', JSON.stringify(entries));
  }, [entries]);

  // Update filtered sensations based on selected body parts
  useEffect(() => {
    const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);
    if (selectedParts.length === 0) {
      setFilteredSensations(sensations);
      return;
    }

    const relatedSensations = new Set();
    selectedParts.forEach(part => {
      const partName = part.charAt(0).toUpperCase() + part.slice(1);
      if (bodyPartSensationMap[partName]) {
        bodyPartSensationMap[partName].forEach(sensation => relatedSensations.add(sensation));
      }
    });

    const prioritizedSensations = [
      ...Array.from(relatedSensations),
      ...sensations.filter(sensation => !relatedSensations.has(sensation))
    ];

    setFilteredSensations(prioritizedSensations);
  }, [bodyParts]);

  // Calculate session progress
  useEffect(() => {
    let progress = 0;
    const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);
    
    if (selectedParts.length > 0) progress += 25;
    
    // Check if any body part has sensations recorded
    const hasSensations = selectedParts.some(part => bodyParts[part].sensations.length > 0);
    if (hasSensations || currentStep > 2) progress += 25;
    
    if (selectedActivities.length > 0) progress += 25;
    if (currentStep === 4) progress += 25;
    
    setSessionProgress(progress);
  }, [bodyParts, selectedSensations, selectedActivities, currentStep]);

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
    leftShoulder: 'Left Shoulder',
    rightShoulder: 'Right Shoulder',
    upperBack: 'Upper Back',
    midBack: 'Mid Back',
    lowerBack: 'Lower Back',
    leftGlute: 'Left Glute',
    rightGlute: 'Right Glute',
    leftLeg: 'Left Leg',
    rightLeg: 'Right Leg',
    leftCalf: 'Left Calf',
    rightCalf: 'Right Calf',
    leftFoot: 'Left Foot',
    rightFoot: 'Right Foot'
  };

  const handleBodyPartClick = (part) => {
    setBodyParts(prev => ({
      ...prev,
      [part]: {
        ...prev[part],
        selected: !prev[part].selected
      }
    }));
  };

  const handleSensationChange = (sensation) => {
    setSelectedSensations(prev => 
      prev.includes(sensation) 
        ? prev.filter(s => s !== sensation)
        : [...prev, sensation]
    );
  };

  const handleActivityChange = (activity) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleReliefMethodChange = (method) => {
    setSelectedReliefMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const handleNextStep = () => {
    const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);
    
    if (currentStep === 1) {
      // Move from body selection to first body part questions
      setCurrentBodyPartIndex(0);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Check if there are more body parts to question
      if (currentBodyPartIndex < selectedParts.length - 1) {
        setCurrentBodyPartIndex(currentBodyPartIndex + 1);
      } else {
        // All body parts done, aggregate sensations and move to activities
        const allSensations = new Set();
        selectedParts.forEach(partKey => {
          bodyParts[partKey].sensations.forEach(sensation => allSensations.add(sensation));
        });
        setSelectedSensations(Array.from(allSensations));
        setCurrentStep(3);
      }
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);
    
    if (currentStep === 2 && currentBodyPartIndex > 0) {
      // Go back to previous body part
      setCurrentBodyPartIndex(currentBodyPartIndex - 1);
    } else if (currentStep > 1) {
      if (currentStep === 2) {
        setCurrentBodyPartIndex(0);
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitEntry = async () => {
    setIsSubmitting(true);
    
    const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);
    const duration = startTime ? Math.round((new Date() - startTime) / 1000 / 60) : 0;
    
    // Aggregate all sensations from individual body parts
    const allSensations = new Set();
    selectedParts.forEach(partKey => {
      bodyParts[partKey].sensations.forEach(sensation => allSensations.add(sensation));
    });
    
    // Build detailed body parts data
    const detailedBodyParts = {};
    selectedParts.forEach(partKey => {
      detailedBodyParts[partKey] = {
        name: bodyPartNames[partKey],
        sensations: bodyParts[partKey].sensations,
        intensity: bodyParts[partKey].intensity,
        notes: bodyParts[partKey].notes
      };
    });
    
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      bodyParts: selectedParts,
      detailedBodyParts: detailedBodyParts,
      sensations: Array.from(allSensations),
      activities: selectedActivities,
      reliefMethods: [...selectedReliefMethods, customReliefMethod].filter(Boolean),
      duration: duration,
      overallIntensity: Math.max(...Object.values(bodyParts).map(p => p.intensity), 1)
    };

    try {
      setEntries(prev => [entry, ...prev]);
      
      toast({
        title: "Entry Saved",
        description: `Your anxiety tracking entry has been recorded (${duration} minutes).`,
      });
      
      // Reset form
      setBodyParts(Object.keys(bodyParts).reduce((acc, key) => {
        acc[key] = { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' };
        return acc;
      }, {}));
      setSelectedSensations([]);
      setSelectedActivities([]);
      setSelectedReliefMethods([]);
      setCustomReliefMethod('');
      setCurrentStep(1);
      setStartTime(new Date());
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save entry. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalibrationSave = (newCalibration) => {
    setCalibrationData(newCalibration);
    setShowCalibration(false);
    toast({
      title: "Calibration Updated",
      description: "Body map alignment has been updated successfully.",
    });
  };

  const renderBodyMap = () => {
    const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);
    
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
      leftShoulder: 'left-shoulder-region',
      rightShoulder: 'right-shoulder-region',
      upperBack: 'upper-back-region',
      midBack: 'mid-back-region',
      lowerBack: 'lower-back-region',
      leftGlute: 'left-glute-region',
      rightGlute: 'right-glute-region',
      leftLeg: 'left-leg-region',
      rightLeg: 'right-leg-region',
      leftCalf: 'left-calf-region',
      rightCalf: 'right-calf-region',
      leftFoot: 'left-foot-region',
      rightFoot: 'right-foot-region'
    };
    
    const getFillColor = (part) => {
      if (bodyParts[part].selected) {
        return 'rgba(59, 130, 246, 0.2)';
      }
      return 'rgba(203, 213, 225, 0.05)';
    };

    const getStrokeColor = (part) => {
      return bodyParts[part].selected ? 'rgba(59, 130, 246, 0.6)' : 'transparent';
    };

    const getStrokeWidth = (part) => {
      return bodyParts[part].selected ? '2' : '0';
    };
    
    return (
      <div className="relative flex flex-col items-center bg-gradient-to-b from-blue-50 to-indigo-50 rounded-xl p-6">
        <svg
          width="400"
          height="600"
          viewBox="0 0 400 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Background Image */}
          <image
            href={showFront ? 'https://efgtznvrnzqcxmfmjuue.supabase.co/storage/v1/object/public/images/1531.png' : 'https://efgtznvrnzqcxmfmjuue.supabase.co/storage/v1/object/public/images/1530.png'}
            x="0"
            y="0"
            height="600"
            width="400"
            preserveAspectRatio="xMidYMid slice"
          />
          
          {/* Interactive body parts */}
          {Object.entries(bodyPartIds).map(([part, id]) => {
            // Front-only parts
            const frontOnlyParts = ['face', 'chest', 'stomach'];
            // Back-only parts
            const backOnlyParts = ['upperBack', 'midBack', 'lowerBack', 'leftGlute', 'rightGlute', 'leftCalf', 'rightCalf'];
            
            if (frontOnlyParts.includes(part) && !showFront) return null;
            if (backOnlyParts.includes(part) && showFront) return null;

            const pathData = {
              // Universal parts (visible on both sides)
              head: "M 175,30 C 175,10 225,10 225,30 C 245,30 245,110 225,130 C 225,130 175,130 175,130 C 155,110 155,30 175,30 Z",
              neck: "M 185,130 H 215 V 155 H 185 Z",
              leftShoulder: "M 120,155 H 160 V 200 H 120 Z",
              rightShoulder: "M 240,155 H 280 V 200 H 240 Z",
              leftArm: "M 110,200 H 150 V 320 H 110 Z",
              rightArm: "M 250,200 H 290 V 320 H 250 Z",
              leftHand: "M 100,320 H 140 V 380 H 100 Z",
              rightHand: "M 260,320 H 300 V 380 H 260 Z",
              leftLeg: "M 155,380 H 195 V 470 H 155 Z",
              rightLeg: "M 205,380 H 245 V 470 H 205 Z",
              leftFoot: "M 150,500 H 190 V 540 H 150 Z",
              rightFoot: "M 210,500 H 250 V 540 H 210 Z",
              
              // Front-only parts
              face: "M 180,60 H 220 V 125 H 180 Z",
              chest: "M 150,200 H 250 V 290 H 150 Z",
              stomach: "M 155,290 H 245 V 380 H 155 Z",
              
              // Back-only parts
              upperBack: "M 150,155 H 250 V 240 H 150 Z",
              midBack: "M 155,240 H 245 V 310 H 155 Z",
              lowerBack: "M 160,310 H 240 V 360 H 160 Z",
              leftGlute: "M 155,360 H 195 V 410 H 155 Z",
              rightGlute: "M 205,360 H 245 V 410 H 205 Z",
              leftCalf: "M 160,470 H 192 V 500 H 160 Z",
              rightCalf: "M 208,470 H 240 V 500 H 208 Z",
            };

            return (
              <motion.path
                key={part}
                id={id}
                d={pathData[part]}
                fill={getFillColor(part)}
                stroke={getStrokeColor(part)}
                strokeWidth={getStrokeWidth(part)}
                onClick={() => handleBodyPartClick(part)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                style={{ cursor: 'pointer' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15,
                  duration: 0.3 
                }}
              />
            );
          })}
        </svg>
        
        {/* Toggle front/back button */}
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFront(!showFront)}
            className="bg-white/80 backdrop-blur-sm"
          >
            Show {showFront ? 'Back' : 'Front'}
          </Button>
        </div>
        
        {/* Selection indicator */}
        <div className="mt-2">
          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
            {selectedParts.length} part{selectedParts.length !== 1 ? 's' : ''} selected
          </Badge>
        </div>
      </div>
    );
  };

  const renderCheckboxGroup = (items, selectedItems, onChange, columns = 3) => (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-3`}>
      {items.map(item => (
        <motion.div
          key={item}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            selectedItems.includes(item)
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}>
            <input
              type="checkbox"
              checked={selectedItems.includes(item)}
              onChange={() => onChange(item)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
              selectedItems.includes(item)
                ? 'border-indigo-500 bg-indigo-500'
                : 'border-gray-300'
            }`}>
              {selectedItems.includes(item) && (
                <CheckCircle2 className="w-3 h-3 text-white" />
              )}
            </div>
            <span className="text-sm font-medium">{item}</span>
          </label>
        </motion.div>
      ))}
    </div>
  );

  const renderTrackingForm = () => {
    const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);
    
    return (
      <div className="space-y-6">
        {/* Step 1: Body Parts */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-800">
                  <MapPin className="w-5 h-5" />
                  Step 1: Where do you feel it?
                </CardTitle>
                <p className="text-indigo-600">Select all body parts where you're experiencing anxiety symptoms</p>
              </CardHeader>
              <CardContent>
                {renderBodyMap()}
                
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Selected areas: {selectedParts.length > 0 ? selectedParts.map(part => bodyPartNames[part]).join(', ') : 'None'}
                  </div>
                  <Button
                    onClick={handleNextStep}
                    disabled={selectedParts.length === 0}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Individual Body Part Questions */}
        {currentStep === 2 && (() => {
          const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);
          const currentPartKey = selectedParts[currentBodyPartIndex];
          const currentPart = bodyParts[currentPartKey];
          const currentPartName = bodyPartNames[currentPartKey];
          
          // Get sensations specific to this body part
          const partSensations = bodyPartSensationMap[currentPartName] || sensations;
          
          return (
            <motion.div
              key={currentPartKey}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                      Body Part {currentBodyPartIndex + 1} of {selectedParts.length}
                    </Badge>
                  </div>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Heart className="w-5 h-5" />
                    What does it feel like in your {currentPartName}?
                  </CardTitle>
                  <p className="text-purple-600">Select all sensations you're experiencing in your {currentPartName}</p>
                </CardHeader>
                <CardContent>
                  {renderCheckboxGroup(
                    partSensations, 
                    currentPart.sensations, 
                    (sensation) => {
                      setBodyParts(prev => ({
                        ...prev,
                        [currentPartKey]: {
                          ...prev[currentPartKey],
                          sensations: prev[currentPartKey].sensations.includes(sensation)
                            ? prev[currentPartKey].sensations.filter(s => s !== sensation)
                            : [...prev[currentPartKey].sensations, sensation]
                        }
                      }));
                    }
                  )}
                  
                  {/* Intensity Slider */}
                  <div className="mt-6 space-y-2">
                    <Label className="text-sm font-medium text-purple-800">
                      Intensity Level: {currentPart.intensity}/10
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={currentPart.intensity}
                      onChange={(e) => {
                        setBodyParts(prev => ({
                          ...prev,
                          [currentPartKey]: {
                            ...prev[currentPartKey],
                            intensity: parseInt(e.target.value)
                          }
                        }));
                      }}
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  {/* Notes */}
                  <div className="mt-4">
                    <Label className="text-sm font-medium text-purple-800">
                      Additional notes for {currentPartName} (optional):
                    </Label>
                    <textarea
                      value={currentPart.notes}
                      onChange={(e) => {
                        setBodyParts(prev => ({
                          ...prev,
                          [currentPartKey]: {
                            ...prev[currentPartKey],
                            notes: e.target.value
                          }
                        }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3"
                      placeholder="Any specific details about how this feels..."
                      rows="3"
                    />
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep} className="border-purple-300 text-purple-700 hover:bg-purple-50">
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      {currentBodyPartIndex === 0 ? 'Back to Selection' : 'Previous Part'}
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {currentBodyPartIndex < selectedParts.length - 1 ? 'Next Part' : 'Continue'}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })()}

        {/* Step 3: Activities */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Activity className="w-5 h-5" />
                  Step 3: What were you doing?
                </CardTitle>
                <p className="text-green-600">Select activities that were happening when anxiety started</p>
              </CardHeader>
              <CardContent>
                {renderCheckboxGroup(activities, selectedActivities, handleActivityChange)}
                
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={selectedActivities.length === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Relief Methods */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Sparkles className="w-5 h-5" />
                  Step 4: What helped? (Optional)
                </CardTitle>
                <p className="text-orange-600">Select any relief methods you tried</p>
              </CardHeader>
              <CardContent>
                {renderCheckboxGroup(reliefMethods, selectedReliefMethods, handleReliefMethodChange, 2)}
                
                <div className="mt-4">
                  <Label htmlFor="customRelief" className="text-sm font-medium text-gray-700">
                    Other (please specify):
                  </Label>
                  <input
                    type="text"
                    id="customRelief"
                    value={customReliefMethod}
                    onChange={(e) => setCustomReliefMethod(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3"
                    placeholder="E.g., Called a friend, listened to music..."
                  />
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmitEntry}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Complete Entry
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={onBack} variant="ghost" className="hover:bg-blue-100">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Anxiety Tracker
                </h1>
                <p className="text-sm text-gray-600">Track symptoms and identify patterns</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-white">
                Progress: {sessionProgress}%
              </Badge>
              {startTime && (
                <Badge variant="outline" className="bg-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {Math.round((new Date() - startTime) / 1000 / 60)}m
                </Badge>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={sessionProgress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'track' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('track')}
          >
            <Activity className="inline-block w-4 h-4 mr-2" />
            Track Anxiety
          </button>
          <button
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'insights' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('insights')}
            disabled={entries.length === 0}
          >
            <BarChart3 className="inline-block w-4 h-4 mr-2" />
            Insights
          </button>
          <button
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'resources' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('resources')}
          >
            <Lightbulb className="inline-block w-4 h-4 mr-2" />
            Resources
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'track' && renderTrackingForm()}
          
          {activeTab === 'insights' && (
            <AnxietyVisualizations entries={entries} />
          )}
          
          {activeTab === 'resources' && (
            <AnxietyResources recentEntries={entries} />
          )}
        </div>
      </div>

      {/* Calibration Button - Fixed at bottom */}
      <div className="fixed bottom-6 right-6 z-30">
        <Button
          onClick={() => setShowCalibration(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg rounded-full p-4"
          size="lg"
        >
          <Target className="w-5 h-5 mr-2" />
          Calibrate Body Map
        </Button>
      </div>

      {/* Calibration Modal */}
      <AnimatePresence>
        {showCalibration && (
          <BodyMapCalibrationRedesigned
            onClose={() => setShowCalibration(false)}
            onSave={handleCalibrationSave}
            initialCalibration={calibrationData}
          />
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <BodyPartDetailsModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            bodyParts={bodyParts}
            setBodyParts={setBodyParts}
            bodyPartNames={bodyPartNames}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnxietyTrackerRedesigned;