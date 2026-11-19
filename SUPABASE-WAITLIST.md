# Supabase waitlist setup and operations

## What is implemented

The visitor enters an email and explicitly agrees to a welcome note and one early-access announcement. `/api/waitlist` validates the request and calls `join_blyth_waitlist_v3` with the submitted approved consent label, using a server-only Supabase key. The database records normalized email, creation time, source and that consent version. Duplicate emails receive the same confirmation and create no extra signup or welcome-queue row; an accepted repeat submission updates the stored consent label. Missing/unknown labels retain the legacy non-welcome `join_blyth_waitlist` path.

The signup, request-limit and welcome-outbox tables have row-level security enabled and deny direct access to anonymous and ordinary authenticated clients. Only the server/service role can call the signup function. The browser never receives the database key or a list of signups.

Abuse protection includes a honeypot, 4 KiB request limit, same-origin browser check, and a persistent five-attempt limit per client hash per UTC hour. The hash uses a private secret, date and client IP; the raw IP is not stored in the database. Old counters are removed on a later request after one day. On Vercel, the handler relies on the platform's client-IP header. Configure a trusted proxy before hosting elsewhere. These controls are a first layer; they do not guarantee protection against distributed abuse.

## First-time setup

1. Create a Supabase project. The existing Blyth project is healthy; it does not need recreating to change region for this prototype.
2. Open **SQL Editor** and run, in order: `supabase/waitlist.sql`, `supabase/002_welcome_email.sql`, then `supabase/003_consent_version.sql`. For the existing project where 001/base and 002 are installed, run only 003. Never promote the new site before 003 succeeds.
3. In the local `.env.local`, set:
   - `SUPABASE_URL`: project URL from the dashboard.
   - `SUPABASE_SECRET_KEY`: server secret from project API Keys (or a legacy service-role key).
   - `WAITLIST_HASH_SECRET`: random private string of at least 32 characters. Preserve the already-generated value for this checkout.
   - `NEXT_PUBLIC_SUPPORT_EMAIL`: an inbox you own and check.
4. Restart the local server. Keep keys out of chat, commits, screenshots and client-side environment variables.
5. Submit the form and inspect **Table Editor → waitlist_signups**. Repeat the same email and verify one row remains.

The current configuration is live at https://www.getblyth.com as of 22 October 2026. The apex domain redirects to www over HTTPS. Production pages, browser signup, validation and duplicate handling were verified against the restored Supabase project. See [QA results](reports/WAITLIST-QA.md).

## Vercel setup

1. Open the existing `finance-os-gen-z-landing-page` project.
2. In **Settings → Environment Variables**, add the same four names and local values for Preview and Production. Mark private keys as sensitive where supported. Do not put them in a GitHub issue or a public environment variable.
3. Run migration 003 in Supabase FIRST (see the release procedure below). Then test the feature-branch preview with an address you own and inspect its consent version.
4. Once the preview is accepted, deploy the chosen commit to Production. The existing live URL stays unchanged until a production deployment is made.
5. Any change to `NEXT_PUBLIC_SUPPORT_EMAIL` requires a new build. Server-side environment changes also require a new deployment to apply to existing deployments.

## Viewing and exporting signups

Open **Supabase → Table Editor → waitlist_signups**. Use the dashboard's export option for a CSV that Excel can open. Treat it as a private contact list. No public export endpoint exists.

The synthetic QA address `blyth-qa-20261003@example.com` was deliberately left as a visible setup check. Exclude it from any announcement/export intended for real subscribers. That original setup test did not send email. Welcome-consented submissions now queue one welcome per address; do not use synthetic addresses for live delivery tests.

## Retention and support

The privacy notice commits to deleting waitlist entries within 90 days after the early-access announcement unless a person separately opts into an ongoing service. Schedule and perform that deletion when announcing; it is not an automated job yet. Process removal/copy requests through the configured support inbox, verifying the requester controls the address. Do not repurpose the list for unrelated marketing.

Supabase Free projects can pause after inactivity. Check project health and a signup before announcing the landing page. If service fails, the visitor sees an error and can retry; the UI does not claim success without database confirmation.

On 22 October 2026 the dashboard confirmed this project was paused. **Resume project → Resume** restored it to Healthy; the existing synthetic signup remained present. If this recurs, resume the existing project rather than creating a replacement database, then test the live form. Free projects with low activity over seven days can pause; paid plans are exempt. No paid upgrade was made. Review this availability limitation before public launch: [Supabase project pausing](https://supabase.com/docs/guides/platform/free-project-pausing).

## Boundaries

This integration captures waitlist emails and sends their requested welcome message. It is separate from app authentication, AI quotas and financial backup; joining this list does not create an app account.


## Consent-version release procedure (003)

**Status, 19 November 2026:** owner authorized live rollout. Migration 003 applied successfully; existence query returned `true`. Live permission check confirmed SECURITY DEFINER, empty search path, no anon/authenticated execution, service_role execution allowed. Preview `7HgTG5LhkFtqGVMu2XGBsdnDZBx1` at commit `7863282` is Ready and a browser signup stored the November label. Production promotion is still pending.

1. In the existing Blyth Supabase project → **SQL Editor → New query**, paste the entire contents of [`supabase/003_consent_version.sql`](supabase/003_consent_version.sql), including `begin`/`commit`, then Run. It only adds/replaces v3 and its permissions; v2 and existing rows remain unchanged. Do not edit or rerun 002 for this release.
2. Verify existence (expect `true`):
   ```sql
   select to_regprocedure('public.join_blyth_waitlist_v3(text,text,text)') is not null as v3_exists;
   ```
3. In Vercel → **finance-os-gen-z-landing-page → Deployments**, find the Ready **Preview** for `feature/supabase-waitlist` at the consent-fix commit. Check its commit SHA, not just its date. If no preview was generated by the Git integration, create a Preview from this branch; do not select Production yet.
4. Confirm the required settings are present for the environment being tested: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `WAITLIST_HASH_SECRET`, `RESEND_API_KEY`, `WAITLIST_FROM_EMAIL`, `NEXT_PUBLIC_SUPPORT_EMAIL`, `CRON_SECRET`. The production variables must point to the Supabase project where 003 ran. Keep values private; no new credential is required for v3. Live inspection on 19 November found `RESEND_API_KEY`, `WAITLIST_FROM_EMAIL` and `CRON_SECRET` scoped to Production only; preview queues welcome jobs without sending immediately. Both environments use the shared waitlist database. Keep this separation unless intentionally changing it; verify delivery through production before concluding the email check.
5. Open the preview. Submit an address you own with the consent box checked. Check the welcome inbox and **Supabase → Table Editor → waitlist_signups → consent_version**: expect `welcome-and-early-access-2026-11-18`. Repeating the same address must not create another row or welcome job. To test a new welcome delivery, use another owned address because existing welcome jobs are deliberately deduplicated.
6. In that preview deployment's **…** menu choose **Promote to Production**, review the target domains (`getblyth.com` / `www.getblyth.com`), and confirm. Preview promotion rebuilds with **Production** environment variables. Wait for Ready/Current before announcing.
7. On iPhone Safari open `https://www.getblyth.com`, tap **Get early access**, submit an owned test address, check success/welcome email and the November consent label in Supabase. Check `/privacy`, `/terms` and `/contact` too. This is website verification; no native app rebuild is needed.

[Vercel promotion instructions](https://vercel.com/docs/deployments/promoting-a-deployment). If promotion fails, keep the previous production deployment. Rolling back the site to v2 remains possible because migration 003 leaves v2 intact; do not drop v2 or rewrite existing consent records. The migration cannot infer which wording earlier mislabelled signups saw and does not backfill them.

v3 rejects null, empty and unknown labels with `invalid` before signup, counter or outbox writes. It only accepts `welcome-and-early-access-2026-10-23` and `welcome-and-early-access-2026-11-18`. It remains `security definer`, has an empty `search_path`, and grants execute only to `service_role` (not PUBLIC/anon/authenticated). Existing email validation, rate limiting and one-welcome-per-address behavior are retained. A fresh welcome signup will fail honestly until v3 exists; do not promote early.

Local verification, 19 November 2026: `npx tsc --noEmit`, `npm run build`, and `npm run test:waitlist` passed (18 tests, zero failures/skips). PGlite tests execute the migrations and verify exact labels, invalid-label no-write behavior, v2 definition/behavior preservation, duplicates, rate limits, empty search path and role permissions. HTTP tests verify the submitted label reaches v3; non-welcome callers retain the original path. No live SQL or email delivery test was run.

Live rollout evidence, 19 November 2026: the owned `kshitij.1203+consent-20261119@gmail.com` browser test produced one signup with `welcome-and-early-access-2026-11-18` and one welcome job. Initial queue state had zero attempts; subsequent read confirmed `accepted_at` set, one attempt and no error. This proves provider acceptance, not Gmail inbox placement. No secret values were printed or configuration scopes changed. Production promotion remains pending while the owner is using Chrome.
