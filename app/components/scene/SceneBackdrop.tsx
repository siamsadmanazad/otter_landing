import Image from "next/image";

/**
 * SceneBackdrop — gives any section a tone-graded "world" so the page is one
 * continuous cinematic environment instead of bare dark sections. Renders a rich
 * atmospheric gradient for the act's TONE (the time-of-day progression dusk →
 * twilight → night), an optional painterly IMAGE slot on top (graceful when the
 * art doesn't exist yet), and soft top/bottom edge-blends so scenes melt into one
 * another. Absolute; place as the first child of a `relative` section.
 */
type Tone = "dusk" | "twilight" | "night";

const TONE_BG: Record<Tone, string> = {
  // Golden dusk — warm horizon over a cool valley.
  dusk: "radial-gradient(120% 90% at 50% 8%, rgba(255,140,70,0.16), transparent 55%), radial-gradient(90% 70% at 80% 95%, rgba(109,92,246,0.16), transparent 60%), linear-gradient(to bottom, #0a0c16, #06070d)",
  // Deep twilight — purple/indigo with a warm ember camp glow low.
  twilight:
    "radial-gradient(100% 80% at 50% 0%, rgba(74,45,143,0.32), transparent 55%), radial-gradient(80% 60% at 50% 100%, rgba(255,122,69,0.16), transparent 60%), linear-gradient(to bottom, #0b0a1a, #070611)",
  // Starlit night — deep indigo, teal aurora, faint gold.
  night:
    "radial-gradient(110% 80% at 50% 0%, rgba(18,58,107,0.4), transparent 60%), radial-gradient(70% 50% at 50% 92%, rgba(13,185,200,0.14), transparent 60%), linear-gradient(to bottom, #060814, #04050c)",
};

export function SceneBackdrop({
  tone = "dusk",
  image,
  priority = false,
  imagePosition = "center",
  blendTop = true,
  blendBottom = true,
  fixed = false,
}: {
  tone?: Tone;
  image?: string;
  priority?: boolean;
  imagePosition?: string;
  blendTop?: boolean;
  blendBottom?: boolean;
  /** Page-level continuous world (fixed inset-0) vs. per-section (absolute). */
  fixed?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none overflow-hidden ${
        fixed ? "fixed inset-0 z-0" : "absolute inset-0"
      }`}
    >
      {/* Tone gradient — the always-present world wash. */}
      <div className="absolute inset-0" style={{ background: TONE_BG[tone] }} />

      {/* Optional painterly scene image (drops in when generated). */}
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover opacity-90"
            style={{ objectPosition: imagePosition }}
          />
          {/* Cinematic legibility grade — darkens the edges + lower frame and
              adds a soft vignette so foreground text always reads over the busy
              painterly scene (without dulling the sky's focal beauty up top). */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(5,7,13,0.92) 0%, rgba(5,7,13,0.62) 20%, rgba(5,7,13,0.14) 44%, transparent 64%), radial-gradient(135% 85% at 50% 32%, transparent 52%, rgba(5,7,13,0.58) 100%)",
            }}
          />
          {/* Subtle teal pool low — ties to the aurora/compass glow. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 45% at 50% 82%, rgba(13,185,200,0.10), transparent 62%)",
            }}
          />
        </div>
      )}

      {/* Edge blends so adjacent scenes bleed into each other (no hard cut). */}
      {blendTop && (
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{ background: "linear-gradient(to bottom, var(--noir-950), transparent)" }}
        />
      )}
      {blendBottom && (
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(to top, var(--noir-950), transparent)" }}
        />
      )}
    </div>
  );
}
