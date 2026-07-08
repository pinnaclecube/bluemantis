import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { JsonLd, breadcrumbLd } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Request early access',
  description:
    'Tell us about your stack and your backlog. Blue Mantis onboards a limited number of engineering teams each month. Email the team or book a walkthrough.',
  alternates: { canonical: '/contact' },
};

export default function Contact() {
  return (
    <>
      <JsonLd data={breadcrumbLd({ name: 'Contact', path: '/contact' })} />

      <section className="hero">
        <div className="container">
          <h1>Request early access.</h1>
          <p className="lead">
            Tell us about your stack and your backlog. We onboard a limited number of engineering
            teams each month.
          </p>
          <div className="btn-row contact-actions">
            <a className="btn btn-primary" href={`mailto:${SITE.email}?subject=Blue%20Mantis%20early%20access`}>
              Email the team
            </a>
            {/* TODO: replace href with a real scheduling URL (Cal.com) when provided. */}
            <a className="btn btn-outline" href={SITE.bookingUrl}>
              Book a walkthrough
            </a>
          </div>
          <p className="mono contact-reply">Typical reply within one business day.</p>
        </div>
      </section>
    </>
  );
}
