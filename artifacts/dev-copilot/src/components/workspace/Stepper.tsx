interface StepperProps {
  currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
  { n: 1, label: 'Suggestions ready' },
  { n: 2, label: 'Code accepted' },
  { n: 3, label: 'PR opened' },
  { n: 4, label: 'Task closed' },
];

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6l3 3 5-5" />
    </svg>
  );
}

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {STEPS.map(({ n, label }, i) => {
        const done = n < currentStep;
        const active = n === currentStep;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28,
                borderRadius: '50%',
                background: done ? 'var(--accent-green)' : active ? 'var(--accent-blue)' : 'var(--bg-raised)',
                border: done ? 'none' : active ? 'none' : '1px solid var(--hairline)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: active ? 'dc-stepper-pulse 1.5s ease-in-out infinite' : 'none',
                transition: 'background 400ms ease',
              }}>
                {done ? <CheckIcon /> : (
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    color: active ? '#0D0F12' : 'var(--text-muted)',
                  }}>{n}</span>
                )}
              </div>
              {!isLast && (
                <div style={{
                  width: 2,
                  height: 24,
                  background: done ? 'var(--accent-green)' : 'var(--hairline)',
                  transition: 'background 400ms ease',
                  margin: '4px 0',
                }} />
              )}
            </div>
            <div style={{ paddingTop: 4, paddingBottom: isLast ? 0 : 24 }}>
              <span style={{
                fontSize: 12,
                fontFamily: 'var(--font-sans)',
                color: (done || active) ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: active ? 500 : 400,
              }}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
