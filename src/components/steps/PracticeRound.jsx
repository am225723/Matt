import React from 'react';
import { Button } from "@/components/ui/button";

export function PracticeRound({ setStep, label }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-2 mb-1 text-black" style={{ textShadow: "0 2px 6px rgba(0,0,0,.12)" }}>
        Practice Round
      </h2>
      <p className="mb-4 text-black">
        You're in the high-pressure moment: <b className="font-semibold">{label}</b>. Pick a response
        style to rehearse:
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5 my-4">
        <Button onClick={() => setStep(5)} variant="outline" className="h-auto py-3 border-[#e9f2f2] bg-white text-black text-left hover:text-black">
          Direct & Positive
        </Button>
        <Button onClick={() => setStep(5)} variant="outline" className="h-auto py-3 border-[#e9f2f2] bg-white text-black text-left hover:text-black">
          Gentle Redirection
        </Button>
        <Button onClick={() => setStep(5)} variant="outline" className="h-auto py-3 border-[#e9f2f2] bg-white text-black text-left hover:text-black">
          Honest & Firm
        </Button>
      </div>
      <div className="flex gap-2.5 mt-4 flex-wrap">
        <Button onClick={() => setStep(3)} variant="outline" className="border-[#e9f2f2] bg-white text-black hover:text-black">
          Back
        </Button>
        <Button onClick={() => setStep(5)} className="flex-1 bg-[#006E6D] text-black border-none hover:bg-[#006E6D]/90">
          Continue to Confidence Builder
        </Button>
      </div>
    </div>
  );
}