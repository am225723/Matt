import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Heart } from 'lucide-react';

export default function StepNavigation({ 
  step, 
  total, 
  onPrevious, 
  onNext, 
  onSave, 
  onComplete 
}) {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
      <Button
        onClick={onPrevious}
        disabled={step === 1}
        variant="outline"
        className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>

      <div className="flex gap-3">
        <Button
          onClick={onSave}
          variant="outline"
          className="bg-green-500/20 border-green-400/30 text-green-100 hover:bg-green-500/30"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Plan
        </Button>

        {step < total ? (
          <Button
            onClick={onNext}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
          >
            <Heart className="w-4 h-4 mr-2" />
            Complete Plan
          </Button>
        )}
      </div>
    </div>
  );
}