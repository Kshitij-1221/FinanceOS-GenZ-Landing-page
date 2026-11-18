-- Run AFTER waitlist.sql and 002_welcome_email.sql, BEFORE promoting the site.
-- Additive: v2 stays unchanged for the currently live site and rollback.
begin;

create or replace function public.join_blyth_waitlist_v3(
  p_email text, p_client_hash text, p_consent_version text
)
returns text language plpgsql security definer set search_path = '' as $$
declare result text;
begin
  if p_consent_version is null or p_consent_version not in (
    'welcome-and-early-access-2026-10-23',
    'welcome-and-early-access-2026-11-18'
  ) then
    return 'invalid';
  end if;
  result := public.join_blyth_waitlist(p_email, p_client_hash);
  if result <> 'accepted' then return result; end if;
  update public.waitlist_signups set consent_version = p_consent_version
    where email = lower(trim(p_email));
  insert into public.waitlist_welcome_outbox(signup_id)
    select id from public.waitlist_signups where email = lower(trim(p_email))
    on conflict do nothing;
  return 'accepted';
end;
$$;

revoke all on function public.join_blyth_waitlist_v3(text,text,text) from public, anon, authenticated;
grant execute on function public.join_blyth_waitlist_v3(text,text,text) to service_role;

commit;
