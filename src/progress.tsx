// progress.tsx — React context replacing the prototype's window globals.
// Holds the active mode and a live copy of that mode's dataset. Toggling a
// checkpoint criterion updates context state, so every consumer (Sidebar
// badge, Checkpoint, Dashboard preview) stays in sync without custom events.

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  getProgress,
  type Mode,
  type ProgressData,
  type Step,
  type Today,
  type Streak,
  type Project,
  type Skill,
  type Persona,
} from "./data";

interface ProgressContextValue {
  mode: Mode;
  setMode: (m: Mode) => void;
  steps: Step[];
  today: Today;
  streak: Streak;
  heatmap: number[];
  projects: Project[];
  skills: Skill[];
  persona: Persona;
  toggleCriterion: (stepN: number, id: string) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("fresh");
  const [data, setData] = useState<ProgressData>(() => getProgress("fresh"));

  const setMode = (m: Mode) => {
    if (m === mode) return;
    setModeState(m);
    setData(getProgress(m));
  };

  const toggleCriterion = (stepN: number, id: string) => {
    setData((prev) => ({
      ...prev,
      steps: prev.steps.map((s) =>
        s.n === stepN && s.checkpointCriteria
          ? {
              ...s,
              checkpointCriteria: s.checkpointCriteria.map((c) =>
                c.id === id ? { ...c, done: !c.done } : c,
              ),
            }
          : s,
      ),
    }));
  };

  const value = useMemo<ProgressContextValue>(
    () => ({
      mode,
      setMode,
      steps: data.steps,
      today: data.today,
      streak: data.streak,
      heatmap: data.heatmap,
      projects: data.projects,
      skills: data.skills,
      persona: data.persona,
      toggleCriterion,
    }),
    [mode, data],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
