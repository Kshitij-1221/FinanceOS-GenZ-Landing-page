# Waitlist QA — 3–4 October 2026

## Verified

- All eight endpoint tests pass (`npm run test:waitlist`).
- Production build passes, including TypeScript, lint and generation of all information pages. The viewport metadata warning was fixed.
- Local browser submission of `blyth-qa-20261003@example.com` with explicit consent returned HTTP 200 and displayed **You're in!**.
- A direct, restricted database read confirmed one matching row and consent version `early-access-2026-10-03`.
- Reloading and resubmitting the same email produced the same success UI. A second restricted read still returned exactly one row.
- Privacy page navigation works and displays the configured public support contact.
- The signup screenshot is saved in `waitlist-success-mobile.png`.
- API errors are covered for invalid input, missing consent, oversized body, malformed JSON, foreign origin, honeypot, unavailable configuration, rate limiting and database/network failures. These cases do not produce a false success.
- Server secrets remain in ignored environment configuration. The endpoint returns no email list or database/provider error details.

The single synthetic signup remains visible in Supabase Table Editor for the owner to inspect. No announcement or confirmation email was sent. This feature stores signups; sending the promised announcement is a separate future action.

## Scope

The browser/database checks above used the local Next.js server against the real configured Supabase project. Native app login and financial cloud sync are not part of this waitlist integration.

## Hosted preview — 4 October

- [Vercel preview](https://finance-os-gen-z-landing-page-ojwlcbk6z.vercel.app) deployed successfully with Next.js build, lint and type checks passing.
- All four required environment variables are configured for Preview. The existing Supabase integration already supplied Production database settings; the hash secret and support email were added for Production too. Production itself was not redeployed or tested.
- An authenticated Vercel CLI request with the preview's browser Origin submitted the same synthetic signup: HTTP 200, `{ "ok": true }`.
- A restricted Supabase read after that request still returned one matching row with consent recorded.
- An invalid email sent to the deployed endpoint returned HTTP 400 with a recoverable validation message.
- Preview retains Vercel Authentication. The in-app browser reached its login page, so hosted UI submission was not claimed as tested; form UI was verified locally. Open the preview in a browser signed into the project owner's Vercel account.
- The existing production domain has not been promoted to this feature. No announcement email was sent.

## Production and database recovery — 22 October 2026

- Resumed the existing paused Supabase project through its dashboard. It reached **Healthy**. A restricted read returned HTTP 200 and found the original synthetic signup and consent version intact.
- Production deployment `dpl_52LrkKrDvaKkxPpH7qT2FuEJYGhW` is Ready at https://www.getblyth.com. The existing Vercel project/repository names remain unchanged; public branding is Blyth.
- Page title, navigation, footer and image descriptions use Blyth. The legacy dashboard screenshot's name is replaced with a code-rendered Blyth label in the showcase; its source PNG is otherwise unchanged. Visually checked the deployed showcase in Chrome.
- Added the owned domain as metadata base and Blyth as the Open Graph site name.
- All eight waitlist tests and the production build (including lint/types) passed. Public home, privacy, terms and contact returned HTTP 200 without authentication and contain no FinanceOS text in their HTML.
- Public invalid-email request returned HTTP 400. Consented submission using the existing synthetic email returned HTTP 200 and `{ "ok": true }`.
- The live Chrome form displayed **You're in!** after the same consented submission. A subsequent restricted database read still found exactly one matching row with consent version `early-access-2026-10-03`.
- No announcement email was sent, no new database was created and no paid plan was enabled. Resend production sending-domain setup remains a separate launch step.


## Welcome-email extension — 23 October 2026

- Resend `mail.getblyth.com`: Verified in dashboard at 23:15 IST. Three required DNS records imported into Cloudflare; original Vercel records preserved.
- Additive `002_welcome_email.sql`: passed PGlite tests and installed in live Supabase with Success / no rows returned. No old-list email backfill.
- Automated checks: 17 tests pass; production Next build, TypeScript and diff whitespace check pass. Tests include permission denial, queue lease/deduplication, provider failure, immutable retry payload, stale-attempt reconciliation and cron authentication.
- Mobile HTML preview: 375px rendered width; logo loaded (486px source); document scroll width equals viewport width. Screenshot: `welcome-email-mobile.png`. This is browser preview evidence, not an inbox-rendering test.
- At this checkpoint production activation was pending; completed checks are recorded below on 24 October.
- Existing dependency advisories are recorded in `../WELCOME-EMAIL.md`; no major framework upgrade was mixed into the email change.

## Welcome-email production acceptance — 24 October 2026

- Production deployment `dpl_2wrif8x4L895iq2i2LHmbBQLRw3c` is Ready at https://www.getblyth.com. Domain-scoped sending key and cron secret are server-only Vercel Production settings.
- Submitted the founder’s consenting email through the public form: success UI, exactly one signup, current consent version and one accepted outbox attempt without error.
- Actual Gmail delivery at 12:38 IST from `Blyth <hello@mail.getblyth.com>`, subject **You're on the list — welcome to Blyth**. Gmail placed it in Promotions. Opened and visually verified the shared logo, dark/gold template and welcome content. Local private evidence: `reports/setup/welcome-delivered-gmail.png` (excluded from Git and deployment).
- Reloaded and resubmitted the same address: success UI; the outbox still had one attempt and unchanged acceptance/provider ID. No duplicate send was queued.
- Recovery route without credentials returned 401; an authorized production invocation returned 200 with `{ accepted: 0, queued: 0, skipped: 0 }`. Daily cron is deployed; a scheduled run has not yet been observed.
- No old subscriber backfill or launch announcement was sent. A second consenting recipient/provider remains to be tested; a verified domain cannot guarantee inbox placement. Supabase app OTP sender remains separate.
