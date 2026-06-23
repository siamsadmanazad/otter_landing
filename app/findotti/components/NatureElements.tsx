/**
 * NatureElements — a kit of premium, on-palette (deep shadow + faint teal
 * moonlit rim) SVG nature pieces for the findotti forest-floor scenes: ferns,
 * reeds/cattails, bioluminescent mushrooms, grass tufts, pebbles and lily pads.
 * All static (rasterised once, ~0 GPU). Each draws from a baseline at the bottom
 * of its box so it "grows" up from the ground.
 */

const RIM = "rgba(52,245,228,0.10)";
const RIB = "rgba(120,200,205,0.10)";

/* ── Fern frond — a curving rachis with paired pinnae (the botanical hero) ── */
export function Fern({ shade = "#0a131d" }: { shade?: string }) {
  // 11 leaflets each side, shrinking toward the curled tip.
  const pinnae = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10;
    const y = -40 - t * 300; // up the stem
    const len = 60 * (1 - t * 0.78);
    const droop = 14 + t * 10;
    return { y, len, droop };
  });
  return (
    <svg viewBox="0 0 220 360" className="h-full w-full overflow-visible" preserveAspectRatio="xMidYMax meet">
      <g transform="translate(110 360)">
        {/* curved rachis */}
        <path d="M0 0 C -6 -120, 14 -240, 36 -330" fill="none" stroke={shade} strokeWidth="4" strokeLinecap="round" />
        <path d="M0 0 C -6 -120, 14 -240, 36 -330" fill="none" stroke={RIB} strokeWidth="1" />
        {pinnae.map((p, i) => {
          // follow the rachis x-curve roughly
          const cx = -6 * (1 - Math.abs(p.y) / 330) + 36 * (Math.abs(p.y) / 330);
          return (
            <g key={i} transform={`translate(${cx} ${p.y})`}>
              <path d={`M0 0 Q ${p.len * 0.6} ${-p.droop} ${p.len} ${-p.droop * 0.4}`} fill="none" stroke={shade} strokeWidth="3" strokeLinecap="round" />
              <path d={`M0 0 Q ${-p.len * 0.6} ${-p.droop} ${-p.len} ${-p.droop * 0.4}`} fill="none" stroke={shade} strokeWidth="3" strokeLinecap="round" />
              <path d={`M0 0 Q ${p.len * 0.6} ${-p.droop} ${p.len} ${-p.droop * 0.4}`} fill="none" stroke={RIM} strokeWidth="0.75" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ── Reeds / cattails — pond grass with a couple of seed heads ───────────── */
export function Reeds({ shade = "#0a131d" }: { shade?: string }) {
  const blades = [
    { x: -34, h: 240, c: 16 }, { x: -18, h: 320, c: -12 }, { x: -4, h: 290, c: 8 },
    { x: 10, h: 350, c: -10 }, { x: 24, h: 270, c: 14 }, { x: 38, h: 220, c: -8 },
  ];
  return (
    <svg viewBox="0 0 120 360" className="h-full w-full overflow-visible" preserveAspectRatio="xMidYMax meet">
      <g transform="translate(60 360)">
        {blades.map((b, i) => (
          <g key={i}>
            <path d={`M${b.x} 0 Q ${b.x + b.c} ${-b.h * 0.6} ${b.x + b.c * 1.6} ${-b.h}`} fill="none" stroke={shade} strokeWidth="3.4" strokeLinecap="round" />
            <path d={`M${b.x} 0 Q ${b.x + b.c} ${-b.h * 0.6} ${b.x + b.c * 1.6} ${-b.h}`} fill="none" stroke={RIM} strokeWidth="0.8" />
          </g>
        ))}
        {/* two cattail seed-heads */}
        <g transform={`translate(${-18 - 12} ${-320})`}>
          <rect x="-4" y="-46" width="8" height="46" rx="4" fill={shade} />
          <rect x="-4" y="-46" width="8" height="46" rx="4" fill="none" stroke={RIM} strokeWidth="0.8" />
        </g>
        <g transform={`translate(${10 - 10} ${-350})`}>
          <rect x="-4" y="-44" width="8" height="44" rx="4" fill={shade} />
          <rect x="-4" y="-44" width="8" height="44" rx="4" fill="none" stroke={RIM} strokeWidth="0.8" />
        </g>
      </g>
    </svg>
  );
}

/* ── Bioluminescent mushroom cluster — the magic accent (glows teal) ─────── */
export function Mushrooms({ glow = true }: { glow?: boolean }) {
  const caps = [
    { x: -22, y: 0, h: 34, r: 16, o: 0.9 },
    { x: 4, y: 6, h: 50, r: 22, o: 1 },
    { x: 30, y: 2, h: 28, r: 13, o: 0.85 },
  ];
  return (
    <svg viewBox="0 0 100 120" className="h-full w-full overflow-visible" preserveAspectRatio="xMidYMax meet">
      <g transform="translate(50 116)">
        {caps.map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${c.y})`} opacity={c.o}>
            {/* stem */}
            <path d={`M-3 0 C -4 ${-c.h * 0.7} 3 ${-c.h * 0.7} 3 0 Z`} fill="#0c1620" />
            {/* glow under cap */}
            {glow && <ellipse cx="0" cy={-c.h} rx={c.r * 1.3} ry={c.r * 0.7} fill="rgba(52,245,228,0.16)" />}
            {/* cap */}
            <path d={`M${-c.r} ${-c.h} a ${c.r} ${c.r * 0.82} 0 0 1 ${c.r * 2} 0 Z`} fill="#10303a" />
            <path d={`M${-c.r} ${-c.h} a ${c.r} ${c.r * 0.82} 0 0 1 ${c.r * 2} 0`} fill="none" stroke="rgba(52,245,228,0.5)" strokeWidth="1.1" />
            {/* a few glowing spots */}
            <circle cx={-c.r * 0.3} cy={-c.h - c.r * 0.2} r="1.6" fill="rgba(190,255,250,0.8)" />
            <circle cx={c.r * 0.35} cy={-c.h - c.r * 0.1} r="1.3" fill="rgba(190,255,250,0.7)" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ── Grass tuft — fine blades fanning from a point ──────────────────────── */
export function Grass({ shade = "#0a131d" }: { shade?: string }) {
  const blades = [-44, -30, -16, -4, 8, 22, 38, 52];
  return (
    <svg viewBox="0 0 120 140" className="h-full w-full overflow-visible" preserveAspectRatio="xMidYMax meet">
      <g transform="translate(60 138)">
        {blades.map((a, i) => {
          const h = 80 + (i % 3) * 26;
          return (
            <g key={i}>
              <path d={`M0 0 Q ${a * 0.5} ${-h * 0.7} ${a} ${-h}`} fill="none" stroke={shade} strokeWidth="2.4" strokeLinecap="round" />
              <path d={`M0 0 Q ${a * 0.5} ${-h * 0.7} ${a} ${-h}`} fill="none" stroke={RIM} strokeWidth="0.6" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ── Pebble scatter — small stones grounding the forest floor ───────────── */
export function Pebbles() {
  const stones = [
    { x: 12, y: 70, rx: 18, ry: 9 },
    { x: 46, y: 80, rx: 12, ry: 7 },
    { x: 74, y: 72, rx: 22, ry: 11 },
    { x: 100, y: 82, rx: 10, ry: 6 },
  ];
  return (
    <svg viewBox="0 0 120 100" className="h-full w-full overflow-visible" preserveAspectRatio="xMidYMax meet">
      {stones.map((s, i) => (
        <g key={i}>
          <ellipse cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} fill="#0b1018" />
          <ellipse cx={s.x} cy={s.y - s.ry * 0.4} rx={s.rx * 0.8} ry={s.ry * 0.5} fill="rgba(120,200,205,0.07)" />
        </g>
      ))}
    </svg>
  );
}

/* ── Lily pad — a notched disc seen near-flat on water ──────────────────── */
export function LilyPad({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 60" className={className} style={style} preserveAspectRatio="none">
      <path d="M50 4 A 46 26 0 1 1 44 4 L50 30 Z" fill="#0b1a1c" />
      <path d="M50 4 A 46 26 0 1 1 44 4 L50 30 Z" fill="none" stroke="rgba(52,245,228,0.18)" strokeWidth="1" />
      <ellipse cx="50" cy="30" rx="30" ry="15" fill="rgba(120,200,205,0.05)" />
    </svg>
  );
}
