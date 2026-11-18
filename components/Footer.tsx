/**
 * Footer — final strip with logo, link row, indie founder line.
 * Server component — no interactivity.
 */

import { LogoMark } from './LogoMark';

const GROUPS = [
  { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'How it works', href: '#how' }, { label: 'FAQ', href: '#faq' }] },
  { title: 'Company', links: [{ label: 'Contact', href: '/contact' }, { label: 'Privacy', href: '/privacy' }, { label: 'Early access', href: '/terms' }] },
];

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
              Blyth
            </div>
            <div className="mt-0.5 text-[11.5px] text-fg-muted">
              Money, without the maths.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-8">
          {GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="mb-3 text-xs font-semibold text-fg-strong">{group.title}</p>
              <div className="flex flex-wrap gap-4">
                {group.links.map((link) => (
                  <a key={link.label} href={link.href} className="text-[13px] text-fg-muted no-underline transition-colors hover:text-gold-soft">{link.label}</a>
                ))}
              </div>
            </nav>
          ))}
        </div>

        <a href="#cta" className="text-[13px] font-semibold text-gold-soft">Get early access →</a>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-fg-muted">
          <span>Made with 🫙 by <a href="https://x.com/gupta_1203" target="_blank" rel="noopener noreferrer" className="hover:text-gold-soft">Kshitij Gupta</a></span>
          <span>Follow the build:</span>
          <a href="https://x.com/gupta_1203" target="_blank" rel="noopener noreferrer" className="hover:text-gold-soft">X (@gupta_1203)</a>
          <a href="https://www.instagram.com/k._dumps_/" target="_blank" rel="noopener noreferrer" className="hover:text-gold-soft">Instagram (@k._dumps_)</a>
        </div>
      </div>

      <div className="container-prose mt-5 border-t border-white/[0.04] pt-4 text-center text-[11.5px] tracking-wide text-fg-faint">
        © 2026 Blyth
      </div>
    </footer>
  );
}
