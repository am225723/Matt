import React from 'react';
import { CheckCircle } from 'lucide-react';
import { labelFor } from '@/utils/scenarioHelpers';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function ReflectionCommitment({ answers, updateAnswer, scenario, onSavePlan, onStartNewPlan }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="proud" className="text-black">What are you proud of in creating this plan?</Label>
          <Input
            id="proud"
            value={answers.proud || ""}
            onChange={(e) => updateAnswer("proud", e.target.value)}
            placeholder="Acknowledge your effort and commitment to growth..."
          />
        </div>
        <div>
          <Label htmlFor="tweak" className="text-black">What would you tweak or improve for next time?</Label>
          <Input
            id="tweak"
            value={answers.tweak || ""}
            onChange={(e) => updateAnswer("tweak", e.target.value)}
            placeholder="How might you refine this plan based on your experience?"
          />
        </div>
      </div>
      <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-semibold text-black">Congratulations!</h3>
        </div>
        <p className="text-black">
          You've completed your resilience plan for <strong>{labelFor(scenario)}</strong>.
          Remember, this is a living document that you can revisit and refine as you grow.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <Button onClick={onSavePlan} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          Save Plan
        </Button>
        <Button onClick={onStartNewPlan} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          Plan another
        </Button>
      </div>
    </div>
  );
}