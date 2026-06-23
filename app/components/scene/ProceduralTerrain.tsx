/**
 * Procedural terrain slots — placeholder artwork for the cinematic scene until
 * illustrated WebP/AVIF layers are supplied. Each is a pure SVG silhouette tuned
 * to the Twilight palette. Drop real art into the matching <SceneLayer> later.
 */

/** Far mountain range — cool misty silhouette near the horizon. */
export function FarRange() {
  return (
    <svg
      className="absolute bottom-0 w-full"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 240 L160 170 L320 220 L520 120 L700 210 L900 140 L1100 215 L1280 160 L1440 220 L1440 320 L0 320 Z"
        fill="rgba(90,120,184,0.18)"
      />
    </svg>
  );
}

/** Midground ridge — deeper, slightly warmer. */
export function MidRidge() {
  return (
    <svg
      className="absolute bottom-0 w-full"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 300 L220 220 L430 280 L640 200 L860 280 L1080 210 L1280 280 L1440 240 L1440 320 L0 320 Z"
        fill="rgba(74,45,143,0.30)"
      />
    </svg>
  );
}

/** Foreground silhouette — the closest, darkest band the viewer stands behind. */
export function ForegroundRidge() {
  return (
    <svg
      className="absolute bottom-0 w-full"
      viewBox="0 0 1440 240"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 240 L0 150 C 240 110, 420 190, 720 150 C 1020 110, 1220 200, 1440 150 L1440 240 Z"
        fill="rgba(5,7,13,0.92)"
      />
    </svg>
  );
}

/** Light rays fanning from above — soft volumetric god-rays. */
export function LightRays() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 h-[70%] opacity-[0.10]"
      style={{
        background:
          "conic-gradient(from 200deg at 50% -10%, transparent 0deg, rgba(255,181,158,0.8) 12deg, transparent 24deg, transparent 36deg, rgba(13,185,200,0.7) 48deg, transparent 60deg)",
        maskImage: "linear-gradient(to bottom, black, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
      }}
    />
  );
}
