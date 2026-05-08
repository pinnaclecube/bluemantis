import { useState, useEffect } from 'react';

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      alt="Blue Mantis logo"
      style={{ height: 34, width: 'auto' }}
    />
    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>
      Blue Mantis
    </span>
  </div>
);

const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
  { label: 'Blog', href: '#blog' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleStart = () => {
    window.location.href = 'mailto:sales@getbluemantis.com?subject=Start free trial';
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64, zIndex: 100,
        background: scrolled ? 'var(--bg-surface)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 200ms ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="#" style={{ textDecoration: 'none' }}><Logo /></a>

          <div className="hidden md:flex" style={{ gap: 32 }}>
            {navLinks.map(link => (
              <a key={link.label} href={link.href} style={{
                fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)',
                textDecoration: 'none',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="hidden md:block" onClick={() => { window.location.href = '/app/sign-in'; }} style={{
              background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)',
              padding: '8px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 14,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              Sign in
            </button>
            <button onClick={handleStart} style={{
              background: 'var(--accent-blue)', color: '#0C1E2E', border: 'none',
              padding: '8px 20px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#5BA8E8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-blue)'; e.currentTarget.style.transform = 'none'; }}
            >
              Start free
            </button>

            <button className="md:hidden" onClick={() => setMenuOpen(true)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 18, height: 2, background: 'var(--text-primary)', borderRadius: 1 }} />)}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--bg-surface)', zIndex: 200,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
        }}>
          <button onClick={() => setMenuOpen(false)} style={{
            position: 'absolute', top: 20, right: 24, background: 'none', border: 'none',
            color: 'var(--text-primary)', fontSize: 28, cursor: 'pointer', lineHeight: 1,
          }}>×</button>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} style={{
              fontFamily: 'var(--font-sans)', fontSize: 20, color: 'var(--text-primary)', textDecoration: 'none',
            }}>
              {link.label}
            </a>
          ))}
          <button onClick={() => { setMenuOpen(false); handleStart(); }} style={{
            background: 'var(--accent-blue)', color: '#0C1E2E', border: 'none',
            padding: '12px 28px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, marginTop: 8,
          }}>
            Start free
          </button>
        </div>
      )}
    </>
  );
}
