import { createWaitlistHandler } from '../../../lib/waitlist';
import { sendWelcome, welcomeConfig } from '../../../lib/welcome';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const POST = createWaitlistHandler({ config: () => ({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_SECRET_KEY,
  hashSecret: process.env.WAITLIST_HASH_SECRET,
}), sendWelcome: email => sendWelcome(email, welcomeConfig()) });
