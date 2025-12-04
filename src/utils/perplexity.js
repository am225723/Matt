const BACKEND_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : '';

export const initializePerplexity = (key) => {
  return true;
};

export const generateContent = async (systemContext, userPrompt, temperature = 0.2) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/perplexity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemContext,
        userPrompt,
        temperature
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error calling Perplexity API:", error);
    throw new Error("Failed to get a response from AI. Please try again.");
  }
};
