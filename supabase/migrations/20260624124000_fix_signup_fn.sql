-- Fix: drop+recreate growth.signup_lead (renamed OUT params → return-type change).
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
  p_user_agent    text
)
returns table (
  o_lead_id        uuid,
  o_referral_code  text,
  o_lead_position  integer,
  o_duplicate      boolean
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
  select * into v_existing from growth.leads l
   where l.campaign_id = v_campaign and l.email_normalized = v_email_n;
  if found then
    return query select v_existing.id, v_existing.referral_code, v_existing.position, true;
    return;
  end if;

  -- Resolve referrer (must be a real, different lead in this campaign).
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