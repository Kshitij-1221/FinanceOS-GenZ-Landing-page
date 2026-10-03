import { createWaitlistHandler } from '../../../lib/waitlist';

export const runtime = 'nodejs';
export const POST = createWaitlistHandler({ config: () => ({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_SECRET_KEY,
  hashSecret: process.env.WAITLIST_HASH_SECRET,
}) });
