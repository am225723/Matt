export const BASE_BG = "https://efgtznvrnzqcxmfmjuue.supabase.co/storage/v1/object/public/bg-playbook/";

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

export const LEFT_DOCK_SCENARIOS = new Set([
  "speaking","presenting","interview","smallMeeting","calledOn"
]);

export const ACCOUNTABILIBUDDY_NAME = "Aleix";
export const ACCOUNTABILIBUDDY_PHONE = "8602002053";

export const pickBg = (k) => {
  const e = scenarioBackgrounds[k] ?? scenarioBackgrounds.custom;
  return Array.isArray(e) ? e[Math.floor(Math.random() * e.length)] : e;
};

export const labelFor = (k) => SCENARIOS.find((s) => s.key === k)?.label ?? "Custom";

export const helperText = (s) =>
  ({
    drinking: "Pressure is temporary; your plan is permanent. Decoy drink + short, friendly no.",
    peerPressure: "Rehearse 2 lines. Smile, eye contact, change topic.",
    networking: "Lead with curiosity. Simple openers; breathe before speaking.",
    presenting: "Slow first 3 sentences; anchor feet, soften shoulders.",
    speaking: "Pace > perfection. Pause is power; scan friendly faces.",
    family: "Name a boundary in advance; pick one ally or exit cue.",
    interview: "Answer, pause, ask back. You’re assessing them too.",
    date: "Connection over performance. Reflect + one follow‑up.",
    travel: "Micro-plans beat unknowns: check-in, gate, seat, water.",
    medical: "Questions first, decisions later. Notepad = control.",
    conflict: "Validate, then need. Seek next small step.",
    smallMeeting: "Jot a bullet, speak it. Short beats perfect.",
    calledOn: "Buy time: “Great Q—give me 10 seconds.”",
    golfing: "Enjoy the walk. One simple swing cue.",
    workStress: "Single-task 15 min. Then reassess.",
  }[s] ?? "Breathe low and slow. Clarity first; then choose your move.");

export function aiHelpers(s, a) {
  const out = [];
  const add = (x) => out.push(x);
  if (a.limit) add(`Rehearse limit: “I'm at ${a.limit}.”`);
  if (a.line) add(`Default line: “${a.line}” (repeat, friendly).`);
  if (a.anchor) add(`Anchor: keep ${a.anchor} in hand.`);
  if ((a.desire || "").toLowerCase().includes("relax"))
    add("Box-breath 4‑4‑4‑4 before speaking/ordering.");
  if ((a.feel || "").toLowerCase().includes("anx"))
    add("Name it: “Anxiety is here; I still choose.”");
  if (s === "drinking") add("Arrive with NA drink; order first.");
  if (s === "peerPressure") add("Agree + pivot: “You’re wild—btw, tomorrow’s plan?”");
  if (s === "networking") add("Openers: “What brings you here?” “What are you building?”");
  if (s === "presenting") add("First 3 lines slower; pause after key point.");
  if (s === "speaking") add("Stand tall, long exhale, speak to one friendly face.");
  if (s === "family") add("Boundary script + exit cue with ally.");
  if (s === "interview") add("STAR notes: Situation‑Task‑Action‑Result.");
  if (s === "date") add("Listen‑reflect‑ask. Mirror one sentence, add a follow‑up.");
  if (s === "conflict") add("Validate 1 line, request 1 behavior change.");
  if (s === "workStress") add("15‑min focus timer; park other tasks.");
  return out.slice(0, 6);
}