/**
 * FoliageFrame — dark, moody foliage that turns the trail + countdown sections
 * into "the trail winding through forest at night". Varied leaf shapes (broad
 * bush leaves, narrow blades, and ferny fronds) in deep shadow with a faint teal
 * moonlit rim, covering the whole lower void edge-to-edge while the centre stays
 * dark enough for the neon + cards to glow. Pure static SVG (rasterised once,
 * ~0 GPU). Desktop-only.
 */

type Kind = "broad" | "pointed" | "blade";
type LeafSpec = { angle: number; len: number; w: number; kind: Kind; shade: string };

function leafPath(kind: Kind, L: number, w: number): string {
  if (kind === "broad") {
    // Rounded, ovate bush leaf with a soft blunt tip (not a sharp point).
    const W = w * 1.7;
    return `M0 0 C ${W} ${-L * 0.12} ${W} ${-L * 0.72} ${W * 0.34} ${-L * 0.94} C ${W * 0.14} ${-L} ${-W * 0.14} ${-L} ${-W * 0.34} ${-L * 0.94} C ${-W} ${-L * 0.72} ${-W} ${-L * 0.12} 0 0 Z`;
  }
  if (kind === "blade") {
    const W = w * 0.55;
    return `M0 0 C ${W} ${-L * 0.34} ${W * 0.5} ${-L * 0.84} 0 ${-L} C ${-W * 0.5} ${-L * 0.84} ${-W} ${-L * 0.34} 0 0 Z`;
  }
  // pointed
  return `M0 0 C ${w} ${-L * 0.28} ${w} ${-L * 0.72} 0 ${-L} C ${-w} ${-L * 0.72} ${-w} ${-L * 0.28} 0 0 Z`;
}

// Four cluster arrangements so repeated clusters don't read identical.
const VARIANTS: LeafSpec[][] = [
  [ // broad bush
    { angle: -54, len: 190, w: 44, kind: "broad", shade: "#070d14" },
    { angle: -30, len: 250, w: 56, kind: "broad", shade: "#0a131d" },
    { angle: -8, len: 300, w: 52, kind: "pointed", shade: "#0b1521" },
    { angle: 16, len: 270, w: 58, kind: "broad", shade: "#0a131d" },
    { angle: 40, len: 220, w: 46, kind: "broad", shade: "#08111a" },
    { angle: 60, len: 160, w: 34, kind: "pointed", shade: "#070c12" },
  ],
  [ // broad-dominant with a few blades for texture
    { angle: -58, len: 200, w: 50, kind: "broad", shade: "#070e15" },
    { angle: -34, len: 260, w: 30, kind: "blade", shade: "#0a131d" },
    { angle: -14, len: 300, w: 58, kind: "broad", shade: "#0b1521" },
    { angle: 8, len: 270, w: 54, kind: "broad", shade: "#0a131d" },
    { angle: 30, len: 240, w: 28, kind: "blade", shade: "#08111a" },
    { angle: 52, len: 200, w: 50, kind: "broad", shade: "#070d14" },
  ],
  [ // tall mixed (broad-leaning)
    { angle: -48, len: 210, w: 48, kind: "broad", shade: "#070d14" },
    { angle: -24, len: 300, w: 36, kind: "pointed", shade: "#0a131d" },
    { angle: -4, len: 350, w: 56, kind: "broad", shade: "#0b1521" },
    { angle: 18, len: 300, w: 50, kind: "broad", shade: "#0a131d" },
    { angle: 42, len: 230, w: 30, kind: "blade", shade: "#08111a" },
  ],
  [ // low wide bush
    { angle: -66, len: 150, w: 48, kind: "broad", shade: "#070c12" },
    { angle: -40, len: 200, w: 54, kind: "broad", shade: "#0a121b" },
    { angle: -16, len: 240, w: 46, kind: "pointed", shade: "#0b1521" },
    { angle: 12, len: 230, w: 56, kind: "broad", shade: "#0a121b" },
    { angle: 38, len: 190, w: 50, kind: "broad", shade: "#08111a" },
    { angle: 62, len: 140, w: 38, kind: "broad", shade: "#070c12" },
  ],
];

export function LeafCluster({ variant = 0 }: { variant?: number }) {
  const leaves = VARIANTS[variant % VARIANTS.length];
  return (
    <svg viewBox="0 0 320 360" className="h-full w-full overflow-visible" preserveAspectRatio="xMidYMax meet">
      <g transform="translate(160 360)">
        {leaves.map((l, i) => (
          <g key={i} transform={`rotate(${l.angle})`}>
            <path d={leafPath(l.kind, l.len, l.w)} fill={l.shade} />
            <path d={`M0 0 L0 ${-l.len}`} stroke="rgba(120,200,205,0.10)" strokeWidth="1" fill="none" />
            <path d={leafPath(l.kind, l.len, l.w)} fill="none" stroke="rgba(52,245,228,0.06)" strokeWidth="1" />
          </g>
        ))}
      </g>
    </svg>
  );
}

// A full-width band of clusters along the bottom so the void is covered
// edge-to-edge (no blank edges). Each slot varies height/variant/mirror.
type Slot = { left: string; w: string; h: string; v: number; flip?: boolean; op: number; blur?: number; bottom?: string };

function band(slots: Slot[]) {
  return slots.map((s, i) => (
    <div
      key={i}
      className={`absolute ${s.flip ? "-scale-x-100" : ""}`}
      style={{ left: s.left, bottom: s.bottom ?? "-2.5rem", width: s.w, height: s.h, opacity: s.op, filter: s.blur ? `blur(${s.blur}px)` : undefined }}
    >
      <LeafCluster variant={s.v} />
    </div>
  ));
}

export function FoliageFrame() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden sm:block">
      {/* faint teal ground glow low-centre */}
      <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "radial-gradient(60% 100% at 50% 100%, rgba(13,185,200,0.06), transparent 70%)" }} />

      {/* Far back row (blurred, dark) — full width */}
      {band([
        { left: "-4%", w: "20vw", h: "26vh", v: 1, op: 0.4, blur: 3 },
        { left: "16%", w: "20vw", h: "30vh", v: 2, op: 0.38, blur: 3 },
        { left: "36%", w: "20vw", h: "24vh", v: 1, op: 0.36, blur: 4, flip: true },
        { left: "56%", w: "20vw", h: "30vh", v: 3, op: 0.38, blur: 3 },
        { left: "76%", w: "20vw", h: "26vh", v: 2, op: 0.4, blur: 3, flip: true },
      ])}

      {/* Near front row — full width, denser at the edges */}
      {band([
        { left: "-8%", w: "26vw", h: "44vh", v: 0, op: 0.92 },
        { left: "12%", w: "22vw", h: "34vh", v: 3, op: 0.7, flip: true },
        { left: "32%", w: "22vw", h: "30vh", v: 1, op: 0.6 },
        { left: "50%", w: "22vw", h: "32vh", v: 2, op: 0.6, flip: true },
        { left: "70%", w: "22vw", h: "36vh", v: 3, op: 0.72 },
        { left: "84%", w: "26vw", h: "44vh", v: 0, op: 0.92, flip: true },
      ])}

      {/* Overhanging sprigs from the top corners */}
      <div className="absolute -top-12 -left-12 h-[26vh] w-[22vw] max-w-[300px] rotate-180 opacity-45"><LeafCluster variant={2} /></div>
      <div className="absolute -top-12 -right-12 h-[26vh] w-[22vw] max-w-[300px] -scale-x-100 rotate-180 opacity-45"><LeafCluster variant={2} /></div>
    </div>
  );
}

/** A denser, taller full-width thicket for the interlude void. */
export function FoliageThicket() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">
      {/* Far row */}
      {band([
        { left: "-2%", w: "20vw", h: "30vh", v: 1, op: 0.42, blur: 3 },
        { left: "18%", w: "22vw", h: "36vh", v: 2, op: 0.4, blur: 4 },
        { left: "40%", w: "20vw", h: "30vh", v: 3, op: 0.4, blur: 3, flip: true },
        { left: "60%", w: "22vw", h: "36vh", v: 1, op: 0.4, blur: 4 },
        { left: "80%", w: "20vw", h: "30vh", v: 2, op: 0.42, blur: 3, flip: true },
      ])}
      {/* Near, dense, taller — overlapping edge-to-edge */}
      {band([
        { left: "-10%", w: "30vw", h: "50vh", v: 0, op: 0.95 },
        { left: "8%", w: "26vw", h: "42vh", v: 3, op: 0.85, flip: true },
        { left: "26%", w: "26vw", h: "46vh", v: 1, op: 0.8 },
        { left: "44%", w: "24vw", h: "40vh", v: 2, op: 0.78, flip: true },
        { left: "60%", w: "26vw", h: "46vh", v: 3, op: 0.82 },
        { left: "80%", w: "30vw", h: "50vh", v: 0, op: 0.95, flip: true },
      ])}
      {/* Centre blades crossing the path */}
      <div className="absolute bottom-0 left-[45%] h-[34vh] w-[14vw] max-w-[180px] rotate-[8deg] opacity-70"><LeafCluster variant={1} /></div>
      <div className="absolute bottom-0 left-[50%] h-[28vh] w-[12vw] max-w-[160px] -rotate-[10deg] opacity-60"><LeafCluster variant={1} /></div>
    </div>
  );
}
