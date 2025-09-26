import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedBodyMapSVG from './EnhancedBodyMapSVG';

const BodyMapDemo = ({ onBack }) => {
  const [selectedParts, setSelectedParts] = useState([]);
  const [intensity, setIntensity] = useState('medium');
  
  const handlePartClick = (part) => {
    setSelectedParts(prev => 
      prev.includes(part) 
        ? prev.filter(p => p !== part) 
        : [...prev, part]
    );
  };
  
  const clearSelection = () => {
    setSelectedParts([]);
  };
  
  const presetSelection = (preset) => {
    switch(preset) {
      case 'headache':
        setSelectedParts(['Head', 'Face', 'Neck']);
        break;
      case 'chest':
        setSelectedParts(['Chest', 'Left Arm', 'Right Arm']);
        break;
      case 'stomach':
        setSelectedParts(['Stomach']);
        break;
      default:
        clearSelection();
    }
  };
  
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Button onClick={onBack} className="mb-8">&larr; Back to Dashboard</Button>
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Enhanced Body Map</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Interactive Body Map</h3>
              <p className="text-gray-600 mb-6">
                Click on different body parts to select them. The map provides visual feedback
                with animations, hover effects, and clear indication of selected areas.
              </p>
              
              <EnhancedBodyMapSVG 
                selectedParts={selectedParts} 
                onPartClick={handlePartClick}
                highlightIntensity={intensity}
              />
              
              <div className="mt-6">
                <p className="font-medium mb-2">Selected parts:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedParts.length > 0 ? (
                    selectedParts.map(part => (
                      <span 
                        key={part} 
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {part}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">No parts selected</span>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={clearSelection}
                  className="mt-2"
                >
                  Clear Selection
                </Button>
              </div>
            </Card>
          </div>
          
          <div>
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Customization Options</h3>
              
              <div className="mb-6">
                <p className="font-medium mb-2">Highlight Intensity:</p>
                <Tabs 
                  value={intensity} 
                  onValueChange={setIntensity}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="light">Light</TabsTrigger>
                    <TabsTrigger value="medium">Medium</TabsTrigger>
                    <TabsTrigger value="high">High</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div>
                <p className="font-medium mb-2">Preset Selections:</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => presetSelection('headache')}
                    className="w-full"
                  >
                    Headache
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => presetSelection('chest')}
                    className="w-full"
                  >
                    Chest Pain
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => presetSelection('stomach')}
                    className="w-full"
                  >
                    Stomach
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Interactive hover effects with tooltips</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Smooth animations and transitions</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Glowing effect for selected body parts</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Customizable highlight intensity</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Responsive design for all screen sizes</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Accessibility features for better usability</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyMapDemo;