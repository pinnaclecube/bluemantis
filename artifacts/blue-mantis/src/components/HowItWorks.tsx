import { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const steps = [
  { title: 'Developer picks a task', detail: 'From JIRA or Azure DevOps. All incomplete epics, stories, tasks and bugs in one prioritised view.' },
  { title: 'Blue Mantis reads the task', detail: 'Title, description, and acceptance criteria — automatically parsed and understood.' },
  { title: 'Finds relevant files', detail: 'Searches the connected Git repository using context-aware matching.' },
  { title: 'Four AI agents generate code', detail: 'Claude, GPT-4o, Anti Gravity, and MS Copilot — all in parallel. No waiting.' },
  { title: 'Agents debate and critique', detail: 'Structured peer review. Each solution scored on correctness, readability, minimal diff, and convention adherence.' },
  { title: 'Developer reviews side-by-side diffs', detail: 'Four tabs. One recommended. Plain-English explanation of why it was ranked first.' },
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
    <section id="how-it-works" style={{ background: 'var(--bg-app)', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div ref={header.ref as any} style={{ textAlign: 'center', marginBottom: 52, ...header.style }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent-teal)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 10px' }}>How It Works</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(28px, 3.5vw, 42px)', color: 'var(--text-primary)', margin: '0 0 10px', lineHeight: 1.15 }}>
            Task to committed PR — one loop.
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--text-secondary)', margin: 0 }}>
            Seven steps. The developer makes one decision.
          </p>
        </div>

        <div ref={body.ref as any} style={{ ...body.style }}>
          {/* Horizontal rail */}
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ position: 'relative', marginBottom: 32 }}
          >
            {/* Connecting track */}
            <div style={{
              position: 'absolute', top: 20, left: 20, right: 20, height: 2,
              background: 'var(--border)',
            }} />
            {/* Progress fill */}
            <div style={{
              position: 'absolute', top: 20, left: 20, height: 2,
              width: `calc(${(active / (steps.length - 1)) * 100}% * (1 - 40px / 100%))`,
              background: 'linear-gradient(to right, var(--accent-teal), var(--accent-blue))',
              transition: 'width 500ms ease',
              maxWidth: 'calc(100% - 40px)',
            }} />

            {/* Step nodes */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              {steps.map((step, i) => {
                const isPast = i < active;
                const isActive = i === active;
                const isFuture = i > active;
                return (
                  <div
                    key={i}
                    onClick={() => setActive(i)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1 }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: isActive ? 'var(--accent-blue)' : isPast ? 'var(--bg-raised)' : 'var(--bg-surface)',
                      border: `2px solid ${isActive ? 'var(--accent-blue)' : isPast ? 'var(--accent-teal)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 300ms',
                      boxShadow: isActive ? '0 0 20px rgba(77,148,216,0.5)' : 'none',
                      zIndex: 1, position: 'relative',
                    }}>
                      {isPast ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7L5.5 10L11.5 4" stroke="#02B8A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 13, color: isActive ? '#0C1E2E' : 'var(--text-muted)' }}>{i + 1}</span>
                      )}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
                      color: isActive ? 'var(--accent-blue)' : isFuture ? 'var(--text-muted)' : 'var(--text-secondary)',
                      textAlign: 'center', lineHeight: 1.3, maxWidth: 96, transition: 'color 300ms',
                    }}>{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div
            key={active}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px 40px',
              position: 'relative', overflow: 'hidden',
              animation: 'fadeSlideIn 0.35s ease both',
              minHeight: 140,
            }}
          >
            {/* Ghost number */}
            <span style={{
              fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 120,
              color: 'var(--accent-blue)', opacity: 0.07,
              position: 'absolute', top: -20, right: 32, lineHeight: 1,
              userSelect: 'none', pointerEvents: 'none',
            }}>{active + 1}</span>

            {/* Step badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700,
                color: 'var(--accent-teal)', letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>Step {active + 1} of {steps.length}</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 26, color: 'var(--text-primary)', margin: '0 0 10px', lineHeight: 1.2 }}>
              {steps[active].title}
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7, maxWidth: 700 }}>
              {steps[active].detail}
            </p>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
              {steps.map((_, i) => (
                <div key={i} onClick={() => setActive(i)} style={{
                  height: 4, borderRadius: 2, cursor: 'pointer',
                  background: i === active ? 'var(--accent-blue)' : i < active ? 'var(--accent-teal)' : 'var(--border)',
                  width: i === active ? 24 : 8, transition: 'all 300ms',
                }} />
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
            <div style={{
              flex: 1, minWidth: 240, background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '24px 28px',
              borderLeft: '4px solid var(--accent-teal)',
            }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 42, color: 'var(--accent-teal)', lineHeight: 1 }}>Minutes</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>From task to open PR</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 4 }}>The busywork between ticket and commit, automated</div>
            </div>
            <div style={{
              flex: 1, minWidth: 240, background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '24px 28px',
              borderLeft: '4px solid var(--accent-blue)',
            }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontStyle: 'italic', fontSize: 20, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                "The developer made one decision."
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontStyle: 'italic', fontSize: 20, color: 'var(--accent-blue)', lineHeight: 1.4, marginTop: 4 }}>
                "Blue Mantis did the rest."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
