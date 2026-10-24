-- Run AFTER waitlist.sql. Additive: keeps the original waitlist endpoint working.
-- Existing signups are not bulk emailed. A new, consented form submission queues
-- one welcome per address, including an existing subscriber who explicitly rejoins.
create table if not exists public.waitlist_welcome_outbox (
  signup_id uuid primary key references public.waitlist_signups(id) on delete cascade,
  created_at timestamptz not null default now(),
  payload jsonb,
  first_attempt_at timestamptz,
  lease_until timestamptz,
  lease_token uuid,
  attempts integer not null default 0,
  accepted_at timestamptz,
  provider_id text,
  last_error text
);
alter table public.waitlist_welcome_outbox enable row level security;
revoke all on public.waitlist_welcome_outbox from public, anon, authenticated;
grant all on public.waitlist_welcome_outbox to service_role;

create or replace function public.join_blyth_waitlist_v2(p_email text, p_client_hash text)
returns text language plpgsql security definer set search_path = '' as $$
declare result text;
begin
  result := public.join_blyth_waitlist(p_email, p_client_hash);
  if result <> 'accepted' then return result; end if;
  update public.waitlist_signups set consent_version = 'welcome-and-early-access-2026-10-23'
    where email = lower(trim(p_email));
  insert into public.waitlist_welcome_outbox(signup_id)
    select id from public.waitlist_signups where email = lower(trim(p_email))
    on conflict do nothing;
  return 'accepted';
end;
$$;

-- Serializes concurrent sends. Persist the exact request body so every retry uses
-- the same body and idempotency key, even after a template or sender change.
create or replace function public.claim_blyth_welcome(p_email text, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare job public.waitlist_welcome_outbox; token uuid := gen_random_uuid();
begin
  select o.* into job from public.waitlist_welcome_outbox o
    join public.waitlist_signups s on s.id = o.signup_id
    where s.email = p_email for update of o;
  if not found or job.accepted_at is not null then return null; end if;
  if job.lease_until > now() then return null; end if;
  -- Resend only deduplicates for 24h. Never automatically resend an ambiguous
  -- old attempt: an administrator must reconcile it against Resend's delivery log.
  if job.first_attempt_at < now() - interval '23 hours' then
    update public.waitlist_welcome_outbox set last_error = 'needs_reconciliation'
      where signup_id = job.signup_id;
    return null;
  end if;
  update public.waitlist_welcome_outbox set
    payload = coalesce(payload, p_payload),
    first_attempt_at = coalesce(first_attempt_at, now()),
    lease_until = now() + interval '2 minutes', lease_token = token,
    attempts = attempts + 1
    where signup_id = job.signup_id returning * into job;
  return jsonb_build_object('id', job.signup_id, 'token', token, 'payload', job.payload);
end;
$$;

create or replace function public.finish_blyth_welcome(p_id uuid, p_token uuid, p_provider_id text, p_error text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.waitlist_welcome_outbox set
    accepted_at = case when p_provider_id is not null then now() else accepted_at end,
    provider_id = coalesce(p_provider_id, provider_id),
    last_error = case when p_provider_id is not null then null else left(p_error, 80) end,
    lease_until = null, lease_token = null
    where signup_id = p_id and lease_token = p_token;
  return found;
end;
$$;

create or replace function public.pending_blyth_welcomes()
returns table(email text) language sql security definer set search_path = '' as $$
  select s.email from public.waitlist_welcome_outbox o
    join public.waitlist_signups s on s.id = o.signup_id
    where o.accepted_at is null and (o.lease_until is null or o.lease_until < now())
      and (o.first_attempt_at is null or o.first_attempt_at > now() - interval '23 hours')
    order by o.created_at limit 20;
$$;
revoke all on function public.join_blyth_waitlist_v2(text,text), public.claim_blyth_welcome(text,jsonb), public.finish_blyth_welcome(uuid,uuid,text,text), public.pending_blyth_welcomes() from public, anon, authenticated;
grant execute on function public.join_blyth_waitlist_v2(text,text), public.claim_blyth_welcome(text,jsonb), public.finish_blyth_welcome(uuid,uuid,text,text), public.pending_blyth_welcomes() to service_role;
