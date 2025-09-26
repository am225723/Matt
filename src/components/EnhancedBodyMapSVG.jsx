import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EnhancedBodyMapSVG = ({ selectedParts, onPartClick, highlightIntensity = 'medium' }) => {
  // State for hover effects
  const [hoveredPart, setHoveredPart] = useState(null);
  
  // Define the body parts and their corresponding IDs
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

  // Map SVG IDs to display names
  const idToDisplayName = {
    'head-region': 'Head',
    'face-region': 'Face',
    'neck-region': 'Neck',
    'chest-region': 'Chest',
    'stomach-region': 'Stomach',
    'left-arm-region': 'Left Arm',
    'right-arm-region': 'Right Arm',
    'left-hand-region': 'Left Hand',
    'right-hand-region': 'Right Hand',
    'back-region': 'Back',
    'left-leg-region': 'Left Leg',
    'right-leg-region': 'Right Leg',
    'left-foot-region': 'Left Foot',
    'right-foot-region': 'Right Foot'
  };

  // Color schemes based on intensity
  const colorSchemes = {
    light: {
      base: '#f1f5f9',
      selected: '#93c5fd',
      hover: '#bfdbfe',
      stroke: '#64748b',
      strokeSelected: '#2563eb',
      glow: 'rgba(59, 130, 246, 0.5)'
    },
    medium: {
      base: '#e2e8f0',
      selected: '#60a5fa',
      hover: '#93c5fd',
      stroke: '#475569',
      strokeSelected: '#1d4ed8',
      glow: 'rgba(37, 99, 235, 0.6)'
    },
    high: {
      base: '#cbd5e1',
      selected: '#3b82f6',
      hover: '#60a5fa',
      stroke: '#334155',
      strokeSelected: '#1e40af',
      glow: 'rgba(29, 78, 216, 0.7)'
    }
  };

  // Get current color scheme
  const colors = colorSchemes[highlightIntensity];

  // Function to check if a part is selected
  const isSelected = (id) => {
    const displayName = idToDisplayName[id];
    return selectedParts.includes(displayName);
  };

  // Function to handle click on a body part
  const handleClick = (id) => {
    const displayName = idToDisplayName[id];
    onPartClick(displayName);
  };

  // Function to get fill color based on state
  const getFillColor = (id) => {
    if (isSelected(id)) {
      return colors.selected;
    }
    if (hoveredPart === id) {
      return colors.hover;
    }
    return colors.base;
  };

  // Function to get stroke color based on state
  const getStrokeColor = (id) => {
    if (isSelected(id)) {
      return colors.strokeSelected;
    }
    return colors.stroke;
  };

  // Function to get filter based on state
  const getFilter = (id) => {
    if (isSelected(id)) {
      return 'url(#glow)';
    }
    return '';
  };

  return (
    <div className="body-map-container flex justify-center relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50 to-indigo-50 rounded-xl -z-10"></div>
      
      <motion.svg
        width="340"
        height="540"
        viewBox="0 0 340 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Filters for glow effects */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor={colors.glow} result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feComposite in="SourceGraphic" in2="shadow" operator="over" />
          </filter>
          
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          
          <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Background silhouette for depth */}
        <motion.path
          d="M170 60 C130 60, 105 85, 105 125 C105 165, 130 190, 170 190 C210 190, 235 165, 235 125 C235 85, 210 60, 170 60 M170 190 L170 210 M120 210 L120 290 L220 290 L220 210 M120 290 L120 380 L220 380 L220 290 M120 210 L80 210 L55 310 L80 310 L105 250 M220 210 L260 210 L285 310 L260 310 L235 250 M55 310 L40 350 L65 365 L80 310 M285 310 L300 350 L275 365 L260 310 M120 380 L120 500 L160 500 L170 380 M220 380 L220 500 L180 500 L170 380 M120 500 L95 525 L160 525 L160 500 M220 500 L245 525 L180 525 L180 500"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1"
          strokeDasharray="5,3"
          className="opacity-50"
        />

        {/* Head */}
        <motion.path
          id={bodyPartIds.head}
          d="M170 60 C130 60, 105 85, 105 125 C105 165, 130 190, 170 190 C210 190, 235 165, 235 125 C235 85, 210 60, 170 60"
          fill={getFillColor(bodyPartIds.head)}
          stroke={getStrokeColor(bodyPartIds.head)}
          strokeWidth="2.5"
          filter={getFilter(bodyPartIds.head)}
          onClick={() => handleClick(bodyPartIds.head)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.head)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Face */}
        <motion.path
          id={bodyPartIds.face}
          d="M170 95 C150 95, 135 110, 135 130 C135 150, 150 165, 170 165 C190 165, 205 150, 205 130 C205 110, 190 95, 170 95"
          fill={getFillColor(bodyPartIds.face)}
          stroke={getStrokeColor(bodyPartIds.face)}
          strokeWidth="2"
          filter={getFilter(bodyPartIds.face)}
          onClick={() => handleClick(bodyPartIds.face)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.face)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Neck */}
        <motion.path
          id={bodyPartIds.neck}
          d="M150 190 L150 210 L190 210 L190 190"
          fill={getFillColor(bodyPartIds.neck)}
          stroke={getStrokeColor(bodyPartIds.neck)}
          strokeWidth="2.5"
          filter={getFilter(bodyPartIds.neck)}
          onClick={() => handleClick(bodyPartIds.neck)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.neck)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Chest */}
        <motion.path
          id={bodyPartIds.chest}
          d="M120 210 L120 290 L220 290 L220 210"
          fill={getFillColor(bodyPartIds.chest)}
          stroke={getStrokeColor(bodyPartIds.chest)}
          strokeWidth="2.5"
          filter={getFilter(bodyPartIds.chest)}
          onClick={() => handleClick(bodyPartIds.chest)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.chest)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Stomach */}
        <motion.path
          id={bodyPartIds.stomach}
          d="M120 290 L120 380 L220 380 L220 290"
          fill={getFillColor(bodyPartIds.stomach)}
          stroke={getStrokeColor(bodyPartIds.stomach)}
          strokeWidth="2.5"
          filter={getFilter(bodyPartIds.stomach)}
          onClick={() => handleClick(bodyPartIds.stomach)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.stomach)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Left Arm */}
        <motion.path
          id={bodyPartIds.leftArm}
          d="M120 210 L80 210 L55 310 L80 310 L105 250"
          fill={getFillColor(bodyPartIds.leftArm)}
          stroke={getStrokeColor(bodyPartIds.leftArm)}
          strokeWidth="2.5"
          filter={getFilter(bodyPartIds.leftArm)}
          onClick={() => handleClick(bodyPartIds.leftArm)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.leftArm)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Right Arm */}
        <motion.path
          id={bodyPartIds.rightArm}
          d="M220 210 L260 210 L285 310 L260 310 L235 250"
          fill={getFillColor(bodyPartIds.rightArm)}
          stroke={getStrokeColor(bodyPartIds.rightArm)}
          strokeWidth="2.5"
          filter={getFilter(bodyPartIds.rightArm)}
          onClick={() => handleClick(bodyPartIds.rightArm)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.rightArm)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Left Hand */}
        <motion.path
          id={bodyPartIds.leftHand}
          d="M55 310 L40 350 L65 365 L80 310"
          fill={getFillColor(bodyPartIds.leftHand)}
          stroke={getStrokeColor(bodyPartIds.leftHand)}
          strokeWidth="2.5"
          filter={getFilter(bodyPartIds.leftHand)}
          onClick={() => handleClick(bodyPartIds.leftHand)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.leftHand)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Right Hand */}
        <motion.path
          id={bodyPartIds.rightHand}
          d="M285 310 L300 350 L275 365 L260 310"
          fill={getFillColor(bodyPartIds.rightHand)}
          stroke={getStrokeColor(bodyPartIds.rightHand)}
          strokeWidth="2.5"
          filter={getFilter(bodyPartIds.rightHand)}
          onClick={() => handleClick(bodyPartIds.rightHand)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.rightHand)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Left Leg */}
        <motion.path
          id={bodyPartIds.leftLeg}
          d="M120 380 L120 500 L160 500 L170 380"
          fill={getFillColor(bodyPartIds.leftLeg)}
          stroke={getStrokeColor(bodyPartIds.leftLeg)}
          strokeWidth="2.5"
          filter={getFilter(bodyPartIds.leftLeg)}
          onClick={() => handleClick(bodyPartIds.leftLeg)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.leftLeg)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Right Leg */}
        <motion.path
          id={bodyPartIds.rightLeg}
          d="M220 380 L220 500 L180 500 L170 380"
          fill={getFillColor(bodyPartIds.rightLeg)}
          stroke={getStrokeColor(bodyPartIds.rightLeg)}
          strokeWidth="2.5"
          filter={getFilter(bodyPartIds.rightLeg)}
          onClick={() => handleClick(bodyPartIds.rightLeg)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.rightLeg)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Left Foot */}
        <motion.path
          id={bodyPartIds.leftFoot}
          d="M120 500 L95 525 L160 525 L160 500"
          fill={getFillColor(bodyPartIds.leftFoot)}
          stroke={getStrokeColor(bodyPartIds.leftFoot)}
          strokeWidth="2.5"
          filter={getFilter(bodyPartIds.leftFoot)}
          onClick={() => handleClick(bodyPartIds.leftFoot)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.leftFoot)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Right Foot */}
        <motion.path
          id={bodyPartIds.rightFoot}
          d="M220 500 L245 525 L180 525 L180 500"
          fill={getFillColor(bodyPartIds.rightFoot)}
          stroke={getStrokeColor(bodyPartIds.rightFoot)}
          strokeWidth="2.5"
          filter={getFilter(bodyPartIds.rightFoot)}
          onClick={() => handleClick(bodyPartIds.rightFoot)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.rightFoot)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Back */}
        <motion.path
          id={bodyPartIds.back}
          d="M290 380 L320 380 L320 210 L290 210"
          fill={getFillColor(bodyPartIds.back)}
          stroke={getStrokeColor(bodyPartIds.back)}
          strokeWidth="2.5"
          filter={getFilter(bodyPartIds.back)}
          onClick={() => handleClick(bodyPartIds.back)}
          onMouseEnter={() => setHoveredPart(bodyPartIds.back)}
          onMouseLeave={() => setHoveredPart(null)}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Back label */}
        <text 
          x="305" 
          y="295" 
          fontSize="14" 
          fontWeight="500"
          fill={isSelected(bodyPartIds.back) ? colors.strokeSelected : colors.stroke}
          textAnchor="middle" 
          transform="rotate(90, 305, 295)"
        >
          Back
        </text>

        {/* Tooltip for hovered part */}
        {hoveredPart && (
          <g>
            <rect
              x={170}
              y={20}
              width={idToDisplayName[hoveredPart].length * 10 + 20}
              height="24"
              rx="12"
              fill="rgba(15, 23, 42, 0.8)"
              transform={`translate(-${(idToDisplayName[hoveredPart].length * 10 + 20) / 2}, 0)`}
            />
            <text
              x={170}
              y={36}
              fontSize="14"
              fontWeight="500"
              fill="white"
              textAnchor="middle"
            >
              {idToDisplayName[hoveredPart]}
            </text>
          </g>
        )}
      </motion.svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 px-3 py-1 rounded-full text-xs text-gray-600 flex items-center space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-200 mr-1"></div>
          <span>Not selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBodyMapSVG;