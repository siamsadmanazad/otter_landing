-- Lead-quality hardening for the growth schema:
--   • consent (marketing permission) + timestamp — lawful outreach proof
--   • UTM attribution columns — know which channel produced real users
--   • email verification (double opt-in): verify_token + verified_at
--   • email_logs — delivery audit (DB is the source of truth, Resend is just the postman)
--   • abuse-resistant scoring: referrer earns 0 at signup; real points only after the
--     referred lead VERIFIES email (lead +10, referrer +40). Raw signups can't move the board.
--   • per-IP burst rate-limit inside signup_lead (script floods, NAT-friendly 60s window)

-- ── new lead columns ─────────────────────────────────────────────────────────
alter table growth.leads add column if not exists consent_marketing boolean not null default false;
alter table growth.leads add column if not exists consent_at        timestamptz;
alter table growth.leads add column if not exists utm_source        text;
alter table growth.leads add column if not exists utm_medium        text;
alter table growth.leads add column if not exists utm_campaign      text;
alter table growth.leads add column if not exists utm_term          text;
alter table growth.leads add column if not exists utm_content       text;
alter table growth.leads add column if not exists verify_token      uuid;
alter table growth.leads add column if not exists verified_at       timestamptz;

create unique index if not exists leads_verify_token_idx on growth.leads (verify_token);
create index        if not exists leads_ip_recent_idx    on growth.leads (signup_ip, created_at desc);

-- ── email delivery audit ─────────────────────────────────────────────────────
create table if not exists growth.email_logs (
  id                  uuid primary key default gen_random_uuid(),
  lead_id             uuid references growth.leads (id) on delete set null,
  email_type          text not null,           -- 'welcome_verify' | 'launch' | ...
  recipient           text not null,
  provider            text not null default 'resend',
  provider_message_id text,
  status              text not null default 'queued',  -- queued|sent|failed
  error_message       text,
  created_at          timestamptz not null default now()
);
create index if not exists email_logs_lead_idx on growth.email_logs (lead_id);

alter table growth.email_logs enable row level security;  -- deny-all; service_role bypasses

-- ── signup RPC (now: consent + utm + rate-limit + verify token; referrer 0 at signup) ──
drop function if exists growth.signup_lead(text,text,text,text,text,text,text,text,text,text,text);

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
  p_user_agent    text,
  p_consent       boolean,
  p_utm_source    text,
  p_utm_medium    text,
  p_utm_campaign  text,
  p_utm_term      text,
  p_utm_content   text
)
returns table (
  o_lead_id        uuid,
  o_referral_code  text,
  o_lead_position  integer,
  o_duplicate      boolean,
  o_verify_token   uuid,
  o_verified       boolean
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
  v_token     uuid := gen_random_uuid();
  v_pos       integer;
  v_id        uuid;
  v_burst     integer;
begin
  select id into v_campaign from growth.campaigns where slug = p_campaign_slug and status = 'active';
  if v_campaign is null then
    raise exception 'CAMPAIGN_NOT_FOUND';
  end if;

  -- Idempotent: same email in same campaign → return the existing record (with its token,
  -- so an unverified returning visitor can still be re-emailed).
  select * into v_existing from growth.leads l
   where l.campaign_id = v_campaign and l.email_normalized = v_email_n;
  if found then
    return query select v_existing.id, v_existing.referral_code, v_existing.position, true,
                        v_existing.verify_token, (v_existing.verified_at is not null);
    return;
  end if;

  -- Anti-flood backstop: cap signups per IP in a short burst window (60s). Lenient enough for
  -- shared campus NAT; honeypot + Turnstile are the primary bot defense in the route layer.
  if p_ip is not null and length(trim(p_ip)) > 0 then
    select count(*) into v_burst from growth.leads l
     where l.signup_ip = p_ip and l.created_at > now() - interval '60 seconds';
    if v_burst >= 5 then
      raise exception 'RATE_LIMITED';
    end if;
  end if;

  -- Resolve referrer (a real lead in this campaign).
  if p_ref_code is not null and length(trim(p_ref_code)) > 0 then
    select l.id into v_referrer from growth.leads l
     where l.campaign_id = v_campaign and l.referral_code = upper(trim(p_ref_code));
  end if;

  -- Next position in this campaign.
  select coalesce(max(l.position), 0) + 1 into v_pos from growth.leads l where l.campaign_id = v_campaign;

  -- Collision-resistant referral code: TO-<NAME>-<RAND>.
  v_code := 'TO-' ||
            coalesce(nullif(upper(regexp_replace(p_full_name, '[^a-zA-Z0-9]', '', 'g')), ''), 'OTTI')
              || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 5));
  loop
    exit when not exists (select 1 from growth.leads l where l.referral_code = v_code);
    v_code := 'TO-OTTI-' || upper(substr(md5(gen_random_uuid()::text), 1, 5));
  end loop;

  insert into growth.leads (
    campaign_id, full_name, email, email_normalized, university, facebook, instagram,
    favorite_destination, why_explore, referral_code, referred_by_lead_id, position,
    signup_ip, user_agent, verify_token,
    consent_marketing, consent_at,
    utm_source, utm_medium, utm_campaign, utm_term, utm_content
  ) values (
    v_campaign, p_full_name, p_email, v_email_n, nullif(p_university,''), nullif(p_facebook,''),
    nullif(p_instagram,''), nullif(p_favorite,''), nullif(p_why,''), v_code, v_referrer, v_pos,
    p_ip, p_user_agent, v_token,
    coalesce(p_consent, false), case when coalesce(p_consent, false) then now() else null end,
    nullif(p_utm_source,''), nullif(p_utm_medium,''), nullif(p_utm_campaign,''),
    nullif(p_utm_term,''), nullif(p_utm_content,'')
  ) returning id into v_id;

  -- Record the referral LINK (for invite counts) but award 0 points — points come on verify.
  if v_referrer is not null then
    insert into growth.referral_events (campaign_id, referrer_lead_id, referred_lead_id, event_type, points)
    values (v_campaign, v_referrer, v_id, 'signup', 0)
    on conflict do nothing;
  end if;

  return query select v_id, v_code, v_pos, false, v_token, false;
end;
$$;

revoke all on function growth.signup_lead(text,text,text,text,text,text,text,text,text,text,text,boolean,text,text,text,text,text) from public, anon, authenticated;

-- ── verify RPC (double opt-in): flip status, award lead +10 / referrer +40, dedup-guarded ──
create or replace function growth.verify_lead(p_token uuid)
returns table (
  o_lead_id       uuid,
  o_referral_code text,
  o_lead_position integer,
  o_already       boolean
)
language plpgsql
security definer
set search_path = growth, public
as $$
declare
  v_lead     growth.leads%rowtype;
  v_inserted integer;
begin
  if p_token is null then
    raise exception 'TOKEN_INVALID';
  end if;

  select * into v_lead from growth.leads l where l.verify_token = p_token;
  if not found then
    raise exception 'TOKEN_INVALID';
  end if;

  -- Already verified → idempotent, no double points.
  if v_lead.verified_at is not null then
    return query select v_lead.id, v_lead.referral_code, v_lead.position, true;
    return;
  end if;

  update growth.leads
     set status = case when status in ('new') then 'email_verified' else status end,
         verified_at = now(),
         score = score + 10,
         updated_at = now()
   where id = v_lead.id;

  -- Credit the referrer once, only now (proof-of-human gate).
  if v_lead.referred_by_lead_id is not null then
    insert into growth.referral_events (campaign_id, referrer_lead_id, referred_lead_id, event_type, points)
    values (v_lead.campaign_id, v_lead.referred_by_lead_id, v_lead.id, 'email_verified', 40)
    on conflict do nothing;
    get diagnostics v_inserted = row_count;
    if v_inserted > 0 then
      update growth.leads set score = score + 40, updated_at = now()
       where id = v_lead.referred_by_lead_id;
    end if;
  end if;

  return query select v_lead.id, v_lead.referral_code, v_lead.position, false;
end;
$$;

revoke all on function growth.verify_lead(uuid) from public, anon, authenticated;
