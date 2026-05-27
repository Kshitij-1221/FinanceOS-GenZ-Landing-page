'use client';

/**
 * HowItWorks — three numbered steps stitched together by a gold
 * gradient connector that draws itself as the section scrolls into view.
 *
 * Ported 1:1 from landing-v2/sections-bottom.jsx > HowItWorks.
 *
 * Scroll math (same as source — RAF-throttled here for steadier perf)
 *   start = vh × 0.85          (section top entering bottom of viewport)
 *   end   = vh × 0.30          (section top sitting near upper third)
 *   k     = 1 − (r.top − end) / (start − end)   then clamp(0, 1)
 *   drawn := k                  (drives the line + circle "lit" states)
 *
 * drawn (0..1) controls two things:
 *   1. The SVG path's strokeDashoffset (1200 → 0) — the line literally
 *      draws itself from left to right
 *   2. Each step circle's lit state: step i lights at
 *      `drawn > i * 0.33 + 0.15`, so step 1 lights at 0.15, step 2 at
 *      0.48, step 3 at 0.81 — they light in sequence as the line draws past
 *
 * prefers-reduced-motion: skip the listener and pin drawn = 1 so the
 * line is fully drawn and all three circles are lit immediately.
 *
 * Mobile (≤ 980px): the connector line hides (`.how-line` display none),
 * the grid collapses to one column, and each numbered step renders as
 * a normal block. CSS lives in globals.css under `.how-grid` / `.how-line`.
 */

import { useEffect, useRef, useState } from 'react';
import { Overline } from '../Overline';
import { Reveal } from '../Reveal';

const STEPS = [
  { n: 1, title: 'Set your income + goal',     body: 'Sixty seconds. No bank login.' },
  { n: 2, title: 'Log spends (or auto-track)', body: 'Tap to log. Or let smart-categorize do it.' },
  { n: 3, title: 'Watch your jar fill',        body: 'Stay in budget. Streaks build. Calm follows.' },
] as const;

const DASH_LEN = 1200;

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [drawn, setDrawn] = useState(0);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setDrawn(1);
      return;
    }

    let raf = 0;
    const compute = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.3;
      const k = 1 - (r.top - end) / (start - end);
      setDrawn(Math.max(0, Math.min(1, k)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', compute);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="how"
      ref={sectionRef as never}
      className="relative"
      style={{ padding: '80px 0 80px' }}
    >
      <div className="container-prose">
        <Reveal>
          <Overline>How it works</Overline>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="font-display how-h mt-3.5 font-extrabold text-fg-strong"
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              maxWidth: 800,
              textWrap: 'balance',
            }}
          >
            Three steps to <span className="gold-text">a calmer month.</span>
          </h2>
        </Reveal>

        <div className="how-grid relative mt-14">
          {/* Animated gold connector — desktop only (CSS hides at ≤ 980px) */}
          <svg
            className="how-line pointer-events-none absolute"
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{
              top: 26,
              left: '8%',
              width: '84%',
              height: 60,
              zIndex: 0,
            }}
          >
            <defs>
              <linearGradient id="how-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#92691c" />
                <stop offset="50%"  stopColor="#fcd34d" />
                <stop offset="100%" stopColor="#92691c" />
              </linearGradient>
            </defs>
            <path
              d="M0 30 Q 250 0 500 30 T 1000 30"
              fill="none"
              stroke="url(#how-line-grad)"
              strokeWidth={2}
              strokeDasharray={DASH_LEN}
              strokeDashoffset={DASH_LEN * (1 - drawn)}
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 12px rgba(252,211,77,0.5))' }}
            />
          </svg>

          {STEPS.map((step, i) => {
            // Step i lights up when the draw passes its threshold.
            const lit = drawn > i * 0.33 + 0.15;
            return (
              <Reveal key={step.n} delay={i * 140} y={20}>
                <div className="relative z-[1]">
                  {/* Numbered circle */}
                  <div
                    className="grid place-items-center"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 999,
                      background: lit
                        ? 'linear-gradient(180deg, #fde68a 0%, #d4af37 60%, #92691c 100%)'
                        : 'rgba(255,255,255,0.04)',
                      border: lit
                        ? '1px solid rgba(252,211,77,0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: lit ? '0 0 24px rgba(252,211,77,0.45)' : 'none',
                      transition:
                        'background 600ms ease, box-shadow 600ms ease, border-color 600ms ease',
                    }}
                  >
                    <span
                      className="font-display font-mono"
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: lit ? '#1a1202' : 'var(--fg-faint)',
                        transition: 'color 600ms ease',
                      }}
                    >
                      {step.n}
                    </span>
                  </div>

                  <h3
                    className="font-display mt-[18px] font-extrabold text-fg-strong"
                    style={{ fontSize: 19, letterSpacing: '-0.02em' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="mt-1.5 text-fg-muted"
                    style={{
                      fontSize: 13.5,
                      lineHeight: 1.5,
                      maxWidth: 280,
                      textWrap: 'pretty',
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
