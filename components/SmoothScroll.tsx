'use client';

/**
 * SmoothScroll — Lenis-powered buttery scroll provider.
 *
 * Architecture
 *   This component is mounted at the root of <body> in app/layout.tsx
 *   and wraps every section. It contains:
 *
 *     1. A `prefers-reduced-motion` guard. If the user has reduced motion
 *        enabled, we return children unwrapped — native scroll only,
 *        zero Lenis. Re-evaluated on media-query changes too.
 *
 *     2. <ReactLenis root> with our chosen options:
 *          lerp        = 0.1   (premium, easy to tweak)
 *          smoothWheel = true  (mouse-wheel + trackpad smoothing)
 *        (No `smoothTouch` — deprecated; touch devices stay native.)
 *
 *     3. <AnchorIntercept /> — a global click delegator that hijacks
 *        every <a href="#…"> click on the page and routes it through
 *        `lenis.scrollTo(target)` so anchor jumps animate instead of
 *        snapping. Plain anchor markup keeps working; no per-anchor
 *        wiring required in Nav / Hero / etc.
 *
 * Sync with existing animations
 *   Lenis intercepts wheel/touch events and animates `window.scrollTo`,
 *   which fires native `scroll` events on the window. So every existing
 *   listener in the app — Solution's RAF-throttled fill, PhoneShowcase's
 *   parallax, HowItWorks' draw progress, Nav's "scrolled" state — keeps
 *   reading `getBoundingClientRect()` and `window.scrollY` correctly,
 *   updated once per Lenis frame. No code changes needed in those
 *   components. <Reveal> uses IntersectionObserver (independent of
 *   scroll mechanism) and works unchanged too.
 *
 *   If we ever see desync, the cleanest fix is to switch the offending
 *   section to `useLenis(({ scroll }) => …)` to read Lenis state
 *   directly — but that's a future call.
 *
 * SSR safety
 *   `enabled` starts as null and only flips to a real boolean inside
 *   useEffect (where `window` exists). During the first paint we render
 *   children unwrapped → SSR + first client paint are identical → no
 *   hydration mismatch.
 */

import { useEffect, useState, type ReactNode } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';

const REDUCED_MOTION_MQ = '(prefers-reduced-motion: reduce)';

export function SmoothScroll({ children }: { children: ReactNode }) {
  // null = unknown (SSR / first paint). true = Lenis on. false = native scroll.
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      setEnabled(true);
      return;
    }
    const mq = window.matchMedia(REDUCED_MOTION_MQ);
    setEnabled(!mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(!e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Until we've checked the MQ (or if user prefers reduced motion),
  // render children unwrapped — native scroll only.
  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
      }}
    >
      <AnchorIntercept />
      {children}
    </ReactLenis>
  );
}

// ── AnchorIntercept ───────────────────────────────────────────────────
// Single document-level click listener that turns any `<a href="#…">`
// click into a Lenis scroll-to. Mounted inside <ReactLenis> so useLenis
// returns the live instance.
function AnchorIntercept() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onClick = (e: MouseEvent) => {
      // Respect modifier keys & non-left-clicks (cmd-click opens new tab, etc.)
      if (
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return;
      }
      const target = e.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      // Look up the destination element by id — querySelector handles the #
      // prefix natively. Fallback: bail to native behaviour.
      let dest: Element | null = null;
      try {
        dest = document.querySelector(href);
      } catch {
        return;
      }
      if (!(dest instanceof HTMLElement)) return;

      e.preventDefault();
      // Small negative offset so the destination's heading isn't tucked
      // directly under the floating nav pill (which is ~56px tall + 16 top).
      lenis.scrollTo(dest, { offset: -16 });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lenis]);

  return null;
}
