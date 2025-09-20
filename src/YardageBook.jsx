import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, ArrowRight, Printer } from 'lucide-react';
import GeminiResponseDisplay, { handlePrintToPDF } from "@/components/GeminiResponseDisplay";
import ConversationThread from "@/components/ConversationThread";
import {
  reframeExcuse,
  createActionPlan,
  suggestMantra,
  simulateTomorrow,
  highlightTriggers,
  summarizeYardageBook,
  continueConversation,
  enhanceHoleWithFollowup, // ✨ new hole-aware enhancer
} from '@/utils/gemini';

const holes = [
  { title: "Hole 1 – Tee Off with Intention", prompt: "Imagine you're stepping up to the first tee. What's your clear goal for the day at the Ryder Cup?" },
  { title: "Hole 2 – Pick Your Caddie", prompt: "Who is your 'accountability buddy' on this course? Who helps you keep your swing (and drinking) steady?" },
  { title: "Hole 3 – Hydration Hazard", prompt: "Before grabbing a drink, what pre-shot routine can you do instead? (e.g., water, breath, snack, stretch)" },
  { title: "Hole 4 – The Excuse Trap", prompt: "What's one excuse you’ll probably hear in your head — and let’s chip it into something stronger with AI." },
  { title: "Hole 5 – Power Phrase", prompt: "Craft a confident 'no thanks' you can pull out like a reliable 7-iron." },
  { title: "Hole 6 – Read the Green", prompt: "Visualize tomorrow morning. What do you want to remember about how you played your day?" },
  { title: "Hole 7 – Mulligan Mindset", prompt: "If you slice one (slip up), how will you reset and stay in the game with self-respect?" },
  { title: "Hole 8 – Club Swap", prompt: "Name two 'clubs' in your bag that feel festive *without* being alcohol — fun alternates." },
  { title: "Hole 9 – Victory Putt", prompt: "Seal the round: What’s your personal pledge or mantra that keeps you focused through the final hole?" }
];

const YardageBook = ({ onBack }) => {
  const [holeIndex, setHoleIndex] = useState(0);

  // Use Array.from to avoid shared reference bugs
  const [responses, setResponses] = useState(Array.from({ length: holes.length }, () => ''));
  const [conversations, setConversations] = useState(Array.from({ length: holes.length }, () => [])); // per-hole list of threads; each thread is an array of {type,text}
  const [activeThreadIndexByHole, setActiveThreadIndexByHole] = useState(Array.from({ length: holes.length }, () => null));

  // Other AI outputs
  const [reframed, setReframed] = useState('');
  const [plan, setPlan] = useState('');
  const [mantra, setMantra] = useState('');
  const [forecast, setForecast] = useState('');
  const [triggers, setTriggers] = useState('');
  const [insight, setInsight] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const current = holes[holeIndex];

  const updateResponse = (text) => {
    const updated = [...responses];
    updated[holeIndex] = text;
    setResponses(updated);
  };

  const resetAIStates = () => {
    setReframed('');
    setPlan('');
    setMantra('');
    setForecast('');
    setTriggers('');
    setInsight('');
    setActiveThreadIndexByHole(prev => {
      const next = [...prev];
      next[holeIndex] = null;
      return next;
    });
  };

  const handleNextHole = () => {
    if (holeIndex < holes.length - 1) {
      resetAIStates();
      setHoleIndex(holeIndex + 1);
    }
  };

  const handlePreviousHole = () => {
    if (holeIndex > 0) {
      resetAIStates();
      setHoleIndex(holeIndex - 1);
    }
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    setSummary('');
    try {
      const fullSummary = await summarizeYardageBook(responses);
      setSummary(fullSummary);
    } catch {
      setSummary('AI could not generate a summary.');
    }
    setLoading(false);
  };

  // Create a new thread when response ends with '?' (conversation starter). Optionally mark as "insight thread".
  const processAIResponse = (setter, response, { markInsightThread = false } = {}) => {
    const text = (response || '').trim();
    if (text.endsWith('?')) {
      setConversations(prev => {
        const updated = prev.map(arr => arr); // shallow clone
        const newThread = [{ type: 'ai', text }];
        const holeThreads = [...updated[holeIndex], newThread];
        updated[holeIndex] = holeThreads;

        const newIdx = holeThreads.length - 1;
        if (markInsightThread) {
          setActiveThreadIndexByHole(prevIdx => {
            const copy = [...prevIdx];
            copy[holeIndex] = newIdx;
            return copy;
          });
        }
        return updated;
      });
      setter(''); // hide plain text; the conversation UI will show it
    } else {
      setter(text);
      if (markInsightThread) {
        setActiveThreadIndexByHole(prevIdx => {
          const copy = [...prevIdx];
          copy[holeIndex] = null;
          return copy;
        });
      }
    }
  };

  const handleFollowUpSubmit = async (answer, threadIndex) => {
    if (!answer) return;
    setLoading(true);

    const updated = conversations.map(arr => arr);
    const currentThread = [...updated[holeIndex][threadIndex]];
    const originalContext = responses[holeIndex];
    const aiQuestion = currentThread.find(msg => msg.type === 'ai')?.text || "";

    currentThread.push({ type: 'user', text: answer });

    try {
      const finalResponse = await continueConversation(originalContext, aiQuestion, answer);
      currentThread.push({ type: 'ai', text: finalResponse });
    } catch {
      currentThread.push({ type: 'ai', text: 'AI could not process the follow-up.' });
    }

    updated[holeIndex][threadIndex] = currentThread;
    setConversations(updated);
    setLoading(false);
  };

  // 🔁 Reset the active insight thread (and clear the insight text)
  const handleResetInsightThread = () => {
    const idx = activeThreadIndexByHole[holeIndex];
    setConversations(prev => {
      const updated = prev.map(arr => arr);
      const threads = [...updated[holeIndex]];
      if (idx != null && idx > -1 && idx < threads.length) {
        threads.splice(idx, 1);
        updated[holeIndex] = threads;
      }
      return updated;
    });
    setActiveThreadIndexByHole(prev => {
      const next = [...prev];
      next[holeIndex] = null;
      return next;
    });
    setInsight('');
  };

  // ✨ Hole-aware enhancement for Holes 1–3: ask a short, targeted question
  const handleAIEnhance = async () => {
    setLoading(true);
    setInsight('');
    try {
      const userText = responses[holeIndex] || '';

      if (holeIndex === 0 || holeIndex === 1 || holeIndex === 2) {
        const result = await enhanceHoleWithFollowup(holeIndex, userText);
        processAIResponse(setInsight, result, { markInsightThread: true });
      } else {
        // (Optional) keep your other behaviors for non 1–3 holes, or expand hole-aware later
        setInsight(''); // no-op display for now
      }
    } catch {
      setInsight('AI could not add more insight.');
    }
    setLoading(false);
  };

  const handleReframe = async () => {
    setLoading(true);
    setReframed('');
    setPlan('');
    try {
      const reframe = await reframeExcuse(responses[holeIndex]);
      processAIResponse(setReframed, reframe);
      if (!String(reframe || '').trim().endsWith('?')) {
        const followUp = await createActionPlan(responses[holeIndex]);
        processAIResponse(setPlan, followUp);
      }
    } catch {
      setReframed('Something went wrong. Try again.');
      setPlan('');
    }
    setLoading(false);
  };

  const handleForecast = async () => {
    setLoading(true);
    setForecast('');
    try {
      const result = await simulateTomorrow(responses[holeIndex]);
      processAIResponse(setForecast, result);
    } catch {
      setForecast('Could not simulate tomorrow.');
    }
    setLoading(false);
  };

  const handleTriggers = async () => {
    setLoading(true);
    setTriggers('');
    try {
      const result = await highlightTriggers(responses[holeIndex]);
      processAIResponse(setTriggers, result);
    } catch {
      setTriggers('Could not detect common triggers.');
    }
    setLoading(false);
  };

  const handleMantra = async () => {
    setLoading(true);
    setMantra('');
    try {
      const result = await suggestMantra(responses[holeIndex]);
      processAIResponse(setMantra, result);
    } catch {
      setMantra('Could not generate mantra.');
    }
    setLoading(false);
  };

  const activeThreadIndex = activeThreadIndexByHole[holeIndex];
  const activeThread = activeThreadIndex != null
    ? conversations[holeIndex]?.[activeThreadIndex]
    : null;

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-primary text-center">⛳ Ryder Cup Yardage Caddie</h2>
      <h3 className="text-lg font-semibold text-center">{current.title}</h3>
      <p className="text-muted-foreground text-center">{current.prompt}</p>

      <Textarea
        value={responses[holeIndex]}
        onChange={(e) => updateResponse(e.target.value)}
        placeholder="Jot down your strategy..."
        rows={4}
      />

      {/* 💡 Holes 1–3: AI Insight card WITH embedded conversation box if a follow-up question was asked */}
      {(holeIndex === 0 || holeIndex === 1 || holeIndex === 2) && (
        <div className="space-y-3">
          <Button onClick={handleAIEnhance} className="w-full" disabled={loading}>
            💡 Enhance This Hole with AI
          </Button>

          <GeminiResponseDisplay title="💡 AI Caddie's Insight" responseText={insight}>
            {activeThread && (
              <>
                <div className="text-xs text-white/60 pl-1">
                  Guide for this hole: <span className="opacity-90">{holes[holeIndex].prompt}</span>
                </div>

                <ConversationThread
                  conversation={activeThread}
                  onSubmit={(answer) => handleFollowUpSubmit(answer, activeThreadIndex)}
                  loading={loading}
                />

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetInsightThread}
                    disabled={loading}
                    className="text-xs"
                  >
                    Reset Insight Thread
                  </Button>
                </div>
              </>
            )}
          </GeminiResponseDisplay>
        </div>
      )}

      {/* Hole 4: Reframe + Plan */}
      {holeIndex === 3 && (
        <div className="space-y-3">
          <Button onClick={handleReframe} className="w-full flex items-center justify-center" disabled={loading}>
            <Sparkles className="mr-2 h-4 w-4" /> {loading ? 'Working with your mental caddie...' : 'AI Reframe + Plan'}
          </Button>
          {reframed && <GeminiResponseDisplay title="🏌️ Reframed Excuse" responseText={reframed} />}
          {plan && <GeminiResponseDisplay title="📝 Game Plan" responseText={plan} />}
        </div>
      )}

      {/* Other helpers */}
      {holeIndex === 5 && (
        <div className="space-y-3">
          <Button onClick={handleForecast} className="w-full" disabled={loading}>
            🔮 Preview Tomorrow’s Feeling
          </Button>
          {forecast && <GeminiResponseDisplay title="🔮 Tomorrow's Forecast" responseText={forecast} />}
        </div>
      )}

      {holeIndex === 6 && (
        <div className="space-y-3">
          <Button onClick={handleTriggers} className="w-full" disabled={loading}>
            🚩 Identify Likely Triggers
          </Button>
          {triggers && <GeminiResponseDisplay title="🚩 Potential Triggers" responseText={triggers} />}
        </div>
      )}

      {holeIndex === 8 && (
        <div className="space-y-3">
          <Button onClick={handleMantra} className="w-full" disabled={loading}>
            💬 Generate Mantra
          </Button>
          {mantra && <GeminiResponseDisplay title="💬 Your Mantra" responseText={mantra} />}
        </div>
      )}

      {/* Render other threads (skip the active one displayed inside the card) */}
      {conversations[holeIndex]?.map((thread, i) => {
        if (i === activeThreadIndex) return null;
        return (
          <ConversationThread
            key={i}
            conversation={thread}
            onSubmit={(answer) => handleFollowUpSubmit(answer, i)}
            loading={loading}
          />
        );
      })}

      <div className="flex justify-between pt-4 flex-wrap gap-2">
        <Button variant="outline" onClick={handlePreviousHole} disabled={holeIndex === 0}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous Hole
        </Button>
        {holeIndex < holes.length - 1 ? (
          <Button onClick={handleNextHole}>
            Next Hole <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <>
            <Button onClick={handleGenerateSummary} disabled={loading}>🧠 Generate AI Summary</Button>
            <Button onClick={() => handlePrintToPDF(responses, summary)} className="bg-blue-600 text-white">
              <Printer className="w-4 h-4 mr-2" /> Export My Yardage Book
            </Button>
          </>
        )}
      </div>

      {holeIndex === holes.length - 1 && (
        <Button onClick={onBack} className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white">
          🏁 Finish Round & Go to Dashboard
        </Button>
      )}

      {loading && holeIndex === holes.length - 1 && !summary && (
        <p className="text-sm text-center">AI Caddie is drafting the summary...</p>
      )}

      {summary && <GeminiResponseDisplay title="⭐ Your Final Yardage Book Summary" responseText={summary} />}
    </div>
  );
};

export default YardageBook;