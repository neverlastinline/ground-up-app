// primitives.tsx — small reusable components & helpers

import type { CSSProperties, MouseEvent } from "react";

export function Check({ size = 12, color = "#F5F3EE" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M2 6.2 L4.8 9 L10 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 7 H11 M7.5 3.5 L11 7 L7.5 10.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Lock({ size = 11, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none">
      <rect x="2" y="5" width="7" height="4.5" stroke={color} strokeWidth="1" rx="0.5" />
      <path d="M3.5 5 V3.5 a2 2 0 0 1 4 0 V5" stroke={color} strokeWidth="1" fill="none" />
    </svg>
  );
}

export function ExternalLink({ size = 11, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none">
      <path d="M4 2 H2 V9 H9 V7 M6 2 H9 V5 M5 6 L9 2" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Star({ size = 10, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill={color}>
      <path d="M5 1 L6.2 3.7 L9 4 L7 6 L7.5 9 L5 7.5 L2.5 9 L3 6 L1 4 L3.8 3.7 Z" />
    </svg>
  );
}

export function Checkbox({
  checked,
  onClick,
  variant,
}: {
  checked: boolean;
  onClick: (e: MouseEvent) => void;
  variant?: "green";
}) {
  return (
    <span
      className={"cbox " + (checked ? "is-checked " : "") + (variant === "green" ? "green" : "")}
      onClick={onClick}
    >
      <Check size={11} color="#F5F3EE" />
    </span>
  );
}

// Progress bar
export function Bar({
  value,
  max = 1,
  variant = "ink",
  className = "",
  style,
}: {
  value: number;
  max?: number;
  variant?: "ink" | "blue" | "green";
  className?: string;
  style?: CSSProperties;
}) {
  const pct = Math.max(0, Math.min(1, value / max)) * 100;
  return (
    <div
      className={
        "progress " +
        (variant === "blue" ? "progress--blue " : variant === "green" ? "progress--green " : "") +
        className
      }
      style={style}
    >
      <span style={{ width: pct + "%" }} />
    </div>
  );
}

// Heatmap (52w × 7d)
export function Heatmap({ cells, label }: { cells: number[]; label?: string }) {
  return (
    <div>
      <div className="heatmap">
        {cells.map((h, i) => (
          <div
            key={i}
            className="heatmap-cell"
            data-h={h > 0 ? h : undefined}
            style={{ animation: `fadeUp 300ms ${Math.min(i, 200) * 3}ms both` }}
            title=""
          />
        ))}
      </div>
      {label && <div className="eyebrow mt-3">{label}</div>}
    </div>
  );
}

// labelled value pair (numeric)
export function Stat({
  label,
  value,
  sub,
  mono = true,
}: {
  label: string;
  value: string;
  sub?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div
        className={"mt-2 ink " + (mono ? "num " : "serif ")}
        style={{ fontSize: 32, lineHeight: 1, fontWeight: mono ? 500 : 300, letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
      {sub && <div className="fz-12 muted mt-2">{sub}</div>}
    </div>
  );
}

// open a real URL in new tab
export function openLink(url?: string) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}
