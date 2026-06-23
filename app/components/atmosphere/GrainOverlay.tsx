/**
 * GrainOverlay — a fixed, subtle film-grain + vignette layer over the whole page.
 * Pure CSS/SVG, no JS cost. Sits above the background, below content.
 */
export function GrainOverlay() {
  return (
    <>
      {/* Vignette — darkens the edges for a cinematic frame. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 30%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {/* Grain — a tiled SVG noise, blended softly. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.04] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
        }}
      />
    </>
  );
}
