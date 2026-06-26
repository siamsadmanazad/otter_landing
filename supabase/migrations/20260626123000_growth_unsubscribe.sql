-- Unsubscribe support (CAN-SPAM / deliverability): a stable per-lead token + a one-click
-- opt-out RPC. signup_lead now also returns the unsubscribe token so the welcome email can
-- embed the footer link. The leaderboard view already excludes 'unsubscribed' leads.

alter table growth.leads add column if not exists unsubscribe_token uuid not null default gen_random_uuid();
create unique index if not exists leads_unsubscribe_token_idx on growth.leads (unsubscribe_token);

-- ── signup RPC: same logic, now also returns the unsubscribe token ───────────
drop function if exists growth.signup_lead(text,text,text,text,text,text,text,text,text,text,text,boolean,text,text,text,text,text);

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
  o_lead_id           uuid,
  o_referral_code     text,
  o_lead_position     integer,
  o_duplicate         boolean,
  o_verify_token      uuid,
  o_verified          boolean,
  o_unsubscribe_token uuid
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
  v_unsub     uuid;
  v_pos       integer;
  v_id        uuid;
  v_burst     integer;
begin
  select id into v_campaign from growth.campaigns where slug = p_campaign_slug and status = 'active';
  if v_campaign is null then
    raise exception 'CAMPAIGN_NOT_FOUND';
  end if;

  select * into v_existing from growth.leads l
   where l.campaign_id = v_campaign and l.email_normalized = v_email_n;
  if found then
    return query select v_existing.id, v_existing.referral_code, v_existing.position, true,
                        v_existing.verify_token, (v_existing.verified_at is not null),
                        v_existing.unsubscribe_token;
    return;
  end if;

  if p_ip is not null and length(trim(p_ip)) > 0 then
    select count(*) into v_burst from growth.leads l
     where l.signup_ip = p_ip and l.created_at > now() - interval '60 seconds';
    if v_burst >= 5 then
      raise exception 'RATE_LIMITED';
    end if;
  end if;

  if p_ref_code is not null and length(trim(p_ref_code)) > 0 then
    select l.id into v_referrer from growth.leads l
     where l.campaign_id = v_campaign and l.referral_code = upper(trim(p_ref_code));
  end if;

  select coalesce(max(l.position), 0) + 1 into v_pos from growth.leads l where l.campaign_id = v_campaign;

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
  ) returning id, unsubscribe_token into v_id, v_unsub;

  if v_referrer is not null then
    insert into growth.referral_events (campaign_id, referrer_lead_id, referred_lead_id, event_type, points)
    values (v_campaign, v_referrer, v_id, 'signup', 0)
    on conflict do nothing;
  end if;

  return query select v_id, v_code, v_pos, false, v_token, false, v_unsub;
end;
$$;

revoke all on function growth.signup_lead(text,text,text,text,text,text,text,text,text,text,text,boolean,text,text,text,text,text) from public, anon, authenticated;

-- ── unsubscribe RPC ─────────────────────────────────────────────────────────
create or replace function growth.unsubscribe_lead(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = growth, public
as $$
declare
  v_found integer;
begin
  if p_token is null then
    return false;
  end if;
  update growth.leads set status = 'unsubscribed', updated_at = now()
   where unsubscribe_token = p_token and status <> 'unsubscribed';
  get diagnostics v_found = row_count;
  -- true if the token matched a lead (even if already unsubscribed)
  return v_found > 0 or exists (select 1 from growth.leads where unsubscribe_token = p_token);
end;
$$;

revoke all on function growth.unsubscribe_lead(uuid) from public, anon, authenticated;

-- ── public wrappers v3: founders_signup now returns the unsubscribe token; add founders_unsubscribe ──
drop function if exists public.founders_signup(text,text,text,text,text,text,text,text,text,text,boolean,text,text,text,text,text);

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
  lead_id           uuid,
  referral_code     text,
  lead_position     integer,
  duplicate         boolean,
  verify_token      uuid,
  verified          boolean,
  unsubscribe_token uuid
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

create or replace function public.founders_unsubscribe(p_token uuid)
returns boolean
language sql
security definer
set search_path = growth, public
as $$
  select growth.unsubscribe_lead(p_token);
$$;

revoke all on function public.founders_signup(text,text,text,text,text,text,text,text,text,text,boolean,text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.founders_unsubscribe(uuid) from public, anon, authenticated;
grant execute on function public.founders_signup(text,text,text,text,text,text,text,text,text,text,boolean,text,text,text,text,text) to service_role;
grant execute on function public.founders_unsubscribe(uuid) to service_role;
