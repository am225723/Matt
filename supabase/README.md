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

-- North Star Goals table
CREATE TABLE north_star_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  timeframe TEXT NOT NULL CHECK (timeframe IN ('3-month', '6-month', '1-year', '3-year')),
  raw_goal TEXT NOT NULL,
  smart_goal TEXT,
  milestones JSONB DEFAULT '[]',
  reality_check TEXT,
  status TEXT NOT NULL DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'completed'))
);

ALTER TABLE north_star_goals ENABLE ROW LEVEL SECURITY;

-- RLS policies for North Star Goals (users can only access their own data)
CREATE POLICY "Users can view own goals" ON north_star_goals 
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own goals" ON north_star_goals 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own goals" ON north_star_goals 
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own goals" ON north_star_goals 
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow anonymous access for demo purposes (remove in production with auth)
CREATE POLICY "Allow anonymous operations" ON north_star_goals 
  FOR ALL USING (true) WITH CHECK (true);
```
