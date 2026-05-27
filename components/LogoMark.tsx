/**
 * LogoMark — square gold ₹ icon used in the nav and footer.
 * Ported from landing-v2/sections-top.jsx > LogoMark.
 */

interface LogoMarkProps {
  size?: number;
}

export function LogoMark({ size = 32 }: LogoMarkProps) {
  return (
    <span
      aria-hidden="true"
      className="inline-grid place-items-center font-display"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background:
          'linear-gradient(180deg, #fcd34d 0%, #d4af37 60%, #92691c 100%)',
        boxShadow:
          '0 6px 18px rgba(212,175,55,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
        fontWeight: 900,
        fontSize: size * 0.55,
        color: '#1a1202',
        letterSpacing: '-0.04em',
      }}
    >
      ₹
    </span>
  );
}
