'use client';

/**
 * FinalCTA — email capture → Formspree → gold confetti.
 *
 * Ported from landing-v2/sections-bottom.jsx > FinalCTA, with three
 * production additions on top of the prototype:
 *   1. Real POST to NEXT_PUBLIC_FORMSPREE_ENDPOINT (JSON; Accept: JSON)
 *   2. Loading + error states (the prototype only had idle/submitted)
 *   3. Graceful fallback: if the env var isn't set, we short-circuit
 *      to a local "preview success" so the page still demos cleanly
 *      without an endpoint configured
 *
 * Confetti
 *   - 36 pseudo-random pieces (3 shapes: disc, diamond, streamer)
 *   - Generated once on success, mounted for 3.6s then torn down
 *   - Animated via `@keyframes ctaConfetti` in globals.css
 *   - Spread horizontally around the form centre via marginLeft
 *
 * Reduced motion
 *   - The global `prefers-reduced-motion` guard in globals.css collapses
 *     the confetti keyframe to 0.001ms — pieces don't visually animate
 *     but they still mount briefly so screen readers / aria-live
 *     observers see the same DOM change
 *
 * Section is the last on the page (Footer renders after).
 */

import { useState } from 'react';
import { Overline } from '../Overline';
import { Reveal } from '../Reveal';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface ConfettiPiece {
  id: number;
  /** horizontal offset from centre (-110..+110) */
  x: number;
  /** firing delay in ms */
  delay: number;
  /** start rotation in deg */
  rot: number;
  size: number;
  /** 0 = disc, 1 = diamond, 2 = streamer */
  shape: 0 | 1 | 2;
}

const CONFETTI_COUNT = 36;
const CONFETTI_LIFETIME_MS = 3600;

function generateConfetti(): ConfettiPiece[] {
  const arr: ConfettiPiece[] = [];
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    arr.push({
      id: i,
      x: 40 + ((i * 137) % 220) - 110,
      delay: (i % 12) * 50,
      rot: (i * 31) % 360,
      size: 6 + (i % 4) * 2,
      shape: (i % 3) as 0 | 1 | 2,
    });
  }
  return arr;
}

export function FinalCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
  const submitted = status === 'success';
  const submitting = status === 'submitting';

  const fireSuccess = () => {
    setStatus('success');
    setErrorMsg(null);
    const pieces = generateConfetti();
    setConfetti(pieces);
    window.setTimeout(() => setConfetti([]), CONFETTI_LIFETIME_MS);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || submitted || submitting) return;

    setStatus('submitting');
    setErrorMsg(null);

    // Fallback path — no endpoint configured. Lets the page demo without
    // Formspree set up. Includes a tiny artificial latency so the UI
    // transitions don't feel jarring.
    if (
      !endpoint ||
      endpoint.includes('your-form-id') ||
      !endpoint.startsWith('https://')
    ) {
      window.setTimeout(fireSuccess, 240);
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        // Formspree returns 422 for validation errors with a JSON body
        let detail = `Couldn't submit (HTTP ${res.status}).`;
        try {
          const data = (await res.json()) as { error?: string; errors?: Array<{ message?: string }> };
          detail = data.error || data.errors?.[0]?.message || detail;
        } catch {
          /* body not JSON — keep the generic detail */
        }
        setStatus('error');
        setErrorMsg(detail);
        return;
      }
      fireSuccess();
    } catch {
      setStatus('error');
      setErrorMsg('Network hiccup — try again in a moment?');
    }
  };

  return (
    <section
      id="cta"
      className="relative overflow-hidden"
      style={{ padding: '80px 0 110px' }}
    >
      {/* Gold radial washes — centred + a softer one at the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.16), transparent 60%),' +
            'radial-gradient(ellipse 30% 20% at 50% 100%, rgba(212,175,55,0.10), transparent 70%)',
        }}
      />

      <div
        className="container-prose relative z-[1] text-center"
        style={{ maxWidth: 760 }}
      >
        <Reveal>
          <Overline>Be first</Overline>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="font-display cta-h mt-[22px] font-extrabold text-fg-strong"
            style={{
              fontSize: 'clamp(40px, 8vw, 80px)',
              fontWeight: 900,
              letterSpacing: '-0.045em',
              lineHeight: 0.95,
              textWrap: 'balance',
            }}
          >
            Start filling
            <br />
            <span className="gold-text">your jar.</span>
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p
            className="mx-auto mt-[26px] text-fg-muted"
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              maxWidth: 540,
              textWrap: 'pretty',
            }}
          >
            Join the early access list &mdash; be first to feel calm about money.
            One email when we ship. No spam, ever.
          </p>
        </Reveal>

        <Reveal delay={280}>
          <form
            onSubmit={onSubmit}
            className="cta-form relative mx-auto mt-10 flex justify-center gap-2.5"
            style={{ maxWidth: 520 }}
            noValidate
            aria-busy={submitting}
          >
            <div
              className="glass-card flex flex-1 items-center"
              style={{
                padding: '0 6px 0 18px',
                borderRadius: 16,
                border: submitted
                  ? '1px solid rgba(252,211,77,0.5)'
                  : '1px solid rgba(255,255,255,0.10)',
                boxShadow: submitted
                  ? '0 0 24px rgba(252,211,77,0.25)'
                  : 'var(--shadow-card)',
                transition: 'all 240ms ease',
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                disabled={submitted || submitting}
                aria-label="Email address"
                className="flex-1 font-body"
                style={{
                  padding: '16px 0',
                  fontSize: 15,
                  border: 0,
                  outline: 0,
                  background: 'transparent',
                  color: 'var(--fg-strong)',
                }}
              />
              <button
                type="submit"
                className="btn-gold btn-shimmer press relative inline-flex items-center gap-1.5 overflow-hidden"
                disabled={submitted || submitting}
                style={{
                  padding: '10px 18px',
                  borderRadius: 12,
                  fontSize: 13.5,
                  fontWeight: 700,
                  margin: 5,
                }}
              >
                <span className="relative">
                  {submitted ? "You're in!" : submitting ? 'Sending…' : 'Get early access'}
                </span>
                {!submitted && !submitting && (
                  <span className="relative" style={{ fontSize: 15 }}>
                    →
                  </span>
                )}
                {submitted && (
                  <span className="relative" style={{ fontSize: 14 }}>
                    ✓
                  </span>
                )}
              </button>
            </div>

            {/* Confetti — absolutely positioned just below the form, shooting up */}
            {confetti.map((c) => (
              <span
                key={c.id}
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{
                  left: '50%',
                  top: '100%',
                  marginLeft: c.x,
                  width: c.size,
                  height: c.size,
                  transform: `rotate(${c.rot}deg)`,
                  animation: 'ctaConfetti 2.4s cubic-bezier(0.34,1.2,0.64,1) forwards',
                  animationDelay: `${c.delay}ms`,
                }}
              >
                {c.shape === 0 ? (
                  <span
                    className="block h-full w-full rounded-full"
                    style={{
                      background: c.id % 2 ? '#fcd34d' : '#fde68a',
                      boxShadow: '0 0 8px rgba(252,211,77,0.7)',
                    }}
                  />
                ) : c.shape === 1 ? (
                  <span
                    className="block h-full w-full"
                    style={{
                      background: '#d4af37',
                      transform: 'rotate(45deg)',
                    }}
                  />
                ) : (
                  <span
                    className="block"
                    style={{
                      width: 2,
                      height: c.size * 2,
                      background: '#fcd34d',
                      boxShadow: '0 0 6px rgba(252,211,77,0.6)',
                    }}
                  />
                )}
              </span>
            ))}
          </form>

          {/* Error message — replaces the trust line while in error state.
              Polite aria-live so screen readers announce without stealing focus. */}
          {status === 'error' && (
            <div
              role="status"
              aria-live="polite"
              className="mt-4 inline-block rounded-xl px-3.5 py-2"
              style={{
                background: 'rgba(244,63,94,0.08)',
                border: '1px solid rgba(244,63,94,0.3)',
                color: 'var(--danger)',
                fontSize: 13,
              }}
            >
              {errorMsg ?? "Couldn't submit. Try again?"}
            </div>
          )}
        </Reveal>

        <Reveal delay={380}>
          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-fg-muted"
          >
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--success)' }}
              />
              4,200+ already on the list
            </span>
            <span className="opacity-40">·</span>
            <span>Made for India · Built for focus</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
