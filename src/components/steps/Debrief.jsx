import React from 'react';
import { Button } from "@/components/ui/button";
import { LabeledInput } from "@/components/LabeledInput";

export function Debrief({
  answers,
  setAnswers,
  setStep,
  onSave,
  onShare,
  onExportPdf,
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-2 mb-1 text-black" style={{ textShadow: "0 2px 6px rgba(0,0,0,.12)" }}>
        Post-Event Debrief
      </h2>
      <p className="mb-4 text-black">
        Reflect on the experience to refine your approach for next time.
      </p>
      <LabeledInput
        label="One thing I’m proud of…"
        value={answers.proud}
        onChange={(v) => setAnswers((a) => ({ ...a, proud: v }))}
      />
      <LabeledInput
        label="One thing I’ll tweak next time…"
        value={answers.tweak}
        onChange={(v) => setAnswers((a) => ({ ...a, tweak: v }))}
      />
      <div className="flex gap-2.5 mt-4 flex-wrap">
        <Button onClick={() => setStep(5)} variant="outline" className="border-[#e9f2f2] bg-white text-black hover:text-black">
          Back
        </Button>
        <Button onClick={onExportPdf} className="flex-1 bg-[#006E6D] text-black border-none hover:bg-[#006E6D]/90">
          Export PDF
        </Button>
        <Button onClick={onSave} variant="secondary" className="flex-1 border-[#e9f2f2] bg-white text-black hover:text-black">
          Save & Download JSON
        </Button>
        <Button onClick={onShare} variant="secondary" className="flex-1 border-[#e9f2f2] bg-white text-black hover:text-black">
          Share Plan
        </Button>
        <Button onClick={() => setStep(1)} variant="secondary" className="flex-1 border-[#e9f2f2] bg-white text-black hover:text-black">
          Plan Another
        </Button>
      </div>
    </div>
  );
}