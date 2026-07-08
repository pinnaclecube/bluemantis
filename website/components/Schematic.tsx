/**
 * Orchestration schematic (spec §6.1, signature section).
 * Left: tickets, unchanged. Center: orchestrator dispatching four specialists.
 * Right: a pull request awaiting human review (stroked in --text; machine side
 * is blue, human side is grey).
 *
 * Desktop: a single SVG drafting-table diagram with work-token dots that travel
 * left → center → specialists → right, turning grey as they cross into review.
 * Mobile: the same flow reflows to a legible vertical stack.
 * Both are decorative; one aria-label on the <figure> describes the whole flow.
 * Renders complete with motion disabled (tokens freeze via CSS).
 */

const SPECIALISTS = [
  { name: 'Builder', y: 96 },
  { name: 'Reviewer', y: 168 },
  { name: 'Security', y: 240 },
  { name: 'QA', y: 312 },
];

const TICKETS = ['ENG-2417', 'ENG-2418', 'ENG-2419'];

// connector paths (viewBox 0 0 1000 380)
const TICKET_WIRES = [
  'M194 96 C 270 96, 290 190, 350 190',
  'M194 168 C 280 168, 300 190, 350 190',
  'M194 240 C 270 240, 300 190, 350 190',
];
const SPEC_WIRES_IN = SPECIALISTS.map(
  (s) => `M500 190 C 560 190, 575 ${s.y + 22}, 630 ${s.y + 22}`,
);
const SPEC_WIRES_OUT = SPECIALISTS.map(
  (s) => `M780 ${s.y + 22} C 812 ${s.y + 22}, 818 190, 826 190`,
);

// full token journeys: ticket center -> orchestrator -> specialist (machine, blue)
const JOURNEY_MACHINE = [
  'M119 96 C 260 96, 300 190, 425 190 S 590 118, 705 118',
  'M119 240 C 260 240, 300 190, 425 190 S 590 262, 705 262',
];
// specialist -> PR (review, grey)
const JOURNEY_REVIEW = [
  'M705 118 C 800 118, 850 190, 901 190',
  'M705 262 C 800 262, 850 190, 901 190',
];

function Node({
  x,
  y,
  w,
  h,
  variant = 'default',
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  variant?: 'default' | 'machine' | 'human';
  children: React.ReactNode;
}) {
  const cls = variant === 'machine' ? 'node node-machine' : variant === 'human' ? 'node node-human' : 'node';
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7} className={cls} />
      {children}
    </g>
  );
}

export default function Schematic({ captions }: { captions?: [string, string, string] }) {
  return (
    <figure
      className="schematic"
      role="img"
      aria-label="Tickets enter unchanged on the left. A central orchestrator dispatches Builder, Reviewer, Security, and QA agents that work the change concurrently. A finished pull request awaits human review on the right, unchanged."
    >
      {/* Desktop diagram */}
      <div className="sch-desktop" aria-hidden="true">
        <svg viewBox="0 0 1000 380" width="100%" preserveAspectRatio="xMidYMid meet">
          {/* zone labels */}
          <text x="44" y="28" className="zone-label">TICKETS, UNCHANGED</text>
          <text x="350" y="28" className="zone-label">ENGINEERING, HANDLED</text>
          <text x="826" y="28" className="zone-label">REVIEW, UNCHANGED</text>

          {/* wires */}
          <g>
            {TICKET_WIRES.map((d, i) => <path key={`tw${i}`} d={d} className="path" />)}
            {SPEC_WIRES_IN.map((d, i) => <path key={`si${i}`} d={d} className="path" />)}
            {SPEC_WIRES_OUT.map((d, i) => <path key={`so${i}`} d={d} className="path" />)}
            {/* faint blue highlight on the two active journeys */}
            {JOURNEY_MACHINE.map((d, i) => <path key={`jm${i}`} d={d} className="path-active" />)}
          </g>

          {/* ticket nodes */}
          {TICKETS.map((id, i) => (
            <Node key={id} x={44} y={74 + i * 72} w={150} h={44}>
              <text x={62} y={101 + i * 72} className="node-text mono">{id}</text>
            </Node>
          ))}

          {/* orchestrator */}
          <Node x={350} y={158} w={150} h={64} variant="machine">
            <text x={425} y={186} textAnchor="middle" className="node-text">Orchestrator</text>
            <text x={425} y={204} textAnchor="middle" className="node-text mono" style={{ fontSize: 11 }}>reads intent</text>
          </Node>

          {/* specialists */}
          {SPECIALISTS.map((s) => (
            <Node key={s.name} x={630} y={s.y} w={150} h={44} variant="machine">
              <text x={705} y={s.y + 28} textAnchor="middle" className="node-text">{s.name}</text>
            </Node>
          ))}

          {/* PR node (human) */}
          <Node x={826} y={158} w={150} h={64} variant="human">
            <text x={901} y={186} textAnchor="middle" className="node-text">PR #142</text>
            <text x={901} y={204} textAnchor="middle" className="node-text mono" style={{ fontSize: 11 }}>awaiting review</text>
          </Node>

          {/* work tokens */}
          {JOURNEY_MACHINE.map((d, i) => (
            <circle
              key={`tokm${i}`}
              r={4}
              cx={0}
              cy={0}
              className="token token-blue token-anim"
              style={{ offsetPath: `path("${d}")`, animationDuration: '5.5s', animationDelay: `${i * 1.4}s` }}
            />
          ))}
          {JOURNEY_REVIEW.map((d, i) => (
            <circle
              key={`tokr${i}`}
              r={4}
              cx={0}
              cy={0}
              className="token token-grey token-anim"
              style={{ offsetPath: `path("${d}")`, animationDuration: '3.4s', animationDelay: `${5.5 + i * 1.4}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Mobile stacked flow */}
      <div className="sch-mobile" aria-hidden="true">
        <div className="sch-stack">
          <span className="mono-label">Tickets, unchanged</span>
          <div className="sch-chips">
            {TICKETS.map((id) => <span key={id} className="sch-chip mono">{id}</span>)}
          </div>
          <span className="sch-arrow" />
          <span className="mono-label">Engineering, handled</span>
          <div className="sch-chip sch-chip-machine">Orchestrator</div>
          <div className="sch-chips">
            {SPECIALISTS.map((s) => <span key={s.name} className="sch-chip sch-chip-machine">{s.name}</span>)}
          </div>
          <span className="sch-arrow" />
          <span className="mono-label">Review, unchanged</span>
          <div className="sch-chip sch-chip-human">PR #142 · awaiting review</div>
        </div>
      </div>

      {captions && (
        <div className="schematic-caption-row" aria-hidden="false">
          <p>{captions[0]}</p>
          <p>{captions[1]}</p>
          <p>{captions[2]}</p>
        </div>
      )}
    </figure>
  );
}
