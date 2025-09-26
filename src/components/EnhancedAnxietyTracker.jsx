import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Brain, BarChart3, Lightbulb, TrendingUp, Calendar, Heart } from 'lucide-react';
import BodyMapSVG from './BodyMapSVG';
import EnhancedAnxietyVisualizations from './EnhancedAnxietyVisualizations';
import AnxietyResources from './AnxietyResources';

// Enhanced data arrays with more comprehensive options
const sensations = [
  'Tightness', 'Racing Heart', 'Numbness', 'Tingling', 'Dizziness', 
  'Nausea', 'Sweating', 'Trembling', 'Shortness of Breath', 'Chest Pain',
  'Choking Feeling', 'Hot Flashes', 'Chills', 'Lightheadedness', 'Brain Fog',
  'Muscle Tension', 'Restlessness', 'Irritability', 'Difficulty Concentrating'
];

const activities = [
  'Working', 'Exercising', 'Socializing', 'Resting', 'In Transit', 
  'Eating', 'Before Sleep', 'Upon Waking', 'During Meeting', 'Public Speaking',
  'Conflict Situation', 'Making Decisions', 'Alone', 'In Crowds', 'Shopping',
  'Driving', 'Phone Calls', 'Social Media', 'News Consumption'
];

const reliefMethods = [
  'Deep Breathing', 'Went for a walk', 'Drank water', 'Meditation', 
  'Talked to someone', 'Took a break', 'Stretching', 'Listened to music',
  'Grounding techniques', 'Progressive muscle relaxation', 'Mindfulness exercise',
  'Journaling', 'Cold water on face', 'Progressive relaxation', 'Visualization',
  'Gratitude practice', 'Physical exercise', 'Reading', 'Creative activities'
];

// Enhanced body part mapping
const bodyPartSensationMap = {
  'Head': ['Dizziness', 'Lightheadedness', 'Tingling', 'Brain Fog', 'Difficulty Concentrating'],
  'Face': ['Sweating', 'Hot Flashes', 'Tingling', 'Muscle Tension'],
  'Neck': ['Tightness', 'Tingling', 'Muscle Tension'],
  'Chest': ['Racing Heart', 'Chest Pain', 'Shortness of Breath', 'Tightness', 'Choking Feeling'],
  'Stomach': ['Nausea', 'Tightness', 'Butterflies'],
  'Left Arm': ['Numbness', 'Tingling', 'Muscle Tension'],
  'Right Arm': ['Numbness', 'Tingling', 'Muscle Tension'],
  'Left Hand': ['Numbness', 'Tingling', 'Sweating', 'Trembling'],
  'Right Hand': ['Numbness', 'Tingling', 'Sweating', 'Trembling'],
  'Back': ['Tightness', 'Muscle Tension'],
  'Left Leg': ['Numbness', 'Tingling', 'Trembling', 'Restlessness'],
  'Right Leg': ['Numbness', 'Tingling', 'Trembling', 'Restlessness'],
  'Left Foot': ['Numbness', 'Tingling', 'Cold Feet'],
  'Right Foot': ['Numbness', 'Tingling', 'Cold Feet']
};

const EnhancedAnxietyTracker = ({ onBack }) => {
  // State management
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [selectedSensations, setSelectedSensations] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedReliefMethods, setSelectedReliefMethods] = useState([]);
  const [entries, setEntries] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [customReliefMethod, setCustomReliefMethod] = useState('');
  const [filteredSensations, setFilteredSensations] = useState(sensations);
  const [useSVGMap, setUseSVGMap] = useState(true);
  const [intensity, setIntensity] = useState(5); // 1-10 scale
  const [notes, setNotes] = useState('');
  const [showQuickEntry, setShowQuickEntry] = useState(false);

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('anxietyTrackerEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('anxietyTrackerEntries', JSON.stringify(entries));
  }, [entries]);

  // Update filtered sensations based on body parts
  useEffect(() => {
    if (selectedBodyParts.length === 0) {
      setFilteredSensations(sensations);
      return;
    }

    const relatedSensations = new Set();
    selectedBodyParts.forEach(part => {
      if (bodyPartSensationMap[part]) {
        bodyPartSensationMap[part].forEach(sensation => relatedSensations.add(sensation));
      }
    });

    const prioritizedSensations = [
      ...Array.from(relatedSensations),
      ...sensations.filter(sensation => !relatedSensations.has(sensation))
    ];

    setFilteredSensations(prioritizedSensations);
  }, [selectedBodyParts]);

  // Handle body part selection
  const handleBodyPartClick = (part) => {
    setSelectedBodyParts(prev => 
      prev.includes(part) 
        ? prev.filter(p => p !== part) 
        : [...prev, part]
    );
  };

  // Handle multi-selection toggle
  const handleMultiSelection = (item, selectedItems, setSelectedItems) => {
    setSelectedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      bodyParts: selectedBodyParts,
      sensations: selectedSensations,
      activities: selectedActivities,
      reliefMethods: [...selectedReliefMethods, ...(customReliefMethod ? [customReliefMethod] : [])],
      intensity,
      notes,
      duration: Math.floor(Math.random() * 60) + 5 // Simulated duration in minutes
    };
    
    setEntries(prev => [newEntry, ...prev]);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setSelectedBodyParts([]);
    setSelectedSensations([]);
    setSelectedActivities([]);
    setSelectedReliefMethods([]);
    setCustomReliefMethod('');
    setIntensity(5);
    setNotes('');
    setCurrentStep(1);
    setShowQuickEntry(false);
  };

  // Quick entry mode
  const handleQuickEntry = () => {
    setShowQuickEntry(true);
  };

  const submitQuickEntry = () => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      bodyParts: ['General'],
      sensations: ['Anxiety'],
      activities: ['Quick Entry'],
      reliefMethods: ['Not specified'],
      intensity,
      notes: 'Quick entry - ' + notes,
      duration: 10
    };
    
    setEntries(prev => [newEntry, ...prev]);
    resetForm();
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Render progress indicator
  const ProgressIndicator = ({ current, total }) => (
    <div className="flex space-x-1 mb-4">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full ${
            i < current ? 'bg-primary' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );

  // Render checkbox group
  const CheckboxGroup = ({ items, selected, onChange, title, icon }) => (
    <div className="mb-6">
      <h4 className="text-sm font-semibold mb-3 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {items.map((item) => (
          <label key={item} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onChange(item)}
              className="h-4 w-4 text-primary focus:ring-primary"
            />
            <span className="text-sm">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );

  // Render intensity slider
  const IntensitySlider = () => (
    <div className="mb-6">
      <label className="block text-sm font-semibold mb-3">Intensity (1-10)</label>
      <input
        type="range"
        min="1"
        max="10"
        value={intensity}
        onChange={(e) => setIntensity(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Mild</span>
        <span className="font-semibold text-primary">{intensity}/10</span>
        <span>Severe</span>
      </div>
    </div>
  );

  // Render tracking form
  const TrackingForm = () => (
    <div>
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Track Your Anxiety</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleQuickEntry}
          >
            Quick Entry
          </Button>
        </div>

        {currentStep === 1 && (
          <div>
            <ProgressIndicator current={1} total={5} />
            <h4 className="text-lg font-semibold mb-4">Where do you feel it?</h4>
            
            {useSVGMap ? (
              <div className="mb-6">
                <BodyMapSVG 
                  selectedParts={selectedBodyParts} 
                  onPartClick={handleBodyPartClick} 
                />
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedBodyParts.length > 0 ? selectedBodyParts.join(', ') : 'None'}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setUseSVGMap(false)}
                  >
                    Use List
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <CheckboxGroup
                  items={Object.keys(bodyPartSensationMap)}
                  selected={selectedBodyParts}
                  onChange={(item) => handleMultiSelection(item, selectedBodyParts, setSelectedBodyParts)}
                  title="Select Body Areas"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setUseSVGMap(true)}
                  className="mt-2"
                >
                  Use Body Map
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <ProgressIndicator current={2} total={5} />
            <h4 className="text-lg font-semibold mb-4">What sensations do you experience?</h4>
            <CheckboxGroup
              items={filteredSensations}
              selected={selectedSensations}
              onChange={(item) => handleMultiSelection(item, selectedSensations, setSelectedSensations)}
              title="Select Sensations"
            />
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <ProgressIndicator current={3} total={5} />
            <h4 className="text-lg font-semibold mb-4">What were you doing?</h4>
            <CheckboxGroup
              items={activities}
              selected={selectedActivities}
              onChange={(item) => handleMultiSelection(item, selectedActivities, setSelectedActivities)}
              title="Select Activities"
            />
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <ProgressIndicator current={4} total={5} />
            <h4 className="text-lg font-semibold mb-4">Rate the intensity</h4>
            <IntensitySlider />
            
            <h4 className="text-lg font-semibold mb-4 mt-6">Additional notes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did you feel? Any triggers you noticed?"
              className="w-full p-3 border rounded-md resize-none"
              rows={3}
            />
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <ProgressIndicator current={5} total={5} />
            <h4 className="text-lg font-semibold mb-4">What helped?</h4>
            <CheckboxGroup
              items={reliefMethods}
              selected={selectedReliefMethods}
              onChange={(item) => handleMultiSelection(item, selectedReliefMethods, setSelectedReliefMethods)}
              title="Select Relief Methods"
            />
            
            <input
              type="text"
              value={customReliefMethod}
              onChange={(e) => setCustomReliefMethod(e.target.value)}
              placeholder="Other methods..."
              className="w-full p-2 border rounded-md mt-2"
            />
          </div>
        )}

        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
              Previous
            </Button>
          )}
          
          {currentStep < 5 ? (
            <Button 
              onClick={() => setCurrentStep(currentStep + 1)}
              className={currentStep === 1 ? "ml-auto" : ""}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="ml-auto"
              disabled={selectedBodyParts.length === 0}
            >
              Save Entry
            </Button>
          )}
        </div>
      </Card>

      {/* Recent entries preview */}
      {entries.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
          <div className="space-y-3">
            {entries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{formatDate(entry.timestamp)}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      <strong>Intensity:</strong> {entry.intensity}/10
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>Areas:</strong> {entry.bodyParts.join(', ')}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {entry.bodyParts.slice(0, 2).map((part, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Button onClick={onBack} className="mb-8">&larr; Back to Dashboard</Button>
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold flex items-center">
            <Brain className="mr-2 h-8 w-8 text-primary" />
            Enhanced Anxiety Tracker
          </h2>
          <p className="text-muted-foreground mt-2">
            Comprehensive tracking with advanced analytics and personalized insights.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{entries.length}</p>
              <p className="text-sm text-gray-600">Total Entries</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {entries.length > 0 ? Math.round(entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length) : 0}
              </p>
              <p className="text-sm text-gray-600">Avg Intensity</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {new Set(entries.flatMap(e => e.bodyParts)).size}
              </p>
              <p className="text-sm text-gray-600">Areas Affected</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {new Set(entries.flatMap(e => e.sensations)).size}
              </p>
              <p className="text-sm text-gray-600">Symptoms Tracked</p>
            </div>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="track" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="track">
              <Activity className="w-4 h-4 mr-2" />
              Track
            </TabsTrigger>
            <TabsTrigger value="insights">
              <BarChart3 className="w-4 h-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="resources">
              <Lightbulb className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="track">
            {TrackingForm()}
          </TabsContent>

          <TabsContent value="insights">
            <EnhancedAnxietyVisualizations entries={entries} />
          </TabsContent>

          <TabsContent value="resources">
            <AnxietyResources recentEntries={entries} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedAnxietyTracker;