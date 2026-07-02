import AnimatedCodeWindow from './AnimatedCodeWindow';

const stats = [
  { number: '4', color: 'var(--accent-blue)', label: 'AI agents per task', sub: 'Claude · GPT-4o · Copilot · AntiGravity' },
  { number: '1 click', color: 'var(--accent-teal)', label: 'Task → commit → PR', sub: 'Branch, PR and ticket close, automated' },
  { number: '3', color: 'var(--accent-green)', label: 'Systems, one workflow', sub: 'JIRA · Azure DevOps · GitHub' },
];

export default function HeroSection() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'var(--bg-app)',
      paddingTop: 80,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow — gives depth behind the headline */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '55%',
        height: '70%',
        background: 'radial-gradient(ellipse at top left, rgba(77,148,216,0.12) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '10%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(ellipse at bottom right, rgba(2,184,160,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '56px 24px',
        display: 'flex',
        gap: 64,
        flexWrap: 'wrap',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Left column */}
        <div style={{ flex: 1, maxWidth: 580, minWidth: 280 }}>

          {/* Eyebrow badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(2,184,160,0.12)',
            border: '1px solid rgba(2,184,160,0.35)',
            borderRadius: 100,
            padding: '5px 14px',
            marginBottom: 24,
          }}>
            <span style={{
              width: 6, height: 6,
              borderRadius: '50%',
              background: 'var(--accent-teal)',
              boxShadow: '0 0 6px var(--accent-teal)',
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'var(--accent-teal)',
              textTransform: 'uppercase',
            }}>
              Orchestrated AI Developer Co-Pilot
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 900,
            fontSize: 'clamp(42px, 5vw, 64px)',
            lineHeight: 1.08,
            color: 'var(--text-primary)',
            margin: 0,
            marginBottom: 24,
          }}>
            Stop losing{' '}
            <span style={{
              color: 'var(--accent-blue)',
              position: 'relative',
              display: 'inline-block',
            }}>
              half
            </span>
            <br />
            of every developer's week.
          </h1>

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 18,
            color: '#C8DDF0',
            maxWidth: 520,
            margin: 0,
            marginBottom: 40,
            lineHeight: 1.65,
          }}>
            Blue Mantis connects your JIRA or Azure DevOps tasks directly to your Git
            repository — with four AI agents writing, debating, and recommending the
            best code. One click commits, opens a PR, and closes the ticket.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="/app/sign-up"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                background: 'var(--accent-blue)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 0 24px rgba(77,148,216,0.35)',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#5BA8E8';
                e.currentTarget.style.boxShadow = '0 0 36px rgba(77,148,216,0.55)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--accent-blue)';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(77,148,216,0.35)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              Start free — no card needed
            </a>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'color 150ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              See how it works ↓
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 36, marginTop: 52, flexWrap: 'wrap' }}>
            {stats.map((stat, i) => (
              <div key={stat.label} style={{ display: 'flex', gap: 36, alignItems: 'stretch' }}>
                {i > 0 && (
                  <div style={{ width: 1, background: 'var(--border)' }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 700,
                    fontSize: stat.number.length > 3 ? 30 : 38,
                    color: stat.color,
                    lineHeight: 1,
                  }}>
                    {stat.number}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    marginTop: 5,
                    fontWeight: 500,
                  }}>
                    {stat.label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    fontStyle: 'italic',
                    marginTop: 2,
                  }}>
                    {stat.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — code window */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: 280,
        }}>
          <AnimatedCodeWindow />
        </div>
      </div>
    </section>
  );
}
