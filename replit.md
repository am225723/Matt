## Overview
Matthew's Playbook is a React + Vite web application focused on personal development, mental wellness, and resilience. It provides tools for anxiety tracking, health monitoring, ketamine therapy journaling, resilience playbook creation, and AI-powered insights, aiming to guide users towards mental clarity and resilience through interactive and AI-enhanced features.

## User Preferences
No specific user preferences recorded yet

## System Architecture
The application uses React and Vite, featuring a component-based architecture, Tailwind CSS for styling (dark sophisticated theme, glass morphism, Framer Motion animations), and a mobile-first responsive design. UI/UX includes animated elements, gradient tiles with character images, and a horizontal header. Data is persisted using Supabase (with localStorage fallback) and navigation is managed by React Router v6.

The application is designed for Vercel deployment, utilizing:
- **Supabase Edge Functions** for AI API proxying (Perplexity, OpenAI Whisper).
- **Supabase Database** for data storage.
- **Frontend-only deployment** on Vercel.

Key features and technical implementations include:
- **Resilience Playbook & Library**: Strategy creation and management.
- **Achievements**: Progress tracking and badging.
- **Excuse Reframing**: AI-powered reframing of limiting beliefs.
- **Ryder Cup Yardage Book**: Personal guidance system.
- **Enhanced Health Dashboard**: AI-powered health insights.
- **Ketamine Journal**: Session-based workflow with audio recording, transcription, AI follow-ups, and mood tracking.
- **Anxiety Tracker**: Interactive body map visualization for tracking sensations.
- **Resignation Protocol**: A therapeutic digital ritual for releasing emotional burdens, featuring typewriter effects, Mad Libs-style forms, signature canvas, and dual release options (Burn/File) with Supabase integration.
- **Worry ROI**: A fin-tech styled cognitive reframing tool to audit the cost of worry, including a 7-phase workflow, AI-powered facts analysis (CBT approach), and portfolio tracking.
- **AI Integration**: Central to excuse reframing, health insights, ketamine journal, and worry ROI.
- **Audio Transcription**: Handled via OpenAI Whisper API proxied through Supabase Edge Functions.
- **Character-Based UI**: Custom cartoon avatars for each feature tile with hover animations.

## External Dependencies
- **Perplexity API**: Used for AI insights, excuse reframing, yardage book, and Worry ROI's cognitive behavioral therapy analysis, accessed via Supabase Edge Functions.
- **OpenAI API (Whisper-1)**: For audio transcription in the Ketamine Journal and AI follow-up questions, accessed via Supabase Edge Functions.
- **Google Gemini API**: An alternative AI provider for enhanced features.
- **Supabase**:
  - Database for resignations with CRUD operations.
  - Edge Functions for AI API proxying (Perplexity-AI, transcribe).
  - Storage bucket for images used in dashboard backgrounds and the anxiety tracker body map.
- **Framer Motion**: For animations.
- **Tailwind CSS**: For styling.
- **Lucide React**: For icons.
- **Chart.js & Recharts**: For data visualizations.