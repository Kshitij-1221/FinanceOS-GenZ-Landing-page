'use client';

/**
 * Calculator — interactive twin-slider section.
 *
 * Ported 1:1 from landing-v2/sections-mid.jsx > Calculator + CalcSlider.
 *
 * State
 *   income  — ₹/month  (5,000 – 5,00,000, step 1,000)
 *   target  — ₹/month savings goal (500 – income, step 500)
 *
 * Derived
 *   safeTarget = min(target, income)        — keeps target ≤ income at all times
 *   pct        = round(safeTarget / income × 100)   — drives the jar fill
 *   yearly     = safeTarget × 12             — headline figure on the result card
 *
 * Layout
 *   2-col grid (1.2 / 1): sliders + result card on the LEFT, jar on the RIGHT.
 *   ≤ 980px collapses to a single column with the jar stacked below the
 *   controls (`.calc-card` rules live in globals.css).
 *
 * Jar wiring
 *   <LandingJar /> at size 280, `glow="strong"`, dynamic coins
 *   (floor(pct/12), capped at 8), `sparkles` on past 30%, `dropping`
 *   (falling coins above the lid) on past 40% — matches source.
 *
 * Slider styling
 *   Custom range thumbs (.calc-range::-webkit-slider-thumb /
 *   ::-moz-range-thumb) defined in globals.css. The visible "fill"
 *   bar is a separate absolutely-positioned div behind the range
 *   input so we can colour it gold and add a glow.
 */

import { useState } from 'react';
import { LandingJar } from '../LandingJar';
import { Overline } from '../Overline';
import { Reveal } from '../Reveal';

const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const fmtCompact = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return fmt(n);
};

export function Calculator() {
  const [income, setIncome] = useState(100000);
  const [target, setTarget] = useState(35000);

  const safeTarget = Math.min(target, income);
  const pct = Math.max(0, Math.min(100, Math.round((safeTarget / Math.max(1, income)) * 100)));
  const yearly = safeTarget * 12;

  return (
    <section className="relative" style={{ padding: '80px 0 80px' }}>
      {/* Soft gold wash anchored on the left half */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 30% 50%, rgba(212,175,55,0.08), transparent 60%)',
        }}
      />

      <div className="container-prose relative z-[1]">
        <Reveal>
          <Overline>Play with it</Overline>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="font-display calc-h mt-4 font-extrabold text-fg-strong"
            style={{
              fontSize: 'clamp(34px, 5.5vw, 56px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              maxWidth: 800,
              textWrap: 'balance',
            }}
          >
            See your jar
            <br />
            <span className="gold-text">fill, live.</span>
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <div
            className="calc-card glass-card mt-12"
            style={{
              padding: 36,
              alignItems: 'center',
            }}
          >
            {/* LEFT — controls + result card */}
            <div>
              <CalcSlider
                label="Monthly income"
                value={income}
                min={5000}
                max={500000}
                step={1000}
                onChange={setIncome}
              />

              <div style={{ height: 28 }} />

              <CalcSlider
                label="Want to save"
                value={safeTarget}
                min={500}
                max={income}
                step={500}
                onChange={setTarget}
                accent
              />

              {/* Result card */}
              <div
                className="mt-8 rounded-2xl"
                style={{
                  padding: '20px 22px',
                  background: 'rgba(252,211,77,0.06)',
                  border: '1px solid rgba(252,211,77,0.22)',
                }}
              >
                <div
                  className="text-gold"
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                  }}
                >
                  At this rate
                </div>
                <div
                  className="font-display font-mono mt-2"
                  style={{
                    fontSize: 38,
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    background:
                      'linear-gradient(180deg, #fde68a 0%, #d4af37 60%, #92691c 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                  }}
                >
                  {fmtCompact(yearly)}
                </div>
                <div
                  className="mt-1.5 text-fg-muted"
                  style={{ fontSize: 13 }}
                >
                  saved this year ·{' '}
                  <span
                    className="font-mono text-fg-strong"
                    style={{ fontWeight: 600 }}
                  >
                    {pct}%
                  </span>{' '}
                  of income
                </div>
              </div>
            </div>

            {/* RIGHT — live jar */}
            <div className="flex items-center justify-center">
              <div
                className="flex items-center justify-center"
                style={{ width: 280, height: 320 }}
              >
                <LandingJar
                  pct={pct}
                  size={280}
                  coins={Math.min(8, Math.floor(pct / 12))}
                  glow="strong"
                  idSeed="calc"
                  sparkles={pct > 30}
                  dropping={pct >= 40}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── CalcSlider ───────────────────────────────────────────────────────
interface CalcSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  /** When true, the numeric display gets the gold-gradient text fill. */
  accent?: boolean;
}

function CalcSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  accent = false,
}: CalcSliderProps) {
  const trackPct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span
          className="text-fg-muted"
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
        <span
          className="font-display font-mono"
          style={{
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            color: accent ? 'transparent' : 'var(--fg-strong)',
            background: accent
              ? 'linear-gradient(180deg, #fde68a 0%, #d4af37 60%, #92691c 100%)'
              : 'none',
            WebkitBackgroundClip: accent ? 'text' : undefined,
            backgroundClip: accent ? 'text' : undefined,
            WebkitTextFillColor: accent ? 'transparent' : undefined,
          }}
        >
          {fmt(value)}
        </span>
      </div>
      <div
        className="relative"
        style={{
          height: 8,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* Visible gold fill bar — sits behind the range thumb */}
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${trackPct}%`,
            background: 'linear-gradient(90deg, #92691c 0%, #fcd34d 100%)',
            boxShadow: '0 0 16px rgba(252,211,77,0.4)',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="calc-range"
          aria-label={label}
        />
      </div>
    </div>
  );
}
