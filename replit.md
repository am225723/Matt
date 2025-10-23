# Matthew's Playbook - Personal Development Web App

## Overview
A comprehensive React + Vite web application for personal development, mental wellness, and resilience building. The application includes multiple tools and features for anxiety tracking, health monitoring, ketamine therapy journaling, resilience playbook creation, and AI-powered insights.

## Project Structure
- **Frontend**: React + Vite (Port 5000)
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
The frontend workflow is configured to run automatically on port 5000:
```bash
npm run dev
```

### Vite Configuration
- Host: 0.0.0.0 (allows Replit proxy access)
- Port: 5000
- Allowed Hosts: true (required for Replit iframe preview)
- HMR: Enabled

## Development Notes

### Known Issues (October 23, 2025)
- Console warning about `UNSAFE_componentWillMount` from react-helmet (non-blocking)
- Some browser-incompatible packages were removed (perplexityai with puppeteer dependency)

### Recent Changes (October 23, 2025)
- ✅ **Fixed critical runtime error**: Removed `perplexityai` npm package that depended on puppeteer (Node.js-only)
- ✅ **Rewrote Perplexity integration**: Now uses direct fetch API calls to Perplexity's REST API
- ✅ **Fixed import error**: Removed invalid `Area` import from react-chartjs-2
- ✅ **Configured Vite**: Added `global: 'window'` define to fix browser compatibility
- ✅ **API keys configured**: All three API keys (Perplexity, OpenAI, Gemini) are now set in Replit Secrets
- ✅ **App successfully loading**: Dashboard renders with all feature tiles visible
- ✅ **Anxiety Tracker Enhancement**: Updated AnxietyTrackerRedesigned to use Supabase background images (1530.png for back view, 1531.png for front view) with interactive SVG overlay paths
- ✅ **Ketamine Journal Auto Follow-up**: Implemented automatic AI follow-up question generation immediately after transcription completes
- ✅ **Fixed Stale Closure Bug**: Resolved critical issue where live transcription follow-ups weren't generated due to stale closure by using ref-based approach
- ✅ **Transcription Fallback**: Added intelligent fallback mechanism where AI generates contextual follow-up questions even when transcription fails
- Configured Vite server to bind to 0.0.0.0:5000 for Replit compatibility
- Added ErrorBoundary component for better error handling

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

## Last Updated
October 23, 2025 - Initial Replit environment setup completed
