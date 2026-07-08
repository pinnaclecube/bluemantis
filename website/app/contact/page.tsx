import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { WalkthroughButton } from '@/components/AccessButtons';
import { JsonLd, breadcrumbLd } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Request early access',
  description:
    'Tell us about your stack and your backlog. Blue Mantis onboards a limited number of engineering teams each month. Request access or book a walkthrough.',
  alternates: { canonical: '/contact' },
};

export default function Contact() {
  return (
    <>
      <JsonLd data={breadcrumbLd({ name: 'Contact', path: '/contact' })} />

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>Request early access.</h1>
            <p className="lead">
              Tell us about your stack and your backlog. We onboard a limited number of engineering
              teams each month.
            </p>
            <p className="dim" style={{ marginTop: 22 }}>Prefer a live demo first?</p>
            <div className="btn-row" style={{ marginTop: 12 }}>
              <WalkthroughButton className="btn btn-outline">Book a walkthrough</WalkthroughButton>
            </div>
            <p className="mono contact-reply">Typical reply within one business day.</p>
          </div>
          <div className="hero-form">
            <ContactForm variant="request-access" heading="Request access" />
          </div>
        </div>
      </section>
    </>
  );
}
