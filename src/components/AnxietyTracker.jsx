import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Activity, Brain, BarChart3, Lightbulb } from 'lucide-react';
import EnhancedBodyMapSVG from './EnhancedBodyMapSVG';
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
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
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
    if (selectedBodyParts.length === 0) {
      setFilteredSensations(sensations);
      return;
    }

    // Get all sensations related to selected body parts
    const relatedSensations = new Set();
    selectedBodyParts.forEach(part => {
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
  }, [selectedBodyParts]);

  // Handle body part selection from SVG
  const handleBodyPartClick = (part) => {
    setSelectedBodyParts(prev => 
      prev.includes(part) 
        ? prev.filter(p => p !== part) 
        : [...prev, part]
    );
  };

  // Handle checkbox changes for body parts (legacy method)
  const handleBodyPartChange = (part) => {
    setSelectedBodyParts(prev => 
      prev.includes(part) 
        ? prev.filter(p => p !== part) 
        : [...prev, part]
    );
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
      bodyParts: selectedBodyParts,
      sensations: selectedSensations,
      activities: selectedActivities,
      reliefMethods: [
        ...selectedReliefMethods,
        ...(customReliefMethod ? [customReliefMethod] : [])
      ]
    };
    
    setEntries(prev => [newEntry, ...prev]);
    
    // Reset form
    setSelectedBodyParts([]);
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
  const renderTrackingForm = () => (
    <div>
      <Card className="p-6 mb-8">
        {currentStep === 1 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Where do you feel it? (Select all that apply)</h3>
            
            {useSVGMap ? (
              <div className="mb-6">
                <EnhancedBodyMapSVG 
                  selectedParts={selectedBodyParts} 
                  onPartClick={handleBodyPartClick}
                  highlightIntensity="medium"
                />
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected areas: {selectedBodyParts.length > 0 ? selectedBodyParts.join(', ') : 'None'}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setUseSVGMap(false)}
                    className="text-xs"
                  >
                    Switch to checkbox list
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                {renderCheckboxGroup(
                  Object.keys(bodyPartSensationMap), 
                  selectedBodyParts, 
                  handleBodyPartChange
                )}
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setUseSVGMap(true)}
                    className="text-xs"
                  >
                    Switch to body map
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleNextStep}
                disabled={selectedBodyParts.length === 0}
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
                      <strong>Where:</strong> {entry.bodyParts.join(', ')}
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