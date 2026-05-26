// ObsidianPanel.tsx — modal for configuring Obsidian vault sync and launching
// deep-link actions (open today's session note, open step notes, open vault).

import { useState } from "react";
import { useProgress } from "../progress";
import { useObsidianVault, STEP_NOTE_PATHS } from "../hooks/useObsidianVault";
import { ExternalLink } from "../primitives";

export function ObsidianPanel({ onClose }: { onClose: () => void }) {
  const { steps, today, streak } = useProgress();
  const { vaultName, setVaultName, isConfigured, openNote, openVault, sessionNotePath, buildSessionNote } =
    useObsidianVault();

  const [draft, setDraft] = useState(vaultName);
  const [saved, setSaved] = useState(false);

  const currentStep = steps.find((s) => s.state === "current");

  const handleSave = () => {
    setVaultName(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const isoDate = new Date().toISOString().split("T")[0];

  const openTodayNote = () => {
    if (!currentStep) return;
    const content = buildSessionNote(
      currentStep.n,
      currentStep.name,
      isoDate,
      today.sessionNumber,
      today.noteTemplate,
    );
    openNote(sessionNotePath(isoDate), content);
  };

  const openStepNotes = () => {
    if (!currentStep) return;
    const path = STEP_NOTE_PATHS[currentStep.n];
    if (path) openNote(path);
  };

  return (
    /* Backdrop */
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(26,24,20,0.55)", backdropFilter: "blur(2px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div
        style={{
          background: "var(--paper)", borderRadius: 4, border: "1px solid var(--line)",
          width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div
          style={{ padding: "20px 24px 18px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div>
            <div className="eyebrow">Obsidian sync</div>
            <div className="serif mt-1" style={{ fontSize: 18, color: "var(--ink)" }}>
              Open notes directly in your vault
            </div>
          </div>
          <button
            className="btn btn--ghost btn--sm"
            onClick={onClose}
            style={{ fontSize: 18, lineHeight: 1, padding: "4px 10px" }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "24px" }}>

          {/* Vault name config */}
          <div className="eyebrow mb-3">Your vault name</div>
          <div className="muted fz-13 mb-3" style={{ lineHeight: 1.5 }}>
            Enter the name of your Obsidian vault — exactly as it appears in{" "}
            <span className="mono" style={{ fontSize: 12 }}>Obsidian → Settings → About → Vault name</span>.
            Based on the Step 1 setup this should be{" "}
            <span className="mono ink" style={{ fontSize: 12 }}>AI-Learning</span>.
          </div>
          <div className="row center gap-3">
            <input
              className="input"
              style={{ flex: 1, padding: "8px 12px", fontSize: 14 }}
              placeholder="e.g. AI-Learning"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <button className="btn btn--sm" onClick={handleSave} disabled={!draft.trim()}>
              {saved ? "Saved ✓" : "Save"}
            </button>
          </div>

          {isConfigured && (
            <div className="row center gap-2 mt-3">
              <span className="dot" style={{ background: "var(--green)", width: 7, height: 7, borderRadius: "50%", display: "inline-block" }} />
              <span className="mono fz-11" style={{ color: "var(--green)" }}>
                Connected to vault: <strong>{vaultName}</strong>
              </span>
            </div>
          )}

          <hr className="hr-dash mt-6 mb-5" />

          {/* Quick actions */}
          <div className="eyebrow mb-4">Quick actions</div>

          <div className="col gap-3">

            {/* Today's session note */}
            <div className="card p-4" style={{ opacity: isConfigured ? 1 : 0.45 }}>
              <div className="row between center">
                <div>
                  <div className="ink fw-500 fz-13">Open today's session note</div>
                  <div className="mono fz-11 muted mt-1">
                    {isConfigured
                      ? `Creates AI-Learning/sessions/${isoDate}.md in your vault`
                      : "Configure your vault name first"}
                  </div>
                </div>
                <button
                  className="btn btn--sm"
                  disabled={!isConfigured}
                  onClick={openTodayNote}
                >
                  Open in Obsidian <ExternalLink size={10} />
                </button>
              </div>
              {isConfigured && (
                <div className="mono fz-11 muted mt-3" style={{ lineHeight: 1.5 }}>
                  Pre-fills with the four-prompt template: What I learned · What surprised me · Still unclear · Key terms
                </div>
              )}
            </div>

            {/* Step notes */}
            <div className="card p-4" style={{ opacity: isConfigured ? 1 : 0.45 }}>
              <div className="row between center">
                <div>
                  <div className="ink fw-500 fz-13">
                    Open Step {currentStep?.n} notes
                  </div>
                  <div className="mono fz-11 muted mt-1">
                    {isConfigured && currentStep
                      ? `${STEP_NOTE_PATHS[currentStep.n]}.md`
                      : "Configure your vault name first"}
                  </div>
                </div>
                <button
                  className="btn btn--ghost btn--sm"
                  disabled={!isConfigured}
                  onClick={openStepNotes}
                >
                  Open <ExternalLink size={10} />
                </button>
              </div>
            </div>

            {/* Open vault root */}
            <div className="card p-4" style={{ opacity: isConfigured ? 1 : 0.45 }}>
              <div className="row between center">
                <div>
                  <div className="ink fw-500 fz-13">Open vault root</div>
                  <div className="mono fz-11 muted mt-1">
                    {isConfigured ? `Opens ${vaultName} in Obsidian` : "Configure your vault name first"}
                  </div>
                </div>
                <button
                  className="btn btn--ghost btn--sm"
                  disabled={!isConfigured}
                  onClick={openVault}
                >
                  Open <ExternalLink size={10} />
                </button>
              </div>
            </div>
          </div>

          <hr className="hr-dash mt-6 mb-5" />

          {/* How it works */}
          <div className="eyebrow mb-3">How it works</div>
          <div className="col gap-2">
            {[
              ["obsidian:// links", "Each button opens Obsidian directly via a registered URI scheme — no browser extension needed."],
              ["Notes stay local", "Nothing is sent to any server. Your vault lives on your machine; this app just launches it."],
              ["Session note template", `New notes are pre-filled with the four-prompt template and the correct YAML frontmatter for Step ${currentStep?.n ?? 1}.`],
              ["Streak counter", `Manually tick today's session in the lesson view after you've written in Obsidian — the streak is ${streak.days > 0 ? streak.days + " days and counting" : "waiting for its first note"}.`],
            ].map(([title, body]) => (
              <div key={title} style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <div className="ink fw-500 fz-13">{title}</div>
                <div className="muted fz-13 mt-1" style={{ lineHeight: 1.5 }}>{body}</div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <button className="btn btn--ghost btn--sm" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
