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
