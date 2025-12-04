import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import multer from 'multer';
import FormData from 'form-data';

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.json({ limit: '50mb' }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Perplexity AI proxy endpoint
app.post('/api/perplexity', async (req, res) => {
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Perplexity API key is not configured on the server' 
      });
    }

    const { systemContext, userPrompt, temperature = 0.2 } = req.body;

    if (!systemContext || !userPrompt) {
      return res.status(400).json({ error: 'Missing systemContext or userPrompt' });
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-chat',
        messages: [
          { role: 'system', content: systemContext },
          { role: 'user', content: userPrompt }
        ],
        temperature: temperature,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Perplexity API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    res.json({ content: data.choices[0].message.content });

  } catch (error) {
    console.error('Perplexity API error:', error);
    res.status(500).json({ 
      error: 'AI request failed', 
      message: error.message 
    });
  }
});

// Transcription proxy endpoint
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const apiKey = process.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key is not configured on the server' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Create FormData for OpenAI request
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: 'recording.webm',
      contentType: req.file.mimetype || 'audio/webm'
    });
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    // Make request to OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    res.json({ text: data.text });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ 
      error: 'Transcription failed', 
      message: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
