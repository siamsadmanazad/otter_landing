import Image from "next/image";
import { ASSETS } from "@/lib/assets";

/**
 * CampBackdrop — the painterly twilight camp (scene_founders.png) as the hero's
 * deep background, staged exactly like /findotti's HeroBackdrop so the two acts
 * feel like one film. Preserves the painting (no heavy grade): a top vignette for
 * headline legibility, a bottom fade that grounds Otti + melts into the dark page,
 * and a warm campfire glow low-right (where the fire/tents sit) that the invite
 * lantern answers. Graceful tone wash if the art slot is still empty.
 */
export function CampBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {ASSETS.foundersBg && (
        <Image
          src={ASSETS.foundersBg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 56%" }}
        />
      )}

      {/* Top vignette — keeps the nav + headline crisp over the dusk sky. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[48%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,6,17,0.78), rgba(7,6,17,0.30) 60%, transparent)",
        }}
      />
      {/* Bottom fade — grounds Otti and melts the camp into the page below. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          background:
            "linear-gradient(to top, var(--noir-950) 2%, rgba(7,6,17,0.5) 40%, transparent)",
        }}
      />
      {/* Warm campfire glow low-right — the heart of the camp; the lantern echoes it. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(40% 32% at 74% 60%, rgba(255,138,66,0.22), transparent 62%)",
        }}
      />
      {/* Twilight purple wash up top for palette cohesion with the act's tone. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(80% 55% at 50% 6%, rgba(109,92,246,0.18), transparent 60%)",
        }}
      />
    </div>
  );
}
