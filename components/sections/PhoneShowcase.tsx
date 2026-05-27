'use client';

/**
 * PhoneShowcase — three angled phone frames with scroll parallax.
 *
 * Ported 1:1 from landing-v2/sections-mid.jsx > PhoneShowcase.
 *
 * Layout:
 *   - 3 phones rendered side-by-side on a flex row that's anchored to
 *     `align-items: flex-end`. The CENTER phone is `featured` —
 *     slightly larger, gold-glow shadow, brought forward via negative
 *     horizontal margin so it overlaps its neighbours.
 *   - The side phones tilt ±7°, the centre phone stays upright.
 *
 * Animation:
 *   - Mounts a single scroll listener that computes `t` from the
 *     section's centre vs the viewport centre (range ≈ -1..1 with a
 *     soft clamp at ±1.2). Each phone's `translateY` is keyed off `t`
 *     — the centre phone moves faster (factor -38) than the sides
 *     (-22), creating depth-of-field parallax as you scroll past.
 *   - Wrapped in requestAnimationFrame so we only setState once per
 *     frame on rapid scroll, plus a resize listener to recompute when
 *     the viewport changes.
 *   - prefers-reduced-motion: skip the listener entirely → all phones
 *     render at their resting translateY values, no scroll motion.
 *   - Hover any phone: it lifts -12px via CSS (loses rotation on
 *     purpose — matches source behaviour where phones "stand up").
 *
 * Responsive:
 *   - ≤ 980px: the 3-phone stage is scale(0.82) wide, headline 40px
 *   - ≤ 640px: stage scale(0.66) — phones get clipped at the edges,
 *     the section's `overflow: hidden` is doing the work.
 *
 * Missing-image fallback:
 *   - Each PhoneFrame tracks `imgError` state; if the PNG isn't in
 *     /public/img yet, a styled placeholder with the screen label
 *     renders instead of a broken-image icon.
 */

import { useEffect, useRef, useState } from 'react';
import { Overline } from '../Overline';
import { Reveal } from '../Reveal';

const PHONES = [
  {
    src:    '/img/screen-promise.png',
    label:  'Promise',
    rotate: -7,
    z:      1,
    base:   20,   // base translateY before parallax
    speed:  -22,  // multiplied by `t` for parallax
    featured: false,
  },
  {
    src:    '/img/screen-dashboard.png',
    label:  'Dashboard',
    rotate: 0,
    z:      3,
    base:   -20,
    speed:  -38,
    featured: true,
  },
  {
    src:    '/img/screen-setup.png',
    label:  'Setup',
    rotate: 7,
    z:      1,
    base:   20,
    speed:  -22,
    featured: false,
  },
] as const;

export function PhoneShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let raf = 0;
    const compute = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const centre = r.top + r.height / 2;
      // k ≈ -1 when section is well above viewport, ≈ 1 when well below
      const k = (centre - vh / 2) / vh;
      setT(Math.max(-1.2, Math.min(1.2, k)));
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
      ref={sectionRef as never}
      className="relative overflow-hidden"
      style={{ padding: '80px 0 90px' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.08), transparent 60%)',
        }}
      />

      <div className="container-prose relative z-[1]">
        <Reveal>
          <Overline>The real app</Overline>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="font-display phone-h mt-4 font-extrabold text-fg-strong"
            style={{
              fontSize: 'clamp(34px, 5.5vw, 56px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              maxWidth: 800,
              textWrap: 'balance',
            }}
          >
            Beautiful. Calm.
            <br />
            <span className="gold-text">Yours.</span>
          </h2>
        </Reveal>

        <div
          className="phones-stage relative mt-[72px] flex items-end justify-center"
          style={{ minHeight: 640, gap: 0 }}
        >
          {/* Center-phone background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 420,
              height: 520,
              background:
                'radial-gradient(ellipse, rgba(212,175,55,0.20), transparent 65%)',
              filter: 'blur(8px)',
              zIndex: 0,
            }}
          />

          {PHONES.map((p, i) => (
            <Reveal key={p.src} delay={i * 180} y={p.featured ? 64 : 48}>
              <PhoneFrame
                src={p.src}
                label={p.label}
                rotate={p.rotate}
                translateY={p.base + t * p.speed}
                z={p.z}
                featured={p.featured}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PhoneFrame ────────────────────────────────────────────────────────
interface PhoneFrameProps {
  src: string;
  /** Friendly name used in the placeholder if the image is missing. */
  label: string;
  rotate?: number;
  translateY?: number;
  z?: number;
  featured?: boolean;
}

function PhoneFrame({
  src,
  label,
  rotate = 0,
  translateY = 0,
  z = 1,
  featured = false,
}: PhoneFrameProps) {
  const [imgError, setImgError] = useState(false);

  const innerW = featured ? 264 : 244;
  const innerH = featured ? 572 : 528;

  return (
    <div
      className="phone-frame relative"
      style={{
        transform: `translateY(${translateY}px) rotate(${rotate}deg)`,
        zIndex: z,
        padding: 8,
        borderRadius: 44,
        background: 'linear-gradient(145deg, #1a1a1c 0%, #08090c 100%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: featured
          ? '0 36px 90px rgba(0,0,0,0.65), 0 0 50px rgba(212,175,55,0.20)'
          : '0 22px 60px rgba(0,0,0,0.55)',
        margin: featured ? '0 -10px' : '0',
      }}
    >
      <div
        className="relative overflow-hidden bg-bg-base"
        style={{ width: innerW, height: innerH, borderRadius: 36 }}
      >
        {imgError ? (
          <PhonePlaceholder label={label} />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element -- intentional: raw <img> for object-fit cover + onError fallback */
          <img
            src={src}
            alt={`FinanceOS — ${label} screen`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full"
            style={{ objectFit: 'cover', objectPosition: 'top' }}
          />
        )}

        {/* Notch overlay — sits at top centre of the inner phone screen */}
        <div
          aria-hidden="true"
          className="absolute"
          style={{
            top: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 92,
            height: 24,
            borderRadius: 14,
            background: '#050505',
          }}
        />
      </div>
    </div>
  );
}

// ── Placeholder shown when the PNG isn't in /public/img yet ───────────
function PhonePlaceholder({ label }: { label: string }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center"
      style={{
        background:
          'linear-gradient(180deg, rgba(212,175,55,0.05), rgba(5,5,5,1) 60%)',
      }}
    >
      <div
        className="font-mono text-xs uppercase tracking-[0.22em] text-gold"
        style={{ fontWeight: 700 }}
      >
        {label}
      </div>
      <div
        className="font-display text-2xl font-extrabold text-fg-strong"
        style={{ letterSpacing: '-0.02em' }}
      >
        screen
        <br />
        <span className="gold-text">placeholder</span>
      </div>
      <div className="mt-2 max-w-[200px] text-[11px] leading-snug text-fg-muted">
        Drop your PNG at <span className="font-mono text-fg">/public/img/screen-{label.toLowerCase()}.png</span>
      </div>
    </div>
  );
}
