import { useState, forwardRef, useImperativeHandle, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

export interface ButtonRef {
  triggerSuccess: () => void;
}

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  'data-testid'?: string;
}

type BtnState = 'default' | 'success';

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: 'var(--accent-blue)', color: '#0D0F12', border: 'none' },
  outline: { background: 'transparent', border: '1px solid var(--border-bright)', color: 'var(--text-primary)' },
  ghost:   { background: 'transparent', border: 'none', color: 'var(--text-secondary)' },
  danger:  { background: 'rgba(240,101,101,0.15)', color: 'var(--accent-red)', border: '1px solid var(--accent-red)' },
};
const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '12px' },
  md: { padding: '8px 16px', fontSize: '13px' },
};

function SpinnerSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'dc-spin 0.8s linear infinite', flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5.5" stroke="var(--accent-blue)" strokeWidth="2" strokeDasharray="60 20" strokeLinecap="round" />
    </svg>
  );
}

function CheckSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 7L5.5 10.5L12 4" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const Button = forwardRef<ButtonRef, ButtonProps>(function Button(
  { label, onClick, variant = 'primary', size = 'md', disabled, loading, icon, style, type = 'button', 'data-testid': testId },
  ref,
) {
  const [btnState, setBtnState] = useState<BtnState>('default');
  const [pressed, setPressed] = useState(false);

  useImperativeHandle(ref, () => ({
    triggerSuccess() {
      setBtnState('success');
      setTimeout(() => setBtnState('default'), 2000);
    },
  }));

  const isDisabled = disabled || loading;

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 'var(--radius-md)',
    fontWeight: 500,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.4 : 1,
    transition: 'background 150ms ease, transform 80ms ease',
    transform: pressed ? 'scale(0.97)' : 'scale(1)',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    userSelect: 'none',
    ...VARIANT_STYLES[variant],
    ...SIZE_STYLES[size],
    ...style,
  };

  const leadIcon = loading ? <SpinnerSvg /> : btnState === 'success' ? <CheckSvg /> : icon;

  return (
    <button
      type={type}
      data-testid={testId}
      style={baseStyle}
      disabled={isDisabled}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onFocus={(e) => { (e.currentTarget as HTMLButtonElement).style.outline = '2px solid var(--accent-blue)'; (e.currentTarget as HTMLButtonElement).style.outlineOffset = '2px'; }}
      onBlur={(e) => { (e.currentTarget as HTMLButtonElement).style.outline = 'none'; }}
    >
      {leadIcon}
      {label}
    </button>
  );
});
