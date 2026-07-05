import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

function FeatureItem({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
        <path d="M2.5 7L5.5 10L11.5 4" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.45 }}>{text}</span>
    </div>
  );
}

const faqItems = [
  { q: 'Is the free tier actually free, or is it a 14-day trial?', a: 'Actually free. No time limit, no credit card. Up to 5 developers can use Blue Mantis indefinitely on the free tier.' },
  { q: 'What does "unlimited AI suggestions" mean?', a: 'Every task generates four code suggestions — one from each AI agent. There is no cap on how many tasks you can run through Blue Mantis.' },
  { q: 'Is my code sent to third-party AI providers?', a: 'Only the specific file context for the active task is sent — not your whole codebase. Credentials are stored in your own environment, never on our servers. We never store your code.' },
  { q: 'Does Blue Mantis replace our IDE or Git workflow?', a: 'No. Blue Mantis generates and commits code, but you can always pull the branch and edit in your IDE. It is additive, not replacing.' },
  { q: 'What if our stack isn\'t supported yet?', a: 'React + Node.js + PostgreSQL is live today. Angular, .NET, Java, and Oracle are on the roadmap for 2026. Email us at sales@getbluemantis.com to get early access for your stack.' },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ maxWidth: 800, margin: '80px auto 0' }}>
      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'clamp(24px, 3vw, 30px)', letterSpacing: '-0.02em', color: 'var(--text-primary)', textAlign: 'center', marginBottom: 28 }}>
        Frequently asked questions
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {faqItems.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="lp-glass" style={{ borderRadius: 14, overflow: 'hidden', borderColor: isOpen ? 'rgba(77,148,216,0.3)' : undefined }}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}
              >
                <span>{item.q}</span>
                <span style={{ transition: 'transform 220ms cubic-bezier(0.16,1,0.3,1)', transform: isOpen ? 'rotate(180deg)' : 'none', color: isOpen ? 'var(--accent-blue)' : 'var(--text-muted)', fontSize: 16, flexShrink: 0 }}>▾</span>
              </button>
              <div style={{ maxHeight: isOpen ? 200 : 0, overflow: 'hidden', transition: 'max-height 260ms ease' }}>
                <div style={{ padding: '0 22px 18px', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.a}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const plans = [
  {
    name: 'Free', price: '$0', unit: '/ forever', sub: 'For individuals and small teams', color: 'var(--text-secondary)', featured: false,
    features: ['Up to 5 developers', '1 PLM integration (Jira or Azure DevOps)', '1 Git repository', 'Unlimited AI suggestions', 'Community support'],
    cta: 'Start free — no card needed', mailto: 'mailto:sales@getbluemantis.com?subject=Free tier signup', foot: 'No time limit. Use it as long as you need.',
  },
  {
    name: 'Growth', price: '$99', unit: '/ seat / month', sub: 'For teams of 20–100 developers', color: 'var(--accent-blue)', featured: true,
    features: ['Unlimited PLM integrations', 'Unlimited repositories', 'Team analytics dashboard', 'Stack auto-detection', 'Email support + SLA'],
    cta: 'Start Growth trial', mailto: 'mailto:sales@getbluemantis.com?subject=Growth trial', foot: 'Most teams upgrade after their first sprint.',
  },
  {
    name: 'Enterprise', price: 'Custom', unit: '', sub: 'For 100+ developer organisations', color: 'var(--accent-teal)', featured: false,
    features: ['Everything in Growth', 'SSO and audit logging', 'Private cloud deployment', 'Custom AI model weighting', 'Dedicated customer success manager'],
    cta: 'Talk to us', mailto: 'mailto:sales@getbluemantis.com?subject=Enterprise enquiry', foot: "We'll scope a trial for your security requirements.",
  },
];

export default function PricingSection() {
  const header = useScrollReveal();
  const cards = useScrollReveal(150);

  return (
    <section id="pricing" className="lp-section">
      <div className="lp-container">
        <div ref={header.ref as any} style={{ textAlign: 'center', ...header.style }}>
          <p className="lp-eyebrow lp-center">Pricing</p>
          <h2 className="lp-h2">Start free. <span className="lp-grad">Upgrade when it works.</span></h2>
          <p className="lp-lead">Most teams upgrade after their first sprint. No pressure.</p>
        </div>

        <div ref={cards.ref as any} style={{ margin: '52px auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22, alignItems: 'stretch', ...cards.style }}>
          {plans.map(plan => (
            <div key={plan.name} className={`lp-glass ${plan.featured ? '' : 'lp-hoverable'}`} style={{
              padding: 'clamp(28px, 3vw, 36px)', display: 'flex', flexDirection: 'column', position: 'relative',
              background: plan.featured ? 'linear-gradient(168deg, rgba(77,148,216,0.2), rgba(12,30,46,0.4))' : undefined,
              borderColor: plan.featured ? 'rgba(77,148,216,0.4)' : undefined,
              boxShadow: plan.featured ? '0 30px 70px -30px rgba(77,148,216,0.5)' : undefined,
              transform: plan.featured ? 'translateY(-8px)' : undefined,
            }}>
              {plan.featured && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'var(--lp-grad-cta)', color: '#06121C', fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '5px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>RECOMMENDED</div>
              )}
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: plan.color }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: plan.price === 'Custom' ? 38 : 50, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>{plan.price}</span>
                {plan.unit && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)' }}>{plan.unit}</span>}
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{plan.sub}</div>
              <div className="lp-divider" style={{ margin: '20px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {plan.features.map(f => <FeatureItem key={f} text={f} />)}
              </div>
              <button
                onClick={() => { window.location.href = plan.mailto; }}
                className={plan.featured ? 'lp-btn lp-btn-primary' : 'lp-btn lp-btn-ghost'}
                style={{ width: '100%', justifyContent: 'center', marginTop: 26 }}
              >
                {plan.cta}
              </button>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>{plan.foot}</p>
            </div>
          ))}
        </div>

        <FAQ />
      </div>
    </section>
  );
}
