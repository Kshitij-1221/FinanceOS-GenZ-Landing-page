'use client';

/**
 * LandingJar — faithful port of landing-v2/jar.jsx > LandingJar.
 *
 * One reusable jar used at every size: hero watermark (large + dim),
 * solution focal point (animated fill), calculator preview, feature
 * tiles, etc. NOT shared with the React Native app — purely a
 * web-side recreation matching the screenshots.
 *
 * Props:
 *   pct       — 0–100 fill level
 *   size      — pixel width; height is auto (size × 1.1)
 *   coins     — number of clustered floor coins (0..10)
 *   glow      — drop-shadow intensity: 'mega' | 'strong' | 'soft' | 'none'
 *   dropping  — show stream of falling coins above the lid
 *   sparkles  — twinkling stars (inside the jar + 4 around it)
 *   withScale — 25/50/75/100 tick marks on the right edge
 *   idSeed    — unique gradient id prefix so multiple jars co-exist on the page
 */

import { useMemo } from 'react';

export interface LandingJarProps {
  pct?: number;
  size?: number;
  coins?: number;
  glow?: 'mega' | 'strong' | 'soft' | 'none';
  dropping?: boolean;
  sparkles?: boolean;
  withScale?: boolean;
  idSeed?: string;
}

const JAR_PATH =
  'M45 55 Q45 50 50 50 L150 50 Q155 50 155 55 L155 180 Q155 195 140 195 L60 195 Q45 195 45 180 Z';

// Deterministic coin positions at the floor of the jar. Source of truth: jar.jsx.
const COIN_SPOTS = [
  { x: 70,  y: 178, r: 5,   d: 0    },
  { x: 92,  y: 184, r: 5.5, d: 0.4  },
  { x: 115, y: 178, r: 5,   d: 0.8  },
  { x: 78,  y: 168, r: 4.5, d: 1.2  },
  { x: 103, y: 170, r: 5,   d: 1.6  },
  { x: 130, y: 172, r: 5,   d: 2.0  },
  { x: 60,  y: 175, r: 4,   d: 0.2  },
  { x: 140, y: 184, r: 4.5, d: 1.0  },
  { x: 86,  y: 178, r: 4,   d: 1.4  },
  { x: 122, y: 184, r: 4.5, d: 0.6  },
] as const;

// Falling coins (when `dropping`): four staggered drops cycling forever.
const DROP_COINS = [
  { x: 78,  r: 5,   d: 0   },
  { x: 100, r: 6,   d: 0.6 },
  { x: 122, r: 4.5, d: 1.2 },
  { x: 92,  r: 4,   d: 1.8 },
] as const;

// Tick marks for the right edge — y in viewBox coords (matches the screenshots).
const TICKS = [
  { y: 158, label: '25',  strong: false },
  { y: 122, label: '50',  strong: false },
  { y: 86,  label: '75',  strong: false },
  { y: 50,  label: '100', strong: true  },
] as const;

export function LandingJar({
  pct = 70,
  size = 320,
  coins = 8,
  glow = 'strong',
  dropping = false,
  sparkles = true,
  withScale = true,
  idSeed = 'lj',
}: LandingJarProps) {
  const p = Math.max(0, Math.min(100, pct));
  // Liquid surface y in viewBox — 100% → 60, 0% → 195.
  const yTop = 195 - (p / 100) * 135;

  const haloPx =
    glow === 'mega'   ? 100 :
    glow === 'strong' ? 60  :
    glow === 'soft'   ? 30  :
    0;

  const visibleCoins = useMemo(
    () => COIN_SPOTS.slice(0, Math.max(0, Math.min(COIN_SPOTS.length, coins))),
    [coins],
  );

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size * 1.1 }}
    >
      {/* Outer gold halo */}
      {haloPx > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            inset: -haloPx * 0.5,
            background:
              'radial-gradient(circle at 50% 55%, rgba(252,211,77,0.28) 0%, rgba(212,175,55,0.10) 35%, transparent 65%)',
            filter: 'blur(6px)',
          }}
        />
      )}

      <svg
        viewBox="0 0 220 250"
        width={size}
        height={size * 1.1}
        className="relative overflow-visible"
        style={{
          filter:
            haloPx > 0
              ? `drop-shadow(0 0 ${haloPx}px rgba(252,211,77,0.45))`
              : 'none',
        }}
      >
        <defs>
          <linearGradient id={`${idSeed}-tier`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#fde68a" />
            <stop offset="50%"  stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id={`${idSeed}-shine`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="rgba(255,255,255,0)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.32)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id={`${idSeed}-floor`} cx="50%" cy="100%" r="60%">
            <stop offset="0%"   stopColor="rgba(212,175,55,0.55)" />
            <stop offset="100%" stopColor="rgba(212,175,55,0)" />
          </radialGradient>
          <radialGradient id={`${idSeed}-coin`} cx="35%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#fef3c7" />
            <stop offset="55%"  stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
          <clipPath id={`${idSeed}-clip`}>
            <path d={JAR_PATH} />
          </clipPath>
        </defs>

        {/* Floor shadow */}
        <ellipse cx={100} cy={210} rx={62} ry={6} fill={`url(#${idSeed}-floor)`} />

        {/* Lid — dark band + smaller knob */}
        <g>
          <rect
            x={58} y={38} width={84} height={9} rx={2.5}
            fill="rgba(26,26,28,0.92)"
            stroke="rgba(255,255,255,0.10)" strokeWidth={1.2}
          />
          <rect
            x={85} y={30} width={30} height={7} rx={1.5}
            fill="rgba(26,26,28,0.92)"
            stroke="rgba(255,255,255,0.10)" strokeWidth={1.2}
          />
        </g>

        {/* Glass body */}
        <path
          d={JAR_PATH}
          fill="rgba(255,255,255,0.025)"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={1.2}
        />

        {/* Clipped contents */}
        <g clipPath={`url(#${idSeed}-clip)`}>
          {/* Solid fill */}
          <rect x={0} y={yTop} width={200} height={200} fill={`url(#${idSeed}-tier)`} />
          {/* Wavy surface — `lj-wave` animates translateX */}
          <path
            className="lj-wave"
            d={
              `M-200 ${yTop} Q-150 ${yTop - 6} -100 ${yTop} ` +
              `T0 ${yTop} T100 ${yTop} T200 ${yTop} T300 ${yTop} T400 ${yTop} ` +
              `V200 H-200 Z`
            }
            fill={`url(#${idSeed}-tier)`}
            opacity={0.85}
          />
          {/* Coins at the floor */}
          {p > 5 &&
            visibleCoins.map((c, i) => (
              <g key={i} className="lj-coin" style={{ animationDelay: `${-c.d}s` }}>
                <circle
                  cx={c.x} cy={c.y} r={c.r}
                  fill={`url(#${idSeed}-coin)`}
                  stroke="#92691c"
                  strokeWidth={0.7}
                />
                <text
                  x={c.x - c.r * 0.45}
                  y={c.y + c.r * 0.6}
                  fontFamily="Outfit, sans-serif"
                  fontSize={c.r * 1.15}
                  fontWeight={700}
                  fill="#7a3d00"
                >
                  ₹
                </text>
              </g>
            ))}
          {/* Vertical left highlight stripe */}
          <rect x={55} y={55} width={3} height={135} rx={1.5} fill="rgba(255,255,255,0.18)" />
          {/* Diagonal glass shine over everything inside */}
          <rect x={0} y={0} width={200} height={250} fill={`url(#${idSeed}-shine)`} opacity={0.6} />
        </g>

        {/* Inner sparkles (behind the shine — inside the jar visually) */}
        {sparkles && (
          <>
            <g style={{ animation: 'ljSpark 2.6s ease-in-out infinite', animationDelay: '0.1s' }}>
              <path d="M75 110 L77 117 L84 119 L77 121 L75 128 L73 121 L66 119 L73 117 Z" fill="#fde68a" />
            </g>
            <g style={{ animation: 'ljSpark 2.6s ease-in-out infinite', animationDelay: '1.4s' }}>
              <path d="M62 160 L63 164 L67 165 L63 166 L62 170 L61 166 L57 165 L61 164 Z" fill="#fcd34d" />
            </g>
            <g style={{ animation: 'ljSpark 2.6s ease-in-out infinite', animationDelay: '0.8s' }}>
              <path d="M105 60 L106 64 L110 65 L106 66 L105 70 L104 66 L100 65 L104 64 Z" fill="#fcd34d" />
            </g>
          </>
        )}

        {/* Tick marks on the right edge */}
        {withScale && (
          <g fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace" fontSize={8}>
            {TICKS.map((m) => (
              <g key={m.label}>
                <line
                  x1={160} x2={172}
                  y1={m.y} y2={m.y}
                  stroke={m.strong ? '#fcd34d' : 'white'}
                  strokeOpacity={m.strong ? 1 : 0.32}
                  strokeWidth={m.strong ? 1.4 : 0.7}
                />
                <text
                  x={178}
                  y={m.y + 3}
                  fill={m.strong ? '#fcd34d' : 'white'}
                  fillOpacity={m.strong ? 1 : 0.5}
                  fontWeight={m.strong ? 700 : 400}
                >
                  {m.label}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* Falling coins above the lid */}
        {dropping && (
          <g>
            {DROP_COINS.map((c, i) => (
              <g
                key={i}
                style={{
                  animation: 'ljDrop 2.4s ease-in infinite',
                  animationDelay: `${c.d}s`,
                }}
              >
                <circle
                  cx={c.x} cy={0} r={c.r}
                  fill={`url(#${idSeed}-coin)`}
                  stroke="#92691c" strokeWidth={0.7}
                />
                <text
                  x={c.x - c.r * 0.5}
                  y={c.r * 0.6}
                  fontFamily="Outfit"
                  fontSize={c.r * 1.15}
                  fontWeight={800}
                  fill="#7a3d00"
                >
                  ₹
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>

      {/* DOM sparkles around the jar (crisper blur than inline SVG) */}
      {sparkles && (
        <>
          <JarSparkle x="8%"  y="28%" size={6} delay="0s" />
          <JarSparkle x="92%" y="36%" size={5} delay="0.7s" />
          <JarSparkle x="86%" y="74%" size={6} delay="1.2s" />
          <JarSparkle x="10%" y="70%" size={5} delay="1.7s" />
        </>
      )}
    </div>
  );
}

function JarSparkle({
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
