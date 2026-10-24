const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PGlite } = require('@electric-sql/pglite');
const load = require('./load-ts.cjs');
const { sendWelcome } = load('lib/welcome.ts');
const { welcomeEmail } = load('lib/welcome-email.ts');
const { createWaitlistHandler } = load('lib/waitlist.ts');
const config = { url: 'https://example.supabase.co', key: 'sb_secret_TEST', resendKey: 're_TEST', from: 'Blyth <hello@mail.getblyth.com>', support: 'support@example.com' };
const email = 'tester@example.com';
const payload = { from: config.from, to: [email], reply_to: config.support, ...welcomeEmail(config.support) };
const job = { id: 'test-job', token: 'lease', payload };

test('Accepted welcome records the provider ID, uses private key and stable idempotency', async () => {
  const seen = [];
  const result = await sendWelcome(email, config, async (url, options) => {
    seen.push(url);
    const body = JSON.parse(options.body);
    if (url.endsWith('/claim_blyth_welcome')) return Response.json(job);
    if (url.includes('api.resend.com')) {
      assert.equal(options.headers.Authorization, 'Bearer re_TEST');
      assert.equal(options.headers['Idempotency-Key'], 'blyth-welcome-v1/test-job');
      assert.deepEqual(body, payload); return Response.json({ id: 'provider-id' });
    }
    assert.equal(body.p_provider_id, 'provider-id'); assert.equal(body.p_error, null);
    return Response.json(true);
  });
  assert.equal(result, 'accepted'); assert.equal(seen.length, 3);
});
test('Transient failure retries with the exact persisted payload, never a changed template', async () => {
  const bodies = []; const saved = { ...payload, subject: 'Original subject' };
  assert.equal(await sendWelcome(email, config, async (url, options) => {
    if (url.endsWith('/claim_blyth_welcome')) return Response.json({ ...job, payload: saved });
    if (url.includes('api.resend.com')) {
      bodies.push(options.body);
      if (bodies.length === 1) throw new Error('timeout after provider accepted');
      return Response.json({ id: 'same-provider-id' });
    }
    return Response.json(true);
  }), 'accepted');
  assert.equal(bodies.length, 2); assert.equal(bodies[0], bodies[1]); assert.equal(JSON.parse(bodies[0]).subject, 'Original subject');
});
test('Already sent or leased jobs and missing settings never contact the provider', async () => {
  let calls = 0;
  assert.equal(await sendWelcome(email, {}, async () => { calls++; }), 'queued');
  assert.equal(await sendWelcome(email, config, async url => { calls++; assert.match(url, /claim_blyth_welcome$/); return Response.json(null); }), 'skipped');
  assert.equal(calls, 1);
});
test('Provider rejection remains queued with sanitized error and no duplicate immediate 4xx retry', async () => {
  let sent = 0;
  assert.equal(await sendWelcome(email, config, async (url, options) => {
    if (url.endsWith('/claim_blyth_welcome')) return Response.json(job);
    if (url.includes('api.resend.com')) { sent++; return new Response('PRIVATE', { status: 403 }); }
    assert.equal(JSON.parse(options.body).p_error, 'provider_http_403'); return Response.json(true);
  }), 'queued');
  assert.equal(sent, 1);
});
test('A lost DB acknowledgement after sending cannot claim completion', async () => {
  assert.equal(await sendWelcome(email, config, async url => {
    if (url.endsWith('/claim_blyth_welcome')) return Response.json(job);
    if (url.includes('api.resend.com')) return Response.json({ id: 'id' });
    throw new Error('DB unavailable');
  }), 'queued');
});
test('Only updated consent triggers welcome; delivery failure still returns saved signup success', async () => {
  let sends = 0; const rpcs = [];
  const handler = createWaitlistHandler({ config: () => ({ ...config, hashSecret: 'x'.repeat(64) }),
    fetchImpl: async url => { rpcs.push(url); return Response.json('accepted'); },
    sendWelcome: async () => { sends++; throw new Error('PRIVATE provider failure'); },
  });
  for (const consentVersion of [undefined, 'welcome-and-early-access-2026-10-23']) {
    const response = await handler(new Request('https://www.getblyth.com/api/waitlist', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, consent: true, consentVersion }) }));
    assert.equal(response.status, 200); assert.deepEqual(await response.json(), { ok: true });
  }
  assert.equal(sends, 1); assert.match(rpcs[0], /join_blyth_waitlist$/); assert.match(rpcs[1], /join_blyth_waitlist_v2$/);
});
test('Template uses the shared logo, plain text alternative and no OTP or tracking identifiers', () => {
  assert.match(payload.html, /blyth-lockup-dark-v1.png/);
  assert.match(payload.html, /doesn't create an app account/);
  assert.match(payload.text, /early-access list/);
  assert.doesNotMatch(payload.html, /\.Token|one-time code|utm_|tester@example/);
  assert.doesNotMatch(welcomeEmail('x"><script>').html, /<script>/);
});
test('Recovery endpoint rejects missing, wrong and partial credentials', async () => {
  const { GET } = load('app/api/internal/welcome/route.ts');
  const previous = process.env.CRON_SECRET;
  try {
    delete process.env.CRON_SECRET;
    assert.equal((await GET(new Request('https://www.getblyth.com/api/internal/welcome'))).status, 401);
    process.env.CRON_SECRET = 'test-only-long-secret';
    for (const authorization of ['', 'Bearer wrong', 'Bearer test-only-long-secre']) {
      assert.equal((await GET(new Request('https://www.getblyth.com/api/internal/welcome', { headers: { authorization } }))).status, 401);
    }
  } finally {
    if (previous === undefined) delete process.env.CRON_SECRET; else process.env.CRON_SECRET = previous;
  }
});

test('Postgres queue: consent, duplicates, leases, durable retries, expiry, permissions and deletion', async () => {
  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role;');
    await db.exec(fs.readFileSync('supabase/waitlist.sql', 'utf8'));
    await db.exec(fs.readFileSync('supabase/002_welcome_email.sql', 'utf8'));
    // Migration is safe to reapply and does not email existing subscribers.
    await db.query('select join_blyth_waitlist($1,$2)', ['old@example.com', 'a'.repeat(64)]);
    await db.exec(fs.readFileSync('supabase/002_welcome_email.sql', 'utf8'));
    const rpc = async (name, args) => (await db.query(`select ${name}(${args.map((_, i) => '$' + (i + 1)).join(',')}) as value`, args)).rows[0].value;
    assert.equal((await db.query('select count(*)::int n from waitlist_welcome_outbox')).rows[0].n, 0);
    for (let i = 0; i < 2; i++) assert.equal(await rpc('join_blyth_waitlist_v2', [email, 'b'.repeat(64)]), 'accepted');
    assert.equal((await db.query('select count(*)::int n from waitlist_welcome_outbox')).rows[0].n, 1);
    const claimed = await rpc('claim_blyth_welcome', [email, JSON.stringify(payload)]);
    assert.ok(claimed.token); assert.equal(await rpc('claim_blyth_welcome', [email, '{}']), null);
    assert.equal(await rpc('finish_blyth_welcome', [claimed.id, '00000000-0000-0000-0000-000000000000', 'wrong', null]), false);
    assert.equal(await rpc('finish_blyth_welcome', [claimed.id, claimed.token, null, 'provider_connection']), true);
    const retry = await rpc('claim_blyth_welcome', [email, '{"changed":true}']);
    assert.deepEqual(retry.payload, payload); assert.notEqual(retry.token, claimed.token);
    assert.equal(await rpc('finish_blyth_welcome', [retry.id, retry.token, 'resend-id', null]), true);
    assert.equal(await rpc('claim_blyth_welcome', [email, '{}']), null);
    await db.query("update waitlist_welcome_outbox set accepted_at=null, first_attempt_at=now()-interval '25 hours'");
    assert.equal(await rpc('claim_blyth_welcome', [email, '{}']), null);
    assert.equal((await db.query('select last_error from waitlist_welcome_outbox')).rows[0].last_error, 'needs_reconciliation');
    assert.equal((await db.query('select * from pending_blyth_welcomes()')).rows.length, 0);
    for (const role of ['anon', 'authenticated']) {
      assert.equal((await db.query("select has_function_privilege($1,'public.join_blyth_waitlist_v2(text,text)','execute') ok", [role])).rows[0].ok, false);
      assert.equal((await db.query("select has_table_privilege($1,'public.waitlist_welcome_outbox','select') ok", [role])).rows[0].ok, false);
    }
    await db.query('delete from waitlist_signups where email=$1', [email]);
    assert.equal((await db.query('select count(*)::int n from waitlist_welcome_outbox')).rows[0].n, 0);
  } finally { await db.close(); }
});
