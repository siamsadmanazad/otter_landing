-- TripOtter pre-launch "Missing Otti" campaign — isolated growth schema.
-- Marketing leads live here, walled off from the app's public/* tables, so they
-- never mix with real users. Access is server-side only (Next.js /api routes use
-- the service-role key); the schema is NOT exposed to the Data API. RLS is on as
-- defense-in-depth (deny-all to anon/authed). Easy to drop when no longer needed.

create schema if not exists growth;

-- ── campaigns ───────────────────────────────────────────────────────────────
create table if not exists growth.campaigns (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  status     text not null default 'active' check (status in ('draft','active','paused','ended')),
  created_at timestamptz not null default now()
);

-- ── leads (the founders) ────────────────────────────────────────────────────
create table if not exists growth.leads (
  id                   uuid primary key default gen_random_uuid(),
  campaign_id          uuid not null references growth.campaigns (id) on delete cascade,
  full_name            text not null,
  email                text not null,
  email_normalized     text not null,
  university           text,
  facebook             text,
  instagram            text,
  favorite_destination text,
  why_explore          text,
  referral_code        text not null unique,
  referred_by_lead_id  uuid references growth.leads (id) on delete set null,
  position             integer not null,
  status               text not null default 'new'
    check (status in ('new','email_verified','qualified','invited','converted','blocked','unsubscribed')),
  score                integer not null default 0,
  signup_ip            text,
  user_agent           text,
  metadata             jsonb not null default '{}'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (campaign_id, email_normalized)
);

create index if not exists leads_campaign_idx   on growth.leads (campaign_id);
create index if not exists leads_score_idx       on growth.leads (campaign_id, score desc, created_at asc);
create index if not exists leads_university_idx  on growth.leads (campaign_id, university);
create index if not exists leads_referred_by_idx on growth.leads (referred_by_lead_id);

-- ── referral_events (audit + anti double-credit) ────────────────────────────
create table if not exists growth.referral_events (
  id               uuid primary key default gen_random_uuid(),
  campaign_id      uuid not null references growth.campaigns (id) on delete cascade,
  referrer_lead_id uuid not null references growth.leads (id) on delete cascade,
  referred_lead_id uuid not null references growth.leads (id) on delete cascade,
  event_type       text not null default 'signup'
    check (event_type in ('signup','email_verified','qualified','converted')),
  points           integer not null default 0,
  created_at       timestamptz not null default now(),
  unique (campaign_id, referrer_lead_id, referred_lead_id, event_type)
);
create index if not exists referral_events_referrer_idx on growth.referral_events (referrer_lead_id);

-- ── RLS: deny-all to anon/authenticated; only the service role (API) touches it ─
alter table growth.campaigns       enable row level security;
alter table growth.leads           enable row level security;
alter table growth.referral_events enable row level security;
-- (no policies created on purpose → no anon/authed access; service_role bypasses RLS)

-- ── signup RPC (atomic: position, referral credit, scoring) ──────────────────
-- Returns the new lead's public-safe fields. SECURITY DEFINER so it can read/
-- write across rows; runs as table owner. Points: referral signup = 20 to referrer.
create or replace function growth.signup_lead(
  p_campaign_slug text,
  p_full_name     text,
  p_email         text,
  p_university    text,
  p_facebook      text,
  p_instagram     text,
  p_favorite      text,
  p_why           text,
  p_ref_code      text,
  p_ip            text,
  p_user_agent    text
)
returns table (
  lead_id       uuid,
  referral_code text,
  position      integer,
  duplicate     boolean
)
language plpgsql
security definer
set search_path = growth, public
as $$
declare
  v_campaign  uuid;
  v_email_n   text := lower(trim(p_email));
  v_existing  growth.leads%rowtype;
  v_referrer  uuid;
  v_code      text;
  v_pos       integer;
  v_id        uuid;
begin
  select id into v_campaign from growth.campaigns where slug = p_campaign_slug and status = 'active';
  if v_campaign is null then
    raise exception 'CAMPAIGN_NOT_FOUND';
  end if;

  -- Idempotent: same email in same campaign → return the existing record.
  select * into v_existing from growth.leads
   where campaign_id = v_campaign and email_normalized = v_email_n;
  if found then
    return query select v_existing.id, v_existing.referral_code, v_existing.position, true;
    return;
  end if;

  -- Resolve referrer (must be a real, different lead in this campaign).
  if p_ref_code is not null and length(trim(p_ref_code)) > 0 then
    select id into v_referrer from growth.leads
     where campaign_id = v_campaign and referral_code = upper(trim(p_ref_code));
  end if;

  -- Next position in this campaign.
  select coalesce(max(position), 0) + 1 into v_pos from growth.leads where campaign_id = v_campaign;

  -- Collision-resistant referral code: TO-<NAME>-<RAND>.
  v_code := 'TO-' ||
            coalesce(nullif(upper(regexp_replace(p_full_name, '[^a-zA-Z0-9]', '', 'g')), ''), 'OTTI')
              || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 5));
  loop
    exit when not exists (select 1 from growth.leads where referral_code = v_code);
    v_code := 'TO-OTTI-' || upper(substr(md5(gen_random_uuid()::text), 1, 5));
  end loop;

  insert into growth.leads (
    campaign_id, full_name, email, email_normalized, university, facebook, instagram,
    favorite_destination, why_explore, referral_code, referred_by_lead_id, position,
    signup_ip, user_agent
  ) values (
    v_campaign, p_full_name, p_email, v_email_n, nullif(p_university,''), nullif(p_facebook,''),
    nullif(p_instagram,''), nullif(p_favorite,''), nullif(p_why,''), v_code, v_referrer, v_pos,
    p_ip, p_user_agent
  ) returning id into v_id;

  -- Credit the referrer (audit row + score), guarded against double credit.
  if v_referrer is not null then
    insert into growth.referral_events (campaign_id, referrer_lead_id, referred_lead_id, event_type, points)
    values (v_campaign, v_referrer, v_id, 'signup', 20)
    on conflict do nothing;
    update growth.leads set score = score + 20, updated_at = now() where id = v_referrer;
  end if;

  return query select v_id, v_code, v_pos, false;
end;
$$;

revoke all on function growth.signup_lead(text,text,text,text,text,text,text,text,text,text,text) from public, anon, authenticated;

-- ── public leaderboard view (safe columns only — never email/socials) ────────
create or replace view growth.v_leaderboard as
select
  l.campaign_id,
  l.referral_code,
  coalesce(nullif(l.full_name,''), 'Explorer') as display_name,
  l.university,
  l.score,
  (select count(*) from growth.referral_events re
     where re.referrer_lead_id = l.id and re.event_type = 'signup') as invites,
  rank() over (partition by l.campaign_id order by l.score desc, l.created_at asc) as rank
from growth.leads l
where l.status not in ('blocked','unsubscribed');

-- ── seed the launch campaign ────────────────────────────────────────────────
insert into growth.campaigns (slug, name, status)
values ('founders-waitlist', 'Missing Otti — Founding Explorers', 'active')
on conflict (slug) do nothing;
