interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 'var(--radius-sm)' }: SkeletonProps) {
  return (
    <>
      <style>{`
        @keyframes _dc_pulse {
          0%,100% { background: var(--bg-raised); }
          50% { background: var(--border); }
        }
      `}</style>
      <div style={{
        width,
        height,
        borderRadius,
        animation: '_dc_pulse 1.4s ease-in-out infinite',
        display: 'block',
      }} />
    </>
  );
}
