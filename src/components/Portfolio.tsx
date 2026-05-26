// Portfolio.tsx — projects, skills, career readiness, shareable card.
// Adapts to FRESH (empty) and DEMO (Priya, 2 projects + writeups) modes.

import { useProgress } from "../progress";
import { ArrowRight, Bar, Check, ExternalLink, Lock, openLink } from "../primitives";
import type { Project, Skill } from "../data";
import type { Screen } from "../App";

interface Writeup {
  title: string;
  status: string;
  date: string;
  stat: string;
  isDraft?: boolean;
}

export function Portfolio(_props: { onNavigate: (s: Screen) => void }) {
  const { steps, streak, projects, skills, persona } = useProgress();

  const passedCount = steps.filter((s) => s.state === "passed").length;
  const currentStep = steps.find((s) => s.state === "current");
  const totalSteps = steps.length;
  const totalCommits = projects.reduce((a, p) => a + (p.commits || 0), 0);
  const readiness = (passedCount + 0.4 * (currentStep ? 1 : 0)) / totalSteps;
  const isFresh = projects.length === 0 && streak.days === 0;
  const handle = persona.name === "Priya Mehta" ? "priya-mehta" : "yourname";

  const writeups: Writeup[] = isFresh
    ? []
    : [
        { title: "What I got wrong about logistic regression — and what fixed it", status: "Published", date: "May 4", stat: "42 reactions · 7 comments" },
        { title: "Building micrograd in a week: how Karpathy's lectures actually work", status: "Published", date: "May 18", stat: "118 reactions · 23 comments" },
        { title: "BatchNorm: the lecture I had to rewatch twice", status: "Draft", date: "today", stat: "ready when checkpoint 4 passes", isDraft: true },
      ];

  return (
    <div className="screen content">
      <div className="row between" style={{ alignItems: "flex-end", marginBottom: 28 }}>
        <div>
          <div className="eyebrow">Portfolio · ground up</div>
          <h1 className="h-display mt-3" style={{ maxWidth: 760 }}>
            {isFresh ? (
              <>
                What you're<br />
                <em>about to build.</em>
              </>
            ) : (
              <>
                What you've<br />
                <em>actually shipped.</em>
              </>
            )}
          </h1>
          <div className="muted mt-3" style={{ fontSize: 15, maxWidth: 560 }}>
            {isFresh
              ? "Empty for now — by design. Projects start landing at Step 3 and never stop. Notes are the evidence you understand the lectures behind them. Both surfaces below."
              : "Your GitHub is your resume. Notes are the evidence you understand it. Both surfaces below — nothing inflated, nothing borrowed."}
          </div>
        </div>
        <div className="col" style={{ alignItems: "flex-end", gap: 6 }}>
          <button className="btn" disabled={isFresh}>
            {isFresh ? "Share card · locked" : "Share portfolio card →"}
          </button>
          <span className="mono fz-11 muted">{isFresh ? "unlocks at Step 3" : "one link · employer-ready"}</span>
        </div>
      </div>

      <hr className="hr-ink mb-8" />

      {/* TOP STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 40 }}>
        <BigStat
          eyebrow="Projects shipped"
          value={String(projects.filter((p) => p.status === "shipped").length)}
          sub={projects.length === 0 ? "first one lands in Step 3" : `+ ${projects.filter((p) => p.status !== "shipped").length} in progress`}
        />
        <BigStat eyebrow="Total commits" value={String(totalCommits)} sub={totalCommits === 0 ? "first push tonight" : "across active repos"} />
        <BigStat eyebrow="Session notes" value={String(streak.notesTotal)} sub={streak.days === 0 ? "since Day 1 · tonight" : `${streak.days}-day streak`} />
        <BigStat eyebrow="Checkpoints passed" value={`${passedCount}`} sub={`of ${totalSteps} · gate ${currentStep?.n ?? 1} ${passedCount === 0 ? "ahead" : "pending"}`} />
      </div>

      {/* CAREER READINESS METER */}
      <div className="card p-6 mb-8">
        <div className="row between" style={{ alignItems: "flex-end" }}>
          <div>
            <div className="eyebrow">Career readiness</div>
            <div className="serif-display mt-2" style={{ fontSize: 30, color: "var(--ink)" }}>
              {readiness === 0 ? (
                "Zero, honestly. That's the right starting place."
              ) : (
                <>
                  <span className="num">{Math.round(readiness * 100)}%</span> of the way to junior AI engineer.
                </>
              )}
            </div>
            <div className="muted fz-13 mt-2" style={{ maxWidth: 580 }}>
              Fills only when a checkpoint passes. Not for logging in, not for hours watched.{" "}
              {passedCount === 0 ? "All seven gates" : `${totalSteps - passedCount} more gates`} and the meter calls you
              ready.
            </div>
          </div>
          <div className="col" style={{ alignItems: "flex-end", gap: 4 }}>
            <div className="mono fz-11 muted">target track</div>
            <div className="ink fz-13 fw-500">Junior AI Engineer · $80–120K</div>
            <div className="mono fz-11 muted mt-1">next · Prompt / Agent Eng · $120–180K</div>
          </div>
        </div>

        {/* segmented bar for each checkpoint */}
        <div className="mt-6">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {steps.map((s) => {
              const passed = s.state === "passed";
              const current = s.state === "current";
              return (
                <div key={s.n}>
                  <div
                    style={{
                      height: 10,
                      background: passed
                        ? "var(--green)"
                        : current
                          ? "linear-gradient(to right, var(--blue) 30%, var(--line) 30%)"
                          : "var(--line)",
                      borderRadius: 1,
                    }}
                  />
                  <div className="mono fz-11 muted mt-2 row between center">
                    <span>0{s.n}</span>
                    {passed && <Check size={9} color="#1F7A4D" />}
                    {current && <span className="blue">now</span>}
                    {s.state === "locked" && <Lock size={9} color="#9AA1B1" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PROJECTS */}
      <div className="mb-3">
        <div className="row between center mb-4">
          <h2 className="h-section">GitHub · projects</h2>
          <span className="mono fz-11 muted">github.com/{isFresh ? "yourname" : "priya-mehta"}</span>
        </div>
        <hr className="hr-ink mb-4" />
        <div className="col gap-3">
          {projects.map((p) => (
            <ProjectCard key={p.name} p={p} handle={handle} />
          ))}
          {isFresh && (
            <ProjectPlaceholder
              step={1}
              title="ground-up (your starter repo)"
              desc="Tonight's first commit. One README, one sentence about why. The smallest possible push — but it's the one that starts the heatmap."
            />
          )}
          <ProjectPlaceholder step={3} title="Titanic classifier" desc="Logistic regression + random forest. First model that isn't tutorial copy-paste." />
          <ProjectPlaceholder step={4} title="nanoGPT-from-scratch" desc="Karpathy line by line. The week the abstraction stops being scary." />
          <ProjectPlaceholder step={5} title="Obsidian-vault RAG" desc="ChromaDB + Claude. Indexes your own notes. Checkpoint project for Step 5." />
          <ProjectPlaceholder step={6} title="Study-life agent (MCP)" desc="Daily summary to Telegram. Built ground up on MCP, LangGraph, your vault." />
          <ProjectPlaceholder
            step={7}
            title="Capstone — deployed"
            desc="Production agent on HF Spaces + Vercel. With evals and red-team. This is what you show employers."
          />
        </div>
      </div>

      {/* SKILLS — plain English */}
      <div className="mt-10">
        <div className="row between center mb-4">
          <h2 className="h-section">Skills, plain English</h2>
          <span className="mono fz-11 muted">earned · in progress · locked</span>
        </div>
        <hr className="hr-ink mb-4" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {skills.map((sk) => (
            <SkillRow key={sk.name} sk={sk} />
          ))}
        </div>
      </div>

      {/* SHAREABLE CARD PREVIEW (demo only) */}
      {!isFresh && (
        <div className="mt-10">
          <div className="row between center mb-4">
            <h2 className="h-section">Shareable portfolio card</h2>
            <span className="mono fz-11 muted">preview · what employers see</span>
          </div>
          <hr className="hr-ink mb-4" />
          <ShareCard />
        </div>
      )}

      {/* LINKEDIN WRITEUPS */}
      <div className="mt-10">
        <div className="row between center mb-4">
          <h2 className="h-section">LinkedIn case studies</h2>
          <span className="mono fz-11 muted">
            {writeups.length > 0
              ? `${writeups.filter((w) => !w.isDraft).length} published · ${writeups.filter((w) => w.isDraft).length} draft`
              : "start writing after Step 2"}
          </span>
        </div>
        <hr className="hr-ink mb-4" />
        {writeups.length > 0 ? (
          <div className="col">
            {writeups.map((w, i) => (
              <WriteupRow key={i} {...w} />
            ))}
          </div>
        ) : (
          <div className="card card--paper p-5">
            <div className="serif" style={{ fontSize: 17, color: "var(--ink)", lineHeight: 1.4, maxWidth: 640 }}>
              You'll write two to three short case studies on what you built and what you'd do differently. They make
              your portfolio land on LinkedIn instead of just on GitHub. First one is due at the Step 3 checkpoint.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BigStat({ eyebrow, value, sub }: { eyebrow: string; value: string; sub: string }) {
  return (
    <div className="card p-5">
      <div className="eyebrow">{eyebrow}</div>
      <div className="serif mt-3 ink" style={{ fontSize: 48, lineHeight: 0.95, fontWeight: 300, letterSpacing: "-0.04em" }}>
        {value}
      </div>
      <div className="fz-12 muted mt-3">{sub}</div>
    </div>
  );
}

function ProjectCard({ p, handle }: { p: Project; handle: string }) {
  const isInProgress = p.status === "in-progress";
  return (
    <div className="card p-5">
      <div className="row between" style={{ alignItems: "flex-start" }}>
        <div className="grow" style={{ minWidth: 0 }}>
          <div className="row center gap-3 mb-2">
            <span className="badge badge--ink">Step {p.step}</span>
            {isInProgress ? (
              <span className="badge badge--amber">in progress</span>
            ) : (
              <span className="badge badge--green">
                <Check size={9} color="#1F7A4D" /> shipped
              </span>
            )}
            <span className="mono fz-11 muted">{p.lang}</span>
          </div>
          <div className="serif" style={{ fontSize: 22, color: "var(--ink)", fontWeight: 400, letterSpacing: "-0.01em" }}>
            <a href="#" className="link" onClick={(e) => { e.preventDefault(); openLink(`https://github.com/${handle}/${p.name}`); }}>
              {handle}/{p.name}
            </a>
          </div>
          <div className="muted fz-13 mt-2" style={{ maxWidth: 620 }}>
            {p.desc}
          </div>
          <div className="row gap-5 mt-4">
            <Mini label="Commits" value={p.commits} />
            <Mini label="Last push" value={p.pushed} />
            <Mini label="Checkpoint" value={"Step " + p.step} />
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn btn--ghost btn--sm" onClick={() => openLink(`https://github.com/${handle}/${p.name}`)}>
            View on GitHub <ExternalLink size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectPlaceholder({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <div className="card p-5" style={{ borderStyle: "dashed", borderColor: "var(--line-strong)", background: "transparent" }}>
      <div className="row between center">
        <div>
          <div className="row center gap-3 mb-2">
            <span className="badge">Step {step}</span>
            <span className="mono fz-11 muted">locked · placeholder</span>
          </div>
          <div className="serif" style={{ fontSize: 19, color: "var(--ink-muted)", fontWeight: 400 }}>
            {title}
          </div>
          <div className="muted fz-12 mt-1">{desc}</div>
        </div>
        <Lock size={14} color="#9AA1B1" />
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="mono fz-11 muted upper" style={{ letterSpacing: "0.1em" }}>
        {label}
      </div>
      <div className="ink mt-1 num fz-13 fw-500">{value}</div>
    </div>
  );
}

function SkillRow({ sk }: { sk: Skill }) {
  const earned = sk.earned;
  const locked = !earned && (sk.progress ?? 0) === 0;
  const progress = sk.progress ?? (earned ? 1 : 0);
  return (
    <div className="card p-5" style={{ background: earned ? "var(--surface-alt)" : "var(--surface)", borderColor: earned ? "var(--green)" : "var(--line)" }}>
      <div className="row between center">
        <div className="row center gap-3">
          {earned && (
            <span className="badge badge--green">
              <Check size={9} color="#1F7A4D" />
            </span>
          )}
          {locked && <Lock size={11} color="#9AA1B1" />}
          <span className="serif" style={{ fontSize: 18, color: locked ? "var(--ink-faint)" : "var(--ink)", fontWeight: 400 }}>
            {sk.name}
          </span>
        </div>
        <span className="mono fz-11 muted">Step {sk.step}</span>
      </div>
      <div className="mt-3">
        <Bar value={progress} max={1} variant={earned ? "green" : "blue"} className="progress--thin" />
      </div>
      <div className="fz-12 muted mt-2">
        {earned ? "Earned · checkpoint cleared" : locked ? "Locked · unlocks when step opens" : `In progress · ${Math.round(progress * 100)}%`}
      </div>
    </div>
  );
}

function WriteupRow({ title, status, date, stat, isDraft }: Writeup) {
  return (
    <div className="row between center" style={{ padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
      <div className="grow" style={{ minWidth: 0 }}>
        <div className="row center gap-3 mb-1">
          <span className={"badge " + (isDraft ? "badge--amber" : "badge--green")}>{status}</span>
          <span className="mono fz-11 muted">{date}</span>
        </div>
        <div className="ink fz-14 fw-500">{title}</div>
        <div className="muted fz-12 mt-1">{stat}</div>
      </div>
      <ArrowRight size={13} color="#6B7488" />
    </div>
  );
}

function ShareCard() {
  const { steps, streak, projects, persona } = useProgress();
  const passedCount = steps.filter((s) => s.state === "passed").length;
  const totalSteps = steps.length;
  const shipped = projects.filter((p) => p.status === "shipped").length;
  const wip = projects.filter((p) => p.status !== "shipped").length;
  const handle = persona.name === "Priya Mehta" ? "priya-mehta" : "yourname";

  return (
    <div style={{ background: "var(--ink)", color: "var(--paper)", padding: "36px 40px", borderRadius: 2, maxWidth: 760, position: "relative" }}>
      <div className="row between" style={{ alignItems: "flex-start" }}>
        <div>
          <div className="mono fz-11 upper" style={{ color: "rgba(245,243,238,0.5)", letterSpacing: "0.16em" }}>
            Ground Up · class of 2026
          </div>
          <h3 className="serif-display mt-3" style={{ fontSize: 34, color: "var(--paper)" }}>
            {persona.name}
            <br />
            <span style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(245,243,238,0.7)" }}>{persona.role}</span>
          </h3>
        </div>
        <div className="col" style={{ alignItems: "flex-end", gap: 8 }}>
          <div className="brand-wordmark" style={{ color: "var(--paper)", fontSize: 18 }}>
            Ground Up<span className="dot" style={{ background: "#fff" }}></span>
          </div>
          <span className="mono fz-11" style={{ color: "rgba(245,243,238,0.5)" }}>
            groundup.dev/p/{handle}
          </span>
        </div>
      </div>

      <hr className="hr-dash mt-5 mb-5" style={{ background: "linear-gradient(to right, rgba(245,243,238,0.3) 50%, transparent 50%)", backgroundSize: "8px 1px" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        <ShareStat label="Steps passed" value={`${passedCount} / ${totalSteps}`} />
        <ShareStat label="Projects shipped" value={shipped + (wip ? ` + ${wip}` : "")} />
        <ShareStat label="Session notes" value={String(streak.notesTotal)} />
        <ShareStat label="Note streak" value={`${streak.days} days`} />
      </div>

      <hr className="hr-dash mt-6 mb-5" style={{ background: "linear-gradient(to right, rgba(245,243,238,0.3) 50%, transparent 50%)", backgroundSize: "8px 1px" }} />

      <div className="row between center">
        <div className="fz-13" style={{ color: "rgba(245,243,238,0.75)", maxWidth: 460 }}>
          Built micrograd, a tiny GPT, and a Titanic classifier from scratch. Currently learning attention by
          re-implementing it in plain Python.
        </div>
        <div className="col" style={{ alignItems: "flex-end" }}>
          <div className="mono fz-11" style={{ color: "rgba(245,243,238,0.5)" }}>
            verified by checkpoints
          </div>
          <div className="mono fz-11 mt-1" style={{ color: "rgba(245,243,238,0.5)" }}>
            no skip button · ever
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono fz-11" style={{ color: "rgba(245,243,238,0.5)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div className="serif mt-2" style={{ fontSize: 28, fontWeight: 300, color: "var(--paper)", letterSpacing: "-0.02em" }}>
        {value}
      </div>
    </div>
  );
}
