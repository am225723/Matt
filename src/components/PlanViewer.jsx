import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { dec } from '@/utils/helpers';
import { pickBg, labelFor } from '@/utils/scenarioHelpers';

export default function PlanViewer() {
  const [plan, setPlan] = useState(null);
  const location = useLocation();

  const [isMinimized, setIsMinimized] = React.useState(false);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key.toLowerCase() === "m") setIsMinimized(v => !v); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const hash = location.hash.match(/plan=([^&]+)/)?.[1];
    if (hash) {
      const data = dec(hash);
      if (data) {
        setPlan(data);
      }
    }
  }, [location.hash]);

  const bgUrl = useMemo(() => (plan ? pickBg(plan.scenario) : null), [plan]);

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Loading Plan...</h1>
          <p className="text-gray-600">If your plan doesn't load, please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  const { scenario, why, goal, limit, anchor, line, ally, allyPhone, mantra, ts } = plan;

  return (
    <div
      className="min-h-screen relative p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgUrl})`, backgroundAttachment: 'fixed' }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
       <button
        onClick={() => setIsMinimized(v => !v)}
        style={{
          position: "fixed", top: 12, right: 12, zIndex: 9999,
          background: "rgba(255,255,255,.9)", color: "#111",
          border: "1px solid rgba(0,0,0,.15)", borderRadius: 999,
          padding: "8px 12px", cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,.18)"
        }}
        aria-label={isMinimized ? "Show panel (M)" : "Hide panel (M)"}
        title={isMinimized ? "Show panel (M)" : "Hide panel (M)"}
      >
        {isMinimized ? "Show Panel" : "Hide Panel"}
      </button>

      {!isMinimized && (
         <div className="relative max-w-2xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/50">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Resilience Plan: <span className="text-[#006E6D]">{labelFor(scenario)}</span>
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Created on: {new Date(ts).toLocaleString()}
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold border-b-2 border-[#006E6D]/50 pb-2 mb-3 text-gray-700">My Why</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-800">
                {why?.feel && <li><strong>Before, I feel:</strong> {why.feel}</li>}
                {why?.think && <li><strong>Trigger thought:</strong> {why.think}</li>}
                {why?.desire && <li><strong>In the moment, I want:</strong> {why.desire}</li>}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b-2 border-[#006E6D]/50 pb-2 mb-3 text-gray-700">My Toolkit</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-800">
                {goal && <li><strong>Goal:</strong> {goal}</li>}
                {limit && <li><strong>Limit/Focus:</strong> {limit}</li>}
                {anchor && <li><strong>Anchor/Decoy:</strong> {anchor}</li>}
                {line && <li><strong>My Line:</strong> "{line}"</li>}
                {ally && <li><strong>Ally:</strong> {ally} {allyPhone && `(${allyPhone})`}</li>}
              </ul>
            </section>

            {mantra && (
              <section>
                <h2 className="text-xl font-semibold border-b-2 border-[#006E6D]/50 pb-2 mb-3 text-gray-700">My Mantra</h2>
                <p className="text-lg italic text-center py-4 px-6 bg-[#006E6D]/10 rounded-lg text-[#004D4C]">"{mantra}"</p>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}