import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { suggestNextScenario } from '@/utils/gemini';
import { loadGamificationData } from '@/utils/gamificationStorage';
import { ALL_BADGES } from '@/data/badges';
import { SCENARIOS, labelFor } from '@/utils/scenarioHelpers';

const AISuggestion = ({ onSelectScenario }) => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestion = async () => {
    setLoading(true);
    const gamificationData = loadGamificationData();
    const earnedBadges = ALL_BADGES.filter(badge => gamificationData.badges.includes(badge.key));
    const completedScenarios = earnedBadges.map(badge => {
      const scenarioKey = badge.key.replace('badge_', '');
      return SCENARIOS.find(s => s.key === scenarioKey);
    }).filter(Boolean);

    const result = await suggestNextScenario(completedScenarios, SCENARIOS);
    if (result) {
      setSuggestion(result);
    } else {
      // Handle error case, maybe show a default suggestion or an error message
    }
    setLoading(false);
  };

  return (
    <div className="p-6 border rounded-lg text-center">
      <h2 className="text-2xl font-semibold mb-4">AI Coach</h2>
      {loading ? (
        <p>Your AI coach is thinking...</p>
      ) : suggestion ? (
        <div>
          <p className="mb-4">{suggestion.reason}</p>
          <Button onClick={() => onSelectScenario(suggestion.scenario)}>
            Start a "{labelFor(suggestion.scenario)}" Playbook
          </Button>
        </div>
      ) : (
        <div>
          <p className="mb-4">Get a suggestion for your next playbook from your AI coach.</p>
          <Button onClick={handleGetSuggestion}>
            <Sparkles className="mr-2 h-4 w-4" />
            Suggest a new scenario
          </Button>
        </div>
      )}
    </div>
  );
};

export default AISuggestion;
