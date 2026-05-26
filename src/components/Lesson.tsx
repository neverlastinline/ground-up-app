// Lesson.tsx — split-pane resource + notes editor.
// Content is driven by the today object, so it adapts to whichever progress
// mode is active.

import { useEffect, useState, type MouseEvent } from "react";
import JSZip from "jszip";
import { useProgress } from "../progress";
import { useObsidianVault } from "../hooks/useObsidianVault";
import { ArrowRight, Bar, Checkbox, ExternalLink, Star, openLink } from "../primitives";
import type { Resource, VaultScaffold as VaultScaffoldData } from "../data";
import type { Screen } from "../App";

export function Lesson({ onNavigate, onObsidianSync }: { onNavigate: (s: Screen) => void; onObsidianSync?: () => void }) {
  const { steps, today, streak } = useProgress();
  const { isConfigured, openNote, sessionNotePath, buildSessionNote } = useObsidianVault();
  const step = steps.find((s) => s.state === "current");

  const [note, setNote] = useState(today.noteTemplate || "");
  const [saved, setSaved] = useState(true);
  const [savedAt, setSavedAt] = useState("just now");

  // task checklist — one bool per task
  const [checks, setChecks] = useState<boolean[]>(() => (today.tasks || []).map(() => false));
  const toggleCheck = (i: number) => setChecks((cs) => cs.map((c, idx) => (idx === i ? !c : c)));

  // re-init whenever today changes (mode switch or taskTitle update)
  useEffect(() => {
    setNote(today.noteTemplate || "");
    setSaved(true);
    setChecks((today.tasks || []).map(() => false));
  }, [today.taskTitle, today.noteTemplate, today.tasks]);

  useEffect(() => {
    if (!saved) {
      const t = setTimeout(() => {
        setSaved(true);
        setSavedAt("just now");
      }, 900);
      return () => clearTimeout(t);
    }
  }, [note, saved]);

  const charCount = note.length;
  const wordCount = note.trim().split(/\s+/).filter(Boolean).length;

  const doneCount = checks.filter(Boolean).length;
  const totalTasks = checks.length;
  const allDone = totalTasks > 0 && doneCount === totalTasks;

  if (!step) return null;

  const [dayN, dayMax] = today.dayProgress || [1, 1];
  const isStartingStep = step.weekRange[0] === 0 && step.weekRange[1] === 0;
  const nextStep = steps.find((s) => s.n === step.n + 1);

  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Lesson topbar */}
      <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--line)", background: "var(--paper)" }}>
        <div className="row between center">
          <div className="row center gap-4">
            <button className="btn btn--ghost btn--sm" onClick={() => onNavigate("dashboard")}>
              ← Dashboard
            </button>
            <div className="crumbs">
              <span>Step {step.n}</span>
              <span className="sep">/</span>
              <span>{isStartingStep ? "Day 1" : `Week ${today.week}`}</span>
              <span className="sep">/</span>
              <span className="cur">Session · {isStartingStep ? "tonight" : (today.lectureLabel ?? "today")}</span>
            </div>
          </div>
          <div className="row center gap-5">
            <div className="row center gap-2">
              <span className="dot dot-blue" />
              <span className="mono fz-11 muted upper">{today.dayLabel || `Day ${dayN} of ${dayMax} in Step ${step.n}`}</span>
            </div>
            <div style={{ width: 240 }}>
              <Bar value={dayN} max={dayMax} variant="blue" className="progress--thin" />
            </div>
          </div>
        </div>
      </div>

      {/* SPLIT PANE */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.05fr)", flex: 1, minHeight: 0 }}>
        {/* LEFT — RESOURCE PANE */}
        <div style={{ borderRight: "1px solid var(--line)", overflowY: "auto", padding: "40px 36px 60px", background: "var(--paper)" }}>
          <div className="eyebrow">Resource context</div>
          <h1 className="serif-display mt-3" style={{ fontSize: 36, color: "var(--ink)" }}>
            {today.taskTitle}
          </h1>

          <div className="row center gap-3 mt-4 wrap">
            <span className="badge badge--ink">Primary</span>
            <a href="#" className="link mono fz-12" onClick={(e) => { e.preventDefault(); openLink(today.url); }}>
              {today.source} <ExternalLink size={10} />
            </a>
            <span className="muted fz-12">·</span>
            <span className="mono fz-11 muted">{today.duration}</span>
          </div>

          <hr className="hr-dash mt-6 mb-5" />

          {/* Today's actual work — data-driven */}
          <div className="row between center mb-3">
            <div className="eyebrow">What to do {isStartingStep ? "tonight" : "today"}</div>
            <span className="mono fz-11 muted">
              <span className="ink num">{doneCount}</span> / {totalTasks} done
            </span>
          </div>
          <ol style={{ paddingLeft: 0, listStyle: "none", margin: 0 }} className="col gap-3">
            {(today.tasks || []).map((text, i) => (
              <Task key={i} n={i + 1} text={text} checked={checks[i]} onToggle={() => toggleCheck(i)} />
            ))}
          </ol>

          {today.vaultScaffold && <VaultScaffold scaffold={today.vaultScaffold} />}

          <hr className="hr-dash mt-6 mb-5" />

          {/* linked resources */}
          <div className="row between center mb-3">
            <div className="eyebrow">Linked for this step</div>
            <span className="mono fz-11 muted">{step.resources.length} resources</span>
          </div>
          <div className="col">
            {step.resources.map((r) => (
              <ResourceRow key={r.name} r={r} />
            ))}
          </div>

          <hr className="hr-dash mt-6 mb-5" />

          {/* parallel experiment / advice block */}
          {today.experiment && (
            <div className="card card--paper p-5">
              <div className="row center gap-3">
                <span className="badge">{today.experiment.title}</span>
                <span className="mono fz-11 muted">{today.experiment.sub}</span>
              </div>
              <div className="serif mt-3" style={{ fontSize: 17, color: "var(--ink)", lineHeight: 1.35 }}>
                {today.experiment.body}
              </div>
              <div className="mono fz-11 muted mt-3" style={{ letterSpacing: 0 }}>
                {today.experiment.cmd}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — NOTES EDITOR */}
        <div style={{ overflowY: "auto", padding: "40px 36px 60px", background: "var(--surface)" }}>
          <div className="row between center">
            <div>
              <div className="eyebrow">Session note · obsidian</div>
              <div className="serif-display mt-2" style={{ fontSize: 22, color: "var(--ink)" }}>
                {today.date}{" "}
                <span className="muted serif" style={{ fontStyle: "italic", fontSize: 16 }}>
                  · session {today.sessionNumber || streak.notesTotal + 1}
                </span>
              </div>
            </div>
            <div className="row center gap-3">
              <div className="row center gap-2">
                <span className="dot" style={{ background: saved ? "var(--green)" : "var(--amber)" }} />
                <span className="mono fz-11 muted">{saved ? `saved · ${savedAt}` : "saving…"}</span>
              </div>
            </div>
          </div>

          <hr className="hr-dash mt-5 mb-5" />

          {/* template hints — collapsed legend */}
          <div className="row gap-3 mb-4 wrap">
            <TemplateChip label="What I learned" />
            <TemplateChip label="What surprised me" />
            <TemplateChip label="Still unclear" />
            <TemplateChip label="Key terms" />
          </div>

          <textarea
            className="input"
            value={note}
            onChange={(e) => { setNote(e.target.value); setSaved(false); }}
            spellCheck="false"
            style={{ minHeight: 380, background: "var(--surface)", border: "1px solid var(--line)", padding: "20px 22px", fontSize: 14, lineHeight: 1.7 }}
          />

          <div className="row between center mt-3">
            <div className="row gap-4">
              <span className="mono fz-11 muted">
                <span className="ink num">{wordCount}</span> words
              </span>
              <span className="mono fz-11 muted">
                <span className="ink num">{charCount}</span> chars
              </span>
            </div>
            <div className="row gap-2">
              <button
                className="btn btn--ghost btn--sm"
                title={isConfigured ? "Open this session note in Obsidian" : "Configure Obsidian vault first"}
                onClick={() => {
                  if (!isConfigured) { onObsidianSync?.(); return; }
                  const isoDate = new Date().toISOString().split("T")[0];
                  const content = buildSessionNote(step.n, step.name, isoDate, today.sessionNumber, note || today.noteTemplate);
                  openNote(sessionNotePath(isoDate), content);
                }}
              >
                {isConfigured ? "Open in Obsidian" : "Connect Obsidian"} <ExternalLink size={10} />
              </button>
              {allDone && nextStep ? (
                <button
                  className="btn btn--sm btn--green"
                  onClick={() => {
                    alert(
                      isStartingStep
                        ? `First session note saved. Step 1 complete — onward to Step ${nextStep.n}: ${nextStep.name}.`
                        : `Session note saved. Streak now ${streak.days + 1} days.`,
                    );
                    onNavigate("dashboard");
                  }}
                >
                  Continue to Step {String(nextStep.n).padStart(2, "0")} · {nextStep.name} <ArrowRight size={11} />
                </button>
              ) : (
                <button
                  className="btn btn--sm"
                  disabled={!allDone}
                  title={!allDone ? `${totalTasks - doneCount} task${totalTasks - doneCount === 1 ? "" : "s"} left` : ""}
                  onClick={() =>
                    alert(isStartingStep ? "First session note saved. Streak: 1 day." : `Session note saved. Streak now ${streak.days + 1} days.`)
                  }
                >
                  {`Mark ${isStartingStep ? "tonight" : "today"}'s session done`}
                  {totalTasks > 0 && !allDone && (
                    <span className="mono fz-11" style={{ marginLeft: 8, opacity: 0.55 }}>
                      {doneCount}/{totalTasks}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          <hr className="hr-dash mt-8 mb-5" />

          {/* Past notes — folded list */}
          <div className="row between center mb-3">
            <div className="eyebrow">{today.pastNotes?.length ? "Recent session notes" : "No past notes yet"}</div>
            <span className="mono fz-11 muted">
              {streak.notesTotal === 0 ? "tonight is the first" : `${streak.notesTotal} total · ${streak.days}-day streak`}
            </span>
          </div>
          {today.pastNotes && today.pastNotes.length > 0 ? (
            <div className="col">
              {today.pastNotes.map((n, i) => (
                <div
                  key={i}
                  className="row between center"
                  style={{ padding: "12px 0", borderBottom: i === today.pastNotes.length - 1 ? "none" : "1px solid var(--line)" }}
                >
                  <div className="grow" style={{ minWidth: 0 }}>
                    <div className="ink fz-13 fw-500">{n.title}</div>
                    <div className="row center gap-2 mt-1 wrap">
                      <span className="mono fz-11 muted">{n.date}</span>
                      {n.terms.map((t) => (
                        <span key={t} className="mono fz-11" style={{ color: "var(--blue-deep)" }}>
                          ·{t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ExternalLink size={11} color="#9AA1B1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="card card--paper p-5">
              <div className="serif" style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.4 }}>
                Your vault is empty. That's fine — the four-prompt template above is the entire system. Every session has
                the same four headings forever. The discipline is the product.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Task({ n, text, checked, onToggle }: { n: number; text: string; checked: boolean; onToggle: () => void }) {
  return (
    <li
      className="row gap-4"
      style={{
        alignItems: "flex-start",
        padding: "10px 12px 10px 10px",
        borderRadius: 3,
        background: checked ? "var(--surface-tint)" : "transparent",
        border: "1px solid " + (checked ? "var(--line)" : "transparent"),
        cursor: "pointer",
        transition: "background 120ms ease, border-color 120ms ease",
      }}
      onClick={onToggle}
    >
      <div style={{ paddingTop: 2 }}>
        <Checkbox checked={!!checked} variant="green" onClick={(e: MouseEvent) => { e.stopPropagation(); onToggle(); }} />
      </div>
      <span
        className="serif"
        style={{ fontSize: 22, color: "var(--ink-faint)", fontWeight: 300, minWidth: 28, letterSpacing: "-0.02em", opacity: checked ? 0.55 : 1 }}
      >
        {String(n).padStart(2, "0")}
      </span>
      <span
        className="ink"
        style={{
          fontSize: 14.5,
          lineHeight: 1.5,
          paddingTop: 4,
          color: checked ? "var(--ink-soft)" : "var(--ink)",
          textDecoration: checked ? "line-through" : "none",
          textDecorationColor: "var(--ink-faint)",
          textDecorationThickness: "1px",
          flex: 1,
        }}
      >
        {text}
      </span>
    </li>
  );
}

function TemplateChip({ label }: { label: string }) {
  return (
    <span
      className="mono fz-11"
      style={{ padding: "5px 10px", background: "var(--surface-tint)", borderRadius: 2, color: "var(--ink-soft)", letterSpacing: "0.04em" }}
    >
      {label}
    </span>
  );
}

/* VaultScaffold — folder tree + copy-command + download zip.
   Gives the learner two paths to the same outcome: paste the one-liner in
   their terminal, or download a ready-made zip and drop it into Obsidian. */
function VaultScaffold({ scaffold }: { scaffold: VaultScaffoldData }) {
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [zipReady, setZipReady] = useState(false);

  const copyCmd = async () => {
    try {
      await navigator.clipboard.writeText(scaffold.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // no-op
    }
  };

  const downloadZip = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      for (const [path, content] of Object.entries(scaffold.files)) {
        zip.file(path, content);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "AI-Learning.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setZipReady(true);
      setTimeout(() => setZipReady(false), 2200);
    } finally {
      setZipping(false);
    }
  };

  // Build the tree lines with proper ├ └ │ glyphs from the flat node list.
  const nodes = scaffold.tree;
  const lines = nodes.map((node, idx) => {
    if (node.depth === 0) {
      return { ...node, prefix: "", connector: "" };
    }
    // is this the last child at its depth among remaining siblings?
    let isLast = true;
    for (let j = idx + 1; j < nodes.length; j++) {
      if (nodes[j].depth < node.depth) break;
      if (nodes[j].depth === node.depth) {
        isLast = false;
        break;
      }
    }
    // ancestor pipes
    let prefix = "";
    for (let d = 1; d < node.depth; d++) {
      let ancestorContinues = false;
      for (let j = idx + 1; j < nodes.length; j++) {
        if (nodes[j].depth < d) break;
        if (nodes[j].depth === d) {
          ancestorContinues = true;
          break;
        }
      }
      prefix += ancestorContinues ? "│   " : "    ";
    }
    return { ...node, prefix, connector: isLast ? "└── " : "├── " };
  });

  return (
    <div className="card card--paper" style={{ padding: 0, marginTop: 20, overflow: "hidden" }}>
      {/* header */}
      <div className="row between center" style={{ padding: "12px 18px", borderBottom: "1px solid var(--line)", background: "var(--surface-tint)" }}>
        <div className="row center gap-3">
          <span className="badge badge--ink">Step 01 · vault scaffold</span>
          <span className="mono fz-11 muted">two paths · same outcome</span>
        </div>
        <span className="mono fz-11 muted">{Object.keys(scaffold.files).length} files</span>
      </div>

      {/* tree */}
      <pre
        style={{
          margin: 0,
          padding: "18px 22px",
          background: "var(--surface)",
          borderBottom: "1px solid var(--line)",
          fontFamily: "var(--f-mono)",
          fontSize: 12,
          lineHeight: 1.75,
          color: "var(--ink-soft)",
          overflowX: "auto",
        }}
      >
        {lines.map((ln, i) => {
          const isRoot = ln.depth === 0;
          const isDir = ln.kind === "dir";
          return (
            <div key={i}>
              <span style={{ color: "var(--ink-faint)" }}>
                {ln.prefix}
                {ln.connector}
              </span>
              <span
                style={{
                  color: isRoot ? "var(--blue-deep)" : isDir ? "var(--ink)" : "var(--ink-soft)",
                  fontWeight: isRoot || isDir ? 600 : 400,
                }}
              >
                {ln.name}
              </span>
            </div>
          );
        })}
      </pre>

      {/* two columns: terminal command + zip download */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        {/* LEFT — terminal */}
        <div style={{ padding: "16px 18px", borderRight: "1px solid var(--line)" }}>
          <div className="row between center mb-2">
            <span className="eyebrow">A · Terminal · 5 seconds</span>
            <button onClick={copyCmd} className="btn btn--ghost btn--sm" style={{ padding: "3px 8px" }}>
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <div
            style={{
              background: "var(--ink)",
              color: "var(--paper)",
              padding: "12px 14px",
              borderRadius: 3,
              fontFamily: "var(--f-mono)",
              fontSize: 11.5,
              lineHeight: 1.55,
              maxHeight: 132,
              overflow: "auto",
              wordBreak: "break-all",
            }}
          >
            <span style={{ color: "var(--amber-soft)" }}>$ </span>
            {scaffold.command}
          </div>
          <div className="mono fz-11 muted mt-2" style={{ lineHeight: 1.5 }}>
            Run from your Obsidian vault root. Re-runs are safe.
          </div>
        </div>

        {/* RIGHT — zip */}
        <div style={{ padding: "16px 18px" }}>
          <div className="eyebrow mb-2">B · Drop into Obsidian · manual</div>
          <div className="serif" style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.45 }}>
            Download a ready-made zip — every{" "}
            <span className="mono" style={{ fontSize: 12 }}>
              .md
            </span>{" "}
            file already has YAML frontmatter, tags, and section stubs. Obsidian will index it immediately.
          </div>
          <ol style={{ paddingLeft: 18, margin: "10px 0 12px", fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>
            <li>Download &amp; unzip.</li>
            <li>
              Move <span className="mono">AI-Learning/</span> into your vault root.
            </li>
            <li>
              In Obsidian: <span className="mono">Cmd/Ctrl + R</span>.
            </li>
          </ol>
          <button className="btn btn--sm" onClick={downloadZip} disabled={zipping} style={{ width: "100%", justifyContent: "center" }}>
            {zipping ? "Building zip…" : zipReady ? "Downloaded ✓" : "↓ Download AI-Learning.zip"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResourceRow({ r }: { r: Resource }) {
  const typeBadge = ({ repo: "Repo", course: "Course", doc: "Doc", tool: "Tool" } as const)[r.type] || "Link";
  return (
    <div className="row center" style={{ padding: "12px 0", borderBottom: "1px solid var(--line)", gap: 16 }}>
      <span className="badge" style={{ minWidth: 56, justifyContent: "center" }}>
        {typeBadge}
      </span>
      <div className="grow" style={{ minWidth: 0 }}>
        <div className="ink fz-13 fw-500">{r.name}</div>
        <div className="mono fz-11 muted mt-1">{r.repo}</div>
      </div>
      {r.stars && (
        <div className="row center gap-2 mono fz-11 muted">
          <Star size={9} color="#6B7488" /> {r.stars}
        </div>
      )}
      <ExternalLink size={11} color="#9AA1B1" />
    </div>
  );
}
