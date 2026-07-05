import { useState, useMemo } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

function formatMillion(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1000)}K`;
}
function formatK(n: number) { return `$${Math.round(n / 1000)}K`; }

type Field = { key: string; label: string; value: number; set: (n: number) => void; min: number; max: number; step: number; display: string; unit: string };

export default function ROICalculator() {
  const [teamSize, setTeamSize] = useState(50);
  const [avgCost, setAvgCost] = useState(180000);
  const [overhead, setOverhead] = useState(58);
  const [improvement, setImprovement] = useState(30);
  const header = useScrollReveal();
  const body = useScrollReveal(150);

  const { recovered, annualCost, netValue, roi } = useMemo(() => {
    const recovered = teamSize * avgCost * (overhead / 100) * (improvement / 100);
    const annualCost = teamSize * 99 * 12;
    const netValue = recovered - annualCost;
    const roi = annualCost > 0 ? Math.round(recovered / annualCost) : 0;
    return { recovered, annualCost, netValue, roi };
  }, [teamSize, avgCost, overhead, improvement]);

  const fields: Field[] = [
    { key: 'team', label: 'Team size', value: teamSize, set: setTeamSize, min: 5, max: 300, step: 5, display: `${teamSize}`, unit: 'developers' },
    { key: 'cost', label: 'Avg loaded cost', value: avgCost, set: setAvgCost, min: 80000, max: 350000, step: 5000, display: `$${(avgCost / 1000).toFixed(0)}K`, unit: 'per dev / year' },
    { key: 'oh', label: 'Non-coding overhead', value: overhead, set: setOverhead, min: 20, max: 80, step: 1, display: `${overhead}%`, unit: 'of each week' },
    { key: 'imp', label: 'Blue Mantis improvement', value: improvement, set: setImprovement, min: 5, max: 60, step: 1, display: `${improvement}%`, unit: 'faster task close' },
  ];

  const rows = [
    { label: 'Recovered developer capacity', value: formatMillion(recovered), size: 26, color: 'var(--accent-green)' },
    { label: 'Blue Mantis annual cost', value: formatK(annualCost), size: 20, color: 'var(--text-muted)' },
    { label: 'Net annual value', value: formatMillion(netValue), size: 26, color: netValue >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' },
  ];

  const costBarWidth = recovered > 0 ? Math.max(Math.min((annualCost / recovered) * 100, 100), 2) : 100;

  return (
    <section id="roi" className="lp-section">
      <div className="lp-container">
        <div ref={header.ref as any} style={{ textAlign: 'center', ...header.style }}>          <h2 className="lp-h2">What does this mean <span className="lp-grad">for your team?</span></h2>
          <p className="lp-lead">Drag the sliders. See your return — live.</p>
        </div>

        <div ref={body.ref as any} style={{ margin: '52px auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, ...body.style }}>
          {/* Inputs */}
          <div className="lp-glass" style={{ padding: 'clamp(28px, 3.5vw, 38px)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 26 }}>Your numbers</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
              {fields.map(f => {
                const pct = ((f.value - f.min) / (f.max - f.min)) * 100;
                return (
                  <div key={f.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                      <label htmlFor={f.key} style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)' }}>{f.label}</label>
                      <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: 'var(--accent-blue)' }}>{f.display}</span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)' }}>{f.unit}</span>
                      </span>
                    </div>
                    <input
                      id={f.key}
                      type="range"
                      min={f.min} max={f.max} step={f.step} value={f.value}
                      onChange={e => f.set(Number(e.target.value))}
                      className="lp-range"
                      style={{ background: `linear-gradient(90deg, var(--accent-teal), var(--accent-blue) ${pct}%, var(--border) ${pct}%)` }}
                    />
                  </div>
                );
              })}
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 22, lineHeight: 1.5 }}>
              These are your inputs — adjust them to match your team and stack.
            </p>
          </div>

          {/* Result */}
          <div className="lp-glass" style={{ padding: 'clamp(28px, 3.5vw, 38px)', background: 'linear-gradient(158deg, rgba(2,184,160,0.16), rgba(12,30,46,0.34))', borderColor: 'rgba(2,184,160,0.3)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: 20 }}>The return</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 20, borderBottom: '1px solid var(--lp-glass-border)' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 'clamp(48px, 8vw, 68px)', color: 'var(--accent-green)', lineHeight: 1, letterSpacing: '-0.03em' }}>{roi}×</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.4 }}>return on the<br />Blue Mantis subscription</span>
            </div>

            {rows.map((row, i) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--lp-glass-border)' : 'none' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)' }}>{row.label}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: row.size, color: row.color, letterSpacing: '-0.02em' }}>{row.value}</span>
              </div>
            ))}

            <div style={{ marginTop: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                <span>Blue Mantis cost</span><span>Recovered capacity</span>
              </div>
              <div style={{ height: 12, background: 'var(--accent-green)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${costBarWidth}%`, background: 'var(--text-muted)', borderRadius: 6, transition: 'width 300ms ease' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                The Blue Mantis cost bar is barely visible against the return.
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <button className="lp-btn lp-btn-primary" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
            Start free and measure your own numbers →
          </button>
        </div>
      </div>
    </section>
  );
}
