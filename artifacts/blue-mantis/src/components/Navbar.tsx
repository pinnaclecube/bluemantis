import { useState, useEffect } from 'react';

const Logo = ({ size = 32 }: { size?: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      alt="Blue Mantis logo"
      style={{ height: size, width: 'auto' }}
    />
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
      Blue Mantis
    </span>
  </div>
);

const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Pricing', href: '#pricing' },
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

  const handleStart = () => { window.location.href = '/app/sign-up'; };

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'center',
        padding: scrolled ? '12px 16px' : '20px 16px',
        transition: 'padding 240ms cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: 'none',
      }}>
        <nav style={{
          pointerEvents: 'auto',
          width: '100%', maxWidth: 1120,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 58, padding: '0 12px 0 20px',
          borderRadius: 100,
          background: scrolled ? 'rgba(12, 30, 46, 0.72)' : 'rgba(12, 30, 46, 0.32)',
          border: `1px solid ${scrolled ? 'rgba(120,170,210,0.18)' : 'rgba(120,170,210,0.10)'}`,
          backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
          boxShadow: scrolled ? '0 16px 44px -20px rgba(0,0,0,0.7)' : 'none',
          transition: 'all 240ms cubic-bezier(0.16,1,0.3,1)',
        }}>
          <a href="#" style={{ textDecoration: 'none' }}><Logo /></a>

          <div className="hidden md:flex" style={{ gap: 6 }}>
            {navLinks.map(link => (
              <a key={link.label} href={link.href} style={{
                fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)',
                textDecoration: 'none', padding: '8px 14px', borderRadius: 100, transition: 'all 150ms ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(120,170,210,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="hidden md:block" onClick={() => { window.location.href = '/app/sign-in'; }} style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              padding: '8px 12px', borderRadius: 100, cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 14,
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              Sign in
            </button>
            <button onClick={handleStart} className="lp-btn lp-btn-primary" style={{ padding: '9px 18px', fontSize: 14 }}>
              Start free
            </button>

            <button className="md:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 8,
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 18, height: 2, background: 'var(--text-primary)', borderRadius: 1 }} />)}
            </button>
          </div>
        </nav>
      </div>

      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(8, 20, 32, 0.86)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
        }}>
          <button aria-label="Close menu" onClick={() => setMenuOpen(false)} style={{
            position: 'absolute', top: 22, right: 24, background: 'none', border: 'none',
            color: 'var(--text-primary)', fontSize: 30, cursor: 'pointer', lineHeight: 1,
          }}>×</button>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} style={{
              fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none',
            }}>
              {link.label}
            </a>
          ))}
          <button onClick={() => { setMenuOpen(false); handleStart(); }} className="lp-btn lp-btn-primary" style={{ marginTop: 8 }}>
            Start free
          </button>
        </div>
      )}
    </>
  );
}
