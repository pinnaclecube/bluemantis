export type BadgeVariant = 'purple' | 'blue' | 'green' | 'red' | 'amber' | 'muted';

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; color: string }> = {
  purple: { bg: 'rgba(139,124,248,0.15)', color: 'var(--accent-purple)' },
  blue:   { bg: 'rgba(77,156,255,0.15)',  color: 'var(--accent-blue)'   },
  green:  { bg: 'rgba(61,214,140,0.15)',  color: 'var(--accent-green)'  },
  red:    { bg: 'rgba(240,101,101,0.15)', color: 'var(--accent-red)'    },
  amber:  { bg: 'rgba(245,166,35,0.15)',  color: 'var(--accent-amber)'  },
  muted:  { bg: 'rgba(85,94,112,0.2)',    color: 'var(--text-muted)'    },
};

export function Badge({ label, variant }: BadgeProps) {
  const { bg, color } = VARIANT_STYLES[variant];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: bg,
      color,
      fontSize: '11px',
      padding: '2px 8px',
      borderRadius: 'var(--radius-sm)',
      fontWeight: 500,
      fontFamily: 'var(--font-sans)',
      lineHeight: 1.6,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}
