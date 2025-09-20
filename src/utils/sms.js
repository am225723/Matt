import { toast } from "@/components/ui/use-toast";
import { getShareUrl } from "@/utils/share";

export const normalizePhone = (t) => {
  if (!t) return "";
  const k = t.trim();
  const keepPlus = k.startsWith("+");
  const d = k.replace(/\D/g, "");
  return keepPlus ? `+${d}`.replace(/\+\+/g, "+") : d;
};

const buildSmsHref = (phone, body) => {
  const iOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
  const enc = encodeURIComponent(body);
  const tgt = phone ? `sms:${phone}` : "sms:";
  return iOS ? `${tgt}&body=${enc}` : `${tgt}?body=${enc}`;
};

const copyToClipboard = async (t) => {
  try {
    await navigator.clipboard.writeText(t);
    return true;
  } catch {
    return false;
  }
};

export const composeSMS = (scenario, answers, allyMsg, labelFor) => {
  if (!answers.ally && !answers.allyPhone) {
    toast({ title: "Ally Info Missing", description: "Add an ally name or phone first.", variant: "destructive" });
    return;
  }
  const phone = normalizePhone(answers.allyPhone);
  const url = getShareUrl(scenario, answers);
  const parts = [
    `Hey ${answers.ally || "friend"} — quick check-in for ${labelFor(scenario)}.`,
    answers.goal ? `Goal: ${answers.goal}` : "",
    answers.limit ? `Limit/Focus: ${answers.limit}` : "",
    answers.line ? `Line: "${answers.line}"` : "",
    allyMsg ? `Note: ${allyMsg}` : "",
    `Plan: ${url}`,
    "If I waver, please back me up. ❤️"
  ].filter(Boolean);
  const body = parts.join("\n");
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile) {
    copyToClipboard(`${phone ? `To: ${phone}\n` : ""}${body}`).then(ok => toast(ok ? { title: "Copied to Clipboard", description: "Paste into your messaging app." } : { title: "Copy Failed", description: "Couldn’t copy—please paste manually.", variant: "destructive" }));
    return;
  }
  window.location.href = buildSmsHref(phone, body);
};

export const shareLink = (scenario, answers) => {
    const url = getShareUrl(scenario, answers);
    copyToClipboard(url).then(ok => toast(ok ? { title: "Sharable link copied!", description: "You can now share the link with others." } : { title: "Error", description: "Could not copy link. Please copy it manually.", variant: "destructive" }));
};