import { initializeGemini, generateContent } from '../utils/gemini';

export { initializeGemini };

const YARDAGE_BOOK_SYSTEM_CONTEXT = `
You are an empathetic and supportive caddie and friend. You are talking to Matthew, who is preparing for a Ryder Cup social event. You are aware of his past struggles with alcohol and his tendency to be influenced by peer pressure and what others think. Your primary goal is to help him navigate the event without drinking, while also being mindful of his feelings and social pressures. You are a harm-reduction specialist, but your tone is that of a trusted friend and guide, not a clinician. You are warm, respectful, and non-judgmental.
`.trim();

const generateYardageBookContent = (userPrompt) => {
  return generateContent(YARDAGE_BOOK_SYSTEM_CONTEXT, userPrompt);
};

export const createActionPlan = (excuse) => {
  const prompt = `
  Matthew's excuse: "${excuse}".

  Create a concrete 3-step, harm-reduction action plan to help him avoid alcohol at the Ryder Cup day.
  - Use behavior design: If-Then, environment cues, accountability
  - Steps must be simple, doable on-course
  - Speak directly to him ("you")
  `.trim();
  return generateYardageBookContent(prompt);
};

export const simulateTomorrow = (reflection) => {
  const prompt = `
  Matthew wrote: "${reflection}".

  In 3–4 sentences, help him vividly imagine waking up tomorrow proud because he did NOT drink (or drank far less).
  - Emphasize feelings, consequences avoided, identity wins, and next-step momentum
  - Speak directly to him ("you")
  `.trim();
  return generateYardageBookContent(prompt);
};

export const highlightTriggers = (response) => {
  const prompt = `
  Reflection: "${response}".

  Identify likely alcohol triggers for a golf/spectator day (time, people, places, urges).
  Provide proactive alternatives and boundary lines to prevent drinking.
  - Keep it practical and compassionate
  - Speak directly to him ("you")
  `.trim();
  return generateYardageBookContent(prompt);
};

export const suggestMantra = (pledge) => {
  const prompt = `
  Matthew's pledge: "${pledge}".

  Craft ONE short mantra (max 10 words) that reinforces his intention NOT to drink.
  - Clear, affirmative, sticky
  - Speak directly to him ("you")
  Return just the mantra.
  `.trim();
  return generateYardageBookContent(prompt);
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
  return generateYardageBookContent(prompt);
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
  return generateYardageBookContent(prompt);
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
  return generateYardageBookContent(prompt);
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
  return generateYardageBookContent(prompt);
};

export const continueConversation = (originalContext, aiQuestion, userResponse) => {
  const prompt = `
  Context (hole answer): "${originalContext}"
  You asked: "${aiQuestion}"
  He replied: "${userResponse}"

  You are an empathetic and supportive caddie and friend. Based on his specific response, provide a personalized and realistic reply that:
  - Acknowledges what he said specifically and shows you understand his situation
  - Offers 1 actionable and specific nudge (boundary, swap, plan, check-in) that directly relates to his response
  - Provides encouragement that feels genuine and not generic
  - Speaks directly to him ("you")
  - Keep it concise but meaningful (2-3 sentences)
  
  Make your response feel like a real conversation with a trusted friend who knows him well, not like a generic AI.
  `.trim();
  return generateYardageBookContent(prompt);
};

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

  return generateYardageBookContent(prompt);
};

export const enhanceHoleWithFollowup = (holeIndex, userText) => {
  return buildHoleAwareFollowup({ holeIndex, userText });
};

export const suggestNextScenario = async (completedScenarios, allScenarios) => {
  const completedLabels = completedScenarios.map(s => s.label).join(', ');
  const availableLabels = allScenarios.filter(s => !completedScenarios.find(cs => cs.key === s.key)).map(s => s.label).join(', ');

  const prompt = `
  You are a proactive and encouraging mental coach.
  Matthew has already completed playbooks for the following scenarios: ${completedLabels}.
  The available scenarios he has not yet completed are: ${availableLabels}.

  Based on his completed work, suggest ONE new scenario from the available list that would be a good next step for him.
  Provide a brief, one-sentence reason for your suggestion.

  Return a JSON object with two keys: "scenario" (the key of the suggested scenario, e.g., "networking") and "reason" (your explanation).
  Example: {"scenario": "networking", "reason": "Since you've built confidence in presenting, networking is a great next step to apply those skills."}
  `.trim();

  const result = await generateYardageBookContent(prompt);
  try {
    const cleanResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanResult);
  } catch (error) {
    console.error("Error parsing AI suggestion:", error);
    return null;
  }
};

// Yardage Book-specific function for reframing excuses (Hole 4)
export const yardageBookReframeExcuse = (excuse) => {
  const prompt = `
  Matthew's excuse about drinking: "${excuse}".

  Analyze this excuse and reframe it into a more empowering perspective.
  - Identify the underlying concern or fear
  - Provide a supportive, non-judgmental reframing
  - Focus specifically on alcohol-related challenges at social events
  - Maintain the warm, supportive caddie tone
  - Speak directly to him ("you")
  `.trim();
  return generateYardageBookContent(prompt);
};

// Function to enhance all holes with AI insights
export const enhanceAllHoles = async (responses) => {
  const enhancedInsights = [];
  
  // Process each hole response
  for (let i = 0; i < responses.length; i++) {
    const userText = responses[i] || '';
    
    try {
      let insight;
      
      // For holes 1-3, use the existing hole-aware enhancement
      if (i <= 2) {
        insight = await enhanceHoleWithFollowup(i, userText);
      } else {
        // For other holes, create hole-specific enhancements
        switch (i) {
          case 3: // Hole 4 - The Excuse Trap
            const reframe = await yardageBookReframeExcuse(userText);
            const plan = await createActionPlan(userText);
            insight = `${reframe}\n\n${plan}`;
            break;
          case 4: // Hole 5 - Power Phrase
            insight = await suggestPowerPhrase(userText);
            break;
          case 5: // Hole 6 - Read the Green
            insight = await simulateTomorrow(userText);
            break;
          case 6: // Hole 7 - Mulligan Mindset
            insight = await highlightTriggers(userText);
            break;
          case 7: // Hole 8 - Club Swap
            insight = await suggestAlternatives(userText);
            break;
          case 8: // Hole 9 - Victory Putt
            insight = await suggestMantra(userText);
            break;
          default:
            insight = "No specific enhancement available for this hole.";
        }
      }
      
      enhancedInsights.push(insight);
    } catch (error) {
      console.error(`Error enhancing hole ${i + 1}:`, error);
      enhancedInsights.push("AI could not enhance this hole.");
    }
  }
  
  return enhancedInsights;
};

// New function for Hole 5 - Power Phrase
export const suggestPowerPhrase = (response) => {
  const prompt = `
  Matthew wrote: "${response}".

  Create a confident, memorable power phrase he can use to decline alcohol.
  - Make it natural, not awkward
  - Keep it brief (under 10 words)
  - Make it authentic to his personality
  - Speak directly to him ("you")
  `.trim();
  return generateYardageBookContent(prompt);
};

// New function for Hole 8 - Club Swap
export const suggestAlternatives = (response) => {
  const prompt = `
  Matthew wrote about non-alcoholic alternatives: "${response}".

  Expand on his ideas with 2-3 specific, appealing non-alcoholic options.
  - Be specific (brands, recipes, or presentation ideas)
  - Make them feel special and festive
  - Explain why these are great alternatives
  - Speak directly to him ("you")
  `.trim();
  return generateYardageBookContent(prompt);
};