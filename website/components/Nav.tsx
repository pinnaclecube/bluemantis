'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NAV_LINKS } from '@/lib/site';
import { useModals } from './ModalProvider';

export default function Nav() {
  const { openRequestAccess } = useModals();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link href="/" className="wordmark" aria-label="Blue Mantis home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="wordmark-logo" />
          <span>Blue Mantis</span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav-cta">
          {/* Plain anchor: leaves the Next site and loads the authenticated app SPA. */}
          <a href="/app/sign-in" className="nav-signin nav-desktop">Sign in</a>
          <button type="button" className="btn btn-primary nav-desktop" onClick={openRequestAccess}>
            Request access
          </button>
          <button
            className="nav-toggle"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              {open ? (
                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="nav-mobile" aria-label="Primary mobile">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <a href="/app/sign-in" onClick={() => setOpen(false)}>Sign in</a>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setOpen(false);
              openRequestAccess();
            }}
          >
            Request access
          </button>
        </nav>
      )}
    </header>
  );
}
