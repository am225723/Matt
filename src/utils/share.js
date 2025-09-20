import { toast } from "@/components/ui/use-toast";

const enc = (obj) => {
  const j = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(j)));
};

export const dec = (b64) => {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(b64))));
  } catch {
    return null;
  }
};

export function getShareUrl(scenario, answers) {
  const payload = {
    scenario,
    goal: answers.goal,
    limit: answers.limit,
    anchor: answers.anchor,
    line: answers.line,
    ally: answers.ally,
    allyPhone: answers.allyPhone,
    why: { feel: answers.feel, think: answers.think, desire: answers.desire },
    debrief: { proud: answers.proud, tweak: answers.tweak },
    mantra: answers.mantra,
    ts: new Date().toISOString(),
  };
  return `${window.location.origin}${window.location.pathname}#plan=${enc(payload)}`;
}

export function exportPdf(bgUrl, scenario, answers, labelFor) {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) {
    toast({ title: "Popup blocked", description: "Allow popups to export PDF.", variant: "destructive" });
    return;
  }
  const css = `
  @page{size:letter portrait;margin:0}
  body{margin:0}
  .sheet{width:8.5in;height:5.5in;position:relative;overflow:hidden}
  .bg{position:absolute;inset:0;background:url('${bgUrl}') center/cover no-repeat;filter:none}
  .veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.18))}
  .card{position:absolute;right:.35in;top:.35in;bottom:.35in;left:50%;background:rgba(255,255,255,.82);backdrop-filter:blur(3px);border-radius:14px;padding:.35in;border:1px solid rgba(230,240,240,.9);font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,sans-serif;color:#111}
  h1{margin:0 0 .1in 0;font-size:18px}
  h2{margin:.1in 0 0;font-size:13px}
  p,li,div,span{font-size:12px;line-height:1.3}
  ul{margin:.05in 0 .1in 1em;padding:0}
  .muted{opacity:.85}
  `;
  const html = `
  <html><head><meta charset="utf-8"><title>Resilience Plan</title><style>${css}</style></head>
  <body>
    <div class="sheet">
      <div class="bg"></div><div class="veil"></div>
      <div class="card">
        <h1>Resilience Plan — ${labelFor(scenario)}</h1>
        <div class="muted">Generated ${new Date().toLocaleString()}</div>
        <h2>Why</h2>
        <ul>
          ${answers.feel ? `<li>Before: ${answers.feel}</li>` : ""}
          ${answers.think ? `<li>Trigger thought: ${answers.think}</li>` : ""}
          ${answers.desire ? `<li>In-moment want: ${answers.desire}</li>` : ""}
        </ul>
        <h2>Toolkit</h2>
        <ul>
          ${answers.goal ? `<li>Goal: ${answers.goal}</li>` : ""}
          ${answers.limit ? `<li>Limit/Focus: ${answers.limit}</li>` : ""}
          ${answers.anchor ? `<li>Anchor/Decoy: ${answers.anchor}</li>` : ""}
          ${answers.line ? `<li>Line: ${answers.line}</li>` : ""}
          ${answers.ally ? `<li>Ally: ${answers.ally}${answers.allyPhone ? ` (${answers.allyPhone})` : ""}</li>` : ""}
        </ul>
        ${answers.mantra ? `<h2>Mantra</h2><p>${answers.mantra}</p>` : ""}
        <h2>Share</h2>
        <p class="muted">${getShareUrl(scenario, answers)}</p>
      </div>
    </div>
    <script>window.onload=()=>{setTimeout(()=>window.print(),300)}</script>
  </body></html>`;
  w.document.open();
  w.document.write(html);
  w.document.close();
}