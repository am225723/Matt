const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const USE_EDGE_FUNCTIONS = true;

const LOCAL_BACKEND_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : '';

export const initializePerplexity = (key) => {
  return true;
};

export const generateContent = async (systemContext, userPrompt, temperature = 0.2) => {
  try {
    let response;
    
    if (USE_EDGE_FUNCTIONS && SUPABASE_URL && SUPABASE_ANON_KEY) {
      response = await fetch(`${SUPABASE_URL}/functions/v1/perplexity-ai`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemContext,
          userPrompt,
          temperature
        })
      });
    } else {
      response = await fetch(`${LOCAL_BACKEND_URL}/api/perplexity`, {
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
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error calling AI API:", error);
    throw new Error("Failed to get a response from AI. Please try again.");
  }
};

export const transcribeAudio = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    let response;
    
    if (USE_EDGE_FUNCTIONS && SUPABASE_URL && SUPABASE_ANON_KEY) {
      response = await fetch(`${SUPABASE_URL}/functions/v1/transcribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: formData
      });
    } else {
      response = await fetch(`${LOCAL_BACKEND_URL}/api/transcribe`, {
        method: 'POST',
        body: formData
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Transcription error: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error("Failed to transcribe audio. Please try again.");
  }
};
