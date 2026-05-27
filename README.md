# FinanceOS — Landing Page

Standalone Next.js landing page. Lives in this folder only — no shared code
with the React Native app in `../financeos/`.

## Run locally

```bash
cd Landing-Page-v1
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Tech

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with design tokens centralized in `tailwind.config.ts`
- **Framer Motion** for scroll reveals (sections beyond the hero will use it)
- **`next/font`** for Outfit (body) / Unbounded (display) / JetBrains Mono (numbers)
- No state library, no database, no API routes
- One form: the FinalCTA email capture posts to Formspree (no backend)

## Project structure

```
Landing-Page-v1/
├── app/
│   ├── layout.tsx          # root layout — fonts + metadata
│   ├── page.tsx            # composes every section in order
│   ├── globals.css         # tokens, keyframes, glow-pill, chain, gold gradient
│   └── fonts.ts            # next/font config
├── components/
│   ├── HeroV2.tsx          # ★ the hero — 2 pills on a connecting line
│   ├── TrustBarV2.tsx
│   ├── Nav.tsx             # floating glass pill nav
│   ├── Footer.tsx
│   ├── LandingJar.tsx      # the reusable jar (used everywhere)
│   ├── LogoMark.tsx
│   ├── Overline.tsx
│   ├── Reveal.tsx          # IntersectionObserver-based reveal wrapper
│   └── sections/
│       ├── Problem.tsx
│       ├── Solution.tsx
│       ├── PhoneShowcase.tsx
│       ├── FeaturesGrid.tsx
│       ├── Calculator.tsx
│       ├── Privacy.tsx
│       ├── HowItWorks.tsx
│       ├── FAQ.tsx
│       └── FinalCTA.tsx
├── public/
│   └── img/                # drop your app screenshots in here
├── .env.example
├── next.config.mjs
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Email capture

The `FinalCTA` form POSTs the email to **Formspree**:

1. Sign in to <https://formspree.io>, create a form, copy the form URL.
2. `cp .env.example .env.local`
3. Paste your form URL into `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
4. Restart `npm run dev`.

Until you set the env var, the form will fall back to a local "preview"
success state (no network call) so you can still demo the page.

## App screenshots (PhoneShowcase)

The PhoneShowcase section expects PNGs at:

- `public/img/screen-promise.png`
- `public/img/screen-dashboard2.png`
- `public/img/screen-welcome.png`

Drop them in `public/img/` (names match the design source). The component
falls back to a styled placeholder if the file is missing.

## Vercel-ready

Standard Next.js 14 — no special build config. Vercel will auto-detect.

```bash
vercel        # link the project
vercel --prod # ship
```

Don't forget to set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in the Vercel project
settings (Production + Preview environments).

## Status

This scaffold has a **fully built hero** plus minimal stubs for the other
sections so the page compiles end-to-end. Each remaining section
(Problem → Footer) gets built faithfully from the design files in
follow-up commits.
