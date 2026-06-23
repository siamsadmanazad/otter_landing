/**
 * AuroraBackground — a fixed multi-hue gradient field on a midnight-indigo base:
 * teal + violet + deep-ocean blooms with a warm ember kiss near the horizon. The
 * cinematic atmospheric backdrop. Pure CSS and intentionally STATIC: animating
 * these viewport-sized heavy-blur layers re-rasterized the blur every frame and
 * pegged the GPU for a drift that was barely perceptible. Static = the blur is
 * rasterized once and cached, ~0 ongoing GPU.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-noir-950">
      {/* Teal bloom (cool field) */}
      <div
        className="absolute -left-[18%] -top-[22%] h-[72vmax] w-[72vmax] rounded-full opacity-30 blur-[130px]"
        style={{
          background: "radial-gradient(circle at center, rgba(13,185,200,0.55), transparent 62%)",
        }}
      />
      {/* Violet bloom (depth) */}
      <div
        className="absolute -right-[14%] top-[18%] h-[64vmax] w-[64vmax] rounded-full opacity-25 blur-[140px]"
        style={{
          background: "radial-gradient(circle at center, rgba(109,92,246,0.45), transparent 62%)",
        }}
      />
      {/* Deep-ocean bloom (lower) */}
      <div
        className="absolute bottom-[-20%] left-[20%] h-[60vmax] w-[60vmax] rounded-full opacity-30 blur-[140px]"
        style={{
          background: "radial-gradient(circle at center, rgba(18,58,107,0.6), transparent 60%)",
        }}
      />
      {/* Warm ember kiss — the cinematic counterpoint, low + subtle. */}
      <div
        className="absolute bottom-[-30%] right-[10%] h-[40vmax] w-[40vmax] rounded-full opacity-[0.12] blur-[120px]"
        style={{
          background: "radial-gradient(circle at center, rgba(255,122,69,0.7), transparent 65%)",
        }}
      />
      {/* Vertical base wash so blooms never overpower the noir. */}
      <div className="absolute inset-0 bg-gradient-to-b from-noir-950/30 via-noir-950/55 to-noir-950" />
    </div>
  );
}
