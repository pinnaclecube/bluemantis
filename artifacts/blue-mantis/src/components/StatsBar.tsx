import { useScrollReveal } from '../hooks/useScrollReveal';

const stats = [
  { number: 'Half', color: 'var(--accent-blue)', label: 'of every developer week goes to non-coding work', sub: 'Context switching, ticket admin, PR overhead.' },
  { number: '6', color: 'var(--accent-teal)', label: 'tools touched before a single line is committed', sub: 'None of these tools talk to each other.' },
  { number: 'Days', color: 'var(--accent-amber)', label: 'of delivery time lost to handoffs each sprint', sub: 'Not from complexity — from admin friction alone.' },
];

export default function StatsBar() {
  const header = useScrollReveal();
  const statsReveal = useScrollReveal(150);

  return (
    <section className="lp-section" style={{ paddingTop: 'clamp(48px, 6vw, 72px)', paddingBottom: 'clamp(48px, 6vw, 72px)' }}>
      <div className="lp-container">
        <div ref={header.ref as any} style={{ textAlign: 'center', ...header.style }}>
          <p className="lp-eyebrow lp-center">The problem</p>
          <h2 className="lp-h2 lp-narrow" style={{ fontSize: 'clamp(26px, 3.6vw, 40px)' }}>
            Your developers aren&rsquo;t slow.<br />Your tools are <span className="lp-grad">disconnected</span>.
          </h2>
        </div>

        <div ref={statsReveal.ref as any} className="lp-glass" style={{
          marginTop: 48, padding: 4, borderRadius: 20,
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          ...statsReveal.style,
        }}>
          {stats.map((stat, i) => (
            <div key={stat.number} style={{
              padding: 'clamp(24px, 3vw, 36px)', textAlign: 'center',
              borderLeft: i > 0 ? '1px solid var(--lp-glass-border)' : 'none',
            }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 'clamp(44px, 6vw, 64px)', color: stat.color, lineHeight: 1, letterSpacing: '-0.03em' }}>{stat.number}</span>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)', maxWidth: 230, margin: '14px auto 0', lineHeight: 1.45 }}>{stat.label}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(17px, 2.2vw, 22px)', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 44, maxWidth: 640, marginInline: 'auto' }}>
          Nobody has closed the loop between the task and the commit. Until now.
        </p>
      </div>
    </section>
  );
}
