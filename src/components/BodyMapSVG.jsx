import React from 'react';

const BodyMapSVG = ({ selectedParts, onPartClick }) => {
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

  return (
    <div className="body-map-container flex justify-center">
      <svg
        width="300"
        height="500"
        viewBox="0 0 300 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <path
          id={bodyPartIds.head}
          d="M150 50 C120 50, 100 70, 100 100 C100 130, 120 150, 150 150 C180 150, 200 130, 200 100 C200 70, 180 50, 150 50"
          fill={isSelected(bodyPartIds.head) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="2"
          onClick={() => handleClick(bodyPartIds.head)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Face */}
        <path
          id={bodyPartIds.face}
          d="M150 80 C135 80, 125 90, 125 105 C125 120, 135 130, 150 130 C165 130, 175 120, 175 105 C175 90, 165 80, 150 80"
          fill={isSelected(bodyPartIds.face) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="1"
          onClick={() => handleClick(bodyPartIds.face)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Neck */}
        <path
          id={bodyPartIds.neck}
          d="M135 150 L135 170 L165 170 L165 150"
          fill={isSelected(bodyPartIds.neck) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="2"
          onClick={() => handleClick(bodyPartIds.neck)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Chest */}
        <path
          id={bodyPartIds.chest}
          d="M110 170 L110 230 L190 230 L190 170"
          fill={isSelected(bodyPartIds.chest) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="2"
          onClick={() => handleClick(bodyPartIds.chest)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Stomach */}
        <path
          id={bodyPartIds.stomach}
          d="M110 230 L110 300 L190 300 L190 230"
          fill={isSelected(bodyPartIds.stomach) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="2"
          onClick={() => handleClick(bodyPartIds.stomach)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Left Arm */}
        <path
          id={bodyPartIds.leftArm}
          d="M110 170 L80 170 L60 250 L80 250 L100 200"
          fill={isSelected(bodyPartIds.leftArm) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="2"
          onClick={() => handleClick(bodyPartIds.leftArm)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Right Arm */}
        <path
          id={bodyPartIds.rightArm}
          d="M190 170 L220 170 L240 250 L220 250 L200 200"
          fill={isSelected(bodyPartIds.rightArm) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="2"
          onClick={() => handleClick(bodyPartIds.rightArm)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Left Hand */}
        <path
          id={bodyPartIds.leftHand}
          d="M60 250 L50 280 L70 290 L80 250"
          fill={isSelected(bodyPartIds.leftHand) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="2"
          onClick={() => handleClick(bodyPartIds.leftHand)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Right Hand */}
        <path
          id={bodyPartIds.rightHand}
          d="M240 250 L250 280 L230 290 L220 250"
          fill={isSelected(bodyPartIds.rightHand) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="2"
          onClick={() => handleClick(bodyPartIds.rightHand)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Left Leg */}
        <path
          id={bodyPartIds.leftLeg}
          d="M110 300 L110 400 L140 400 L150 300"
          fill={isSelected(bodyPartIds.leftLeg) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="2"
          onClick={() => handleClick(bodyPartIds.leftLeg)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Right Leg */}
        <path
          id={bodyPartIds.rightLeg}
          d="M190 300 L190 400 L160 400 L150 300"
          fill={isSelected(bodyPartIds.rightLeg) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="2"
          onClick={() => handleClick(bodyPartIds.rightLeg)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Left Foot */}
        <path
          id={bodyPartIds.leftFoot}
          d="M110 400 L90 420 L140 420 L140 400"
          fill={isSelected(bodyPartIds.leftFoot) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="2"
          onClick={() => handleClick(bodyPartIds.leftFoot)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Right Foot */}
        <path
          id={bodyPartIds.rightFoot}
          d="M190 400 L210 420 L160 420 L160 400"
          fill={isSelected(bodyPartIds.rightFoot) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="2"
          onClick={() => handleClick(bodyPartIds.rightFoot)}
          style={{ cursor: 'pointer' }}
        />
        
        {/* Back (shown as a separate element behind) */}
        <path
          id={bodyPartIds.back}
          d="M240 350 L270 350 L270 200 L240 200"
          fill={isSelected(bodyPartIds.back) ? "#3b82f6" : "#e5e7eb"}
          stroke="#000"
          strokeWidth="2"
          onClick={() => handleClick(bodyPartIds.back)}
          style={{ cursor: 'pointer' }}
        />
        <text x="255" y="275" fontSize="12" textAnchor="middle" transform="rotate(90, 255, 275)">Back</text>
      </svg>
    </div>
  );
};

export default BodyMapSVG;