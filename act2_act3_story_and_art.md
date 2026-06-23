# Act 2 & Act 3 — Storytelling + Image Generation Brief

> Companion to `landingUI.md` §11 (storyboard) and `lib/assets.ts` (slots).
> **Goal of this doc:** finish the narrative copy for Act 2 (`/founders`) and Act 3
> (`/welcome`), and give copy-paste, style-locked prompts for the 4 outstanding art
> slots. Workflow: generate via GPT image model → drop the file in `public/…` →
> flip the one line in `lib/assets.ts`. Zero other code change lights the scene up.

---

## 0. Style bible (so every act looks like one world)

Derived from the shipped Act 1 art (`scene/hero_bg.png`, `otti/otti_hero.png`).

**World style anchor** (paste at the top of every SCENE prompt):
> Painterly, semi-realistic digital fantasy illustration; cinematic atmospheric
> river valley; layered misty mountains receding into haze; lush pine forest on both
> flanks; a winding turquoise river with gentle rapids; a flat-topped mossy hero rock
> in the foreground; soft volumetric god-rays; floating golden fireflies; rich,
> saturated concept-art color grade; high detail; depth-of-field haze; 3:2 landscape.

**Otti character anchor** (paste at the top of every OTTI prompt — keeps him identical):
> Otti — a friendly semi-realistic painterly 3D-rendered river otter; warm
> chocolate-brown fur with a soft cream-tan belly and chest; big expressive dark
> eyes; pale whiskers; small rounded ears; standing upright on his hind legs;
> Pixar-adjacent but painterly cinematic rendering with gentle rim light; full-body
> character, centered, clean cut-out on a fully transparent background (PNG alpha).

**Time-of-day progression (the core storytelling device):**
`Act 1 golden dusk → Act 2 deep twilight → Act 3 starlit night.`

**Universal negative prompt** (append to all):
> no text, no watermark, no logo, no UI, no frame/border, no people, not flat,
> no harsh cutout edges, no extra limbs, not cartoonish/low-detail.

---

## ACT 2 — `/founders` · "The Invitation" · DEEP TWILIGHT
**Emotion: belonging + gentle urgency.** Time has advanced — the dusk of Act 1 has
sunk into a warm, communal twilight. The lone clue becomes a gathering.

### Narrative copy (per beat)

**2.1 — The Expedition Forms (hero)**
- Eyebrow: `THE INVITATION`
- Headline: **You followed the clue. Now find your people.**
- Sub: *As the light fades, lanterns come up over the valley — and Otti waves you
  into the circle. The first expedition is forming, and there's a place at the fire
  with your name on it.*
- Counter line: **{N} explorers have already gathered · only 1,000 founding spots.**

**2.2 — What Founders Carry** (benefits, already built)
- Eyebrow: `WHAT FOUNDERS CARRY`
- Headline: **Every founder carries something the latecomers never will.**
- Sub: *A permanent badge. A voice in what we build. A seat that can't be bought
  later — only earned now.*
- (Keep the 5 benefit cards: Permanent Founder Badge · Lifetime Early Supporter ·
  Exclusive Community Access · Priority New Features · Special Founder Events.)

**2.3 — Only 1,000** (scarcity beat)
- Headline: **The fire only has 1,000 seats.**
- Sub: *When the thousandth explorer arrives, the founding circle closes — for good.
  After that, everyone joins as a guest, not a founder.*
- Micro: `{N} taken · {1000 − N} left` (live).

**2.4 — Claim Your Place** (the form → curtain into Act 3)
- Headline: **Step into the circle.**
- Sub: *Tell Otti who you are. The moment you do, the valley opens — and the summit
  comes into view.*
- Submit button: **Join the Founders →**
- Form-success microcopy (the curtain line): *"Otti found his person. Climbing to the
  summit…"* → page-curtain transition into Act 3.

### Art slot 2A — `scene_founders.png`  → `public/scene/scene_founders.png`
**Slot in `lib/assets.ts`:** `foundersBg` (line 17).

```
Painterly, semi-realistic digital fantasy illustration; cinematic atmospheric
river valley; layered misty mountains receding into haze; lush pine forest on both
flanks; a winding turquoise river with gentle rapids; a flat-topped mossy hero rock
in the foreground; soft volumetric light; floating golden fireflies; rich saturated
concept-art color grade; high detail; depth-of-field haze; 3:2 landscape.

SCENE: deep twilight has settled over the valley — a deep indigo-to-violet sky with
the last warm ember of orange dying along the mountain horizon; the river darkens to
teal and reflects the sky. In a sheltered forest clearing beside the hero rock, a
warm campfire glows amber, ringed by a few small explorer tents and hanging paper
lanterns; the firelight pools golden against the cool blue twilight, the two colors
meeting softly. Denser fireflies drift upward. A welcoming, communal, "the expedition
is forming" mood — cozy but vast. Empty center-ground left clear for a character to
stand. No characters in the scene.

NEGATIVE: no text, no watermark, no logo, no UI, no frame/border, no people, not
flat, no harsh cutout edges, not cartoonish/low-detail.
```
*Target: ~1600×1067 (3:2), PNG. Keep the lower-center relatively open — Otti is
composited on top via `OttiStage`.*

### Art slot 2B — `otti_invite.png`  → `public/otti/otti_invite.png`
**Slot in `lib/assets.ts`:** `ottiInvite` (line 18).

```
Otti — a friendly semi-realistic painterly 3D-rendered river otter; warm
chocolate-brown fur with a soft cream-tan belly and chest; big expressive dark eyes;
pale whiskers; small rounded ears; standing upright on his hind legs; Pixar-adjacent
but painterly cinematic rendering with gentle rim light; full-body character,
centered, clean cut-out on a fully transparent background (PNG alpha).

POSE: an inviting, welcoming "come join us" gesture — Otti turned slightly toward the
viewer, one paw raised and beckoning inward, the other holding a warm glowing lantern
(soft amber light) at his side; warm open smile, eyes bright and friendly. Lighting:
warm amber campfire/lantern key light from below-front, cool twilight-blue rim light
from behind — so he reads against a deep-twilight scene. Inviting, hospitable, "there's
a place for you here."

NEGATIVE: no text, no watermark, no logo, no UI, no background, no frame, no extra
limbs, no harsh cutout edges, not cartoonish/low-detail.
```
*Target: ~1000×1400 portrait, transparent PNG. Same otter proportions/face as
`otti_hero.png`.*

---

## ACT 3 — `/welcome` · "The Arrival" · STARLIT NIGHT
**Emotion: identity + game.** Night has fully fallen. The reward for arriving is the
view — the summit, the stars, the aurora, and your name on the board.

### Narrative copy (per beat)

**3.1 — The Summit (hero)**
- Eyebrow: `THE ARRIVAL`
- Stamp: **FOUNDER #{NNNN}** (with confetti on mount)
- Headline: **You made it to the summit, {firstName}.**
- Sub: *The whole valley is below you now, lit by stars. You're not on the waitlist —
  you're a founding explorer, #{NNNN} of the first thousand.*

**3.2 — The Climb** (referral)
- Headline: **The summit has higher ledges.**
- Sub: *Every friend you bring up the trail lifts your rank. Share your clue — climb
  the board — be the explorer the latecomers hear about.*
- Share button: **Invite friends, climb the expedition**
- Share text (already set): *"I found Otti. Join the founding expedition →"*

**3.3 — The Rewards** (unlock tiers)
- Headline: **What you unlock as you climb.**
- Sub: *Each ledge earns its keep.*
- Tiers (already built): Explorer Sticker Pack → Silver Explorer Badge → Priority
  Founder Status → Gold Founding Explorer Badge.

**3.4 — The Expedition Board** (leaderboard + university race)
- Headline: **The expedition, in real time.**
- Sub: *Explorers and universities racing for the summit. Find your name. Find your
  campus. Then go pull it higher.*

**3.5 — Otti Found His People** (closing)
- Headline: **Otti found his people.**
- Sub: *The journey begins 08.05.2026. When the doors open, you walk in first.*
- CTA: **Claim your Founder Badge** (becomes "Download Now" in launch mode).

### Art slot 3A — `scene_summit.png`  → `public/scene/scene_summit.png`
**Slot in `lib/assets.ts`:** `summitBg` (line 21).

```
Painterly, semi-realistic digital fantasy illustration; cinematic atmospheric
mountain landscape; layered peaks receding into haze; lush pine forest below; a
winding turquoise river threading the valley far beneath; rich saturated concept-art
color grade; high detail; depth-of-field haze; 3:2 landscape.

SCENE: full starlit night, viewed from a high summit vantage overlooking the whole
valley from Acts 1–2 far below. A vast deep-blue-to-black sky packed with stars and
a glowing Milky Way band; ribbons of aurora — teal, green, soft violet — sweep across
the upper sky and reflect faintly in the distant river. A flat summit rock in the
foreground (the destination version of the hero rock). The horizon keeps a faint warm
glow where the sun set hours ago. Fireflies still drift. Triumphant, awe-struck, "you
arrived" mood — grand and peaceful. Lower-center kept open for a character. No
characters in the scene.

NEGATIVE: no text, no watermark, no logo, no UI, no frame/border, no people, not flat,
no harsh cutout edges, not cartoonish/low-detail.
```
*Target: ~1600×1067 (3:2), PNG. Cool palette so confetti + the gold founder stamp pop.*

### Art slot 3B — `otti_celebrate.png`  → `public/otti/otti_celebrate.png`
**Slot in `lib/assets.ts`:** `ottiCelebrate` (line 22).

```
Otti — a friendly semi-realistic painterly 3D-rendered river otter; warm
chocolate-brown fur with a soft cream-tan belly and chest; big expressive dark eyes;
pale whiskers; small rounded ears; standing upright on his hind legs; Pixar-adjacent
but painterly cinematic rendering with gentle rim light; full-body character, centered,
clean cut-out on a fully transparent background (PNG alpha).

POSE: pure celebration — both paws thrown up in joy, one lifting the glowing teal
antique compass triumphantly overhead (the same compass from the hero art, casting
cyan light on his face and chest); wide open-mouth happy smile, eyes squeezed bright
with delight; mid-cheer, slight upward bounce. Lighting: cool starlight/aurora rim
light (teal-violet) from behind plus the warm-teal compass glow on the front — so he
reads against a starlit-night scene. Joyful, victorious, "we made it!"

NEGATIVE: no text, no watermark, no logo, no UI, no background, no frame, no extra
limbs, no harsh cutout edges, not cartoonish/low-detail.
```
*Target: ~1000×1400 portrait, transparent PNG. Same otter as the other poses — only
the pose/expression/lighting changes.*

---

## Generation order & wiring checklist
1. `scene_founders.png` → drop in `public/scene/` → set `foundersBg: "/scene/scene_founders.png"`.
2. `otti_invite.png` → drop in `public/otti/` → set `ottiInvite: "/otti/otti_invite.png"`.
3. `scene_summit.png` → drop in `public/scene/` → set `summitBg: "/scene/scene_summit.png"`.
4. `otti_celebrate.png` → drop in `public/otti/` → set `ottiCelebrate: "/otti/otti_celebrate.png"`.

Tips for consistency: generate the two **scenes** first, then feed each scene back in
as a style/lighting reference when generating its **Otti pose**, so the character's
rim-light direction matches the scene it stands in. If your model supports it, reuse
`otti_hero.png` as a character reference for face/fur consistency on both poses.
