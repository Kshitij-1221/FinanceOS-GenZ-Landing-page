import { timingSafeEqual } from 'node:crypto';
import { sendWelcome, welcomeConfig, welcomeRpc } from '../../../../lib/welcome';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const supplied = Buffer.from(request.headers.get('authorization') || '');
  const expected = Buffer.from(`Bearer ${secret}`);
  if (!secret || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return new Response('Unauthorized', { status: 401 });
  const config = welcomeConfig();
  if (!config.resendKey || !config.from || !config.support) return Response.json({ error: 'Email configuration missing' }, { status: 503 });
  try {
    const pending = await welcomeRpc(config, 'pending_blyth_welcomes', {});
    const results: Record<string, number> = { accepted: 0, queued: 0, skipped: 0 };
    const started = Date.now();
    for (const { email } of pending) {
      if (Date.now() - started > 25000) break;
      results[await sendWelcome(email, config)]++;
    }
    return Response.json(results, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Welcome queue unavailable' }, { status: 503 }); }
}
