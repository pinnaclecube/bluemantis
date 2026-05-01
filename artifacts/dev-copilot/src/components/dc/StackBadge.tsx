import { Badge } from './Badge';

export interface StackProfile {
  frontend: string;
  backend: string;
  database: string;
  language?: string;
  testFramework?: string;
  packageManager?: string;
}

interface StackBadgeProps {
  stackProfile: StackProfile | null;
}

function none(v?: string) {
  return !v || v === 'none' || v === 'unknown';
}

export function StackBadge({ stackProfile }: StackBadgeProps) {
  if (!stackProfile) {
    return (
      <span style={{ display: 'inline-flex', gap: 4 }}>
        <Badge label="Unknown" variant="muted" />
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
      <Badge label={none(stackProfile.frontend) ? 'Unknown' : stackProfile.frontend} variant="blue" />
      <Badge label={none(stackProfile.backend) ? 'Unknown' : stackProfile.backend} variant="purple" />
      <Badge label={none(stackProfile.database) ? 'Unknown' : stackProfile.database} variant="muted" />
    </span>
  );
}
