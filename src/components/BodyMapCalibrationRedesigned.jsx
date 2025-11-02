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
    leftShoulder: { x: 0, y: 0, scale: 1, rotation: 0 },
    rightShoulder: { x: 0, y: 0, scale: 1, rotation: 0 },
    leftArm: { x: 0, y: 0, scale: 1, rotation: 0 },
    rightArm: { x: 0, y: 0, scale: 1, rotation: 0 },
    leftHand: { x: 0, y: 0, scale: 1, rotation: 0 },
    rightHand: { x: 0, y: 0, scale: 1, rotation: 0 },
    back: { x: 0, y: 0, scale: 1, rotation: 0 },
    upperBack: { x: 0, y: 0, scale: 1, rotation: 0 },
    midBack: { x: 0, y: 0, scale: 1, rotation: 0 },
    lowerBack: { x: 0, y: 0, scale: 1, rotation: 0 },
    leftGlute: { x: 0, y: 0, scale: 1, rotation: 0 },
    rightGlute: { x: 0, y: 0, scale: 1, rotation: 0 },
    leftLeg: { x: 0, y: 0, scale: 1, rotation: 0 },
    rightLeg: { x: 0, y: 0, scale: 1, rotation: 0 },
    leftCalf: { x: 0, y: 0, scale: 1, rotation: 0 },
    rightCalf: { x: 0, y: 0, scale: 1, rotation: 0 },
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
  const [addingNewPart, setAddingNewPart] = useState(false);
  const [newPartPosition, setNewPartPosition] = useState(null);

  const bodyPartNames = {
    head: 'Head',
    face: 'Face', 
    neck: 'Neck',
    chest: 'Chest',
    stomach: 'Stomach',
    leftShoulder: 'Left Shoulder',
    rightShoulder: 'Right Shoulder',
    leftArm: 'Left Arm',
    rightArm: 'Right Arm',
    leftHand: 'Left Hand',
    rightHand: 'Right Hand',
    back: 'Back',
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

  const bodyPartCategories = {
    'Upper Body': ['head', 'face', 'neck', 'chest'],
    'Shoulders': ['leftShoulder', 'rightShoulder'],
    'Arms & Hands': ['leftArm', 'rightArm', 'leftHand', 'rightHand'],
    'Core & Back': ['stomach', 'back', 'upperBack', 'midBack', 'lowerBack'],
    'Glutes': ['leftGlute', 'rightGlute'],
    'Lower Body': ['leftLeg', 'rightLeg', 'leftCalf', 'rightCalf', 'leftFoot', 'rightFoot']
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

  const handleMapClick = (e) => {
    if (addingNewPart && !isDragging) {
      const svg = e.currentTarget.querySelector('svg');
      if (!svg) return;
      
      const rect = svg.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      const scaleX = 340 / rect.width;
      const scaleY = 540 / rect.height;
      
      const svgClickX = clickX * scaleX;
      const svgClickY = clickY * scaleY;
      
      setNewPartPosition({ svgX: svgClickX, svgY: svgClickY });
    }
  };

  const getBodyPartDefaultCenter = (partKey) => {
    const centers = {
      head: { cx: 170, cy: 125 },
      face: { cx: 170, cy: 155 },
      neck: { cx: 170, cy: 205 },
      chest: { cx: 170, cy: 250 },
      stomach: { cx: 170, cy: 335 },
      leftShoulder: { cx: 115, cy: 230 },
      rightShoulder: { cx: 225, cy: 230 },
      leftArm: { cx: 88, cy: 260 },
      rightArm: { cx: 252, cy: 260 },
      leftHand: { cx: 70, cy: 330 },
      rightHand: { cx: 270, cy: 330 },
      back: { cx: 170, cy: 280 },
      upperBack: { cx: 170, cy: 240 },
      midBack: { cx: 170, cy: 300 },
      lowerBack: { cx: 170, cy: 360 },
      leftGlute: { cx: 145, cy: 385 },
      rightGlute: { cx: 195, cy: 385 },
      leftLeg: { cx: 140, cy: 420 },
      rightLeg: { cx: 200, cy: 420 },
      leftCalf: { cx: 140, cy: 470 },
      rightCalf: { cx: 200, cy: 470 },
      leftFoot: { cx: 140, cy: 500 },
      rightFoot: { cx: 200, cy: 500 }
    };
    return centers[partKey] || { cx: 170, cy: 270 };
  };

  const handleAddPartConfirm = (partKey) => {
    if (newPartPosition) {
      const center = getBodyPartDefaultCenter(partKey);
      const offsetX = newPartPosition.svgX - center.cx;
      const offsetY = newPartPosition.svgY - center.cy;
      
      setCalibration(prev => ({
        ...prev,
        [partKey]: {
          ...prev[partKey],
          x: Math.round(offsetX),
          y: Math.round(offsetY)
        }
      }));
      setHasUnsavedChanges(true);
      setSelectedPart(partKey);
      setAddingNewPart(false);
      setNewPartPosition(null);
      toast({
        title: "Circle Added",
        description: `Added circle for ${bodyPartNames[partKey]}. Adjust position as needed.`,
      });
    }
  };

  const getMissingParts = () => {
    return Object.keys(calibration).filter(partKey => {
      const part = calibration[partKey];
      return part.x === 0 && part.y === 0 && part.scale === 1 && part.rotation === 0;
    });
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
        className="w-full max-w-7xl max-h-[95vh] overflow-hidden bg-white rounded-xl shadow-2xl mx-2 sm:mx-0"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                Body Map Calibration
              </h2>
              <p className="text-indigo-100 mt-1 text-sm sm:text-base">
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

        <div className="flex flex-col md:flex-row h-[calc(95vh-120px)] overflow-hidden">
          {/* Preview Panel */}
          <div className="flex-1 p-3 sm:p-6 bg-gray-50 overflow-y-auto">
            <div className="h-full flex flex-col">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Preview</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={addingNewPart ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setAddingNewPart(!addingNewPart);
                      setNewPartPosition(null);
                    }}
                    className={addingNewPart ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <Target className="w-4 h-4 mr-1" />
                    {addingNewPart ? 'Cancel Add' : 'Add Circle'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGrid(!showGrid)}
                  >
                    <Grid3X3 className="w-4 h-4 mr-1" />
                    Grid
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
                    <span className="text-xs sm:text-sm font-mono w-10 sm:w-12 text-center">
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

              <div className={`flex-1 bg-white rounded-lg border-2 ${addingNewPart ? 'border-green-500 border-dashed' : 'border-gray-200'} relative overflow-hidden ${addingNewPart ? 'cursor-crosshair' : 'cursor-default'}`}
                   onClick={handleMapClick}>
                {addingNewPart && (
                  <div className="absolute top-2 left-2 right-2 z-30 bg-green-100 border border-green-500 rounded-lg p-2">
                    <p className="text-sm font-medium text-green-800 text-center">
                      Click on the body map to add a new circle
                    </p>
                  </div>
                )}
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
                  {/* New part position marker - positioned in SVG space */}
                  {newPartPosition && (
                    <svg 
                      width="340" 
                      height="540" 
                      viewBox="0 0 340 540"
                      className="absolute top-0 left-0 pointer-events-none z-30"
                    >
                      <circle
                        cx={newPartPosition.svgX}
                        cy={newPartPosition.svgY}
                        r="15"
                        fill="#22c55e"
                        fillOpacity="0.6"
                        stroke="#16a34a"
                        strokeWidth="2"
                      >
                        <animate attributeName="r" values="15;18;15" dur="1s" repeatCount="indefinite" />
                      </circle>
                      <line
                        x1={newPartPosition.svgX}
                        y1={newPartPosition.svgY - 20}
                        x2={newPartPosition.svgX}
                        y2={newPartPosition.svgY + 20}
                        stroke="#16a34a"
                        strokeWidth="2"
                      />
                      <line
                        x1={newPartPosition.svgX - 20}
                        y1={newPartPosition.svgY}
                        x2={newPartPosition.svgX + 20}
                        y2={newPartPosition.svgY}
                        stroke="#16a34a"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                  
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
                            {partKey === 'leftShoulder' && (
                              <ellipse
                                cx="115"
                                cy="230"
                                rx="28"
                                ry="28"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 115 230)`}
                                style={{ 
                                  transformOrigin: '115px 230px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'rightShoulder' && (
                              <ellipse
                                cx="225"
                                cy="230"
                                rx="28"
                                ry="28"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 225 230)`}
                                style={{ 
                                  transformOrigin: '225px 230px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'upperBack' && (
                              <ellipse
                                cx="170"
                                cy="240"
                                rx="45"
                                ry="35"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 170 240)`}
                                style={{ 
                                  transformOrigin: '170px 240px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'midBack' && (
                              <ellipse
                                cx="170"
                                cy="300"
                                rx="48"
                                ry="35"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 170 300)`}
                                style={{ 
                                  transformOrigin: '170px 300px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'lowerBack' && (
                              <ellipse
                                cx="170"
                                cy="360"
                                rx="45"
                                ry="30"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 170 360)`}
                                style={{ 
                                  transformOrigin: '170px 360px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'leftGlute' && (
                              <ellipse
                                cx="145"
                                cy="385"
                                rx="32"
                                ry="30"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 145 385)`}
                                style={{ 
                                  transformOrigin: '145px 385px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'rightGlute' && (
                              <ellipse
                                cx="195"
                                cy="385"
                                rx="32"
                                ry="30"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 195 385)`}
                                style={{ 
                                  transformOrigin: '195px 385px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'leftCalf' && (
                              <ellipse
                                cx="140"
                                cy="470"
                                rx="24"
                                ry="30"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 140 470)`}
                                style={{ 
                                  transformOrigin: '140px 470px',
                                  cursor: 'pointer'
                                }}
                                onMouseDown={(e) => handleMouseDown(e, partKey)}
                                onClick={() => setSelectedPart(partKey)}
                              />
                            )}
                            {partKey === 'rightCalf' && (
                              <ellipse
                                cx="200"
                                cy="470"
                                rx="24"
                                ry="30"
                                fill={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
                                stroke={color}
                                strokeWidth={isSelected ? "3" : "2"}
                                transform={`translate(${partData.x}, ${partData.y}) scale(${partData.scale}) rotate(${partData.rotation} 200 470)`}
                                style={{ 
                                  transformOrigin: '200px 470px',
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
          <div className="w-full md:w-96 bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col overflow-y-auto">
            <div className="p-3 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Body Part Selection</h3>
              
              <div className="space-y-3 sm:space-y-4">
                {Object.entries(bodyPartCategories).map(([category, parts]) => (
                  <div key={category}>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">{category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {parts.map((partKey) => (
                        <Button
                          key={partKey}
                          onClick={() => setSelectedPart(partKey)}
                          variant={selectedPart === partKey ? "default" : "outline"}
                          className={`text-xs min-h-[44px] ${selectedPart === partKey ? "bg-indigo-600" : ""}`}
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

            <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-indigo-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                    <Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    Adjust: {bodyPartNames[selectedPart]}
                  </h3>
                  
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 block mb-3">
                        Horizontal Position: {currentPart.x}px
                      </Label>
                      <Slider
                        value={[currentPart.x]}
                        onValueChange={(value) => handleCalibrationChange(selectedPart, 'x', value)}
                        min={-150}
                        max={150}
                        step={1}
                        className="mt-2 h-8 sm:h-auto touch-manipulation"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 block mb-3">
                        Vertical Position: {currentPart.y}px
                      </Label>
                      <Slider
                        value={[currentPart.y]}
                        onValueChange={(value) => handleCalibrationChange(selectedPart, 'y', value)}
                        min={-150}
                        max={150}
                        step={1}
                        className="mt-2 h-8 sm:h-auto touch-manipulation"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 block mb-3">
                        Scale: {currentPart.scale.toFixed(2)}x
                      </Label>
                      <Slider
                        value={[currentPart.scale]}
                        onValueChange={(value) => handleCalibrationChange(selectedPart, 'scale', value)}
                        min={0.3}
                        max={2}
                        step={0.01}
                        className="mt-2 h-8 sm:h-auto touch-manipulation"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 block mb-3">
                        Rotation: {currentPart.rotation}°
                      </Label>
                      <Slider
                        value={[currentPart.rotation]}
                        onValueChange={(value) => handleCalibrationChange(selectedPart, 'rotation', value)}
                        min={-180}
                        max={180}
                        step={1}
                        className="mt-2 h-8 sm:h-auto touch-manipulation"
                      />
                    </div>

                    <Button
                      onClick={() => handleResetPart(selectedPart)}
                      variant="outline"
                      size="sm"
                      className="w-full min-h-[44px]"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset This Part
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-medium text-gray-800 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      onClick={handleSave}
                      className="w-full bg-green-600 hover:bg-green-700 min-h-[48px]"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Calibration
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="w-full min-h-[48px]"
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

        {/* Add Body Part Selection Dialog */}
        <AnimatePresence>
          {newPartPosition && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-2xl border-2 border-green-500 max-w-md w-full mx-4"
            >
              <div className="bg-green-600 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Select Body Part for New Circle
                </h3>
                <p className="text-green-100 text-sm mt-1">
                  Choose which body part this circle represents
                </p>
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {Object.entries(bodyPartCategories).map(([category, parts]) => (
                    <div key={category}>
                      <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {parts.map((partKey) => {
                          const part = calibration[partKey];
                          const isDefault = part.x === 0 && part.y === 0 && part.scale === 1 && part.rotation === 0;
                          return (
                            <Button
                              key={partKey}
                              onClick={() => handleAddPartConfirm(partKey)}
                              variant="outline"
                              size="sm"
                              className={`justify-start min-h-[44px] ${isDefault ? 'border-amber-400 bg-amber-50' : ''}`}
                            >
                              {isDefault && <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />}
                              {bodyPartNames[partKey]}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <Button
                  onClick={() => {
                    setNewPartPosition(null);
                    setAddingNewPart(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default BodyMapCalibrationRedesigned;