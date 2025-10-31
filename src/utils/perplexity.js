let apiKey = null;

export const initializePerplexity = (key) => {
  if (!key) {
    console.error("Perplexity API key is missing.");
    return false;
  }
  apiKey = key;
  return true;
};

export const generateContent = async (systemContext, userPrompt) => {
  if (!apiKey) {
    throw new Error("Perplexity AI is not initialized. Please provide an API key.");
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          { role: 'system', content: systemContext },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Perplexity API:", error);
    throw new Error("Failed to get a response from Perplexity.");
  }
};
