import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

const HealthDataModal = ({ isOpen, onClose, onSave, onDelete, selectedDateData, date }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (selectedDateData) {
      setFormData(selectedDateData);
    } else {
      setFormData({
        date: date.toISOString(),
        steps: '',
        sleep: '',
        heartRate: '',
        weight: '',
        stressLevel: '',
        alcoholIntake: '',
        calories: '',
        mood: '',
        exerciseMinutes: '',
        sleepQuality: '',
        waterIntake: '',
      });
    }
  }, [selectedDateData, date]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const numericData = {};
    for (const key in formData) {
      if (key !== 'date') {
        numericData[key] = Number(formData[key]) || 0;
      } else {
        numericData[key] = formData[key];
      }
    }
    onSave(numericData);
    onClose();
  };

  const handleDelete = () => {
    onDelete(formData.date);
    onClose();
  };

  const metricFields = [
    { name: 'steps', label: 'Steps' },
    { name: 'sleep', label: 'Sleep (hours)' },
    { name: 'heartRate', label: 'Heart Rate (bpm)' },
    { name: 'weight', label: 'Weight (lbs)' },
    { name: 'stressLevel', label: 'Stress Level (1-10)' },
    { name: 'alcoholIntake', label: 'Alcohol Intake (drinks)' },
    { name: 'calories', label: 'Calories' },
    { name: 'mood', label: 'Mood (1-5)' },
    { name: 'exerciseMinutes', label: 'Exercise (minutes)' },
    { name: 'sleepQuality', label: 'Sleep Quality (1-5)' },
    { name: 'waterIntake', label: 'Water Intake (oz)' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{selectedDateData ? 'Edit' : 'Log'} Health Data for {new Date(date).toLocaleDateString()}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
            {metricFields.map(field => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.label}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            {selectedDateData && (
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            )}
            <Button onClick={handleSave}>{selectedDateData ? 'Update' : 'Save'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthDataModal;