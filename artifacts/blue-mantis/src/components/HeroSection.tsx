import AnimatedCodeWindow from './AnimatedCodeWindow';
import { useScrollReveal } from '../hooks/useScrollReveal';

const stats = [
  { number: '73%', color: 'var(--accent-blue)', label: 'Task close rate', sub: 'vs 31% Copilot benchmark' },
  { number: '78%', color: 'var(--accent-teal)', label: 'Faster to first PR', sub: '43 min avg vs 3.2 hrs' },
  { number: 'NPS 67', color: 'var(--accent-green)', label: 'Developer satisfaction', sub: 'after first sprint' },
];

export default function HeroSection() {
  const reveal = useScrollReveal();

  return (
    <section style={{
      minHeight: '90vh', display: 'flex', alignItems: 'center',
      background: 'var(--bg-app)', paddingTop: 80,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '48px 24px',
        display: 'flex', gap: 64, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <div ref={reveal.ref as any} style={{ flex: 1, maxWidth: 580, minWidth: 280, ...reveal.style }}>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 11, letterSpacing: '0.12em',
            color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: 16, margin: 0,
          }}>
            Orchestrated AI Developer Co-Pilot
          </p>

          <h1 style={{
            fontFamily: 'var(--font-serif)', fontWeight: 900,
            fontSize: 'clamp(40px, 5vw, 60px)', lineHeight: 1.1,
            color: 'var(--text-primary)', marginTop: 16, marginBottom: 0,
          }}>
            Stop losing 58%<br />of every developer's week.
          </h1>

          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--text-secondary)',
            maxWidth: 520, marginTop: 20, lineHeight: 1.6,
          }}>
            Blue Mantis connects your JIRA or Azure DevOps tasks directly to your Git repository — with four AI agents writing, debating, and recommending the best code. One click commits, opens a PR, and closes the ticket.
          </p>

          <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '14px 28px', background: 'var(--accent-blue)', color: '#0C1E2E',
                border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#5BA8E8')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent-blue)')}
            >
              Start free — no card needed
            </button>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--accent-blue)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              See how it works ↓
            </button>
          </div>

          <div style={{ display: 'flex', gap: 40, marginTop: 52, flexWrap: 'wrap' }}>
            {stats.map((stat, i) => (
              <div key={stat.label} style={{ display: 'flex', gap: 24, alignItems: 'stretch' }}>
                {i > 0 && <div style={{ width: 1, background: 'var(--border)' }} />}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontFamily: 'var(--font-serif)', fontWeight: 700,
                    fontSize: stat.number.length > 3 ? 30 : 36,
                    color: stat.color, lineHeight: 1,
                  }}>{stat.number}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 2 }}>{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 280 }}>
          <AnimatedCodeWindow />
        </div>
      </div>
    </section>
  );
}
