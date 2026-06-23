# TripOtter Landing — Remediation Plan (`currentplan.md`)

> **Created:** 2026-06-24 (Tripy + OStad), after a full audit of `landingUI.md` vs. what's shipped.
> **Purpose:** close every gap, in dependency order, so nothing is missed.
> **Companion docs:** [`landingUI.md`](./landingUI.md) (build spec + §11 storyboard).
> **Rule:** one numbered step = one commit + push. Legend: 🤖 autonomous · 👤 needs OStad.

---

## A. Where we actually are (honest snapshot)

**Built — the cinematic front-end shell (looks remarkable, fully clickable):**
- L0 scaffold + Expedition/Twilight theme · L1 `/findotti` (+ bespoke Otti + painterly valley) ·
  L1.5 cinematic scene system · L3 `/founders` + form · L4 `/welcome` dashboard · L5 leaderboards.
- §11 storyboard + continuous-world scaffolding (`SceneBackdrop`, `OttiStage`, `lib/assets.ts` slots).

**NOT built — the functional half (the gaps to fix here):**
- ❌ **Referral front door** `/r/[code]` is **missing** → referral links 404 (the viral engine has no entry).
- ❌ Everything runs on **stubs** — no DB, nothing persists; joined-counter is a fake time-drift; leaderboard is hardcoded.
- ❌ L2 growth backend (schema + Edge Functions) · L2b real wiring · L6 email · L6b conversion ·
  L7 OG images · L8 polish/launch-mode · L9 deploy.
- ⬜ Story art slots empty: Act 2/3 scene backgrounds + Inviting/Celebrating Otti poses.

> Rough completeness: **presentation ~80%, functional/backend ~5%.**

---

## B. Remediation order (do top-to-bottom)

### R1 — Referral front door + capture (🤖, no backend) — DO FIRST
- **Why:** the campaign's whole point is referral sharing; the entry link must at least resolve.
- **Goal:** `/r/[code]` sets a `ref` cookie and redirects to `/founders`; `/founders` reads `?ref`/cookie
  and passes it through join; `/welcome` share links already point at `/r/CODE` → now they work.
- **Steps:** (1) add `app/r/[code]/page.tsx` (or route handler) — await params (Next 16 async), set cookie,
  redirect. (2) ensure `FounderForm` includes the captured `ref` (already wired to `?ref` — extend to cookie).
- **Verify:** visit `/r/TO-TEST-1234` → lands on `/founders`, cookie set; submit → join payload carries `ref`.
- **Commit:** `R1 referral front door`.

### R2 — Finish the cinematic world + story art (🤖 wiring · 👤 art) — in progress
- **Goal:** every act is a continuous world (dusk→twilight→night) with Otti carrying through; no bare-dark.
- **Done:** SceneBackdrop/OttiStage/assets registry; findotti + founders worlds; storyboard §11.
- **Remaining wiring (🤖):** apply twilight/night `SceneBackdrop` + Otti slot to **`/welcome`** and
  **`/leaderboard`**; add soft **scene transitions** between sections; **mobile alignment** of Otti on the
  hero rock; optional foreground parallax overlay slot.
- **Asset slots (👤 generate via GPT, drop in `public/`):** `scene_founders.png`, `otti_invite.png`,
  `scene_summit.png`, `otti_celebrate.png` → flip the matching line in `lib/assets.ts` (1 line each).
- **Verify:** scroll each page — continuous world, Otti present, no flat-black, good on a phone.
- **Commit:** `R2.x …` per sub-step.

### R3 — Growth backend (👤 repo + hosted apply · 🤖 build) — the big one
- **Gated on:** the **`tripotter-growth-backend` repo URL** + hosted Supabase apply (DB pw / `functions deploy`).
- **Goal:** the real isolated backend per `landingUI.md` §4 (Option 2B).
- **Steps (🤖 once repo exists):** migrations — **private `growth` schema**: `campaigns, leads,
  referral_events, lead_events, email_logs, lead_conversions` + `v_leaderboard_public` view + points-scoring
  RPCs + RLS (no broad anon). Edge Functions: `signup`, `leaderboard`, `verify-lead`, `me`. Seed
  `founders-waitlist` campaign. Collision-resistant referral codes; dedupe; rate-limit.
- **Verify:** `signup`/`leaderboard` return the safe payloads; local schema validates; (👤) hosted apply.
- **Commit (GB repo):** `R3 growth schema + edge functions`.

### R4 — Wire frontend → real backend (🤖, after R3)
- **Goal:** flip the 3 stub proxies to the real Edge Functions — **zero UI change** (shapes already match).
- **Steps:** `app/api/founders/{stats,join,leaderboard}` proxy to the growth functions; real referral persists;
  realtime/poll the live counter; `/welcome` reads real `me`.
- **Verify:** a real signup persists a `lead`; counter reflects it; referral credits the inviter; leaderboard live.
- **Commit:** `R4 wire real backend`.

### R5 — Email + verification (🤖 build · 👤 `RESEND_API_KEY`)
- **Goal:** "You Found Otti" email on signup (Resend) + email-verify link → `verify-lead` awards points.
- **Steps:** from `signup` queue Resend + log to `email_logs`; verify route flips status + scoring.
- **Verify:** test email received; clicking verify awards the +10 / referrer +40. **Commit:** `R5 email + verify`.

### R6 — Conversion bridge + admin export (🤖)
- **Goal:** `convert-lead` (main app calls it when a lead becomes a real user → `lead_conversions`); CSV
  `admin-export` gated by `ADMIN_EXPORT_SECRET`.
- **Verify:** simulated conversion writes the bridge; export downloads. **Commit:** `R6 conversion + export`.

### R7 — OG / share images (🤖)
- **Goal:** premium link previews via `@vercel/og`: a founder card ("I'm Founder #279 — find Otti") + the
  university-race card; per-page metadata.
- **Verify:** FB/WhatsApp share preview renders. **Commit:** `R7 OG images`.

### R8 — Polish, a11y, performance, launch mode (🤖)
- **Goal:** Lighthouse mobile ≥ 90; lazy-load GSAP/particles below the fold; reduced-motion sweep across all
  acts; keyboard/focus on form + share; LCP/CLS budget; **feature-flagged LAUNCH MODE** (Aug 5 → CTAs become
  "Download Now / Claim your Founder Badge").
- **Verify:** Lighthouse pass; reduced-motion clean; launch flag swaps CTAs. **Commit:** `R8 polish + launch mode`.

### R9 — Deploy (👤 Vercel + domain · 🤖 prep)
- **Goal:** live URL; env wired; Supabase/Resend secrets in Edge Functions; QR points at it.
- **Steps:** I prep build/env/redirects; OStad connects Vercel + `tripotter.com` (or subdomain) + secrets;
  smoke on a real phone via a test QR. **Commit:** `R9 deploy`.

---

## C. Dependency map (what unblocks what)
- **R1, R2-wiring, R7, R8** → fully autonomous now.
- **R2-art** → needs OStad's GPT generations (drop into `public/`, flip `lib/assets.ts`).
- **R3** → needs the **GB repo URL** + hosted Supabase apply. **R4/R5/R6** → need R3 first.
- **R5** → also needs `RESEND_API_KEY`. **R9** → needs Vercel account + domain.

## D. Suggested next action
**R1 now** (closes the biggest functional gap, no backend) → continue **R2** art/world → then **R3** when
OStad provides the growth repo + Supabase go-ahead.

## E. Progress log
- 2026-06-24 — Plan created after audit. Continuous-world scaffolding + storyboard landed.
- 2026-06-24 — **All autonomous steps DONE & pushed:**
  - ✅ **R1** referral front door `/r/[code]` (cookie + redirect; form reads ?ref/cookie).
  - ✅ **R2** continuous worlds across all acts (dusk→twilight→night) + Otti slots (welcome/leaderboard
    wired; mobile hero verified). *Art slots still await OStad's GPT generations.*
  - ✅ **R7** dynamic OG share images (default + founder + university cards; wired into welcome/leaderboard).
  - ✅ **R8** launch mode (date-driven CTA flip + env override) + a11y focus rings.
- **REMAINING — all gated on OStad:**
  - ⬜ **R3** growth backend — needs `tripotter-growth-backend` repo URL + hosted Supabase apply.
  - ⬜ **R4** wire stubs → real (after R3) · **R5** email (needs RESEND_API_KEY) · **R6** conversion+export.
  - ⬜ **R9** Vercel deploy — needs Vercel account + domain.
  - ⬜ **Art:** `scene_founders.png`, `otti_invite.png`, `scene_summit.png`, `otti_celebrate.png`
    → drop in `public/` + flip the line in `lib/assets.ts`.
