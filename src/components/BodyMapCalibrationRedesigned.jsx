import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  X, RotateCcw, Save, Move, Grid3X3, Eye, EyeOff, 
  Target, Crosshair, Settings2, CheckCircle2, AlertCircle,
  Maximize2, Minimize2, RotateCw
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const BodyMapCalibrationRedesigned = ({ onClose, onSave, initialCalibration = {} }) => {
  const { toast } = useToast();
  
  // Load saved calibration or use defaults
  const loadCalibration = () => {
    const saved = localStorage.getItem('bodyMapCalibration');
    if (saved) {
      return { ...getDefaultCalibration(), ...JSON.parse(saved), ...initialCalibration };
    }
    return { ...getDefaultCalibration(), ...initialCalibration };
  };

  const getDefaultCalibration = () => ({
    head: { x: 0, y: 0, scale: 1, rotation: 0 },
    face: { x: 0, y: 0, scale: 1, rotation: 0 },
    neck: { x: 0, y: 0, scale: 1, rotation: 0 },
    chest: { x: 0, y: 0, scale: 1, rotation: 0 },
    stomach: { x: 0, y: 0, scale: 1, rotation: 0 },
    leftArm: { x: 0, y: 0, scale: 1, rotation: 0 },
    rightArm: { x: 0, y: 0, scale: 1, rotation: 0 },
    leftHand: { x: 0, y: 0, scale: 1, rotation: 0 },
    rightHand: { x: 0, y: 0, scale: 1, rotation: 0 },
    back: { x: 0, y: 0, scale: 1, rotation: 0 },
    leftLeg: { x: 0, y: 0, scale: 1, rotation: 0 },
    rightLeg: { x: 0, y: 0, scale: 1, rotation: 0 },
    leftFoot: { x: 0, y: 0, scale: 1, rotation: 0 },
    rightFoot: { x: 0, y: 0, scale: 1, rotation: 0 }
  });

  const [calibration, setCalibration] = useState(loadCalibration());
  const [selectedPart, setSelectedPart] = useState('head');
  const [showGrid, setShowGrid] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  const bodyPartCategories = {
    'Upper Body': ['head', 'face', 'neck', 'chest'],
    'Arms & Hands': ['leftArm', 'rightArm', 'leftHand', 'rightHand'],
    'Core & Back': ['stomach', 'back'],
    'Lower Body': ['leftLeg', 'rightLeg', 'leftFoot', 'rightFoot']
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleCalibrationChange = (part, property, value) => {
    setCalibration(prev => ({
      ...prev,
      [part]: {
        ...prev[part],
        [property]: Array.isArray(value) ? value[0] : value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem('bodyMapCalibration', JSON.stringify(calibration));
    setHasUnsavedChanges(false);
    toast({
      title: "Calibration Saved",
      description: "Body map alignment has been saved successfully.",
    });
    if (onSave) {
      onSave(calibration);
    }
  };

  const handleReset = () => {
    const defaultCalibration = getDefaultCalibration();
    setCalibration(defaultCalibration);
    localStorage.setItem('bodyMapCalibration', JSON.stringify(defaultCalibration));
    setHasUnsavedChanges(false);
    toast({
      title: "Calibration Reset",
      description: "Body map alignment has been reset to defaults.",
    });
  };

  const handleResetPart = (part) => {
    const defaultPart = getDefaultCalibration()[part];
    setCalibration(prev => ({
      ...prev,
      [part]: defaultPart
    }));
    setHasUnsavedChanges(true);
    toast({
      title: "Part Reset",
      description: `${bodyPartNames[part]} has been reset to default position.`,
    });
  };

  const handleMouseDown = (e, part) => {
    if (part === selectedPart) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - calibration[part].x,
        y: e.clientY - calibration[part].y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && selectedPart) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      handleCalibrationChange(selectedPart, 'x', newX);
      handleCalibrationChange(selectedPart, 'y', newY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const currentPart = calibration[selectedPart];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-7xl max-h-[95vh] overflow-hidden bg-white rounded-xl shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6" />
                Body Map Calibration
              </h2>
              <p className="text-indigo-100 mt-1">
                Adjust body part positions to align with your photo
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
              <Button onClick={onClose} variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Preview Panel */}
          <div className="flex-1 p-6 bg-gray-50">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGrid(!showGrid)}
                  >
                    <Grid3X3 className="w-4 h-4 mr-1" />
                    {showGrid ? 'Hide' : 'Show'} Grid
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-mono w-12 text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white rounded-lg border-2 border-gray-200 relative overflow-hidden">
                {showGrid && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <svg width="100%" height="100%" className="opacity-20">
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#6366f1" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                )}
                
                {/* Crosshair for selected part */}
                {selectedPart && (
                  <div 
                    className="absolute pointer-events-none z-20"
                    style={{
                      left: `calc(50% + ${currentPart.x}px)`,
                      top: `calc(50% + ${currentPart.y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Crosshair className="w-6 h-6 text-indigo-500" />
                  </div>
                )}
                
                {/* Body Image Background */}
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  {/* Supabase Photo */}
                  <img
                    src="https://efgtznvrnzqcxmfmjuue.supabase.co/storage/v1/object/public/images/1531.png"
                    alt="Body Map"
                    className="w-auto h-full object-contain"
                    style={{ maxWidth: '340px', maxHeight: '540px' }}
                  />
                  
                  {/* Calibrated overlays */}
                  {showPreview && (
                    <svg 
                      width="340" 
                      height="540" 
                      viewBox="0 0 340 540"
                      className="absolute top-0 left-0"
                    >
                      {Object.entries(calibration).map(([partKey, partData]) => {
                        const isSelected = partKey === selectedPart;
                        const opacity = isSelected ? 0.8 : 0.4;
                        const color = isSelected ? '#6366f1' : '#8b5cf6';
                        
                        return (
                          <g key={partKey}>
                            {partKey === 'head' && (
                              <ellipse
                                cx="170"
                                cy="125"
                                rx="65"
                                ry="65"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 170 125)`}
                                style={{ 
                                  transformOrigin: '170px 125px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'stomach' && (
                              <ellipse
                                cx="170"
                                cy="335"
                                rx="50"
                                ry="45"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 170 335)`}
                                style={{ 
                                  transformOrigin: '170px 335px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'rightArm' && (
                              <ellipse
                                cx="252"
                                cy="260"
                                rx="25"
                                ry="50"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 252 260)`}
                                style={{ 
                                  transformOrigin: '252px 260px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'chest' && (
                              <ellipse
                                cx="170"
                                cy="250"
                                rx="50"
                                ry="40"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 170 250)`}
                                style={{ 
                                  transformOrigin: '170px 250px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'face' && (
                              <ellipse
                                cx="170"
                                cy="155"
                                rx="50"
                                ry="55"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 170 155)`}
                                style={{ 
                                  transformOrigin: '170px 155px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'neck' && (
                              <ellipse
                                cx="170"
                                cy="205"
                                rx="25"
                                ry="25"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 170 205)`}
                                style={{ 
                                  transformOrigin: '170px 205px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'leftArm' && (
                              <ellipse
                                cx="88"
                                cy="260"
                                rx="25"
                                ry="50"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 88 260)`}
                                style={{ 
                                  transformOrigin: '88px 260px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'leftHand' && (
                              <ellipse
                                cx="70"
                                cy="330"
                                rx="18"
                                ry="22"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 70 330)`}
                                style={{ 
                                  transformOrigin: '70px 330px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'rightHand' && (
                              <ellipse
                                cx="270"
                                cy="330"
                                rx="18"
                                ry="22"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 270 330)`}
                                style={{ 
                                  transformOrigin: '270px 330px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'back' && (
                              <ellipse
                                cx="170"
                                cy="280"
                                rx="55"
                                ry="70"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 170 280)`}
                                style={{ 
                                  transformOrigin: '170px 280px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'leftLeg' && (
                              <ellipse
                                cx="140"
                                cy="420"
                                rx="30"
                                ry="65"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 140 420)`}
                                style={{ 
                                  transformOrigin: '140px 420px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'rightLeg' && (
                              <ellipse
                                cx="200"
                                cy="420"
                                rx="30"
                                ry="65"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 200 420)`}
                                style={{ 
                                  transformOrigin: '200px 420px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'leftFoot' && (
                              <ellipse
                                cx="140"
                                cy="500"
                                rx="22"
                                ry="20"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 140 500)`}
                                style={{ 
                                  transformOrigin: '140px 500px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'rightFoot' && (
                              <ellipse
                                cx="200"
                                cy="500"
                                rx="22"
                                ry="20"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 200 500)`}
                                style={{ 
                                  transformOrigin: '200px 500px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  )}
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  <strong>Instructions:</strong> Select a body part from the right panel, then use the sliders to adjust position, scale, and rotation. 
                  You can also drag the selected part directly in the preview.
                </p>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Body Part Selection</h3>
              
              <div className="space-y-4">
                {Object.entries(bodyPartCategories).map(([category, parts]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">{category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {parts.map((partKey) => (
                        <Button
                          key={partKey}
                          onClick={() => setSelectedPart(partKey)}
                          variant={selectedPart === partKey ? "default" : "outline"}
                          className={`text-xs ${selectedPart === partKey ? "bg-indigo-600" : ""}`}
                          size="sm"
                        >
                          {bodyPartNames[partKey]}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                    <Settings2 className="w-5 h-5" />
                    Adjust: {bodyPartNames[selectedPart]}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Horizontal Position: {currentPart.x}px
                      </Label>
                      <Slider
                        value={[currentPart.x]}
                        onValueChange={(value) => handleCalibrationChange(selectedPart, 'x', value)}
                        min={-150}
                        max={150}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Vertical Position: {currentPart.y}px
                      </Label>
                      <Slider
                        value={[currentPart.y]}
                        onValueChange={(value) => handleCalibrationChange(selectedPart, 'y', value)}
                        min={-150}
                        max={150}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Scale: {currentPart.scale.toFixed(2)}x
                      </Label>
                      <Slider
                        value={[currentPart.scale]}
                        onValueChange={(value) => handleCalibrationChange(selectedPart, 'scale', value)}
                        min={0.3}
                        max={2}
                        step={0.01}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Rotation: {currentPart.rotation}°
                      </Label>
                      <Slider
                        value={[currentPart.rotation]}
                        onValueChange={(value) => handleCalibrationChange(selectedPart, 'rotation', value)}
                        min={-180}
                        max={180}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <Button
                      onClick={() => handleResetPart(selectedPart)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset This Part
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      onClick={handleSave}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Calibration
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset All Parts
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use the grid to align parts precisely</li>
                    <li>• Drag parts directly in the preview</li>
                    <li>• Use Ctrl+S to save quickly</li>
                    <li>• Press Escape to close</li>
                    <li>• Zoom in/out for fine adjustments</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BodyMapCalibrationRedesigned;