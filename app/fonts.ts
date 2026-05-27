/**
 * Google fonts loaded via next/font so they're self-hosted, preconnected,
 * and FOUT-free. CSS variables are exposed for Tailwind's font family
 * config (see tailwind.config.ts → theme.fontFamily).
 *
 * Weights chosen to match the design source — display headlines use 800/900,
 * body uses 400-700, mono numbers use 400-700.
 */

import { Outfit, Unbounded, JetBrains_Mono } from 'next/font/google';

export const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-unbounded',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});
