import { useScrollReveal } from '../hooks/useScrollReveal';

const cards = [
  { number: '4', color: 'var(--accent-blue)', accentBar: 'var(--accent-blue)', label: 'agents on every task', context: 'Claude · GPT-4o · Copilot · AntiGravity', subtext: 'Four independent attempts at every change — not one autocomplete guess.' },
  { number: '1 click', color: 'var(--accent-teal)', accentBar: 'var(--accent-teal)', label: 'task → PR → closed', context: 'Branch, commit, PR and ticket close', subtext: 'The busywork between a ticket and a commit, fully automated.' },
  { number: '3', color: 'var(--accent-green)', accentBar: 'var(--accent-green)', label: 'systems, one loop', context: 'JIRA · Azure DevOps · GitHub', subtext: 'Your backlog and your repository, finally connected.' },
  { number: 'Ranked', color: 'var(--accent-amber)', accentBar: 'var(--accent-amber)', label: 'every suggestion scored', context: 'Correctness · readability · minimal diff · convention', subtext: 'A synthesis pass ranks all four and explains why the top one won.' },
  { number: 'Yours', color: 'var(--accent-blue)', accentBar: 'var(--accent-blue)', label: 'your code stays yours', context: 'Only the active task’s file context is sent', subtext: 'Credentials stay in your environment. We never store your code.' },
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
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent-teal)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>Why it's different</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--text-primary)', margin: 0 }}>Not another autocomplete.</h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-muted)', marginTop: 12 }}>A structured, multi-agent review loop — connected to the task and the repo, with you in control.</p>
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
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--accent-blue)' }}>THE CORE IDEA</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', marginTop: 8 }}>
            Why four opinions beat one.
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-secondary)', marginTop: 12, maxWidth: 700, lineHeight: 1.7 }}>
            A single AI suggestion is a guess you have to trust. Blue Mantis runs four agents in parallel, has them critique and score each other, and shows you all four side by side with the strongest ranked first — and a plain-English reason it won. You review real alternatives, then you decide. That review loop is the product.
          </p>
        </div>
      </div>
    </section>
  );
}
