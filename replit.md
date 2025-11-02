## Overview
Matthew's Playbook is a comprehensive React + Vite web application designed for personal development, mental wellness, and resilience building. It offers a suite of tools for anxiety tracking, health monitoring, ketamine therapy journaling, resilience playbook creation, and AI-powered insights. The project aims to provide users with a personal journey towards mental clarity and resilience through interactive and AI-enhanced features.

## User Preferences
No specific user preferences recorded yet

## System Architecture
The application is built with React and Vite for the frontend, utilizing a component-based architecture with modular components, utility functions, and dedicated service files. Styling is managed with Tailwind CSS, incorporating a dark sophisticated theme, glass morphism effects, and smooth Framer Motion animations. Key UI/UX decisions include a mobile-first responsive design, animated elements like rotating gradient rings and sparkle effects for avatars, sophisticated gradient tiles with character images, and a horizontal header layout. Data persistence is handled via LocalStorage. The application uses React Router v6 for URL-based navigation, allowing direct links and browser history management for all features.

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
- **Character-Based UI**: Custom cartoon avatars for each feature, displayed on tiles with hover animations.

## External Dependencies
- **Perplexity API**: Powers AI insights, excuse reframing, and yardage book features.
- **OpenAI API (Whisper)**: Used for audio transcription and AI follow-up questions, accessed securely via a backend Express proxy.
- **Google Gemini API**: An alternative AI provider for enhanced features.
- **Supabase**: Utilized for storing background images (e.g., `bg-main.jpg`, `1530.png`, `1531.png`) for dashboard backgrounds and the anxiety tracker's body map. Images are publicly accessible through a storage bucket URL.
- **Framer Motion**: For animations.
- **Tailwind CSS**: For styling.
- **Lucide React**: For icons.
- **Chart.js & Recharts**: For data visualizations.

### Recent Changes

#### November 02, 2025 - Mobile-First Dashboard with Character Tiles & Horizontal Header
- ✅ **Mobile-First Responsive Design**: Completely rebuilt dashboard with mobile as priority
  - **Single Column Mobile**: Perfect touch-friendly layout on phones
  - **2-Column Tablet/Desktop**: Expands beautifully on larger screens
  - **Cartoon Avatar Integration**: Professional cartoon character with rotating gradient ring
  - **Rotating Gradient Ring**: Animated conic gradient border around avatar
  - **Sparkle Effect**: Animated sparkle emoji on avatar for visual delight
  - **Sophisticated Gradient Tiles**: Each feature has unique vibrant gradient
  - **Glass Morphism Effects**: Frosted glass overlays with backdrop blur
  - **Touch-Optimized**: Large tap targets (176px height for tiles)
  - **Smooth Animations**: Staggered tile entrance with spring physics
  - **Shine Effect**: Diagonal shine animation on tile hover
  - **Bottom Highlight**: Gradient border at bottom of each tile
  - **Dark Sophisticated Theme**: Slate-900 background with ambient orbs
  - **Accessible**: High contrast white text on vibrant gradients
- ✅ **Horizontal Header Layout**: Redesigned header with character on the side
  - **Side-by-Side Layout**: Avatar on left, title on right (responsive to stack on mobile)
  - **Large Gradient Title**: 3xl-6xl responsive text with blue→purple→pink gradient
  - **Glow Effect Behind Text**: Blurred gradient backdrop for depth
  - **Animated Shimmer**: Periodic shine sweep across title text
  - **Elegant Subtitle**: "Your Personal Journey to Mental Clarity & Resilience"
  - **Sophisticated Typography**: Mix of font weights and gradient text effects
  - **Layered Animations**: Staggered entrance with slide-in from left
  - **Call to Action**: "Choose your path below ↓" with arrow
- ✅ **Character Images on Tiles**: Each feature tile now includes custom character artwork
  - **Playbook**: Character holding shield with book icon
  - **Library**: Character with magical glowing book and robot companion
  - **Achievements**: Character holding gold medal and golf club
  - **Reframing**: Character with tablet showing positive/negative thoughts
  - **Yardage**: Character in golf visor studying yardage book
  - **Health**: Character in doctor's coat with health dashboard
  - **Ketamine**: Character relaxing on cloud with thought spiral
  - **Anxiety**: Character presenting body map visualization
  - **Hover Effects**: Characters scale and rotate on hover for interactivity
- ✅ **Back Button Navigation**: All feature pages have return to dashboard buttons
  - All wrapper components include `onBack={() => navigate('/')}` functionality
  - Users can easily return to dashboard from any feature
  - "Back to Dashboard" button visible at top of each feature page
- ✅ **Complete Body Map Visualization**: Added all 14 body part circles to calibration overlay
  - Added visible circles for: Face, Neck, Left Arm, Left Hand, Right Hand, Back, Left Leg, Right Leg, Left Foot, Right Foot
  - All body parts now have adjustable SVG ellipses positioned on the photo
  - Users can see, select, and calibrate all 14 body parts instead of just 4
  - Each circle is clickable, draggable, and fully customizable (position, scale, rotation)
- ✅ **Audio Transcription Fix**: Migrated from Perplexity to OpenAI Whisper API with secure backend proxy
  - Created Express backend server (`server.js`) to securely handle API keys
  - Backend endpoint `/api/transcribe` proxies requests to OpenAI Whisper-1 model
  - Prevents API key exposure on client-side (security best practice)
  - Users can record and transcribe audio in Ketamine Journal feature
- ✅ **React Router v6 Integration**: URL-based navigation for all features
  - Each feature has dedicated route (/, /playbook, /library, /achievements, /reframe, /yardage, /health, /ketamine, /anxiety)
  - Browser back/forward buttons work naturally
  - Features can be bookmarked and shared via direct URLs
  - Link components in tiles prevent page reload for smooth transitions
