import { Badge } from '@/components/ui/badge';

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

function label(v?: string) {
  return !v || v === 'none' || v === 'unknown' ? 'Unknown' : v;
}

export function StackBadge({ stackProfile }: StackBadgeProps) {
  if (!stackProfile) {
    return <Badge variant="secondary">Unknown</Badge>;
  }
  return (
    <span className="inline-flex flex-wrap gap-1">
      <Badge variant="secondary">{label(stackProfile.frontend)}</Badge>
      <Badge variant="secondary">{label(stackProfile.backend)}</Badge>
      <Badge variant="secondary">{label(stackProfile.database)}</Badge>
    </span>
  );
}
