import { toast } from "@/components/ui/use-toast";

export const normalizePhone = (t) => {
  if (!t) return "";
  const k = t.trim();
  const keepPlus = k.startsWith("+");
  const d = k.replace(/\D/g, "");
  return keepPlus ? `+${d}`.replace(/\+\+/g, "+") : d;
};

export const buildSmsHref = (phone, body) => {
  const iOS = /iPad|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const enc = encodeURIComponent(body);
  const tgt = phone ? `sms:${phone}` : "sms:";
  return iOS ? `${tgt}&body=${enc}` : `${tgt}?body=${enc}`;
};

export const copyToClipboard = async (t) => {
  try {
    await navigator.clipboard.writeText(t);
    return true;
  } catch {
    return false;
  }
};

export const enc = (obj) => {
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

export function getShareUrl(scenario, a) {
  const payload = {
    scenario,
    goal: a.goal,
    limit: a.limit,
    anchor: a.anchor,
    line: a.line,
    ally: a.ally,
    allyPhone: a.allyPhone,
    why: { feel: a.feel, think: a.think, desire: a.desire },
    debrief: { proud: a.proud, tweak: a.tweak },
    mantra: a.mantra,
    ts: new Date().toISOString(),
  };
  return `${window.location.origin}/viewer#plan=${enc(payload)}`;
}

export function exportPdf(bgUrl, scenario, a, labelFor) {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) {
    toast({
      title: "Popup blocked",
      description: "Allow popups to export PDF.",
      variant: "destructive",
    });
    return;
  }
  const css = `
  @page{size:letter portrait;margin:0}
  body{margin:0}
  .sheet{width:8.5in;height:5.5in;position:relative;overflow:hidden}
  .bg{position:absolute;inset:0;background:url('${bgUrl}') center/cover no-repeat;filter:none}
  .veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.18))}
  .card{position:absolute;right:.35in;top:.35in;bottom:.35in;left:50%;background:rgba(255,255,255,.82);backdrop-filter:blur(3px);border-radius:14px;padding:.35in;border:1px solid rgba(230,240,240,.9);font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,sans-serif;color:black}
  h1{margin:0 0 .1in 0;font-size:18px;color:black}
  h2{margin:.1in 0 0;font-size:13px;color:black}
  p,li,div,span{font-size:12px;line-height:1.3;color:black}
  ul{margin:.05in 0 .1in 1em;padding:0;color:black}
  .muted{opacity:.85;color:black}
  `;
  const shareUrlForPdf = getShareUrl(scenario, a);
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
          ${a.feel ? `<li>Before: ${a.feel}</li>` : ""}
          ${a.think ? `<li>Trigger thought: ${a.think}</li>` : ""}
          ${a.desire ? `<li>In-moment want: ${a.desire}</li>` : ""}
        </ul>
        <h2>Toolkit</h2>
        <ul>
          ${a.goal ? `<li>Goal: ${a.goal}</li>` : ""}
          ${a.limit ? `<li>Limit/Focus: ${a.limit}</li>` : ""}
          ${a.anchor ? `<li>Anchor/Decoy: ${a.anchor}</li>` : ""}
          ${a.line ? `<li>Line: ${a.line}</li>` : ""}
          ${a.ally ? `<li>Ally: ${a.ally}${a.allyPhone ? ` (${a.allyPhone})` : ""}</li>` : ""}
        </ul>
        ${a.mantra ? `<h2>Mantra</h2><p>${a.mantra}</p>` : ""}
        <h2>Share</h2>
        <p class="muted" style="word-break: break-all;">${shareUrlForPdf}</p>
      </div>
    </div>
    <script>window.onload=()=>{setTimeout(()=>window.print(),300)}</script>
  </body></html>`;
  w.document.open();
  w.document.write(html);
  w.document.close();
}