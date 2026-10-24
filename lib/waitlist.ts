import { createHmac } from 'node:crypto';

interface Config { url?: string; key?: string; hashSecret?: string }
const reply = (status: number, body: object) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export function createWaitlistHandler({ config, fetchImpl = fetch, sendWelcome }: { config: () => Config; fetchImpl?: typeof fetch; sendWelcome?: (email: string) => Promise<unknown> }) {
  return async (request: Request) => {
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return reply(403, { error: 'Please join from the Blyth website.' });
    if (!(request.headers.get('content-type') || '').startsWith('application/json')) return reply(415, { error: 'Please use the email form.' });
    let input;
    try {
      const reader = request.body?.getReader();
      if (!reader) return reply(400, { error: 'Enter an email address.' });
      const chunks: Uint8Array[] = []; let bytes = 0;
      while (true) {
        const chunk = await reader.read(); if (chunk.done) break;
        bytes += chunk.value.byteLength;
        if (bytes > 4096) { await reader.cancel(); return reply(413, { error: 'Please send only your email address.' }); }
        chunks.push(chunk.value);
      }
      input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch { return reply(400, { error: 'Please check your email address and try again.' }); }
    if (!input || typeof input !== 'object') return reply(400, { error: 'Please check your email address.' });
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || input.consent !== true) return reply(400, { error: 'Enter a valid email and agree to the early-access email.' });
    if (input.website) return reply(400, { error: 'Unable to submit this form. Please try again.' });
    const { url, key, hashSecret } = config();
    if (!url || !/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url) || !key || !hashSecret || hashSecret.length < 32) {
      return reply(503, { error: 'The waitlist is not connected yet. Your email was not saved. Please try again later.' });
    }
    // Vercel supplies the client IP. Only a keyed, daily hash reaches the DB.
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
    const hash = createHmac('sha256', hashSecret).update(`${new Date().toISOString().slice(0, 10)}:${ip}`).digest('hex');
    try {
      // Cached old forms retain their original consent and never trigger a welcome.
      const welcome = input.consentVersion === 'welcome-and-early-access-2026-10-23';
      const rpc = welcome ? 'join_blyth_waitlist_v2' : 'join_blyth_waitlist';
      const response = await fetchImpl(`${url.replace(/\/$/, '')}/rest/v1/rpc/${rpc}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', apikey: key,
          ...(key.startsWith('sb_secret_') ? {} : { Authorization: `Bearer ${key}` }) },
        body: JSON.stringify({ p_email: email, p_client_hash: hash }), signal: AbortSignal.timeout(10000), cache: 'no-store',
      });
      if (!response.ok) return reply(503, { error: 'We could not save your email. Please try again shortly.' });
      const result = await response.json();
      if (result === 'limited') return reply(429, { error: 'Too many attempts. Please try again in an hour.' });
      if (result !== 'accepted') return reply(503, { error: 'We could not confirm your signup. Please try again.' });
      // A provider outage must not turn a successfully stored signup into an error.
      // The private outbox keeps pending mail; public responses never reveal membership.
      if (welcome && sendWelcome) { try { await sendWelcome(email); } catch { /* Saved; retry from the outbox. */ } }
      return reply(200, { ok: true });
    } catch { return reply(503, { error: 'We could not confirm your signup. Please try again shortly.' }); }
  };
}
