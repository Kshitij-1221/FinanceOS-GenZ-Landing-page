'use client';

/**
 * Reveal — IntersectionObserver-based fade+slide-up on scroll into view.
 * Replaces the inline `<Reveal>` from the prototype (sections-top.jsx).
 *
 * Default behaviour: 24px upward slide + opacity fade, fires once at
 * 12% visibility. `delay` lets the parent stagger children.
 *
 * Respects prefers-reduced-motion by snapping to the visible state
 * immediately and skipping the transition.
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';

export interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms. */
  delay?: number;
  /** Y-offset before reveal in px. */
  y?: number;
  /** Element to render as — defaults to <div>. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  as: Tag = 'div',
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setVis(true);
      return;
    }

    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        ...style,
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 800ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}
