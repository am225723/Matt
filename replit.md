# Matthew's Playbook - Personal Development Web App

## Overview
A comprehensive React + Vite web application for personal development, mental wellness, and resilience building. The application includes multiple tools and features for anxiety tracking, health monitoring, ketamine therapy journaling, resilience playbook creation, and AI-powered insights.

## Project Structure
- **Frontend**: React + Vite (Port 5000)
- **Backend**: Express server (Port 3000) - Handles secure API proxying for transcription
- **Build System**: Vite with custom plugins for visual editing
- **Styling**: Tailwind CSS with custom theme
- **State Management**: Local storage for gamification, plans, and user data
- **Animations**: Framer Motion

## Key Features
1. **Resilience Playbook** - Step-by-step strategies for challenging situations
2. **Playbook Library** - Manage saved resilience playbooks
3. **Achievements** - Track progress and earn badges
4. **Excuse Reframing** - AI-powered transformation of limiting beliefs
5. **Ryder Cup Yardage Book** - Personal guidance system
6. **Enhanced Health Dashboard** - AI-powered health insights and tracking
7. **Ketamine Journal** - Reflection and self-exploration space
8. **Anxiety Tracker** - Interactive body map for tracking anxiety symptoms

## Setup & Configuration

### Dependencies
All npm dependencies are already installed. Key packages include:
- React 18.2.0
- Vite 7.1.7
- Framer Motion 10.16.4
- Tailwind CSS 3.3.3
- Lucide React (icons)
- Chart.js & Recharts (visualizations)

### Environment Variables (API Keys)
The following API keys have been configured in Replit Secrets and are available:
- `PERPLEXITY_API_KEY` - Powers AI insights, excuse reframing, and yardage book features
- `VITE_OPENAI_API_KEY` - Enables audio transcription and AI follow-ups
- `VITE_GEMINI_API_KEY` - Alternative AI provider for enhanced features

**Note**: The app checks for both `PERPLEXITY_API_KEY` and `VITE_PERPLEXITY_API_KEY` for compatibility.

### Supabase Integration
The app uses Supabase for storing background images:
- Public storage bucket URL: `https://efgtznvrnzqcxmfmjuue.supabase.co/storage/v1/object/public/bg-playbook/`
- Background images for scenarios (drinking, networking, family, etc.)
- No database connection required - images are publicly accessible

### Running the Application
Two workflows are configured to run automatically:

**Frontend** (Port 5000):
```bash
npm run dev
```

**Backend** (Port 3000):
```bash
node server.js
```

The backend server handles secure API proxying for audio transcription to prevent exposing API keys on the client.

### Vite Configuration
- Host: 0.0.0.0 (allows Replit proxy access)
- Port: 5000
- Allowed Hosts: true (required for Replit iframe preview)
- HMR: Enabled

## Development Notes

### Known Issues (October 23, 2025)
- Console warning about `UNSAFE_componentWillMount` from react-helmet (non-blocking)
- Some browser-incompatible packages were removed (perplexityai with puppeteer dependency)

### Recent Changes

#### November 01, 2025 - UI Enhancements and Feature Verification
- ✅ **Enhanced Dashboard Tiles**: Sophisticated aesthetic with advanced animations
  - 3D hover effects with perspective transforms (rotateY/rotateX)
  - Larger, animated icons (20x20) with 360° rotation on hover
  - Animated gradient overlays with pulsing effects
  - Shimmer borders and glow effects on hover
  - Smoother spring animations with enhanced timing
  - Animated arrow with continuous movement
- ✅ **Audio Transcription Fix**: Migrated from Perplexity to OpenAI Whisper API with secure backend proxy
  - Created Express backend server (`server.js`) to securely handle API keys
  - Backend endpoint `/api/transcribe` proxies requests to OpenAI Whisper-1 model
  - Prevents API key exposure on client-side (security best practice)
  - CORS-enabled backend on port 3000 for frontend communication
  - FormData-based multipart requests for audio file upload
- ✅ **Verified Ketamine Journal Readability**: Confirmed white backgrounds with dark text (gray-700, gray-800) throughout
- ✅ **Verified Anxiety Tracker Body Map**: Confirmed all body parts properly mapped
  - Front view: Face, Neck, Chest, Stomach, Arms, Hands, Legs, Feet
  - Back view: Upper/Mid/Lower Back, Glutes, Calves
  - Universal parts visible on both views: Head, Neck, Shoulders, Arms, Hands, Legs, Feet

#### November 01, 2025 - Advanced Feature Rebuilds
- ✅ **Ketamine Journal Advanced**: Complete rebuild with sophisticated session-based workflow
  - **Question Bank System**: Curated questions organized by topic (Anxiety, Depression, Trauma, Fears, Self-Image, Core Self)
  - **Topic Selection**: Choose from 6 guided topics or start a free-form journal session
  - **Guided Question Flow**: One question at a time with progress tracking and navigation
  - **Question Navigation**: Move forward/backward through questions, edit previous responses
  - **End Session Anytime**: Save progress and end the session at any point
  - Segmented audio recording: Record multiple audio segments per session, each transcribing to new paragraph
  - Real-time paragraph generation: Each recording segment automatically transcribes and adds to journal
  - AI follow-up questions: Automatic generation of compassionate follow-up questions after each transcription
  - Mood tracking: Before/after session mood capture with emoji selectors
  - Session export: Export complete sessions as formatted text
  - Navigation controls: Previous/Next paragraph navigation through session history
  - Clean visual design: Modern interface with clear typography and spacing
- ✅ **Excuse Reframer Advanced**: Complete rebuild with wizard-style interface
  - Step-by-step wizard: Guided flow through excuse input, category selection, and reframe generation
  - Multiple AI suggestions: Generates 3 different reframes per excuse with different perspectives
  - Category templates: Pre-defined categories (fitness, work, social, etc.) with example excuses
  - Before/After comparison: Side-by-side view of original excuse vs. empowering reframe
  - Favorites system: Save and manage your most impactful reframes
  - Progress tracking: Visual step indicator throughout wizard process
  - Insight explanations: Each reframe includes psychological insight about why it works
- ✅ **Lazy Loading Implementation**: Both advanced components use React.lazy() and Suspense to prevent errors from blocking the main app
- ✅ **Fixed Import Errors**: Corrected function imports in both new components
  - KetamineJournalAdvanced: Uses `AIService.generateFollowUpQuestion()` from aiService.js
  - ExcuseReframerAdvanced: Uses `generateContent()` from perplexity.js
- ✅ **Body Map URL Fix**: Corrected Supabase image URLs to use proper path (https://efgtznvrnzqcxmfmjuue.supabase.co/storage/v1/object/public/images/)

#### October 24, 2025 - UI/UX Enhancement Update
- ✅ **Main Dashboard Background**: Added professional background image from Supabase (bg-main.jpg) with gradient overlay
- ✅ **Uniform Tile Sizing**: All dashboard tiles now use consistent h-64 height for visual harmony
- ✅ **Enhanced Tile Styling**: Improved hover animations (scale 1.05, y: -8), larger icons (16x16), better gradients and shadows
- ✅ **Global Button Contrast Fix**: Completely overhauled button variants for proper accessibility:
  - Default: Dark gray (bg-gray-900) with white text
  - Destructive: Red (bg-red-600) with white text  
  - Outline: White background with dark text and visible border
  - Secondary: Light gray with dark text
  - Ghost & Link: Dark text for readability
- ✅ **Body Map Calibration Enhancement**: Replaced SVG silhouette with actual Supabase photo (1531.png) while maintaining calibration overlay functionality

#### October 23, 2025 - Core Functionality & Anxiety Tracker
- ✅ **Fixed critical runtime error**: Removed `perplexityai` npm package that depended on puppeteer (Node.js-only)
- ✅ **Rewrote Perplexity integration**: Now uses direct fetch API calls to Perplexity's REST API
- ✅ **Fixed import error**: Removed invalid `Area` import from react-chartjs-2
- ✅ **Configured Vite**: Added `global: 'window'` define to fix browser compatibility
- ✅ **API keys configured**: All three API keys (Perplexity, OpenAI, Gemini) are now set in Replit Secrets
- ✅ **App successfully loading**: Dashboard renders with all feature tiles visible
- ✅ **Invisible SVG Overlay**: Made SVG overlay nearly transparent (5% base opacity) so Supabase photos are clearly visible while maintaining clickable regions
- ✅ **Supabase Photo Integration**: Uses 1530.png for back view, 1531.png for front view with toggle button
- ✅ **Extended Body Parts**: Added 8 new body parts for comprehensive tracking (shoulders, upper/mid/lower back, glutes, calves)
- ✅ **Individual Body Part Questioning**: Completely revamped flow to ask questions for each body part individually with intensity slider, notes field, and progress indicator
- ✅ **Enhanced Data Storage**: Entries now include both aggregated sensations and detailed per-part data
- ✅ **Fixed Progress Tracking**: Session progress bar correctly reaches 100% with new per-part workflow
- ✅ **Auto Follow-up Generation**: Implemented automatic AI follow-up question generation immediately after transcription completes in Ketamine Journal
- ✅ **Fixed Stale Closure Bug**: Resolved critical issue where live transcription follow-ups weren't generated using ref-based approach
- ✅ **Transcription Fallback**: Added intelligent fallback mechanism for AI follow-up questions when transcription fails

#### Technical Improvements
- Configured Vite server to bind to 0.0.0.0:5000 for Replit compatibility
- Added ErrorBoundary component for better error handling
- Improved font contrast across all components for better accessibility
- Enhanced Framer Motion animations for smoother user experience

## Deployment
The application is configured for Vite's built-in dev server. For production deployment:
```bash
npm run build
```

## Architecture
- **Component-Based**: Modular React components in `src/components/`
- **Utility Functions**: Helper functions in `src/utils/`
- **Data Storage**: LocalStorage for client-side persistence
- **Services**: AI, audio, and PDF services in `src/services/`
- **Styling**: Global styles in `src/index.css` with component-specific CSS in `src/styles/`

## User Preferences
- No specific user preferences recorded yet

## Component Files
- **Advanced Components**: `src/components/KetamineJournalAdvanced.jsx`, `src/components/ExcuseReframerAdvanced.jsx`
- **Original Components**: `src/components/KetamineTherapyRedesigned.jsx`, `src/ExcuseReframe.jsx`
- **Data Files**: `src/data/questionBank.js` (Question topics and prompts for Ketamine Journal)
- **Services**: `src/services/aiService.js` (AI follow-ups), `src/services/audioService.js` (transcription)
- **Utilities**: `src/utils/perplexity.js` (Perplexity API integration)

## Question Bank Topics
The Ketamine Journal includes curated question banks for the following topics:
1. **Anxiety Exploration** (24 questions) - Explore anxiety patterns, triggers, and coping mechanisms
2. **Depression & Mood** (18 questions) - Navigate feelings of sadness and low mood
3. **Repressed Trauma** (17 questions) - Gently explore unprocessed experiences
4. **Unacknowledged Fears** (17 questions) - Bring hidden fears into the light
5. **Self-Image** (17 questions) - Examine how you see yourself
6. **Core Self** (17 questions) - Connect with your authentic self

## Last Updated
November 01, 2025 - Sophisticated rebuilds of Ketamine Journal and Excuse Reframer with enhanced features and wizard-style interfaces
