import { generateContent } from '../utils/perplexity';

const EXCUSE_REFRAME_SYSTEM_CONTEXT = `
You are a pragmatic and direct problem-solving assistant. Your purpose is to analyze an excuse and provide a realistic, actionable solution to prevent the excuse from being used again. You do not provide emotional support; you provide solutions. Your response should be a direct, no-nonsense plan.
`.trim();

export const reframeExcuse = (excuse) => {
  const prompt = `
The user has provided the following excuse: "${excuse}".

Analyze the underlying problem behind this excuse and provide a concrete, step-by-step solution to eliminate the possibility of this excuse being used in the future. The solution should be realistic and actionable.
  `.trim();
  return generateContent(EXCUSE_REFRAME_SYSTEM_CONTEXT, prompt);
};
