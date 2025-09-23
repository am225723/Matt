import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const bodyParts = ["Head", "Chest", "Stomach", "Hands", "Back", "Shoulders", "Legs"];
const sensations = ["Tightness", "Racing Heart", "Numbness", "Butterflies", "Shaking", "Sweating", "Dizziness"];

const AnxietyTracker = ({ onBack }) => {
  const [log, setLog] = useState(null);
  const [formData, setFormData] = useState({
    feeling: '',
    anxietyLevel: 5,
    bodyParts: [],
    sensations: [],
    lifeEvents: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSliderChange = (value) => {
    setFormData((prev) => ({ ...prev, anxietyLevel: value[0] }));
  };

  const handleCheckboxChange = (category, item) => {
    setFormData((prev) => {
      const currentItems = prev[category];
      if (currentItems.includes(item)) {
        return { ...prev, [category]: currentItems.filter((i) => i !== item) };
      } else {
        return { ...prev, [category]: [...currentItems, item] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLog(formData);
  };

  const handleEdit = () => {
    setLog(null);
  }

  const LogSummaryItem = ({ title, content }) => (
    <div>
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
      <p className="text-gray-600 whitespace-pre-wrap">{content}</p>
    </div>
  );

  if (log) {
    return (
      <div className="container mx-auto p-4 sm:p-8">
        <Button onClick={onBack} className="mb-8">&larr; Back to Dashboard</Button>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 text-gray-900">
          <div className="mb-6">
            <h2 className="text-3xl font-bold">Anxiety Log Saved</h2>
            <p className="text-muted-foreground mt-1">Here is a summary of your entry.</p>
          </div>
          <div className="space-y-6">
            <LogSummaryItem title="Feeling" content={log.feeling || 'N/A'} />
            <LogSummaryItem title="Anxiety Level" content={`${log.anxietyLevel} / 10`} />
            <LogSummaryItem title="Physical Sensations" content={log.bodyParts.join(', ') || 'None selected'} />
            <LogSummaryItem title="Sensation Types" content={log.sensations.join(', ') || 'None selected'} />
            <LogSummaryItem title="Life Context" content={log.lifeEvents || 'N/A'} />
          </div>
          <Button onClick={handleEdit} className="mt-8">Log Another Entry</Button>
        </div>
      </div>
    )
  }


  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Button onClick={onBack} className="mb-8">&larr; Back to Dashboard</Button>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="mb-6 text-gray-900">
          <h2 className="text-3xl font-bold">Anxiety Tracker</h2>
          <p className="text-muted-foreground mt-1">
            Log how you're feeling to identify patterns and triggers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 text-gray-900">
          {/* What are you feeling? */}
          <div className="space-y-2">
            <Label htmlFor="feeling" className="text-lg">What are you feeling right now?</Label>
            <Input
              id="feeling"
              placeholder="e.g., worried, on edge, overwhelmed"
              value={formData.feeling}
              onChange={handleInputChange}
            />
          </div>

          {/* Anxiety Level */}
          <div className="space-y-2">
            <Label htmlFor="anxietyLevel" className="text-lg">Anxiety Level: {formData.anxietyLevel}</Label>
            <Slider
              id="anxietyLevel"
              min={1}
              max={10}
              step={1}
              value={[formData.anxietyLevel]}
              onValueChange={handleSliderChange}
            />
          </div>

          {/* Where in your body? */}
          <div className="space-y-4">
            <Label className="text-lg">Where in your body do you feel it?</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bodyParts.map((part) => (
                <div key={part} className="flex items-center space-x-2">
                  <Checkbox
                    id={`body-${part}`}
                    checked={formData.bodyParts.includes(part)}
                    onCheckedChange={() => handleCheckboxChange('bodyParts', part)}
                  />
                  <Label htmlFor={`body-${part}`}>{part}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* What does it feel like? */}
          <div className="space-y-4">
            <Label className="text-lg">What does it feel like?</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sensations.map((sensation) => (
                <div key={sensation} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sensation-${sensation}`}
                    checked={formData.sensations.includes(sensation)}
                    onCheckedChange={() => handleCheckboxChange('sensations', sensation)}
                  />
                  <Label htmlFor={`sensation-${sensation}`}>{sensation}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* What's going on in your life? */}
          <div className="space-y-2">
            <Label htmlFor="lifeEvents" className="text-lg">What's going on in your life right now?</Label>
            <Textarea
              id="lifeEvents"
              placeholder="Describe any situations, triggers, or context that might be contributing to how you feel."
              value={formData.lifeEvents}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <Button type="submit">Save Entry</Button>
        </form>
      </div>
    </div>
  );
};

export default AnxietyTracker;
