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
    back: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    leftLeg: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    rightLeg: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    leftFoot: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' },
    rightFoot: { selected: false, sensations: [], feelings: [], intensity: 0, notes: '' }
  });

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSensations, setSelectedSensations] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedReliefMethods, setSelectedReliefMethods] = useState([]);
  const [entries, setEntries] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [customReliefMethod, setCustomReliefMethod] = useState('');
  const [filteredSensations, setFilteredSensations] = useState(sensations);
  const [activeTab, setActiveTab] = useState('track');
  
  // Enhanced UI state
  const [showCalibration, setShowCalibration] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calibrationData, setCalibrationData] = useState({});

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
    if (selectedSensations.length > 0) progress += 25;
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
    back: 'Back',
    leftLeg: 'Left Leg',
    rightLeg: 'Right Leg',
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
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitEntry = async () => {
    setIsSubmitting(true);
    
    const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);
    const duration = startTime ? Math.round((new Date() - startTime) / 1000 / 60) : 0;
    
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      bodyParts: selectedParts,
      sensations: selectedSensations,
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
    
    return (
      <div className="relative flex justify-center bg-gradient-to-b from-blue-50 to-indigo-50 rounded-xl p-6">
        <svg
          width="340"
          height="540"
          viewBox="0 0 340 540"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Background body silhouette */}
          <path
            d="M170 60 C130 60, 105 85, 105 125 C105 165, 130 190, 170 190 C210 190, 235 165, 235 125 C235 85, 210 60, 170 60 M170 190 L170 210 M120 210 L120 290 L220 290 L220 210 M120 290 L120 380 L220 380 L220 290 M120 210 L80 210 L55 310 L80 310 L105 250 M220 210 L260 210 L285 310 L260 310 L235 250 M55 310 L40 350 L65 365 L80 310 M285 310 L300 350 L275 365 L260 310 M120 380 L120 500 L160 500 L170 380 M220 380 L220 500 L180 500 L170 380 M120 500 L95 525 L160 525 L160 500 M220 500 L245 525 L180 525 L180 500"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          
          {/* Interactive body parts with calibration applied */}
          {Object.entries(bodyParts).map(([partKey, partData]) => {
            const isSelected = partData.selected;
            const calibration = calibrationData[partKey] || { x: 0, y: 0, scale: 1, rotation: 0 };
            
            let element = null;
            
            switch (partKey) {
              case 'head':
                element = (
                  <ellipse
                    cx="170"
                    cy="125"
                    rx="65"
                    ry="65"
                    fill={isSelected ? "rgba(59, 130, 246, 0.6)" : "rgba(203, 213, 225, 0.3)"}
                    stroke={isSelected ? "#3b82f6" : "#64748b"}
                    strokeWidth={isSelected ? "3" : "2"}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={() => handleBodyPartClick(partKey)}
                    transform={`translate(${calibration.x}, ${calibration.y}) scale(${calibration.scale}) rotate(${calibration.rotation} 170 125)`}
                  />
                );
                break;
              case 'chest':
                element = (
                  <ellipse
                    cx="170"
                    cy="250"
                    rx="50"
                    ry="40"
                    fill={isSelected ? "rgba(59, 130, 246, 0.6)" : "rgba(203, 213, 225, 0.3)"}
                    stroke={isSelected ? "#3b82f6" : "#64748b"}
                    strokeWidth={isSelected ? "3" : "2"}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={() => handleBodyPartClick(partKey)}
                    transform={`translate(${calibration.x}, ${calibration.y}) scale(${calibration.scale}) rotate(${calibration.rotation} 170 250)`}
                  />
                );
                break;
              case 'stomach':
                element = (
                  <ellipse
                    cx="170"
                    cy="335"
                    rx="50"
                    ry="45"
                    fill={isSelected ? "rgba(59, 130, 246, 0.6)" : "rgba(203, 213, 225, 0.3)"}
                    stroke={isSelected ? "#3b82f6" : "#64748b"}
                    strokeWidth={isSelected ? "3" : "2"}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={() => handleBodyPartClick(partKey)}
                    transform={`translate(${calibration.x}, ${calibration.y}) scale(${calibration.scale}) rotate(${calibration.rotation} 170 335)`}
                  />
                );
                break;
              case 'rightArm':
                element = (
                  <ellipse
                    cx="252"
                    cy="260"
                    rx="25"
                    ry="50"
                    fill={isSelected ? "rgba(59, 130, 246, 0.6)" : "rgba(203, 213, 225, 0.3)"}
                    stroke={isSelected ? "#3b82f6" : "#64748b"}
                    strokeWidth={isSelected ? "3" : "2"}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={() => handleBodyPartClick(partKey)}
                    transform={`translate(${calibration.x}, ${calibration.y}) scale(${calibration.scale}) rotate(${calibration.rotation} 252 260)`}
                  />
                );
                break;
              case 'leftArm':
                element = (
                  <ellipse
                    cx="88"
                    cy="260"
                    rx="25"
                    ry="50"
                    fill={isSelected ? "rgba(59, 130, 246, 0.6)" : "rgba(203, 213, 225, 0.3)"}
                    stroke={isSelected ? "#3b82f6" : "#64748b"}
                    strokeWidth={isSelected ? "3" : "2"}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={() => handleBodyPartClick(partKey)}
                    transform={`translate(${calibration.x}, ${calibration.y}) scale(${calibration.scale}) rotate(${calibration.rotation} 88 260)`}
                  />
                );
                break;
              default:
                // Add other body parts as needed
                break;
            }
            
            return element ? <g key={partKey}>{element}</g> : null;
          })}
        </svg>
        
        {/* Selection indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
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

        {/* Step 2: Sensations */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Heart className="w-5 h-5" />
                  Step 2: What does it feel like?
                </CardTitle>
                <p className="text-purple-600">Select all sensations you're experiencing</p>
              </CardHeader>
              <CardContent>
                {renderCheckboxGroup(filteredSensations, selectedSensations, handleSensationChange)}
                
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={selectedSensations.length === 0}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
                Back to Dashboard
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