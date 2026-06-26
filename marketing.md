# Marketing Lead Backend — Plan & Progress (`marketing.md`)

> Living tracker for the pre-launch lead-collection backend. One numbered step = one commit + push.
> Legend: 🤖 autonomous · 👤 needs OStad · ✅ done · 🔜 next · ⛔ blocked on OStad.

---

## Context

`otter_landing` is TripOtter's pre-launch "Missing Otti" campaign site. The lead backend was first
coded as **Option 2B** (reuse the main app's Supabase, isolated `growth` schema): migrations for
`growth.campaigns/leads/referral_events`, a `growth.signup_lead()` RPC, public proxy RPCs, and a CSV
export; the `/api/founders/*` routes call them with the **service_role key** and fall back to stubs.
Today `.env.local` holds the **main app project's** service_role key.

**Decisions locked with OStad:**
1. **Separate Supabase project for marketing leads.** A `service_role` key is *project-wide*, not
   schema-scoped, so the public landing server must never hold a key to the real `auth.users`. A
   separate (free) project = full blast-radius isolation, independent rate limits/backups, clean
   post-campaign delete. The only cost is the lead→user bridge becomes a one-time email match at launch.
2. **Add lead-quality machinery:** email verification (double opt-in), consent capture, UTM
   attribution, anti-bot defenses — none exist today.

Goal: collect *real*, contactable, attributable potential users, isolated from production and
resistant to bots / leaderboard gaming.

---

## Final architecture

```
Marketing Supabase project (NEW, free)        Main app project (untouched)
  growth schema (RLS deny-all, service-only)     auth.users / public.*
   - campaigns, leads, referral_events            (landing server has NO key to this)
   - email_logs (new), v_leaderboard view
  RPCs: signup_lead, verify_lead, export        Launch bridge: batch match
                                                  leads.email_normalized -> auth.users
        ^ service_role (server-only)
  otter_landing (Vercel) — BFF route handlers; key never reaches the browser
   /api/founders/{join,verify,stats,leaderboard} + /api/admin/leads
        +-- Resend (outbound only; DB is the source of truth)
```

Access rule: **browser → /api route → service_role → growth RPC**. Never browser → table.

---

## Database design (NEW project)

Existing 3 tables + `signup_lead` + leaderboard view port over verbatim (already `growth`-namespaced).
Added:
- **`growth.leads` columns:** `consent_marketing bool`, `consent_at`, `utm_source/medium/campaign/term/
  content`, `verify_token uuid unique`, `verified_at`.
- **`growth.email_logs`:** `id, lead_id, email_type, recipient, provider, provider_message_id, status,
  error_message, created_at`.
- **Abuse-resistant scoring:** referrer gets **0 at signup** (record the link only); points awarded only
  after the referred lead **verifies email** → lead `+10`, referrer `+40` (dedup-guarded). Convert-to-app
  `+100` deferred to launch bridge.
- **IP rate-limit** inside `signup_lead` (reject > N leads/IP/hour → `RATE_LIMITED`).

---

## Steps

1. 👤 **Create the new Supabase project** (`tripotter-growth`, Tokyo). Provide URL + service_role key +
   DB password — OR a fresh PAT so 🤖 can `supabase projects create`. **⛔ blocks hosted apply (steps 2-apply, 7).**
2. 🤖 **Migrations** — `20260626_growth_lead_quality.sql` (consent/utm/verify cols, `email_logs`,
   rewritten `signup_lead` with consent+utm+rate-limit+verify_token, new `verify_lead`) +
   `20260626_growth_public_api_v2.sql` (proxy signature, `founders_verify`, extended `founders_export`).
3. 🤖 **Form** — `lib/founders.ts` types + `FounderForm.tsx`: consent checkbox (required), honeypot,
   UTM capture, optional Turnstile widget.
4. 🤖 **Join route hardening** — `app/api/founders/join/route.ts`: honeypot reject, Turnstile verify,
   pass consent/utm; `lib/turnstile.ts`.
5. 🤖 **Email + verify** — `lib/email.ts` (Resend, no-op without key, logs to `email_logs`) +
   `app/api/founders/verify/route.ts` (token → `founders_verify` → `/welcome?verified=1`).
6. 🤖 **Export** — extend `founders_export` + confirm `/api/admin/leads` surfaces new columns.
7. 👤 **Env + hosted apply** — point `.env`/Vercel at the new project, remove the main-app key from this
   repo, add `RESEND_API_KEY` + Turnstile keys + `ADMIN_EXPORT_SECRET`; `supabase db push`.
8. 🤖 **End-to-end test** per checklist.

---

## Admin / follow-up workflow
New lead → honeypot/Turnstile/rate-limit pass → `signup_lead` stores (status `new`, consent+utm, 0
referral pts) → welcome email (logged) → user clicks verify → `verify_lead` flips `email_verified`,
+10/referrer +40 → leaderboard reflects only verified activity. Admin pulls secret-gated
`/api/admin/leads` CSV (filter by status/university/utm). At launch: one-time match verified
`leads.email_normalized` → `auth.users` to bridge conversions.

## Security & anti-spam
service_role server-only, now on a project with no real users · honeypot + Turnstile + per-IP
rate-limit · dedup `unique(campaign,email_normalized)` · double-credit guard
`unique(campaign,referrer,referred,event_type)` · points only after verification · consent logged ·
`unsubscribed`/`blocked` honored by the leaderboard view.

## Testing checklist
- [ ] `supabase db reset` builds `growth` clean; `email_logs` + new cols exist.
- [ ] POST join (valid) → `{leadId, referralCode, position}`; row has consent+utm+verify_token; referrer score 0.
- [ ] Re-POST same email → idempotent, no dup.
- [ ] Honeypot filled → rejected; rapid POSTs/IP → `RATE_LIMITED`.
- [ ] Welcome email sent (key) / skipped (no key); `email_logs` row written.
- [ ] Verify link → `/welcome?verified=1`; lead `email_verified` +10; referrer +40 once.
- [ ] Leaderboard = verified scores; blocked/unsubscribed excluded; no email/socials leak.
- [ ] `/api/admin/leads` + secret → CSV w/ consent/utm/verified; wrong secret → 401.
- [ ] Client bundle never contains `SUPABASE_SERVICE_ROLE_KEY`; no main-app key in repo.

## Future
convert-lead + `lead_conversions` at launch · launch-day broadcast to verified leads · disposable-email
blocklist · optionally collapse `growth` into the new project's `public`.

---

## Progress log
- 2026-06-26 — Plan finalized (separate project + all 4 lead-quality additions). Tracker created.
