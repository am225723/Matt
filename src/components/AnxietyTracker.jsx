import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { Activity, Brain, BarChart3, Lightbulb, ChevronLeft, ChevronRight, RotateCcw, Plus } from 'lucide-react';
import BodyPartDetailsModal from './BodyPartDetailsModal';
import AnxietyVisualizations from './AnxietyVisualizations';
import AnxietyResources from './AnxietyResources';

// Arrays for sensations, activities, and relief methods
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

// Mapping of body parts to related sensations for contextual filtering
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

// Main component
const AnxietyTracker = ({ onBack }) => {
  // State for selected options
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
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFront, setShowFront] = useState(true);
  const [selectedSensations, setSelectedSensations] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedReliefMethods, setSelectedReliefMethods] = useState([]);
  const [entries, setEntries] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [customReliefMethod, setCustomReliefMethod] = useState('');
  const [filteredSensations, setFilteredSensations] = useState(sensations);
  const [useSVGMap, setUseSVGMap] = useState(true);
  const [activeTab, setActiveTab] = useState('track'); // 'track', 'insights', 'resources'

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('anxietyTrackerEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('anxietyTrackerEntries', JSON.stringify(entries));
  }, [entries]);

  // Update filtered sensations when body parts change
  useEffect(() => {
    const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);
    if (selectedParts.length === 0) {
      setFilteredSensations(sensations);
      return;
    }

    // Get all sensations related to selected body parts
    const relatedSensations = new Set();
    selectedParts.forEach(part => {
      if (bodyPartSensationMap[part]) {
        bodyPartSensationMap[part].forEach(sensation => relatedSensations.add(sensation));
      }
    });

    // Add all sensations but prioritize related ones
    const prioritizedSensations = [
      ...Array.from(relatedSensations),
      ...sensations.filter(sensation => !relatedSensations.has(sensation))
    ];

    setFilteredSensations(prioritizedSensations);
  }, [bodyParts]);

  useEffect(() => {
    // Sync the visibility of front/back of the body with the flip animation
    const timer = setTimeout(() => {
      if (isFlipped) {
        setShowFront(false);
      } else {
        setShowFront(true);
      }
    }, 300); // Middle of 0.6s animation

    return () => clearTimeout(timer);
  }, [isFlipped]);

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

  // Open details modal for selected parts
  const handleDetailsModal = () => {
    const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);
    if (selectedParts.length > 0) {
      setShowDetailsModal(true);
    }
  };

  // Handle checkbox changes for sensations
  const handleSensationChange = (sensation) => {
    setSelectedSensations(prev => 
      prev.includes(sensation) 
        ? prev.filter(s => s !== sensation) 
        : [...prev, sensation]
    );
  };

  // Handle checkbox changes for activities
  const handleActivityChange = (activity) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity) 
        : [...prev, activity]
    );
  };

  // Handle checkbox changes for relief methods
  const handleReliefMethodChange = (method) => {
    setSelectedReliefMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method) 
        : [...prev, method]
    );
  };

  // Handle custom relief method input
  const handleCustomReliefMethodChange = (e) => {
    setCustomReliefMethod(e.target.value);
  };

  // Handle form submission
  const handleSubmit = () => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      bodyParts: bodyParts,
      sensations: selectedSensations,
      activities: selectedActivities,
      reliefMethods: [
        ...selectedReliefMethods,
        ...(customReliefMethod ? [customReliefMethod] : [])
      ]
    };
    
    setEntries(prev => [newEntry, ...prev]);
    
    // Reset form
    setBodyParts({
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
    setSelectedSensations([]);
    setSelectedActivities([]);
    setSelectedReliefMethods([]);
    setCustomReliefMethod('');
    setCurrentStep(1);
  };

  // Handle next step
  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Render checkbox group
  const renderCheckboxGroup = (items, selectedItems, handleChange, columnCount = 3) => {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-${columnCount} gap-2`}>
        {items.map((item) => (
          <div key={item} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={item}
              checked={selectedItems.includes(item)}
              onChange={() => handleChange(item)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor={item} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {item}
            </Label>
          </div>
        ))}
      </div>
    );
  };

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
        return 'rgba(59, 130, 246, 0.4)';
      }
      return 'rgba(203, 213, 225, 0.4)';
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
          {/* Background Image */}
          <image
            href={showFront ? 'https://boratqerjbqthxdzvypd.supabase.co/storage/v1/object/public/Photos/1531.png' : 'https://boratqerjbqthxdzvypd.supabase.co/storage/v1/object/public/Photos/1530.png'}
            x="0"
            y="0"
            height="600"
            width="400"
            preserveAspectRatio="xMidYMid slice"
          />

          {/* Body parts with enhanced paths */}
          {Object.entries(bodyPartIds).map(([part, id]) => {
            if (part === 'back' && showFront) return null;
            if (part !== 'back' && !showFront) return null;

            const pathData = {
                head: "M 175,30 C 175,10 225,10 225,30 C 245,30 245,110 225,130 C 225,130 175,130 175,130 C 155,110 155,30 175,30 Z",
                face: "M 180,60 H 220 V 125 H 180 Z",
                neck: "M 185,130 H 215 V 155 H 185 Z",
                chest: "M 150,155 H 250 V 260 H 150 Z",
                stomach: "M 155,260 H 245 V 350 H 155 Z",
                back: "M 150,155 H 250 V 350 H 150 Z",
                leftArm: "M 110,160 H 150 V 320 H 110 Z",
                rightArm: "M 250,160 H 290 V 320 H 250 Z",
                leftHand: "M 100,320 H 140 V 380 H 100 Z",
                rightHand: "M 260,320 H 300 V 380 H 260 Z",
                leftLeg: "M 155,350 H 195 V 500 H 155 Z",
                rightLeg: "M 205,350 H 245 V 500 H 205 Z",
                leftFoot: "M 150,500 H 190 V 540 H 150 Z",
                rightFoot: "M 210,500 H 250 V 540 H 210 Z",
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
                head: { x: 200, y: 45, rotation: 0 },
                face: { x: 200, y: 85, rotation: 0 },
                neck: { x: 200, y: 140, rotation: 0 },
                chest: { x: 200, y: 205, rotation: 0 },
                stomach: { x: 200, y: 305, rotation: 0 },
                back: { x: 200, y: 245, rotation: 0 },
                leftArm: { x: 130, y: 240, rotation: 0 },
                rightArm: { x: 270, y: 240, rotation: 0 },
                leftHand: { x: 120, y: 350, rotation: 0 },
                rightHand: { x: 280, y: 350, rotation: 0 },
                leftLeg: { x: 175, y: 425, rotation: 0 },
                rightLeg: { x: 225, y: 425, rotation: 0 },
                leftFoot: { x: 170, y: 520, rotation: 0 },
                rightFoot: { x: 230, y: 520, rotation: 0 },
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

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Render the tracking form
  const renderTrackingForm = () => {
    const selectedParts = Object.keys(bodyParts).filter(part => bodyParts[part].selected);
    return (
      <div>
        <Card className="p-6 mb-8">
          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Where do you feel it? (Select all that apply)</h3>

              <div className="mb-6">
                  {renderBodyMap()}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Selected areas: {selectedParts.length > 0 ? selectedParts.join(', ') : 'None'}
                    </p>
                    <Button
                        size="sm"
                        onClick={handleDetailsModal}
                        className="flex items-center mx-auto"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Details
                      </Button>
                  </div>
                </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleNextStep}
                  disabled={selectedParts.length === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">What does it feel like? (Select all that apply)</h3>
              {renderCheckboxGroup(filteredSensations, selectedSensations, handleSensationChange)}
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={selectedSensations.length === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

        {currentStep === 3 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">What were you doing? (Select all that apply)</h3>
            {renderCheckboxGroup(activities, selectedActivities, handleActivityChange)}
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <Button 
                onClick={handleNextStep}
                disabled={selectedActivities.length === 0}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">What helped? (Optional)</h3>
            {renderCheckboxGroup(reliefMethods, selectedReliefMethods, handleReliefMethodChange, 2)}
            
            <div className="mt-4">
              <Label htmlFor="customRelief" className="text-sm font-medium">
                Other (please specify):
              </Label>
              <input
                type="text"
                id="customRelief"
                value={customReliefMethod}
                onChange={handleCustomReliefMethodChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="E.g., Called a friend"
              />
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <Button onClick={handleSubmit}>
                Save Entry
              </Button>
            </div>
          </div>
        )}
      </Card>

      {entries.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Entries</h3>
          <div className="space-y-4">
            {entries.slice(0, 5).map((entry) => (
              <Card key={entry.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{formatDate(entry.timestamp)}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Where:</strong> {Object.keys(entry.bodyParts).filter(p => entry.bodyParts[p].selected).join(', ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Sensations:</strong> {entry.sensations.join(', ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Activity:</strong> {entry.activities.join(', ')}
                    </p>
                    {entry.reliefMethods.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        <strong>What helped:</strong> {entry.reliefMethods.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Button onClick={onBack} className="mb-8">&larr; Back to Dashboard</Button>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold flex items-center">
            <Brain className="mr-2 h-8 w-8 text-primary" />
            Anxiety Tracker
          </h2>
          <p className="text-muted-foreground mt-1">
            Track your anxiety symptoms and identify patterns to better manage your mental health.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'track' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('track')}
          >
            <Activity className="inline-block w-4 h-4 mr-1" />
            Track Anxiety
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'insights' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('insights')}
            disabled={entries.length === 0}
          >
            <BarChart3 className="inline-block w-4 h-4 mr-1" />
            Insights
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'resources' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('resources')}
          >
            <Lightbulb className="inline-block w-4 h-4 mr-1" />
            Resources
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'track' && renderTrackingForm()}
        
        {activeTab === 'insights' && (
          <AnxietyVisualizations entries={entries} />
        )}
        
        {activeTab === 'resources' && (
          <AnxietyResources recentEntries={entries} />
        )}
      </div>
    </div>
  );
};

export default AnxietyTracker;