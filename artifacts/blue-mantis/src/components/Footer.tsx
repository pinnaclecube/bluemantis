const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Blue Mantis logo" style={{ height: 36, width: 'auto' }} />
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>Blue Mantis</span>
  </div>
);

const cols = [
  { title: 'Product', links: ['How it works', 'Integrations', 'Security'], hrefs: ['#how-it-works', '#integrations', '/security'] },
  { title: 'Pricing', links: ['Free tier', 'Growth', 'Enterprise', 'Talk to sales'], hrefs: ['#pricing', '#pricing', '#pricing', 'mailto:sales@getbluemantis.com'] },
  { title: 'Company', links: ['Security', 'Contact'], hrefs: ['/security', 'mailto:sales@getbluemantis.com'] },
];

export default function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)', padding: '0 24px 40px' }}>
      <div className="lp-container">
        {/* Closing CTA band */}
        <div className="lp-glass" style={{
          margin: '0 auto', transform: 'translateY(-56px)',
          padding: 'clamp(36px, 5vw, 56px)', textAlign: 'center',
          background: 'linear-gradient(158deg, rgba(77,148,216,0.2), rgba(139,124,248,0.12))',
          borderColor: 'rgba(120,170,210,0.28)',
        }}>
          <h2 className="lp-h2" style={{ fontSize: 'clamp(26px, 3.6vw, 40px)' }}>
            Close the loop between the <span className="lp-grad">task and the commit</span>.
          </h2>
          <p className="lp-lead" style={{ maxWidth: 560, marginInline: 'auto' }}>
            Connect your backlog and your repo. Let four agents do the busywork. Ship in minutes.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
            <a href="/app/sign-up" className="lp-btn lp-btn-primary">Start free — no card needed</a>
            <a href="mailto:sales@getbluemantis.com" className="lp-btn lp-btn-ghost">Talk to sales</a>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'clamp(40px, 8vw, 80px)', flexWrap: 'wrap', marginTop: -24 }}>
          <div style={{ maxWidth: 300, flexShrink: 0 }}>
            <Logo />
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', marginTop: 14, lineHeight: 1.6 }}>
              The AI platform that turns a backlog task into committed, reviewed code — automatically.
            </p>
            <a href="mailto:sales@getbluemantis.com" style={{ display: 'inline-block', marginTop: 18, fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--accent-blue)', textDecoration: 'none' }}>
              sales@getbluemantis.com
            </a>
          </div>

          {cols.map(col => (
            <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>{col.title}</span>
              {col.links.map((link, i) => (
                <a key={link} href={col.hrefs[i]} style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <hr className="lp-divider" style={{ margin: '40px 0 24px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)' }}>© 2026 Blue Mantis. All rights reserved.</span>
          <a href="mailto:sales@getbluemantis.com" style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            sales@getbluemantis.com
          </a>
        </div>
      </div>
    </footer>
  );
}
