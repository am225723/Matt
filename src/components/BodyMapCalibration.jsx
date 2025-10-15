import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { X, RotateCcw, Save, Target, Grid3X3 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const BodyMapCalibration = ({ onClose, onSave }) => {
  const { toast } = useToast();
  
  // Load saved calibration or use defaults
  const loadCalibration = () => {
    const saved = localStorage.getItem('bodyMapCalibration');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      head: { x: 50, y: 8, width: 15, height: 12 },
      throat: { x: 50, y: 20, width: 10, height: 5 },
      chest: { x: 50, y: 30, width: 25, height: 15 },
      stomach: { x: 50, y: 50, width: 20, height: 15 },
      leftArm: { x: 25, y: 35, width: 12, height: 25 },
      rightArm: { x: 75, y: 35, width: 12, height: 25 },
      leftLeg: { x: 40, y: 70, width: 12, height: 25 },
      rightLeg: { x: 60, y: 70, width: 12, height: 25 }
    };
  };

  const [calibration, setCalibration] = useState(loadCalibration());
  const [selectedPart, setSelectedPart] = useState('head');
  const [showGrid, setShowGrid] = useState(true);

  const bodyPartNames = {
    head: 'Head',
    throat: 'Throat/Neck',
    chest: 'Chest',
    stomach: 'Stomach',
    leftArm: 'Left Arm',
    rightArm: 'Right Arm',
    leftLeg: 'Left Leg',
    rightLeg: 'Right Leg'
  };

  const handleCalibrationChange = (part, property, value) => {
    setCalibration(prev => ({
      ...prev,
      [part]: {
        ...prev[part],
        [property]: Array.isArray(value) ? value[0] : value
      }
    }));
  };

  const handleSave = () => {
    localStorage.setItem('bodyMapCalibration', JSON.stringify(calibration));
    toast({
      title: "Calibration Saved",
      description: "Body map alignment has been saved successfully.",
    });
    if (onSave) {
      onSave(calibration);
    }
    onClose();
  };

  const handleReset = () => {
    const defaultCalibration = loadCalibration();
    setCalibration(defaultCalibration);
    localStorage.setItem('bodyMapCalibration', JSON.stringify(defaultCalibration));
    toast({
      title: "Calibration Reset",
      description: "Body map alignment has been reset to defaults.",
    });
  };

  const currentPart = calibration[selectedPart];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6" />
                Body Map Calibration
              </h2>
              <p className="text-blue-100 mt-1">
                Adjust body part positions to align with your photo
              </p>
            </div>
            <Button onClick={onClose} variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3X3 className="w-4 h-4 mr-1" />
                {showGrid ? 'Hide' : 'Show'} Grid
              </Button>
            </div>
            
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '3/4' }}>
              {/* Background Image */}
              <img 
                src="/1531.png" 
                alt="Body map" 
                className="w-full h-full object-cover"
              />
              
              {/* Grid Overlay */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none">
                  <svg width="100%" height="100%" className="opacity-30">
                    <defs>
                      <pattern id="grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                        <path d="M 10% 0 L 0 0 0 10%" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              )}
              
              {/* Body Part Overlays */}
              {Object.entries(calibration).map(([partKey, partData]) => (
                <div
                  key={partKey}
                  className={`absolute border-2 cursor-pointer transition-all ${
                    selectedPart === partKey 
                      ? 'border-blue-500 bg-blue-500/30' 
                      : 'border-red-500/50 bg-red-500/20 hover:bg-red-500/30'
                  }`}
                  style={{
                    left: `${partData.x}%`,
                    top: `${partData.y}%`,
                    width: `${partData.width}%`,
                    height: `${partData.height}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => setSelectedPart(partKey)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white bg-black/50 px-1 rounded">
                      {bodyPartNames[partKey]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Select Body Part</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(bodyPartNames).map(([key, name]) => (
                  <Button
                    key={key}
                    onClick={() => setSelectedPart(key)}
                    variant={selectedPart === key ? "default" : "outline"}
                    className={selectedPart === key ? "bg-blue-600" : ""}
                    size="sm"
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">
                Adjust: {bodyPartNames[selectedPart]}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">
                    Horizontal Position: {currentPart.x}%
                  </Label>
                  <Slider
                    value={[currentPart.x]}
                    onValueChange={(value) => handleCalibrationChange(selectedPart, 'x', value)}
                    min={0}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Vertical Position: {currentPart.y}%
                  </Label>
                  <Slider
                    value={[currentPart.y]}
                    onValueChange={(value) => handleCalibrationChange(selectedPart, 'y', value)}
                    min={0}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Width: {currentPart.width}%
                  </Label>
                  <Slider
                    value={[currentPart.width]}
                    onValueChange={(value) => handleCalibrationChange(selectedPart, 'width', value)}
                    min={5}
                    max={50}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Height: {currentPart.height}%
                  </Label>
                  <Slider
                    value={[currentPart.height]}
                    onValueChange={(value) => handleCalibrationChange(selectedPart, 'height', value)}
                    min={5}
                    max={50}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Calibration
              </Button>
              <Button onClick={handleReset} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Instructions</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Select a body part from the buttons above</li>
                <li>• Use sliders to adjust position and size</li>
                <li>• The preview shows your adjustments in real-time</li>
                <li>• Click "Save Calibration" to apply changes</li>
                <li>• Use the grid to help with precise alignment</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BodyMapCalibration;
