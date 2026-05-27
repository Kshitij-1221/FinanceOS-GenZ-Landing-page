/**
 * Privacy — "Your money never leaves your phone." section.
 *
 * Ported 1:1 from landing-v2/sections-bottom.jsx > Privacy + PrivIcon.
 *
 * Layout
 *   2-col grid (1fr / 1.1fr): PrivacyLockBig on the left, copy + checklist
 *   on the right. Collapses to a single column on ≤ 980px (jar above copy).
 *
 * Content
 *   - Overline: "Your competitive weapon"
 *   - Headline: 3-line "Your money / never / leaves your phone." with the
 *     last line in gold gradient
 *   - Sub-paragraph
 *   - 3-item checklist: lock, eye-with-strike, shield
 *
 * Animations
 *   - All blocks fade-up via the shared <Reveal> with staggered delays
 *   - Illustration sparkles handled inside <PrivacyLockBig>
 *
 * No new keyframes; just one section-specific grid rule in globals.css.
 */

import { PrivacyLockBig } from '../PrivacyLockBig';
import { Overline } from '../Overline';
import { Reveal } from '../Reveal';

type IconName = 'lock' | 'eye' | 'shield';

const CHECKLIST: Array<{ icon: IconName; label: string }> = [
  { icon: 'lock',   label: 'On-device encryption' },
  { icon: 'eye',    label: 'Zero tracking · no analytics SDK' },
  { icon: 'shield', label: "We can't read your data — there's no key" },
];

export function Privacy() {
  return (
    <section id="privacy" className="relative" style={{ padding: '80px 0 80px' }}>
      {/* Gold wash anchored on the left half (behind the shield) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 30% 50%, rgba(212,175,55,0.10), transparent 60%)',
        }}
      />

      <div className="container-prose privacy-grid relative z-[1]">
        {/* Illustration column */}
        <Reveal>
          <div className="flex justify-center">
            <PrivacyLockBig size={300} />
          </div>
        </Reveal>

        {/* Copy + checklist column */}
        <div>
          <Reveal>
            <Overline>Your competitive weapon</Overline>
          </Reveal>

          <Reveal delay={80}>
            <h2
              className="font-display priv-h mt-4 font-extrabold text-fg-strong"
              style={{
                fontSize: 'clamp(38px, 5.5vw, 60px)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1.0,
                maxWidth: 540,
                textWrap: 'balance',
              }}
            >
              Your money
              <br />
              never
              <br />
              <span className="gold-text">leaves your phone.</span>
            </h2>
          </Reveal>

          <Reveal delay={180}>
            <p
              className="mt-7 text-fg-muted"
              style={{
                fontSize: 17,
                lineHeight: 1.55,
                maxWidth: 480,
                textWrap: 'pretty',
              }}
            >
              No bank logins. No tracking. No selling your data. Everything
              lives on your device &mdash; we genuinely can&rsquo;t see it, even
              if we wanted to.
            </p>
          </Reveal>

          <Reveal delay={280}>
            <ul className="mt-7 flex list-none flex-col gap-2.5 p-0">
              {CHECKLIST.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center gap-3.5"
                  style={{
                    padding: '12px 16px',
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div
                    className="grid place-items-center text-gold-soft"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 10,
                      background: 'rgba(252,211,77,0.10)',
                      border: '1px solid rgba(252,211,77,0.25)',
                    }}
                  >
                    <PrivIcon name={row.icon} />
                  </div>
                  <span
                    className="text-fg"
                    style={{ fontSize: 14, fontWeight: 500 }}
                  >
                    {row.label}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── PrivIcon ──────────────────────────────────────────────────────────
// Stroke icons matched 1:1 with the source (sections-bottom.jsx).
// 16px, currentColor stroke so the parent's gold colour flows through.
function PrivIcon({ name }: { name: IconName }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (name === 'lock') {
    return (
      <svg {...common}>
        <rect x={5} y={11} width={14} height={10} rx={2} />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }
  if (name === 'eye') {
    // "Visibility-off" — eye with diagonal strike
    return (
      <svg {...common}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx={12} cy={12} r={3} />
        <line x1={3} y1={3} x2={21} y2={21} />
      </svg>
    );
  }
  // shield
  return (
    <svg {...common}>
      <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
    </svg>
  );
}
