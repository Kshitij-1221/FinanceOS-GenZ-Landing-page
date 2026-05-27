import type { Config } from 'tailwindcss';

/**
 * Design tokens — pulled 1:1 from FinanceOS_Landing_v2.html.
 * Keep these in lockstep with the values used in app/globals.css under :root.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-base':   '#050505',
        'bg-elev':   '#0a0a0a',
        'fg-strong': '#ffffff',
        'fg':        '#e4e4e7',
        'fg-muted':  '#71717a',
        'fg-faint':  '#52525b',
        'gold':      '#d4af37',
        'gold-soft': '#fcd34d',
        'gold-deep': '#92691c',
        'success':   '#10b981',
        'danger':    '#f43f5e',
        'warning':   '#f59e0b',
      },
      fontFamily: {
        display: ['var(--font-unbounded)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-outfit)',    'system-ui', 'sans-serif'],
        mono:    ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
