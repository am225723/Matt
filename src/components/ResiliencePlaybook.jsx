import React, { useMemo, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

import { SCENARIOS, pickBg, labelFor, helperText, aiHelpers, ACCOUNTABILIBUDDY_NAME, ACCOUNTABILIBUDDY_PHONE, LEFT_DOCK_SCENARIOS } from "@/utils/scenarioHelpers";
import { normalizePhone, buildSmsHref, copyToClipboard, getShareUrl, exportPdf, dec } from "@/utils/helpers";
import { savePlanToLibrary } from "@/utils/planLibraryStorage";
import { awardBadge } from "@/utils/gamificationStorage";

import { ScenarioSelection } from './steps/ScenarioSelection';
import { WhyMap } from './steps/WhyMap';
import { Toolkit } from './steps/Toolkit';
import { PracticeRound } from './steps/PracticeRound';
import { ConfidenceBuilder } from './steps/ConfidenceBuilder';
import { Debrief } from './steps/Debrief';

export default function ResiliencePlaybook({ plan, onBack }) {
  const [scenario, setScenario] = useState("custom");
  const [step, setStep] = useState(1);
  const total = 6;
  const [answers, setAnswers] = useState({
    ally: ACCOUNTABILIBUDDY_NAME,
    allyPhone: ACCOUNTABILIBUDDY_PHONE,
  });
  const [hasSaved, setHasSaved] = useState(false);
  const [allyMsg, setAllyMsg] = useState("");

  const [immersive, setImmersive] = useState(true);
  const [panelAlpha, setPanelAlpha] = useState(0.8);
  const [overlayAlpha, setOverlayAlpha] = useState(0.08);

  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key.toLowerCase() === "m") setIsMinimized(v => !v); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (plan) {
      setScenario(plan.scenario);
      setAnswers(plan.answers);
      setStep(2); // Start at the WhyMap step
      toast({
        title: "Plan Loaded",
        description: "A resilience plan has been loaded from your library.",
      });
    }
  }, [plan]);

  const bgUrl = useMemo(() => pickBg(scenario), [scenario]);
  const progressPct = ((step - 1) / (total - 1)) * 100;

  const blurAmount = immersive ? 3 : 5;
  const panelWidth = immersive ? 520 : 860;

  useEffect(() => {
    setHasSaved(!!localStorage.getItem("resiliencePlan"));
    const h = window.location.hash.match(/plan=([^&]+)/)?.[1];
    if (h) {
      const data = dec(h);
      if (data) {
        if (data.scenario) setScenario(data.scenario);
        setAnswers((a) => ({
          ...a,
          goal: data.goal,
          limit: data.limit,
          anchor: data.anchor,
          line: data.line,
          ally: data.ally,
          allyPhone: data.allyPhone,
          mantra: data.mantra,
          feel: data.why?.feel,
          think: data.why?.think,
          desire: data.why?.desire,
          proud: data.debrief?.proud,
          tweak: data.debrief?.tweak,
        }));
        setStep(5);
        toast({
          title: "Shared Plan Loaded!",
          description: "A resilience plan has been loaded from the URL.",
        });
      }
    }
  }, []);

  const resumePlan = () => {
    const s = localStorage.getItem("resiliencePlan");
    if (!s) return;
    try {
      const d = JSON.parse(s);
      if (d?.scenario) setScenario(d.scenario);
      setAnswers((a) => ({
        ...a,
        goal: d.goal,
        limit: d.limit,
        anchor: d.anchor,
        line: d.line,
        ally: d.ally,
        allyPhone: d.allyPhone,
        mantra: d.mantra,
        feel: d.why?.feel,
        think: d.why?.think,
        desire: d.why?.desire,
        proud: d.debrief?.proud,
        tweak: d.debrief?.tweak,
      }));
      setStep(2);
      toast({
        title: "Plan Resumed",
        description: "Your previous resilience plan has been loaded.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not load the saved plan.",
        variant: "destructive",
      });
    }
  };

  const handleSaveToLibrary = () => {
    const name = prompt("Enter a name for your plan:", `Plan for ${labelFor(scenario)}`);
    if (!name) return;

    const payload = {
      name,
      scenario,
      answers,
    };
    savePlanToLibrary(payload);
    setHasSaved(true);
    toast({
      title: "Plan Saved to Library!",
      description: "Your resilience plan has been saved to your library.",
    });

    const badgeKey = `badge_${scenario}`;
    if (awardBadge(badgeKey)) {
      toast({
        title: "New Badge Unlocked!",
        description: `You've earned the "${labelFor(scenario)} Navigator" badge!`,
      });
    }
  };

  const shareLink = () => {
    const url = getShareUrl(scenario, answers);
    copyToClipboard(url).then((ok) =>
      toast(
        ok
          ? {
              title: "Sharable link copied!",
              description: "You can now share the link with others.",
            }
          : {
              title: "Error",
              description: "Could not copy link. Please copy it manually.",
              variant: "destructive",
            }
      )
    );
  };

  const composeSMS = () => {
    if (!answers.ally && !answers.allyPhone) {
      toast({
        title: "Ally Info Missing",
        description: "Add an ally name or phone first.",
        variant: "destructive",
      });
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
      "If I waver, please back me up. ❤️",
    ].filter(Boolean);
    const body = parts.join("\n");
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) {
      copyToClipboard(`${phone ? `To: ${phone}\n` : ""}${body}`).then((ok) =>
        toast(
          ok
            ? {
                title: "Copied to Clipboard",
                description: "Paste into your messaging app.",
              }
            : {
                title: "Copy Failed",
                description: "Couldn’t copy—please paste manually.",
                variant: "destructive",
              }
        )
      );
      return;
    }
    window.location.href = buildSmsHref(phone, body);
  };

  const styles = {
    minBtn: {
      position: "fixed", top: 12, right: 12, zIndex: 9999,
      background: "rgba(255,255,255,.9)", color: "#111",
      border: "1px solid rgba(0,0,0,.15)", borderRadius: 999,
      padding: "8px 12px", cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,.18)"
    },
  };

  const aiSuggestions = useMemo(() => aiHelpers(scenario, answers), [
    scenario,
    answers,
  ]);
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ScenarioSelection
            scenarios={SCENARIOS}
            activeScenario={scenario}
            setScenario={setScenario}
            hasSaved={hasSaved}
            onContinue={() => setStep(2)}
            onResume={resumePlan}
          />
        );
      case 2:
        return (
          <WhyMap
            answers={answers}
            setAnswers={setAnswers}
            setStep={setStep}
            helperText={helperText(scenario)}
            aiSuggestions={aiSuggestions}
            labelForScenario={labelFor(scenario)}
          />
        );
      case 3:
        return (
          <Toolkit
            answers={answers}
            setAnswers={setAnswers}
            setStep={setStep}
            helperText={helperText(scenario)}
            allyMsg={allyMsg}
            setAllyMsg={setAllyMsg}
            onComposeSMS={composeSMS}
          />
        );
      case 4:
        return <PracticeRound setStep={setStep} label={labelFor(scenario)} />;
      case 5:
        return (
          <ConfidenceBuilder
            answers={answers}
            setAnswers={setAnswers}
            setStep={setStep}
          />
        );
      case 6:
        return (
          <Debrief
            answers={answers}
            setAnswers={setAnswers}
            setStep={setStep}
            onSave={handleSaveToLibrary}
            onShare={shareLink}
            onExportPdf={() => exportPdf(bgUrl, scenario, answers, labelFor)}
          />
        );
      default:
        return <Button onClick={() => setStep(1)}>Start Over</Button>;
    }
  };

  return (
    <div
      className="min-h-screen relative p-6 bg-cover bg-center animate-bgMove"
      style={{ backgroundImage: `url(${bgUrl})`, backgroundAttachment: "fixed" }}
    >
      <style>{`@keyframes bgMove{0%{background-size:102%}100%{background-size:108%}}`}</style>
      <button
        onClick={() => setIsMinimized(v => !v)}
        style={styles.minBtn}
        aria-label={isMinimized ? "Show panel (M)" : "Hide panel (M)"}
        title={isMinimized ? "Show panel (M)" : "Hide panel (M)"}
      >
        {isMinimized ? "Show Panel" : "Hide Panel"}
      </button>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,${overlayAlpha}), rgba(255,255,255,${overlayAlpha}))`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          background:
            "radial-gradient(90% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.14) 100%)",
        }}
      />

      {!isMinimized && (() => {
        const right = !LEFT_DOCK_SCENARIOS.has(scenario);
        const panelStyle = {
          width: "100%",
          maxWidth: panelWidth,
          margin: right ? "0 2rem 0 auto" : "0 auto 0 2rem",
          background: `rgba(255,255,255,${panelAlpha})`,
          color: "black",
          border: "1px solid rgba(233,242,242,.9)",
          backdropFilter: `saturate(1.05) blur(${blurAmount}px)`,
          transition: "all 0.5s ease-in-out",
        };
        return (
          <div style={panelStyle} className="relative z-10 rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" onClick={onBack}>Return to Dashboard</Button>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center mb-4 flex-wrap">
              <div className="text-sm font-medium text-black opacity-85">
                Step {step} of {total}
              </div>
              <div className="h-2 bg-[#e9f2f2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#006E6D] transition-[width] duration-350"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-center gap-2 ml-3 flex-wrap text-black">
                <label className="text-xs opacity-80 flex items-center gap-1.5">
                  Immersive
                  <Switch checked={immersive} onCheckedChange={setImmersive} />
                </label>
                <label className="text-xs opacity-80 flex items-center gap-1.5">
                  Panel
                  <Slider
                    min={0.35}
                    max={0.9}
                    step={0.01}
                    value={[panelAlpha]}
                    onValueChange={(v) => setPanelAlpha(v[0])}
                    className="w-[110px]"
                  />
                </label>
                <label className="text-xs opacity-80 flex items-center gap-1.5">
                  Overlay
                  <Slider
                    min={0}
                    max={0.35}
                    step={0.01}
                    value={[overlayAlpha]}
                    onValueChange={(v) => setOverlayAlpha(v[0])}
                    className="w-[110px]"
                  />
                </label>
              </div>
            </div>
            {renderStep()}
          </div>
        );
      })()}
    </div>
  );
}