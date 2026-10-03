# Supabase waitlist setup and operations

## What is implemented

The visitor enters an email and explicitly agrees to one early-access announcement. `/api/waitlist` validates the request and calls `join_blyth_waitlist` using a server-only Supabase key. The database records normalized email, creation time, source and consent version. Duplicate emails receive the same confirmation and create no extra row.

Both tables have row-level security enabled and deny direct access to anonymous and ordinary authenticated clients. Only the server/service role can call the signup function. The browser never receives the database key or a list of signups.

Abuse protection includes a honeypot, 4 KiB request limit, same-origin browser check, and a persistent five-attempt limit per client hash per UTC hour. The hash uses a private secret, date and client IP; the raw IP is not stored in the database. Old counters are removed on a later request after one day. On Vercel, the handler relies on the platform's client-IP header. Configure a trusted proxy before hosting elsewhere. These controls are a first layer; they do not guarantee protection against distributed abuse.

## First-time setup

1. Create a Supabase project. The existing Blyth project is healthy; it does not need recreating to change region for this prototype.
2. Open **SQL Editor**, paste `supabase/waitlist.sql`, and run it.
3. In the local `.env.local`, set:
   - `SUPABASE_URL`: project URL from the dashboard.
   - `SUPABASE_SECRET_KEY`: server secret from project API Keys (or a legacy service-role key).
   - `WAITLIST_HASH_SECRET`: random private string of at least 32 characters. Preserve the already-generated value for this checkout.
   - `NEXT_PUBLIC_SUPPORT_EMAIL`: an inbox you own and check.
4. Restart the local server. Keep keys out of chat, commits, screenshots and client-side environment variables.
5. Submit the form and inspect **Table Editor → waitlist_signups**. Repeat the same email and verify one row remains.

The current local configuration has been connected to the user's project and a real signup verified. This does not automatically configure Vercel.

## Vercel setup

1. Open the existing `finance-os-gen-z-landing-page` project.
2. In **Settings → Environment Variables**, add the same four names and local values for Preview and Production. Mark private keys as sensitive where supported. Do not put them in a GitHub issue or a public environment variable.
3. Deploy this feature branch to a preview first. Test a consented signup and inspect its database row.
4. Once the preview is accepted, deploy the chosen commit to Production. The existing live URL stays unchanged until a production deployment is made.
5. Any change to `NEXT_PUBLIC_SUPPORT_EMAIL` requires a new build. Server-side environment changes also require a new deployment to apply to existing deployments.

## Viewing and exporting signups

Open **Supabase → Table Editor → waitlist_signups**. Use the dashboard's export option for a CSV that Excel can open. Treat it as a private contact list. No public export endpoint exists.

The synthetic QA address `blyth-qa-20261003@example.com` was deliberately left as a visible setup check. Exclude it from any announcement/export intended for real subscribers. No email is sent automatically by this integration.

## Retention and support

The privacy notice commits to deleting waitlist entries within 90 days after the early-access announcement unless a person separately opts into an ongoing service. Schedule and perform that deletion when announcing; it is not an automated job yet. Process removal/copy requests through the configured support inbox, verifying the requester controls the address. Do not repurpose the list for unrelated marketing.

Supabase Free projects can pause after inactivity. Check project health and a signup before announcing the landing page. If service fails, the visitor sees an error and can retry; the UI does not claim success without database confirmation.

## Boundaries

This is email capture, not app authentication, financial cloud backup or a newsletter sender. App login, user-level AI limits, account deletion and cloud sync need separate implementation before those features are offered.
