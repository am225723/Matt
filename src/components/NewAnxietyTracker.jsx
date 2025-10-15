import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Brain, BarChart3, Lightbulb, ChevronLeft, ChevronRight, 
  RotateCcw, Plus, X, Save, Mic, Award, BookOpen, Pill, Heart,
  TrendingUp, Calendar, Clock, AlertCircle, CheckCircle, Download, Settings, Target
} from 'lucide-react';
import '../styles/new-anxiety-tracker.css';
import BodyMapCalibration from './BodyMapCalibration';

// Body part symptom mappings
const bodyPartSymptoms = {
  head: ['Headache', 'Racing Thoughts', 'Brain Fog', 'Dizziness', 'Jaw Clenching', 'Pressure', 'Tension'],
  chest: ['Tightness', 'Rapid Heartbeat', 'Shortness of Breath', 'Heart Palpitations', 'Chest Pain', 'Pressure'],
  stomach: ['Nausea', 'Stomachache', 'Butterflies', 'Indigestion', 'Cramping', 'Tension'],
  throat: ['Lump in Throat', 'Difficulty Swallowing', 'Tightness', 'Choking Sensation'],
  shoulders: ['Tension', 'Tightness', 'Pain', 'Stiffness'],
  arms: ['Numbness', 'Tingling', 'Weakness', 'Trembling'],
  hands: ['Sweating', 'Trembling', 'Coldness', 'Tingling', 'Clammy'],
  back: ['Tension', 'Pain', 'Stiffness', 'Tightness'],
  legs: ['Weakness', 'Restlessness', 'Trembling', 'Numbness'],
  feet: ['Tingling', 'Coldness', 'Numbness']
};

// Coping strategies by symptom type
const copingStrategies = {
  'Chest Tightness': ['Box Breathing', 'Progressive Muscle Relaxation', '4-7-8 Breathing'],
  'Racing Thoughts': ['5-4-3-2-1 Grounding', 'Mindfulness Meditation', 'Thought Journaling'],
  'Rapid Heartbeat': ['Deep Breathing', 'Cold Water on Face', 'Vagal Maneuvers'],
  'Nausea': ['Ginger Tea', 'Fresh Air', 'Acupressure Point P6'],
  'Tension': ['Progressive Muscle Relaxation', 'Stretching', 'Warm Compress'],
  'default': ['Deep Breathing', 'Grounding Techniques', 'Mindfulness', 'Take a Walk', 'Talk to Someone']
};

// Stress response types
const stressResponses = [
  { id: 'fight', label: 'Fight', description: 'Agitation, anger, confrontational' },
  { id: 'flight', label: 'Flight', description: 'Urge to leave, escape, avoid' },
  { id: 'freeze', label: 'Freeze', description: 'Feeling stuck, numb, paralyzed' },
  { id: 'fawn', label: 'Fawn', description: 'People-pleasing, avoiding conflict' }
];

const NewAnxietyTracker = ({ onBack }) => {
  // Core state
  const [currentView, setCurrentView] = useState('map'); // map, log, insights, resources
  const [bodyMapView, setBodyMapView] = useState('front'); // front, rear
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // Entry data
  const [symptoms, setSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [severity, setSeverity] = useState(5);
  const [trigger, setTrigger] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [stressResponse, setStressResponse] = useState('');
  const [notes, setNotes] = useState('');
  const [interventions, setInterventions] = useState([]);
  const [customIntervention, setCustomIntervention] = useState('');
  const [effectivenessRating, setEffectivenessRating] = useState(null);
  
  // Gamification
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);
  
  // Calibration
  const [showCalibration, setShowCalibration] = useState(false);
  const [calibrationData, setCalibrationData] = useState({});
  const [totalEntries, setTotalEntries] = useState(0);
  
  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  
  // Medication tracking
  const [medications, setMedications] = useState([]);
  const [showMedicationModal, setShowMedicationModal] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('anxietyTrackerEntries_v2');
    const savedStreak = localStorage.getItem('anxietyTrackerStreak');
    const savedBadges = localStorage.getItem('anxietyTrackerBadges');
    const savedMedications = localStorage.getItem('anxietyTrackerMedications');
    const savedCalibration = localStorage.getItem('bodyMapCalibration');
    
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedBadges) setBadges(JSON.parse(savedBadges));
    if (savedMedications) setMedications(JSON.parse(savedMedications));
    if (savedCalibration) setCalibrationData(JSON.parse(savedCalibration));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('anxietyTrackerEntries_v2', JSON.stringify(entries));
    localStorage.setItem('anxietyTrackerStreak', streak.toString());
    localStorage.setItem('anxietyTrackerBadges', JSON.stringify(badges));
    localStorage.setItem('anxietyTrackerMedications', JSON.stringify(medications));
  }, [entries, streak, badges, medications]);

  // Update total entries
  useEffect(() => {
    setTotalEntries(entries.length);
  }, [entries]);

  // Body part click handler
  const handleBodyPartClick = (bodyPart) => {
    setSelectedBodyPart(bodyPart);
    setShowModal(true);
    setCurrentEntry({
      bodyPart,
      timestamp: new Date().toISOString(),
      symptoms: [],
      severity: 5,
      trigger: '',
      heartRate: '',
      stressResponse: '',
      notes: '',
      interventions: [],
      effectivenessRating: null
    });
  };

  // Add symptom
  const addSymptom = (symptom) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
  };

  // Remove symptom
  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  // Add custom symptom
  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !symptoms.includes(customSymptom.trim())) {
      setSymptoms([...symptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  // Add intervention
  const addIntervention = (intervention) => {
    if (!interventions.includes(intervention)) {
      setInterventions([...interventions, intervention]);
    }
  };

  // Remove intervention
  const removeIntervention = (intervention) => {
    setInterventions(interventions.filter(i => i !== intervention));
  };

  // Add custom intervention
  const handleAddCustomIntervention = () => {
    if (customIntervention.trim() && !interventions.includes(customIntervention.trim())) {
      setInterventions([...interventions, customIntervention.trim()]);
      setCustomIntervention('');
    }
  };

  // Get suggested coping strategies
  const getSuggestedStrategies = () => {
    const strategies = new Set();
    symptoms.forEach(symptom => {
      const strategyList = copingStrategies[symptom] || copingStrategies.default;
      strategyList.forEach(s => strategies.add(s));
    });
    return Array.from(strategies);
  };

  // Save entry
  const saveEntry = () => {
    const entry = {
      id: Date.now(),
      bodyPart: selectedBodyPart,
      timestamp: new Date().toISOString(),
      symptoms,
      severity,
      trigger,
      heartRate,
      stressResponse,
      notes: notes || voiceTranscript,
      interventions,
      effectivenessRating
    };

    setEntries([...entries, entry]);
    
    // Update streak
    updateStreak();
    
    // Check for badges
    checkBadges(entries.length + 1);
    
    // Reset form
    resetForm();
    setShowModal(false);
  };

  // Reset form
  const resetForm = () => {
    setSelectedBodyPart(null);
    setSymptoms([]);
    setCustomSymptom('');
    setSeverity(5);
    setTrigger('');
    setHeartRate('');
    setStressResponse('');
    setNotes('');
    setVoiceTranscript('');
    setInterventions([]);
    setCustomIntervention('');
    setEffectivenessRating(null);
  };

  // Update streak
  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastEntry = entries[entries.length - 1];
    
    if (lastEntry) {
      const lastEntryDate = new Date(lastEntry.timestamp).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastEntryDate === yesterday || lastEntryDate === today) {
        setStreak(streak + 1);
      } else if (lastEntryDate !== today) {
        setStreak(1);
      }
    } else {
      setStreak(1);
    }
  };

  // Check for badges
  const checkBadges = (entryCount) => {
    const newBadges = [...badges];
    
    if (entryCount === 1 && !badges.includes('first-entry')) {
      newBadges.push('first-entry');
    }
    if (entryCount === 10 && !badges.includes('ten-entries')) {
      newBadges.push('ten-entries');
    }
    if (entryCount === 50 && !badges.includes('fifty-entries')) {
      newBadges.push('fifty-entries');
    }
    if (streak === 7 && !badges.includes('week-streak')) {
      newBadges.push('week-streak');
    }
    if (streak === 30 && !badges.includes('month-streak')) {
      newBadges.push('month-streak');
    }
    
    setBadges(newBadges);
  };

  // Voice recording (placeholder - would need Web Speech API)
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  // Export data as PDF
  const exportData = () => {
    // Implement PDF export logic here
    alert('Export functionality would generate a secure PDF report');
  };

  return (
    <div className="anxiety-tracker-container">
      {/* Header */}
      <div className="tracker-header">
        <Button variant="ghost" onClick={onBack} className="back-button">
          <ChevronLeft className="w-5 h-5" />
          Back
        </Button>
        <h1 className="tracker-title">Anxiety Tracker</h1>
        <div className="header-stats">
          <div className="stat-item">
            <Activity className="w-4 h-4" />
            <span>{streak} day streak</span>
          </div>
          <div className="stat-item">
            <Award className="w-4 h-4" />
            <span>{badges.length} badges</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tracker-nav">
        <button 
          className={`nav-tab ${currentView === 'map' ? 'active' : ''}`}
          onClick={() => setCurrentView('map')}
        >
          <Activity className="w-5 h-5" />
          Track
        </button>
        <button 
          className={`nav-tab ${currentView === 'insights' ? 'active' : ''}`}
          onClick={() => setCurrentView('insights')}
        >
          <BarChart3 className="w-5 h-5" />
          Insights
        </button>
        <button 
          className={`nav-tab ${currentView === 'resources' ? 'active' : ''}`}
          onClick={() => setCurrentView('resources')}
        >
          <BookOpen className="w-5 h-5" />
          Resources
        </button>
      </div>

      {/* Main Content */}
      <div className="tracker-content">
        {currentView === 'map' && (
          <BodyMapView 
            bodyMapView={bodyMapView}
            setBodyMapView={setBodyMapView}
            onBodyPartClick={handleBodyPartClick}
            entries={entries}
            calibrationData={calibrationData}
          />
        )}

        {currentView === 'insights' && (
          <InsightsView entries={entries} />
        )}

        {currentView === 'resources' && (
          <ResourcesView />
        )}
      </div>

      {/* Entry Modal */}
      <AnimatePresence>
        {showModal && (
          <EntryModal
            selectedBodyPart={selectedBodyPart}
            symptoms={symptoms}
            addSymptom={addSymptom}
            removeSymptom={removeSymptom}
            customSymptom={customSymptom}
            setCustomSymptom={setCustomSymptom}
            handleAddCustomSymptom={handleAddCustomSymptom}
            severity={severity}
            setSeverity={setSeverity}
            trigger={trigger}
            setTrigger={setTrigger}
            heartRate={heartRate}
            setHeartRate={setHeartRate}
            stressResponse={stressResponse}
            setStressResponse={setStressResponse}
            notes={notes}
            setNotes={setNotes}
            voiceTranscript={voiceTranscript}
            isRecording={isRecording}
            toggleRecording={toggleRecording}
            interventions={interventions}
            addIntervention={addIntervention}
            removeIntervention={removeIntervention}
            customIntervention={customIntervention}
            setCustomIntervention={setCustomIntervention}
            handleAddCustomIntervention={handleAddCustomIntervention}
            effectivenessRating={effectivenessRating}
            setEffectivenessRating={setEffectivenessRating}
            getSuggestedStrategies={getSuggestedStrategies}
            saveEntry={saveEntry}
            onClose={() => {
              setShowModal(false);
              resetForm();
            }}
          />
        )}
        
        {/* Calibration Button - Fixed at bottom */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowCalibration(true)}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg rounded-full p-4"
            size="lg"
          >
            <Target className="w-5 h-5 mr-2" />
            Calibrate Body Map
          </Button>
        </div>

        {/* Calibration Modal */}
        <AnimatePresence>
          {showCalibration && (
            <BodyMapCalibration
              onClose={() => setShowCalibration(false)}
              onSave={(newCalibration) => {
                setCalibrationData(newCalibration);
                setShowCalibration(false);
              }}
            />
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
};

// Body Map View Component
const BodyMapView = ({ bodyMapView, setBodyMapView, onBodyPartClick, entries, calibrationData = {} }) => {
  const frontImageUrl = '/1531.png';
  const rearImageUrl = '/1530.png';

  // Calculate heatmap data
  const getHeatmapIntensity = (bodyPart) => {
    const partEntries = entries.filter(e => e.bodyPart === bodyPart);
    if (partEntries.length === 0) return 0;
    const avgSeverity = partEntries.reduce((sum, e) => sum + e.severity, 0) / partEntries.length;
    return avgSeverity / 10; // Normalize to 0-1
  };

  // Body part coordinates (approximate positions on the images)
  const bodyPartCoordinates = {
    front: {
      head: { x: 50, y: 8, width: 15, height: 12 },
      throat: { x: 50, y: 20, width: 10, height: 5 },
      chest: { x: 50, y: 30, width: 25, height: 15 },
      stomach: { x: 50, y: 48, width: 22, height: 12 },
      leftShoulder: { x: 30, y: 25, width: 12, height: 8 },
      rightShoulder: { x: 70, y: 25, width: 12, height: 8 },
      leftArm: { x: 25, y: 35, width: 8, height: 20 },
      rightArm: { x: 75, y: 35, width: 8, height: 20 },
      leftHand: { x: 20, y: 55, width: 8, height: 10 },
      rightHand: { x: 80, y: 55, width: 8, height: 10 },
      leftLeg: { x: 42, y: 65, width: 10, height: 25 },
      rightLeg: { x: 58, y: 65, width: 10, height: 25 },
      leftFoot: { x: 40, y: 90, width: 8, height: 8 },
      rightFoot: { x: 60, y: 90, width: 8, height: 8 }
    },
    rear: {
      head: { x: 50, y: 8, width: 15, height: 12 },
      neck: { x: 50, y: 20, width: 10, height: 5 },
      upperBack: { x: 50, y: 30, width: 25, height: 15 },
      lowerBack: { x: 50, y: 48, width: 22, height: 12 },
      leftShoulder: { x: 30, y: 25, width: 12, height: 8 },
      rightShoulder: { x: 70, y: 25, width: 12, height: 8 },
      leftArm: { x: 25, y: 35, width: 8, height: 20 },
      rightArm: { x: 75, y: 35, width: 8, height: 20 },
      leftHand: { x: 20, y: 55, width: 8, height: 10 },
      rightHand: { x: 80, y: 55, width: 8, height: 10 },
      leftLeg: { x: 42, y: 65, width: 10, height: 25 },
      rightLeg: { x: 58, y: 65, width: 10, height: 25 },
      leftFoot: { x: 40, y: 90, width: 8, height: 8 },
      rightFoot: { x: 60, y: 90, width: 8, height: 8 }
    }
  };

  // Apply calibration data to coordinates
  const currentCoordinates = {};
  Object.entries(bodyPartCoordinates[bodyMapView]).forEach(([bodyPart, coords]) => {
    const calibration = calibrationData[bodyPart] || coords;
    currentCoordinates[bodyPart] = {
      x: calibration.x || coords.x,
      y: calibration.y || coords.y,
      width: calibration.width || coords.width,
      height: calibration.height || coords.height
    };
  });

  return (
    <div className="body-map-view">
      <div className="body-map-controls">
        <Button
          variant={bodyMapView === 'front' ? 'default' : 'outline'}
          onClick={() => setBodyMapView('front')}
        >
          Front View
        </Button>
        <Button
          variant={bodyMapView === 'rear' ? 'default' : 'outline'}
          onClick={() => setBodyMapView('rear')}
        >
          Rear View
        </Button>
      </div>

      <div className="body-map-container">
        <div className="body-map-wrapper">
          <img 
            src={bodyMapView === 'front' ? frontImageUrl : rearImageUrl}
            alt={`Body map - ${bodyMapView} view`}
            className="body-map-image"
          />
          
          {/* Interactive hotspots */}
          {Object.entries(currentCoordinates).map(([bodyPart, coords]) => {
            const intensity = getHeatmapIntensity(bodyPart);
            return (
              <motion.div
                key={bodyPart}
                className="body-hotspot"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  width: `${coords.width}%`,
                  height: `${coords.height}%`,
                  backgroundColor: `rgba(255, 100, 100, ${intensity * 0.5})`,
                  border: intensity > 0 ? '2px solid rgba(255, 100, 100, 0.8)' : 'none'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onBodyPartClick(bodyPart)}
                animate={{
                  boxShadow: intensity > 0.5 
                    ? ['0 0 0 0 rgba(255, 100, 100, 0.7)', '0 0 0 10px rgba(255, 100, 100, 0)']
                    : 'none'
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }
                }}
              >
                <span className="hotspot-label">{bodyPart}</span>
              </motion.div>
            );
          })}
        </div>

        <div className="heatmap-legend">
          <h3>Symptom Intensity</h3>
          <div className="legend-gradient">
            <span>Low</span>
            <div className="gradient-bar"></div>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Entry Modal Component
const EntryModal = ({
  selectedBodyPart,
  symptoms,
  addSymptom,
  removeSymptom,
  customSymptom,
  setCustomSymptom,
  handleAddCustomSymptom,
  severity,
  setSeverity,
  trigger,
  setTrigger,
  heartRate,
  setHeartRate,
  stressResponse,
  setStressResponse,
  notes,
  setNotes,
  voiceTranscript,
  isRecording,
  toggleRecording,
  interventions,
  addIntervention,
  removeIntervention,
  customIntervention,
  setCustomIntervention,
  handleAddCustomIntervention,
  effectivenessRating,
  setEffectivenessRating,
  getSuggestedStrategies,
  saveEntry,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const availableSymptoms = bodyPartSymptoms[selectedBodyPart] || [];
  const suggestedStrategies = getSuggestedStrategies();

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Log Anxiety Event - {selectedBodyPart}</h2>
          <button className="close-button" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-progress">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>1. Symptoms</div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>2. Context</div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>3. Intervention</div>
        </div>

        <div className="modal-body">
          {currentStep === 1 && (
            <div className="step-content">
              <h3>What are you feeling?</h3>
              
              <div className="symptom-grid">
                {availableSymptoms.map(symptom => (
                  <button
                    key={symptom}
                    className={`symptom-button ${symptoms.includes(symptom) ? 'selected' : ''}`}
                    onClick={() => symptoms.includes(symptom) ? removeSymptom(symptom) : addSymptom(symptom)}
                  >
                    {symptom}
                    {symptoms.includes(symptom) && <CheckCircle className="w-4 h-4 ml-2" />}
                  </button>
                ))}
              </div>

              <div className="custom-symptom-input">
                <input
                  type="text"
                  placeholder="Add custom symptom..."
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
                />
                <Button onClick={handleAddCustomSymptom}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="severity-slider">
                <Label>Severity: {severity}/10</Label>
                <Slider
                  value={[severity]}
                  onValueChange={(value) => setSeverity(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="severity-slider-track"
                />
                <div className="severity-labels">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content">
              <h3>What's happening?</h3>
              
              <div className="form-group">
                <Label>Trigger / Situation</Label>
                <textarea
                  placeholder="What is happening right now? (e.g., work meeting, exam, social gathering)"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <Label>Heart Rate (optional)</Label>
                  <input
                    type="number"
                    placeholder="BPM"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <Label>Time</Label>
                  <input
                    type="text"
                    value={new Date().toLocaleTimeString()}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <Label>Stress Response</Label>
                <div className="stress-response-grid">
                  {stressResponses.map(response => (
                    <button
                      key={response.id}
                      className={`stress-response-button ${stressResponse === response.id ? 'selected' : ''}`}
                      onClick={() => setStressResponse(response.id)}
                    >
                      <strong>{response.label}</strong>
                      <span>{response.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <Label>Additional Notes</Label>
                <div className="notes-input-wrapper">
                  <textarea
                    placeholder="Any other relevant information..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                  <button 
                    className={`voice-button ${isRecording ? 'recording' : ''}`}
                    onClick={toggleRecording}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
                {voiceTranscript && (
                  <div className="voice-transcript">
                    <p>{voiceTranscript}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-content">
              <h3>What helped?</h3>
              
              {severity >= 7 && (
                <div className="suggested-strategies">
                  <h4>Suggested Coping Strategies</h4>
                  <div className="strategy-grid">
                    {suggestedStrategies.map(strategy => (
                      <button
                        key={strategy}
                        className="strategy-button"
                        onClick={() => addIntervention(strategy)}
                      >
                        <Lightbulb className="w-4 h-4" />
                        {strategy}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <Label>What did you do to help?</Label>
                <div className="intervention-tags">
                  {interventions.map(intervention => (
                    <span key={intervention} className="intervention-tag">
                      {intervention}
                      <button onClick={() => removeIntervention(intervention)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="custom-intervention-input">
                  <input
                    type="text"
                    placeholder="Add intervention..."
                    value={customIntervention}
                    onChange={(e) => setCustomIntervention(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomIntervention()}
                  />
                  <Button onClick={handleAddCustomIntervention}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {interventions.length > 0 && (
                <div className="form-group">
                  <Label>How effective was it?</Label>
                  <div className="effectiveness-rating">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        className={`rating-button ${effectivenessRating === rating ? 'selected' : ''}`}
                        onClick={() => setEffectivenessRating(rating)}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <div className="rating-labels">
                    <span>Not Helpful</span>
                    <span>Very Helpful</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {currentStep > 1 && (
            <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button onClick={() => setCurrentStep(currentStep + 1)}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={saveEntry}>
              <Save className="w-4 h-4 mr-2" />
              Save Entry
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Insights View Component
const InsightsView = ({ entries }) => {
  // Calculate insights
  const getMostAffectedBodyParts = () => {
    const bodyPartCounts = {};
    entries.forEach(entry => {
      bodyPartCounts[entry.bodyPart] = (bodyPartCounts[entry.bodyPart] || 0) + 1;
    });
    return Object.entries(bodyPartCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const getCommonTriggers = () => {
    const triggers = entries.map(e => e.trigger).filter(t => t);
    const triggerCounts = {};
    triggers.forEach(trigger => {
      const words = trigger.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.length > 3) {
          triggerCounts[word] = (triggerCounts[word] || 0) + 1;
        }
      });
    });
    return Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  const getMostEffectiveInterventions = () => {
    const interventionEffectiveness = {};
    entries.forEach(entry => {
      if (entry.interventions && entry.effectivenessRating) {
        entry.interventions.forEach(intervention => {
          if (!interventionEffectiveness[intervention]) {
            interventionEffectiveness[intervention] = { total: 0, count: 0 };
          }
          interventionEffectiveness[intervention].total += entry.effectivenessRating;
          interventionEffectiveness[intervention].count += 1;
        });
      }
    });
    
    return Object.entries(interventionEffectiveness)
      .map(([intervention, data]) => ({
        intervention,
        avgRating: (data.total / data.count).toFixed(1)
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 5);
  };

  const getTimelineData = () => {
    const last30Days = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return entryDate >= thirtyDaysAgo;
    });
    
    return last30Days.map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString(),
      severity: entry.severity
    }));
  };

  const mostAffectedParts = getMostAffectedBodyParts();
  const commonTriggers = getCommonTriggers();
  const effectiveInterventions = getMostEffectiveInterventions();
  const timelineData = getTimelineData();

  return (
    <div className="insights-view">
      <h2>Your Anxiety Insights</h2>
      
      {entries.length === 0 ? (
        <div className="empty-state">
          <Brain className="w-16 h-16 mb-4 text-gray-400" />
          <p>No data yet. Start tracking to see insights!</p>
        </div>
      ) : (
        <>
          <div className="insights-grid">
            <Card className="insight-card">
              <h3>Most Affected Areas</h3>
              <div className="insight-list">
                {mostAffectedParts.map(([bodyPart, count]) => (
                  <div key={bodyPart} className="insight-item">
                    <span className="insight-label">{bodyPart}</span>
                    <div className="insight-bar">
                      <div 
                        className="insight-bar-fill"
                        style={{ width: `${(count / entries.length) * 100}%` }}
                      />
                    </div>
                    <span className="insight-value">{count} times</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="insight-card">
              <h3>Common Triggers</h3>
              <div className="trigger-cloud">
                {commonTriggers.map(([trigger, count]) => (
                  <span 
                    key={trigger}
                    className="trigger-tag"
                    style={{ fontSize: `${Math.min(count * 2 + 12, 24)}px` }}
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="insight-card">
              <h3>Most Effective Interventions</h3>
              <div className="insight-list">
                {effectiveInterventions.map(({ intervention, avgRating }) => (
                  <div key={intervention} className="insight-item">
                    <span className="insight-label">{intervention}</span>
                    <div className="rating-display">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i}
                          className={`rating-star ${i < Math.round(avgRating) ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="insight-value">{avgRating}/5</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="insight-card timeline-card">
              <h3>30-Day Timeline</h3>
              <div className="timeline-chart">
                {timelineData.map((data, index) => (
                  <div key={index} className="timeline-bar">
                    <div 
                      className="timeline-bar-fill"
                      style={{ height: `${data.severity * 10}%` }}
                      title={`${data.date}: ${data.severity}/10`}
                    />
                  </div>
                ))}
              </div>
              <div className="timeline-labels">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </Card>
          </div>

          <div className="ai-insights">
            <h3><Lightbulb className="w-5 h-5 inline mr-2" />AI-Generated Insights</h3>
            <div className="insight-cards">
              {mostAffectedParts.length > 0 && (
                <Card className="ai-insight-card">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  <p>
                    Notice: You've logged symptoms in your <strong>{mostAffectedParts[0][0]}</strong> most 
                    frequently ({mostAffectedParts[0][1]} times). Consider focusing on relaxation 
                    techniques for this area.
                  </p>
                </Card>
              )}
              
              {effectiveInterventions.length > 0 && (
                <Card className="ai-insight-card">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <p>
                    Trend Alert: <strong>{effectiveInterventions[0].intervention}</strong> has been 
                    your most effective coping strategy with an average rating of {effectiveInterventions[0].avgRating}/5.
                  </p>
                </Card>
              )}

              {entries.length >= 10 && (
                <Card className="ai-insight-card">
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                  <p>
                    Great progress! You've logged {entries.length} anxiety events. Consistent tracking 
                    helps identify patterns and improve management strategies.
                  </p>
                </Card>
              )}
            </div>
          </div>

          <div className="export-section">
            <Button onClick={() => alert('Export functionality would generate a secure PDF')}>
              <Download className="w-4 h-4 mr-2" />
              Export Data as PDF
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

// Resources View Component
const ResourcesView = () => {
  const resources = [
    {
      category: 'Breathing Techniques',
      items: [
        { title: 'Box Breathing', description: '4-4-4-4 breathing pattern for quick calm' },
        { title: '4-7-8 Breathing', description: 'Inhale 4, hold 7, exhale 8 for deep relaxation' },
        { title: 'Diaphragmatic Breathing', description: 'Belly breathing to activate relaxation response' }
      ]
    },
    {
      category: 'Grounding Techniques',
      items: [
        { title: '5-4-3-2-1 Method', description: 'Engage all 5 senses to ground yourself' },
        { title: 'Body Scan', description: 'Progressive awareness of body sensations' },
        { title: 'Mindful Observation', description: 'Focus intently on a single object' }
      ]
    },
    {
      category: 'Understanding Anxiety',
      items: [
        { title: 'The Neurobiology of Anxiety', description: 'How anxiety affects your brain and body' },
        { title: 'Fight, Flight, Freeze, Fawn', description: 'Understanding stress responses' },
        { title: 'Anxiety vs. Anxiety Disorder', description: 'When to seek professional help' }
      ]
    },
    {
      category: 'Long-term Management',
      items: [
        { title: 'Sleep Hygiene', description: 'Improving sleep quality to reduce anxiety' },
        { title: 'Exercise and Anxiety', description: 'Physical activity as anxiety management' },
        { title: 'Nutrition and Mental Health', description: 'Foods that support emotional wellbeing' }
      ]
    }
  ];

  return (
    <div className="resources-view">
      <h2>Anxiety Resources</h2>
      <p className="resources-intro">
        Expert-vetted articles, techniques, and strategies for understanding and managing anxiety.
      </p>

      <div className="resources-grid">
        {resources.map((category, index) => (
          <Card key={index} className="resource-category">
            <h3>{category.category}</h3>
            <div className="resource-list">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="resource-item">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="emergency-resources">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <div>
          <h3>Crisis Resources</h3>
          <p>If you're experiencing a mental health crisis:</p>
          <ul>
            <li>National Suicide Prevention Lifeline: 988</li>
            <li>Crisis Text Line: Text HOME to 741741</li>
            <li>SAMHSA National Helpline: 1-800-662-4357</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default NewAnxietyTracker;