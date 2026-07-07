import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'Blue Mantis, autonomous AI engineering agents that ship reviewed pull requests';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Static OG image (spec §7): wordmark + H1 in the design system's black/grey/blue.
// Design-system OKLCH tokens are converted to sRGB hex here because the OG
// renderer does not support oklch(). No screenshots, no fourth hue.
const BG = '#1e2127'; // --bg
const LINE = '#3b3f46'; // --line
const TEXT = '#e3e5ea'; // --text
const DIM = '#a1a6b0'; // --text-dim
const BLUE = '#3d7bf5'; // --blue

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          padding: '72px 80px',
          border: `1px solid ${LINE}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', color: TEXT, fontSize: 34, fontWeight: 600 }}>
          Blue Mantis
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: TEXT, fontSize: 62, lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 980 }}>
            Your teams work exactly as they do today. The engineering just gets done faster.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 40 }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: BLUE }} />
            <div style={{ color: DIM, fontSize: 26 }}>A Venakan Info Solutions product</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
