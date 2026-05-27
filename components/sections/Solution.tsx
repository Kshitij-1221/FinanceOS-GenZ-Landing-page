'use client';

/**
 * Solution — "Meet the Money Jar." with scroll-linked fill.
 *
 * Ported 1:1 from landing-v2/sections-mid.jsx > Solution.
 *
 * Layout (desktop): 2-col grid — copy left, jar right.
 * Layout (mobile, ≤ 980px): single column, jar STACKED ABOVE the copy
 *   (matches source's `.solution-jar { order: -1 }`).
 *
 * Animation:
 *   The jar's pct is driven by the section's own scroll progress
 *   through the viewport. Math ported verbatim:
 *     start = vh × 0.75                          (section just appearing)
 *     end   = -r.height + vh × 0.25              (section ~75% past)
 *     k     = (start - r.top) / (start - end)    (linear 0..1)
 *     pct   = 8 + clamp(k) × 92                  (8 → 100)
 *   Wrapped in requestAnimationFrame so we only setState once per frame.
 *
 *   prefers-reduced-motion: skip the listener and pin pct = 85 so the
 *   jar still reads as a finished-state jar, just not animated.
 *
 * The live progress chip echoes the same pct (gold dot with the %
 * inside + a tier label that crosses 25/60/90 thresholds).
 *
 * Followed by a SectionBridge — the gold hairline-and-dot divider
 * that closes the section before PhoneShowcase begins.
 */

import { useEffect, useRef, useState } from 'react';
import { LandingJar } from '../LandingJar';
import { Overline } from '../Overline';
import { Reveal } from '../Reveal';
import { SectionBridge } from '../SectionBridge';

const REDUCED_MOTION_PCT = 85;

function tierLabel(pct: number): string {
  if (pct < 25) return 'Just started';
  if (pct < 60) return 'Filling up';
  if (pct < 90) return 'Almost there';
  return 'Overflowing';
}

export function Solution() {
  const ref = useRef<HTMLElement | null>(null);
  const [pct, setPct] = useState(8);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setPct(REDUCED_MOTION_PCT);
      return;
    }

    let raf = 0;
    const compute = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.75;
      const end = -r.height + vh * 0.25;
      const k = (start - r.top) / (start - end);
      const eased = Math.max(0, Math.min(1, k));
      setPct(Math.round(8 + eased * 92));
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

  // Coin count grows with fill — capped at 10 (source's same formula).
  const coinCount = Math.min(10, Math.floor(pct / 10));

  return (
    <section ref={ref as never} className="solution relative" style={{ padding: '80px 0 30px' }}>
      {/* Soft radial wash anchored behind the jar (right side on desktop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 70% 50%, rgba(212,175,55,0.10), transparent 60%)',
        }}
      />

      <div className="container-prose solution-grid relative z-[1]">
        {/* Copy column */}
        <div className="solution-copy">
          <Reveal>
            <Overline>The signature</Overline>
          </Reveal>

          <Reveal delay={80}>
            <h2
              className="font-display mt-[18px] font-extrabold text-fg-strong"
              style={{
                fontSize: 'clamp(44px, 6vw, 72px)',
                fontWeight: 900,
                letterSpacing: '-0.045em',
                lineHeight: 0.95,
                textWrap: 'balance',
              }}
            >
              Meet the
              <br />
              <span className="gold-text">Money Jar.</span>
            </h2>
          </Reveal>

          <Reveal delay={180}>
            <p
              className="mt-6 text-fg-muted"
              style={{
                fontSize: 17.5,
                lineHeight: 1.55,
                maxWidth: 440,
                textWrap: 'pretty',
              }}
            >
              Every rupee you keep drops in. Set a goal, watch it fill, and feel
              the calm of compounding self-control.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <p
              className="mt-3 text-fg"
              style={{
                fontSize: 17.5,
                lineHeight: 1.55,
                maxWidth: 440,
                fontWeight: 500,
              }}
            >
              The only rule? Don&apos;t break it.
            </p>
          </Reveal>

          {/* Live progress chip — echoes the same pct that drives the jar */}
          <Reveal delay={340}>
            <div
              className="mt-[30px] inline-flex items-center gap-3.5"
              style={{
                padding: '12px 18px 12px 14px',
                borderRadius: 999,
                background: 'rgba(252,211,77,0.08)',
                border: '1px solid rgba(252,211,77,0.25)',
                boxShadow: '0 8px 24px rgba(212,175,55,0.12)',
              }}
            >
              <div
                className="grid place-items-center font-mono"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  background:
                    'radial-gradient(circle at 30% 30%, #fde68a, #92691c)',
                  boxShadow: '0 0 16px rgba(252,211,77,0.6)',
                  color: '#1a1202',
                  fontWeight: 900,
                  fontSize: 11,
                }}
              >
                {pct}%
              </div>
              <div className="flex flex-col leading-tight">
                <span
                  className="text-gold"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                  }}
                >
                  Live as you scroll
                </span>
                <span
                  className="mt-0.5 text-fg-strong"
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  {tierLabel(pct)}
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Jar column */}
        <div className="solution-jar flex items-center justify-center">
          <Reveal y={32}>
            <LandingJar
              pct={pct}
              size={400}
              coins={coinCount}
              glow="strong"
              idSeed="sol"
            />
          </Reveal>
        </div>
      </div>

      {/* Gold bridge — closes the section visually */}
      <div className="mt-[60px]">
        <SectionBridge />
      </div>
    </section>
  );
}
