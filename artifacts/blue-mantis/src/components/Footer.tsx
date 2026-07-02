const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      alt="Blue Mantis logo"
      style={{ height: 40, width: 'auto' }}
    />
    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>
      Blue Mantis
    </span>
  </div>
);

const cols = [
  {
    title: 'Product',
    links: ['How it works', 'Integrations', 'Security'],
    hrefs: ['#how-it-works', '#integrations', '/security'],
  },
  {
    title: 'Pricing',
    links: ['Free tier', 'Growth', 'Enterprise', 'Talk to sales'],
    hrefs: ['#pricing', '#pricing', '#pricing', 'mailto:sales@getbluemantis.com'],
  },
  {
    title: 'Company',
    links: ['Security', 'Contact'],
    hrefs: ['/security', 'mailto:sales@getbluemantis.com'],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: '#050D14', borderTop: '1px solid var(--border)', padding: '64px 24px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 80, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 280, flexShrink: 0 }}>
            <Logo />
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.6 }}>
              The AI platform that turns a backlog task into committed, reviewed code — automatically.
            </p>
            <a href="mailto:sales@getbluemantis.com" style={{ display: 'block', marginTop: 20, fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--accent-blue)', textDecoration: 'none' }}>
              sales@getbluemantis.com
            </a>
          </div>

          {cols.map(col => (
            <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.06em', marginBottom: 4 }}>
                {col.title}
              </span>
              {col.links.map((link, i) => (
                <a key={link} href={col.hrefs[i]} style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '40px 0 24px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)' }}>
            © 2026 Blue Mantis. All rights reserved.
          </span>
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
