import { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const steps = [
  { title: 'Pick a task', detail: 'From Jira or Azure DevOps. Every incomplete epic, story, task and bug in one prioritised view.' },
  { title: 'Blue Mantis reads it', detail: 'Title, description, and acceptance criteria — automatically parsed and understood.' },
  { title: 'Finds relevant files', detail: 'Searches the connected Git repository using context-aware, stack-aware matching.' },
  { title: 'Four agents generate', detail: 'Claude, GPT-4o, Anti Gravity, and MS Copilot — all in parallel. No waiting in line.' },
  { title: 'They debate & score', detail: 'Structured peer review. Each solution scored on correctness, readability, minimal diff, and convention.' },
  { title: 'You review diffs', detail: 'Four tabs. One recommended. A plain-English explanation of why it was ranked first.' },
  { title: 'One click — done', detail: 'PR opened. Code committed. Ticket closed automatically in your PLM.' },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const header = useScrollReveal();
  const body = useScrollReveal(150);

  useEffect(() => {
    if (paused) { if (timer.current) clearInterval(timer.current); return; }
    timer.current = setInterval(() => setActive(s => (s + 1) % steps.length), 2800);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [paused]);

  return (
    <section id="how-it-works" className="lp-section">
      <div className="lp-container">
        <div ref={header.ref as any} style={{ textAlign: 'center', marginBottom: 52, ...header.style }}>
          <p className="lp-eyebrow lp-center">How it works</p>
          <h2 className="lp-h2">Task to committed PR — <span className="lp-grad">one loop</span>.</h2>
          <p className="lp-lead">Seven steps. The developer makes exactly one decision.</p>
        </div>

        <div ref={body.ref as any} style={{ ...body.style }}>
          {/* Node rail */}
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ position: 'relative', marginBottom: 28 }}
          >
            <div style={{ position: 'absolute', top: 21, left: 20, right: 20, height: 2, background: 'var(--border)', borderRadius: 2 }} />
            <div style={{
              position: 'absolute', top: 21, left: 20, height: 2, borderRadius: 2,
              width: `calc((100% - 40px) * ${active / (steps.length - 1)})`,
              background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-blue))',
              boxShadow: '0 0 12px rgba(77,148,216,0.6)', transition: 'width 500ms cubic-bezier(0.16,1,0.3,1)',
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              {steps.map((step, i) => {
                const isPast = i < active;
                const isActive = i === active;
                return (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Step ${i + 1}: ${step.title}`}
                    style={{ background: 'none', border: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1 }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: isActive ? 'var(--lp-grad-cta)' : isPast ? 'rgba(2,184,160,0.14)' : 'rgba(12,30,46,0.6)',
                      border: `2px solid ${isActive ? 'transparent' : isPast ? 'var(--accent-teal)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
                      boxShadow: isActive ? '0 0 22px rgba(2,184,160,0.6)' : 'none',
                      zIndex: 1, position: 'relative',
                    }}>
                      {isPast ? (
                        <svg width="15" height="15" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="#02B8A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: isActive ? '#06121C' : 'var(--text-muted)' }}>{i + 1}</span>
                      )}
                    </div>
                    <span className="hidden md:block" style={{
                      fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
                      color: isActive ? 'var(--accent-blue)' : isPast ? 'var(--text-secondary)' : 'var(--text-muted)',
                      textAlign: 'center', lineHeight: 1.3, maxWidth: 92, transition: 'color 300ms',
                    }}>{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div key={active} className="lp-glass" style={{ padding: 'clamp(28px, 4vw, 40px)', position: 'relative', overflow: 'hidden', animation: 'fadeSlideIn 0.35s ease both', minHeight: 150 }}>
            <span style={{
              fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 150, color: 'var(--accent-blue)', opacity: 0.06,
              position: 'absolute', top: -30, right: 24, lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
            }}>{active + 1}</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--accent-teal)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Step {active + 1} / {steps.length}</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'clamp(22px, 3vw, 28px)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '0 0 10px' }}>{steps[active].title}</h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7, maxWidth: 680 }}>{steps[active].detail}</p>

            <div style={{ display: 'flex', gap: 6, marginTop: 26 }}>
              {steps.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} aria-label={`Go to step ${i + 1}`} style={{
                  height: 4, borderRadius: 2, cursor: 'pointer', border: 'none', padding: 0,
                  background: i === active ? 'var(--accent-blue)' : i < active ? 'var(--accent-teal)' : 'var(--border)',
                  width: i === active ? 26 : 8, transition: 'all 300ms',
                }} />
              ))}
            </div>
          </div>

          {/* Outcome cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginTop: 20 }}>
            <div className="lp-glass lp-hoverable" style={{ padding: '26px 30px', borderLeft: '3px solid var(--accent-teal)' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 40, color: 'var(--accent-teal)', lineHeight: 1, letterSpacing: '-0.03em' }}>Minutes</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>From task to open PR</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>The busywork between ticket and commit, automated.</div>
            </div>
            <div className="lp-glass lp-hoverable" style={{ padding: '26px 30px', borderLeft: '3px solid var(--accent-blue)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 20, color: 'var(--text-primary)', lineHeight: 1.4 }}>&ldquo;The developer made one decision.</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 20, color: 'var(--accent-blue)', lineHeight: 1.4 }}>Blue Mantis did the rest.&rdquo;</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
