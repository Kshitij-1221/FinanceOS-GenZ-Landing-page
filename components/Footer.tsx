/**
 * Footer — final strip with logo, link row, indie founder line.
 * Server component — no interactivity.
 */

import { LogoMark } from './LogoMark';

const LINKS = ['Privacy', 'Terms', 'Contact', 'Twitter', 'Instagram'];

export function Footer() {
  return (
    <footer
      className="border-t border-white/[0.06] py-10 pb-7"
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      <div className="container-prose flex flex-wrap items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <LogoMark size={32} />
          <div>
            <div
              className="font-display text-[15px] font-extrabold text-fg-strong"
              style={{ letterSpacing: '-0.01em' }}
            >
              FinanceOS
            </div>
            <div className="mt-0.5 text-[11.5px] text-fg-muted">
              Built for focus.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          {LINKS.map((l) => (
            <a
              key={l}
              href="#"
              className="text-[13px] text-fg-muted no-underline transition-colors hover:text-gold-soft"
            >
              {l}
            </a>
          ))}
        </div>

        <div className="text-xs text-fg-muted">Made with 🫙 in India</div>
      </div>

      <div className="container-prose mt-5 border-t border-white/[0.04] pt-4 text-center text-[11.5px] tracking-wide text-fg-faint">
        Built by an indie founder in India <span className="ml-0.5">🇮🇳</span>
      </div>
    </footer>
  );
}
