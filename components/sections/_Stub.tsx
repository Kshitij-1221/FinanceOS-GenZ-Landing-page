/**
 * _Stub — shared placeholder for sections that haven't been built yet.
 * Each stub renders the section's eyebrow + title + a "coming next"
 * note so the live page reads as a build-in-progress instead of a
 * silent blank space. Replace each section with its real component
 * one PR at a time.
 */

import { Overline } from '../Overline';

export interface StubSectionProps {
  id?: string;
  overline: string;
  title: string;
  description?: string;
}

export function StubSection({ id, overline, title, description }: StubSectionProps) {
  return (
    <section id={id} className="relative py-20">
      <div className="container-prose">
        <Overline>{overline}</Overline>
        <h2
          className="font-display mt-4 text-4xl font-extrabold leading-none text-fg-strong md:text-5xl"
          style={{ letterSpacing: '-0.04em', textWrap: 'balance' }}
        >
          {title}
        </h2>
        <p className="mt-4 max-w-prose text-sm text-fg-muted">
          {description ?? 'Coming next — this section will be built faithfully from the design source.'}
        </p>
      </div>
    </section>
  );
}
