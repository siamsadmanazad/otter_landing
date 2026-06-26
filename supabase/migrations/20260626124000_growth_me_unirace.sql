-- Per-lead live stats (powers the founder dashboard's real rank/invites) + a real
-- per-university tally (the BD "campus race" viral hook — total signups per uni, not
-- just a slice of the top-50). Both safe (no email/socials), service_role only.

-- ── per-lead public stats, looked up by the (shareable) referral code ─────────
create or replace function growth.get_lead_stats(p_code text)
returns table (
  referral_code    text,
  lead_position    integer,
  score            integer,
  rank             integer,
  invites          integer,
  verified_invites integer,
  verified         boolean
)
language sql
security definer
set search_path = growth, public
as $$
  select
    l.referral_code,
    l.position,
    l.score,
    coalesce((select v.rank::int from growth.v_leaderboard v where v.referral_code = l.referral_code), l.position),
    (select count(*)::int from growth.referral_events re where re.referrer_lead_id = l.id and re.event_type = 'signup'),
    (select count(*)::int from growth.referral_events re where re.referrer_lead_id = l.id and re.event_type = 'email_verified'),
    (l.verified_at is not null)
  from growth.leads l
  join growth.campaigns c on c.id = l.campaign_id and c.slug = 'founders-waitlist'
  where l.referral_code = upper(trim(p_code))
  limit 1;
$$;

-- ── real campus race: total signups per university ───────────────────────────
create or replace function growth.university_tally(p_limit integer default 8)
returns table (name text, explorers integer)
language sql
security definer
set search_path = growth, public
as $$
  select nullif(l.university, '') as name, count(*)::int as explorers
  from growth.leads l
  join growth.campaigns c on c.id = l.campaign_id and c.slug = 'founders-waitlist'
  where l.status not in ('blocked', 'unsubscribed') and nullif(l.university, '') is not null
  group by 1
  order by explorers desc, name asc
  limit p_limit;
$$;

-- ── locked public wrappers (service_role only) ───────────────────────────────
create or replace function public.founders_me(p_code text)
returns table (
  referral_code    text,
  lead_position    integer,
  score            integer,
  rank             integer,
  invites          integer,
  verified_invites integer,
  verified         boolean
)
language sql
security definer
set search_path = growth, public
as $$ select * from growth.get_lead_stats(p_code); $$;

create or replace function public.founders_university_race(p_limit integer default 8)
returns table (name text, explorers integer)
language sql
security definer
set search_path = growth, public
as $$ select * from growth.university_tally(p_limit); $$;

revoke all on function public.founders_me(text) from public, anon, authenticated;
revoke all on function public.founders_university_race(integer) from public, anon, authenticated;
grant execute on function public.founders_me(text) to service_role;
grant execute on function public.founders_university_race(integer) to service_role;
