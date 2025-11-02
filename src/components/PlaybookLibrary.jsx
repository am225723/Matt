import React, { useState, useEffect } from 'react';
import { loadPlansFromLibrary, deletePlanFromLibrary } from '@/utils/planLibraryStorage';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const PlaybookLibrary = ({ onSelectPlan, onBack }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    setPlans(loadPlansFromLibrary());
  }, []);

  const handleDelete = (planId) => {
    deletePlanFromLibrary(planId);
    setPlans(loadPlansFromLibrary());
    toast({
      title: "Plan Deleted",
      description: "The resilience plan has been removed from your library.",
    });
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Playbook Library</h1>
          <Button variant="outline" onClick={onBack}>Return to Dashboard</Button>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Your library is empty.</p>
            <p className="text-sm text-muted-foreground mt-2">Create a new plan and save it to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">{plan.name || `Plan from ${new Date(plan.savedAt).toLocaleDateString()}`}</h2>
                  <p className="text-sm text-muted-foreground">Scenario: {plan.scenario}</p>
                  <p className="text-sm text-muted-foreground">Saved: {new Date(plan.savedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => onSelectPlan(plan.id)}>Load</Button>
                  <Button variant="destructive" onClick={() => handleDelete(plan.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaybookLibrary;
