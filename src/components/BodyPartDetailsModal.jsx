import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Heart, Brain, Zap } from 'lucide-react';

const BodyPartDetailsModal = ({ 
  isOpen, 
  onClose, 
  selectedParts, 
  onSave, 
  existingDetails = {} 
}) => {
  const [partDetails, setPartDetails] = useState({});
  const [currentPartIndex, setCurrentPartIndex] = useState(0);

  // Initialize part details from existing data or create new
  useEffect(() => {
    if (isOpen) {
      const initialDetails = {};
      selectedParts.forEach(part => {
        initialDetails[part] = existingDetails[part] || {
          sensations: [],
          feelings: [],
          intensity: 5,
          notes: '',
          isNew: true
        };
      });
      setPartDetails(initialDetails);
      setCurrentPartIndex(0);
    }
  }, [isOpen, selectedParts, existingDetails]);

  const sensations = [
    // Physical sensations
    'Tightness', 'Tingling', 'Numbness', 'Burning', 'Aching',
    'Stabbing', 'Throbbing', 'Pulsing', 'Cramping', 'Stiffness',
    // Emotional/mental sensations
    'Pressure', 'Heaviness', 'Lightness', 'Warmth', 'Cold',
    'Itching', 'Twitching', 'Shaking', 'Weakness', 'Tension'
  ];

  const feelings = [
    'Anxious', 'Sad', 'Angry', 'Happy', 'Excited', 'Scared',
    'Nervous', 'Relaxed', 'Stressed', 'Empty', 'Full', 'Guilty'
  ];

  const handleFeelingToggle = (part, feeling) => {
    setPartDetails(prev => ({
      ...prev,
      [part]: {
        ...prev[part],
        feelings: prev[part].feelings.includes(feeling)
          ? prev[part].feelings.filter(f => f !== feeling)
          : [...prev[part].feelings, feeling]
      }
    }));
  };

  const handleSensationToggle = (part, sensation) => {
    setPartDetails(prev => ({
      ...prev,
      [part]: {
        ...prev[part],
        sensations: prev[part].sensations.includes(sensation)
          ? prev[part].sensations.filter(s => s !== sensation)
          : [...prev[part].sensations, sensation]
      }
    }));
  };

  const handleIntensityChange = (part, change) => {
    setPartDetails(prev => ({
      ...prev,
      [part]: {
        ...prev[part],
        intensity: Math.max(1, Math.min(10, prev[part].intensity + change))
      }
    }));
  };

  const handleNotesChange = (part, notes) => {
    setPartDetails(prev => ({
      ...prev,
      [part]: {
        ...prev[part],
        notes: notes
      }
    }));
  };

  const handleSave = () => {
    onSave(partDetails);
    onClose();
  };

  const handleNext = () => {
    if (currentPartIndex < selectedParts.length - 1) {
      setCurrentPartIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex(prev => prev - 1);
    }
  };

  const currentPart = selectedParts[currentPartIndex];
  const currentDetails = partDetails[currentPart] || {};

  if (!isOpen || selectedParts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Body Part Details
              </h2>
              <p className="text-gray-600">
                Describe what you're feeling in each selected area
              </p>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Part {currentPartIndex + 1} of {selectedParts.length}
              </span>
              <span className="text-sm text-gray-500">
                {currentPart}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentPartIndex + 1) / selectedParts.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Intensity Rating */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Intensity Level
              </h3>
              <div className="flex items-center justify-center">
                <motion.button
                  onClick={() => handleIntensityChange(currentPart, -1)}
                  className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus className="w-5 h-5" />
                </motion.button>
                
                <div className="mx-8 text-center">
                  <motion.div
                    className="text-4xl font-bold text-blue-600"
                    key={currentDetails.intensity}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    {currentDetails.intensity}
                  </motion.div>
                  <div className="text-sm text-gray-600 mt-1">
                    {currentDetails.intensity <= 3 ? 'Mild' : 
                     currentDetails.intensity <= 7 ? 'Moderate' : 'Severe'}
                  </div>
                </div>
                
                <motion.button
                  onClick={() => handleIntensityChange(currentPart, 1)}
                  className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Emotional Feelings */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-orange-600" />
                Emotional Feelings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {feelings.map(feeling => (
                  <motion.button
                    key={feeling}
                    onClick={() => handleFeelingToggle(currentPart, feeling)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      currentDetails.feelings?.includes(feeling)
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {feeling}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Sensations */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-green-600" />
                Physical Sensations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sensations.map(sensation => (
                  <motion.button
                    key={sensation}
                    onClick={() => handleSensationToggle(currentPart, sensation)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      currentDetails.sensations?.includes(sensation)
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {sensation}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-600" />
                Detailed Description
              </h3>
              <textarea
                value={currentDetails.notes || ''}
                onChange={(e) => handleNotesChange(currentPart, e.target.value)}
                placeholder={`Describe what you're feeling in your ${currentPart}...`}
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <motion.button
              onClick={handlePrevious}
              disabled={currentPartIndex === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentPartIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
              whileHover={currentPartIndex === 0 ? {} : { scale: 1.05 }}
              whileTap={currentPartIndex === 0 ? {} : { scale: 0.95 }}
            >
              Previous
            </motion.button>
            
            <div className="flex space-x-3">
              <motion.button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              
              {currentPartIndex === selectedParts.length - 1 ? (
                <motion.button
                  onClick={handleSave}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save All Details
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BodyPartDetailsModal;