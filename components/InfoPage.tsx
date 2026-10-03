import Link from 'next/link';

export function SupportContact() {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? <a className="text-gold-soft underline" href={`mailto:${email}`}>{email}</a>
    : <span>Support contact is being configured. Please check back before joining.</span>;
}

export function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return <main className="container-prose py-16" style={{ maxWidth: 780 }}>
    <Link className="text-gold-soft" href="/">← Back to Blyth</Link>
    <h1 className="font-display mt-10 text-3xl font-bold text-fg-strong">{title}</h1>
    <div className="mt-8 space-y-5 text-base leading-7 text-fg-muted">{children}</div>
  </main>;
}
