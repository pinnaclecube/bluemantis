import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

function Pill({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, color, background: bg, fontFamily: 'var(--font-mono)' }}>
      {label}
    </span>
  );
}

function SprintBacklogMock() {
  const rows = [
    { id: 'PROJ-142', title: 'Fix payment timeout', source: 'JIRA', srcColor: 'var(--accent-blue)', srcBg: 'rgba(77,148,216,0.15)', type: 'BUG', typeColor: 'var(--accent-red)', typeBg: 'rgba(240,112,112,0.15)' },
    { id: 'ADO-891',  title: 'Add auth middleware', source: 'ADO', srcColor: '#A78BFA', srcBg: 'rgba(167,139,250,0.15)', type: 'TASK', typeColor: 'var(--accent-green)', typeBg: 'rgba(162,240,197,0.15)' },
    { id: 'PROJ-143', title: 'Update rate limiter', source: 'JIRA', srcColor: 'var(--accent-blue)', srcBg: 'rgba(77,148,216,0.15)', type: 'STORY', typeColor: 'var(--accent-blue)', typeBg: 'rgba(77,148,216,0.15)' },
    { id: 'ADO-892',  title: 'Refactor DB pool',   source: 'ADO', srcColor: '#A78BFA', srcBg: 'rgba(167,139,250,0.15)', type: 'EPIC', typeColor: '#A78BFA', typeBg: 'rgba(167,139,250,0.15)' },
  ];
  return (
    <div style={{ background: '#050D14', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ background: 'var(--bg-raised)', padding: '10px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)' }}>Sprint Backlog</div>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 110px 90px 90px', padding: '8px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-muted)' }}>
        {['ID', 'TITLE', 'SOURCE', 'TYPE', 'ACTION'].map(h => <span key={h}>{h}</span>)}
      </div>
      {rows.map(row => (
        <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 110px 90px 90px', padding: '12px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-blue)' }}>{row.id}</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-primary)', paddingRight: 8 }}>{row.title}</span>
          <Pill label={row.source} color={row.srcColor} bg={row.srcBg} />
          <Pill label={row.type} color={row.typeColor} bg={row.typeBg} />
          <button style={{ background: 'rgba(77,148,216,0.2)', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', fontSize: 10, padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
            Generate
          </button>
        </div>
      ))}
    </div>
  );
}

function WorkspaceMock() {
  return (
    <div style={{ background: '#050D14', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', display: 'flex', height: 260 }}>
      <div style={{ width: '20%', borderRight: '1px solid var(--border)', padding: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent-blue)' }}>PROJ-142</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-primary)', marginTop: 4 }}>Fix payment service timeout</div>
        {['✓ Returns 504 on timeout', '✓ Uses config value', '○ Has unit test'].map((item, i) => (
          <div key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: 8, color: i < 2 ? 'var(--accent-teal)' : 'var(--text-muted)', marginTop: 6 }}>{item}</div>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', fontSize: 9 }}>
          {['Claude ●', 'GPT-4o', 'Anti Gravity', 'Copilot'].map((tab, i) => (
            <div key={tab} style={{ padding: '6px 10px', fontFamily: 'var(--font-sans)', color: i === 0 ? 'var(--accent-purple)' : 'var(--text-muted)', borderBottom: i === 0 ? '2px solid var(--accent-purple)' : 'none', cursor: 'pointer' }}>
              {tab}
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--bg-raised)', padding: '6px 10px', fontFamily: 'var(--font-sans)', fontSize: 9, fontStyle: 'italic', color: 'var(--text-muted)' }}>
          "Follows existing error pattern in service layer."
        </div>
        <div style={{ padding: 10, fontFamily: 'var(--font-mono)', fontSize: 9, lineHeight: 1.5 }}>
          <div><span style={{ color: 'var(--text-muted)' }}>const </span><span style={{ color: 'var(--accent-blue)' }}>timeout</span><span style={{ color: 'var(--text-primary)' }}> = config.timeout </span><span style={{ color: 'var(--text-muted)' }}>??</span><span style={{ color: 'var(--accent-green)' }}> DEFAULT_TIMEOUT</span>;</div>
          <div style={{ color: 'var(--text-muted)' }}>{'if (!timeout) throw new TimeoutError(taskId);'}</div>
          <div><span style={{ color: 'var(--accent-blue)' }}>const</span><span style={{ color: 'var(--text-primary)' }}> result = await paymentService.process({'{'}</span></div>
          <div style={{ color: 'var(--text-secondary)', paddingLeft: 12 }}>timeout, taskId, retries: 3</div>
        </div>
        <div style={{ padding: '0 10px 8px' }}>
          {[['Correctness', 94], ['Readability', 88], ['Diff', 91], ['Convention', 85]].map(([label, pct]) => (
            <div key={label as string} style={{ marginBottom: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', marginBottom: 2 }}>
                <span>{label}</span><span>{pct}%</span>
              </div>
              <div style={{ height: 4, background: 'var(--bg-raised)', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent-blue)', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: '20%', borderLeft: '1px solid var(--border)', padding: 12 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 10 }}>PROGRESS</div>
        {['Suggestions', 'Accepted', 'PR opened', 'Closed'].map((step, i) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: i < 2 ? 'var(--accent-blue)' : 'var(--bg-raised)', border: '1px solid ' + (i < 2 ? 'var(--accent-blue)' : 'var(--border)'), flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 8, color: i < 2 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AutoCloseMock() {
  const rows = [
    { icon: '✓', label: 'Code committed', value: 'a1b2c3d' },
    { icon: '✓', label: 'PR #1287 opened', value: 'main ← task/PROJ-142' },
    { icon: '✓', label: 'PROJ-142 closed', value: 'JIRA ✓' },
    { icon: '✓', label: 'Commit hash added', value: 'PROJ-142 updated' },
  ];
  return (
    <div style={{ background: '#050D14', border: '1px solid var(--border)', borderRadius: 8, padding: 20 }}>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16 }}>
        PROJ-142 — Fix payment service timeout
      </div>
      {rows.map((row, i) => (
        <div key={row.label} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
          borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
        }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 8, color: '#050D14' }}>✓</span>
          </div>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>{row.label}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{row.value}</span>
        </div>
      ))}
      <div style={{ marginTop: 16, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--accent-teal)' }}>
        All done. Zero context switching.
      </div>
    </div>
  );
}

const tabs = [
  {
    label: 'Sprint Backlog',
    headline: 'Every task. One view.',
    body: 'All your JIRA and Azure DevOps epics, stories, tasks and bugs in one prioritised list. Filter by type, source, or priority. One click generates AI code suggestions for any task. You never open JIRA again.',
    bullets: ['Epic · Story · Task · Bug — all in one list', 'Filter by source: JIRA or Azure DevOps', 'Priority indicators: P1 through P4', 'One-click AI generation per task'],
    Mock: SprintBacklogMock,
  },
  {
    label: 'Developer Workspace',
    headline: 'Four agents. One recommendation.',
    body: 'Three-panel layout. Left shows the task and acceptance criteria. Centre shows four AI agent tabs with syntax-highlighted code, scored and ranked. The top suggestion loads first with a plain-English explanation of why it won. Right shows commit details and progress.',
    bullets: ['Claude · GPT-4o · Anti Gravity · Copilot — all four, side by side', 'Agents debate and score each other before you see results', 'Refine any suggestion with a plain-English prompt', 'Side-by-side diff: current code vs suggested change'],
    Mock: WorkspaceMock,
  },
  {
    label: 'Automatic Close',
    headline: 'Commit, PR, closed. One click.',
    body: 'Accept any suggestion. Blue Mantis creates the branch, commits the code, opens the PR with the task title and description, and closes the ticket in JIRA or Azure DevOps with the commit hash in the notes.',
    bullets: ['Branch created: task/PROJ-142', 'PR opened with task title and description', 'Ticket closed with commit hash in notes', 'Full audit trail — who accepted which agent\'s code'],
    Mock: AutoCloseMock,
  },
];

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState(1);
  const [fading, setFading] = useState(false);
  const header = useScrollReveal();

  const switchTab = (i: number) => {
    setFading(true);
    setTimeout(() => { setActiveTab(i); setFading(false); }, 200);
  };

  const tab = tabs[activeTab];

  return (
    <section id="product" style={{ background: 'var(--bg-surface)', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={header.ref as any} style={{ textAlign: 'center', ...header.style }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent-teal)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>The Product</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--text-primary)', margin: 0 }}>
            Three screens. Zero context switching.
          </h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48, borderBottom: '1px solid var(--border)' }}>
          {tabs.map((t, i) => (
            <button key={t.label} onClick={() => switchTab(i)} style={{
              padding: '14px 32px', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', background: 'none', border: 'none',
              color: i === activeTab ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: i === activeTab ? '2px solid var(--accent-blue)' : '2px solid transparent',
              marginBottom: -1,
            }}
              onMouseEnter={e => { if (i !== activeTab) e.currentTarget.style.color = 'var(--text-secondary)'; }}
              onMouseLeave={e => { if (i !== activeTab) e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{
          maxWidth: 1200, margin: '48px auto 0',
          display: 'flex', gap: 64, flexWrap: 'wrap',
          opacity: fading ? 0 : 1, transition: 'opacity 200ms',
        }}>
          <div style={{ flex: '0 0 340px', minWidth: 240 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 28, color: 'var(--text-primary)', margin: 0 }}>{tab.headline}</h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--text-secondary)', marginTop: 16, lineHeight: 1.7 }}>{tab.body}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
              {tab.bullets.map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-blue)', flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-secondary)' }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <tab.Mock />
          </div>
        </div>
      </div>
    </section>
  );
}
