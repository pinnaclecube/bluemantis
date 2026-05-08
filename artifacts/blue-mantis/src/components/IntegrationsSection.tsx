import { useScrollReveal } from '../hooks/useScrollReveal';

function Tile({ initials, bg, name, dot }: { initials: string; bg: string; name: string; dot?: string }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        transition: 'all 200ms ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
    >
      {dot ? (
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      ) : (
        <div style={{
          width: 28, height: 28, borderRadius: '50%', background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, color: '#0C1E2E' }}>{initials}</span>
        </div>
      )}
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-primary)' }}>{name}</span>
    </div>
  );
}

export default function IntegrationsSection() {
  const header = useScrollReveal();
  const grid = useScrollReveal(200);

  return (
    <section id="integrations" style={{ background: 'var(--bg-app)', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={header.ref as any} style={{ textAlign: 'center', ...header.style }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent-teal)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>Integrations</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--text-primary)', margin: 0 }}>No rip and replace.</h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--text-secondary)', marginTop: 16 }}>Blue Mantis sits on top of what your team already uses.</p>
        </div>

        <div ref={grid.ref as any} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, marginTop: 64, ...grid.style }}>
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>Project Management</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Tile initials="JC" bg="var(--accent-blue)" name="JIRA Cloud" />
              <Tile initials="JS" bg="rgba(77,148,216,0.7)" name="JIRA Server" />
              <Tile initials="ADO" bg="var(--accent-teal)" name="Azure DevOps Boards" />
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>Version Control</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Tile initials="GH" bg="#333" name="GitHub" />
              <Tile initials="AR" bg="var(--accent-blue)" name="Azure Repos" />
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>AI Agents Inside</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Tile initials="CL" bg="#8B7CF8" name="Claude (Anthropic)" />
              <Tile initials="GP" bg="#A2F0C5" name="GPT-4o (OpenAI)" />
              <Tile initials="AG" bg="#F2F995" name="Anti Gravity AI" />
              <Tile initials="MC" bg="var(--accent-blue)" name="Microsoft Copilot" />
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 12 }}>
              "All four debate and rank every suggestion before you see results."
            </p>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16 }}>Stack Support</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent-green)', marginBottom: 8 }}>Live today</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {['React + Vite', 'Node.js / Express', 'PostgreSQL'].map(name => (
                <Tile key={name} initials="" bg="" name={name} dot="var(--accent-green)" />
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent-amber)', marginBottom: 8, marginTop: 16 }}>Roadmap 2026</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Angular · Vue 3', '.NET 8 · Java Spring', 'Python / FastAPI', 'SQL Server', 'Oracle · MySQL'].map(name => (
                <Tile key={name} initials="" bg="" name={name} dot="var(--accent-amber)" />
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontStyle: 'italic', color: 'var(--text-muted)', textAlign: 'center', marginTop: 48 }}>
          Live means available today. Roadmap means shipping in 2026.<br />Your stack is either supported or on the list.
        </p>
      </div>
    </section>
  );
}
