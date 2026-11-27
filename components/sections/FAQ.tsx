'use client';

/**
 * FAQ — 11-item accordion. First question default-open.
 *
 * Ported from landing-v2/sections-bottom.jsx > FAQ + FAQItem.
 *
 * Behaviour
 *   - Click a row to toggle. Open row gets a gold tint on the card,
 *     gold-soft heading colour, and the `+` icon rotates 45° to ×
 *   - Body slides open via `max-height` keyed to the measured natural
 *     height of the content (refs + ResizeObserver) — so any answer
 *     length transitions cleanly, including when the viewport
 *     re-flows the text on resize
 *   - Card-level transitions on bg + border (300ms ease), heading
 *     colour (200ms), icon transform (200ms), body height (360ms
 *     cubic-bezier(0.22,1,0.36,1)) + opacity (260ms)
 *
 * Accessibility
 *   - `<button aria-expanded>` toggles the panel
 *   - `<div role="region" aria-labelledby>` wraps the body, IDs
 *     generated with React.useId() for SSR safety
 *
 * Mobile
 *   - Container clamped to 880px max; on phones the column already
 *     reads as full-width within that. Headline scales via clamp().
 *   - prefers-reduced-motion: transitions collapse to 0.001ms via
 *     the global guard in globals.css. Open/close still works,
 *     just snaps in instantly.
 */

import { useId, useLayoutEffect, useRef, useState } from 'react';
import { Overline } from '../Overline';
import { Reveal } from '../Reveal';

const ITEMS = [
  { q: "Does Blyth connect to my bank?", a: "No. You add entries yourself, by tapping, typing or saying them, and review before saving. No bank login needed." },
  { q: "Is it free?", a: "Yes. Tracking by hand is free. AI entry comes with a free allowance. A paid AI plan isn't available yet; if one comes, you'll see the price before anything is charged." },
  { q: "Do I have to enter everything at once?", a: "No. Start with your salary and a target, and add the rest over time. The jar updates as you go." },
  { q: "Where is my data stored?", a: "On your phone. If you use backup and tap Back up now, a copy is stored with our database provider, Supabase. If you use AI, your message (and voice recording) goes to OpenAI to create a draft. Joining this list stores only your email. Full details in the privacy notice." },
  { q: "What if I lose my phone?", a: "If you've backed up, sign in on your new phone and restore. Without a backup, your records stay only on the old device, so back up now and then." },
  { q: "Do I need an account?", a: "Not for tracking by hand. An email sign-in is only needed for AI entry and backup." },
  { q: "What does the jar actually show?", a: "What's left this month after your bills, SIPs, budgets and any overspending. Your month-end savings forecast sits beside it. It's an estimate from what you record, not a bank balance; Blyth never moves money." },
  { q: "How is this different from a spreadsheet or other apps?", a: "Set up your month once, and the jar does the maths. No formulas to maintain, no bank login, no ads." },
  { q: "iPhone or Android?", a: "iPhone early access comes first. Android will be announced separately. Joining this list doesn't create an app account." },
  { q: "Can I use it outside India?", a: "Yes. Blyth uses ₹ for now. More currencies may come later." },
  { q: "Who's building Blyth?", a: "I'm Kshitij Gupta, an independent founder. I'm building the calm money app I always wanted. Follow the build on X: @gupta_1203." }
] as const;

export function FAQ() {
  return (
    <section id="faq" className="relative" style={{ padding: '80px 0 80px' }}>
      <div className="container-prose" style={{ maxWidth: 880 }}>
        <Reveal>
          <Overline>FAQ</Overline>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="font-display faq-h mt-4 font-extrabold text-fg-strong"
            style={{
              fontSize: 'clamp(36px, 5.5vw, 52px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              textWrap: 'balance',
            }}
          >
            The honest answers.
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col gap-2.5">
          {ITEMS.map((it, i) => (
            <Reveal key={it.q} delay={i * 50} y={12}>
              <FAQItem question={it.q} answer={it.a} defaultOpen={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQItem ──────────────────────────────────────────────────────────
interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelHeight, setPanelHeight] = useState<number>(0);

  // Re-measure whenever the panel content might change size:
  // initial mount, viewport resize, font load. ResizeObserver keeps
  // panelHeight in sync with the actual scrollHeight.
  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const measure = () => setPanelHeight(el.scrollHeight);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Stable id for aria wiring (SSR-safe)
  const baseId = useId();
  const panelId = `faq-panel-${baseId}`;
  const buttonId = `faq-button-${baseId}`;

  // While `panelHeight` is still 0 on first paint (before useLayoutEffect
  // runs), use a generous fallback so a default-open item doesn't flash
  // closed.
  const maxH = open ? panelHeight || 600 : 0;

  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: 16,
        background: open ? 'rgba(252,211,77,0.04)' : 'rgba(255,255,255,0.02)',
        border: open
          ? '1px solid rgba(252,211,77,0.25)'
          : '1px solid rgba(255,255,255,0.06)',
        transition: 'background 300ms ease, border-color 300ms ease',
      }}
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 border-0 bg-transparent text-left"
        style={{ padding: '20px 24px', cursor: 'pointer' }}
      >
        <span
          className="font-display"
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: open ? 'var(--gold-soft)' : 'var(--fg-strong)',
            transition: 'color 200ms ease',
          }}
        >
          {question}
        </span>
        <span
          aria-hidden="true"
          className="grid shrink-0 place-items-center"
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            background: open
              ? 'rgba(252,211,77,0.18)'
              : 'rgba(255,255,255,0.04)',
            border: open
              ? '1px solid rgba(252,211,77,0.4)'
              : '1px solid rgba(255,255,255,0.06)',
            color: open ? '#fcd34d' : 'var(--fg-muted)',
            transform: open ? 'rotate(45deg)' : 'rotate(0)',
            transition: 'all 200ms ease',
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <line x1={12} y1={5}  x2={12} y2={19} />
            <line x1={5}  y1={12} x2={19} y2={12} />
          </svg>
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        style={{
          maxHeight: maxH,
          opacity: open ? 1 : 0,
          transition:
            'max-height 360ms cubic-bezier(0.22,1,0.36,1), opacity 260ms ease',
          overflow: 'hidden',
        }}
      >
        <div
          ref={panelRef}
          className="text-fg-muted"
          style={{
            padding: '0 24px 22px',
            fontSize: 15,
            lineHeight: 1.6,
            textWrap: 'pretty',
          }}
        >
          {answer}
        </div>
      </div>
    </div>
  );
}

