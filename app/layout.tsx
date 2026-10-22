import type { Metadata, Viewport } from 'next';
import { outfit, unbounded, jetbrainsMono } from './fonts';
import { SmoothScroll } from '@/components/SmoothScroll';
// Lenis utility classes (.lenis-smooth, .lenis-stopped, etc.) — applied
// to <html> by Lenis at runtime. Import before globals.css so Tailwind
// + our own rules can override anything specific.
import 'lenis/dist/lenis.css';
import './globals.css';

export const viewport: Viewport = { themeColor: '#050505' };

export const metadata: Metadata = {
  metadataBase: new URL('https://www.getblyth.com'),
  title: 'Blyth — Watch your savings fill up',
  description:
    'The calm finance app for India. Set a goal, watch your jar fill, and finally feel in control of your money. Local-first tracking. No bank login.',
  openGraph: {
    siteName: 'Blyth',
    title: 'Blyth — Watch your savings fill up',
    description: 'The calm finance app for India. Local-first tracking. No bank login.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${outfit.variable} ${unbounded.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg-base font-body text-fg antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
