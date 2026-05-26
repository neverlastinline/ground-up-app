// Onboarding.tsx — three-step intake → roadmap → tonight's checklist

import { useEffect, useState, type ReactNode } from "react";
import { useProgress } from "../progress";
import { ONBOARD } from "../data";
import { ArrowRight, Checkbox, Check, ExternalLink, openLink } from "../primitives";

const WEEKS_BY_HOURS: Record<string, number> = { "5": 28, "10": 14, "15": 10, "20+": 8 };

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [background, setBackground] = useState("Some Python");
  const [goal, setGoal] = useState("Get a job in AI");
  const [hours, setHours] = useState("10");
  const [pledge, setPledge] = useState(false);
  const [checklist, setChecklist] = useState({ a: false, b: false, c: false });

  // estimated weeks from hours/week (10 -> 14, 5 -> 28, 15 -> 10, 20 -> 8)
  const totalWeeks = WEEKS_BY_HOURS[hours] || 14;

  const canProceed1 = !!background && !!goal && !!hours && pledge;
  const allChecked = checklist.a && checklist.b && checklist.c;

  return (
    <div className="screen" style={{ background: "var(--paper)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* top rail with step progress */}
      <div style={{ padding: "20px 40px", borderBottom: "1px solid var(--line)" }}>
        <div className="row between center">
          <div className="brand-wordmark">
            Ground Up<span className="dot"></span>
          </div>
          <div className="row center gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="row center gap-2">
                <span className={"mono fz-11 " + (n <= step ? "ink" : "faint")} style={{ letterSpacing: "0.04em" }}>
                  {String(n).padStart(2, "0")}
                </span>
                <span
                  style={{
                    width: n === step ? 28 : 14,
                    height: 2,
                    background: n <= step ? "var(--ink)" : "var(--line-strong)",
                    transition: "width 240ms, background 240ms",
                  }}
                />
              </div>
            ))}
            <span className="eyebrow" style={{ marginLeft: 8 }}>
              {["Calibrate", "Roadmap", "Tonight"][step - 1]}
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 880, width: "100%", margin: "0 auto", padding: "60px 40px 80px", flex: 1 }}>
        {step === 1 && (
          <Step1
            background={background}
            setBackground={setBackground}
            goal={goal}
            setGoal={setGoal}
            hours={hours}
            setHours={setHours}
            pledge={pledge}
            setPledge={setPledge}
            canProceed={canProceed1}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && <Step2 hours={hours} totalWeeks={totalWeeks} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
        {step === 3 && (
          <Step3 checklist={checklist} setChecklist={setChecklist} allChecked={allChecked} onBack={() => setStep(2)} onStart={onComplete} />
        )}
      </div>
    </div>
  );
}

/* -------- STEP 1: where are you starting? -------- */

function Step1({
  background,
  setBackground,
  goal,
  setGoal,
  hours,
  setHours,
  pledge,
  setPledge,
  canProceed,
  onNext,
}: {
  background: string;
  setBackground: (v: string) => void;
  goal: string;
  setGoal: (v: string) => void;
  hours: string;
  setHours: (v: string) => void;
  pledge: boolean;
  setPledge: (v: boolean) => void;
  canProceed: boolean;
  onNext: () => void;
}) {
  return (
    <div className="screen">
      <div className="eyebrow mb-3">Step 01 / Calibrate</div>
      <h1 className="h-display">
        Where are you<br />
        <em>starting from?</em>
      </h1>
      <p className="mt-4 muted" style={{ maxWidth: 540, fontSize: 15 }}>
        Three quick questions. They decide which weeks compress, which expand, and what tonight's first action looks
        like. There are no wrong answers — only honest ones.
      </p>

      <hr className="hr mt-8 mb-6" />

      <div className="col gap-8">
        <Field label="A · Background">
          <div className="chip-row">
            {ONBOARD.background.map((b, i) => (
              <div key={b} className={"chip " + (background === b ? "is-active" : "")} onClick={() => setBackground(b)}>
                <span className="chip-mark">{String(i + 1).padStart(2, "0")}</span>
                {b}
              </div>
            ))}
          </div>
        </Field>

        <Field label="B · What do you want out of this?">
          <div className="chip-row">
            {ONBOARD.goal.map((g, i) => (
              <div key={g} className={"chip " + (goal === g ? "is-active" : "")} onClick={() => setGoal(g)}>
                <span className="chip-mark">{String(i + 1).padStart(2, "0")}</span>
                {g}
              </div>
            ))}
          </div>
        </Field>

        <Field label="C · Hours per week you can actually commit">
          <div className="chip-row">
            {ONBOARD.hours.map((h) => (
              <div
                key={h}
                className={"chip " + (hours === h ? "is-active" : "")}
                onClick={() => setHours(h)}
                style={{ minWidth: 80, justifyContent: "center" }}
              >
                <span className="mono fw-500 ink">{h}</span>
                <span className="muted fz-12">hrs</span>
              </div>
            ))}
          </div>
          <div className="muted fz-12 mt-3">
            10 hours is the median — most learners land here. Drop to 5 and Ground Up stretches to about six months. Push
            past 20 and you'll outrun the material itself: concepts need days to settle between sessions, and the
            checkpoints won't pass any faster just because you watched more lectures.
          </div>
        </Field>

        <Field label="D · The rule">
          <div className="card p-5" style={{ background: "var(--surface)", borderLeft: "3px solid var(--ink)" }}>
            <div className="row gap-4" style={{ alignItems: "flex-start" }}>
              <Checkbox checked={pledge} onClick={() => setPledge(!pledge)} />
              <div>
                <div className="serif" style={{ fontSize: 18, color: "var(--ink)", lineHeight: 1.35 }}>
                  "I won't skip steps. Checkpoints are hard gates. If I can't pass one, I go back — not around."
                </div>
                <div className="fz-12 muted mt-3">
                  Tick to acknowledge. There is no <span className="mono">skip</span> button anywhere in this product —
                  the whole point is to know it ground up, not to feel like you do.
                </div>
              </div>
            </div>
          </div>
        </Field>
      </div>

      <hr className="hr mt-8 mb-6" />

      <div className="row between center">
        <div className="muted fz-12">
          Estimated length: <span className="num ink fw-500">{WEEKS_BY_HOURS[hours]}</span> weeks
        </div>
        <button className="btn btn--lg" disabled={!canProceed} onClick={onNext}>
          See my roadmap <ArrowRight size={14} color={canProceed ? "#F5F3EE" : "#fff"} />
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="field-label">{label}</div>
      {children}
    </div>
  );
}

/* -------- STEP 2: animated roadmap reveal -------- */

function Step2({ hours, totalWeeks, onBack, onNext }: { hours: string; totalWeeks: number; onBack: () => void; onNext: () => void }) {
  const { steps } = useProgress();
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed >= steps.length) return;
    const t = setTimeout(() => setRevealed((r) => r + 1), revealed === 0 ? 250 : 380);
    return () => clearTimeout(t);
  }, [revealed, steps.length]);

  // map weeks scaled to chosen pace
  const scale = totalWeeks / 14;

  return (
    <div className="screen">
      <div className="eyebrow mb-3">Step 02 / Roadmap</div>
      <h1 className="h-display">
        Your <em>Ground Up</em>
        <br />
        roadmap.
      </h1>
      <p className="mt-4 muted" style={{ maxWidth: 580, fontSize: 15 }}>
        Seven steps. <span className="num ink">{totalWeeks}</span> weeks at <span className="num ink">{hours}</span> hours
        each. Step 1 is tonight. Step 7 is your portfolio. Everything between is yours to earn.
      </p>

      <hr className="hr mt-8 mb-6" />

      {/* Header row */}
      <div className="row" style={{ gap: 0, color: "var(--ink-muted)" }}>
        <div className="eyebrow" style={{ width: 60 }}>
          Step
        </div>
        <div className="eyebrow grow">Name & primary resource</div>
        <div className="eyebrow" style={{ width: 110, textAlign: "right" }}>
          Span
        </div>
        <div className="eyebrow" style={{ width: 32, textAlign: "right" }}></div>
      </div>
      <hr className="hr-ink mt-2" />

      <div className="col">
        {steps.map((s, i) => {
          const isShown = i < revealed;
          const weeksLabel =
            s.weekRange[0] === 0
              ? "Day 1"
              : `Wk ${Math.round(s.weekRange[0] * scale)}–${Math.round(s.weekRange[1] * scale)}`;
          return (
            <div
              key={s.n}
              className="row"
              style={{
                padding: "20px 0",
                borderBottom: "1px solid var(--line)",
                opacity: isShown ? 1 : 0,
                transform: isShown ? "none" : "translateY(8px)",
                transition: "opacity 420ms ease, transform 420ms cubic-bezier(.2,.7,.2,1)",
              }}
            >
              <div style={{ width: 60 }} className="serif">
                <span style={{ fontSize: 36, fontWeight: 300, color: "var(--ink)", letterSpacing: "-0.03em" }}>
                  {String(s.n).padStart(2, "0")}
                </span>
              </div>
              <div className="grow">
                <div className="ink fw-500" style={{ fontSize: 17, letterSpacing: "-0.005em" }}>
                  {s.name}
                </div>
                <div className="muted fz-13 mt-1">{s.summary}</div>
                <div className="mono fz-11 muted mt-2" style={{ letterSpacing: "0.04em" }}>
                  {s.primary}
                </div>
              </div>
              <div style={{ width: 110 }} className="text-r">
                <div className="num ink fz-13 fw-500">{weeksLabel}</div>
                <div className="eyebrow mt-1">Checkpoint</div>
              </div>
              <div style={{ width: 32, display: "flex", justifyContent: "flex-end", alignItems: "center", paddingLeft: 8 }}>
                <span className="dot" style={{ background: i === 0 ? "var(--blue)" : "var(--line-strong)" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="row between center mt-8">
        <button className="btn btn--ghost" onClick={onBack}>
          ← Re-calibrate
        </button>
        <button className="btn btn--lg" onClick={onNext} disabled={revealed < steps.length}>
          Tonight's checklist <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* -------- STEP 3: tonight's checklist -------- */

interface ChecklistItem {
  key: "a" | "b" | "c";
  mins: string;
  title: string;
  detail: string;
  link: string;
  ref: string;
}

function Step3({
  checklist,
  setChecklist,
  allChecked,
  onBack,
  onStart,
}: {
  checklist: { a: boolean; b: boolean; c: boolean };
  setChecklist: (v: { a: boolean; b: boolean; c: boolean }) => void;
  allChecked: boolean;
  onBack: () => void;
  onStart: () => void;
}) {
  const items: ChecklistItem[] = [
    {
      key: "a",
      mins: "5 min",
      title: "Install Obsidian, create your AI-Learning vault",
      detail:
        "Vault structure: /sessions, /concepts, /projects. Pin the session note template. This is where everything you learn lives.",
      link: "https://obsidian.md",
      ref: "obsidian.md",
    },
    {
      key: "b",
      mins: "30 min tonight",
      title: "Sign up for Anthropic Academy — AI Fluency: Framework & Foundations",
      detail:
        "The 4D AI Fluency Framework, co-developed with university professors. Full course is 2–3 hours — tonight, just create the account and start Module 1. It's one of the best intro courses available in 2026. After Module 1, write your first session note in your new vault using the four-prompt template: what I learned · what surprised me · still unclear · key terms. Three sentences each is enough.",
      link: "https://anthropic.skilljar.com",
      ref: "anthropic.skilljar.com",
    },
    {
      key: "c",
      mins: "20 min",
      title: "Fork microsoft/generative-ai-for-beginners, read Lesson 1",
      detail:
        "Don't run anything yet. Just read it. Note three terms you've never seen — that's your vocabulary for Week 1.",
      link: "https://github.com/microsoft/generative-ai-for-beginners",
      ref: "github.com/microsoft/generative-ai-for-beginners",
    },
  ];

  const totalMins = "55 min";
  return (
    <div className="screen">
      <div className="eyebrow mb-3">Step 03 / Tonight</div>
      <h1 className="h-display">
        Three things,<br />
        <em>tonight.</em>
      </h1>
      <p className="mt-4 muted" style={{ maxWidth: 580, fontSize: 15 }}>
        Total time: <span className="num ink">{totalMins}</span>. Do them in order. Tick each as you finish. The "start
        Step 1 properly" button unlocks only when all three are real.
      </p>

      <hr className="hr mt-8 mb-6" />

      <div className="col gap-4">
        {items.map((it, i) => {
          const done = checklist[it.key];
          return (
            <div
              key={it.key}
              className="card p-5"
              style={{
                background: done ? "var(--surface-alt)" : "var(--surface)",
                borderColor: done ? "var(--green)" : "var(--line)",
                transition: "border-color 240ms, background 240ms",
              }}
            >
              <div className="row gap-5" style={{ alignItems: "flex-start" }}>
                <Checkbox checked={done} variant="green" onClick={() => setChecklist({ ...checklist, [it.key]: !done })} />
                <div className="grow">
                  <div className="row between center mb-2">
                    <div className="row center gap-3">
                      <span className="mono fz-11 muted" style={{ letterSpacing: "0.06em" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="badge">{it.mins}</span>
                      {done && (
                        <span className="badge badge--green">
                          <Check size={9} color="#1F7A4D" /> Done
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="serif" style={{ fontSize: 19, color: "var(--ink)", lineHeight: 1.3 }}>
                    {it.title}
                  </div>
                  <div className="muted fz-13 mt-2" style={{ maxWidth: 620 }}>
                    {it.detail}
                  </div>
                  <div className="row center gap-3 mt-3">
                    <a
                      className="link link--blue mono fz-12"
                      onClick={(e) => { e.preventDefault(); openLink(it.link); }}
                      style={{ cursor: "pointer" }}
                    >
                      {it.ref} <ExternalLink size={9} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <hr className="hr mt-8 mb-6" />

      <div className="row between center">
        <button className="btn btn--ghost" onClick={onBack}>
          ← Back to roadmap
        </button>
        <button className="btn btn--lg btn--blue" disabled={!allChecked} onClick={onStart}>
          I've done all three — start Step 1 properly <ArrowRight size={14} color="#fff" />
        </button>
      </div>
    </div>
  );
}
