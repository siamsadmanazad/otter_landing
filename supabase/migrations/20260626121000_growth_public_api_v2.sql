-- Public API v2: re-expose the locked wrappers after the lead-quality changes.
-- founders_signup gains consent + utm params and returns the verify token; founders_verify
-- is new (double opt-in); founders_export gains consent/utm/verified columns. All stay
-- service_role-only — the private growth schema is never exposed to PostgREST directly.

-- ── signup wrapper (consent + utm; returns verify_token + verified) ──────────
drop function if exists public.founders_signup(text,text,text,text,text,text,text,text,text,text);

create or replace function public.founders_signup(
  p_full_name   text,
  p_email       text,
  p_university  text,
  p_facebook    text,
  p_instagram   text,
  p_favorite    text,
  p_why         text,
  p_ref_code    text,
  p_ip          text,
  p_user_agent  text,
  p_consent     boolean,
  p_utm_source  text,
  p_utm_medium  text,
  p_utm_campaign text,
  p_utm_term    text,
  p_utm_content text
)
returns table (
  lead_id       uuid,
  referral_code text,
  lead_position integer,
  duplicate     boolean,
  verify_token  uuid,
  verified      boolean
)
language sql
security definer
set search_path = growth, public
as $$
  select * from growth.signup_lead(
    'founders-waitlist', p_full_name, p_email, p_university, p_facebook, p_instagram,
    p_favorite, p_why, p_ref_code, p_ip, p_user_agent,
    p_consent, p_utm_source, p_utm_medium, p_utm_campaign, p_utm_term, p_utm_content
  );
$$;

-- ── verify wrapper (double opt-in) ──────────────────────────────────────────
create or replace function public.founders_verify(p_token uuid)
returns table (
  lead_id       uuid,
  referral_code text,
  lead_position integer,
  already       boolean
)
language sql
security definer
set search_path = growth, public
as $$
  select * from growth.verify_lead(p_token);
$$;

-- ── export wrapper (now incl. consent + utm + verified_at) ───────────────────
drop function if exists public.founders_export();

create or replace function public.founders_export()
returns table (
  full_name            text,
  email                text,
  university           text,
  facebook             text,
  instagram            text,
  favorite_destination text,
  why_explore          text,
  referral_code        text,
  referred_by          text,
  lead_position        integer,
  score                integer,
  status               text,
  consent_marketing    boolean,
  consent_at           timestamptz,
  utm_source           text,
  utm_medium           text,
  utm_campaign         text,
  verified_at          timestamptz,
  created_at           timestamptz
)
language sql
security definer
set search_path = growth, public
as $$
  select
    l.full_name, l.email, l.university, l.facebook, l.instagram,
    l.favorite_destination, l.why_explore, l.referral_code,
    r.referral_code as referred_by,
    l.position as lead_position, l.score, l.status,
    l.consent_marketing, l.consent_at,
    l.utm_source, l.utm_medium, l.utm_campaign, l.verified_at, l.created_at
  from growth.leads l
  join growth.campaigns c on c.id = l.campaign_id
  left join growth.leads r on r.id = l.referred_by_lead_id
  where c.slug = 'founders-waitlist'
  order by l.created_at asc;
$$;

-- ── lock down: service-role only ─────────────────────────────────────────────
revoke all on function public.founders_signup(text,text,text,text,text,text,text,text,text,text,boolean,text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.founders_verify(uuid) from public, anon, authenticated;
revoke all on function public.founders_export() from public, anon, authenticated;
grant execute on function public.founders_signup(text,text,text,text,text,text,text,text,text,text,boolean,text,text,text,text,text) to service_role;
grant execute on function public.founders_verify(uuid) to service_role;
grant execute on function public.founders_export() to service_role;
