import React from 'react';
import { Button } from "@/components/ui/button";
import { LabeledInput } from "@/components/LabeledInput";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function Toolkit({
  answers,
  setAnswers,
  setStep,
  helperText,
  allyMsg,
  setAllyMsg,
  onComposeSMS,
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-2 mb-1 text-black" style={{ textShadow: "0 2px 6px rgba(0,0,0,.12)" }}>
        Your Toolkit
      </h2>
      <p className="text-sm mb-2 opacity-90 text-black">
        <b>Before:</b> intention • anchor/decoy • limit/focus
        <br />
        <b>During:</b> 3 in-moment actions
        <br />
        <b>After:</b> 1 win + 1 tweak
      </p>
      <div className="p-3 my-2 text-sm opacity-95 text-black">{helperText}</div>
      <LabeledInput
        label="My goal"
        value={answers.goal}
        onChange={(v) => setAnswers((a) => ({ ...a, goal: v }))}
      />
      <LabeledInput
        label="Limit / Focus"
        value={answers.limit}
        onChange={(v) => setAnswers((a) => ({ ...a, limit: v }))}
      />
      <LabeledInput
        label="Anchor / Decoy"
        value={answers.anchor}
        onChange={(v) => setAnswers((a) => ({ ...a, anchor: v }))}
      />
      <LabeledInput
        label="Line / Boundary"
        value={answers.line}
        onChange={(v) => setAnswers((a) => ({ ...a, line: v }))}
      />
      <LabeledInput
        label="Ally (name)"
        value={answers.ally}
        onChange={(v) => setAnswers((a) => ({ ...a, ally: v }))}
      />
      <LabeledInput
        label="Ally phone (for SMS)"
        value={answers.allyPhone}
        onChange={(v) => setAnswers((a) => ({ ...a, allyPhone: v }))}
      />
      <div className="grid gap-2 my-3">
        <Label htmlFor="ally-msg" className="text-base text-black">
          Optional note for ally
        </Label>
        <Textarea
          id="ally-msg"
          value={allyMsg}
          onChange={(e) => setAllyMsg(e.target.value)}
          placeholder="e.g., Feeling a bit off, could use a quick check-in later."
        />
      </div>
      <div className="flex gap-2.5 mt-4 flex-wrap">
        <Button onClick={() => setStep(2)} variant="outline" className="border-[#e9f2f2] bg-white text-black hover:text-black">
          Back
        </Button>
        <Button onClick={onComposeSMS} variant="secondary" className="border-[#e9f2f2] bg-white text-black hover:text-black">
          Text my ally
        </Button>
        <Button onClick={() => setStep(4)} className="flex-1 bg-[#006E6D] text-black border-none hover:bg-[#006E6D]/90">
          Practice
        </Button>
      </div>
    </div>
  );
}