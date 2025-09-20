import React from 'react';

export default function SupportSystem({ answers, updateAnswer }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Who is your ally or support person?
          </label>
          <textarea
            value={answers.ally || ""}
            onChange={(e) => updateAnswer("ally", e.target.value)}
            placeholder="Someone you can talk to before, during, or after this situation..."
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Their contact information (optional):
          </label>
          <input
            type="text"
            value={answers.allyPhone || ""}
            onChange={(e) => updateAnswer("allyPhone", e.target.value)}
            placeholder="Phone number, email, or how to reach them..."
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
          />
        </div>
      </div>
    </div>
  );
}