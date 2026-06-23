/**
 * CloudLayer — soft volumetric fog/cloud blobs that add the cinematic
 * atmospheric haze between the aurora and the content. Fixed, behind everything.
 *
 * Intentionally STATIC (no drift animation, no cursor parallax): these are large
 * heavy-blur layers, and animating them re-rasterized the blur every frame and
 * kept the compositor busy at the display refresh rate for motion that was
 * barely visible at 8–14% opacity. Static = rasterized once, cached, ~0 GPU.
 */
type Cloud = {
  top: string;
  size: number; // vmax
  hue: string;
  opacity: number;
  shift: string; // static horizontal offset from center
};

const CLOUDS: Cloud[] = [
  { top: "8%", size: 70, hue: "13,185,200", opacity: 0.1, shift: "-6%" },
  { top: "34%", size: 90, hue: "109,92,246", opacity: 0.08, shift: "8%" },
  { top: "58%", size: 80, hue: "18,58,107", opacity: 0.14, shift: "-4%" },
  { top: "76%", size: 65, hue: "0,153,219", opacity: 0.09, shift: "6%" },
];

export function CloudLayer() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="absolute left-1/2"
          style={{
            top: c.top,
            width: `${c.size}vmax`,
            height: `${c.size * 0.55}vmax`,
            opacity: c.opacity,
            transform: `translateX(calc(-50% + ${c.shift}))`,
            background: `radial-gradient(50% 50% at 50% 50%, rgba(${c.hue},1), transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
      ))}
    </div>
  );
}
