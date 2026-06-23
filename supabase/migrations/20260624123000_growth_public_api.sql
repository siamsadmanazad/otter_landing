-- Public API surface for the growth schema.
-- The growth schema is private (not exposed to the Data API). supabase-js reaches
-- the DB via PostgREST, which only serves exposed schemas — so we expose a tiny,
-- LOCKED set of wrapper functions in `public` that proxy to growth. Execute is
-- revoked from anon/authenticated → only the service-role (our Next.js server)
-- can call them. The data itself never leaves the isolated growth schema.

-- ── signup wrapper ──────────────────────────────────────────────────────────
create or replace function public.founders_signup(
  p_full_name  text,
  p_email      text,
  p_university text,
  p_facebook   text,
  p_instagram  text,
  p_favorite   text,
  p_why        text,
  p_ref_code   text,
  p_ip         text,
  p_user_agent text
)
returns table (lead_id uuid, referral_code text, lead_position integer, duplicate boolean)
language sql
security definer
set search_path = growth, public
as $$
  select * from growth.signup_lead(
    'founders-waitlist', p_full_name, p_email, p_university, p_facebook,
    p_instagram, p_favorite, p_why, p_ref_code, p_ip, p_user_agent
  );
$$;

-- ── joined count ────────────────────────────────────────────────────────────
create or replace function public.founders_count()
returns integer
language sql
security definer
set search_path = growth, public
as $$
  select count(*)::int
  from growth.leads l
  join growth.campaigns c on c.id = l.campaign_id
  where c.slug = 'founders-waitlist';
$$;

-- ── leaderboard (safe columns only) ─────────────────────────────────────────
create or replace function public.founders_leaderboard(p_limit integer default 50)
returns table (rank integer, display_name text, university text, invites integer)
language sql
security definer
set search_path = growth, public
as $$
  select v.rank::int, v.display_name, v.university, v.invites::int
  from growth.v_leaderboard v
  join growth.campaigns c on c.id = v.campaign_id
  where c.slug = 'founders-waitlist'
  order by v.rank asc
  limit p_limit;
$$;

-- Lock down: only the service role (server) may execute these.
revoke all on function public.founders_signup(text,text,text,text,text,text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.founders_count() from public, anon, authenticated;
revoke all on function public.founders_leaderboard(integer) from public, anon, authenticated;
grant execute on function public.founders_signup(text,text,text,text,text,text,text,text,text,text) to service_role;
grant execute on function public.founders_count() to service_role;
grant execute on function public.founders_leaderboard(integer) to service_role;
