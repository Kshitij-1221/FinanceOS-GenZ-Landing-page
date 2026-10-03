# Blyth landing page

Next.js 14, React, TypeScript and Tailwind landing page for Blyth. The email form stores consented early-access signups in Supabase through a server-side API. A waitlist signup does not create an app account.

## Run locally

```sh
npm install
# For a new checkout only; do not overwrite an existing configured file.
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Complete the database setup in [SUPABASE-WAITLIST.md](SUPABASE-WAITLIST.md) before testing signups. Missing configuration produces an error, never a pretend success.

## Configuration

Keep `SUPABASE_URL`, `SUPABASE_SECRET_KEY` and `WAITLIST_HASH_SECRET` on the server. Never prefix the secret key with `NEXT_PUBLIC_`. `NEXT_PUBLIC_SUPPORT_EMAIL` is the public address shown on the privacy and contact pages. Local environment files are ignored by Git.

## Validation

```sh
npm run test:waitlist
npm run build
```

The eight endpoint tests cover consent, validation, normalization, request bounds, origin checks, bot honeypot, rate limits, duplicate responses and provider failures. See [reports/WAITLIST-QA.md](reports/WAITLIST-QA.md) for the live Supabase/browser results.

## Main files

- `components/sections/FinalCTA.tsx`: consent, submission and confirmation UI.
- `app/api/waitlist/route.ts` and `lib/waitlist.ts`: server-only signup endpoint.
- `supabase/waitlist.sql`: private tables and atomic signup/rate-limit function.
- `app/privacy`, `app/contact`, `app/terms`: working information pages.

## Deployment

Use the existing Vercel project linked to this repository. Configure all four environment variables for Preview and Production, then deploy the selected branch. Public support details are baked into the build, so redeploy after changing them. The complete setup and operator checklist are in [SUPABASE-WAITLIST.md](SUPABASE-WAITLIST.md).
