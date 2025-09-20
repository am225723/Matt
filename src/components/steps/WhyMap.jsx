import React from 'react';
import { Button } from "@/components/ui/button";
import { LabeledInput } from "@/components/LabeledInput";

export function WhyMap({
  answers,
  setAnswers,
  setStep,
  helperText,
  aiSuggestions,
  labelForScenario,
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-2 mb-1 text-black" style={{ textShadow: "0 2px 6px rgba(0,0,0,.12)" }}>
        Why Map
      </h2>
      <p className="mb-2 text-black">
        Place yourself in the scene. Answer honestly — this is private.
      </p>
      <div className="p-3 my-2 text-sm opacity-95 text-black">{helperText}</div>
      <LabeledInput
        label="Before the event, I feel…"
        value={answers.feel}
        onChange={(v) => setAnswers((a) => ({ ...a, feel: v }))}
      />
      <LabeledInput
        label="Right before I slip, I think…"
        value={answers.think}
        onChange={(v) => setAnswers((a) => ({ ...a, think: v }))}
      />
      <LabeledInput
        label="In that moment, I want to…"
        value={answers.desire}
        onChange={(v) => setAnswers((a) => ({ ...a, desire: v }))}
      />
      {aiSuggestions.length > 0 && (
        <div className="border border-dashed border-[#e2eeee] rounded-xl p-2.5 bg-white/[.72] my-2 text-black">
          <p className="text-sm font-semibold mb-1.5">
            Helper options for {labelForScenario}
          </p>
          <ul className="list-disc list-inside text-sm">
            {aiSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex gap-2.5 mt-4 flex-wrap">
        <Button onClick={() => setStep(1)} variant="outline" className="border-[#e9f2f2] bg-white text-black hover:text-black">
          Back
        </Button>
        <Button onClick={() => setStep(3)} className="flex-1 bg-[#006E6D] text-black border-none hover:bg-[#006E6D]/90">
          Continue to Toolkit
        </Button>
      </div>
    </div>
  );
}