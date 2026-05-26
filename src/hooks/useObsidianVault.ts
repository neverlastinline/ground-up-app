// useObsidianVault.ts — persists the user's Obsidian vault name in localStorage
// and provides helpers that construct obsidian:// deep-link URIs.
//
// How Obsidian URIs work:
//   obsidian://new?vault=<name>&file=<path>&content=<md>  → create / open note
//   obsidian://open?vault=<name>&file=<path>              → open existing note
//
// <path> is relative to the vault root, WITHOUT the .md extension.
// Obsidian must be installed and the vault must be open in Obsidian for the
// links to work. If it's not installed the call silently no-ops.

import { useState } from "react";

const STORAGE_KEY = "groundup_obsidian_vault";

// Step number → vault-relative path to the primary notes file for that step.
// Matches the folder structure created by the Step 1 vault scaffold.
export const STEP_NOTE_PATHS: Record<number, string> = {
  1: "AI-Learning/00-setup/accounts-and-tools",
  2: "AI-Learning/01-fundamentals/notes",
  3: "AI-Learning/02-ml-foundations/notes",
  4: "AI-Learning/03-deep-learning/notes",
  5: "AI-Learning/04-llms-and-prompting/notes",
  6: "AI-Learning/05-agents/notes",
  7: "AI-Learning/06-production/deploy-notes",
};

function enc(s: string) {
  return encodeURIComponent(s);
}

export function useObsidianVault() {
  const [vaultName, setVaultNameState] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) ?? "",
  );

  const setVaultName = (name: string) => {
    const trimmed = name.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    setVaultNameState(trimmed);
  };

  const isConfigured = vaultName.length > 0;

  /**
   * Open or create a note in Obsidian.
   * - Pass `content` to create a new note pre-filled with that markdown.
   * - Omit `content` to open an existing file.
   * Returns false if vault is not configured.
   */
  const openNote = (filePath: string, content?: string): boolean => {
    if (!isConfigured) return false;
    const url =
      content !== undefined
        ? `obsidian://new?vault=${enc(vaultName)}&file=${enc(filePath)}&content=${enc(content)}`
        : `obsidian://open?vault=${enc(vaultName)}&file=${enc(filePath)}`;
    window.location.href = url;
    return true;
  };

  /** Open the vault root in Obsidian. */
  const openVault = (): boolean => {
    if (!isConfigured) return false;
    window.location.href = `obsidian://open?vault=${enc(vaultName)}`;
    return true;
  };

  /** Build a session-note file path for the given ISO date, e.g. "2026-05-26". */
  const sessionNotePath = (isoDate: string) =>
    `AI-Learning/sessions/${isoDate}`;

  /** Build the standard session note frontmatter + template for a given step/date. */
  const buildSessionNote = (
    stepN: number,
    stepName: string,
    isoDate: string,
    sessionNumber: number,
    noteTemplate: string,
  ) =>
    `---\ndate: ${isoDate}\nstep: ${stepN}\ntags: [ai-learning, step-${stepN}, session]\n---\n\n# Session Note · ${isoDate}\n\n**Step:** ${stepN} — ${stepName}  \n**Session:** #${sessionNumber}\n\n---\n\n${noteTemplate}`;

  return {
    vaultName,
    setVaultName,
    isConfigured,
    openNote,
    openVault,
    sessionNotePath,
    buildSessionNote,
  };
}
