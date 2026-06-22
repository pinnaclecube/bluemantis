import { useEffect, useState, type FormEvent } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Launch countdown target. ~10 days out — adjust this single constant to move
   the launch date.
   ────────────────────────────────────────────────────────────────────────── */
const LAUNCH_DATE = new Date("2026-07-01T17:00:00Z");
const LINKEDIN_URL = "https://www.linkedin.com/company/venakan/";

const AGENTS = [
  { name: "Claude", color: "var(--accent-purple)" },
  { name: "OpenAI", color: "var(--accent-teal)" },
  { name: "Copilot", color: "var(--accent-blue)" },
  { name: "AntiGravity", color: "var(--accent-amber)" },
];

const PIPELINE = ["PLM", "Code repos", "Tasks", "Review", "Deploy"];

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

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="cd-unit">
      <span className="cd-num">{String(value).padStart(2, "0")}</span>
      <span className="cd-label">{label}</span>
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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="wl-success">
        <div className="wl-check">✓</div>
        <h3 style={{ margin: "12px 0 4px", fontSize: 20 }}>You're on the list</h3>
        <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: 15 }}>
          We'll email you the moment Blue Mantis goes live. In the meantime, follow our journey:
        </p>
        <a className="btn-linkedin" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{ marginTop: 16 }}>
          <LinkedInIcon /> Follow Venakan on LinkedIn
        </a>
      </div>
    );
  }

  return (
    <form className="wl-form" onSubmit={submit}>
      <div className="wl-row">
        <input
          className="wl-input"
          type="email"
          required
          placeholder="Work email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Work email"
        />
      </div>
      <div className="wl-row-2">
        <input className="wl-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Name" />
        <input className="wl-input" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} aria-label="Company" />
      </div>
      <button className="wl-submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Joining…" : "Join the waitlist"}
      </button>
      {status === "error" && <p className="wl-error">{error}</p>}
      <p className="wl-fine">No spam. One email when we launch.</p>
    </form>
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
  const cd = useCountdown(LAUNCH_DATE);
  const base = import.meta.env.BASE_URL;

  return (
    <div className="cs">
      <style>{CS_STYLES}</style>

      <header className="cs-top">
        <div className="cs-brand">
          <img src={`${base}logo.png`} alt="Blue Mantis" style={{ height: 26, width: "auto" }} />
          <span className="cs-word">Blue Mantis</span>
        </div>
        <div className="cs-topright">
          <a className="btn-linkedin sm" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <LinkedInIcon /> Follow
          </a>
          <a className="cs-signin" href="/app/sign-in">Sign in</a>
        </div>
      </header>

      <main className="cs-main">
        <span className="cs-badge">
          <span className="cs-badge-dot" /> Private beta · launching soon
        </span>

        <h1 className="cs-h1">
          The AI dev team that <span className="cs-em">ships your backlog</span>.
        </h1>

        <p className="cs-sub">
          Blue Mantis connects to your PLMs and code repositories, picks up open work autonomously,
          and hands you the authority to review and deploy — cutting delivery time on routine work
          from days to minutes. Built for dev teams and enterprises managing real workloads.
        </p>

        <div className="cd">
          {cd.done ? (
            <span className="cd-live">We're live 🎉</span>
          ) : (
            <>
              <CountUnit value={cd.days} label="Days" />
              <span className="cd-sep">:</span>
              <CountUnit value={cd.hours} label="Hours" />
              <span className="cd-sep">:</span>
              <CountUnit value={cd.minutes} label="Min" />
              <span className="cd-sep">:</span>
              <CountUnit value={cd.seconds} label="Sec" />
            </>
          )}
        </div>

        <AgentAnimation />

        <div className="wl-card" id="waitlist">
          <h2 className="wl-title">Be first in line</h2>
          <p className="wl-desc">Join the waitlist for early access when we launch.</p>
          <WaitlistForm />
        </div>

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
    radial-gradient(900px 500px at 50% -10%, rgba(2,184,160,0.16), transparent 70%),
    radial-gradient(700px 400px at 85% 10%, rgba(77,148,216,0.12), transparent 70%),
    var(--bg-app);
  display: flex; flex-direction: column;
}
.cs-top { display: flex; align-items: center; justify-content: space-between; padding: 20px 28px; max-width: 1120px; margin: 0 auto; width: 100%; box-sizing: border-box; }
.cs-brand { display: flex; align-items: center; gap: 10px; }
.cs-word { font-size: 18px; font-weight: 700; letter-spacing: -0.01em; }
.cs-topright { display: flex; align-items: center; gap: 16px; }
.cs-signin { color: var(--text-secondary); font-size: 14px; text-decoration: none; }
.cs-signin:hover { color: var(--text-primary); }

.btn-linkedin {
  display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
  background: #0A66C2; color: #fff; padding: 10px 16px; border-radius: var(--radius-md);
  font-size: 14px; font-weight: 600;
}
.btn-linkedin:hover { filter: brightness(1.08); }
.btn-linkedin.sm { padding: 7px 12px; font-size: 13px; }

.cs-main { flex: 1; max-width: 880px; margin: 0 auto; width: 100%; box-sizing: border-box; padding: 32px 28px 64px; text-align: center; }

.cs-badge {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid var(--border-bright); border-radius: 999px;
  padding: 6px 14px; font-size: 13px; color: var(--text-secondary);
  background: rgba(2,184,160,0.06); animation: fadeInUp 0.5s ease both;
}
.cs-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent-teal); animation: pulseDot 1.8s infinite; }

.cs-h1 {
  font-family: var(--font-serif); font-weight: 600; line-height: 1.05;
  font-size: clamp(36px, 6vw, 60px); letter-spacing: -0.02em;
  margin: 22px 0 0; animation: fadeInUp 0.5s ease 0.05s both;
}
.cs-em { color: var(--accent-teal); font-style: italic; }
.cs-sub {
  max-width: 620px; margin: 18px auto 0; color: var(--text-secondary);
  font-size: clamp(15px, 2vw, 18px); line-height: 1.6; animation: fadeInUp 0.5s ease 0.1s both;
}

.cd { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 32px 0 8px; animation: fadeInUp 0.5s ease 0.15s both; }
.cd-unit { display: flex; flex-direction: column; align-items: center; min-width: 72px; padding: 12px 8px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--bg-surface); }
.cd-num { font-family: var(--font-mono); font-size: clamp(28px, 5vw, 40px); font-weight: 700; color: var(--text-primary); line-height: 1; }
.cd-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); margin-top: 8px; }
.cd-sep { font-size: 28px; color: var(--text-muted); font-family: var(--font-mono); }
.cd-live { font-size: 24px; font-weight: 700; color: var(--accent-teal); }

.agents { margin: 40px auto 8px; max-width: 720px; animation: fadeInUp 0.5s ease 0.2s both; }
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

.wl-card { margin: 48px auto 0; max-width: 460px; border: 1px solid var(--border); background: var(--bg-surface); border-radius: var(--radius-lg); padding: 28px; animation: fadeInUp 0.5s ease 0.25s both; }
.wl-title { font-size: 22px; font-weight: 700; margin: 0; }
.wl-desc { color: var(--text-secondary); margin: 6px 0 18px; font-size: 14px; }
.wl-form { display: flex; flex-direction: column; gap: 10px; }
.wl-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.wl-input { width: 100%; box-sizing: border-box; background: var(--bg-app); border: 1px solid var(--border-bright); border-radius: var(--radius-md); padding: 11px 13px; color: var(--text-primary); font-size: 14px; font-family: var(--font-sans); outline: none; }
.wl-input:focus { border-color: var(--accent-teal); }
.wl-input::placeholder { color: var(--text-muted); }
.wl-submit { margin-top: 4px; background: var(--accent-teal); color: #04221d; border: none; border-radius: var(--radius-md); padding: 12px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: var(--font-sans); }
.wl-submit:hover:not(:disabled) { filter: brightness(1.06); }
.wl-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.wl-error { color: var(--accent-red); font-size: 13px; margin: 4px 0 0; }
.wl-fine { color: var(--text-muted); font-size: 12px; margin: 6px 0 0; }
.wl-success { text-align: center; padding: 8px 0; display: flex; flex-direction: column; align-items: center; }
.wl-check { width: 48px; height: 48px; border-radius: 50%; background: rgba(2,184,160,0.15); color: var(--accent-teal); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; }

.feat { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 56px auto 0; text-align: left; animation: fadeInUp 0.5s ease 0.3s both; }
.feat-title { font-size: 14px; font-weight: 700; margin: 0 0 6px; }
.feat-body { font-size: 13px; color: var(--text-secondary); margin: 0; line-height: 1.5; }

.cs-foot { border-top: 1px solid var(--border); padding: 22px 28px; display: flex; align-items: center; justify-content: center; gap: 18px; flex-wrap: wrap; max-width: 1120px; margin: 0 auto; width: 100%; box-sizing: border-box; }
.cs-foot-link { display: inline-flex; align-items: center; gap: 7px; color: var(--text-secondary); text-decoration: none; font-size: 13px; }
.cs-foot-link:hover { color: var(--text-primary); }
.cs-foot-powered { font-size: 13px; color: var(--text-secondary); }
.cs-foot-powered strong { color: var(--accent-teal); font-weight: 700; }
.cs-foot-copy { font-size: 13px; color: var(--text-muted); }

@keyframes pulseDot { 0%,100% { box-shadow: 0 0 0 0 rgba(2,184,160,0.5); } 50% { box-shadow: 0 0 0 6px rgba(2,184,160,0); } }
@keyframes blink { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
@keyframes load { 0% { transform: translateX(-120%); } 100% { transform: translateX(320%); } }
@keyframes flow { 0% { left: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { left: 100%; opacity: 0; } }

@media (max-width: 680px) {
  .agents-grid { grid-template-columns: repeat(2, 1fr); }
  .feat { grid-template-columns: repeat(2, 1fr); }
  .pipe-label { font-size: 10px; }
  .cd-unit { min-width: 60px; }
}
`;
