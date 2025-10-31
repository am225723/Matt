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

### Recent Changes

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

## Last Updated
October 24, 2025 - UI/UX enhancements: main dashboard background, uniform tiles, global button contrast, body map calibration photo display
