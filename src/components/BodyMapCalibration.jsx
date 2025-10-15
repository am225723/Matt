import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { X, RotateCcw, Save, Move } from 'lucide-react';
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
      head: { x: 0, y: 0, scale: 1 },
      face: { x: 0, y: 0, scale: 1 },
      neck: { x: 0, y: 0, scale: 1 },
      chest: { x: 0, y: 0, scale: 1 },
      stomach: { x: 0, y: 0, scale: 1 },
      leftArm: { x: 0, y: 0, scale: 1 },
      rightArm: { x: 0, y: 0, scale: 1 },
      leftHand: { x: 0, y: 0, scale: 1 },
      rightHand: { x: 0, y: 0, scale: 1 },
      back: { x: 0, y: 0, scale: 1 },
      leftLeg: { x: 0, y: 0, scale: 1 },
      rightLeg: { x: 0, y: 0, scale: 1 },
      leftFoot: { x: 0, y: 0, scale: 1 },
      rightFoot: { x: 0, y: 0, scale: 1 }
    };
  };

  const [calibration, setCalibration] = useState(loadCalibration());
  const [selectedPart, setSelectedPart] = useState('head');
  const [showGrid, setShowGrid] = useState(true);

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

  const handleCalibrationChange = (part, property, value) => {
    setCalibration(prev => ({
      ...prev,
      [part]: {
        ...prev[part],
        [property]: value
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
  };

  const handleReset = () => {
    const defaultCalibration = {
      head: { x: 0, y: 0, scale: 1 },
      face: { x: 0, y: 0, scale: 1 },
      neck: { x: 0, y: 0, scale: 1 },
      chest: { x: 0, y: 0, scale: 1 },
      stomach: { x: 0, y: 0, scale: 1 },
      leftArm: { x: 0, y: 0, scale: 1 },
      rightArm: { x: 0, y: 0, scale: 1 },
      leftHand: { x: 0, y: 0, scale: 1 },
      rightHand: { x: 0, y: 0, scale: 1 },
      back: { x: 0, y: 0, scale: 1 },
      leftLeg: { x: 0, y: 0, scale: 1 },
      rightLeg: { x: 0, y: 0, scale: 1 },
      leftFoot: { x: 0, y: 0, scale: 1 },
      rightFoot: { x: 0, y: 0, scale: 1 }
    };
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
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Move className="w-6 h-6" />
              Body Map Calibration
            </CardTitle>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preview Panel */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Preview</h3>
                <div className="relative bg-gray-800 rounded-lg p-4 min-h-[500px] flex items-center justify-center">
                  {showGrid && (
                    <div className="absolute inset-0 pointer-events-none">
                      <svg width="100%" height="100%" className="opacity-20">
                        <defs>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Body silhouette with calibrated overlay */}
                  <div className="relative">
                    <svg width="340" height="540" viewBox="0 0 340 540" className="opacity-30">
                      <path
                        d="M170 60 C130 60, 105 85, 105 125 C105 165, 130 190, 170 190 C210 190, 235 165, 235 125 C235 85, 210 60, 170 60 M170 190 L170 210 M120 210 L120 290 L220 290 L220 210 M120 290 L120 380 L220 380 L220 290 M120 210 L80 210 L55 310 L80 310 L105 250 M220 210 L260 210 L285 310 L260 310 L235 250 M55 310 L40 350 L65 365 L80 310 M285 310 L300 350 L275 365 L260 310 M120 380 L120 500 L160 500 L170 380 M220 380 L220 500 L180 500 L170 380 M120 500 L95 525 L160 525 L160 500 M220 500 L245 525 L180 525 L180 500"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                    
                    {/* Calibrated overlay for selected part */}
                    <svg 
                      width="340" 
                      height="540" 
                      viewBox="0 0 340 540"
                      className="absolute top-0 left-0"
                    >
                      {selectedPart === 'head' && (
                        <path
                          d="M170 60 C130 60, 105 85, 105 125 C105 165, 130 190, 170 190 C210 190, 235 165, 235 125 C235 85, 210 60, 170 60"
                          fill="rgba(59, 130, 246, 0.5)"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          transform={`translate(${currentPart.x}, ${currentPart.y}) scale(${currentPart.scale})`}
                          style={{ transformOrigin: '170px 125px' }}
                        />
                      )}
                      {selectedPart === 'stomach' && (
                        <ellipse
                          cx="170"
                          cy="335"
                          rx="50"
                          ry="45"
                          fill="rgba(59, 130, 246, 0.5)"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          transform={`translate(${currentPart.x}, ${currentPart.y}) scale(${currentPart.scale})`}
                          style={{ transformOrigin: '170px 335px' }}
                        />
                      )}
                      {selectedPart === 'rightArm' && (
                        <path
                          d="M220 210 L260 210 L285 310 L260 310 L235 250"
                          fill="rgba(59, 130, 246, 0.5)"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          transform={`translate(${currentPart.x}, ${currentPart.y}) scale(${currentPart.scale})`}
                          style={{ transformOrigin: '252px 260px' }}
                        />
                      )}
                    </svg>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showGrid"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="showGrid" className="text-white">Show Grid</Label>
                </div>
              </div>

              {/* Controls Panel */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Select Body Part</h3>
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

                <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white">
                    Adjust: {bodyPartNames[selectedPart]}
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-white text-sm">
                        Horizontal Position: {currentPart.x}px
                      </Label>
                      <Slider
                        value={[currentPart.x]}
                        onValueChange={(value) => handleCalibrationChange(selectedPart, 'x', value[0])}
                        min={-100}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-white text-sm">
                        Vertical Position: {currentPart.y}px
                      </Label>
                      <Slider
                        value={[currentPart.y]}
                        onValueChange={(value) => handleCalibrationChange(selectedPart, 'y', value[0])}
                        min={-100}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-white text-sm">
                        Scale: {currentPart.scale.toFixed(2)}
                      </Label>
                      <Slider
                        value={[currentPart.scale]}
                        onValueChange={(value) => handleCalibrationChange(selectedPart, 'scale', value[0])}
                        min={0.5}
                        max={1.5}
                        step={0.01}
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

                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                  <p className="text-sm text-blue-200">
                    <strong>Tip:</strong> Adjust the position and scale of each body part to align with your body image. 
                    The grid helps with precise positioning. Changes are saved automatically.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BodyMapCalibration;