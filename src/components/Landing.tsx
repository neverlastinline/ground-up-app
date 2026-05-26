// Landing.tsx — pre-onboarding marketing page.
// The "Create account" CTA (email / github / google) flows straight into
// Onboarding via onContinue().

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useProgress } from "../progress";
import { ArrowRight, Check } from "../primitives";

export function Landing({ onContinue }: { onContinue: () => void }) {
  const { steps } = useProgress();
  const signupRef = useRef<HTMLElement>(null);

  const smoothScrollTo = (el: HTMLElement | null) => {
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };
  const scrollToSignup = () => smoothScrollTo(signupRef.current);
  const scrollToId = (id: string) => smoothScrollTo(document.getElementById(id));

  return (
    <div className="screen" style={{ background: "var(--paper)", minHeight: "100vh" }}>
      {/* ───────────── Top nav ───────────── */}
      <nav
        style={{
          padding: "18px 40px",
          borderBottom: "1px solid var(--line)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(245,243,238,0.92)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="row between center" style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="brand-wordmark">
            Ground Up<span className="dot"></span>
          </div>
          <div className="row center gap-5">
            <a
              href="#what"
              onClick={(e) => { e.preventDefault(); scrollToId("what"); }}
              className="mono fz-11 muted upper"
              style={{ textDecoration: "none", letterSpacing: "0.12em" }}
            >
              What it is
            </a>
            <a
              href="#system"
              onClick={(e) => { e.preventDefault(); scrollToId("system"); }}
              className="mono fz-11 muted upper"
              style={{ textDecoration: "none", letterSpacing: "0.12em" }}
            >
              The system
            </a>
            <a
              href="#maker"
              onClick={(e) => { e.preventDefault(); scrollToId("maker"); }}
              className="mono fz-11 muted upper"
              style={{ textDecoration: "none", letterSpacing: "0.12em" }}
            >
              Maker
            </a>
            <button className="btn btn--ghost btn--sm" onClick={scrollToSignup}>Sign in</button>
            <button className="btn btn--sm" onClick={scrollToSignup}>Create account</button>
          </div>
        </div>
      </nav>

      {/* ───────────── Hero ───────────── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "70px 40px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)", gap: 64, alignItems: "center" }}>
          {/* LEFT — pitch */}
          <div>
            <div className="row center gap-3 mb-4 wrap">
              <span className="badge badge--ink">Public beta</span>
              <span className="mono fz-11 muted" style={{ letterSpacing: "0.06em" }}>
                Cohort 03 · <span className="ink">May 2026</span>
              </span>
            </div>

            <h1
              className="serif-display"
              style={{
                fontSize: "clamp(48px, 6.2vw, 84px)",
                color: "var(--ink)",
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              Learn AI<br />
              <em style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", color: "var(--ink-soft)" }}>
                from the ground up
              </em>
              .
            </h1>

            <p className="serif mt-5" style={{ fontSize: 19, color: "var(--ink-soft)", lineHeight: 1.5, maxWidth: 540 }}>
              A 14-week, hard-gated curriculum that turns "I should learn AI" into a deployed model with a portfolio. No
              streaks for streak's sake. No tutorials that lie about depth. Just seven steps, four prompts a night, and
              one checkpoint you can't skip.
            </p>

            <div className="row gap-3 mt-5 wrap">
              <button className="btn btn--lg" onClick={scrollToSignup}>
                Create your account <ArrowRight size={12} />
              </button>
              <button className="btn btn--ghost btn--lg" onClick={onContinue} title="Skip and explore">
                Skip · see the demo
              </button>
            </div>

            <div className="row gap-5 mt-5 wrap">
              <LandingStat label="learners shipping" value="4,812" />
              <LandingStat label="day-1 retention" value="71%" />
              <LandingStat label="avg. weeks to checkpoint 4" value="6.4" />
            </div>
          </div>

          {/* RIGHT — preview */}
          <div>
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* ───────────── What it is ───────────── */}
      <section id="what" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 40px 24px" }}>
        <div className="eyebrow mb-3">What it is</div>
        <h2
          className="serif-display"
          style={{ fontSize: 44, color: "var(--ink)", maxWidth: 880, lineHeight: 1.08, letterSpacing: "-0.02em", margin: 0 }}
        >
          A structured path through the modern AI stack, end-to-end, with a kill switch at every step.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 48 }}>
          <Feature
            n="01"
            title="Hard-gated checkpoints"
            body="Each of the seven steps ends in a graded checkpoint. Fail it, you don't move on. Pass it, your portfolio gets a real artefact — not a tutorial copy."
          />
          <Feature
            n="02"
            title="Same four prompts, every session"
            body="What I learned. What surprised me. Still unclear. Key terms. Three sentences each. Three months of these out-perform any flashcard app you've tried."
          />
          <Feature
            n="03"
            title="Your stack, your repo"
            body="Obsidian for notes. GitHub for proof. Anthropic / OpenAI / Hugging Face for the work. The portfolio is generated from your own commits — not a generator."
          />
        </div>
      </section>

      {/* ───────────── The system ───────────── */}
      <section id="system" style={{ maxWidth: 1240, margin: "0 auto", padding: "60px 40px" }}>
        <div className="row between wrap mb-5" style={{ alignItems: "baseline", rowGap: 12 }}>
          <div>
            <div className="eyebrow mb-3">The seven-step path</div>
            <h2 className="serif-display" style={{ fontSize: 36, color: "var(--ink)", margin: 0, letterSpacing: "-0.02em" }}>
              Day 1 to deployed in fourteen weeks.
            </h2>
          </div>
          <span className="mono fz-11 muted upper">Hard prerequisites · no skipping</span>
        </div>

        <div className="card card--paper" style={{ padding: 0, overflow: "hidden" }}>
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="row center"
              style={{
                padding: "18px 24px",
                borderBottom: i === steps.length - 1 ? "none" : "1px solid var(--line)",
                gap: 24,
              }}
            >
              <span
                className="serif"
                style={{ fontSize: 36, color: "var(--ink-faint)", fontWeight: 300, minWidth: 56, letterSpacing: "-0.02em" }}
              >
                {String(s.n).padStart(2, "0")}
              </span>
              <div className="grow" style={{ minWidth: 0 }}>
                <div className="serif" style={{ fontSize: 22, color: "var(--ink)", letterSpacing: "-0.01em" }}>
                  {s.name}
                </div>
                <div className="mono fz-11 muted mt-1" style={{ letterSpacing: "0.04em" }}>
                  {s.weeks} · checkpoint: {s.checkpoint}
                </div>
              </div>
              <span className="mono fz-11" style={{ color: "var(--ink-faint)", letterSpacing: "0.04em" }}>
                {s.resources?.length || 0} resources
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── Maker note ───────────── */}
      <section id="maker" style={{ maxWidth: 1240, margin: "0 auto", padding: "60px 40px" }}>
        <div className="card" style={{ padding: 36 }}>
          <div className="row gap-5" style={{ alignItems: "flex-start" }}>
            <div className="avatar" style={{ width: 56, height: 56, fontSize: 18 }}>
              GU
            </div>
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="row center gap-3 mb-2 wrap">
                <span className="badge badge--ink">Maker note</span>
                <span className="mono fz-11 muted">on the system, not the launch</span>
              </div>
              <div className="serif" style={{ fontSize: 20, color: "var(--ink)", lineHeight: 1.45, letterSpacing: "-0.005em" }}>
                I built Ground Up because every "Learn AI in 30 days" course I tried collapsed at week three. The shape
                of this product is the opposite: the easy stuff is short, the hard stuff has a gate, and the only thing
                you do every single night is fill in four prompts. If that sounds tedious, it is. That's the point — the
                discipline is the product, and the product is the discipline.
              </div>
              <div className="mono fz-11 muted mt-4" style={{ letterSpacing: "0.04em" }}>
                — the maker
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Signup ───────────── */}
      <section ref={signupRef} style={{ maxWidth: 760, margin: "0 auto", padding: "60px 40px 100px" }}>
        <Signup onContinue={onContinue} />
      </section>

      {/* ───────────── Footer ───────────── */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "28px 40px", background: "var(--surface-alt)" }}>
        <div className="row between center wrap" style={{ maxWidth: 1240, margin: "0 auto", rowGap: 8 }}>
          <div className="brand-wordmark" style={{ fontSize: 14 }}>
            Ground Up<span className="dot"></span>
          </div>
          <div className="mono fz-11 muted" style={{ letterSpacing: "0.06em" }}>
            © 2026 · The discipline is the product.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ───────────── helpers ───────────── */

function LandingStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="serif num" style={{ fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>
        {value}
      </div>
      <div className="mono fz-11 muted mt-1" style={{ letterSpacing: "0.06em" }}>
        {label}
      </div>
    </div>
  );
}

function Feature({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="card card--paper" style={{ padding: 24 }}>
      <div className="serif" style={{ fontSize: 36, color: "var(--ink-faint)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1 }}>
        {n}
      </div>
      <div className="serif mt-3" style={{ fontSize: 19, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1.25 }}>
        {title}
      </div>
      <div className="mt-3" style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}>
        {body}
      </div>
    </div>
  );
}

/* Compact, hand-styled preview of the app inside a "browser chrome" frame. */
function HeroPreview() {
  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: "hidden",
        boxShadow: "0 24px 60px -28px rgba(10,26,46,0.28), 0 4px 16px -6px rgba(10,26,46,0.10)",
        border: "1px solid var(--line-strong)",
      }}
    >
      {/* window chrome */}
      <div
        className="row center"
        style={{ padding: "10px 14px", borderBottom: "1px solid var(--line)", background: "var(--surface-tint)", gap: 10 }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#D5CFC0" }} />
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#D5CFC0" }} />
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#D5CFC0" }} />
        <span className="mono fz-11 muted" style={{ marginLeft: 12, letterSpacing: "0.04em" }}>
          groundup.app · /dashboard
        </span>
      </div>

      {/* app body */}
      <div style={{ background: "var(--paper)", padding: "22px 24px" }}>
        <div className="row between center mb-3">
          <div className="eyebrow">Tonight · day 1 of step 1</div>
          <span className="row center gap-2">
            <span className="dot dot-muted" />
            <span className="mono fz-11 muted upper">Streak · not started</span>
          </span>
        </div>

        <div className="serif-display" style={{ fontSize: 26, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
          Environment Setup
        </div>
        <div className="mono fz-11 muted mt-2" style={{ letterSpacing: "0.04em" }}>
          obsidian-vault &nbsp;›&nbsp; AI-Learning/
        </div>

        <hr className="hr-dash mt-4 mb-4" />

        <div className="col gap-2">
          <MiniTask done text="Install Python 3.11+ and uv" />
          <MiniTask done text="Set up Obsidian + AI-Learning vault" />
          <MiniTask text="Sign up for Anthropic Academy" />
          <MiniTask text="Add OPENAI / ANTHROPIC keys to .env" />
        </div>

        <hr className="hr-dash mt-4 mb-3" />

        <div className="row between center">
          <span className="mono fz-11 muted">
            <span className="ink num">2</span> / 4 done
          </span>
          <span className="btn btn--sm btn--green" style={{ pointerEvents: "none" }}>
            Mark tonight's session done
          </span>
        </div>
      </div>
    </div>
  );
}

function MiniTask({ text, done }: { text: string; done?: boolean }) {
  return (
    <div className="row center gap-3" style={{ fontSize: 13 }}>
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 2,
          border: "1px solid " + (done ? "var(--green)" : "var(--line-strong)"),
          background: done ? "var(--green)" : "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {done && <Check size={9} color="#F5F3EE" />}
      </span>
      <span
        style={{
          color: done ? "var(--ink-faint)" : "var(--ink)",
          textDecoration: done ? "line-through" : "none",
          textDecorationColor: "var(--ink-faint)",
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ───────────── Signup card with SSO + email ───────────── */

type Provider = "github" | "google" | "email";

function Signup({ onContinue }: { onContinue: () => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<Provider | null>(null);

  const fakeAuth = (provider: Provider, e?: FormEvent) => {
    if (e) e.preventDefault();
    if (provider === "email" && !email.trim()) return;
    setBusy(provider);
    setTimeout(() => {
      setBusy(null);
      onContinue();
    }, 650);
  };

  return (
    <div className="card" style={{ padding: 36 }}>
      <div style={{ textAlign: "center" }}>
        <div className="eyebrow">Create your account</div>
        <h3 className="serif-display mt-2" style={{ fontSize: 32, color: "var(--ink)", margin: 0, letterSpacing: "-0.02em" }}>
          Start tonight. Day 1 takes 45 minutes.
        </h3>
        <div className="mono fz-11 muted mt-3" style={{ letterSpacing: "0.04em" }}>
          Free while in public beta · no card · cancel any time
        </div>
      </div>

      <hr className="hr-dash mt-5 mb-5" />

      {/* SSO buttons */}
      <div className="col gap-3">
        <SSOButton
          label={busy === "github" ? "Authorising…" : "Continue with GitHub"}
          disabled={!!busy}
          onClick={() => fakeAuth("github")}
          icon={<GithubIcon />}
        />
        <SSOButton
          label={busy === "google" ? "Signing in…" : "Continue with Google"}
          disabled={!!busy}
          onClick={() => fakeAuth("google")}
          icon={<GoogleIcon />}
        />
      </div>

      {/* divider */}
      <div className="row center gap-3" style={{ margin: "22px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span className="mono fz-11 muted upper" style={{ letterSpacing: "0.12em" }}>
          or email
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      {/* email form */}
      <form onSubmit={(e) => fakeAuth("email", e)}>
        <label className="field-label" htmlFor="signup-email">
          Email address
        </label>
        <input
          id="signup-email"
          className="input"
          type="email"
          required
          placeholder="you@where-you-work.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!!busy}
        />
        <button type="submit" className="btn btn--lg" disabled={!email.trim() || !!busy} style={{ width: "100%", marginTop: 14 }}>
          {busy === "email" ? "Creating account…" : "Create account with email"}
          {busy !== "email" && <ArrowRight size={12} />}
        </button>
      </form>

      <div className="mono fz-11 muted mt-5" style={{ letterSpacing: "0.04em", textAlign: "center", lineHeight: 1.6 }}>
        By creating an account you accept our terms.
        <br />
        Already have one?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); onContinue(); }} className="link">
          Sign in →
        </a>
      </div>
    </div>
  );
}

function SSOButton({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="btn btn--ghost btn--lg"
      onClick={onClick}
      disabled={disabled}
      style={{ width: "100%", justifyContent: "center", gap: 12, fontSize: 14, fontWeight: 500 }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 .2A8 8 0 0 0 5.47 15.79c.4.07.55-.17.55-.39v-1.4c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.11.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.74-3.65 3.94.29.25.55.74.55 1.49v2.2c0 .22.14.47.55.39A8 8 0 0 0 8 .2Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.72v2.27h2.89c1.7-1.56 2.7-3.87 2.7-6.63Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.89-2.27c-.8.54-1.84.86-3.07.86-2.36 0-4.36-1.6-5.08-3.74H.95v2.34A9 9 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.92 10.67a5.42 5.42 0 0 1 0-3.4V4.93H.95a9 9 0 0 0 0 8.08l2.97-2.34Z" fill="#FBBC05" />
      <path d="M9 3.58c1.33 0 2.52.46 3.46 1.35l2.58-2.58A9 9 0 0 0 .95 4.93l2.97 2.34C4.64 5.13 6.64 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  );
}
