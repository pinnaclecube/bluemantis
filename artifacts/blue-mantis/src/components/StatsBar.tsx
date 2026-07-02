import { useScrollReveal } from '../hooks/useScrollReveal';

const stats = [
  {
    number: 'Half', color: 'var(--accent-blue)',
    label: 'of every developer week goes to non-coding work',
    sub: 'Context switching, ticket admin, PR overhead.',
  },
  {
    number: '6', color: 'var(--accent-teal)',
    label: 'tools touched before a single line of code is committed',
    sub: 'None of these tools talk to each other.',
  },
  {
    number: 'Days', color: 'var(--accent-amber)',
    label: 'of delivery time lost to handoffs each sprint',
    sub: 'Not from complexity. From administrative friction alone.',
  },
];

export default function StatsBar() {
  const header = useScrollReveal();
  const statsReveal = useScrollReveal(200);

  return (
    <section style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      padding: '64px 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 ref={header.ref as any} style={{
          fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 26,
          color: 'var(--text-primary)', textAlign: 'center',
          maxWidth: 700, margin: '0 auto 48px', ...header.style,
        }}>
          "Your developers are not slow. Your tools are disconnected."
        </h2>

        <div ref={statsReveal.ref as any} style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          ...statsReveal.style,
        }}>
          {stats.map((stat, i) => (
            <div key={stat.number} style={{ display: 'flex', flex: '1 1 200px' }}>
              {i > 0 && <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />}
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '0 48px', textAlign: 'center',
              }}>
                <span style={{
                  fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 72,
                  color: stat.color, lineHeight: 1,
                }}>{stat.number}</span>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)',
                  textAlign: 'center', maxWidth: 200, marginTop: 12,
                }}>{stat.label}</span>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)',
                  textAlign: 'center', marginTop: 6,
                }}>{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 16, fontStyle: 'italic',
          color: 'var(--text-muted)', textAlign: 'center', marginTop: 48,
        }}>
          "Nobody has closed the loop between the task and the commit. Until now."
        </p>
      </div>
    </section>
  );
}
