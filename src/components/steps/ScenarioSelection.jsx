import React from 'react';
import { Button } from "@/components/ui/button";
export function ScenarioSelection({
  scenarios,
  activeScenario,
  setScenario,
  hasSaved,
  onContinue,
  onResume
}) {
  return <div>
      <h1 className="text-3xl font-bold mt-2 mb-2 text-black" style={{
      textShadow: "0 2px 8px rgba(0,0,0,.15)"
    }}>Matthew's Resilience Playbook</h1>
      <p className="mb-4 text-black">Choose a scenario. The background will update so you can rehearse in context. The background change is based on which playbook you use. Remember to hit the high Panda button to take a look at the photo. Hope you like it! </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2.5 my-4">
        {scenarios.map(s => <Button key={s.key} variant={activeScenario === s.key ? "default" : "outline"} onClick={() => setScenario(s.key)} className={`justify-start gap-2 h-auto py-3 border-[#e9f2f2] text-left ${activeScenario === s.key ? "bg-[#006E6D] text-white hover:bg-[#006E6D]/90" : "bg-white text-black hover:text-black hover:bg-white/80"}`}>
            <span className="text-xl">{s.emoji}</span>
            {s.label}
          </Button>)}
      </div>
      <div className="flex gap-2.5 mt-4 flex-wrap">
        <Button onClick={onContinue} className="flex-1 bg-[#006E6D] text-black border-none hover:bg-[#006E6D]/90">
          Continue
        </Button>
        {hasSaved && <Button onClick={onResume} variant="secondary" className="flex-1 border-[#e9f2f2] bg-white text-black hover:text-black">
            Resume last plan
          </Button>}
      </div>
    </div>;
}