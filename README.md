# FinanceOS-GenZ-Landing-page
Pre-launch landing page for FinanceOS — a calm, local-first  personal finance app for Gen-Z India. 🫙

# FinanceOS — Landing Page

The pre-launch landing page for **FinanceOS** — a calm, local-first personal finance app for Gen-Z India. Watch your savings fill up. 🫙

🔗 **Live:** [financeos.vercel.app](https://financeos.vercel.app) *(coming soon)*  
📱 **The app:** [FinanceOS mobile app repo](https://github.com/Kshitij-1221/FinanceOS-GenZ) *(private/in-progress)*

---

## ✨ About FinanceOS

FinanceOS turns saving from a chore into a calm visual ritual.  
Set a goal. Watch your jar fill. The only rule? Don't break it.

- **Local-first** — your money data lives on your phone, never on our servers
- **No bank logins** — no risky aggregation, no plaid wiring
- **No ads, ever** — and **0** trackers
- **Made for India** — rupees, salary-cycle, SIPs, family money realities

This repo is the marketing landing page. The mobile app lives in a separate repo.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + custom design tokens
- **Animation:** Framer Motion + Tailwind keyframes
- **Fonts:** Unbounded · Outfit · JetBrains Mono (via `next/font`)
- **Email capture:** Formspree (no backend)
- **Hosting:** Vercel

No database, no backend server — fully static + a form endpoint.

---

## 🚀 Run Locally

```bash
git clone https://github.com/[YOUR_USERNAME]/financeos-landing.git
cd financeos-landing
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

```bash
cp .env.example .env.local
```

Add your Formspree endpoint:

```env
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

(If unset, the email form falls back to a local preview success state so the page still demos cleanly.)

---

## 📸 Preview

![FinanceOS landing page](./public/og/preview.png)

---

## 📂 Structure

app/
layout.tsx, page.tsx, globals.css, fonts.ts
components/
HeroV2.tsx              # 2 pills on a glowing line + watermark jars
TrustBarV2.tsx          # honest, pre-launch-proof stats
Nav.tsx, Footer.tsx
LandingJar.tsx          # the signature animated jar
sections/
Problem.tsx, Solution.tsx, PhoneShowcase.tsx,
FeaturesGrid.tsx, Calculator.tsx, Privacy.tsx,
HowItWorks.tsx, FAQ.tsx, FinalCTA.tsx
public/
img/                    # app screenshots used in PhoneShowcase

---

## 🎨 Design Notes

- Black + gold theme (`#050505` · `#d4af37` · `#fcd34d`)
- Purple/blue (`#7c3aed → #3b82f6`) appears **only** in the hero pills + chain — a single intentional electric accent
- Mobile-first, fully responsive
- `prefers-reduced-motion` respected throughout


---

## 👤 Built by

[Kshitij](github.com/Kshitij-1221) — indie founder building FinanceOS solo in India 🇮🇳

---

## 📄 License

[MIT](./LICENSE) — feel free to fork the structure / draw inspiration, but please don't lift the FinanceOS brand, copy, or jar design wholesale.
