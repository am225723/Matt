import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Activity, Heart, Bed } from 'lucide-react';

const HealthDashboard = ({ onBack }) => {
  const [healthData, setHealthData] = useState(null);
  const [formData, setFormData] = useState({
    steps: '',
    sleep: '',
    restingHr: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHealthData({
      steps: parseInt(formData.steps, 10) || 0,
      sleep: parseFloat(formData.sleep) || 0,
      restingHr: parseInt(formData.restingHr, 10) || 0,
    });
  };

  const handleEdit = () => {
    setHealthData(null);
  };

  const renderDataPoint = (Icon, label, value, unit) => (
    <div className="flex items-center space-x-4 text-gray-900">
      <Icon className="w-8 h-8 text-primary" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">
          {value.toLocaleString()} <span className="text-base font-normal text-muted-foreground">{unit}</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Button onClick={onBack} className="mb-8">&larr; Back to Dashboard</Button>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="mb-6 text-gray-900">
          <h2 className="text-3xl font-bold">Health & Wellness Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            {healthData ? "Here is your data for today." : "Manually enter your health data for today."}
          </p>
        </div>
        <div>
          {healthData ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderDataPoint(Activity, "Steps", healthData.steps, "steps")}
                {renderDataPoint(Bed, "Sleep", healthData.sleep, "hours")}
                {renderDataPoint(Heart, "Resting HR", healthData.restingHr, "bpm")}
              </div>
              <Button onClick={handleEdit} variant="outline">Edit Data</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-900">
                <div className="space-y-2">
                  <Label htmlFor="steps">Steps</Label>
                  <Input
                    id="steps"
                    type="number"
                    placeholder="e.g., 10000"
                    value={formData.steps}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sleep">Sleep (hours)</Label>
                  <Input
                    id="sleep"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 7.5"
                    value={formData.sleep}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restingHr">Resting Heart Rate (bpm)</Label>
                  <Input
                    id="restingHr"
                    type="number"
                    placeholder="e.g., 60"
                    value={formData.restingHr}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <Button type="submit">Save Data</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthDashboard;
