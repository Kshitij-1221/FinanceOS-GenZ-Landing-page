'use client';

/**
 * TrustBarV2 — honest pre-launch stats card directly under the hero.
 *
 * Four cells, no count-up needed for these particular numbers (they're
 * static strings like "100%", "0", "India") — the brief calls these
 * "honest stats" not vanity counters. Each cell still gets a staggered
 * scroll reveal.
 */

import { Reveal } from './Reveal';

const STATS = [
  { value: '100%',  label: 'On-device privacy',    mono: true,  accent: true  },
  { value: '0',     label: 'Bank logins required', mono: true,  accent: false },
  { value: '0',     label: 'Ads, ever',            mono: true,  accent: false },
  { value: 'India', label: 'Made for',             mono: false, accent: true  },
] as const;

export function TrustBarV2() {
  return (
    <section className="relative">
      <div className="container-prose pb-2 pt-8">
        <Reveal>
          <div className="glass-card grid grid-cols-2 gap-4 rounded-[20px] px-7 py-[22px] md:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80} y={10}>
                <div
                  className="flex flex-col gap-1.5"
                  style={{
                    borderLeft: i === 0 ? '0' : '1px solid rgba(255,255,255,0.06)',
                    paddingLeft: i === 0 ? 0 : 22,
                  }}
                >
                  <div
                    className={`${s.mono ? 'font-mono' : 'font-display'} text-[34px] font-extrabold leading-none`}
                    style={{
                      letterSpacing: '-0.03em',
                      color: s.accent ? 'transparent' : 'var(--fg-strong)',
                      background: s.accent
                        ? 'linear-gradient(180deg, #fde68a 0%, #d4af37 60%, #92691c 100%)'
                        : 'none',
                      WebkitBackgroundClip: s.accent ? 'text' : 'border-box',
                      backgroundClip: s.accent ? 'text' : 'border-box',
                    }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fg-muted">
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
