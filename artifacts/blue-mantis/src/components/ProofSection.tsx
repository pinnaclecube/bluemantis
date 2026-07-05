import { useScrollReveal } from '../hooks/useScrollReveal';

const cards = [
  { number: '4', color: 'var(--accent-blue)', label: 'agents on every task', context: 'Claude · GPT-4o · Copilot · AntiGravity', subtext: 'Four independent attempts at every change — not one autocomplete guess.', span: 1 },
  { number: '1 click', color: 'var(--accent-teal)', label: 'task → PR → closed', context: 'Branch, commit, PR and ticket close', subtext: 'The busywork between a ticket and a commit, fully automated.', span: 1 },
  { number: '3', color: 'var(--accent-green)', label: 'systems, one loop', context: 'Jira · Azure DevOps · GitHub', subtext: 'Your backlog and your repository, finally connected.', span: 1 },
  { number: 'Ranked', color: 'var(--accent-amber)', label: 'every suggestion scored', context: 'Correctness · readability · minimal diff · convention', subtext: 'A synthesis pass ranks all four and explains why the top one won.', span: 3 },
];

function MetricCard({ card }: { card: typeof cards[0] }) {
  return (
    <div className="lp-glass lp-hoverable" style={{ padding: 28, position: 'relative', overflow: 'hidden', gridColumn: card.span === 3 ? 'span 1' : 'auto' }}>
      <div style={{ position: 'absolute', left: 0, top: 20, bottom: 20, width: 3, borderRadius: 3, background: card.color }} />
      <div style={{ paddingLeft: 14 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: card.number.length > 3 ? 36 : 48, color: card.color, lineHeight: 1, letterSpacing: '-0.03em' }}>{card.number}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 8 }}>{card.label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{card.context}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)', marginTop: 10, lineHeight: 1.5 }}>{card.subtext}</div>
      </div>
    </div>
  );
}

export default function ProofSection() {
  const header = useScrollReveal();
  const grid = useScrollReveal(120);
  const insight = useScrollReveal(240);

  return (
    <section id="proof" className="lp-section">
      <div className="lp-container">
        <div ref={header.ref as any} style={header.style}>
          <p className="lp-eyebrow">Why it&rsquo;s different</p>
          <h2 className="lp-h2">Not another <span className="lp-grad">autocomplete</span>.</h2>
          <p className="lp-lead" style={{ maxWidth: 620 }}>A structured, multi-agent review loop — connected to the task and the repo, with you in control.</p>
        </div>

        <div ref={grid.ref as any} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginTop: 44, ...grid.style }}>
          {cards.map(c => <MetricCard key={c.label} card={c} />)}
          {/* Privacy card, spans wider on large screens */}
          <div className="lp-glass lp-hoverable" style={{ padding: 28, position: 'relative', overflow: 'hidden', gridColumn: '1 / -1' }}>
            <div style={{ position: 'absolute', left: 0, top: 20, bottom: 20, width: 3, borderRadius: 3, background: 'var(--accent-purple)' }} />
            <div style={{ paddingLeft: 14, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 40, color: 'var(--accent-purple)', lineHeight: 1, letterSpacing: '-0.03em' }}>Yours</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 8 }}>your code stays yours</div>
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)', margin: 0, maxWidth: 560, lineHeight: 1.6 }}>
                Only the active task&rsquo;s file context is sent — never your whole codebase. Credentials stay in your
                own environment, and we never store your code.
              </p>
            </div>
          </div>
        </div>

        <div ref={insight.ref as any} className="lp-glass" style={{
          padding: 'clamp(28px, 4vw, 40px)', marginTop: 20,
          background: 'linear-gradient(158deg, rgba(77,148,216,0.18), rgba(12,30,46,0.34))',
          borderColor: 'rgba(77,148,216,0.3)', ...insight.style,
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>The core idea</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'clamp(20px, 2.6vw, 26px)', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginTop: 10 }}>
            Why four opinions beat one.
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-secondary)', marginTop: 12, maxWidth: 760, lineHeight: 1.75 }}>
            A single AI suggestion is a guess you have to trust. Blue Mantis runs four agents in parallel, has them
            critique and score each other, and shows you all four side by side with the strongest ranked first — and a
            plain-English reason it won. You review real alternatives, then you decide. That review loop is the product.
          </p>
        </div>
      </div>
    </section>
  );
}
