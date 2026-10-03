-- Run once in your Supabase project's SQL Editor. No public read/write policies.
create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(trim(email)) and char_length(email) <= 254),
  created_at timestamptz not null default now(),
  consent_version text not null default 'early-access-2026-10-03',
  source text not null default 'landing-page'
);
create table if not exists public.waitlist_request_limits (
  client_hash text not null,
  window_start timestamptz not null,
  attempts integer not null default 1,
  primary key (client_hash, window_start)
);
alter table public.waitlist_signups enable row level security;
alter table public.waitlist_request_limits enable row level security;
revoke all on public.waitlist_signups, public.waitlist_request_limits from anon, authenticated;
grant all on public.waitlist_signups, public.waitlist_request_limits to service_role;

-- Server only. Identical results for new and duplicate emails prevent enumeration.
create or replace function public.join_blyth_waitlist(p_email text, p_client_hash text)
returns text language plpgsql security definer set search_path = ''
as $$
declare
  attempts_now integer;
  normalized_email text := lower(trim(p_email));
begin
  if normalized_email is null or char_length(normalized_email) > 254
     or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
     or p_client_hash is null or p_client_hash !~ '^[a-f0-9]{64}$' then
    return 'invalid';
  end if;
  delete from public.waitlist_request_limits where window_start < now() - interval '1 day';
  insert into public.waitlist_request_limits (client_hash, window_start)
    values (p_client_hash, date_trunc('hour', now()))
    on conflict (client_hash, window_start) do update
      set attempts = public.waitlist_request_limits.attempts + 1
    returning attempts into attempts_now;
  if attempts_now > 5 then return 'limited'; end if;
  insert into public.waitlist_signups (email) values (normalized_email)
    on conflict (email) do nothing;
  return 'accepted';
end;
$$;
revoke all on function public.join_blyth_waitlist(text, text) from public, anon, authenticated;
grant execute on function public.join_blyth_waitlist(text, text) to service_role;
