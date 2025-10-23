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

### Environment Variables (Optional API Keys)
The following API keys are optional but enable enhanced features:
- `VITE_PERPLEXITY_API_KEY` - For AI-powered insights and excuse reframing
- `VITE_OPENAI_API_KEY` - For audio transcription and AI follow-ups
- `VITE_GEMINI_API_KEY` - Alternative AI provider

To add these, use Replit's Secrets feature in the Tools panel.

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
- Some imported components may cause runtime errors if their dependencies aren't properly configured
- API key warnings are non-blocking (changed from alerts to console warnings)
- App is currently loading with simplified imports to avoid runtime errors

### Recent Changes
- Removed blocking alert for missing Perplexity API key
- Changed to console.warn to allow app to load without API keys
- Configured Vite server to bind to 0.0.0.0:5000 for Replit compatibility
- Temporarily simplified component imports to isolate rendering issues

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
