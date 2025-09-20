// gemini.js — alcohol-prevention aware prompts (drop-in replacement)
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI;

export const initializeGemini = (apiKey) => {
  if (!apiKey) {
    console.error("Gemini API key is missing.");
    return false;
  }
  genAI = new GoogleGenerativeAI(apiKey);
  return true;
};

const getModel = () => {
  if (!genAI) {
    throw new Error("Gemini AI is not initialized. Please provide an API key.");
  }
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

const SYSTEM_CONTEXT = `
You are a world-class mental coach and harm-reduction specialist.
Primary objective: Help Matthew avoid drinking alcohol (or at minimum, significantly reduce it) at a social/golf event (Ryder Cup day).
Tone: warm, respectful, non-judgmental, practical. Evidence-informed behavior design.
Priorities: clear intention, pre-commitment, coping plans, trigger awareness, supportive accountability, self-compassion after slips.
Never moralize. Avoid medical claims. Keep outputs concise and directly usable.
`.trim();

const generateContent = async (userPrompt) => {
  const prompt = `${SYSTEM_CONTEXT}\n\n${userPrompt}`;
  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from Gemini.");
  }
};

/* =========================
   Core helpers (unchanged names, prevention-aware content)
   ========================= */

export const reframeExcuse = (excuse) => {
  const prompt = `
Matthew shared this likely excuse regarding alcohol: "${excuse}".

Reframe it with warmth and harm-reduction focus to help him not drink (or drink less) that day.
- Speak directly to him ("you")
- Keep it concise (≤ 90 words)
- End with a supportive statement (no questions)
  `.trim();
  return generateContent(prompt);
};

export const createActionPlan = (excuse) => {
  const prompt = `
Matthew's excuse: "${excuse}".

Create a concrete 3-step, harm-reduction action plan to help him avoid alcohol at the Ryder Cup day.
- Use behavior design: If-Then, environment cues, accountability
- Steps must be simple, doable on-course
- Speak directly to him ("you")
  `.trim();
  return generateContent(prompt);
};

export const simulateTomorrow = (reflection) => {
  const prompt = `
Matthew wrote: "${reflection}".

In 3–4 sentences, help him vividly imagine waking up tomorrow proud because he did NOT drink (or drank far less).
- Emphasize feelings, consequences avoided, identity wins, and next-step momentum
- Speak directly to him ("you")
  `.trim();
  return generateContent(prompt);
};

export const highlightTriggers = (response) => {
  const prompt = `
Reflection: "${response}".

Identify likely alcohol triggers for a golf/spectator day (time, people, places, urges).
Provide proactive alternatives and boundary lines to prevent drinking.
- Keep it practical and compassionate
- Speak directly to him ("you")
  `.trim();
  return generateContent(prompt);
};

export const suggestMantra = (pledge) => {
  const prompt = `
Matthew's pledge: "${pledge}".

Craft ONE short mantra (max 10 words) that reinforces his intention NOT to drink.
- Clear, affirmative, sticky
- Speak directly to him ("you")
Return just the mantra.
  `.trim();
  return generateContent(prompt);
};

export const deepenIntention = (goal) => {
  const prompt = `
Matthew's goal for the day: "${goal}".

Briefly connect this goal to his values/identity, specifically about not drinking alcohol.
If useful, ask ONE precise clarifying question to strengthen commitment (≤ 18 words).
- Keep to 2–4 sentences total
- Speak directly to him ("you")
If you ask a question, end with a single '?'.
  `.trim();
  return generateContent(prompt);
};

export const suggestCheckInPartner = (text) => {
  const prompt = `
Entry: "${text}".

Recommend a specific type of check-in partner (friend/family/role model) who will support NOT drinking.
Explain briefly how/when to check in (before first trigger, mid-event, after).
- 2–3 sentences
- Speak directly to him ("you")
If a question is needed, end with ONE '?'.
  `.trim();
  return generateContent(prompt);
};

export const suggestPauseAction = (response) => {
  const prompt = `
Matthew plans to pause before alcohol; he wrote: "${response}".

Suggest ONE discreet, on-course pause technique (e.g., breath pattern, grounding, water-first ritual, short walk) to prevent drinking.
Include when to use it and a tiny script if needed.
- 2–3 sentences
- Speak directly to him ("you")
If a question is needed, end with ONE '?'.
  `.trim();
  return generateContent(prompt);
};

export const summarizeYardageBook = (responses) => {
  const prompt = `
These are Matthew's 9 Ryder Cup prep responses (by hole):
${responses.map((r, i) => `Hole ${i + 1}: ${r || ""}`).join("\n")}

Write a warm, motivational summary as his caddie with a harm-reduction focus (prevent drinking).
- Reinforce identity and concrete commitment
- Mention accountability and coping if urges rise
- Speak directly to him ("you")
- 140–220 words
  `.trim();
  return generateContent(prompt);
};

export const continueConversation = (originalContext, aiQuestion, userResponse) => {
  const prompt = `
Context (hole answer): "${originalContext}"
You asked: "${aiQuestion}"
He replied: "${userResponse}"

Now provide ONE concise, encouraging response that moves him closer to NOT drinking.
- Offer 1 actionable nudge (boundary, swap, plan, check-in)
- Do NOT ask another question
- Speak directly to him ("you")
  `.trim();
  return generateContent(prompt);
};

/* =========================
   Hole-aware follow-ups (new)
   ========================= */

const HOLE_META = [
  { id: 1, key: "intention", title: "Hole 1 – Tee Off with Intention", prompt: "Set a clear goal for the day at the Ryder Cup to avoid alcohol." },
  { id: 2, key: "ally",      title: "Hole 2 – Pick Your Caddie",       prompt: "Choose an accountability buddy who helps you not drink." },
  { id: 3, key: "pause",     title: "Hole 3 – Hydration Hazard",        prompt: "Define a pre-shot routine that replaces reaching for alcohol." },
];

export const buildHoleAwareFollowup = async ({ holeIndex, userText }) => {
  const hole = HOLE_META[holeIndex];
  const metaTitle = hole?.title || `Hole ${holeIndex + 1}`;
  const metaPrompt = hole?.prompt || "Improve your response to prevent drinking.";

  const prompt = `
You're helping Matthew improve his answer so he avoids alcohol at the event.

Hole: "${metaTitle}"
Hole focus: "${metaPrompt}"
Matthew's current text: "${userText}"

TASK:
- Ask ONE short, highly targeted follow-up question (max 18 words).
- Must directly support NOT drinking (intention, ally, pause routine).
- Speak directly to him ("you"). End with a single '?'.
Return ONLY the question.
  `.trim();

  return generateContent(prompt);
};

// Public entry used by YardageBook "Enhance with AI"
export const enhanceHoleWithFollowup = (holeIndex, userText) => {
  return buildHoleAwareFollowup({ holeIndex, userText });
};