/**
 * FoliageFrame — dark, moody leaf silhouettes that frame the edges of the
 * evidence-trail section (the trail winding through forest at night). Deep
 * shadowed bush/frond shapes hug the corners with a faint teal moonlit rim, so
 * the section gains depth and ties to the hero valley WITHOUT hurting the
 * neon-on-dark contrast — the centre stays clear for the trail + cards to glow.
 * Pure static SVG (rasterised once, ~0 GPU). Hidden on small screens.
 */

type Leaf = { angle: number; len: number; width: number; shade: string };

// One bush cluster: leaves fanning up from a base point, varied length/angle.
const CLUSTER: Leaf[] = [
  { angle: -52, len: 210, width: 40, shade: "#070c12" },
  { angle: -34, len: 280, width: 52, shade: "#0a121b" },
  { angle: -14, len: 330, width: 46, shade: "#0b1420" },
  { angle: 6, len: 300, width: 54, shade: "#0a121b" },
  { angle: 26, len: 250, width: 48, shade: "#08111a" },
  { angle: 46, len: 200, width: 38, shade: "#070d14" },
  { angle: 64, len: 150, width: 30, shade: "#060a10" },
];

function leafPath(len: number, w: number): string {
  // Pointed leaf rising from the origin (0,0) straight up to (0,-len).
  return `M0 0 C ${w} ${-len * 0.28} ${w} ${-len * 0.72} 0 ${-len} C ${-w} ${-len * 0.72} ${-w} ${-len * 0.28} 0 0 Z`;
}

function LeafCluster() {
  // Drawn in a 320×360 box, base at the bottom-centre (160, 360).
  return (
    <svg viewBox="0 0 320 360" className="h-full w-full overflow-visible" preserveAspectRatio="xMidYMax meet">
      <g transform="translate(160 360)">
        {CLUSTER.map((l, i) => (
          <g key={i} transform={`rotate(${l.angle})`}>
            <path d={leafPath(l.len, l.width)} fill={l.shade} />
            {/* midrib + faint moonlit rim so the silhouette reads against dark */}
            <path d={`M0 0 L0 ${-l.len}`} stroke="rgba(120,200,205,0.10)" strokeWidth="1" fill="none" />
            <path d={leafPath(l.len, l.width)} fill="none" stroke="rgba(52,245,228,0.06)" strokeWidth="1" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function FoliageFrame() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden sm:block">
      {/* Faint teal ground glow low-centre — ties the foliage to the trail light. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: "radial-gradient(60% 100% at 50% 100%, rgba(13,185,200,0.06), transparent 70%)" }}
      />

      {/* Bottom-left bush (large, near) */}
      <div className="absolute -bottom-10 -left-16 h-[46vh] w-[34vw] max-w-[460px] opacity-80">
        <LeafCluster />
      </div>
      {/* Bottom-right bush (large, near, mirrored) */}
      <div className="absolute -bottom-10 -right-16 h-[46vh] w-[34vw] max-w-[460px] -scale-x-100 opacity-80">
        <LeafCluster />
      </div>

      {/* Far back bushes — darker, blurred, lower: depth behind the near ones. */}
      <div className="absolute -bottom-6 left-[12%] h-[30vh] w-[22vw] max-w-[300px] opacity-50 blur-[3px]">
        <LeafCluster />
      </div>
      <div className="absolute -bottom-6 right-[12%] h-[30vh] w-[22vw] max-w-[300px] -scale-x-100 opacity-50 blur-[3px]">
        <LeafCluster />
      </div>

      {/* Overhanging sprigs from the top corners (branches reaching in). */}
      <div className="absolute -top-12 -left-12 h-[26vh] w-[22vw] max-w-[300px] rotate-180 opacity-45">
        <LeafCluster />
      </div>
      <div className="absolute -top-12 -right-12 h-[26vh] w-[22vw] max-w-[300px] -scale-x-100 rotate-180 opacity-45">
        <LeafCluster />
      </div>

      {/* Side sprigs leaning in mid-section so the tall middle isn't bare. */}
      <div className="absolute top-[40%] -left-20 h-[24vh] w-[18vw] max-w-[240px] rotate-[68deg] opacity-40 blur-[1px]">
        <LeafCluster />
      </div>
      <div className="absolute top-[52%] -right-20 h-[24vh] w-[18vw] max-w-[240px] -rotate-[68deg] opacity-40 blur-[1px]">
        <LeafCluster />
      </div>
    </div>
  );
}
