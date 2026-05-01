import { memo } from 'react';
import { useLocation } from 'wouter';
import { Badge } from '@/components/dc/Badge';
import { Button } from '@/components/dc/Button';
import type { DevCopilotTask } from '@/services/api';

interface TaskRowProps {
  task: DevCopilotTask;
  onGenerate: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  epic: 'var(--accent-purple)',
  story: 'var(--accent-blue)',
  feature: 'var(--accent-blue)',
  chore: 'var(--accent-green)',
  task: 'var(--accent-green)',
  bug: 'var(--accent-red)',
};

const SOURCE_VARIANT: Record<string, 'purple' | 'blue' | 'muted'> = {
  'azure-devops': 'purple',
  jira: 'blue',
};

const SOURCE_LABELS: Record<string, string> = {
  'azure-devops': 'Azure DevOps',
  jira: 'JIRA',
  github: 'GitHub',
  manual: 'Manual',
};

const TYPE_LABELS: Record<string, string> = {
  feature: 'Feature',
  story: 'Story',
  epic: 'Epic',
  chore: 'Task',
  task: 'Task',
  bug: 'Bug',
};

const TYPE_VARIANTS: Record<string, 'purple' | 'blue' | 'green' | 'red' | 'muted'> = {
  epic: 'purple',
  story: 'blue',
  feature: 'blue',
  chore: 'green',
  task: 'green',
  bug: 'red',
};

const PRIORITY_VARIANTS: Record<string, 'amber' | 'muted'> = {
  critical: 'amber',
  high: 'amber',
  medium: 'muted',
  low: 'muted',
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: 'P1', high: 'P2', medium: 'P3', low: 'P4',
};

export const TaskRow = memo(function TaskRow({ task, onGenerate }: TaskRowProps) {
  const [, navigate] = useLocation();
  const barColor = TYPE_COLORS[task.type] ?? 'var(--border)';
  const assigneeInitial = task.assignee ? task.assignee[0].toUpperCase() : '?';

  return (
    <div
      data-testid={`task-card-${task.id}`}
      onClick={() => navigate(`/workspace/${task.id}`)}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'background 150ms ease, border-color 150ms ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-raised)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-bright)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
      }}
    >
      {/* Priority bar */}
      <div style={{ width: 3, background: barColor, flexShrink: 0 }} />

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 4, minWidth: 0 }}>
        {/* Row 1: ID + badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginRight: 4 }}>
            {task.externalId ?? `TASK-${task.id}`}
          </span>
          <div style={{ flex: 1 }} />
          <Badge
            label={SOURCE_LABELS[task.source] ?? task.source}
            variant={SOURCE_VARIANT[task.source] ?? 'muted'}
          />
          <Badge
            label={TYPE_LABELS[task.type] ?? task.type}
            variant={TYPE_VARIANTS[task.type] ?? 'muted'}
          />
          <Badge
            label={PRIORITY_LABELS[task.priority] ?? task.priority}
            variant={PRIORITY_VARIANTS[task.priority] ?? 'muted'}
          />
        </div>

        {/* Row 2: Title */}
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
          {task.title}
        </div>

        {/* Row 3: Description */}
        {task.description && (
          <div
            className="dc-task-description"
            style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {task.description}
          </div>
        )}
      </div>

      {/* Right side */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 16, flexShrink: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          width: 28, height: 28,
          borderRadius: '50%',
          background: 'var(--bg-raised)',
          fontSize: 11,
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 500,
          flexShrink: 0,
        }}>
          {assigneeInitial}
        </div>
        <Button
          data-testid={`btn-generate-${task.id}`}
          label="Generate"
          variant="primary"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onGenerate(); }}
        />
      </div>
    </div>
  );
});
