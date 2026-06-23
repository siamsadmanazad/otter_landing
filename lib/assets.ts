/**
 * Asset registry — the single place that maps story slots to art files.
 *
 * `undefined` = not generated yet (components render a graceful fallback: a tone
 * gradient for scenes, nothing for Otti poses). When a file is dropped in, flip
 * its value here to the public path — that's the ONLY code change needed to light
 * up a new scene/character across the page.
 *
 * Slots & prompts are defined in landingUI.md §11 (the storyboard).
 */
export const ASSETS = {
  // ACT 1 — golden dusk (live)
  heroBg: "/scene/hero_bg.png",
  ottiHero: "/otti/otti_hero.png",

  // ACT 2 — deep twilight (slots awaiting art)
  foundersBg: "/scene/scene_founders.png" as string | undefined,
  ottiInvite: undefined as string | undefined, // → "/otti/otti_invite.png"

  // ACT 3 — starlit night (slots awaiting art)
  summitBg: undefined as string | undefined, // → "/scene/scene_summit.png"
  ottiCelebrate: undefined as string | undefined, // → "/otti/otti_celebrate.png"
} as const;
