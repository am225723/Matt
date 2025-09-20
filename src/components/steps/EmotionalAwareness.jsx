import React from 'react';

export default function EmotionalAwareness({ answers, updateAnswer }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            How do you typically feel in this situation?
          </label>
          <textarea
            value={answers.feel || ""}
            onChange={(e) => updateAnswer("feel", e.target.value)}
            placeholder="Describe your emotions, physical sensations, thoughts..."
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            What thoughts usually go through your mind?
          </label>
          <textarea
            value={answers.think || ""}
            onChange={(e) => updateAnswer("think", e.target.value)}
            placeholder="What do you tell yourself? What worries come up?"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            What do you wish you could feel instead?
          </label>
          <textarea
            value={answers.desire || ""}
            onChange={(e) => updateAnswer("desire", e.target.value)}
            placeholder="How would you like to feel? What would confidence look like?"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}