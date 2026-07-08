import type { Metadata } from 'next';
import Link from 'next/link';
import { SECURITY_ROWS } from '@/lib/site';
import { JsonLd, breadcrumbLd } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Security',
  description:
    'Autonomy is only useful if you can bound it. Blue Mantis is designed so you can say yes to speed without loosening a single control.',
  alternates: { canonical: '/security' },
};

export default function Security() {
  return (
    <>
      <JsonLd data={breadcrumbLd({ name: 'Security', path: '/security' })} />

      <section className="hero">
        <div className="container">
          <h1>Built for teams that answer to auditors.</h1>
          <p className="lead">
            Autonomy is only useful if you can bound it. Blue Mantis is designed so you can say yes to
            speed without loosening a single control.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="stages">
            {SECURITY_ROWS.map((r) => (
              <div className="stage" key={r.title}>
                <h2>{r.title}</h2>
                <p>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Next steps">
        <div className="container">
          <div className="btn-row">
            <Link href="/contact" className="btn btn-primary">Request early access</Link>
            <Link href="/faq" className="btn btn-outline">Questions? →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
