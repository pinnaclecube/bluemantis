import { useState, useMemo } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

function formatMillion(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1000)}K`;
}
function formatK(n: number) {
  return `$${Math.round(n / 1000)}K`;
}

export default function ROICalculator() {
  const [teamSize, setTeamSize] = useState(50);
  const [avgCost, setAvgCost] = useState(180000);
  const [overhead, setOverhead] = useState(58);
  const [improvement, setImprovement] = useState(30);
  const header = useScrollReveal();

  const { recovered, annualCost, netValue, roi } = useMemo(() => {
    const recovered = teamSize * avgCost * (overhead / 100) * (improvement / 100);
    const annualCost = teamSize * 99 * 12;
    const netValue = recovered - annualCost;
    const roi = Math.round(recovered / annualCost);
    return { recovered, annualCost, netValue, roi };
  }, [teamSize, avgCost, overhead, improvement]);

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-app)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '10px 14px',
    fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--accent-blue)',
    width: 140, outline: 'none',
  };

  const rows = [
    { label: 'Recovered developer capacity', value: formatMillion(recovered), size: 28, color: 'var(--accent-green)' },
    { label: 'Blue Mantis annual cost', value: formatK(annualCost), size: 20, color: 'var(--text-muted)' },
    { label: 'Net annual value', value: formatMillion(netValue), size: 28, color: 'var(--accent-green)' },
    { label: 'ROI', value: `${roi}x`, size: 48, color: 'var(--accent-green)' },
  ];

  const costBarWidth = Math.min((annualCost / recovered) * 100, 8);

  return (
    <section id="roi" style={{ background: 'var(--bg-surface)', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={header.ref as any} style={{ textAlign: 'center', ...header.style }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent-teal)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>ROI</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--text-primary)', margin: 0 }}>
            What does this mean for your team?
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--text-secondary)', marginTop: 16 }}>
            Enter your numbers. See your return — live.
          </p>
        </div>

        <div style={{ maxWidth: 1100, margin: '64px auto 0', display: 'flex', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280, background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 36 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 24 }}>YOUR NUMBERS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { label: 'Team size', value: teamSize, set: setTeamSize, unit: 'developers', prefix: '' },
                { label: 'Avg loaded cost', value: avgCost, set: setAvgCost, unit: 'per dev / year', prefix: '$' },
                { label: 'Non-coding overhead', value: overhead, set: setOverhead, unit: '% of each week', prefix: '' },
                { label: 'Blue Mantis improvement', value: improvement, set: setImprovement, unit: '% faster task close', prefix: '' },
              ].map(row => (
                <div key={row.label}>
                  <label style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>{row.label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {row.prefix && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-muted)' }}>{row.prefix}</span>}
                    <input
                      type="number"
                      value={row.value}
                      onChange={e => row.set(Number(e.target.value))}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = 'var(--accent-blue)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                    />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)' }}>{row.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 16 }}>
              Conservative estimate. Beta teams have seen up to 78% improvement.
            </p>
          </div>

          <div style={{ flex: 1, minWidth: 280, background: 'var(--bg-raised)', border: '1px solid var(--accent-green)', borderRadius: 'var(--radius-lg)', padding: 36 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--accent-green)', marginBottom: 24 }}>THE RETURN</div>
            {rows.map((row, i) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)' }}>{row.label}</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: row.size, color: row.color }}>{row.value}</span>
              </div>
            ))}

            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)' }}>
                <span>Blue Mantis cost</span><span>Recovered capacity</span>
              </div>
              <div style={{ height: 12, background: 'var(--bg-app)', borderRadius: 6, overflow: 'hidden', marginTop: 6, position: 'relative' }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'var(--accent-green)', borderRadius: 6 }} />
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${costBarWidth}%`, background: 'var(--text-muted)', borderRadius: 6 }} />
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 6 }}>
                The Blue Mantis cost bar is barely visible against the return.
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'var(--accent-blue)', color: '#0C1E2E', border: 'none',
              padding: '14px 32px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#5BA8E8')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent-blue)')}
          >
            Start free and measure your own numbers →
          </button>
        </div>
      </div>
    </section>
  );
}
