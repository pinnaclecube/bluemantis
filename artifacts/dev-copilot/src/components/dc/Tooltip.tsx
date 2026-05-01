import type { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }} className="dc-tooltip-wrap">
      <style>{`
        .dc-tooltip-wrap .dc-tooltip-tip {
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
          transition: opacity 120ms ease;
        }
        .dc-tooltip-wrap:hover .dc-tooltip-tip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
      {children}
      <span
        className="dc-tooltip-tip"
        style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-raised)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          fontSize: 12,
          padding: '4px 8px',
          borderRadius: 'var(--radius-sm)',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {content}
      </span>
    </span>
  );
}
