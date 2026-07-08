'use client';

import { useEffect, useRef, type ReactNode, type ElementType } from 'react';

/**
 * Scroll reveal — enhancement only (spec §8). Content is visible by default;
 * the `.js` class (added by the layout inline script) is what hides it before
 * reveal, so it never disappears when JS is off. Reveals once, then unobserves.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}
