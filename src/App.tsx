// App.tsx — root, navigation, topbar.
// The progress context owns the fresh/demo mode; switching it swaps the
// dataset every screen reads from. Routed content is keyed by mode so each
// screen's local state resets cleanly on toggle.

import { useState } from "react";
import { ProgressProvider, useProgress } from "./progress";
import { Sidebar } from "./components/Sidebar";
import { Landing } from "./components/Landing";
import { Onboarding } from "./components/Onboarding";
import { Dashboard } from "./components/Dashboard";
import { Lesson } from "./components/Lesson";
import { Checkpoint, CheckpointPassed } from "./components/Checkpoint";
import { Portfolio } from "./components/Portfolio";
import { ObsidianPanel } from "./components/ObsidianPanel";
import type { Mode } from "./data";

export type Screen = "landing" | "onboarding" | "dashboard" | "lesson" | "checkpoint" | "portfolio" | "passed";

export default function App() {
  return (
    <ProgressProvider>
      <AppInner />
    </ProgressProvider>
  );
}

function AppInner() {
  const { mode, setMode, steps, streak, persona } = useProgress();
  const [screen, setScreen] = useState<Screen>("landing");
  // Tracks which step was clicked in the sidebar so Dashboard can highlight it.
  const [highlightedStepN, setHighlightedStepN] = useState<number | null>(null);
  const [showObsidian, setShowObsidian] = useState(false);

  const currentStepN = steps.find((s) => s.state === "current")?.n ?? 1;

  const titles: Partial<Record<Screen, [string, string]>> = {
    dashboard: ["Dashboard", mode === "demo" ? "Wk 7 · Karpathy" : "Day 1 · setup"],
    lesson: ["Today's session", mode === "demo" ? "Karpathy · Lecture 4" : "Tonight's installs"],
    checkpoint: [`Checkpoint · Step ${currentStepN}`, "Hard gate"],
    portfolio: ["Portfolio", "GitHub + skills"],
    passed: [`Step ${currentStepN}`, "Cleared"],
  };

  const onJumpToStep = (n: number) => {
    const s = steps.find((st) => st.n === n);
    if (!s || s.state === "locked") return;
    setHighlightedStepN(n);
    setScreen("dashboard");
  };

  if (screen === "landing") {
    return <Landing onContinue={() => setScreen("onboarding")} />;
  }

  if (screen === "onboarding") {
    return (
      <Onboarding
        onComplete={() => {
          // ensure fresh state when arriving from onboarding
          setMode("fresh");
          setScreen("dashboard");
        }}
      />
    );
  }

  return (
    <>
      <div className="app-shell">
        <Sidebar onNavigate={setScreen} onJumpToStep={onJumpToStep} screen={screen} onObsidianSync={() => setShowObsidian(true)} />

        <div className="main-col">
          <div className="topbar">
            <div className="topbar-left">
              <div className="crumbs">
                <span>Ground Up</span>
                <span className="sep">/</span>
                <span className="cur">{titles[screen]?.[0]}</span>
                {titles[screen]?.[1] && (
                  <>
                    <span className="sep">·</span>
                    <span>{titles[screen]![1]}</span>
                  </>
                )}
              </div>
            </div>
            <div className="row center gap-4">
              <ModeToggle mode={mode} onChange={setMode} />
              <div className="row center gap-3">
                <span className="dot" style={{ background: streak.days > 0 ? "var(--green)" : "var(--line-strong)" }} />
                <span className="mono fz-11 muted upper">
                  {streak.days > 0 ? `Streak · ${streak.days} days` : "Streak · not started"}
                </span>
              </div>
              <button className="btn btn--ghost btn--sm" onClick={() => setScreen("onboarding")} title="Restart from onboarding">
                Re-calibrate
              </button>
              <div className="avatar">{persona.initials}</div>
            </div>
          </div>

          <div key={mode} style={{ display: "contents" }}>
            {screen === "dashboard" && <Dashboard onNavigate={(s) => { setHighlightedStepN(null); setScreen(s); }} onJumpToCheckpoint={() => setScreen("checkpoint")} highlightedStepN={highlightedStepN} onSelectStep={setHighlightedStepN} />}
            {screen === "lesson" && <Lesson onNavigate={setScreen} onObsidianSync={() => setShowObsidian(true)} />}
            {screen === "checkpoint" && <Checkpoint onNavigate={setScreen} onPassed={() => setScreen("passed")} />}
            {screen === "portfolio" && <Portfolio onNavigate={setScreen} />}
            {screen === "passed" && <CheckpointPassed onContinue={() => setScreen("dashboard")} />}
          </div>
        </div>
      </div>
      {showObsidian && <ObsidianPanel onClose={() => setShowObsidian(false)} />}
    </>
  );
}

/* Segmented mode toggle in the topbar.
   Fresh = the learner's real state (post-onboarding).
   Demo  = Priya at Wk 7 — used to show off checkpoint/portfolio. */
function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const opt = (key: Mode, label: string, sub: string) => (
    <button
      key={key}
      onClick={() => onChange(key)}
      style={{
        background: mode === key ? "var(--ink)" : "transparent",
        color: mode === key ? "var(--paper)" : "var(--ink-soft)",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
        fontFamily: "var(--f-mono)",
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        borderRadius: 1,
        transition: "all 120ms",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
      title={sub}
    >
      <span>{label}</span>
    </button>
  );
  return (
    <div
      className="row"
      style={{ background: "var(--surface-tint)", border: "1px solid var(--line)", borderRadius: 2, padding: 2, gap: 2 }}
      title="Switch between your real state and Priya's Week 7 demo"
    >
      {opt("fresh", "You · Day 1", "Your actual progress")}
      {opt("demo", "Demo · Wk 7", "Priya Mehta walkthrough")}
    </div>
  );
}
