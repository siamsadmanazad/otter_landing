-- Locked admin-export wrapper: full lead rows for the campaign, service-role only.
-- The growth schema stays private; this exposes a single function in public that
-- only the server (service_role) can execute. Used by /api/admin/leads (secret-gated).

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
    l.position as lead_position, l.score, l.status, l.created_at
  from growth.leads l
  join growth.campaigns c on c.id = l.campaign_id
  left join growth.leads r on r.id = l.referred_by_lead_id
  where c.slug = 'founders-waitlist'
  order by l.created_at asc;
$$;

revoke all on function public.founders_export() from public, anon, authenticated;
grant execute on function public.founders_export() to service_role;
