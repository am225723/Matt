import React, { useState, useEffect } from 'react';
import { loadGamificationData } from '@/utils/gamificationStorage';
import { ALL_BADGES } from '@/data/badges';
import { Button } from '@/components/ui/button';

const Achievements = ({ onBack }) => {
  const [gamificationData, setGamificationData] = useState({
    badges: [],
    streak: 0,
    lastVisit: null,
  });

  useEffect(() => {
    setGamificationData(loadGamificationData());
  }, []);

  const earnedBadges = ALL_BADGES.filter(badge => gamificationData.badges.includes(badge.key));
  const unearnedBadges = ALL_BADGES.filter(badge => !gamificationData.badges.includes(badge.key));

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Achievements</h1>
          <Button variant="outline" onClick={onBack}>Return to Dashboard</Button>
        </div>

        <div className="mb-8 p-6 border rounded-lg text-center">
          <h2 className="text-2xl font-semibold">Current Streak</h2>
          <p className="text-5xl font-bold text-primary">{gamificationData.streak} days</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Badges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map(badge => (
              <div key={badge.key} className="p-4 border rounded-lg text-center">
                <p className="text-4xl mb-2">{badge.emoji}</p>
                <p className="font-semibold">{badge.name}</p>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            ))}
            {unearnedBadges.map(badge => (
              <div key={badge.key} className="p-4 border rounded-lg text-center opacity-50">
                <p className="text-4xl mb-2">?</p>
                <p className="font-semibold">{badge.name}</p>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
