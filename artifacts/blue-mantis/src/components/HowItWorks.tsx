import { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const steps = [
  { title: 'Developer picks a task', detail: 'From JIRA or Azure DevOps. All incomplete epics, stories, tasks and bugs in one prioritised view.' },
  { title: 'Blue Mantis reads the task', detail: 'Title, description, and acceptance criteria — automatically parsed.' },
  { title: 'Finds relevant files', detail: 'Searches the connected Git repository using context matching.' },
  { title: 'Four AI agents generate code simultaneously', detail: 'Claude, GPT-4o, Anti Gravity, and MS Copilot — all in parallel.' },
  { title: 'Agents debate and critique each other', detail: 'Structured review. Scored on correctness, readability, minimal diff, and convention adherence.' },
  { title: 'Developer reviews side-by-side diffs', detail: 'Four tabs. One recommended. Plain-English explanation of why.' },
  { title: 'One click — done', detail: 'PR opened. Code committed. Ticket closed automatically.' },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const header = useScrollReveal();
  const cards = useScrollReveal(200);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setActive(s => (s + 1) % steps.length);
    }, 2800);
  };

  useEffect(() => {
    if (!hovered) start();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hovered]);

  return (
    <section id="how-it-works" style={{ background: 'var(--bg-app)', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={header.ref as any} style={{ textAlign: 'center', ...header.style }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent-teal)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>How It Works</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(32px, 4vw, 44px)', color: 'var(--text-primary)', margin: 0 }}>
            Task to committed PR — one loop, one tool.
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--text-secondary)', marginTop: 16 }}>
            Seven steps. The developer makes one decision.
          </p>
        </div>

        <div style={{ marginTop: 64, display: 'flex', gap: 48, flexWrap: 'wrap' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div style={{ width: '38%', minWidth: 280 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }} onClick={() => setActive(i)}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: i <= active ? 'var(--accent-blue)' : 'var(--bg-raised)',
                    border: '2px solid ' + (i <= active ? 'var(--accent-blue)' : 'var(--border)'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 300ms',
                  }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 14, color: i <= active ? '#0C1E2E' : 'var(--text-muted)' }}>{i + 1}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{
                      width: 2, height: 36, marginTop: 4,
                      background: i < active ? 'var(--accent-teal)' : 'var(--border)',
                      transition: 'background 500ms',
                    }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < steps.length - 1 ? 0 : 0, paddingTop: 4, cursor: 'pointer' }}>
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, margin: 0,
                    color: i === active ? 'var(--accent-blue)' : 'var(--text-primary)',
                    transition: 'color 200ms',
                  }}>{step.title}</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 20px' }}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, minWidth: 280 }}>
            <div key={active} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: 32, position: 'relative', overflow: 'hidden',
              animation: 'fadeIn 0.3s ease both',
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 64,
                color: 'var(--accent-blue)', opacity: 0.2,
                position: 'absolute', top: 8, right: 20, lineHeight: 1,
              }}>{active + 1}</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 24, color: 'var(--text-primary)', margin: 0 }}>
                {steps[active].title}
              </h3>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-secondary)', marginTop: 12, lineHeight: 1.7 }}>
                {steps[active].detail}
              </p>
            </div>
          </div>
        </div>

        <div ref={cards.ref as any} style={{ display: 'flex', gap: 24, marginTop: 64, flexWrap: 'wrap', ...cards.style }}>
          <div style={{
            flex: 1, minWidth: 240, background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 32, borderLeft: '4px solid var(--accent-teal)',
          }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 52, color: 'var(--accent-teal)', lineHeight: 1 }}>43 min</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>Average time from task to PR</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 6 }}>Down from 3.2 hours self-reported</div>
          </div>
          <div style={{
            flex: 1, minWidth: 240, background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 32, borderLeft: '4px solid var(--accent-blue)',
          }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontStyle: 'italic', fontSize: 22, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              "The developer made one decision."
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontStyle: 'italic', fontSize: 22, color: 'var(--accent-blue)', lineHeight: 1.3, marginTop: 8 }}>
              "Blue Mantis did the rest."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
