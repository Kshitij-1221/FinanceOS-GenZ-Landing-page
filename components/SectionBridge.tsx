'use client';

/**
 * SectionBridge — compact gold transition rendered between sections.
 *
 * Ported 1:1 from landing-v2/sections-mid.jsx > SectionBridge.
 * On scroll-into-view it animates:
 *   · a 240px gradient hairline from width:0 → width:240px (1.1s)
 *   · a 9px gold dot scaling 0.4 → 1 with opacity 0 → 1 (0.9s, 0.2s delay)
 * IntersectionObserver fires once at 50% threshold, then disconnects.
 *
 * Public so other sections (or the page) can re-use it later. Solution
 * uses it inline as the close-out divider before PhoneShowcase.
 */

import { useEffect, useRef, useState } from 'react';

export function SectionBridge() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setVis(true);
      return;
    }
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none relative flex h-20 items-center justify-center"
    >
      {/* Soft radial wash anchored to the line */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 36% 100% at 50% 50%, rgba(212,175,55,0.10), transparent 70%)',
        }}
      />
      {/* The line */}
      <div
        style={{
          width: vis ? 240 : 0,
          height: 1,
          background:
            'linear-gradient(90deg, transparent, rgba(252,211,77,0.55) 50%, transparent)',
          transition: 'width 1100ms cubic-bezier(0.22,1,0.36,1)',
        }}
      />
      {/* The dot, centered on the line */}
      <div
        className="absolute"
        style={{
          width: 9,
          height: 9,
          borderRadius: 999,
          background: 'radial-gradient(circle, #fde68a, #92691c)',
          boxShadow: '0 0 20px rgba(252,211,77,0.7)',
          transform: `scale(${vis ? 1 : 0.4})`,
          opacity: vis ? 1 : 0,
          transition: 'all 900ms cubic-bezier(0.22,1,0.36,1) 200ms',
        }}
      />
    </div>
  );
}
