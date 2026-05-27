'use client';

/**
 * FeaturesGrid — six cards, each with its own micro-demo visual.
 *
 * Ported from landing-v2/sections-mid.jsx > FeaturesGrid +
 * FeatureCard + the six FeatureXxx visuals.
 *
 * Layout:
 *   - 3-col grid (desktop), 2-col (≤ 980px), 1-col (≤ 640px)
 *     — handled in globals.css under `.features-grid`
 *   - Each card: 132px tall visual tile on top, kicker, title, body
 *   - Card hover: lifts -4px, picks up a gold-tinted border + glow
 *     (defined as `.feat-card:hover` in globals.css)
 *
 * Animations (Reanimated-free — pure CSS keyframes + a tiny RAF
 * for the breathing jar):
 *   - `feat-bar-loop` continuous scaleX pulse on the budget bars
 *   - `jar-pulse-halo` slow opacity+scale loop on the auto-fill card
 *   - LandingJar internals already animate (wave + coin float + ticks)
 *
 * Palette notes (vs source):
 *   - The original Transport bar used `#a78bfa` (purple) and the
 *     AI insight card used `#a78bfa / #c4b5fd` for accents. Per the
 *     "purple lives only in the Hero" rule, both are converted to
 *     gold tokens here. Transport → success green so the trio reads
 *     gold (caution) / green (safe) / red (over) — semantically apt.
 */

import { useEffect, useState } from 'react';
import { LandingJar } from '../LandingJar';
import { Overline } from '../Overline';
import { Reveal } from '../Reveal';

type Item = {
  title: string;
  kicker: string;
  body: string;
  visual: React.ReactNode;
};

const FEATURES: Item[] = [
  {
    title: 'Auto-fill jar',
    kicker: 'Saving engine',
    body: 'On salary day, your goal amount auto-drops into the jar. You can’t spend what isn’t there.',
    visual: <FeatureJarPulse />,
  },
  {
    title: 'Smart budgets',
    kicker: 'Envelope model',
    body: 'Each category gets a ceiling. Overspending drains the jar — instantly visible.',
    visual: <FeatureEnvelopes />,
  },
  {
    title: 'Goals',
    kicker: 'Visual progress',
    body: 'Goa trip · new laptop · emergency fund. Each gets its own jar with its own pace.',
    visual: <FeatureGoals />,
  },
  {
    title: 'Portfolio',
    kicker: 'All in one place',
    body: 'Track SIPs, stocks, gold — every asset folds into your net worth view.',
    visual: <FeaturePortfolio />,
  },
  {
    title: 'Calm AI insights',
    kicker: 'Soft nudges',
    body: '“You prioritized comfort this month — that’s OK.” Insight, not judgment.',
    visual: <FeatureAI />,
  },
  {
    title: '100% private',
    kicker: 'On-device',
    body: 'No bank login. No tracking. No selling your data. Genuinely. We can’t see it.',
    visual: <FeaturePrivacy />,
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="relative" style={{ padding: '20px 0 80px' }}>
      <div className="container-prose">
        <Reveal>
          <Overline>Everything you need</Overline>
        </Reveal>
        <Reveal delay={100}>
          <h2
            className="font-display feat-h mt-4 font-extrabold text-fg-strong"
            style={{
              fontSize: 'clamp(34px, 5.5vw, 56px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              maxWidth: 760,
              textWrap: 'balance',
            }}
          >
            Everything you need to feel
            <br />
            <span className="gold-text">calm about money.</span>
          </h2>
        </Reveal>

        <div className="features-grid mt-14">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80} y={20}>
              <FeatureCard {...f} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FeatureCard ──────────────────────────────────────────────────────
function FeatureCard({ title, kicker, body, visual }: Item) {
  return (
    <article
      className="feat-card glass-card relative flex flex-col overflow-hidden p-5"
      style={{ minHeight: 320 }}
    >
      {/* Visual tile */}
      <div
        className="feat-visual relative mb-4 flex items-center justify-center overflow-hidden"
        style={{
          height: 132,
          borderRadius: 14,
          background:
            'linear-gradient(180deg, rgba(252,211,77,0.04), rgba(212,175,55,0))',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {visual}
      </div>

      <div
        className="text-gold"
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        {kicker}
      </div>
      <h3
        className="font-display mt-1.5 font-extrabold text-fg-strong"
        style={{ fontSize: 22, letterSpacing: '-0.02em' }}
      >
        {title}
      </h3>
      <p
        className="mt-2 text-fg-muted"
        style={{ fontSize: 13.5, lineHeight: 1.55, textWrap: 'pretty' }}
      >
        {body}
      </p>
    </article>
  );
}

// ── FeatureJarPulse — slow breathing fill with halo pulse ────────────
function FeatureJarPulse() {
  const [pct, setPct] = useState(66);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setPct(68);
      return;
    }
    let raf = 0;
    let t0 = 0;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      const k = (Math.sin((t - t0) / 1400) + 1) / 2; // 0..1
      setPct(60 + k * 12); // 60..72%
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative" style={{ transform: 'translateY(8px)' }}>
      {/* Pulsing halo behind the jar */}
      <div
        aria-hidden="true"
        className="jar-pulse-halo pointer-events-none absolute"
        style={{
          inset: -10,
          background:
            'radial-gradient(circle, rgba(252,211,77,0.28), transparent 65%)',
          filter: 'blur(2px)',
        }}
      />
      <LandingJar
        pct={pct}
        size={140}
        coins={4}
        glow="soft"
        sparkles={false}
        withScale={false}
        idSeed="ft-j"
      />
    </div>
  );
}

// ── FeatureEnvelopes — 3 looping budget bars ─────────────────────────
function FeatureEnvelopes() {
  const rows = [
    { name: 'Food',      pct: 72, color: '#fcd34d' },               // gold — caution
    { name: 'Transport', pct: 45, color: 'var(--success, #10b981)' }, // green — safe (was purple)
    { name: 'Fun',       pct: 92, color: '#f43f5e' },               // danger — over budget
  ];
  return (
    <div className="flex w-[85%] flex-col gap-2.5">
      {rows.map((r, i) => (
        <div key={r.name}>
          <div
            className="mb-1 flex items-center justify-between font-semibold text-fg-muted"
            style={{
              fontSize: 9.5,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            <span>{r.name}</span>
            <span
              className="font-mono"
              style={{ color: r.pct > 85 ? 'var(--danger, #f43f5e)' : 'var(--fg, #e4e4e7)' }}
            >
              {r.pct}%
            </span>
          </div>
          <div
            className="overflow-hidden"
            style={{
              height: 5,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="feat-bar-loop h-full rounded-full"
              style={{
                width: `${r.pct}%`,
                background: r.color,
                boxShadow: `0 0 12px ${r.color}80`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── FeatureGoals — 3 tiny jars ───────────────────────────────────────
function FeatureGoals() {
  const goals = [
    { pct: 84, label: 'Goa' },
    { pct: 41, label: 'Mac' },
    { pct: 22, label: 'Fund' },
  ];
  return (
    <div className="flex items-end gap-3.5">
      {goals.map((g, i) => (
        <div key={g.label} className="flex flex-col items-center gap-1.5">
          <LandingJar
            pct={g.pct}
            size={58}
            coins={2}
            glow="none"
            sparkles={false}
            withScale={false}
            idSeed={`ft-g${i}`}
          />
          <span
            className="text-fg-muted"
            style={{
              fontSize: 9.5,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            {g.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── FeaturePortfolio — mini area chart ───────────────────────────────
function FeaturePortfolio() {
  const pts = [38, 44, 41, 56, 52, 64, 72, 78, 84];
  const w = 200, h = 80, pad = 4;
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const xs = pts.map((_, i) => pad + (i / (pts.length - 1)) * (w - pad * 2));
  const ys = pts.map((v) => pad + (h - pad * 2) - ((v - min) / (max - min)) * (h - pad * 2));
  const linePts = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const areaPts = `${xs[0]},${h - pad} ${linePts} ${xs[xs.length - 1]},${h - pad}`;

  return (
    <div className="w-[85%]">
      <div
        className="mb-1.5 flex items-end justify-between font-bold text-fg-muted"
        style={{
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        <span>Net worth</span>
        <span
          className="font-mono"
          style={{
            color: 'var(--success, #10b981)',
            letterSpacing: 0,
            textTransform: 'none',
          }}
        >
          ↑ 12.4%
        </span>
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="ft-port-area" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#fcd34d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <polygon points={areaPts} fill="url(#ft-port-area)" />
        <polyline
          points={linePts}
          fill="none"
          stroke="#fcd34d"
          strokeWidth={1.8}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r={3.5} fill="#fcd34d" />
      </svg>
    </div>
  );
}

// ── FeatureAI — insight bubble (re-skinned from purple to gold) ──────
function FeatureAI() {
  return (
    <div
      className="w-[88%] rounded-xl"
      style={{
        padding: 12,
        background: 'rgba(252,211,77,0.08)',
        border: '1px solid rgba(252,211,77,0.22)',
      }}
    >
      <div className="mb-1.5 flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className="inline-block rounded-full"
          style={{
            width: 6,
            height: 6,
            background: '#fcd34d',
            boxShadow: '0 0 8px rgba(252,211,77,0.8)',
          }}
        />
        <span
          className="text-gold-soft"
          style={{
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Insight
        </span>
      </div>
      <div className="text-fg" style={{ fontSize: 12.5, lineHeight: 1.5 }}>
        &ldquo;You prioritized comfort this month &mdash; and that&rsquo;s okay.&rdquo;
      </div>
    </div>
  );
}

// ── FeaturePrivacy — gold padlock-on-shield ──────────────────────────
function FeaturePrivacy() {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 60 64"
        width="64"
        height="68"
        style={{ filter: 'drop-shadow(0 8px 20px rgba(212,175,55,0.4))' }}
      >
        <defs>
          <linearGradient id="ft-priv" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#92691c" />
          </linearGradient>
        </defs>
        {/* Shield body */}
        <path
          d="M30 4 L52 12 L52 32 Q52 52 30 60 Q8 52 8 32 L8 12 Z"
          fill="rgba(252,211,77,0.10)"
          stroke="rgba(252,211,77,0.4)"
          strokeWidth={1.4}
        />
        {/* Shackle */}
        <path
          d="M20 30 V24 Q20 16 30 16 Q40 16 40 24 V30"
          fill="none"
          stroke="url(#ft-priv)"
          strokeWidth={5}
          strokeLinecap="round"
        />
        {/* Lock body + keyhole */}
        <rect x={16} y={30} width={28} height={22} rx={5} fill="url(#ft-priv)" />
        <circle cx={30} cy={40} r={2.5} fill="#3a2a08" />
        <rect x={29} y={41} width={2} height={6} fill="#3a2a08" />
      </svg>
      <div
        className="text-fg-muted"
        style={{
          fontSize: 9.5,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}
      >
        Lives on your phone
      </div>
    </div>
  );
}
