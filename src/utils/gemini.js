import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI;

export const initializeGemini = (apiKey) => {
  if (!apiKey) {
    console.error("Gemini API key is missing.");
    return false;
  }
  // Initialize with the same key, but don't overwrite the instance if it exists
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return true;
};

const getModel = () => {
  if (!genAI) {
    throw new Error("Gemini AI is not initialized. Please provide an API key.");
  }
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

export const generateContent = async (systemContext, userPrompt) => {
  const prompt = `${systemContext}\n\n${userPrompt}`;
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