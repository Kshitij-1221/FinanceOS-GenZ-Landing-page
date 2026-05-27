'use client';

/**
 * Nav — floating glass pill at the top of the page.
 * Gains a gold border + stronger glow once the user has scrolled.
 * Mobile: burger toggles a drawer that drops below the pill.
 */

import { useEffect, useState } from 'react';
import { LogoMark } from './LogoMark';

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how',      label: 'How it works' },
  { href: '#privacy',  label: 'Privacy' },
  { href: '#faq',      label: 'FAQ' },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav-pill ${scrolled ? 'nav-pill--scrolled' : ''}`}>
      <div className="flex items-center justify-between gap-4 px-3 py-2.5 pl-5">
        <a href="#top" className="inline-flex items-center gap-2.5 no-underline">
          <LogoMark size={30} />
          <span
            className="font-display text-[15.5px] font-extrabold text-fg-strong"
            style={{ letterSpacing: '-0.02em' }}
          >
            FinanceOS
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="py-1.5 text-[13px] font-medium text-fg transition-colors hover:text-gold-soft"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#cta"
            className="btn-gold press inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[12.5px] font-bold no-underline"
          >
            Get the app
            <span className="text-[13px]">→</span>
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="press inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-fg-strong md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="text-lg leading-none">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="flex flex-col gap-0.5 border-t border-white/[0.06] px-3.5 pb-3.5 pt-1 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-white/[0.04] py-3 px-1.5 text-[14.5px] font-medium text-fg no-underline last:border-b-0"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
