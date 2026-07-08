'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const KEY = 'bm-announce-dismissed';

export default function AnnouncementBar() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(sessionStorage.getItem(KEY) !== '1');
  }, []);

  // Home only (spec §5).
  if (pathname !== '/') return null;
  if (!show) return null;

  return (
    <div className="announce announce-wrap" role="region" aria-label="Announcement">
      <div className="container announce-inner">
        <span className="mono">Private beta is open. Limited engineering teams onboarded per month.</span>
        <Link href="/contact">Request access</Link>
      </div>
      <button
        className="announce-dismiss"
        aria-label="Dismiss announcement"
        onClick={() => {
          sessionStorage.setItem(KEY, '1');
          setShow(false);
        }}
      >
        ✕
      </button>
    </div>
  );
}
