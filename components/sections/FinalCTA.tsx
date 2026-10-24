'use client';

/** Email capture through the server-side Supabase waitlist endpoint. */

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
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    if (submitted || submitting) return;
    if (!email.trim() || !consent) { setErrorMsg('Enter your email and agree to receive the welcome and early-access emails.'); return; }
    setStatus('submitting'); setErrorMsg(null);
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), consent, website, consentVersion: 'welcome-and-early-access-2026-10-23' }),
        signal: AbortSignal.timeout(35000),
      });
      const data = await response.json();
      if (!response.ok || data.ok !== true) {
        setStatus('error'); setErrorMsg(data.error || 'We could not confirm your signup. Please try again.'); return;
      }
      fireSuccess();
    } catch {
      setStatus('error'); setErrorMsg('We could not confirm your signup. Please try again.');
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
            A welcome email now, and a heads-up when we launch. No spam.
          </p>
        </Reveal>

        <Reveal delay={280}>
          <form
            id="waitlist-form" onSubmit={onSubmit}
            className="cta-form relative mx-auto mt-10 flex flex-col justify-center gap-2.5"
            style={{ maxWidth: 520 }}
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
                maxLength={254}
                autoComplete="email"
                className="min-w-0 flex-1 font-body"
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

            <label className="flex items-start gap-2 text-left text-sm text-fg-muted">
              <input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} disabled={submitted || submitting} className="mt-1" />
              <span>Send me a welcome email and let me know when Blyth early access opens. I have read the <a className="text-gold-soft underline" href="/privacy">privacy notice</a>.</span>
            </label>
            <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px' }}>
              <label>Website<input name="website" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" /></label>
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
          {submitted && <p role="status" className="mt-4 text-sm text-fg-muted">You're on the list. We'll email when early access opens.</p>}
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
              Be part of the first group
            </span>
            <span className="opacity-40">·</span>
            <span>Made for India · Built for focus</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
