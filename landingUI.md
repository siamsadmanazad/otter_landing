# TripOtter Pre-Launch Landing — Build Guide (`landingUI.md`)

> **The "Missing Otti" expedition.** QR → Curiosity → Founding Explorer → Referral → University rivalry → Launch.
> **Launch:** Aug 5, 2026 · **Goal:** waitlist + referral virality + first 1000 downloads day one.
> **This file is the single source of truth.** Build in order; one numbered step = one commit + push.
> Prompts are paste-ready for Claude Code. **No code snippets here** — guidelines, prompts, and motion
> specs tied to named components (OStad supplies component source where noted with 🧩).

---

## 0. Locked decisions (2026-06-23, OStad + Tripy)
- **Motion:** Cinematic premium ("Expedition Noir"), but **mobile-first + `prefers-reduced-motion` safe** (QR traffic ≈ 90% mobile).
- **Backend (Option 2B — OStad's architecture):** Reuse the **main TripOtter Supabase** (`oveptqgoyhpgvbdfqenf`) but **isolate all marketing data in a private `growth` schema** — never in `public`/app tables. The schema is **not exposed to the frontend**; the landing page reaches it **only through Supabase Edge Functions** (service-role, server-side). Leads stay separate from real app users until they sign up for the app, then a `growth.lead_conversions` row bridges `lead → auth.users.id`.
- **Two repos:** **(a)** landing **frontend** (this `otter_landing` → its own GitHub repo, OStad provides URL) · **(b)** **`tripotter-growth-backend`** = the Supabase migrations + Edge Functions (separate repo). Frontend calls the functions; it never touches the DB directly or holds the secret key.
- **Mascot:** **Lottie + animated SVG** (OStad provides Otti art / Lottie JSON 🧩).
- **Stack:** **Next.js 15 (App Router) + TypeScript + Tailwind**, deployed on **Vercel**.

> **Golden rule:** `marketing frontend → Edge Function → growth schema`. Never `frontend → direct table insert`. The `service_role`/secret key lives only in Edge Functions, never in the browser/bundle/URL.

## 0.1 Guiding philosophy — *scope minimal, presentation maximal*
The brief says "don't overengineer." That governs **scope** (only: landing, form, referral, leaderboard, email — **no** maps/chatbot/feed/social-login). It does **not** govern **craft**: the few screens we ship are the marketing weapon, so they must feel like a film. Every effect must earn its place and never cost mobile performance.

---

## 1. Design language — "Expedition Noir"

### Palette (three-act color temperature)
- **Base:** near-black space `#08090C`; raised surface `#121318`.
- **Signal (Otti's clue glow):** brand teal→cyan `#0099DB → #00F0E4` — the mystery accent + the Explorer's Trail.
- **Treasure (founder/reward):** amber/gold `#F5B53F` — appears only from `/welcome` onward.
- **Arc:** `/findotti` coldest (teal on black) → `/founders` warming → `/welcome` warm gold. Color tells the story.

### Typography
- **Display** (headlines, e.g. "YOU FOUND A CLUE"): a bold geometric/editorial face (e.g. Clash Display / Cabinet Grotesk).
- **Clue voice** (the "Otti transmission"): a **monospace** (e.g. Geist Mono / JetBrains Mono) — used for cryptic lines, coordinates, countdowns.
- **Body:** clean sans (Geist / Inter). Self-host via `next/font`. Max 3 families.

### Texture & depth
Film-grain overlay (subtle), vignette, glow bloom around light sources, frosted-glass cards, slow-drifting aurora-mesh background. Premium = depth + restraint, never busy.

### Motion DNA — "weight, not bounce"
- Easings: `easeOutCubic` / `expo`. Durations 0.5–0.9s for reveals.
- Elements **materialize** (opacity + 8–16px rise + slight blur-out→in + scale 0.98→1), never cheap slides.
- Parallax on depth layers; magnetic CTAs; scrubbed scroll sequences for story beats.

### Signature motif — **The Explorer's Trail** 🧩 `<ExplorerTrail>`
A glowing dotted map-line (SVG path) that **draws itself as you scroll**, threading section to section like a treasure route. The brand's unique scroll device; reused on every page.

---

## 1B. Cinematic Parallax craft (merged 2026-06-23, OStad + Tripy)

> Adopts OStad's cinematic-parallax guideline as the **craft layer** over our campaign narrative.
> The "Missing Otti" workflow is the **WHAT** (story); this is the **HOW** (execution).

### Prime principle
Build a **scrollable animated world**, not a SaaS page. **Atmosphere first, copy second** — the
visuals/motion/spacing create the emotion before a word is read. Each act is a **cinematic scene**, not a section.

### Three reconciliations (campaign rules win)
1. **Act 1 stays pure.** The reference's "product preview" + "feature chapters" would break the mystery
   rule on `/findotti` (no features, no app preview, no app name). Those map to **later pages**:
   `/founders` = the scarcity scene, `/welcome` = the gamified dashboard + leaderboard = the
   "social-proof / community" scene. A full feature-chapter marketing page is a **post-launch** option.
2. **Asset reality → slot system.** The illustrated multi-layer look needs art we don't have yet. Build
   the **layer system now** (procedural atmosphere + Otti) with every layer as a **drop-in slot**
   (`<SceneLayer>` accepts an image/Lottie/procedural child) so supplied art snaps in with no refactor.
3. **Motion stack split (locked):** **GSAP + ScrollTrigger** for cinematic scroll (pinned scene
   transitions, scrubbed parallax, crossfades) · **Framer Motion** for micro-interactions only (hover,
   button, small reveals) · **Lenis** drives the scroll and feeds GSAP's ticker.

### Layered scene architecture (every cinematic scene)
Depth stack, each on its own parallax plane (back→front, slowest→fastest):
`sky/gradient → clouds/atmosphere → far range (mountains/city/map) → midground → water/road/valley →
foreground (plants/rocks) → character/Otti (parallax + idle) → UI overlay → text overlay → navbar`.
Mobile: **drop the middle layers**, keep sky + far + foreground + Otti + text; reduce pinning.

### Palette extension — "Twilight Expedition" (cinematic)
Keep brand **teal = Otti's signal**. Extend the atmosphere to: **deep purple, midnight blue, lavender,
sunset orange, peach/pink, misty blue**, warm **cream** text. Avoid pure black / pure white. Warm
cinematic lighting; cool field + warm subject.

### Motion rules (elegant, not flashy)
Slow fades · soft parallax · blur-to-clear text reveals · gentle floating/idle (clouds drift, light rays,
particles, Otti idle) · pinned scene transitions that **crossfade** (old scene never hard-cuts). **No**
bounce, spin, or fast motion. Animate **transform + opacity only**. Everything has a `prefers-reduced-motion` path.

### Cinematic UI accents (decorative, optional)
Scroll-progress bar · **"Chapter 01 / 03"** label · a play-style control (opens a teaser, never autoplays
sound) · a journey timeline. Keep them subtle and part of the scene.

### Navbar
Transparent at top → subtle **glass blur on scroll**. Tiny logo left · minimal/centered links · one small
CTA right. On mobile: compact, CTA-first. Feels like part of the scene, never a dashboard.

### Performance & a11y (hard rules — carry into every step)
WebP/AVIF, compressed layer slices · preload only the hero · **lazy-load below-the-fold scenes + GSAP/
particles/Lottie** · animate transform/opacity only (never width/height/top/left) · blur-up placeholders ·
target **60fps on mid-range Android** (test there, not just Mac) · strong contrast + overlays behind text
on busy art · keyboard focus · reduced-motion fallback · no scroll-trap · no autoplay sound.

---

## 2. Tech stack & libraries (what each is for)
- **Next.js 15 + TS + Tailwind** — framework, instant Vercel deploy, API/proxy routes.
- **GSAP + ScrollTrigger** — **the cinematic engine**: pinned scene transitions, scrubbed parallax,
  crossfades, the Explorer's-Trail path draw. Synced to Lenis' ticker.
- **Lenis** — smooth inertia scroll (the biggest "premium feel" win); drives GSAP.
- **Framer Motion (`motion`)** — micro-interactions only: hover, magnetic button, small reveals,
  `AnimatePresence` page transitions, animated counters.
- **lottie-react** — Otti character animations (drop-in to `<SceneLayer>`/`<OttiHero>`).
- **split-type** — per-letter "decoding" headline reveals.
- **canvas-confetti** — founder celebration burst. Ambient dust = our lightweight `<ParticleField>` canvas
  (chosen over tsParticles for mobile perf).
- **@supabase/supabase-js** — via the growth Edge Functions (signups, referral, realtime counters).
- **Resend** — "You Found Otti" email. **shadcn/ui** — accessible dark form primitives.
- Load GSAP/particles/Lottie **lazily below the fold**; keep the hero LCP fast.

---

## 3. Information architecture (routes)
- `/findotti` — **Act 1: the clue.** Mystery only. NO rankings, NO feature talk, NO app mention. Single CTA → `/founders`.
- `/founders` — **Act 2: the invitation.** Scarcity + benefits + signup form. Shows live joined-count + progress + spots-remaining.
- `/welcome` — **Act 3: the reveal.** Founder #, rank, referral link + share, reward tiers, leaderboard (personal + university). Post-submit destination.
- `/r/[code]` — referral entry: capture `ref` code, set cookie, redirect to `/founders` (pre-credit the inviter).
- `/leaderboard` (optional public page) — top explorers + university race (also embedded in `/welcome`).
- **Frontend calls Edge Functions, not local DB.** Next.js route handlers (`/api/*`) are thin proxies/BFF that forward to the `tripotter-growth-backend` Edge Functions (`signup`, `leaderboard`, `verify-lead`, `me`) and add the dynamic OG image (`@vercel/og`). The secret key stays in the Edge Functions only.
- **Root `/`** → redirect to `/findotti` (the QR target).

---

## 4. Backend architecture — `growth` schema (private) + Edge Functions
> Lives in the separate **`tripotter-growth-backend`** repo (migrations + functions). Author locally; hosted apply is **user-gated** (OStad runs it). The guide describes the schema; full SQL lives in that repo's migrations.

### 4.1 Schema isolation
Create `schema growth;` in the existing project — **kept private (not exposed to the Data API)**. RLS enabled on every table, with **no broad anon policies**. All access is server-side via Edge Functions using the secret/`service_role` key.

```
TripOtter Supabase project
├── auth.users · public.* (real app data — untouched)
└── growth (private)
    ├── campaigns          (separate marketing campaigns, e.g. founders-waitlist)
    ├── leads              (the signups — see fields below)
    ├── referral_events    (audit trail of who referred whom + points)
    ├── lead_events        (lifecycle analytics: signup_created, email_verified, …)
    ├── email_logs         (Resend delivery log)
    ├── leaderboard_cache  (optional, for traffic spikes)
    └── lead_conversions   (the bridge: lead → auth.users.id)
```

### 4.2 Key tables (essential fields)
- **`campaigns`** — `id, slug (unique), name, status(draft/active/paused/ended), starts_at, ends_at`. Lets us run multiple campaigns; the launch uses `founders-waitlist`.
- **`leads`** — `id, campaign_id, email, email_normalized, full_name, username, university, facebook, instagram, favorite_destination, why_explore, country, city, source/medium/utm_*, referral_code (unique), referred_by_lead_id, status(new/email_verified/qualified/invited/converted/blocked/unsubscribed), score, signup_ip, user_agent, metadata jsonb, created_at, updated_at`. **Unique `(campaign_id, email_normalized)`** stops dup signups.
- **`referral_events`** — `id, campaign_id, referrer_lead_id, referred_lead_id, event_type(signup/email_verified/qualified/converted), points, created_at`, **unique `(campaign, referrer, referred, event_type)`** (no double credit).
- **`lead_events`** — `id, lead_id, campaign_id, event_name, event_data jsonb, created_at` (funnel analytics).
- **`email_logs`** — `id, lead_id, email_type, recipient, provider, provider_message_id, status, error_message`.
- **`lead_conversions`** — `id, lead_id (unique), user_id → auth.users (unique), conversion_type, converted_at`. The marketing↔app bridge.

### 4.3 Referral codes
Server-generated, collision-resistant, e.g. `TO-AZAD-8F3KQ` (prefix + cleaned name + random). DB still enforces `referral_code unique`.

### 4.4 Points-based scoring (abuse-resistant — do NOT rank on raw signups)
| Action | Points |
|---|--:|
| New signup | 0 |
| Email verified | 10 |
| Valid referral signup | 20 |
| Referred user verifies email | 40 |
| Referred user converts to app user | 100 |

Fake signups never dominate. **Displayed rank/"move up the ranks"** is derived from `score` server-side. A `growth.v_leaderboard_public` view exposes only `rank, display_name, score, verified_referrals` — **never emails/socials**.

### 4.5 Signup flow (the `signup` Edge Function)
Validate → normalize email → resolve campaign by slug → reject dup `(campaign,email)` → resolve referrer from `ref` → insert lead → generate referral code → `lead_events: signup_created` → if referred: `referral_events` row (+ points, guarded) → queue Resend welcome → return **safe** payload only (`leadId, referralCode, referralUrl, message`). Never return IP/status/referrer email/raw row.

### 4.6 Lead → user conversion (the `convert-lead` function, later)
When someone creates a **real app account**, the app backend calls `convert-lead`: match `leads.email_normalized` → insert `lead_conversions(lead_id, user_id)` → `leads.status = 'converted'` → `lead_events: converted_to_user` → optionally reward the referrer. Gives clean "which campaign produced real users" analytics.

### 4.7 Live urgency (realtime)
`spots_remaining = 1000 − count(leads in campaign)`. The frontend gets live counter + leaderboard updates by calling the `leaderboard` function on an interval **or** (if we choose to expose a realtime-safe read) subscribing — but **writes are always via Edge Functions**. Debounce UI so a signup spike doesn't thrash counters.

---

## 5. Component catalog (motion tied to components) 🧩 = OStad may supply source
| Component | Role | Motion / library |
|---|---|---|
| 🧩 `<ExplorerTrail>` | signature dotted map-line | SVG path draw on scroll (GSAP ScrollTrigger, scrubbed) |
| `<AuroraBackground>` | drifting gradient mesh | slow CSS/Canvas loop; parallax on scroll |
| `<GrainOverlay>` | film grain + vignette | static SVG/Canvas noise, `mix-blend` |
| `<ParticleField>` | ambient dust/fireflies | tsParticles, lazy-loaded |
| 🧩 `<ClueReveal>` | "decoding" headline | split-type per-char + blur/opacity stagger (Framer/GSAP) |
| 🧩 `<OttiHero>` | the mascot | Lottie; idle loop + scroll-reactive parallax |
| `<MagneticButton>` | premium CTA | Framer Motion pointer-follow + scale on press |
| `<LiveCounter>` / `<CountUp>` | joined / spots-remaining | Supabase realtime → animated number (Framer `animate`) |
| `<RankMeter>` | progress bar | width spring on mount + on invite |
| `<FounderStamp>` | the "#279" reveal | scale-in + glow + canvas-confetti |
| `<ScrambleNumber>` | rank changes | slot-machine digit roll on invite |
| `<UniversityRace>` | university leaderboard | animated bars, reorder via Framer layout |
| `<ShareRow>` | FB / Messenger / WhatsApp / copy | tap micro-interactions, copied-toast |
| `<PageTransition>` | route changes | `AnimatePresence` curtain/fade between acts |
| `<RewardTier>` | invite-unlock cards | locked→unlocked flip + shimmer at threshold |
| `<ScrollProgress>` | reading indicator | thin top bar bound to scroll |
| 🧩 `<SceneLayer>` | one parallax plane in a scene | GSAP ScrollTrigger y/scale per depth; accepts image/Lottie/procedural child (drop-in art slot) |
| `<CinematicScene>` | a pinned chapter wrapper | GSAP pin + scrubbed timeline; crossfades to next scene |
| `<Navbar>` | minimal cinematic nav | transparent → glass-blur on scroll (Framer) |
| `<ChapterIndicator>` | "Chapter 01 / 03" + timeline | scroll-progress bound label |
| `<CloudLayer>` | drifting fog/cloud depth | CSS drift + cursor parallax |
| `<GsapProvider>` | Lenis↔GSAP ticker sync | registers ScrollTrigger, lazy below-fold |

---

## 6. Build phases (each = one commit + push)
> **Two repos** advance in parallel: **FE** = `otter_landing` (Next.js) · **GB** = `tripotter-growth-backend` (migrations + Edge Functions). Each step says which repo.

### L0 — Repo + scaffold + theme tokens ✅ DONE
- **Prompt:** "Scaffold a Next.js + TS + Tailwind app for the TripOtter pre-launch landing. Add the Expedition Noir design tokens (palette, fonts, spacing/radii), a root layout with `<GrainOverlay>` + `<AuroraBackground>`, Lenis smooth scroll, and `prefers-reduced-motion` handling. Redirect `/` → `/findotti`."
- **Verify:** boots, dark themed, smooth scroll, reduced-motion disables it. **Commit:** `L0 scaffold + theme`. ✅

### L1 — `/findotti` (Act 1: the clue) — mystery only ✅ DONE (+ cinematic rework)
- **Prompt:** "Build `/findotti`: hero with `<OttiHero>` (Lottie placeholder), `<ClueReveal>` decoding headline, mono subline, the 'What do we know about Otti?' clue list (stagger on scroll), a mono **countdown to 08.05.2026**, single `<MagneticButton>` → `/founders`. `<ExplorerTrail>` + `<ParticleField>`. NO rankings/features/app name."
- **Done:** + Twilight Expedition palette, `<CloudLayer>`, depth-tier particles, cursor + scroll parallax. **Commits:** `L1 findotti`, cinematic rework. ✅

### L1.5 — Cinematic scene system (FE) ← NEXT
> Realize §1B: establish the reusable layered-scene + GSAP/ScrollTrigger engine that every act reuses,
> and re-stage `/findotti` as the first true cinematic scene. Adopts the GSAP-for-scroll / Framer-for-micro split.
- **Goal:** a drop-in parallax scene system + cinematic chrome (navbar, chapter indicator) + buttery pinned scroll.
- **Prompt:** "Add a `<GsapProvider>` that registers ScrollTrigger and drives it from the existing Lenis
  instance (`__lenis`), lazy-loaded. Build `<SceneLayer>` (one parallax plane: `depth` prop → GSAP-scrubbed
  y/scale; child can be a procedural node now, an image/Lottie later — a drop-in art slot) and
  `<CinematicScene>` (pins a chapter + scrubbed timeline that crossfades into the next). Add a minimal
  `<Navbar>` (transparent → glass-blur on scroll, tiny Otti mark + the CTA) and a `<ChapterIndicator>`
  ('Chapter 01 / 03'). Re-stage `/findotti` using the layer stack (sky/clouds/far/foreground/Otti/text) with
  one pinned crossfade from hero→clues. Mobile drops middle layers + heavy pinning. Animate transform/opacity
  only; full reduced-motion path; lazy-load GSAP below the fold."
- **Verify:** 60fps-feel scroll; layers move at distinct depths; hero pins + crossfades into clues; navbar
  blurs on scroll; reduced-motion = static readable page; `pnpm build` green; test a mid-range viewport.
- **Commit:** `L1.5 cinematic scene system`.

### L2 — Growth backend: `growth` schema + Edge Functions (GB repo)
- **Prompt:** "Scaffold `tripotter-growth-backend`: Supabase migrations creating a **private `growth` schema** with campaigns/leads/referral_events/lead_events/email_logs/lead_conversions + the `v_leaderboard_public` view + points-scoring RPCs + RLS (no broad anon policies), and Edge Functions `signup`, `leaderboard`, `verify-lead`, `me`. Server-side validation, email normalization, dup/self-referral guards, collision-resistant referral codes, and a `shared/` lib (supabaseAdmin, validators, referral, response). Secret key only in functions. `.env.example` with SUPABASE_URL/ANON/SECRET, RESEND_API_KEY, ADMIN_EXPORT_SECRET. Seed the `founders-waitlist` campaign. Flag hosted apply as user-gated."
- **Verify:** migrations validate locally; `signup`/`leaderboard` return safe payloads. **Commit (GB):** `L2 growth schema + edge functions`.

### L2b — Frontend ↔ backend wiring + referral capture (FE repo)
- **Prompt:** "Add `/r/[code]` to store `ref` in a cookie and redirect to `/founders`. Add thin Next.js route handlers that proxy to the growth Edge Functions (`signup`, `leaderboard`, `me`) — never call the DB directly, never hold the secret key (functions do). Type the safe response shapes."
- **Verify:** `/r/CODE` sets cookie + redirects; proxy returns the function's safe payload. **Commit (FE):** `L2b backend wiring`.

### L3 — `/founders` (Act 2: the invitation) + form
- **Prompt:** "Build `/founders`: warming-tone hero 'Become one of the first 1000 Founding Explorers', benefits list, urgency block, and the live trio — `<LiveCounter>` joined-count, `<RankMeter>` progress, 'X spots remaining' (Supabase realtime). Then the signup form (shadcn, dark) with the PDF fields (full_name*, email*, university*, facebook, instagram, favorite_destination, why_explore). On submit → proxy → `signup` Edge Function → redirect `/welcome` with the returned referralCode. Validate; friendly errors; respect rate limiting."
- **Motion:** counters animate live; form fields focus-glow; submit → curtain `<PageTransition>`. **Commit:** `L3 founders + form`.

### L4 — `/welcome` (Act 3: the reveal) + referral + share
- **Prompt:** "Build `/welcome`: `<FounderStamp>` reveal of 'Founder #NNN' with confetti, current rank `X / 1000`, spots remaining, the personal referral link + `<ShareRow>` (FB/Messenger/WhatsApp/copy with toast), and `<RewardTier>` cards (1/3/5/10 invites). Explain 'every invite moves you up 5 places' with a `<ScrambleNumber>` demo. Pull state from `/api/me`."
- **Motion:** stamp scale-in + confetti; reward cards unlock-shimmer; rank scrambles. **Commit:** `L4 welcome + referral`.

### L5 — Leaderboards (personal + university race)
- **Prompt:** "Add `<Leaderboard>` (top explorers, medal styling, highlight current user) and `<UniversityRace>` (BD universities by explorer count, animated reordering bars) to `/welcome` and a public `/leaderboard`. Realtime updates. Add the social-share OG line ('🔥 BRAC takes the lead — can NSU catch up?')."
- **Motion:** bars grow + reorder (Framer layout); medals shimmer. **Commit:** `L5 leaderboards`.

### L6 — Email automation + verification (GB repo, Resend)
- **Prompt:** "From the `signup` function, queue the 'You Found Otti' email via Resend (subject 'You Found Otti.', founder body + referral link + 08.05.2026) and log to `email_logs`. Include an email-verify link → `verify-lead` function (mark `email_verified`, award the 10 + referrer 40 points). No-op gracefully if RESEND_API_KEY unset. Add a launch-day broadcast stub."
- **Verify:** test email received; clicking verify awards points. **Commit (GB):** `L6 email + verify`.

### L6b — Conversion bridge + admin export (GB repo)
- **Prompt:** "Add the `convert-lead` function (private; called by the main app when a lead's email becomes a real user → write `lead_conversions`, set status converted, award 100) and `admin-export` (CSV by campaign/status, gated by ADMIN_EXPORT_SECRET). Document the main-app hook to call convert-lead on signup."
- **Commit (GB):** `L6b conversion + export`.

### L7 — Dynamic OG / share images
- **Prompt:** "Generate dynamic OG images (`@vercel/og`) for shares: a founder card ('I'm Founder #279 — find Otti') and the university-race card. Wire per-page metadata so FB/WhatsApp shares look premium."
- **Commit:** `L7 OG images`.

### L8 — Polish, a11y, performance, launch-mode
- **Prompt:** "Pass: Lighthouse mobile ≥ 90; lazy-load GSAP/particles/Lottie; verify reduced-motion across all acts; keyboard/focus on form + share; LCP/CLS budget. Add a feature-flagged 'LAUNCH MODE' that swaps CTAs to 'Download Now / Claim your Founder Badge' on Aug 5."
- **Commit:** `L8 polish + launch mode`.

### L9 — Deploy to Vercel
- **Prompt (👤 + 🤖):** I prep env + build; OStad connects the Vercel project + domain (`tripotter.com` or subdomain) + adds Supabase/Resend env. Smoke the live URL on a real phone via a test QR.

---

## 7. Accessibility & performance (hard rules)
- **Mobile-first** — design at 390px first; QR traffic is mobile. Test on a real phone.
- **`prefers-reduced-motion`** — every scroll/parallax/confetti has a reduced path.
- **Perf budget** — hero LCP < 2.5s on 4G; no layout shift; heavy libs lazy below the fold.
- **Forms** — labels, focus rings, inline validation, large tap targets.
- **Realtime** — debounce UI updates so a signup spike doesn't thrash the counter.

---

## 8. Anti-abuse (referral integrity) — from day one
- Server (Edge Function) assigns score/rank — never the client.
- One email per campaign (`unique (campaign_id, email_normalized)`); normalize before insert.
- **Points gate:** award full points only **after email verification**, not on raw signup → fake signups can't top the board.
- Prevent self-referral; `referral_events` unique key blocks double credit; keep the audit trail.
- Store `signup_ip` + `user_agent`; optionally block disposable-email domains; admin can set `status='blocked'`.
- Rate-limit the `signup` function (reuse the existing `rate_limit` RPC). Never expose emails publicly.

---

## 9. What OStad provides (track here)
- [ ] **Two GitHub repo URLs** + push access: `otter_landing` (frontend) and `tripotter-growth-backend`.
- [ ] Otti art / **Lottie JSON** (idle, holding-map) 🧩 + any bespoke component source.
- [ ] Final QR poster target URL + the `tripotter.com` domain (or subdomain).
- [ ] Community links (Facebook Group / Discord).
- [ ] Confirm reward-tier asset names (sticker pack, silver/gold badges).
- [ ] Run the hosted apply for the **`growth` schema** migration + deploy Edge Functions (user-gated; needs the DB password / `supabase functions deploy`).
- [ ] Set Edge Function secrets: `SUPABASE_SECRET_KEY` (service role), `RESEND_API_KEY`, `ADMIN_EXPORT_SECRET`.
- [ ] Later: add the **`convert-lead` hook** in the main app's signup path.

## 10. Story arc (one-line reference)
**Find a clue (mystery) → Join the expedition (scarcity) → Become Founder #N (identity) → Climb by inviting (game) → My university must win (tribe) → Otti found his people, download (launch).**
