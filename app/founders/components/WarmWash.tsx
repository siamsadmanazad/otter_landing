/**
 * WarmWash — a fixed warm gradient overlay layered over the global cool
 * atmosphere on /founders, shifting Act 2's color temperature toward sunset
 * gold/peach (the "treasure / belonging" warmth). Pure CSS, behind content.
 */
export function WarmWash() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 18%, rgba(255,140,70,0.18), transparent 60%), radial-gradient(60% 50% at 80% 90%, rgba(255,181,158,0.12), transparent 60%)",
        }}
      />
    </div>
  );
}
