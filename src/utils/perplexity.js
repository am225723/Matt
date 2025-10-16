import { Perplexity } from 'perplexityai';

let perplexity;

export const initializePerplexity = (apiKey) => {
  if (!apiKey) {
    console.error("Perplexity API key is missing.");
    return false;
  }
  if (!perplexity) {
    perplexity = new Perplexity(apiKey);
  }
  return true;
};

const getClient = () => {
  if (!perplexity) {
    throw new Error("Perplexity AI is not initialized. Please provide an API key.");
  }
  return perplexity;
};

export const generateContent = async (systemContext, userPrompt) => {
  const client = getClient();
  try {
    const completion = await client.chat.completions.create({
      model: "sonar-pro",
      messages: [
        { role: "system", content: systemContext },
        { role: "user", content: userPrompt }
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Perplexity API:", error);
    throw new Error("Failed to get a response from Perplexity.");
  }
};
