import { useState } from 'react';
import type { DevCopilotTask } from '@/services/api';

export interface FilterState {
  type: string;
  source: string;
  priority: string;
}

interface FilterPillsProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '4px 12px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'var(--font-sans)',
        cursor: 'pointer',
        transition: 'all 150ms ease',
        border: active
          ? '1px solid var(--accent-blue)'
          : hovered
            ? '1px solid var(--border-bright)'
            : '1px solid var(--border)',
        background: active ? 'rgba(77,156,255,0.2)' : 'transparent',
        color: active ? 'var(--accent-blue)' : 'var(--text-muted)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

const Divider = () => (
  <span style={{ width: 1, height: 20, background: 'var(--border)', flexShrink: 0 }} />
);

const TYPE_OPTIONS = ['All', 'Epic', 'Story', 'Task', 'Bug'];
const SOURCE_OPTIONS = ['All', 'Azure DevOps', 'JIRA'];
const PRIORITY_OPTIONS = ['All', 'P1', 'P2', 'P3', 'P4'];

export function FilterPills({ filters, onChange }: FilterPillsProps) {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .dc-filter-bar { overflow-x: auto; flex-wrap: nowrap !important; }
        }
      `}</style>
      <div
        className="dc-filter-bar"
        style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}
      >
        {TYPE_OPTIONS.map((t) => (
          <Pill
            key={t}
            label={t}
            active={filters.type === t}
            onClick={() => onChange({ ...filters, type: t })}
          />
        ))}
        <Divider />
        {SOURCE_OPTIONS.map((s) => (
          <Pill
            key={s}
            label={s}
            active={filters.source === s}
            onClick={() => onChange({ ...filters, source: s })}
          />
        ))}
        <Divider />
        {PRIORITY_OPTIONS.map((p) => (
          <Pill
            key={p}
            label={p}
            active={filters.priority === p}
            onClick={() => onChange({ ...filters, priority: p })}
          />
        ))}
      </div>
    </>
  );
}

export function applyFilters(tasks: DevCopilotTask[], filters: FilterState): DevCopilotTask[] {
  return tasks.filter((t) => {
    if (filters.type !== 'All') {
      const tMap: Record<string, string> = { Epic: 'epic', Story: 'story', Task: 'chore', Bug: 'bug' };
      if (t.type !== tMap[filters.type]) return false;
    }
    if (filters.source !== 'All') {
      const sMap: Record<string, string> = { 'Azure DevOps': 'azure-devops', 'JIRA': 'jira' };
      if (t.source !== sMap[filters.source]) return false;
    }
    if (filters.priority !== 'All') {
      const pMap: Record<string, string> = { P1: 'critical', P2: 'high', P3: 'medium', P4: 'low' };
      if (t.priority !== pMap[filters.priority]) return false;
    }
    return true;
  });
}
