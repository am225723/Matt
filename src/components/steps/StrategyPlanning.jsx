import React from 'react';

export default function StrategyPlanning({ answers, updateAnswer }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            What's your anchor phrase or grounding technique?
          </label>
          <textarea
            value={answers.anchor || ""}
            onChange={(e) => updateAnswer("anchor", e.target.value)}
            placeholder="A phrase, breathing technique, or physical action to center yourself..."
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            What's your go-to line or response?
          </label>
          <textarea
            value={answers.line || ""}
            onChange={(e) => updateAnswer("line", e.target.value)}
            placeholder="A prepared response you can use when feeling pressured or uncertain..."
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            What's your personal mantra for this situation?
          </label>
          <textarea
            value={answers.mantra || ""}
            onChange={(e) => updateAnswer("mantra", e.target.value)}
            placeholder="A positive affirmation or reminder of your strength..."
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}