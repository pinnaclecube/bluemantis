import Link from 'next/link';
import { SITE } from '@/lib/site';

const links = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Security', href: '/security' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export default function Footer() {
  const year = 2026;
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-left footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="footer-logo" />
          <span>Blue Mantis · A Venakan Info Solutions product</span>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <a href="/app/sign-in">Sign in</a>
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </nav>
        <div className="footer-copy">© {year} Venakan Info Solutions. All rights reserved.</div>
      </div>
    </footer>
  );
}
