import { welcomeEmail } from './welcome-email';

export interface WelcomeConfig { url?: string; key?: string; resendKey?: string; from?: string; support?: string }
export async function welcomeRpc(config: WelcomeConfig, name: string, body: object, fetchImpl = fetch) {
  const response = await fetchImpl(`${config.url?.replace(/\/$/, '')}/rest/v1/rpc/${name}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', apikey: config.key!,
      ...(config.key!.startsWith('sb_secret_') ? {} : { Authorization: `Bearer ${config.key}` }) },
    body: JSON.stringify(body), signal: AbortSignal.timeout(5000), cache: 'no-store',
  });
  if (!response.ok) throw new Error('welcome_database_unavailable');
  return response.json();
}

// No recipient addresses, provider bodies, or credentials in logs/public responses.
export async function sendWelcome(email: string, config: WelcomeConfig, fetchImpl = fetch): Promise<'accepted' | 'queued' | 'skipped'> {
  if (!config.resendKey || !config.from || !config.support || !config.url || !config.key) return 'queued';
  try {
    const payload = { from: config.from, to: [email], reply_to: config.support, ...welcomeEmail(config.support) };
    const job = await welcomeRpc(config, 'claim_blyth_welcome', { p_email: email, p_payload: payload }, fetchImpl);
    if (!job) return 'skipped';
    if (!job.id || !job.token || !job.payload) return 'queued';
    let providerId: string | null = null;
    let error = 'provider_unavailable';
    // One immediate retry covers transient connections using Resend deduplication.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetchImpl('https://api.resend.com/emails', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.resendKey}`,
            'Idempotency-Key': `blyth-welcome-v1/${job.id}` },
          body: JSON.stringify(job.payload), signal: AbortSignal.timeout(5000), cache: 'no-store',
        });
        if (response.ok) {
          const result = await response.json();
          if (typeof result.id === 'string' && result.id.length > 0) { providerId = result.id; break; }
        }
        error = `provider_http_${response.status}`;
        if (response.status >= 400 && response.status < 500) break;
      } catch { error = 'provider_connection'; }
    }
    const recorded = await welcomeRpc(config, 'finish_blyth_welcome', {
      p_id: job.id, p_token: job.token, p_provider_id: providerId, p_error: providerId ? null : error,
    }, fetchImpl);
    return providerId && recorded === true ? 'accepted' : 'queued';
  } catch { return 'queued'; }
}

export function welcomeConfig(): WelcomeConfig {
  return { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SECRET_KEY,
    resendKey: process.env.RESEND_API_KEY, from: process.env.WAITLIST_FROM_EMAIL,
    support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL };
}
