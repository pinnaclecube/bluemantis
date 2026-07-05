import { useEffect, useState, type FormEvent } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Launch countdown target — adjust this single constant to move the date.
   ────────────────────────────────────────────────────────────────────────── */
const LAUNCH_DATE = new Date("2026-07-05T17:00:00Z");
const LINKEDIN_URL = "https://www.linkedin.com/company/venakan/";

const AGENTS = [
  { name: "Claude", color: "var(--accent-purple)" },
  { name: "OpenAI", color: "var(--accent-teal)" },
  { name: "Copilot", color: "var(--accent-blue)" },
  { name: "AntiGravity", color: "var(--accent-amber)" },
];

const PIPELINE = ["PLM", "Code repos", "Tasks", "Review", "Deploy"];

/* Real integration partners — the tools Blue Mantis actually connects to.
   Brand marks are rendered inline (no external logo assets); this is
   nominative "works with" use under a truthful heading, not a customer /
   endorsement claim. Paths are the official brand marks (24×24 viewBox). */
const INTEGRATIONS = [
  {
    name: "GitHub",
    color: "var(--text-primary)",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  {
    name: "Jira",
    color: "#2684FF",
    path: "M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0z",
  },
  {
    name: "Azure DevOps",
    color: "#3B9BE8",
    path: "M0 8.877L2.247 5.91l8.405-3.416V.022l7.37 5.393L2.966 8.338v8.225L0 15.707zm24-4.45v14.651l-5.753 4.9-9.303-3.057v3.056l-5.978-7.416 15.057 1.798V5.415z",
  },
  {
    name: "OpenAI",
    color: "#10A37F",
    path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.1419.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  },
  {
    name: "Claude",
    color: "#D97757",
    path: "M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z",
  },
];

const FEATURES = [
  { title: "Connects to your stack", body: "Azure DevOps, Jira & GitHub — synced in one place." },
  { title: "Autonomous task handling", body: "Agents pick up open work and propose the change." },
  { title: "You review & deploy", body: "Approve a branch, open a PR, close the ticket — one click." },
  { title: "Ship dramatically faster", body: "Cut delivery time on routine work from days to minutes." },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: diff === 0,
  };
}

function HeaderCountdown() {
  const cd = useCountdown(LAUNCH_DATE);
  if (cd.done) return <div className="cs-countdown"><span className="cdm-live">We're live 🎉</span></div>;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="cs-countdown" aria-label="Time until launch">
      <span className="cdm-lead">Launching in</span>
      <span className="cdm"><b>{pad(cd.days)}</b>d</span>
      <span className="cdm"><b>{pad(cd.hours)}</b>h</span>
      <span className="cdm"><b>{pad(cd.minutes)}</b>m</span>
      <span className="cdm"><b>{pad(cd.seconds)}</b>s</span>
    </div>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "already" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, company }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; alreadyJoined?: boolean };
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus(data.alreadyJoined ? "already" : "success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "already") {
    return (
      <div className="wl-success">
        <div className="wl-check" style={{ background: "rgba(77,148,216,0.15)", color: "var(--accent-blue)" }}>✓</div>
        <h3 style={{ margin: "12px 0 4px", fontSize: 19 }}>You're already on the list</h3>
        <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: 14 }}>
          <strong style={{ color: "var(--text-primary)" }}>{email}</strong> is already on the waitlist — we've got you.
          We'll email you the moment we launch.
        </p>
        <a className="btn-linkedin" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{ marginTop: 16 }}>
          <LinkedInIcon /> Follow on LinkedIn
        </a>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="wl-success">
        <div className="wl-check">✓</div>
        <h3 style={{ margin: "12px 0 4px", fontSize: 19 }}>You're on the list</h3>
        <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: 14 }}>
          We'll email you the moment Blue Mantis goes live. In the meantime, follow along:
        </p>
        <a className="btn-linkedin" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{ marginTop: 16 }}>
          <LinkedInIcon /> Follow on LinkedIn
        </a>
      </div>
    );
  }

  return (
    <form className="wl-form" onSubmit={submit}>
      <input
        className="wl-input"
        type="email"
        required
        placeholder="Work email *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Work email"
      />
      <input className="wl-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Name" />
      <input className="wl-input" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} aria-label="Company" />
      <button className="wl-submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Joining…" : "Join the waitlist"}
      </button>
      {status === "error" && <p className="wl-error">{error}</p>}
      <p className="wl-fine">No spam. One email when we launch.</p>
    </form>
  );
}

function IntegrationsBar() {
  // Triple the list so the short 5-logo marquee loops seamlessly.
  const items = [...INTEGRATIONS, ...INTEGRATIONS, ...INTEGRATIONS];
  return (
    <section className="logos" aria-label="Integrates with GitHub, Jira, Azure DevOps, OpenAI and Claude">
      <p className="logos-lead">Works with the tools your team already uses</p>
      <div className="logos-viewport">
        <div className="logos-track">
          {items.map((c, i) => (
            <div className="logo-item" key={`${c.name}-${i}`} aria-hidden={i >= INTEGRATIONS.length}>
              <svg
                className="logo-glyph"
                viewBox="0 0 24 24"
                style={{ color: c.color }}
                role="img"
                aria-hidden="true"
                focusable="false"
              >
                <path fill="currentColor" d={c.path} />
              </svg>
              <span className="logo-word">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentAnimation() {
  return (
    <div className="agents" aria-hidden="true">
      <div className="agents-grid">
        {AGENTS.map((a, i) => (
          <div className="agent" key={a.name} style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="agent-head">
              <span className="agent-dot" style={{ background: a.color }} />
              <span className="agent-name">{a.name}</span>
              <span className="agent-working">
                <i style={{ animationDelay: "0s" }} />
                <i style={{ animationDelay: "0.2s" }} />
                <i style={{ animationDelay: "0.4s" }} />
              </span>
            </div>
            <div className="agent-bar"><span style={{ animationDelay: `${i * 0.4}s` }} /></div>
          </div>
        ))}
      </div>

      <div className="pipe">
        {PIPELINE.map((p, i) => (
          <div className="pipe-stage" key={p}>
            {i < PIPELINE.length - 1 && <span className="pipe-link" />}
            <span className="pipe-node" style={{ animationDelay: `${i * 0.6}s` }} />
            <span className="pipe-label">{p}</span>
          </div>
        ))}
        <span className="pipe-flow" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const base = import.meta.env.BASE_URL;

  return (
    <div className="cs">
      <style>{CS_STYLES}</style>

      <header className="cs-top">
        <div className="cs-brand">
          <img src={`${base}logo.png`} alt="Blue Mantis" style={{ height: 24, width: "auto" }} />
          <span className="cs-word">Blue Mantis</span>
        </div>
        <HeaderCountdown />
        <div className="cs-topright">
          <a className="btn-linkedin sm" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <LinkedInIcon /> Follow
          </a>
        </div>
      </header>

      <main className="cs-main">
        <section className="cs-hero">
          <div className="cs-hero-left">
            <h1 className="cs-h1">
              The AI dev team that <span className="cs-em">ships your backlog</span>.
            </h1>
            <p className="cs-sub">
              Blue Mantis connects to your PLMs and code repositories, picks up open work autonomously,
              and hands you the authority to review and deploy — cutting delivery time on routine work
              from days to minutes. Built for dev teams and enterprises managing real workloads.
            </p>
          </div>

          <div className="cs-hero-right">
            <div className="wl-card" id="waitlist">
              <h2 className="wl-title">Join the waitlist</h2>
              <p className="wl-desc">Be first in line for early access at launch.</p>
              <WaitlistForm />
            </div>
          </div>
        </section>

        <IntegrationsBar />

        <AgentAnimation />

        <div className="feat">
          {FEATURES.map((f) => (
            <div className="feat-item" key={f.title}>
              <h3 className="feat-title">{f.title}</h3>
              <p className="feat-body">{f.body}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="cs-foot">
        <a className="cs-foot-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
          <LinkedInIcon /> linkedin.com/company/venakan
        </a>
        <span className="cs-foot-powered">
          Powered by <strong>Venakan Info Solutions</strong>
        </span>
        <span className="cs-foot-copy">© {new Date().getFullYear()} Blue Mantis</span>
      </footer>
    </div>
  );
}

const CS_STYLES = `
.cs {
  min-height: 100vh; position: relative; overflow: hidden;
  background:
    radial-gradient(900px 500px at 30% -10%, rgba(2,184,160,0.16), transparent 70%),
    radial-gradient(700px 400px at 90% 0%, rgba(77,148,216,0.12), transparent 70%),
    var(--bg-app);
  display: flex; flex-direction: column;
}
.cs-top {
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
  padding: 16px 28px; max-width: 1180px; margin: 0 auto; width: 100%; box-sizing: border-box;
}
.cs-brand { display: flex; align-items: center; gap: 10px; justify-self: start; }
.cs-word { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }
.cs-topright { justify-self: end; }

/* compact header countdown */
.cs-countdown {
  justify-self: center; display: inline-flex; align-items: center; gap: 7px;
  border: 1px solid var(--border); background: var(--bg-surface);
  padding: 5px 12px; border-radius: 999px;
  font-family: var(--font-mono); font-size: 12.5px; color: var(--text-muted); white-space: nowrap;
}
.cdm-lead { font-family: var(--font-sans); color: var(--text-muted); font-size: 12px; margin-right: 1px; }
.cdm b { color: var(--text-primary); font-weight: 700; }
.cdm-live { color: var(--accent-teal); font-weight: 700; font-family: var(--font-sans); }

.btn-linkedin {
  display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
  background: #0A66C2; color: #fff; padding: 10px 16px; border-radius: var(--radius-md);
  font-size: 14px; font-weight: 600;
}
.btn-linkedin:hover { filter: brightness(1.08); }
.btn-linkedin.sm { padding: 7px 12px; font-size: 13px; }

.cs-main { flex: 1; max-width: 1180px; margin: 0 auto; width: 100%; box-sizing: border-box; padding: 28px 28px 64px; }

/* two-pane hero: 70% messaging / 30% form */
.cs-hero { display: grid; grid-template-columns: minmax(0, 7fr) minmax(312px, 3fr); gap: 48px; align-items: center; margin: 24px 0 8px; }
.cs-hero-left { text-align: left; }
.cs-h1 {
  font-family: var(--font-serif); font-weight: 600; line-height: 1.05;
  font-size: clamp(34px, 4.4vw, 56px); letter-spacing: -0.02em;
  margin: 0; animation: fadeInUp 0.5s ease both;
}
.cs-em { color: var(--accent-teal); font-style: italic; }
.cs-sub {
  max-width: 560px; margin: 18px 0 0; color: var(--text-secondary);
  font-size: clamp(15px, 1.4vw, 18px); line-height: 1.6; animation: fadeInUp 0.5s ease 0.08s both;
}

.cs-hero-right { animation: fadeInUp 0.5s ease 0.14s both; }
.wl-card { border: 1px solid var(--border); background: var(--bg-surface); border-radius: var(--radius-lg); padding: 24px; }
.wl-title { font-size: 19px; font-weight: 700; margin: 0; }
.wl-desc { color: var(--text-secondary); margin: 6px 0 16px; font-size: 13.5px; }
.wl-form { display: flex; flex-direction: column; gap: 10px; }
.wl-input { width: 100%; box-sizing: border-box; background: var(--bg-app); border: 1px solid var(--border-bright); border-radius: var(--radius-md); padding: 11px 13px; color: var(--text-primary); font-size: 14px; font-family: var(--font-sans); outline: none; }
.wl-input:focus { border-color: var(--accent-teal); }
.wl-input::placeholder { color: var(--text-muted); }
.wl-submit { margin-top: 2px; background: var(--accent-teal); color: #04221d; border: none; border-radius: var(--radius-md); padding: 12px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: var(--font-sans); }
.wl-submit:hover:not(:disabled) { filter: brightness(1.06); }
.wl-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.wl-error { color: var(--accent-red); font-size: 13px; margin: 4px 0 0; }
.wl-fine { color: var(--text-muted); font-size: 12px; margin: 6px 0 0; }
.wl-success { text-align: center; padding: 8px 0; display: flex; flex-direction: column; align-items: center; }
.wl-check { width: 46px; height: 46px; border-radius: 50%; background: rgba(2,184,160,0.15); color: var(--accent-teal); display: flex; align-items: center; justify-content: center; font-size: 23px; font-weight: 700; }

/* interest marquee */
.logos { margin: 40px auto 4px; max-width: 980px; animation: fadeInUp 0.5s ease 0.24s both; }
.logos-lead { text-align: center; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin: 0 0 18px; }
.logos-viewport {
  position: relative; overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.logos-track { display: flex; width: max-content; gap: 40px; animation: marquee 38s linear infinite; }
.logos-viewport:hover .logos-track { animation-play-state: paused; }
.logo-item { display: inline-flex; align-items: center; gap: 11px; flex-shrink: 0; opacity: 0.82; transition: opacity 180ms ease; }
.logo-item:hover { opacity: 1; }
.logo-glyph { width: 26px; height: 26px; flex-shrink: 0; display: block; }
.logo-word { font-size: 15px; font-weight: 600; color: var(--text-secondary); white-space: nowrap; }

@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.3333%); } }
@media (prefers-reduced-motion: reduce) { .logos-track { animation: none; } }

/* agents */
.agents { margin: 36px auto 8px; max-width: 760px; animation: fadeInUp 0.5s ease 0.2s both; }
.agents-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.agent { border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--bg-surface); padding: 12px; text-align: left; animation: fadeInUp 0.5s ease both; }
.agent-head { display: flex; align-items: center; gap: 8px; }
.agent-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; animation: pulseDot 1.6s infinite; }
.agent-name { font-size: 13px; font-weight: 600; flex: 1; }
.agent-working { display: inline-flex; gap: 3px; }
.agent-working i { width: 4px; height: 4px; border-radius: 50%; background: var(--text-muted); display: inline-block; animation: blink 1.2s infinite; }
.agent-bar { height: 4px; border-radius: 4px; background: var(--bg-raised); margin-top: 10px; overflow: hidden; }
.agent-bar span { display: block; height: 100%; width: 40%; border-radius: 4px; background: linear-gradient(90deg, var(--accent-teal), var(--accent-blue)); animation: load 2.4s ease-in-out infinite; }

.pipe { position: relative; display: flex; align-items: flex-start; justify-content: space-between; margin-top: 26px; padding: 0 6px; }
.pipe-stage { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; }
.pipe-node { width: 12px; height: 12px; border-radius: 50%; background: var(--bg-raised); border: 2px solid var(--accent-teal); z-index: 1; animation: pulseDot 2s infinite; }
.pipe-label { font-size: 11px; color: var(--text-secondary); font-family: var(--font-mono); white-space: nowrap; }
.pipe-link { position: absolute; top: 5px; left: 50%; width: 100%; height: 2px; background: var(--border-bright); z-index: 0; }
.pipe-flow { position: absolute; top: 3px; left: 0; width: 8px; height: 8px; border-radius: 50%; background: var(--accent-teal); box-shadow: 0 0 10px var(--accent-teal); animation: flow 3.2s linear infinite; }

.feat { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 52px auto 0; text-align: left; animation: fadeInUp 0.5s ease 0.3s both; }
.feat-title { font-size: 14px; font-weight: 700; margin: 0 0 6px; }
.feat-body { font-size: 13px; color: var(--text-secondary); margin: 0; line-height: 1.5; }

.cs-foot { border-top: 1px solid var(--border); padding: 22px 28px; display: flex; align-items: center; justify-content: center; gap: 18px; flex-wrap: wrap; max-width: 1180px; margin: 0 auto; width: 100%; box-sizing: border-box; }
.cs-foot-link { display: inline-flex; align-items: center; gap: 7px; color: var(--text-secondary); text-decoration: none; font-size: 13px; }
.cs-foot-link:hover { color: var(--text-primary); }
.cs-foot-powered { font-size: 13px; color: var(--text-secondary); }
.cs-foot-powered strong { color: var(--accent-teal); font-weight: 700; }
.cs-foot-copy { font-size: 13px; color: var(--text-muted); }

@keyframes pulseDot { 0%,100% { box-shadow: 0 0 0 0 rgba(2,184,160,0.5); } 50% { box-shadow: 0 0 0 6px rgba(2,184,160,0); } }
@keyframes blink { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
@keyframes load { 0% { transform: translateX(-120%); } 100% { transform: translateX(320%); } }
@keyframes flow { 0% { left: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { left: 100%; opacity: 0; } }

@media (max-width: 900px) {
  .cs-hero { grid-template-columns: 1fr; gap: 28px; }
  .cs-hero-right { max-width: 460px; }
}
@media (max-width: 680px) {
  .cs-countdown { display: none; }
  .cs-top { grid-template-columns: 1fr auto; }
  .agents-grid { grid-template-columns: repeat(2, 1fr); }
  .feat { grid-template-columns: repeat(2, 1fr); }
  .pipe-label { font-size: 10px; }
}
`;
