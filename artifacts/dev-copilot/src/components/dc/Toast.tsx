import type { Toast as ToastItem } from './useToast';

interface ToastContainerProps {
  toasts: ToastItem[];
  dismiss: (id: string) => void;
}

export function ToastContainer({ toasts, dismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismiss(t.id)}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderLeft: `4px solid ${t.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            maxWidth: 320,
            fontSize: 13,
            color: 'var(--text-primary)',
            animation: 'dc-slide-in-right 0.25s ease',
            cursor: t.type === 'error' ? 'pointer' : 'default',
            pointerEvents: 'all',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <span style={{
            color: t.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)',
            fontWeight: 600,
            fontSize: 12,
            flexShrink: 0,
            lineHeight: 1.6,
          }}>
            {t.type === 'success' ? '✓' : '✕'}
          </span>
          <span style={{ lineHeight: 1.5, flex: 1 }}>{t.message}</span>
          {t.type === 'error' && (
            <span style={{ color: 'var(--text-muted)', fontSize: 11, flexShrink: 0 }}>click to dismiss</span>
          )}
        </div>
      ))}
    </div>
  );
}
