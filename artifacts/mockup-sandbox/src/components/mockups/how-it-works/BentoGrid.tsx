import './_group.css';
import { useState } from 'react';

const steps = [
  { num: 1, title: 'Pick a task', detail: 'From JIRA or Azure DevOps. One prioritised view of everything in your sprint.', icon: '📋' },
  { num: 2, title: 'Blue Mantis reads it', detail: 'Title, description, acceptance criteria — automatically parsed.', icon: '🔍' },
  { num: 3, title: 'Finds relevant files', detail: 'Context-aware search across your connected Git repository.', icon: '📁' },
  { num: 4, title: 'Four agents generate code simultaneously', detail: 'Claude, GPT-4o, Anti Gravity, and MS Copilot — all in parallel. No waiting.', icon: '⚡', wide: true },
  { num: 5, title: 'Agents debate & critique', detail: 'Structured peer review. Scored on correctness, readability, minimal diff, and convention adherence.', icon: '🤝' },
  { num: 6, title: 'Developer reviews diffs', detail: 'Four tabs. One recommended. Plain-English explanation of why.', icon: '👁' },
  { num: 7, title: 'One click — done', detail: 'PR opened. Code committed. Ticket closed automatically.', icon: '✓', highlight: true },
];

function StepCard({ step, hovered, onEnter, onLeave }: { step: typeof steps[0]; hovered: boolean; onEnter: () => void; onLeave: () => void }) {
  const isHighlight = step.num === 4;
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        background: isHighlight
          ? 'linear-gradient(135deg, rgba(2,184,160,0.12), rgba(77,148,216,0.12))'
          : 'var(--bg-surface)',
        border: `1px solid ${hovered ? (isHighlight ? 'var(--accent-teal)' : 'var(--accent-blue)') : isHighlight ? 'rgba(2,184,160,0.3)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: step.wide ? '28px 32px' : '24px 24px',
        cursor: 'default',
        transition: 'border-color 250ms, box-shadow 250ms, transform 200ms',
        boxShadow: hovered
          ? isHighlight ? '0 0 30px rgba(2,184,160,0.2)' : '0 0 20px rgba(77,148,216,0.15)'
          : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: step.wide ? 'row' : 'column',
        alignItems: step.wide ? 'center' : 'flex-start',
        gap: step.wide ? 32 : 12,
      }}
    >
      {/* Ghost number */}
      <span style={{
        fontFamily: 'var(--font-serif)', fontWeight: 700,
        fontSize: step.wide ? 100 : 72,
        color: isHighlight ? 'var(--accent-teal)' : 'var(--accent-blue)',
        opacity: 0.08,
        position: 'absolute',
        bottom: step.wide ? -10 : -8,
        right: 16,
        lineHeight: 1,
        userSelect: 'none', pointerEvents: 'none',
      }}>{step.num}</span>

      {step.wide && (
        <div style={{ flexShrink: 0 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          }}>{step.icon}</div>
        </div>
      )}

      <div style={{ flex: 1 }}>
        {!step.wide && (
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: isHighlight ? 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))' : 'var(--bg-raised)',
            border: isHighlight ? 'none' : '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
          }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 14, color: isHighlight ? '#0C1E2E' : 'var(--text-muted)' }}>{step.num}</span>
          </div>
        )}

        <h3 style={{
          fontFamily: 'var(--font-serif)', fontWeight: 700,
          fontSize: step.wide ? 22 : 15,
          color: isHighlight ? 'var(--text-primary)' : 'var(--text-primary)',
          margin: 0, lineHeight: 1.25,
        }}>{step.title}</h3>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: step.wide ? 15 : 13,
          color: 'var(--text-secondary)', margin: '8px 0 0', lineHeight: 1.6,
        }}>{step.detail}</p>

        {step.wide && (
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {['Claude', 'GPT-4o', 'Anti Gravity', 'MS Copilot'].map(agent => (
              <span key={agent} style={{
                fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
                color: 'var(--accent-teal)',
                background: 'rgba(2,184,160,0.1)',
                border: '1px solid rgba(2,184,160,0.25)',
                borderRadius: 6, padding: '3px 9px',
              }}>{agent}</span>
            ))}
          </div>
        )}

        {step.highlight && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 12, fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
            color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-blue)' }} />
            Fully automated
          </div>
        )}
      </div>
    </div>
  );
}

export function BentoGrid() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh', padding: '64px 48px', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent-teal)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 10px' }}>How It Works</p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 38, color: 'var(--text-primary)', margin: '0 0 10px', lineHeight: 1.15 }}>
          Task to committed PR — one loop.
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-secondary)', margin: 0 }}>
          Seven steps. The developer makes one decision.
        </p>
      </div>

      {/* Bento grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 1100, margin: '0 auto' }}>

        {/* Row 1: Steps 1, 2, 3 */}
        {[0, 1, 2].map(i => (
          <StepCard
            key={steps[i].num}
            step={steps[i]}
            hovered={hoveredIdx === i}
            onEnter={() => setHoveredIdx(i)}
            onLeave={() => setHoveredIdx(null)}
          />
        ))}

        {/* Row 2: Step 4 (2-col) + Step 5 (1-col) */}
        <div style={{ gridColumn: 'span 2' }}>
          <StepCard
            step={{ ...steps[3], wide: true }}
            hovered={hoveredIdx === 3}
            onEnter={() => setHoveredIdx(3)}
            onLeave={() => setHoveredIdx(null)}
          />
        </div>
        <StepCard
          step={steps[4]}
          hovered={hoveredIdx === 4}
          onEnter={() => setHoveredIdx(4)}
          onLeave={() => setHoveredIdx(null)}
        />

        {/* Row 3: Steps 6, 7 + Stats */}
        <StepCard
          step={steps[5]}
          hovered={hoveredIdx === 5}
          onEnter={() => setHoveredIdx(5)}
          onLeave={() => setHoveredIdx(null)}
        />
        <StepCard
          step={{ ...steps[6], highlight: true }}
          hovered={hoveredIdx === 6}
          onEnter={() => setHoveredIdx(6)}
          onLeave={() => setHoveredIdx(null)}
        />

        {/* Stats card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 36, color: 'var(--accent-teal)', lineHeight: 1 }}>43 min</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Avg. task to PR</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 2 }}>vs 3.2 hrs before</div>
          </div>
          <div style={{ height: 1, background: 'var(--border)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 36, color: 'var(--accent-blue)', lineHeight: 1 }}>78%</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Faster to first PR</div>
          </div>
        </div>
      </div>
    </div>
  );
}
