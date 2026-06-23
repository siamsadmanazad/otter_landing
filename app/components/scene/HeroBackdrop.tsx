import Image from "next/image";

/**
 * HeroBackdrop — the bespoke painterly valley as the hero's deep background.
 * Unlike ScenePhoto (heavy grade for stock photos), this preserves the painting:
 * only a soft top vignette (for the navbar/headline legibility) and a gentle
 * bottom fade (to ground Otti + blend into the noir page) are layered on.
 */
export function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src="/scene/hero_bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "center 42%" }}
      />
      {/* Top vignette — keeps the nav + headline readable over the sky. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[45%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,7,13,0.72), rgba(5,7,13,0.25) 60%, transparent)",
        }}
      />
      {/* Bottom fade — grounds Otti and melts the scene into the dark page below. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[40%]"
        style={{
          background:
            "linear-gradient(to top, var(--noir-950) 2%, rgba(5,7,13,0.5) 40%, transparent)",
        }}
      />
      {/* Faint teal signal wash for palette cohesion. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 78%, rgba(13,185,200,0.14), transparent 60%)",
        }}
      />
    </div>
  );
}
