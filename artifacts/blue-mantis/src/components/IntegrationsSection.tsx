import { useScrollReveal } from '../hooks/useScrollReveal';
import { BrandLogo } from './BrandLogos';

type Item = { name: string; logo?: 'github' | 'jira' | 'azure' | 'openai' | 'claude'; initials?: string; bg?: string; dot?: string };

function Tile({ item }: { item: Item }) {
  return (
    <div className="lp-glass lp-hoverable" style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12 }}>
      {item.logo ? (
        <div style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BrandLogo name={item.logo} size={22} />
        </div>
      ) : item.dot ? (
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.dot, flexShrink: 0, boxShadow: `0 0 8px ${item.dot}` }} />
      ) : (
        <div style={{ width: 30, height: 30, borderRadius: 8, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, color: '#06121C' }}>{item.initials}</span>
        </div>
      )}
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-primary)' }}>{item.name}</span>
    </div>
  );
}

function Group({ title, meta, metaColor, items, note }: { title: string; meta?: string; metaColor?: string; items: Item[]; note?: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>{title}</div>
      {meta && <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, color: metaColor, marginBottom: 10 }}>{meta}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => <Tile key={it.name} item={it} />)}
      </div>
      {note && <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.5 }}>{note}</p>}
    </div>
  );
}

export default function IntegrationsSection() {
  const header = useScrollReveal();
  const grid = useScrollReveal(150);

  return (
    <section id="integrations" className="lp-section">
      <div className="lp-container">
        <div ref={header.ref as any} style={{ textAlign: 'center', ...header.style }}>
          <p className="lp-eyebrow lp-center">Integrations</p>
          <h2 className="lp-h2">No rip and replace.</h2>
          <p className="lp-lead">Blue Mantis sits on top of what your team already uses.</p>
        </div>

        <div ref={grid.ref as any} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, marginTop: 56, ...grid.style }}>
          <Group title="Project management" items={[
            { name: 'Jira Cloud', logo: 'jira' },
            { name: 'Jira Server', logo: 'jira' },
            { name: 'Azure DevOps Boards', logo: 'azure' },
          ]} />

          <Group title="Version control" items={[
            { name: 'GitHub', logo: 'github' },
            { name: 'Azure Repos', logo: 'azure' },
          ]} />

          <Group title="AI agents inside" note="All four debate and rank every suggestion before you see results." items={[
            { name: 'Claude (Anthropic)', logo: 'claude' },
            { name: 'GPT-4o (OpenAI)', logo: 'openai' },
            { name: 'Anti Gravity AI', initials: 'AG', bg: 'var(--accent-amber)' },
            { name: 'Microsoft Copilot', initials: 'MC', bg: 'var(--accent-blue)' },
          ]} />

          <Group title="Stack support" meta="Live today" metaColor="var(--accent-green)" items={[
            { name: 'React + Vite', dot: 'var(--accent-green)' },
            { name: 'Node.js / Express', dot: 'var(--accent-green)' },
            { name: 'PostgreSQL', dot: 'var(--accent-green)' },
          ]} note="" />
        </div>

        {/* Roadmap row */}
        <div style={{ marginTop: 40 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, color: 'var(--accent-amber)', marginBottom: 12 }}>Roadmap 2026</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['Angular · Vue 3', '.NET 8 · Java Spring', 'Python / FastAPI', 'SQL Server', 'Oracle · MySQL'].map(name => (
              <div key={name} className="lp-glass" style={{ padding: '9px 16px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-amber)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', marginTop: 44, lineHeight: 1.6 }}>
          Live means available today. Roadmap means shipping in 2026.<br />Your stack is either supported or on the list.
        </p>
      </div>
    </section>
  );
}
