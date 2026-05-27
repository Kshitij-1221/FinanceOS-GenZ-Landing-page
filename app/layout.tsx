import type { Metadata } from 'next';
import { outfit, unbounded, jetbrainsMono } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinanceOS — Watch your savings fill up',
  description:
    'The calm finance app for India. Set a goal, watch your jar fill, and finally feel in control of your money. 100% on-device. No bank login.',
  themeColor: '#050505',
  openGraph: {
    title: 'FinanceOS — Watch your savings fill up',
    description: 'The calm finance app for India. 100% on-device. No bank login.',
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
        {children}
      </body>
    </html>
  );
}
