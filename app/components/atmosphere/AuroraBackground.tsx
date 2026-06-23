/**
 * AuroraBackground — a fixed, slowly drifting teal→cyan gradient mesh on near-black.
 * The ambient "Otti signal" atmosphere. Pure CSS; respects reduced motion via globals.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-noir-950">
      {/* Teal bloom */}
      <div
        className="absolute -left-[20%] -top-[20%] h-[70vmax] w-[70vmax] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,153,219,0.55), transparent 60%)",
          animation: "aurora-drift 26s ease-in-out infinite",
        }}
      />
      {/* Cyan bloom */}
      <div
        className="absolute -right-[15%] top-[30%] h-[60vmax] w-[60vmax] rounded-full opacity-25 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,240,228,0.45), transparent 60%)",
          animation: "aurora-drift 34s ease-in-out infinite reverse",
        }}
      />
      {/* Deep base wash so blooms never wash out the noir. */}
      <div className="absolute inset-0 bg-gradient-to-b from-noir-950/40 via-noir-950/70 to-noir-950" />
    </div>
  );
}
