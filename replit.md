## Overview
Matthew's Playbook is a comprehensive React + Vite web application designed for personal development, mental wellness, and resilience building. It offers a suite of tools for anxiety tracking, health monitoring, ketamine therapy journaling, resilience playbook creation, and AI-powered insights. The project aims to provide users with a personal journey towards mental clarity and resilience through interactive and AI-enhanced features.

## User Preferences
No specific user preferences recorded yet

## System Architecture
The application is built with React and Vite for the frontend, utilizing a component-based architecture with modular components, utility functions, and dedicated service files. Styling is managed with Tailwind CSS, incorporating a dark sophisticated theme, glass morphism effects, and smooth Framer Motion animations. Key UI/UX decisions include a mobile-first responsive design, animated elements like rotating gradient rings and sparkle effects for avatars, and sophisticated gradient tiles for features. Data persistence is handled via LocalStorage. The application uses React Router v6 for URL-based navigation, allowing direct links and browser history management for all features.

Core technical implementations and features include:
- **Resilience Playbook & Library**: Tools for creating and managing step-by-step strategies.
- **Achievements**: Progress tracking and badging system.
- **Excuse Reframing**: AI-powered transformation of limiting beliefs via a guided wizard with multiple suggestions and psychological insights.
- **Ryder Cup Yardage Book**: A personal guidance system.
- **Enhanced Health Dashboard**: AI-powered insights and tracking.
- **Ketamine Journal**: A sophisticated session-based workflow with curated question banks, segmented audio recording, real-time transcription, AI follow-up questions, and mood tracking.
- **Anxiety Tracker**: An interactive body map visualization with a detailed calibration overlay, supporting comprehensive tracking of sensations across numerous body parts with individual questioning and intensity sliders.
- **AI Integration**: AI capabilities are central to features like excuse reframing, health insights, and ketamine journal follow-ups.
- **Audio Transcription**: Securely handled via an Express backend server proxying requests to the OpenAI Whisper API.

## External Dependencies
- **Perplexity API**: Powers AI insights, excuse reframing, and yardage book features.
- **OpenAI API (Whisper)**: Used for audio transcription and AI follow-up questions, accessed securely via a backend Express proxy.
- **Google Gemini API**: An alternative AI provider for enhanced features.
- **Supabase**: Utilized for storing background images (e.g., `bg-main.jpg`, `1530.png`, `1531.png`) for dashboard backgrounds and the anxiety tracker's body map. Images are publicly accessible through a storage bucket URL.
- **Framer Motion**: For animations.
- **Tailwind CSS**: For styling.
- **Lucide React**: For icons.
- **Chart.js & Recharts**: For data visualizations.