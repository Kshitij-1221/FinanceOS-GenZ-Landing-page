# Landing copy remake — 19 November 2026

Implemented the owner's approved Part B of `COPY-DECK.md` (source commit `cd50289`), using main New text and retaining Keep rows. Sections 1–15 are marked implemented. This is local work: **not pushed or deployed**. No mobile-app source changed.

## Verification

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | Passed |
| `npm run build` | Passed; all nine static pages generated |
| `npm run test:waitlist` | 17 passed, zero failures/skips |
| `git diff --check` | Passed |
| Home, privacy, terms, contact at 390px and 1440px | No horizontal/text overflow or browser runtime errors; inspected screenshots |
| All ten FAQ answers | Expanded individually at both widths; no clipped answers |
| Form states, with mocked network | Missing input, Joining…, success, HTTP failure and network failure use approved wording |
| Consent request | Browser sends November label; server tests accept both approved October and November labels |
| Navigation/social links | Mobile menu works; X/Instagram use the requested URLs, new tabs and `noopener noreferrer` |
| Banned phrases | None in app/components/lib page source; historical Now columns in the copy deck remain intentionally |

Browser checks used isolated headless Chrome with Playwright and reduced motion. Signup requests were mocked: no email was sent and no live database writes were made. `layout.json` records route widths, titles, image alt text, social attributes and FAQ clipping checks. The FAQ screenshots hide the fixed navigation only for the capture so it does not cover the section; shipped navigation is unchanged. Screenshots cover both mobile and desktop, plus the Joining… state.

## Scope and spacing

- Copy, widget labels, captions/alt text, form states, FAQ order, footer groups and metadata updated. Privacy facts retained under the requested headings and short-version box.
- Mobile trust-cell inset clamps between 12px and 22px so “~1 min” fits on one line.
- The existing stacked mobile solution grid now uses `minmax(0, 1fr)` so its jar's intrinsic width does not force the adjacent copy beyond the viewport.
- No font, colour or animation changes. Existing phone PNGs are retained by instruction; recapture is deferred to Part C. Screenshot labels/alt text use the newly approved wording, so they anticipate those replacement captures.
- Personal Gmail remains, overriding the deck's later domain-email suggestion. No other approved copy line was omitted or replaced with an Alt.
- Required-field validation now also exposes the approved missing-input message. Server/network failures share the approved generic message. Resend delivery logic is unchanged.

## Known limitation before publication

The existing `join_blyth_waitlist_v2` function in `supabase/002_welcome_email.sql` records `welcome-and-early-access-2026-10-23` internally. Both labels now qualify for welcome delivery, but the November label is **not separately persisted**. Accurately distinguishing stored consent wording versions needs a separately approved database-function update. No schema/function changes were made in this task.

Provider retention settings still need verification before public privacy publication, as recorded in the copy deck/checklist. These local tests do not establish real inbox delivery or provider retention.

## Owner phone review

On the same Wi-Fi as the Mac, open the local preview in Safari, scroll through the hero and jar explanation, open all ten FAQ answers, and check the footer's Product/Company/social links. Open Privacy, Early access and Contact and confirm readable wrapping. No native iPhone build/install is needed for these website-only edits. Avoid a real form submission unless intentionally requesting a welcome email.
