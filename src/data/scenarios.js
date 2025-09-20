/* Base URL for backgrounds (Supabase public) */
const BASE_BG =
  "https://efgtznvrnzqcxmfmjuue.supabase.co/storage/v1/object/public/bg-playbook/";

/* Scenario → background(s). If array, one is picked at random. */
export const scenarioBackgrounds = {
  drinking: `${BASE_BG}bg-drinking.png`,
  peerPressure: `${BASE_BG}bg-peerpressure.png`,
  networking: `${BASE_BG}bg-networking.png`,
  presenting: `${BASE_BG}bg-presenting.png`,
  speaking: `${BASE_BG}bg-speaking.png`,
  family: `${BASE_BG}bg-family.png`,
  custom: `${BASE_BG}bg-custom.png`,
  interview: `${BASE_BG}bg-interview.png`,
  date: [`${BASE_BG}bg-date1.png`, `${BASE_BG}bg-date2.png`],
  travel: `${BASE_BG}bg-travel.png`,
  medical: `${BASE_BG}bg-medical.png`,
  conflict: `${BASE_BG}bg-conflict.png`,
  smallMeeting: `${BASE_BG}bg-smallmeeting.png`,
  calledOn: `${BASE_BG}bg-calledon.png`,
  golfing: `${BASE_BG}bg-golfing.png`,
  workStress: `${BASE_BG}bg-workstress.png`,
};

export const SCENARIOS = [
  { key: "drinking", label: "Drinking", emoji: "🍻" },
  { key: "peerPressure", label: "Peer Pressure", emoji: "🤷" },
  { key: "networking", label: "Networking", emoji: "🌆" },
  { key: "presenting", label: "Presenting", emoji: "🗂" },
  { key: "speaking", label: "Speaking", emoji: "🎤" },
  { key: "family", label: "Family", emoji: "🏠" },
  { key: "interview", label: "Interview", emoji: "📝" },
  { key: "date", label: "Date", emoji: "❤️" },
  { key: "travel", label: "Travel", emoji: "✈️" },
  { key: "medical", label: "Medical", emoji: "🏥" },
  { key: "conflict", label: "Conflict", emoji: "⚠️" },
  { key: "smallMeeting", label: "Small Meeting", emoji: "👥" },
  { key: "calledOn", label: "Called On", emoji: "🙋" },
  { key: "golfing", label: "Golfing", emoji: "⛳" },
  { key: "workStress", label: "Work Stress", emoji: "💼" },
  { key: "custom", label: "Custom", emoji: "✏️" },
];

export const STEP_CONFIG = {
  1: {
    title: "Scenario Selection",
    subtitle: "Choose your challenge",
    description: "Select the scenario you want to prepare for, or create a custom one."
  },
  2: {
    title: "Emotional Awareness",
    subtitle: "Understanding your feelings",
    description: "Explore your emotional responses to build self-awareness."
  },
  3: {
    title: "Goal Setting",
    subtitle: "Define your objectives",
    description: "Set clear, achievable goals for this scenario."
  },
  4: {
    title: "Strategy Planning",
    subtitle: "Build your toolkit",
    description: "Develop specific strategies and coping mechanisms."
  },
  5: {
    title: "Support System",
    subtitle: "Identify your allies",
    description: "Map out your support network and resources."
  },
  6: {
    title: "Reflection & Commitment",
    subtitle: "Seal your plan",
    description: "Reflect on your journey and commit to your resilience plan."
  }
};