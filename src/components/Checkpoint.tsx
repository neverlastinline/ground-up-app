// Checkpoint.tsx — the hard gate. Step-aware: pulls criteria + guidance from
// the current step's data. Criteria live in the progress context, so ticking
// one keeps the Sidebar badge and Dashboard preview in sync.

import { useState, type MouseEvent } from "react";
import { useProgress } from "../progress";
import { ArrowRight, ExternalLink, openLink, Checkbox } from "../primitives";
import type { CheckpointCriterion } from "../data";
import type { Screen } from "../App";

export function Checkpoint({ onNavigate, onPassed }: { onNavigate: (s: Screen) => void; onPassed: () => void }) {
  const { steps, toggleCriterion } = useProgress();
  const step = steps.find((s) => s.state === "current")!;
  const criteria = step.checkpointCriteria || [];
  const [passing, setPassing] = useState(false);

  const allDone = criteria.length > 0 && criteria.every((c) => c.done);
  const count = criteria.filter((c) => c.done).length;

  const handleAttempt = () => {
    if (!allDone) return;
    setPassing(true);
    setTimeout(() => onPassed(), 1400);
  };

  return (
    <div className="screen content">
      {/* HEADER */}
      <div className="row between" style={{ alignItems: "flex-end", marginBottom: 28 }}>
        <div>
          <div className="row center gap-3">
            <span className="eyebrow">Checkpoint</span>
            <span className="dot dot-muted" />
            <span className="mono fz-11 muted upper">
              Step {step.n} of 7 · {step.name}
            </span>
          </div>
          <h1 className="h-display mt-3" style={{ maxWidth: 760 }}>
            Can you prove<br />
            <em>you actually understand it?</em>
          </h1>
          <div className="muted mt-3" style={{ fontSize: 15, maxWidth: 580 }}>
            Tick each criterion you can <span className="ink">genuinely</span> do — not the ones you've watched a lecture
            on. The point of this gate is to keep you honest with yourself.
          </div>
        </div>
        <div className="col" style={{ alignItems: "flex-end", gap: 6 }}>
          <span className="badge badge--amber">
            <span className="num">{count}</span> / <span className="num">{criteria.length}</span> self-assessed
          </span>
          <div className="mono fz-11 muted">no skip button · by design</div>
        </div>
      </div>

      <hr className="hr-ink" />

      {/* CRITERIA */}
      <div className="mt-8" style={{ maxWidth: 860 }}>
        <div className="eyebrow mb-4">Pass criteria</div>
        <div className="col gap-3">
          {criteria.map((c, i) => (
            <div
              key={c.id}
              className={"card p-5 " + (passing && c.done ? "flash-green" : "")}
              style={{
                background: c.done ? "var(--surface-alt)" : "var(--surface)",
                borderColor: c.done ? "var(--green)" : "var(--line)",
                cursor: "pointer",
                transition: "border-color 240ms, background 240ms",
              }}
              onClick={() => toggleCriterion(step.n, c.id)}
            >
              <div className="row gap-5" style={{ alignItems: "flex-start" }}>
                <Checkbox
                  checked={c.done}
                  variant="green"
                  onClick={(e: MouseEvent) => { e.stopPropagation(); toggleCriterion(step.n, c.id); }}
                />
                <div className="grow">
                  <div className="row between center mb-2">
                    <span className="mono fz-11 muted" style={{ letterSpacing: "0.06em" }}>
                      Criterion {String(i + 1).padStart(2, "0")}
                    </span>
                    {!c.done && <span className="mono fz-11 muted">unticked</span>}
                    {c.done && <span className="badge badge--green">I can do this</span>}
                  </div>
                  <div className="serif" style={{ fontSize: 19, color: "var(--ink)", lineHeight: 1.35, letterSpacing: "-0.005em" }}>
                    {c.text}
                  </div>
                  {!c.done && <CriterionGuidance stepN={step.n} idx={i} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="hr mt-8 mb-6" style={{ maxWidth: 860 }} />

      {/* OUTCOME / CTA */}
      <div style={{ maxWidth: 860 }}>
        {allDone ? (
          <PassPanel stepN={step.n} onAttempt={handleAttempt} passing={passing} />
        ) : (
          <FailPanel
            stepN={step.n}
            count={count}
            total={criteria.length}
            unticked={criteria.filter((c) => !c.done)}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
}

/* per-step "if you can't yet" hints */
const GUIDANCE: Record<number, string[]> = {
  1: [
    "Re-run the installer. If `python --version` doesn't return 3.11+, fix that before bed — every later step depends on it.",
    "Open the four signup pages in tabs. They're free; the IBM one is audit mode. Don't optimise — just create the accounts.",
    "Make the vault, then drag the session-note template into /sessions/ and pin it. Five minutes max.",
    "Run `git init`, `git add .`, `git commit -m 'first commit'`, push to a new repo on github.com. The README is one sentence.",
  ],
  4: [
    "If you can't, go back to Karpathy Lecture 2 — micrograd — and re-derive ∂L/∂w for a single neuron on paper.",
    "If your repo doesn't generate text yet, that's the lecture you finish next. The README must show one sample.",
    "If unclear, watch Lecture 6 (attention) again with a notebook open. Implement scaled dot-product attention before ticking.",
    "Run `ollama run llama3.2:3b` in a terminal. Ask it to explain backprop. Note one thing it says that you can refute.",
  ],
};

function CriterionGuidance({ stepN, idx }: { stepN: number; idx: number }) {
  const tips = GUIDANCE[stepN] || [];
  const tip = tips[idx];
  if (!tip) return null;
  return (
    <div className="mt-3" style={{ background: "var(--surface-tint)", borderLeft: "2px solid var(--line-strong)", padding: "10px 14px", borderRadius: 2 }}>
      <div className="eyebrow mb-2">If you can't yet</div>
      <div className="muted fz-13">{tip}</div>
    </div>
  );
}

function PassPanel({ stepN, onAttempt, passing }: { stepN: number; onAttempt: () => void; passing: boolean }) {
  const next = stepN + 1;
  return (
    <div className="card p-6" style={{ borderColor: "var(--green)", background: "var(--green-soft)" }}>
      <div className="row between center">
        <div>
          <div className="eyebrow" style={{ color: "var(--green)" }}>
            All criteria ticked
          </div>
          <h2 className="h-section mt-2" style={{ color: "var(--green)" }}>
            You're ready to claim Step {stepN}.
          </h2>
          <div className="ink fz-13 mt-3" style={{ maxWidth: 540 }}>
            Earned, not given. Step {next} unlocks immediately. You can still revisit Step {stepN} materials any time —
            but tomorrow your dashboard wakes up in Step {next}.
          </div>
        </div>
        <button className="btn btn--green btn--lg" onClick={onAttempt} disabled={passing}>
          {passing ? `Step complete — unlocking Step ${next}…` : `Pass Step ${stepN} → unlock Step ${next}`}
        </button>
      </div>
    </div>
  );
}

function FailPanel({
  stepN,
  count,
  total,
  unticked,
  onNavigate,
}: {
  stepN: number;
  count: number;
  total: number;
  unticked: CheckpointCriterion[];
  onNavigate: (s: Screen) => void;
}) {
  const map = REVISIT[stepN] || {};
  return (
    <div>
      <div className="card p-5" style={{ background: "var(--surface-alt)", borderColor: "var(--line)" }}>
        <div className="row between center">
          <div>
            <div className="eyebrow">Not yet</div>
            <div className="ink fw-500 mt-2" style={{ fontSize: 16 }}>
              <span className="num">{total - count}</span> criteri{total - count === 1 ? "on" : "a"} still unticked. Go
              back — here's what to review.
            </div>
            <div className="muted fz-13 mt-2" style={{ maxWidth: 580 }}>
              No judgement here. Self-assessing as "not yet" is the whole point of the gate. Click an item below to jump
              back into the relevant material.
            </div>
          </div>
          <button className="btn btn--ghost" onClick={() => onNavigate("dashboard")}>
            ← Back to dashboard
          </button>
        </div>
      </div>

      <div className="mt-5">
        <div className="eyebrow mb-3">Where to go now</div>
        <div className="col">
          {unticked.map((c, i) => (
            <div key={c.id} className="row center between" style={{ padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
              <div className="row gap-4 center grow" style={{ minWidth: 0 }}>
                <span className="mono fz-11 muted" style={{ letterSpacing: "0.06em", minWidth: 22 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div className="ink fz-14 fw-500" style={{ lineHeight: 1.3 }}>
                    {c.text}
                  </div>
                  <div className="mono fz-11 muted mt-2">{map[c.id]?.where || "Revisit step materials"}</div>
                </div>
              </div>
              <div className="row gap-2">
                <button className="btn btn--ghost btn--sm" onClick={() => openLink(map[c.id]?.url)}>
                  Open resource <ExternalLink size={10} />
                </button>
                <button className="btn btn--sm" onClick={() => onNavigate("lesson")}>
                  Open in session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const REVISIT: Record<number, Record<string, { where: string; url: string }>> = {
  1: {
    f1: { where: "python.org · code.visualstudio.com · obsidian.md · ollama.com", url: "https://python.org" },
    f2: { where: "anthropic.com/learn · openai.com · coursera.org", url: "https://anthropic.com/learn" },
    f3: { where: "obsidian.md · vault structure docs", url: "https://help.obsidian.md" },
    f4: { where: "github.com · new repository", url: "https://github.com/new" },
  },
  4: {
    c1: { where: "karpathy/nn-zero-to-hero · Lecture 2 — micrograd", url: "https://github.com/karpathy/nn-zero-to-hero" },
    c2: { where: "karpathy/nn-zero-to-hero · Lecture 7 — Let's build GPT", url: "https://github.com/karpathy/nn-zero-to-hero" },
    c3: { where: "karpathy/nn-zero-to-hero · Lecture 6 — attention", url: "https://github.com/karpathy/nn-zero-to-hero" },
    c4: { where: "ollama · ollama run llama3.2:3b", url: "https://ollama.com" },
  },
};

/* PASSED state — celebratory full-screen card */
export function CheckpointPassed({ onContinue }: { onContinue: () => void }) {
  const { steps } = useProgress();
  const step = steps.find((s) => s.state === "current");
  const next = step ? step.n + 1 : 2;
  const nextStep = steps.find((s) => s.n === next);

  const blurbs: Record<number, string> = {
    1: "Tools installed. Accounts live. The vault has its first note. From here on, every minute is real learning.",
    2: "You can name what a token is, why transformers won, what a logit does. The vocabulary stops being a wall.",
    3: "You trained a real model on a real dataset. Gradient descent isn't a metaphor anymore.",
    4: "You wrote a transformer line by line. Backprop, attention, tokenisation. From now on, every API call to Claude is a thing you actually understand.",
    5: "RAG over your own vault. You can read a fine-tuning paper without it feeling like another language.",
    6: "An agent that uses MCP, holds memory, and routes through tools. The 2026 standard, built by you.",
    7: "Deployed. Evaluated. Red-teamed. The portfolio works without you in the room.",
  };

  return (
    <div className="screen content">
      <div
        className="card flash-green"
        style={{ background: "var(--green-soft)", borderColor: "var(--green)", padding: 56, textAlign: "center", maxWidth: 760, margin: "60px auto 0" }}
      >
        <div className="eyebrow" style={{ color: "var(--green)" }}>
          Step {String(step?.n ?? 1).padStart(2, "0")} · Cleared
        </div>
        <h1 className="h-display mt-4" style={{ color: "var(--green)" }}>
          Built. From <em>ground up.</em>
        </h1>
        <p className="muted mt-4" style={{ maxWidth: 480, margin: "16px auto 0", fontSize: 15 }}>
          {blurbs[step?.n ?? 1]}
        </p>
        <hr className="hr-dash mt-6 mb-4" />
        <div className="row center gap-4" style={{ justifyContent: "center" }}>
          <button className="btn btn--green btn--lg" onClick={onContinue}>
            {nextStep ? (
              <>
                Begin Step {next} — {nextStep.name} <ArrowRight size={13} color="#fff" />
              </>
            ) : (
              <>
                Curriculum complete · view portfolio <ArrowRight size={13} color="#fff" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
