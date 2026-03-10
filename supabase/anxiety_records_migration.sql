-- ============================================================
-- TheSpinDown: anxiety_records table
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.anxiety_records (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lyrics      text NOT NULL,
  created_at  timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS anxiety_records_user_id_idx
  ON public.anxiety_records (user_id);

-- Enable Row Level Security
ALTER TABLE public.anxiety_records ENABLE ROW LEVEL SECURITY;

-- Policy: users can only SELECT their own records
CREATE POLICY "Users can view own anxiety records"
  ON public.anxiety_records
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: users can INSERT their own records
CREATE POLICY "Users can insert own anxiety records"
  ON public.anxiety_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: users can DELETE their own records
CREATE POLICY "Users can delete own anxiety records"
  ON public.anxiety_records
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant table usage to authenticated role
GRANT ALL ON public.anxiety_records TO authenticated;
GRANT ALL ON public.anxiety_records TO service_role;