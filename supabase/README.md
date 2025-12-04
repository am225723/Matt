# Supabase Edge Functions for Matthew's Playbook

This directory contains Supabase Edge Functions that proxy API calls for secure deployment on Vercel.

## Functions

### 1. `perplexity-ai`
Proxies requests to the Perplexity AI API for features like Excuse Reframer and Yardage Book.

### 2. `transcribe`
Proxies requests to OpenAI Whisper API for audio transcription in Ketamine Journal.

## Deployment Instructions

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Login to Supabase
```bash
supabase login
```

### Step 3: Link to your project
```bash
supabase link --project-ref efgtznvrnzqcxmfmjuue
```

### Step 4: Set up secrets
```bash
# Set Perplexity API key
supabase secrets set PERPLEXITY_API_KEY=your_perplexity_api_key

# Set OpenAI API key  
supabase secrets set OPENAI_API_KEY=your_openai_api_key
```

### Step 5: Deploy functions
```bash
# Deploy all functions
supabase functions deploy

# Or deploy individually
supabase functions deploy perplexity-ai
supabase functions deploy transcribe
```

## Testing Locally

```bash
# Start local Supabase
supabase start

# Serve functions locally
supabase functions serve --no-verify-jwt
```

## Usage

The frontend automatically calls these edge functions when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set.

### Perplexity AI Endpoint
```
POST https://your-project.supabase.co/functions/v1/perplexity-ai
Headers: 
  Authorization: Bearer YOUR_ANON_KEY
  Content-Type: application/json
Body:
  {
    "systemContext": "You are a helpful assistant",
    "userPrompt": "Hello!",
    "temperature": 0.2
  }
```

### Transcribe Endpoint
```
POST https://your-project.supabase.co/functions/v1/transcribe
Headers:
  Authorization: Bearer YOUR_ANON_KEY
Body: FormData with 'audio' file
```

## Required Database Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- Resignations table
CREATE TABLE resignations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  addressee TEXT NOT NULL,
  role TEXT NOT NULL,
  condition TEXT NOT NULL,
  paid_in TEXT NOT NULL,
  instead_of TEXT NOT NULL,
  returning_keys TEXT NOT NULL,
  struck_responsibilities TEXT[] DEFAULT '{}',
  new_position TEXT NOT NULL,
  signature_data TEXT,
  release_type TEXT NOT NULL CHECK (release_type IN ('burn', 'file')),
  reference_number TEXT
);

ALTER TABLE resignations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON resignations FOR ALL USING (true) WITH CHECK (true);
```
