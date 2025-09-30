import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Heart, 
  FileText, 
  Clock, 
  Calendar,
  Zap,
  Brain,
  Smile,
  Frown,
  Meh,
  ChevronLeft,
  ChevronRight,
  Save
} from 'lucide-react';

const JournalPanel = ({ 
  journalEntry, 
  onChange, 
  onNext, 
  onPrevious,
  onSave 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mood options with colors
  const moodOptions = [
    { value: 'calm', label: 'Calm', icon: Smile, color: 'text-green-500' },
    { value: 'anxious', label: 'Anxious', icon: Frown, color: 'text-orange-500' },
    { value: 'stressed', label: 'Stressed', icon: Zap, color: 'text-red-500' },
    { value: 'overwhelmed', label: 'Overwhelmed', icon: Brain, color: 'text-purple-500' },
    { value: 'panicked', label: 'Panicked', icon: Frown, color: 'text-red-600' },
    { value: 'nervous', label: 'Nervous', icon: Meh, color: 'text-yellow-500' },
    { value: 'worried', label: 'Worried', icon: Brain, color: 'text-blue-500' },
    { value: 'fearful', label: 'Fearful', icon: Frown, color: 'text-gray-600' },
    { value: 'relaxed', label: 'Relaxed', icon: Smile, color: 'text-green-600' },
    { value: 'tense', label: 'Tense', icon: Zap, color: 'text-orange-600' }
  ];

  // Common triggers
  const commonTriggers = [
    'Work Stress', 'Social Situations', 'Health Concerns', 'Financial Worries',
    'Relationship Issues', 'Time Pressure', 'Uncertainty', 'Change', 'Conflict',
    'Perfectionism', 'Social Media', 'News', 'Sleep Issues', 'Family Problems',
    'Academic Pressure', 'Public Speaking', 'Crowds', 'Travel', 'Deadlines'
  ];

  // Coping strategies
  const copingStrategies = [
    'Deep Breathing', 'Meditation', 'Exercise', 'Talking to Someone', 'Journaling',
    'Music', 'Nature Walk', 'Reading', 'Creative Activities', 'Mindfulness',
    'Progressive Muscle Relaxation', 'Grounding Techniques', 'Positive Self-Talk',
    'Distraction', 'Problem Solving', 'Time Management', 'Self-Care', 'Therapy',
    'Medication', 'Support Groups'
  ];

  // Time of day options
  const timeOfDayOptions = [
    'Early Morning (5-8 AM)', 'Morning (8-11 AM)', 'Midday (11 AM-2 PM)',
    'Afternoon (2-5 PM)', 'Evening (5-8 PM)', 'Night (8-11 PM)', 'Late Night (11 PM-2 AM)'
  ];

  // Duration options
  const durationOptions = [
    'Less than 5 minutes', '5-15 minutes', '15-30 minutes', '30 minutes - 1 hour',
    '1-2 hours', '2-4 hours', '4-8 hours', 'More than 8 hours', 'All day', 'Ongoing'
  ];

  const handleMoodSelect = (mood) => {
    onChange('mood', mood);
  };

  const handleTriggerToggle = (trigger) => {
    onChange('triggers', 
      journalEntry.triggers.includes(trigger)
        ? journalEntry.triggers.filter(t => t !== trigger)
        : [...journalEntry.triggers, trigger]
    );
  };

  const handleStrategyToggle = (strategy) => {
    onChange('copingStrategies', 
      journalEntry.copingStrategies.includes(strategy)
        ? journalEntry.copingStrategies.filter(s => s !== strategy)
        : [...journalEntry.copingStrategies, strategy]
    );
  };

  const handleSeverityChange = (value) => {
    onChange('severity', value);
  };

  const getMoodIcon = (mood) => {
    const moodOption = moodOptions.find(m => m.value === mood);
    if (!moodOption) return null;
    const IconComponent = moodOption.icon;
    return <IconComponent className={`w-6 h-6 ${moodOption.color}`} />;
  };

  const getSeverityColor = (severity) => {
    if (severity <= 3) return 'bg-green-500';
    if (severity <= 6) return 'bg-yellow-500';
    if (severity <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getSeverityLabel = (severity) => {
    if (severity <= 3) return 'Mild';
    if (severity <= 6) return 'Moderate';
    if (severity <= 8) return 'Severe';
    return 'Extreme';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Emotional Journal</h3>
        <Badge variant="secondary">Optional</Badge>
      </div>

      {/* Entry Info */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          Entry Information
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              Time of Day
            </Label>
            <select
              value={journalEntry.timeOfDay}
              onChange={(e) => onChange('timeOfDay', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select time period</option>
              {timeOfDayOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              Duration
            </Label>
            <select
              value={journalEntry.duration}
              onChange={(e) => onChange('duration', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select duration</option>
              {durationOptions.map(duration => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Current Time
            </Label>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </Card>

      {/* Mood Selection */}
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-yellow-500" />
          Current Mood
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {moodOptions.map(mood => (
            <motion.button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className={`p-4 rounded-lg text-center transition-all ${
                journalEntry.mood === mood.value
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-yellow-50 border border-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <mood.icon className={`w-6 h-6 mx-auto mb-2 ${mood.color}`} />
              <div className="text-sm font-medium">{mood.label}</div>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Severity Slider */}
      <Card className="p-6 bg-gradient-to-r from-red-50 to-pink-50">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-red-500" />
          Anxiety Severity
        </h4>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Mild</span>
            <span className="text-lg font-bold text-red-600">
              {journalEntry.severity}/10
            </span>
            <span className="text-sm text-gray-600">Severe</span>
          </div>
          
          <Slider
            value={[journalEntry.severity]}
            onValueChange={(value) => handleSeverityChange(value[0])}
            max={10}
            step={1}
            className="w-full"
          />
          
          <div className="text-center">
            <Badge className={`${getSeverityColor(journalEntry.severity)} text-white`}>
              {getSeverityLabel(journalEntry.severity)}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Triggers Section */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-purple-500" />
          Triggers & Stressors
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {commonTriggers.map(trigger => (
            <motion.button
              key={trigger}
              onClick={() => handleTriggerToggle(trigger)}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                journalEntry.triggers.includes(trigger)
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {trigger}
            </motion.button>
          ))}
        </div>
        
        <div className="mt-4">
          <Label className="text-sm font-medium mb-2">Other Triggers</Label>
          <Input
            placeholder="Add custom triggers..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                handleTriggerToggle(e.target.value.trim());
                e.target.value = '';
              }
            }}
            className="mb-2"
          />
          {journalEntry.triggers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {journalEntry.triggers.map(trigger => (
                <Badge key={trigger} variant="secondary" className="text-xs">
                  {trigger}
                  <button
                    onClick={() => handleTriggerToggle(trigger)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Coping Strategies Section */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-green-500" />
          Coping Strategies Used
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {copingStrategies.map(strategy => (
            <motion.button
              key={strategy}
              onClick={() => handleStrategyToggle(strategy)}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                journalEntry.copingStrategies.includes(strategy)
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {strategy}
            </motion.button>
          ))}
        </div>
        
        <div className="mt-4">
          <Label className="text-sm font-medium mb-2">Other Strategies</Label>
          <Input
            placeholder="Add custom strategies..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                handleStrategyToggle(e.target.value.trim());
                e.target.value = '';
              }
            }}
            className="mb-2"
          />
          {journalEntry.copingStrategies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {journalEntry.copingStrategies.map(strategy => (
                <Badge key={strategy} variant="secondary" className="text-xs">
                  {strategy}
                  <button
                    onClick={() => handleStrategyToggle(strategy)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Detailed Journal Entry */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-slate-50">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-gray-500" />
          Detailed Journal Entry
        </h4>
        
        <div className="space-y-4">
          <Textarea
            value={journalEntry.text}
            onChange={(e) => onChange('text', e.target.value)}
            placeholder="Describe your experience in detail. What are you thinking? What physical sensations are you noticing? What emotions are present?..."
            className="min-h-[200px] resize-none"
          />
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{journalEntry.text.length} characters</span>
            <span>Approx. {Math.ceil(journalEntry.text.length / 200)} minutes to read</span>
          </div>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex-1"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={onNext}
          className="flex-1"
        >
          Continue to Summary
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
        
        {journalEntry.text && (
          <Button
            onClick={onSave}
            variant="outline"
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default JournalPanel;