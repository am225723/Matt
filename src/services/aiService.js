/**
 * AI Service for Ketamine Question Bank Application
 * Handles AI follow-up question generation using OpenAI's Chat Completions API.
 */
class AIService {
  /**
   * Generates a follow-up question based on the user's response only.
   * @param {string} response - The user's transcribed response.
   * @returns {Promise<string>} A promise that resolves with the AI-generated follow-up question.
   */
  async generateFollowUpQuestion(response) {
    return AIService.generateFollowUp('', response);
  }

  /**
   * Generates a follow-up question based on the original question and the user's response.
   * @param {string} question - The original question.
   * @param {string} response - The user's transcribed response.
   * @returns {Promise<string>} A promise that resolves with the AI-generated follow-up question.
   */
  static async generateFollowUp(question, response) {
    // IMPORTANT: In a real-world application, you should NEVER expose your API key
    // on the client side. This API call should be made from a secure backend server
    // or a serverless function that holds the API key securely.
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    const apiEndpoint = 'https://api.perplexity.ai/chat/completions';

    if (!apiKey) {
      throw new Error("Perplexity API key is not set in the .env file.");
    }

    const systemPrompt = `
      You are a compassionate and insightful AI assistant for ketamine therapy journaling.
      Your role is to help the user explore their thoughts and feelings more deeply.
      After the user answers a reflection question, your task is to ask a gentle, open-ended,
      and non-judgmental follow-up question. This question should encourage further introspection
      and help the user explore the root of their feelings. Do not give advice or opinions.
      Only ask one single follow-up question. Keep the question relatively short.
    `;

    const userPrompt = question 
      ? `
      The reflection question was: "${question}"
      My response was: "${response}"

      Now, please provide a gentle follow-up question.
    `
      : `
      My response was: "${response}"

      Now, please provide a gentle follow-up question to help me explore my thoughts more deeply.
    `;

    const requestBody = {
      model: 'sonar-medium-8x7b-chat',
      messages: [
        { role: 'system', content: systemPrompt.trim() },
        { role: 'user', content: userPrompt.trim() },
      ],
      temperature: 0.7,
      max_tokens: 60,
    };

    try {
      const apiResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(`API request failed: ${errorData.error.message}`);
      }

      const data = await apiResponse.json();
      const followUp = data.choices[0]?.message?.content?.trim() || "Could not generate a follow-up. How does that make you feel?";
      return followUp;
    } catch (error) {
      console.error('Error generating AI follow-up:', error);
      throw error;
    }
  }
}

export default AIService;
