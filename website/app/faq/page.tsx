import type { Metadata } from 'next';
import { FAQ_GROUPS } from '@/lib/site';
import { JsonLd, faqPageLd, breadcrumbLd } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Questions engineering leaders ask about Blue Mantis: what it does, how onboarding works, and how code ownership, security, and audit trails are handled.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqPageLd} />
      <JsonLd data={breadcrumbLd({ name: 'FAQ', path: '/faq' })} />

      <section className="hero">
        <div className="container">
          <h1>Questions engineering leaders ask.</h1>
        </div>
      </section>

      <section className="tight">
        <div className="container">
          {FAQ_GROUPS.map((group) => (
            <div key={group.group}>
              <h2 className="faq-group-title">{group.group}</h2>
              <div className="faq">
                {group.items.map((item) => (
                  <details key={item.q}>
                    <summary>{item.q}</summary>
                    <div className="faq-answer">{item.a}</div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
