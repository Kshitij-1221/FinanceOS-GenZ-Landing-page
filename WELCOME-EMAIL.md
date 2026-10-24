# Blyth welcome email

Status checked 24 October 2026 — live at https://www.getblyth.com.

## Current rollout

- `mail.getblyth.com` added to Resend (Tokyo) and **Verified** in its dashboard.
- Three exact provider DNS records imported into Cloudflare as DNS-only. The website's existing Vercel records were preserved. Public record values are in `reports/setup/resend-dns.zone`.
- `supabase/002_welcome_email.sql` installed successfully in the existing Supabase project after passing local Postgres tests. It does not bulk-email existing subscribers.
- Code and black/gold welcome template implemented; 17 tests and production build passed.
- **Live 24 October:** sending-only domain-scoped key and cron secret configured in Vercel Production. Deployment `dpl_2wrif8x4L895iq2i2LHmbBQLRw3c` is Ready. A consented production signup delivered the branded welcome to the founder’s Gmail at 12:38 IST (Promotions). Repeating signup left one outbox record, one attempt and the same provider ID. No existing-list backfill was sent.
- Production recovery endpoint: unauthenticated request returned 401; authenticated request returned 200 with an empty queue. The daily schedule is deployed; a scheduled execution itself has not yet been observed.
- App OTP SMTP sender remains a separate setting. Domain verification alone does not replace Supabase's `onboarding@resend.dev` sender.

## What a signup does

The updated form explicitly requests consent for a welcome email and a launch announcement. Its version is `welcome-and-early-access-2026-10-23`. After validation and the existing five-attempt hourly client limit, one database transaction saves the signup and queues one welcome. The server attempts delivery through Resend; the browser receives a signup confirmation, never a claim of inbox delivery.

Cached older forms still call the original RPC and do not silently opt users into the new welcome email. Rejoining through the updated form can queue the first welcome for an existing signup; further joins cannot queue additional welcomes.

The email uses the public shared Blyth logo, a plain-text alternative and a Reply-To pointing to the configured support address. It confirms waitlist membership, not an app account or subscription. No launch date is promised. No click/open tracking is configured on the sending domain.

## Credential follow-up — 24 October

A live sending key was also present in `.env.example`. It was removed before staging/committing; the staged files were checked for Resend credentials. Because it appeared in local diagnostic output, replace it with a new equally scoped key, update local and Vercel Production settings, redeploy, verify the replacement and revoke the old landing key. The owner created the replacement on 24 October. Vercel Production was updated and redeployed as `dpl_3N66yYECeKTD7Dasw3NCjNS7FBgH`. A production signup using Resend’s official delivery-test address returned 200 and one accepted outbox attempt; Resend shows activity on the replacement key. Final revocation of the old landing key is pending owner confirmation in the dashboard. Do not revoke the separate Supabase Onboarding key.

## Server-only settings

Keep `RESEND_API_KEY`, `WAITLIST_FROM_EMAIL`, `CRON_SECRET`, `SUPABASE_SECRET_KEY` and `WAITLIST_HASH_SECRET` out of browser bundles and Git. The sender is `Blyth <hello@mail.getblyth.com>`. `NEXT_PUBLIC_SUPPORT_EMAIL` must be a monitored address that the owner controls; a verified sending domain does not create an inbox.

Put the settings in Vercel **Production** as well as local `.env.local`, then redeploy. `CRON_SECRET` must be a long random value. Vercel sends it as the Bearer token to `/api/internal/welcome`. Requests without the exact token receive 401. The cron runs daily at 06:00 UTC (11:30 IST), within a single daily Hobby schedule. It handles up to 20 eligible queued jobs, with a runtime budget; it is a recovery sweep, not the initial delivery mechanism.

## Duplicate protection and recovery

- One outbox row per signup; private RLS table, service-role RPC permissions only.
- Two-minute database lease prevents simultaneous sends.
- The exact email payload is persisted on first attempt. Every retry uses the same body and `blyth-welcome-v1/<signup UUID>` idempotency key.
- One immediate retry for connection/server failures. Rejected 4xx requests remain queued for operator investigation; resubmission or the recovery sweep can retry within the safe window.
- `accepted_at` and `provider_id` mean Resend accepted the message, **not** that it reached the inbox. Check Resend for delivered, bounced or complained status; delivery webhooks are not implemented.
- Resend's deduplication lasts 24 hours. The app refuses automatic retries more than 23 hours after the first attempt. This prevents duplicate mail after a timeout whose delivery outcome is unknown. Such jobs need manual reconciliation; do not blindly reset their timestamp or generate a fresh key.
- If the provider accepted a message but the database acknowledgement failed, look up the recipient, time and idempotency key in Resend before marking the job accepted. If no message was accepted, an administrator can deliberately retry after confirming that fact. No automatic old-list backfill is provided.
- During beta, inspect pending/error rows and Resend failures daily. A large outage/backlog needs operator attention; the daily sweep is intentionally bounded.
- Removing a signup cascades to its queued message. Also address provider-side retained data when handling removal requests. Support/removal is manual at this stage.

## Verification and remaining acceptance

1. Run `npm run test:waitlist` and `npm run build`.
2. Confirm the sending domain is Verified, both SPF/DKIM records pass and key scope matches.
3. **Passed 24 October:** founder production signup, one database row, one provider acceptance and actual Gmail delivery. Shared logo and dark/gold template visually checked in Gmail.
4. **Passed 24 October:** repeat signup retained the same accepted outbox record and one send attempt.
5. Test another consenting recipient/provider before advertising broad delivery. Never send tests to the synthetic `example.com` signup.
6. **Passed 24 October:** `/api/internal/welcome` rejects unauthenticated callers; authorized invocation succeeds and Vercel cron is configured. Observe the first scheduled run separately.

## Separate launch maintenance

An npm audit on 23 October reported seven existing dependency advisories, including a critical aggregate for Next.js 14.2.35. Its suggested fix is a major Next.js upgrade, so no force upgrade was mixed into this email feature. Assess and patch the framework before treating the public app/landing stack as production-hardened. PGlite was added only as a development test dependency.

References: [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction), [Resend idempotency window](https://resend.com/docs/dashboard/emails/idempotency-keys).
