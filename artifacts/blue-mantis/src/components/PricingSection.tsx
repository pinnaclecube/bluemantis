import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

function Check({ color }: { color: string }) {
  return (
    <div style={{ width: 16, height: 16, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: 10, color: '#050D14', fontWeight: 700 }}>✓</span>
    </div>
  );
}

function FeatureItem({ text, color }: { text: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Check color={color} />
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)' }}>{text}</span>
    </div>
  );
}

const faqItems = [
  { q: 'Is the free tier actually free, or is it a 14-day trial?', a: 'Actually free. No time limit, no credit card. Up to 5 developers can use Blue Mantis indefinitely on the free tier.' },
  { q: 'What does "unlimited AI suggestions" mean?', a: 'Every task generates four code suggestions — one from each AI agent. There is no cap on how many tasks you can run through Blue Mantis.' },
  { q: 'Is my code sent to third-party AI providers?', a: 'Only the specific file context for the active task is sent — not your whole codebase. Credentials are stored in your own environment, never on our servers. We never store your code.' },
  { q: 'Does Blue Mantis replace our IDE or Git workflow?', a: 'No. Blue Mantis generates and commits code, but you can always pull the branch and edit in your IDE. It is additive, not replacing.' },
  { q: 'What if our stack isn\'t supported yet?', a: 'React + Node.js + PostgreSQL is live today. Angular, .NET, Java, and Oracle are on the roadmap for 2026. Email us at sales@bluemantis.io to get early access for your stack.' },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ maxWidth: 800, margin: '80px auto 0' }}>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 28, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 32 }}>
        Frequently asked questions
      </h3>
      {faqItems.map((item, i) => (
        <div key={i} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: 8 }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)',
            }}
          >
            <span>{item.q}</span>
            <span style={{ transition: 'transform 200ms', transform: open === i ? 'rotate(180deg)' : 'none', color: 'var(--text-muted)', fontSize: 18, flexShrink: 0, marginLeft: 16 }}>
              ▾
            </span>
          </button>
          {open === i && (
            <div style={{ padding: '0 24px 18px', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PricingSection() {
  const header = useScrollReveal();
  const cards = useScrollReveal(150);

  return (
    <section id="pricing" style={{ background: 'var(--bg-surface)', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={header.ref as any} style={{ textAlign: 'center', ...header.style }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent-teal)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>Pricing</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--text-primary)', margin: 0 }}>
            Simple pricing. Start free, upgrade when it works.
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-secondary)', marginTop: 16 }}>
            Most teams upgrade after their first sprint. No pressure.
          </p>
        </div>

        <div ref={cards.ref as any} style={{ maxWidth: 1100, margin: '64px auto 0', display: 'flex', gap: 24, flexWrap: 'wrap', ...cards.style }}>
          {/* Free */}
          <div style={{ flex: 1, minWidth: 260, background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 36 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 20, color: 'var(--text-muted)' }}>Free</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 52, color: 'var(--text-primary)' }}>$0</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)' }}>/ forever</span>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>For individuals and small teams</div>
            <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Up to 5 developers', '1 PLM integration (JIRA or Azure DevOps)', '1 Git repository', 'Unlimited AI suggestions', 'Community support'].map(f => (
                <FeatureItem key={f} text={f} color="var(--accent-teal)" />
              ))}
            </div>
            <button onClick={() => { window.location.href = 'mailto:sales@bluemantis.io?subject=Free tier signup'; }} style={{ width: '100%', marginTop: 28, padding: 12, background: 'none', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600 }}>
              Start free — no card needed
            </button>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>No time limit. Use it as long as you need.</p>
          </div>

          {/* Growth — highlighted */}
          <div style={{ flex: 1, minWidth: 260, background: 'var(--bg-raised)', border: '1px solid var(--accent-blue)', borderTop: '4px solid var(--accent-blue)', borderRadius: 'var(--radius-lg)', padding: 36, position: 'relative', boxShadow: '0 12px 40px rgba(77,148,216,0.15)' }}>
            <div style={{ position: 'absolute', top: -14, right: 20, background: 'var(--accent-blue)', color: '#0C1E2E', fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '4px 12px', borderRadius: 20 }}>RECOMMENDED</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 20, color: 'var(--accent-blue)' }}>Growth</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 12, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 52, color: 'var(--text-primary)' }}>$99</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)' }}>/ seat / month</span>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>For teams of 20–100 developers</div>
            <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Unlimited PLM integrations', 'Unlimited repositories', 'Team analytics dashboard', 'Stack auto-detection', 'Email support + SLA'].map(f => (
                <FeatureItem key={f} text={f} color="var(--accent-teal)" />
              ))}
            </div>
            <button onClick={() => { window.location.href = 'mailto:sales@bluemantis.io?subject=Growth trial'; }} style={{ width: '100%', marginTop: 28, padding: 12, background: 'var(--accent-blue)', border: 'none', color: '#0C1E2E', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600 }}>
              Start Growth trial
            </button>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>Most teams upgrade after their first sprint.</p>
          </div>

          {/* Enterprise */}
          <div style={{ flex: 1, minWidth: 260, background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 36 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 20, color: 'var(--accent-teal)' }}>Enterprise</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 40, color: 'var(--text-primary)' }}>Custom</span>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>For 100+ developer organisations</div>
            <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Everything in Growth', 'SSO and audit logging', 'Private cloud deployment', 'Custom AI model weighting', 'Dedicated customer success manager'].map(f => (
                <FeatureItem key={f} text={f} color="var(--accent-teal)" />
              ))}
            </div>
            <button onClick={() => { window.location.href = 'mailto:sales@bluemantis.io?subject=Enterprise enquiry'; }} style={{ width: '100%', marginTop: 28, padding: 12, background: 'none', border: '1px solid var(--accent-teal)', color: 'var(--accent-teal)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600 }}>
              Talk to us
            </button>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>We'll scope a trial for your security requirements.</p>
          </div>
        </div>

        <FAQ />
      </div>
    </section>
  );
}
