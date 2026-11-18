# Blyth landing page: copy remake

Complete rewrite of every string on getblyth.com, its subpages, metadata, form states and image alt text. Draft v2, 18 Nov 2026 (Claude). **Nothing here is live.** Sections go to Codex only after they're marked ✅.

How to review: read **Part A** once (the strategy). Then go through Part B section by section. Each line shows **Now → New**; where there's a real choice there's an **Alt**. Mark each section ✅, or write changes beside it.

---

# Part A: strategy

## A1. What the page must make people feel and do
In 10 seconds a visitor should know three things:
1. **What it is:** a money tracker built around one picture, a jar that shows what's left to save.
2. **Why it's different:** you set up your month once; the jar does the maths; no bank login; no ads.
3. **What to do:** join early access.

## A2. Positioning line (internal, guides everything)
> **Blyth turns your salary, bills, SIPs and spending into one simple jar, so you always know what's left to save.**

## A3. The story the page tells (section order stays the same)
| # | Section | Job in the story |
| --- | --- | --- |
| 1 | Hero | The promise: *watch your savings fill up* |
| 2 | Trust bar | Instant credibility: free, fast, no bank login, no ads |
| 3 | Problem | "That's me." Recognition |
| 4 | Money Jar | The reveal: one picture solves it |
| 5 | Real app | Proof it exists and looks good |
| 6 | Features | How it works in practice |
| 7 | Calculator | Let them feel it with their own numbers |
| 8 | Privacy | Remove the fear |
| 9 | How it works | It's easy |
| 10 | FAQ | Answer the last doubts |
| 11 | Final CTA | Act |

## A4. Voice
Calm, warm, plain, a little playful. Short sentences. A smart friend who's good with money, not a bank, not a pitch deck.
- **Say:** what's left, set up once, just look at the jar, you check, then save.
- **Never say:** competitive weapon, compounding self-control, envelope model, saving engine, local-first, on-device, builds, recorded holdings, proposed entries.

## A5. India decision (owner disliked "Made for India")
- **Remove** every "for India" / "Made for India" **label**.
- **Keep India in the details:** ₹, SIPs, FDs, chai, Goa trip, salary on the 1st. That makes it feel local without saying it, and keeps the brand global-ready.
- ✅ Decided 18 Nov: owner is 50-50 on global (will post on X). This approach covers both: global wording, Indian details. Plus one honest FAQ line for global visitors: "Blyth uses ₹ for now. More currencies may come later."

## A6. Truth rules (non-negotiable)
- The app isn't downloadable yet → every CTA says **early access**.
- **No bank connection today**, but Account Aggregator is on the roadmap → say "no bank login **needed**", never "**ever**".
- No live prices or returns → no % performance anywhere.
- AI: optional, limited free allowance, every draft reviewed before saving.
- Backup: optional and manual (*Back up now*), not automatic sync, not end-to-end encrypted.
- No launch dates. Calculator results are labelled as a simple projection.

## A7. Repetition budget
| Phrase | Now | Target |
| --- | --- | --- |
| no bank login | 6× | 3× (trust bar, privacy, FAQ) |
| calm | ~10× | 3× (how it works, final CTA, meta) |
| early access | 7× | CTAs + FAQ only |

---

# Part B: section by section

## 1. Navigation ☐
| Element | Now | New |
| --- | --- | --- |
| Links | Features · How it works · Privacy · FAQ | Keep |
| Button | Get the app → | **Get early access →** |
| Mobile menu labels | Open menu / Close menu | Keep (screen-reader text) |

## 2. Hero ☐
| Element | Now | New |
| --- | --- | --- |
| Overline | YOUR MONEY, MADE CLEAR | **MONEY, WITHOUT THE MATHS** · *Alt:* THE MONEY JAR APP |
| Headline | Watch your savings / fill up. | **Keep**: it's the brand line |
| Subhead | The calm finance app for India. Set a goal, watch your jar fill, and finally feel in control of your money. | **Blyth turns your salary, bills, SIPs and spending into one simple jar, so you always know what's left to save.** |
| Primary CTA | Get early access → | Keep |
| Secondary CTA | See how it works → | **See how it works ↓** (it scrolls down, so use a down arrow) |
| Pills | Local-first tracking · No bank login · Early access | **Stays on your phone · Free to track · AI optional** |

## 3. Trust bar ☐
Four facts, each said once on the page.
| Now | New |
| --- | --- |
| Local · RECORDS ON YOUR DEVICE | **₹0 · TO TRACK BY HAND** |
| 0 · BANK LOGINS REQUIRED | **0 · BANK LOGINS NEEDED** |
| 0 · ADS IN THE APP | **0 · ADS** |
| India · MADE FOR | **~1 min · TO SET UP YOUR MONTH** |

## 4. Problem ☐
| Element | Now | New |
| --- | --- | --- |
| Overline | SOUND FAMILIAR? | Keep |
| Headline | Where did my money / even go? | **Keep** |
| Pain 1 | Salary comes in… vanishes by the 20th. | **Keep**: best line on the page |
| Pain 2 | Three apps open, still no clarity. | **Five apps, two spreadsheets, and still no idea what you can spend.** |
| Pain 3 | Saving feels like a chore. | **"I'll start saving next month." Every month.** |
| *New* closing line | (none) | **It's not you. Nothing shows you the whole picture.** (bridges into the jar) |

## 5. The Money Jar ☐
| Element | Now | New |
| --- | --- | --- |
| Overline | THE SIGNATURE | **THE MONEY JAR** |
| Headline | Meet the / Money Jar. | **One jar. / The whole picture.** · *Alt:* keep "Meet the Money Jar." |
| Body | Every rupee you keep drops in. Set a goal, watch it fill, and feel the calm of compounding self-control. | **Tell Blyth your salary, bills, SIPs and budgets once. The jar shows what's really left this month. Spend within budget and it holds steady. Overspend, and you'll watch it drop.** |
| Kicker | The only rule? Don't break it. | **No formulas. No guessing. Just look at the jar.** |
| Widget label | LIVE AS YOU SCROLL | **SCROLL TO FILL IT** |
| Jar tiers | Just started · Filling up · Almost there · Overflowing | Keep (playful, fits) |

## 6. Real app showcase ☐
| Element | Now | New |
| --- | --- | --- |
| Overline | THE REAL APP | Keep |
| Headline | Beautiful. Calm. / Yours. | **Made to be glanced at, / not studied.** · *Alt:* keep |
| Screenshots | 3 PNGs from 27 May (pre-Blyth UI) 🚩 | Replace after the UI-upgrade week (current captures exist in `financeos/marketing/launch-video/screens/`) |
| Screen names | Promise · Dashboard · Setup | **Home · Log expense · Goals** |
| Captions (new) | (none) | **Your month, in one jar** · **Logged in two taps** · **Every goal, filling up** |
| Alt text | "Blyth — Promise screen" etc. | "Blyth home screen with the Money Jar showing what's left this month" · "Logging a ₹180 expense in Blyth" · "Blyth goals screen with a Goa trip 25% funded" |
| Missing-image fallback | Drop your PNG at /public/img/screen-… | Dev-only text; make sure it never shows in production |

## 7. Features ☐
| Element | Now | New |
| --- | --- | --- |
| Overline | EVERYTHING YOU NEED | **WHAT'S INSIDE** |
| Headline | Everything you need to feel / calm about money. | **Everything your month needs. / Nothing it doesn't.** |

**Card 1: forecast**
| | Now | New |
| --- | --- | --- |
| Label | SAVING ENGINE | **FORECAST** |
| Title | Your savings forecast | **Know your month-end by mid-month** |
| Body | See projected month-end savings against your target as you record income, plans and spending. | **See what you're on track to save by the 30th, updated with every entry.** |

**Card 2: budgets**
| | Now | New |
| --- | --- | --- |
| Label | ENVELOPE MODEL | **BUDGETS** |
| Title | Smart budgets | **Budgets that keep you honest** |
| Body | Each category gets a ceiling. Overspending drains the jar — instantly visible. | **Give each category a limit. Stay inside it and nothing changes. Go over, and your jar shows it instantly.** |
| Widget | FOOD 72% · TRANSPORT 45% · FUN 92% | Keep |

**Card 3: goals**
| | Now | New |
| --- | --- | --- |
| Label | VISUAL PROGRESS | **GOALS** |
| Title | Goals | **Goals you can watch fill** |
| Body | Goa trip · new laptop · emergency fund. Set a target and track the money you assign to each goal. | **Goa trip, new laptop, emergency fund. Set a target, add money when you can, and watch it fill.** |
| Widget | GOA · MAC · FUND | **GOA · LAPTOP · SAFETY** |

**Card 4: investments**
| | Now | New |
| --- | --- | --- |
| Label | ALL IN ONE PLACE | **INVESTMENTS** |
| Title | Portfolio | **SIPs, FDs and gold, in one list** |
| Body | Track your recorded SIPs, funds, gold and other holdings in one place. | **Keep every investment in one place. Your monthly SIPs come off the top, so your budget is always real.** |
| Widget | RECORDED HOLDINGS · ↑ 12.4% 🚩 | **THIS MONTH'S SIP · ₹5,000** (amounts only, no % returns) |

**Card 5: AI**
| | Now | New |
| --- | --- | --- |
| Label | OPTIONAL AI | Keep |
| Title | Speak or type an entry | **Just say it** |
| Body | Describe expenses, bonuses, investments and goals. Check the proposed entries, then save. | **Type or say "chai ₹50, cab ₹180". Blyth turns it into entries. You check, then save.** |
| Widget label | DRAFT PREVIEW | **READY TO REVIEW** |
| Widget quote | "Lunch ₹250, cab ₹180. Ready for you to review." | **"Chai ₹50 · Cab ₹180" → 2 entries to review** |

**Card 6: privacy**
| | Now | New |
| --- | --- | --- |
| Label | ON-DEVICE | **PRIVATE** |
| Title | Local-first records | **Stays on your phone** |
| Body | Manual tracking is saved on your device. Cloud backup, where available, is a separate manual choice. AI processes the requests and context you choose to send. | **Your records live on your device. Back up only when you choose.** |
| Widget label | LIVES ON YOUR PHONE | **ON YOUR PHONE** |

## 8. Calculator ☐
| Element | Now | New |
| --- | --- | --- |
| Overline | PLAY WITH IT | **TRY IT** |
| Headline | See your jar / fill, live. | **How fast could / your jar fill?** |
| Slider 1 | Monthly income | **You earn (per month)** |
| Slider 2 | Want to save | **You want to save (per month)** |
| Result label | AT THIS RATE | **IN 12 MONTHS** |
| Result line | saved this year · 35% of income | **saved · 35% of your income** |
| *New* footnote | (none) | **A simple projection: monthly saving × 12.** (honest, small text) |

## 9. Privacy ☐
| Element | Now | New |
| --- | --- | --- |
| Overline | YOUR COMPETITIVE WEAPON 🚩 | **PRIVACY** |
| Headline | Your records. / Your choice. | **Keep**: strong |
| Body | Your finance records are saved on this device. Cloud backup, where available, only uploads when you choose Back up now. When you choose AI, your message and relevant financial details go to OpenAI. Voice input also sends your recording for transcription. Manual tracking works without AI. | **Your records live on your phone. Backup is optional; nothing uploads until you tap *Back up now*. AI is optional too: when you use it, your message (and voice recording) goes to OpenAI to create a draft you review. Rather skip AI? Everything works without it.** |
| Point 1 | Finance records stored on your device | **Your records stay on your phone** |
| Point 2 | No bank login required | **No bank login needed** |
| Point 3 | Optional AI, with review before saving | **AI only when you ask, and you approve every entry** |
| *New* link | (none) | **Read the full privacy notice →** |

## 10. How it works ☐
| Element | Now | New |
| --- | --- | --- |
| Overline | HOW IT WORKS | Keep |
| Headline | Three steps to / a calmer month. | **Keep** |
| Step 1 | Set your income + goal / Sixty seconds. No bank login. | **Set up your month** / **Salary, bills, SIPs, budgets. About a minute.** |
| Step 2 | Speak, type or tap / Review your entries, then save. | **Log as you go** / **Tap it, type it, or just say it. Check, then save.** |
| Step 3 | Watch your jar fill / Stay in budget. Streaks build. Calm follows. | **Watch your jar** / **Stay within budget, keep your streak, see what you'll save.** |

## 11. FAQ ☐
| Element | Now | New |
| --- | --- | --- |
| Overline | FAQ | Keep |
| Headline | The honest answers. | **Keep** |

Order: most-asked first. All answers checked against current app behaviour.

1. **Does Blyth connect to my bank?**
   No. You add entries yourself, by tapping, typing or saying them, and review before saving. No bank login needed.
2. **Is it free?**
   Yes. Tracking by hand is free. AI entry comes with a free allowance. A paid AI plan isn't available yet; if one comes, you'll see the price before anything is charged.
3. **Where is my data stored?**
   On your phone. If you use backup and tap *Back up now*, a copy is stored with our database provider, Supabase. If you use AI, your message (and voice recording) goes to OpenAI to create a draft. Joining this list stores only your email. Full details in the privacy notice.
4. **What if I lose my phone?**
   If you've backed up, sign in on your new phone and restore. Without a backup, your records stay only on the old device, so back up now and then.
5. **Do I need an account?**
   Not for tracking by hand. An email sign-in is only needed for AI entry and backup.
6. **What does the jar actually show?**
   What's left this month after your bills, SIPs, budgets and any overspending. Your month-end savings forecast sits beside it. It's an estimate from what you record, not a bank balance; Blyth never moves money.
7. **How is this different from a spreadsheet or other apps?**
   Set up your month once, and the jar does the maths. No formulas to maintain, no bank login, no ads.
8. **iPhone or Android?**
   iPhone early access comes first. Android will be announced separately. Joining this list doesn't create an app account.
8b. **Can I use it outside India?**
   Yes. Blyth uses ₹ for now. More currencies may come later.
9. **Who's building Blyth?**
   I'm Kshitij Gupta, an independent founder. I'm building the calm money app I always wanted. Follow the build on X: @gupta_1203.

## 12. Final CTA and signup form ☐
| Element | Now | New |
| --- | --- | --- |
| Overline | BE FIRST | **EARLY ACCESS** |
| Headline | Start filling / your jar. | **Keep**: echoes the hero |
| Body | Join the early access list — be first to feel calm about money. A welcome email now, and a heads-up when we launch. No spam. | **Join the list. You'll get a welcome email now and one more when Blyth is ready for you. Nothing else.** |
| Email placeholder | you@gmail.com | **you@email.com** |
| Email label (screen reader) | Email address | Keep |
| Consent ⚠️ | Send me a welcome email and let me know when Blyth early access opens. I have read the privacy notice. | **Email me a welcome note and tell me when early access opens. I've read the privacy notice.** ⚠️ Changing this means bumping `consentVersion` (now `welcome-and-early-access-2026-10-23`). *Alt:* keep the wording to avoid that |
| Button | Get early access → | Keep |
| Loading | Sending… | **Joining…** |
| Success title | You're in! | **You're in. 🎉** |
| Success message | You're on the list. We'll email when early access opens. | **Check your inbox for a welcome email. We'll write again when early access opens.** |
| Error: missing input | Enter your email and agree to receive the welcome and early-access emails. | **Add your email and tick the box to join.** |
| Error: server | We could not confirm your signup. Please try again. | **Something went wrong. Please try again.** |
| Error: network | Couldn't submit. Try again? | Merge into the server message above (one error voice) |
| Line under form | Be part of the first group · Made for India · Built for focus | **Be one of the first to try Blyth.** |

## 13. Footer ☐
| Element | Now | New |
| --- | --- | --- |
| Tagline | Built for focus. | **Money, without the maths.** (matches hero overline) |
| Links | Privacy · Early access · Contact | Keep |
| Credit | Made with 🫙 in India / Built by an indie founder in India 🇮🇳 | ✅ **Made with 🫙 by [Kshitij Gupta](https://x.com/gupta_1203)** |
| *New* last CTA | (none) | **Get early access →** (for people who scroll to the bottom) |
| *New* link groups | (one row) | **Product:** Features · How it works · FAQ · **Company:** Contact · Privacy · Early access |
| *New* social | (none) | ✅ **Follow the build:** X (@gupta_1203) · Instagram (@k._dumps_) |
| *New* copyright | (none) | **© 2026 Blyth** |

## 14. Metadata (Google, link previews, browser tabs) ☐
| Element | Now | New |
| --- | --- | --- |
| Home title | Blyth — Watch your savings fill up | Keep |
| Meta description | The calm finance app for India. Set a goal, watch your jar fill, and finally feel in control of your money. Local-first tracking. No bank login. | **Blyth turns your salary, bills, SIPs and spending into one simple jar, so you always know what's left to save. No bank login. Free to track.** |
| Link-preview description | The calm finance app for India. Local-first tracking. No bank login. | **One simple jar that shows what's left to save. No bank login. Free to track.** |
| Privacy page title | (same as home) 🚩 | **Privacy notice · Blyth** |
| Terms page title | (same as home) 🚩 | **About early access · Blyth** |
| Contact page title | (same as home) 🚩 | **Contact · Blyth** |

## 15. Subpages ☐
**Privacy notice** (`/privacy`): the facts are accurate. The problem is readability: one long legal wall.
- Add a **"The short version"** box at the top: records on your phone · backup only when you tap *Back up now* · AI optional, sent to OpenAI when used · waitlist stores your email only · we never sell data.
- Split the rest under headings: *Waitlist* · *Website & hosting* · *App: records* · *App: AI* · *App: account* · *App: backup* · *Retention & your rights* · *Contact*.
- Replace "Builds with Backup & restore" → "If you use Backup & restore".
- ⚠️ Keep every fact. Verify provider retention settings before publishing (checklist requirement).

**About early access** (`/terms`): fine for the waitlist. Before the App Store launch, a proper **Terms of Use** page is needed (separate task).

**Contact** (`/contact`): replace the personal Gmail with a domain address, e.g. **hello@getblyth.com** (owner sets up the mailbox; the domain already sends from mail.getblyth.com). Same change in the privacy notice and terms.

---

## Owner decisions
1. ✅ India approach (A5): global wording, Indian details, plus the ₹ FAQ line.
2. ✅ Footer credit: **"Made with 🫙 by Kshitij Gupta"**, with the name linked to https://x.com/gupta_1203. Follow-the-build links: **X** https://x.com/gupta_1203 · **Instagram** https://www.instagram.com/k._dumps_/
3. ✅ Consent wording (12): new wording + new version label. ⚠️ The server sends the welcome email only when the label matches exactly (`lib/waitlist.ts:37`, tests in `tests/welcome.cjs`), so the label must change in the form, the server check and the tests together, and still accept the old label for existing callers.
4. ✅ Contact: personal Gmail stays for the waitlist phase. **Before App Store submission (Jan 2027):** switch to hello@getblyth.com via free Cloudflare Email Routing → forwards to Gmail.
5. ✅ Screenshots: re-capture after the UI-upgrade week, as animated/interactive screens (see Part C).

---

# Part C: visual redesign (after the copy is locked)

Order: **words first, then visuals**, so the design is built around final copy. Ideas to develop into a design proposal:
- **Sticky scroll phone:** the phone stays on screen while the page scrolls; its screen changes with each section (jar fills → expense logged → budget goes red → goal fills). Real app captures, animated.
- **Embed the teaser video** (`financeos/marketing/launch-video/exports/`) in the showcase section.
- **Live micro-interactions:** numbers count up, cards respond to hover/tap, the jar reacts to the calculator (already partly there).
- **New footer:** last CTA, grouped links, follow-the-build socials, founder credit.
- Re-capture all app screens after the app UI-upgrade week, so we do it once.
