/**
 * Problem — the emotional opener after the trust bar.
 *
 * Ported 1:1 from landing-v2/sections-top.jsx > Problem.
 *
 * Layout:
 *   - Section: 90px top/bottom padding, container clamped to 880px
 *   - Overline ("Sound familiar?")
 *   - H2 with a gold-gradient second line ("Where did my money / even go?")
 *   - 3 pain-point lines, each a gold-dot bullet + sentence
 *
 * Animations:
 *   - Every text block fades + slides up via the shared <Reveal>
 *   - Lines stagger by 140ms (matches the source)
 *
 * Responsive:
 *   - H2 scales from 60px → 44px via clamp()
 *
 * No section-specific styles needed in globals.css.
 */

import { Overline } from '../Overline';
import { Reveal } from '../Reveal';

const LINES = [
  'Salary comes in… vanishes by the 20th.',
  'Three apps open, still no clarity.',
  'Saving feels like a chore.',
] as const;

export function Problem() {
  return (
    <section className="relative py-[90px]">
      <div className="container-prose" style={{ maxWidth: 880 }}>
        <Reveal>
          <Overline>Sound familiar?</Overline>
        </Reveal>

        <Reveal delay={100}>
          <h2
            className="font-display mt-4 font-extrabold text-fg-strong"
            style={{
              fontSize: 'clamp(44px, 5.5vw, 60px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              textWrap: 'balance',
            }}
          >
            Where did my money
            <br />
            <span className="gold-text">even go?</span>
          </h2>
        </Reveal>

        <div className="mt-9 flex flex-col gap-4">
          {LINES.map((line, i) => (
            <Reveal key={line} delay={i * 140} y={20}>
              <p
                className="text-fg"
                style={{
                  fontSize: 'clamp(17px, 1.6vw, 21px)',
                  fontWeight: 500,
                  lineHeight: 1.4,
                  maxWidth: 640,
                  textWrap: 'pretty',
                }}
              >
                <span
                  aria-hidden="true"
                  className="mr-3.5 inline-block align-middle"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: 'rgba(252,211,77,0.55)',
                  }}
                />
                {line}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
