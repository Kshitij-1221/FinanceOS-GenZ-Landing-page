/**
 * Overline — small gold caps eyebrow above every section heading.
 * Server component; same look as `.overline` in globals.css but typed.
 */

import type { CSSProperties, ReactNode } from 'react';

export interface OverlineProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Overline({ children, className = '', style }: OverlineProps) {
  return (
    <span className={`overline ${className}`} style={style}>
      {children}
    </span>
  );
}
