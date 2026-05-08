import { useScrollReveal } from '../hooks/useScrollReveal';

const steps = [
  { day: 'Day 1', color: 'var(--accent-blue)', title: 'Sign up in 10 minutes', body: 'GitHub OAuth. Connect JIRA or Azure DevOps. Start generating immediately. No card. No call.' },
  { day: 'Sprint 1', color: 'var(--accent-teal)', title: 'Run one sprint with Blue Mantis', body: 'Assign two or three tasks. Watch the team review four AI suggestions. See time savings in the dashboard.' },
  { day: 'Sprint 2', color: 'var(--accent-green)', title: 'Share the data with your manager', body: 'Every closed task shows time-to-PR and which agent won. ROI summary generated automatically.' },
  { day: 'Month 2', color: 'var(--accent-amber)', title: 'Upgrade — or don\'t', body: 'Teams upgrade when 3+ developers want the full analytics dashboard. The data makes the case itself.' },
];

export default function CTASection() {
  const header = useScrollReveal();
  const timeline = useScrollReveal(200);
  const cta = useScrollReveal(300);

  return (
    <section id="start" style={{ background: 'var(--bg-app)', padding: '112px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={header.ref as any} style={{ textAlign: 'center', ...header.style }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontWeight: 900,
            fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.1,
            color: 'var(--text-primary)', margin: '0 auto', maxWidth: 700,
          }}>
            The ask is not a contract.<br />The ask is one sprint.
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, margin: '20px auto 0', lineHeight: 1.6 }}>
            Run your next sprint with Blue Mantis — free, no commitment. If your team closes tasks faster, you'll know within two weeks.
          </p>
        </div>

        <div ref={timeline.ref as any} style={{ maxWidth: 1000, margin: '72px auto 0', ...timeline.style }}>
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', justifyContent: 'center', position: 'relative' }}>
            {steps.map((step, i) => (
              <div key={step.day} style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 12px', position: 'relative' }}>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', top: 22, left: '50%', right: '-50%', height: 2, background: 'var(--border)', zIndex: 0 }} />
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: '#0C1E2E',
                  position: 'relative', zIndex: 1,
                  animationDelay: `${i * 80}ms`,
                }}>
                  {i + 1}
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>{step.day}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4, maxWidth: 200 }}>{step.title}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 4, maxWidth: 200 }}>{step.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div ref={cta.ref as any} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 72, ...cta.style }}>
          <button
            onClick={() => { window.location.href = 'mailto:sales@getbluemantis.com?subject=Start free'; }}
            style={{
              padding: '18px 48px', background: 'var(--accent-blue)', color: '#0C1E2E',
              border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#5BA8E8')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent-blue)')}
          >
            Start free — no card needed
          </button>

          <a href="mailto:sales@getbluemantis.com" style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', marginTop: 12, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            Talk to sales → sales@getbluemantis.com
          </a>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['No credit card needed', 'Human approval on every commit', 'No code stored on our servers'].map(pill => (
              <div key={pill} style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 20, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-green)' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)' }}>{pill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
