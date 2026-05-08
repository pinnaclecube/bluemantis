import { useState, useEffect } from 'react';

const agents = [
  { name: 'Claude', color: '#8B7CF8' },
  { name: 'GPT-4o', color: '#A2F0C5' },
  { name: 'Anti Gravity', color: '#F2F995' },
  { name: 'Copilot', color: '#4D94D8' },
];

function PulsingDots({ delay = 0 }: { delay?: number }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--accent-blue)',
          animation: `pulse 0.8s ease ${delay + i * 200}ms infinite`,
        }} />
      ))}
    </div>
  );
}

const steps = [
  () => (
    <div className="animate-slide-in-left">
      <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        {'// Task loaded from JIRA'}
      </div>
      <div style={{
        background: 'var(--bg-raised)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', padding: 12, marginTop: 8,
      }}>
        <div>
          <span style={{ color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>PROJ-142</span>
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}> Fix payment service timeout</span>
        </div>
        <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
          <span style={{ background: 'rgba(77,148,216,0.15)', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontFamily: 'var(--font-mono)' }}>JIRA</span>
          <span style={{ background: 'rgba(240,112,112,0.15)', color: 'var(--accent-red)', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontFamily: 'var(--font-mono)' }}>P1</span>
        </div>
      </div>
    </div>
  ),
  () => (
    <div>
      <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12, marginBottom: 12 }}>
        {'// Four agents generating in parallel'}
      </div>
      {agents.map((agent, i) => (
        <div key={agent.name} style={{
          display: 'flex', alignItems: 'center', gap: 10, marginTop: 8,
          animation: `fadeInUp 0.4s ease ${i * 150}ms both`,
        }}>
          <span style={{ color: agent.color, fontFamily: 'var(--font-mono)', fontSize: 12, minWidth: 90 }}>{agent.name}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>
          <PulsingDots delay={i * 200} />
        </div>
      ))}
    </div>
  ),
  () => (
    <div className="animate-fade-in">
      <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12, marginBottom: 10 }}>
        {'// Claude suggestion — score 9.2/10'}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.8 }}>
        <div style={{ color: 'var(--accent-red)' }}>- const timeout = 5000;</div>
        <div style={{ color: 'var(--accent-green)' }}>+ const timeout = config.timeout ?? DEFAULT_TIMEOUT;</div>
        <div style={{ color: 'var(--accent-green)' }}>+ if (!timeout) throw new TimeoutError(taskId);</div>
      </div>
    </div>
  ),
  () => (
    <div>
      <div className="animate-slide-in-right" style={{
        border: '1px solid var(--accent-green)', borderRadius: 'var(--radius-sm)',
        padding: '8px 12px', marginTop: 8, color: 'var(--accent-green)',
        fontFamily: 'var(--font-mono)', fontSize: 12,
      }}>
        ✓ PR #1287 opened — main ← task/PROJ-142
      </div>
      <div className="animate-slide-in-right" style={{
        border: '1px solid var(--accent-teal)', borderRadius: 'var(--radius-sm)',
        padding: '8px 12px', marginTop: 8, color: 'var(--accent-teal)',
        fontFamily: 'var(--font-mono)', fontSize: 12,
        animationDelay: '200ms',
      }}>
        ✓ PROJ-142 closed in JIRA
      </div>
    </div>
  ),
];

export default function AnimatedCodeWindow() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentStep(s => (s + 1) % steps.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const StepContent = steps[currentStep];

  return (
    <div style={{
      borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
      background: '#050D14', overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      width: '100%', maxWidth: 520,
    }}>
      <div style={{
        height: 36, background: '#0A1520', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#F07070', '#F2F995', '#A2F0C5'].map((color, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          Blue Mantis Workspace
        </span>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ padding: 20, minHeight: 280 }}>
        <StepContent key={currentStep} />
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 20px 16px', justifyContent: 'center' }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i === currentStep ? 'var(--accent-blue)' : 'var(--border)',
            cursor: 'pointer', transition: 'background 200ms',
          }} onClick={() => setCurrentStep(i)} />
        ))}
      </div>
    </div>
  );
}
