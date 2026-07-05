import AnimatedCodeWindow from './AnimatedCodeWindow';
import { BrandLogo, brandOrder, brandLabels } from './BrandLogos';

const stats = [
  { number: '4', color: 'var(--accent-blue)', label: 'AI agents per task', sub: 'Claude · GPT-4o · Copilot · AntiGravity' },
  { number: '1 click', color: 'var(--accent-teal)', label: 'Task → commit → PR', sub: 'Branch, PR & ticket close, automated' },
  { number: '3', color: 'var(--accent-green)', label: 'Systems, one workflow', sub: 'Jira · Azure DevOps · GitHub' },
];

export default function HeroSection() {
  return (
    <section className="lp-section" style={{ paddingTop: 'clamp(128px, 16vh, 180px)', paddingBottom: 'clamp(64px, 8vw, 96px)' }}>
      <div className="lp-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(40px, 5vw, 72px)', alignItems: 'center' }}>

        {/* ── Left column ── */}
        <div style={{ minWidth: 0 }}>
          <div className="lp-chip" style={{ marginBottom: 26 }}>
            <span className="lp-dot-live" />
            Orchestrated AI developer co-pilot
          </div>

          <h1 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 800, letterSpacing: '-0.03em',
            fontSize: 'clamp(40px, 5.4vw, 66px)', lineHeight: 1.02, color: 'var(--text-primary)', margin: 0,
          }}>
            Stop losing <span className="lp-grad">half</span> of every developer&rsquo;s week.
          </h1>

          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 'clamp(16px, 2vw, 19px)', color: 'var(--text-secondary)',
            maxWidth: 540, margin: '26px 0 0', lineHeight: 1.65,
          }}>
            Blue Mantis wires your Jira and Azure DevOps tasks straight into your Git repository —
            with four AI agents writing, debating, and ranking the best change. One click commits it,
            opens the PR, and closes the ticket.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginTop: 36 }}>
            <a href="/app/sign-up" className="lp-btn lp-btn-primary">Start free — no card needed</a>
            <button
              className="lp-btn lp-btn-ghost"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See how it works ↓
            </button>
          </div>

          {/* Trust row — real integration logos */}
          <div style={{ marginTop: 44 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
              Works with the tools your team already uses
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
              {brandOrder.map(name => (
                <div key={name} title={brandLabels[name]} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.85 }}>
                  <BrandLogo name={name} size={22} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{brandLabels[name]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column — glowing glass code window ── */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', minWidth: 0 }}>
          <div aria-hidden="true" style={{
            position: 'absolute', inset: '-8%', borderRadius: 32,
            background: 'radial-gradient(circle at 60% 40%, rgba(77,148,216,0.28), transparent 62%)',
            filter: 'blur(30px)', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 540 }}>
            <AnimatedCodeWindow />

            {/* Floating "PR opened" badge */}
            <div className="lp-glass" style={{
              position: 'absolute', bottom: -22, left: -18, padding: '12px 16px', borderRadius: 14,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <BrandLogo name="github" size={18} />
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>PR #1287 opened</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-green)' }}>ticket closed automatically</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="lp-container" style={{ marginTop: 'clamp(56px, 7vw, 88px)' }}>
        <div className="lp-glass" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          padding: 4, borderRadius: 18,
        }}>
          {stats.map((stat, i) => (
            <div key={stat.label} style={{
              padding: '22px 26px',
              borderLeft: i > 0 ? '1px solid var(--lp-glass-border)' : 'none',
            }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: stat.number.length > 3 ? 28 : 36, color: stat.color, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {stat.number}
              </span>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-primary)', marginTop: 8, fontWeight: 600 }}>{stat.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
