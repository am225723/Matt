import React, { useState, useEffect } from 'react';
import { loadLogbook } from '@/utils/excuseLogStorage';
import { Button } from '@/components/ui/button';

const ExcuseLogbook = ({ onBack }) => {
  const [logbook, setLogbook] = useState([]);

  useEffect(() => {
    setLogbook(loadLogbook());
  }, []);

  if (logbook.length === 0) {
    return (
      <div className="text-center p-4 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold">Excuse Logbook</h2>
        <p className="mt-2 text-muted-foreground">You haven't saved any excuses yet. Start by reframing an excuse in the 'Excuse Trap' hole.</p>
        <Button onClick={onBack} className="w-full mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Excuse Logbook</h2>
      {[...logbook].reverse().map((entry, index) => (
        <div key={index} className="bg-white/10 p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-2">Excuse from {new Date(entry.timestamp).toLocaleString()}</h3>
          <div className="space-y-2">
            <div>
              <h4 className="font-semibold">Your Excuse:</h4>
              <p className="text-white/80">{entry.excuse}</p>
            </div>
            <div>
              <h4 className="font-semibold">Your Reframe:</h4>
              <p className="text-white/80">{entry.reframe}</p>
            </div>
          </div>
        </div>
      ))}
      <Button onClick={onBack} className="w-full mt-4">
        Back to Dashboard
      </Button>
    </div>
  );
};

export default ExcuseLogbook;
