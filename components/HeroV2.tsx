'use client';

/**
 * HeroV2 — the centerpiece of the landing page.
 *
 * Anatomy (back → front):
 *   1. Soft gold radial washes (top, sides) baked into the background
 *   2. Two large "watermark" jars cropped by the left/right edges,
 *      drifting with the mouse and slowly breathing their fill levels
 *   3. ONE white SVG path that connects two pills — line enters
 *      from off-screen left, threads through the left pill (used as
 *      a node), arcs ABOVE the headline area, threads through the
 *      right pill, exits off-screen right
 *   4. The two pills themselves — purple→blue flowing conic-gradient
 *      borders (CSS @property + animation, no JS); hovering either
 *      pill sends a glowing pulse along the line to its neighbour
 *   5. Centered content channel: overline + huge gold-accent headline
 *      + sub + 2 CTAs + 3 trust dots
 *
 * Differences from the prototype (landing-v2/hero-and-trust.jsx):
 *   - 2 pills instead of 4 (per the brief)
 *   - The line passes THROUGH both pills (single connected system),
 *     not a 3-segment chain between separate pills
 *   - Path is routed to clear the centered headline at all viewport sizes
 *
 * Purple/blue lives ONLY in this file — every other section uses gold.
 *
 * Mobile (< 980px): the right watermark jar hides, the left jar centres
 * and shrinks to a single hero illustration, the pills + line hide.
 */

import { useEffect, useRef, useState } from 'react';
import { LandingJar } from './LandingJar';
import { Overline } from './Overline';
import { Reveal } from './Reveal';

// ── Path geometry ────────────────────────────────────────────────────
// Single SVG path; viewBox is 1100 × 720 with preserveAspectRatio="none"
// so the pill (left, top %) values map directly onto these coordinates.
const LEFT_NODE  = { x: 200, y: 160 } as const;
const RIGHT_NODE = { x: 900, y: 220 } as const;
// `LINE_PATH`:
//   - enters far-left at y=160, goes straight to left node
//   - curves UP (control points at y=60) — peak well above the headline
//     centre which sits around y=400+
//   - reaches the right node
//   - exits far-right at y=220
const LINE_PATH =
  `M -50 ${LEFT_NODE.y} L ${LEFT_NODE.x} ${LEFT_NODE.y} ` +
  `C 380 60, 720 60, ${RIGHT_NODE.x} ${RIGHT_NODE.y} ` +
  `L 1150 ${RIGHT_NODE.y}`;

// Pixel anchors as percentages so HTML pills align with the SVG path.
const leftPillPos  = { left: `${(LEFT_NODE.x  / 1100) * 100}%`, top: `${(LEFT_NODE.y  / 720) * 100}%` };
const rightPillPos = { left: `${(RIGHT_NODE.x / 1100) * 100}%`, top: `${(RIGHT_NODE.y / 720) * 100}%` };

export function HeroV2() {
  const stageRef = useRef<HTMLElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<0 | 1 | null>(null);

  // Slow ambient fill on the watermark jars
  const [leftPct,  setLeftPct]  = useState(58);
  const [rightPct, setRightPct] = useState(80);

  // ── Mouse parallax — drives the watermark jars subtly ───────────
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const onMove = (e: MouseEvent) => {
      const r = stageRef.current?.getBoundingClientRect();
      if (!r) return;
      setMouse({
        x: (e.clientX - (r.left + r.width / 2)) / r.width,
        y: (e.clientY - (r.top + r.height / 2)) / r.height,
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // ── Breathing fill — left + right jars sin-wave their pct ───────
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    let raf = 0;
    let t0 = 0;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      const s = (t - t0) / 1000;
      setLeftPct(68  + Math.sin(s * 0.32) * 18);
      setRightPct(72 + Math.sin(s * 0.32 + Math.PI) * 14);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const leftJarTx  = `translate3d(${mouse.x * -24}px, ${mouse.y * -18}px, 0)`;
  const rightJarTx = `translate3d(${mouse.x *  24}px, ${mouse.y *  18}px, 0)`;

  return (
    <section
      ref={stageRef as never}
      id="top"
      className="herov2 relative flex items-center"
      style={{
        paddingTop: 100,
        paddingBottom: 60,
        minHeight: 760,
        overflow: 'clip',
      }}
    >
      {/* Backgrounds — top wash + side washes + centre darken */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -8%, rgba(212,175,55,0.18), transparent 60%),' +
            'radial-gradient(ellipse 25% 60% at 0% 50%, rgba(212,175,55,0.18), transparent 65%),' +
            'radial-gradient(ellipse 25% 60% at 100% 50%, rgba(212,175,55,0.18), transparent 65%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 38% 80% at 50% 50%, rgba(5,5,5,0.50), transparent 70%)',
        }}
      />

      {/* LEFT watermark jar */}
      <div
        className="herov2-jar herov2-jar--left lj-float-left"
        style={{ transform: leftJarTx }}
      >
        <LandingJar
          pct={leftPct}
          size={620}
          coins={0}
          glow="mega"
          sparkles={false}
          withScale={false}
          dropping={false}
          idSeed="v2L"
        />
      </div>
      {/* RIGHT watermark jar */}
      <div
        className="herov2-jar herov2-jar--right lj-float-right"
        style={{ transform: rightJarTx }}
      >
        <LandingJar
          pct={rightPct}
          size={620}
          coins={0}
          glow="mega"
          sparkles={false}
          withScale={false}
          dropping={false}
          idSeed="v2R"
        />
      </div>

      {/* Connector line (single path through both pill nodes).
          preserveAspectRatio="none" so the viewBox stretches to fill
          the hero — the pill (left, top %) match the path's anchors. */}
      <svg
        className="chain-svg pointer-events-none absolute inset-0 z-[2] h-full w-full"
        viewBox="0 0 1100 720"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Resting line — brightens when any pill is hovered */}
        <path
          d={LINE_PATH}
          className={`chain-seg ${hovered !== null ? 'chain-seg--active' : ''}`}
        />
        {/* Travelling pulse — only visible when active */}
        <path
          d={LINE_PATH}
          className={`chain-pulse ${hovered !== null ? 'chain-pulse--active' : ''}`}
        />
      </svg>

      {/* LEFT PILL — "+₹420 · Food · Just logged" — sits on left node */}
      <div
        className="glow-pill"
        style={leftPillPos}
        data-active={hovered !== null ? 'true' : 'false'}
        onMouseEnter={() => setHovered(0)}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="glow-pill__icon">🍔</div>
        <div className="flex flex-col leading-tight">
          <span className="font-mono text-[13.5px] font-extrabold text-gold-soft">
            +₹420
          </span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-fg-muted">
            Food · Just logged
          </span>
        </div>
      </div>

      {/* RIGHT PILL — "Jar 72% full" — sits on right node */}
      <div
        className="glow-pill"
        style={{ ...rightPillPos, padding: '9px 14px' }}
        data-active={hovered !== null ? 'true' : 'false'}
        onMouseEnter={() => setHovered(1)}
        onMouseLeave={() => setHovered(null)}
      >
        <span
          className="inline-block rounded-full"
          style={{
            width: 8,
            height: 8,
            background: '#fcd34d',
            boxShadow: '0 0 8px rgba(252,211,77,0.9)',
          }}
        />
        <span className="font-mono text-[12.5px] font-bold text-gold-soft tracking-[-0.01em]">
          Jar 72% full
        </span>
      </div>

      {/* Centre content channel */}
      <div className="container-prose relative z-[4] text-center">
        <Reveal delay={0}>
          <Overline>Your money, on autopilot</Overline>
        </Reveal>
        <Reveal delay={120}>
          <h1
            className="font-display herov2-h1 mx-auto mt-[22px]"
            style={{
              fontSize: 'clamp(44px, 9vw, 104px)',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 0.92,
              color: 'var(--fg-strong)',
              maxWidth: 980,
              textWrap: 'balance',
            }}
          >
            Watch your savings
            <br />
            <span className="gold-text">fill up.</span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p
            className="herov2-sub mx-auto mt-[22px]"
            style={{
              fontSize: 'clamp(15px, 1.4vw, 18px)',
              lineHeight: 1.5,
              color: 'var(--fg-muted)',
              maxWidth: 540,
              textWrap: 'pretty',
            }}
          >
            The calm finance app for India. Set a goal, watch your jar fill,
            and finally feel in control of your money.
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-[34px] flex flex-wrap justify-center gap-3">
            <a
              href="#cta"
              className="btn-gold btn-shimmer press inline-flex items-center gap-2"
              style={{
                padding: '15px 26px',
                fontSize: 14.5,
                fontWeight: 700,
                borderRadius: 14,
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <span className="relative">Get early access</span>
              <span className="relative text-base">→</span>
            </a>
            <a
              href="#how"
              className="btn-ghost-gold press inline-flex items-center gap-1.5"
              style={{
                padding: '14px 24px',
                fontSize: 14.5,
                fontWeight: 600,
                borderRadius: 14,
                textDecoration: 'none',
              }}
            >
              See how it works <span className="text-[15px]">→</span>
            </a>
          </div>
        </Reveal>
        <Reveal delay={500}>
          <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-[18px] text-xs text-fg-muted">
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--success)' }}
              />
              100% on-device
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--gold-soft)' }}
              />
              No bank login
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: '#a78bfa' }}
              />
              Free forever
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
