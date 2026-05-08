import { useScrollReveal } from '../hooks/useScrollReveal';

const cards = [
  { number: '73%', color: 'var(--accent-blue)', accentBar: 'var(--accent-blue)', label: 'task close rate', context: 'vs GitHub Copilot benchmark of 31%', subtext: 'More than twice the completion rate of the most-used AI tool.' },
  { number: '78%', color: 'var(--accent-teal)', accentBar: 'var(--accent-teal)', label: 'faster to first PR', context: '43 min avg, down from 3.2 hrs', subtext: 'Not incremental improvement. A different category of tool.' },
  { number: 'NPS 67', color: 'var(--accent-green)', accentBar: 'var(--accent-green)', label: 'developer satisfaction', context: 'Measured after the first sprint', subtext: '"I actually trust the recommendation badge."' },
  { number: '61%', color: 'var(--accent-amber)', accentBar: 'var(--accent-amber)', label: 'chose a different agent', context: 'Than the #1-ranked recommendation', subtext: 'This is the number that proves the multi-agent debate layer works.' },
  { number: '3 LOIs', color: 'var(--accent-blue)', accentBar: 'var(--accent-blue)', label: '$240K ARR pipeline', context: 'Converting to paid contracts on GA launch', subtext: 'Enterprise conversations in progress. Average potential ACV $380K.' },
];

function MetricCard({ card, wide = false }: { card: typeof cards[0]; wide?: boolean }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: 28, position: 'relative', overflow: 'hidden',
        transition: 'all 200ms ease', cursor: 'default', flex: wide ? '1 1 45%' : '1 1 30%',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: card.accentBar }} />
      <div style={{ paddingLeft: 12 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: card.number.length > 3 ? 40 : 52, color: card.color, lineHeight: 1 }}>{card.number}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{card.label}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{card.context}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 8 }}>{card.subtext}</div>
      </div>
    </div>
  );
}

export default function ProofSection() {
  const header = useScrollReveal();
  const row1 = useScrollReveal(100);
  const row2 = useScrollReveal(200);
  const insight = useScrollReveal(300);

  return (
    <section id="proof" style={{ background: 'var(--bg-app)', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={header.ref as any} style={header.style}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent-teal)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>Proof</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--text-primary)', margin: 0 }}>Real signal from real developers.</h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-muted)', marginTop: 12 }}>Pre-revenue. 120 developers across 14 teams. Beta validated.</p>
        </div>

        <div ref={row1.ref as any} style={{ display: 'flex', gap: 20, marginTop: 48, flexWrap: 'wrap', ...row1.style }}>
          {cards.slice(0, 3).map(c => <MetricCard key={c.label} card={c} />)}
        </div>
        <div ref={row2.ref as any} style={{ display: 'flex', gap: 20, marginTop: 20, flexWrap: 'wrap', ...row2.style }}>
          {cards.slice(3).map(c => <MetricCard key={c.label} card={c} wide />)}
        </div>

        <div ref={insight.ref as any} style={{
          background: 'var(--bg-raised)', border: '1px solid var(--accent-blue)',
          borderLeft: '4px solid var(--accent-blue)', borderRadius: 'var(--radius-md)',
          padding: '28px 32px', marginTop: 32, ...insight.style,
        }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--accent-blue)' }}>KEY FINDING</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', marginTop: 8 }}>
            Why 61% is the most important number on this page.
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-secondary)', marginTop: 12, maxWidth: 700, lineHeight: 1.7 }}>
            If developers always accepted the top-ranked suggestion, Blue Mantis would just be a Copilot wrapper with a nicer interface. The fact that 61% of the time they choose a different agent — after reviewing all four — proves that seeing multiple opinions changes the decision. That is the product working exactly as designed.
          </p>
        </div>
      </div>
    </section>
  );
}
