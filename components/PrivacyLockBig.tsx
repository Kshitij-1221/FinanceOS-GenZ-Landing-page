'use client';

/**
 * PrivacyLockBig — clay-style gold padlock-on-shield illustration.
 *
 * Ported 1:1 from landing-v2/jar.jsx > PrivacyLockBig. Sibling to
 * LandingJar — doesn't touch or extend the locked jar component.
 *
 * Composition (back → front):
 *   1. Soft gold radial halo behind the shield (DOM, blurred 4px)
 *   2. SVG body, drop-shadow `0 22px 50px rgba(212,175,55,0.35)`:
 *      · shield backplate (gold-tinted fill + 1.5px stroke)
 *      · shackle (thick gold stroke, 14px wide, round caps)
 *      · body rect (gold gradient, dark amber stroke)
 *      · 3px inset highlight stripe on top of the body
 *      · keyhole (dark circle + 20px slot)
 *      · engraved ₹ at the bottom of the body
 *   3. Four twinkling sparkles at the corners (DOM, reusing the
 *      shared `ljSpark` keyframe from globals.css)
 *
 * Animations
 *   - The four sparkles share the global `@keyframes ljSpark`
 *     (already defined in app/globals.css for the jar). No new
 *     keyframes needed.
 *   - prefers-reduced-motion: the global block in globals.css
 *     collapses animation-duration to 0.001ms, so sparkles
 *     freeze in place instead of pulsing.
 */

interface PrivacyLockBigProps {
  size?: number;
}

export function PrivacyLockBig({ size = 260 }: PrivacyLockBigProps) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size * 1.05 }}
    >
      {/* Halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          inset: -28,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(252,211,77,0.24) 0%, rgba(212,175,55,0.08) 40%, transparent 70%)',
          filter: 'blur(4px)',
        }}
      />

      <svg
        viewBox="0 0 200 220"
        width={size}
        height={size * 1.1}
        className="relative"
        style={{ filter: 'drop-shadow(0 22px 50px rgba(212,175,55,0.35))' }}
      >
        <defs>
          <linearGradient id="pl-shield" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="rgba(252,211,77,0.18)" />
            <stop offset="100%" stopColor="rgba(146,105,28,0.04)" />
          </linearGradient>
          <linearGradient id="pl-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#fde68a" />
            <stop offset="40%"  stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#92691c" />
          </linearGradient>
          <linearGradient id="pl-shine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
            <stop offset="50%"  stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="pl-shackle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#fde68a" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Shield */}
        <path
          d="M100 14 L168 36 Q172 36 172 40 L172 110 Q172 172 100 206 Q28 172 28 110 L28 40 Q28 36 32 36 Z"
          fill="url(#pl-shield)"
          stroke="rgba(252,211,77,0.4)"
          strokeWidth={1.5}
        />

        {/* Shackle */}
        <path
          d="M70 100 V78 Q70 50 100 50 Q130 50 130 78 V100"
          fill="none"
          stroke="url(#pl-shackle)"
          strokeWidth={14}
          strokeLinecap="round"
        />

        {/* Lock body */}
        <rect
          x={56}
          y={96}
          width={88}
          height={78}
          rx={14}
          fill="url(#pl-body)"
          stroke="rgba(146,105,28,0.6)"
          strokeWidth={1}
        />

        {/* Inset highlight stripe along the top of the body */}
        <rect
          x={58}
          y={98}
          width={84}
          height={3}
          rx={2}
          fill="url(#pl-shine)"
          opacity={0.7}
        />

        {/* Keyhole */}
        <circle cx={100} cy={130} r={9} fill="#3a2a08" />
        <rect x={97} y={134} width={6} height={20} rx={2} fill="#3a2a08" />

        {/* Engraved ₹ */}
        <text
          x={100}
          y={168}
          fontFamily="var(--font-unbounded), sans-serif"
          fontSize={11}
          fontWeight={900}
          fill="rgba(58,42,8,0.55)"
          textAnchor="middle"
        >
          ₹
        </text>
      </svg>

      {/* Four corner sparkles — reuse the global ljSpark keyframe */}
      <Spark x="20%" y="18%" size={5} delay="0s"   />
      <Spark x="82%" y="26%" size={4} delay="0.8s" />
      <Spark x="84%" y="78%" size={5} delay="1.4s" />
      <Spark x="16%" y="72%" size={4} delay="1.9s" />
    </div>
  );
}

// Local 4-point gold star — same shape & keyframe as the jar sparkles.
// Inlined here so PrivacyLockBig stays self-contained and doesn't reach
// into LandingJar's internal helpers.
function Spark({
  x,
  y,
  size = 5,
  delay = '0s',
}: {
  x: string;
  y: string;
  size?: number;
  delay?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        left: x,
        top: y,
        width: size * 3,
        height: size * 3,
        transform: 'translate(-50%, -50%)',
        animation: 'ljSpark 2.6s ease-in-out infinite',
        animationDelay: delay,
      }}
    >
      <svg
        viewBox="0 0 10 10"
        width={size * 3}
        height={size * 3}
        style={{ display: 'block' }}
      >
        <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="#fcd34d" />
      </svg>
    </span>
  );
}
