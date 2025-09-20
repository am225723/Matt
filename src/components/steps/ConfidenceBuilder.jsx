import React from 'react';
import { Button } from "@/components/ui/button";
import { LabeledInput } from "@/components/LabeledInput";

export function ConfidenceBuilder({ answers, setAnswers, setStep }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-2 mb-1 text-black" style={{ textShadow: "0 2px 6px rgba(0,0,0,.12)" }}>
        Confidence Builder
      </h2>
      <ul className="list-disc list-inside my-4 pl-2 text-black space-y-2">
        <li>I can choose actions that support my goals.</li>
        <li>Pressure is temporary; my values are steady.</li>
        <li>My plan keeps me in control.</li>
      </ul>
      <LabeledInput
        label="My personal mantra"
        value={answers.mantra}
        onChange={(v) => setAnswers((a) => ({ ...a, mantra: v }))}
      />
      <div className="flex gap-2.5 mt-4 flex-wrap">
        <Button onClick={() => setStep(4)} variant="outline" className="border-[#e9f2f2] bg-white text-black hover:text-black">
          Back
        </Button>
        <Button onClick={() => setStep(6)} className="flex-1 bg-[#006E6D] text-black border-none hover:bg-[#006E6D]/90">
          Continue to Debrief
        </Button>
      </div>
    </div>
  );
}