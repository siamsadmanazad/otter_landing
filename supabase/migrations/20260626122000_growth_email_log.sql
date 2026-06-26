-- Locked wrapper so the Next.js server (service_role) can append to the private
-- growth.email_logs audit trail after a Resend send. growth stays off the Data API.

create or replace function public.founders_log_email(
  p_lead_id     uuid,
  p_email_type  text,
  p_recipient   text,
  p_provider    text,
  p_message_id  text,
  p_status      text,
  p_error       text
)
returns uuid
language sql
security definer
set search_path = growth, public
as $$
  insert into growth.email_logs (lead_id, email_type, recipient, provider, provider_message_id, status, error_message)
  values (p_lead_id, p_email_type, p_recipient, coalesce(nullif(p_provider,''),'resend'),
          nullif(p_message_id,''), coalesce(nullif(p_status,''),'queued'), nullif(p_error,''))
  returning id;
$$;

revoke all on function public.founders_log_email(uuid,text,text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.founders_log_email(uuid,text,text,text,text,text,text) to service_role;
