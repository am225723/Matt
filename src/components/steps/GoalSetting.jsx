import React from 'react';

export default function GoalSetting({ answers, updateAnswer }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            What's your main goal for this scenario?
          </label>
          <textarea
            value={answers.goal || ""}
            onChange={(e) => updateAnswer("goal", e.target.value)}
            placeholder="What do you want to achieve? Be specific and realistic..."
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            What are your limits or boundaries?
          </label>
          <textarea
            value={answers.limit || ""}
            onChange={(e) => updateAnswer("limit", e.target.value)}
            placeholder="What won't you compromise on? What are your non-negotiables?"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}