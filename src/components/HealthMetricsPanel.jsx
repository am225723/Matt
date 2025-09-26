import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Activity, 
  Droplet, 
  Thermometer,
  Weight,
  Ruler,
  Calculator,
  Clock,
  Save
} from 'lucide-react';

const HealthMetricsPanel = ({ 
  healthMetrics, 
  onChange, 
  onNext, 
  onPrevious,
  onSave 
}) => {
  const [isCalculating, setIsCalculating] = useState(false);

  // Auto-calculate BMI when weight or height changes
  const calculateBMI = () => {
    if (healthMetrics.weight && healthMetrics.height) {
      setIsCalculating(true);
      const weightKg = parseFloat(healthMetrics.weight) * 0.453592; // Convert lbs to kg
      const heightM = parseFloat(healthMetrics.height) * 0.0254; // Convert inches to meters
      const bmi = (weightKg / (heightM * heightM)).toFixed(1);
      
      setTimeout(() => {
        onChange('bmi', bmi);
        setIsCalculating(false);
      }, 500);
    }
  };

  // Health reference ranges
  const healthRanges = {
    heartRate: { min: 60, max: 100, unit: 'BPM' },
    bloodPressureSystolic: { min: 90, max: 120, unit: 'mmHg' },
    bloodPressureDiastolic: { min: 60, max: 80, unit: 'mmHg' },
    temperature: { min: 97, max: 99, unit: '°F' },
    oxygenSaturation: { min: 95, max: 100, unit: '%' },
    bmi: { min: 18.5, max: 24.9, unit: 'kg/m²' }
  };

  const getHealthStatus = (metric, value) => {
    if (!value) return 'normal';
    const numValue = parseFloat(value);
    const range = healthRanges[metric];
    
    if (!range) return 'normal';
    
    if (numValue < range.min) return 'low';
    if (numValue > range.max) return 'high';
    return 'normal';
  };

  const renderHealthStatus = (metric, value) => {
    const status = getHealthStatus(metric, value);
    const range = healthRanges[metric];
    
    if (!value || !range) return null;

    const statusColors = {
      normal: 'bg-green-100 text-green-800',
      low: 'bg-blue-100 text-blue-800',
      high: 'bg-red-100 text-red-800'
    };

    const statusText = {
      normal: 'Normal',
      low: 'Low',
      high: 'High'
    };

    return (
      <Badge className={statusColors[status]}>
        {statusText[status]} ({range.min}-{range.max} {range.unit})
      </Badge>
    );
  };

  const renderMetricInput = (metric, label, icon, placeholder, type = 'number', step = '1') => {
    const status = getHealthStatus(metric, healthMetrics[metric]);
    
    return (
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 * Object.keys(healthRanges).indexOf(metric) }}
      >
        <Label className="flex items-center text-sm font-medium">
          {icon}
          <span className="ml-2">{label}</span>
          {healthMetrics[metric] && renderHealthStatus(metric, healthMetrics[metric])}
        </Label>
        <div className="relative">
          <Input
            type={type}
            step={step}
            value={healthMetrics[metric]}
            onChange={(e) => onChange(metric, e.target.value)}
            placeholder={placeholder}
            className="pl-10"
          />
          {icon}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Health Metrics</h3>
        <Badge variant="secondary">Optional</Badge>
      </div>

      {/* Vital Signs Section */}
      <Card className="p-6 bg-gradient-to-r from-red-50 to-pink-50">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-red-500" />
          Vital Signs
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderMetricInput(
            'heartRate',
            'Heart Rate (BPM)',
            <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />,
            'e.g., 72'
          )}
          
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              <Activity className="w-4 h-4 mr-2 text-blue-500" />
              Blood Pressure
              {(healthMetrics.bloodPressureSystolic || healthMetrics.bloodPressureDiastolic) && 
                renderHealthStatus('bloodPressureSystolic', healthMetrics.bloodPressureSystolic)}
            </Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={healthMetrics.bloodPressureSystolic}
                onChange={(e) => onChange('bloodPressureSystolic', e.target.value)}
                placeholder="Systolic"
                className="flex-1"
              />
              <span className="text-gray-500 self-center">/</span>
              <Input
                type="number"
                value={healthMetrics.bloodPressureDiastolic}
                onChange={(e) => onChange('bloodPressureDiastolic', e.target.value)}
                placeholder="Diastolic"
                className="flex-1"
              />
            </div>
          </div>

          {renderMetricInput(
            'temperature',
            'Temperature (°F)',
            <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />,
            'e.g., 98.6',
            'number',
            '0.1'
          )}

          {renderMetricInput(
            'oxygenSaturation',
            'Oxygen Saturation (%)',
            <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />,
            'e.g., 98'
          )}
        </div>
      </Card>

      {/* Physical Metrics Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <Weight className="w-5 h-5 mr-2 text-blue-500" />
          Physical Metrics
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderMetricInput(
            'weight',
            'Weight (lbs)',
            <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />,
            'e.g., 150'
          )}
          
          {renderMetricInput(
            'height',
            'Height (inches)',
            <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />,
            'e.g., 68'
          )}

          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              <Calculator className="w-4 h-4 mr-2 text-green-500" />
              BMI (Auto-calculated)
              {healthMetrics.bmi && renderHealthStatus('bmi', healthMetrics.bmi)}
            </Label>
            <div className="relative">
              <Input
                type="number"
                step="0.1"
                value={healthMetrics.bmi}
                onChange={(e) => onChange('bmi', e.target.value)}
                placeholder="Auto-calculated"
                className="pl-10 bg-gray-50"
                readOnly
              />
              <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {healthMetrics.weight && healthMetrics.height && (
              <Button
                size="sm"
                variant="outline"
                onClick={calculateBMI}
                disabled={isCalculating}
                className="w-full"
              >
                {isCalculating ? 'Calculating...' : 'Calculate BMI'}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Additional Notes Section */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-purple-500" />
          Additional Notes
        </h4>
        
        <div className="space-y-4">
          <Textarea
            value={healthMetrics.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Any additional health observations, medications, or concerns..."
            className="min-h-[100px] resize-none"
          />
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Last updated: {new Date(healthMetrics.timestamp).toLocaleString()}</span>
            <span>{healthMetrics.notes.length} characters</span>
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
          Continue to Journal
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
        
        {Object.values(healthMetrics).some(metric => metric !== '') && (
          <Button
            onClick={onSave}
            variant="outline"
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Metrics
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default HealthMetricsPanel;