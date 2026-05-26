// Dashboard.tsx — the main learner home. Adapts to FRESH and DEMO modes,
// reading everything from the progress context.

import { useProgress } from "../progress";
import { ArrowRight, Bar, Check, ExternalLink, Heatmap, Lock, openLink } from "../primitives";
import type { Step } from "../data";
import type { Screen } from "../App";

const NUM_WORDS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven"];

export function Dashboard({
  onNavigate,
  onJumpToCheckpoint,
  highlightedStepN,
}: {
  onNavigate: (s: Screen) => void;
  onJumpToCheckpoint: () => void;
  highlightedStepN?: number | null;
}) {
  const { steps, today, streak, heatmap, projects } = useProgress();

  const currentStep = steps.find((s) => s.state === "current");
  if (!currentStep) return null;
  const passedCount = steps.filter((s) => s.state === "passed").length;
  const totalCommits = projects.reduce((acc, p) => acc + (p.commits || 0), 0);
  const heatmapAny = heatmap.some((h) => h > 0);

  // Step 1 has weekRange [0,0] — treat as "Day 1"
  const isStartingStep = currentStep.weekRange[0] === 0 && currentStep.weekRange[1] === 0;
  const totalSteps = steps.length;

  const weekLine = isStartingStep ? "day one." : `week ${today.week} of ${today.weekOf}.`;

  const stepCriteriaCount = currentStep.checkpointCriteria?.filter((c) => c.done).length ?? 0;
  const stepCriteriaTotal = currentStep.checkpointCriteria?.length ?? 0;

  return (
    <div className="screen content">
      {/* HERO BANNER */}
      <div className="row between" style={{ alignItems: "flex-end", marginBottom: 28 }}>
        <div>
          <div className="eyebrow">
            Currently · Step {currentStep.n} of {totalSteps}
          </div>
          <h1 className="h-display mt-3" style={{ maxWidth: 720 }}>
            {currentStep.name},<br />
            <em>{weekLine}</em>
          </h1>
          <div className="muted mt-3" style={{ fontSize: 15, maxWidth: 560 }}>
            {currentStep.summary}
          </div>
        </div>
        <div className="col" style={{ alignItems: "flex-end", gap: 8 }}>
          <span className="badge badge--blue">{isStartingStep ? "Just started" : "In progress"}</span>
          <div className="mono fz-12 muted">{today.date}</div>
          <div className="row center gap-3 mt-2">
            <span className="dot dot-blue" />
            <span className="mono fz-11 muted upper">{isStartingStep ? "Welcome · Day 1" : "All systems · synced"}</span>
          </div>
        </div>
      </div>

      <hr className="hr-ink mb-6" />

      {/* MAIN GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 24 }}>
        {/* TODAY'S FOCUS — large card */}
        <div className="card p-6" style={{ display: "flex", flexDirection: "column" }}>
          <div className="row between center mb-4">
            <div className="eyebrow">{isStartingStep ? "Tonight" : "Today's session"}</div>
            <div className="mono fz-11 muted">{today.duration}</div>
          </div>

          <h2 className="h-section" style={{ fontSize: 28, maxWidth: 520 }}>
            {today.taskTitle}
          </h2>
          <div className="mono fz-12 muted mt-2" style={{ letterSpacing: "0.02em" }}>
            <a href="#" className="link" onClick={(e) => { e.preventDefault(); openLink(today.url); }}>
              {today.source}
            </a>
            {!isStartingStep && today.lectureLabel && (
              <>
                <span className="muted" style={{ margin: "0 8px" }}>
                  ·
                </span>
                {today.lectureLabel}
              </>
            )}
          </div>

          <hr className="hr-dash mt-5 mb-5" />

          <div className="eyebrow mb-2">{isStartingStep ? "Tonight's brief" : "What today actually means"}</div>
          <div className="ink" style={{ fontSize: 15, lineHeight: 1.55, maxWidth: 560 }}>
            {today.expected}
          </div>

          <div style={{ flex: 1 }} />

          <hr className="hr mt-6 mb-4" />
          <div className="row between center">
            <div className="muted fz-12">
              Next up · <span className="ink">{today.nextUp}</span>
            </div>
            <div className="row gap-3">
              {projects.length > 0 && (
                <button className="btn btn--ghost btn--sm" onClick={() => onNavigate("portfolio")}>
                  View project
                </button>
              )}
              <button className="btn btn--blue" onClick={() => onNavigate("lesson")}>
                {isStartingStep ? "Open tonight's brief" : "Start session"} <ArrowRight size={13} color="#fff" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col gap-4">
          {/* Obsidian note streak */}
          <div className="card card--ink p-6">
            <div className="row between center">
              <div className="eyebrow" style={{ color: "rgba(245,243,238,0.55)" }}>
                Obsidian note streak
              </div>
              <span className="mono fz-11" style={{ color: "rgba(245,243,238,0.55)" }}>
                non-negotiable
              </span>
            </div>
            <div className="row" style={{ alignItems: "baseline", gap: 10, marginTop: 10 }}>
              <span className="serif" style={{ fontSize: 76, lineHeight: 0.9, fontWeight: 300, color: "var(--paper)", letterSpacing: "-0.04em" }}>
                {streak.days}
              </span>
              <span className="serif" style={{ fontSize: 22, color: "rgba(245,243,238,0.6)", fontStyle: "italic" }}>
                {streak.days === 1 ? "day" : "days"}
              </span>
            </div>
            <div className="fz-12 mt-3" style={{ color: "rgba(245,243,238,0.7)" }}>
              Last note · <span style={{ color: "var(--paper)" }}>{streak.lastNote}</span>
            </div>

            {/* mini 21-day streak strip */}
            <div className="row mt-4" style={{ gap: 3 }}>
              {Array.from({ length: 21 }).map((_, i) => {
                const isStreak = streak.days > 0 && i >= 21 - streak.days;
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 26,
                      background: isStreak ? "var(--paper)" : "rgba(245,243,238,0.12)",
                      borderRadius: 1,
                    }}
                  />
                );
              })}
            </div>
            <div className="row between mt-2" style={{ color: "rgba(245,243,238,0.4)", fontSize: 10, fontFamily: "var(--f-mono)" }}>
              <span>3 weeks ago</span>
              <span>today</span>
            </div>
          </div>

          {/* checkpoint card */}
          <div className="card p-5" style={{ borderLeft: "3px solid var(--blue)" }}>
            <div className="row between center">
              <div className="eyebrow">Next checkpoint</div>
              <span className="badge badge--amber">
                {stepCriteriaCount} / {stepCriteriaTotal} self-assessed
              </span>
            </div>
            <div className="ink fw-500 mt-2" style={{ fontSize: 15 }}>
              Step {currentStep.n} — {currentStep.checkpoint.split(".")[0]}
            </div>
            <div className="muted fz-12 mt-2">
              {currentStep.checkpoint.split(".").slice(1).join(".").trim() || currentStep.summary}
            </div>
            <div className="mt-4 mb-3">
              <Bar value={stepCriteriaCount} max={stepCriteriaTotal || 1} variant="blue" />
            </div>
            <div className="row between center">
              <span className="mono fz-11 muted">Hard gate · no bypass</span>
              <button className="btn btn--ghost btn--sm" onClick={onJumpToCheckpoint}>
                Review criteria
              </button>
            </div>
          </div>

          {/* counters */}
          <div className="row gap-3">
            <div className="card p-4 flex-1">
              <div className="eyebrow">Notes written</div>
              <div className="num ink mt-2 fw-500" style={{ fontSize: 28, lineHeight: 1 }}>
                {streak.notesTotal}
              </div>
              <div className="fz-12 muted mt-1">{streak.notesTotal === 0 ? "tonight's the first" : "since Day 1"}</div>
            </div>
            <div className="card p-4 flex-1">
              <div className="eyebrow">Steps passed</div>
              <div className="num ink mt-2 fw-500" style={{ fontSize: 28, lineHeight: 1 }}>
                {passedCount} / {totalSteps}
              </div>
              <div className="fz-12 muted mt-1">
                {passedCount === 0 ? `step ${currentStep.n} in progress` : `+ step ${currentStep.n} in progress`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GITHUB HEATMAP */}
      <div className="card p-6 mt-8">
        <div className="row between center mb-4">
          <div>
            <div className="eyebrow">GitHub · push consistency</div>
            <div className="serif mt-2 ink" style={{ fontSize: 22, fontWeight: 400 }}>
              {heatmapAny ? (
                <>
                  <span className="num">{totalCommits}</span> commits,{" "}
                  <span className="num">{passedCount > 0 ? 52 : 1}</span> {passedCount > 0 ? "weeks" : "day"}. Shipping
                  beats studying.
                </>
              ) : (
                <>No commits yet. The graph starts the moment you push your first one tonight.</>
              )}
            </div>
          </div>
          <div className="row gap-4 center">
            <Legend />
            <button className="btn btn--ghost btn--sm" onClick={() => openLink("https://github.com")}>
              {heatmapAny ? "priya-mehta on GitHub" : "Set up your GitHub"} <ExternalLink size={10} />
            </button>
          </div>
        </div>
        <hr className="hr-dash mb-4" />
        <div style={{ overflowX: "auto", paddingBottom: 8 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateRows: "repeat(7, 11px)", gap: 3, fontFamily: "var(--f-mono)", fontSize: 9, color: "var(--ink-faint)" }}>
              <span></span>
              <span>Mon</span>
              <span></span>
              <span>Wed</span>
              <span></span>
              <span>Fri</span>
              <span></span>
            </div>
            <Heatmap cells={heatmap} />
          </div>
        </div>
      </div>

      {/* HORIZONTAL STEP PROGRESS TRACK */}
      <div className="mt-10">
        <div className="row between center mb-4">
          <div>
            <div className="eyebrow">Curriculum</div>
            <h3 className="h-section mt-2">
              {passedCount === 0 ? `Seven steps. One starting tonight.` : `Seven steps. ${NUM_WORDS[passedCount - 1]} passed.`}
            </h3>
          </div>
          <div className="muted fz-12">
            <span className="ink num fw-500">{Math.round((passedCount / totalSteps) * 100)}%</span> through the syllabus by
            checkpoints
          </div>
        </div>
        <hr className="hr-ink mb-5" />
        <StepTrack steps={steps} today={today} highlightedStepN={highlightedStepN} />
      </div>

      {/* QUICK ACCESS */}
      <div className="mt-10">
        <div className="row between center mb-4">
          <h3 className="h-section">Quick access</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <QuickCard
            label="AI Tutor"
            tag="Claude-powered"
            desc="Ask anything about today's lecture. It only answers in the vocabulary you've already met."
            mono="claude · haiku 4.5"
            onClick={() => {}}
          />
          <QuickCard
            label="Resource library"
            tag="62 resources"
            desc="Every repo, course, doc, and tool used across all seven steps. Filter by step or status."
            mono="repos · 14   courses · 9   docs · 39"
            onClick={() => {}}
          />
          <QuickCard
            label="My projects"
            tag={projects.length > 0 ? `${projects.length} on GitHub` : "0 · ships from Step 3"}
            desc={
              projects.length > 0
                ? "Titanic classifier · nanoGPT-from-scratch. Push count, last commit, and the checkpoint each ties to."
                : "Projects start appearing in Step 3 — first one is the Titanic classifier. For now, just initialise the repo."
            }
            mono={projects.length > 0 ? `${totalCommits} commits · ${projects.length} repos` : "0 commits · 1 empty repo"}
            onClick={() => onNavigate("portfolio")}
          />
          <QuickCard
            label="Obsidian sync"
            tag={streak.notesTotal > 0 ? "connected" : "vault pending"}
            desc="Your vault streams in. Today's session note auto-creates from the four-prompt template."
            mono={`vault · ai-learning   ${streak.notesTotal} notes`}
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="row center gap-2">
      <span className="mono fz-11 muted">less</span>
      {[0, 1, 2, 3, 4].map((h) => (
        <div key={h} className="heatmap-cell" data-h={h > 0 ? h : undefined} />
      ))}
      <span className="mono fz-11 muted">more</span>
    </div>
  );
}

function QuickCard({
  label,
  tag,
  desc,
  mono,
  onClick,
}: {
  label: string;
  tag: string;
  desc: string;
  mono: string;
  onClick: () => void;
}) {
  return (
    <div
      className="card p-5 cursor-p"
      onClick={onClick}
      style={{ transition: "border-color 120ms, background 120ms" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ink)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}
    >
      <div className="row between center mb-3">
        <div className="ink fw-500" style={{ fontSize: 15 }}>
          {label}
        </div>
        <span className="badge">{tag}</span>
      </div>
      <div className="muted fz-13" style={{ minHeight: 60 }}>
        {desc}
      </div>
      <hr className="hr-dash mt-4 mb-3" />
      <div className="mono fz-11 muted" style={{ letterSpacing: 0 }}>
        {mono}
      </div>
    </div>
  );
}

/* horizontal 7-step track */
function StepTrack({ steps, today, highlightedStepN }: { steps: Step[]; today: { week: number | string }; highlightedStepN?: number | null }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12 }}>
      {steps.map((s) => {
        const isPassed = s.state === "passed";
        const isCurrent = s.state === "current";
        const isLocked = s.state === "locked";

        let progressNow = 0;
        let progressMax = 1;
        let progressLabel = "";
        if (isCurrent) {
          if (s.weekRange[0] === 0 && s.weekRange[1] === 0) {
            progressNow = 0;
            progressMax = 1;
            progressLabel = "Day 1 / 1";
          } else {
            const totalWeeks = s.weekRange[1] - s.weekRange[0] + 1;
            const currentWeek = typeof today.week === "number" ? today.week : s.weekRange[0];
            const weeksIn = Math.max(1, Math.min(totalWeeks, currentWeek - s.weekRange[0] + 1));
            progressNow = weeksIn;
            progressMax = totalWeeks;
            progressLabel = `Week ${weeksIn} / ${totalWeeks}`;
          }
        }

        const isHighlighted = highlightedStepN === s.n;
        return (
          <div
            key={s.n}
            style={{
              background: isCurrent ? "var(--surface)" : isPassed ? "var(--surface-alt)" : "transparent",
              border: "2px solid " + (isHighlighted ? "var(--blue)" : isCurrent ? "var(--ink)" : "var(--line)"),
              borderRadius: 2,
              padding: "14px 14px 16px",
              position: "relative",
              cursor: isLocked ? "default" : "pointer",
              opacity: isLocked ? 0.55 : 1,
              transition: "border-color 200ms",
            }}
          >
            <div className="row between center">
              <span
                className="serif"
                style={{ fontSize: 26, fontWeight: 300, color: isPassed || isCurrent ? "var(--ink)" : "var(--ink-faint)", letterSpacing: "-0.03em" }}
              >
                {String(s.n).padStart(2, "0")}
              </span>
              {isPassed && (
                <span className="badge badge--green">
                  <Check size={9} color="#1F7A4D" /> passed
                </span>
              )}
              {isCurrent && <span className="badge badge--blue">now</span>}
              {isLocked && <Lock size={11} color="#9AA1B1" />}
            </div>
            <div className="ink fw-500 mt-3" style={{ fontSize: 13, lineHeight: 1.25, minHeight: 32 }}>
              {s.name}
            </div>
            <div className="mono fz-11 muted mt-2" style={{ letterSpacing: "0.04em" }}>
              {s.weeks}
            </div>

            {isCurrent && (
              <div className="mt-3">
                <Bar value={progressNow} max={progressMax} variant="blue" />
                <div className="mono fz-11 muted mt-2">{progressLabel}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
