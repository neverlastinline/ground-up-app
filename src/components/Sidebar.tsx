// Sidebar.tsx — persistent left rail with 7-step tracker

import { useProgress } from "../progress";
import { Check, Lock } from "../primitives";
import type { Step } from "../data";
import type { Screen } from "../App";

function checkpointBadge(steps: Step[]): string | null {
  const cur = steps.find((s) => s.state === "current");
  if (!cur || !cur.checkpointCriteria) return null;
  const done = cur.checkpointCriteria.filter((c) => c.done).length;
  const total = cur.checkpointCriteria.length;
  return `${done}/${total}`;
}

export function Sidebar({
  onNavigate,
  onJumpToStep,
  screen,
}: {
  onNavigate: (s: Screen) => void;
  onJumpToStep: (n: number) => void;
  screen: Screen;
}) {
  const { steps, persona } = useProgress();

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div className="brand-wordmark">
          Ground Up<span className="dot"></span>
        </div>
        <div className="brand-sub">14 weeks · zero → deployed</div>
      </div>

      <nav className="step-track">
        <div className="eyebrow" style={{ padding: "8px 22px 4px" }}>
          Curriculum
        </div>
        {steps.map((s) => {
          const isCurrent = s.state === "current";
          const isLocked = s.state === "locked";
          const isPassed = s.state === "passed";
          return (
            <div
              key={s.n}
              className={
                "step-row " +
                (isCurrent ? "is-current " : "") +
                (isLocked ? "is-locked " : "") +
                (isPassed ? "is-passed " : "")
              }
              onClick={() => !isLocked && onJumpToStep(s.n)}
            >
              <div className="step-num">{String(s.n).padStart(2, "0")}</div>
              <div className="step-meta">
                <div className="step-name">{s.name}</div>
                <div className="step-weeks">{s.weeks}</div>
              </div>
              <div className={"step-state " + s.state}>
                {isPassed && <Check size={10} color="#1F7A4D" />}
                {isCurrent && <span className="dot dot-blue"></span>}
                {isLocked && <Lock size={11} color="#9AA1B1" />}
              </div>
            </div>
          );
        })}
      </nav>

      <div style={{ padding: "12px 22px 18px" }}>
        <hr className="hr-dash mb-3" />
        <div className="eyebrow mb-2">Quick access</div>
        <SidebarLink label="Dashboard" active={screen === "dashboard"} onClick={() => onNavigate("dashboard")} />
        <SidebarLink label="Today's session" active={screen === "lesson"} onClick={() => onNavigate("lesson")} />
        <SidebarLink
          label="Checkpoint"
          active={screen === "checkpoint"}
          onClick={() => onNavigate("checkpoint")}
          badge={checkpointBadge(steps)}
        />
        <SidebarLink label="Portfolio" active={screen === "portfolio"} onClick={() => onNavigate("portfolio")} />
        <SidebarLink label="Resource library" onClick={() => {}} muted />
        <SidebarLink label="Obsidian sync" onClick={() => {}} muted suffix="connected" />
      </div>

      <div className="sidebar-foot">
        <div className="row center between">
          <div className="row center gap-3">
            <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>
              {persona.initials}
            </div>
            <div>
              <div className="fz-12 ink fw-500">{persona.name}</div>
              <div className="mono fz-11 muted" style={{ letterSpacing: 0 }}>
                {persona.role || "10 hrs / week"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  label,
  active,
  onClick,
  badge,
  suffix,
  muted,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: string | null;
  suffix?: string;
  muted?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className="row center between"
      style={{
        padding: "7px 0",
        cursor: muted ? "default" : "pointer",
        color: active ? "var(--ink)" : muted ? "var(--ink-faint)" : "var(--ink-soft)",
        fontWeight: active ? 500 : 400,
        fontSize: 13,
      }}
    >
      <span className="row center gap-3">
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: active ? "var(--blue)" : "transparent",
          }}
        />
        {label}
      </span>
      {badge && <span className="badge badge--blue">{badge}</span>}
      {suffix && <span className="mono fz-11 muted">{suffix}</span>}
    </div>
  );
}
