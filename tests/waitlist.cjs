const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const mod = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/waitlist.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
  exports: mod.exports, module: mod, require, Response, Request, URL, Buffer, AbortSignal, fetch,
});
const { createWaitlistHandler } = mod.exports;
const config = () => ({ url: 'https://example.supabase.co', key: 'sb_secret_TEST_ONLY', hashSecret: 'x'.repeat(64) });
const request = (data = { email: ' QA@EXAMPLE.COM ', consent: true }, headers = {}) => new Request('https://blyth.example/api/waitlist', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://blyth.example', 'x-forwarded-for': '192.0.2.1', ...headers }, body: typeof data === 'string' ? data : JSON.stringify(data),
});

test('Valid consented email is normalized; only server sends the secret and hashed client ID', async () => {
  let called = 0;
  const handler = createWaitlistHandler({ config, fetchImpl: async (url, options) => {
    called++; assert.equal(url, 'https://example.supabase.co/rest/v1/rpc/join_blyth_waitlist');
    assert.equal(options.headers.apikey, 'sb_secret_TEST_ONLY'); const body = JSON.parse(options.body);
    assert.equal(body.p_email, 'qa@example.com'); assert.match(body.p_client_hash, /^[a-f0-9]{64}$/);
    assert.equal(options.body.includes('192.0.2.1'), false); return Response.json('accepted');
  } });
  const response = await handler(request()); assert.equal(response.status, 200); assert.deepEqual(await response.json(), { ok: true }); assert.equal(called, 1);
});
test('Invalid emails and absent consent never call the database', async () => {
  let called = 0; const handler = createWaitlistHandler({ config, fetchImpl: async () => { called++; } });
  for (const data of [null, {}, { email: 'a@b.c' }, { email: 'bad', consent: true }, { email: 'a b@c.d', consent: true }, { email: 'a'.repeat(255)+'@b.c', consent: true }, { email: 'a@b.c', consent: false }]) assert.equal((await handler(request(data))).status, 400);
  assert.equal(called, 0);
});
test('Missing database configuration fails honestly without a fake success', async () => {
  const handler = createWaitlistHandler({ config: () => ({}) }); const response = await handler(request());
  assert.equal(response.status, 503); assert.match((await response.json()).error, /not saved/);
});
test('Malformed, oversized and foreign-origin requests are rejected', async () => {
  let called = 0; const handler = createWaitlistHandler({ config, fetchImpl: async () => { called++; } });
  assert.equal((await handler(request('{bad'))).status, 400);
  assert.equal((await handler(request('x'.repeat(4097)))).status, 413);
  assert.equal((await handler(request(undefined, { Origin: 'https://evil.example' }))).status, 403);
  assert.equal((await handler(request(undefined, { 'Content-Type': 'text/plain' }))).status, 415); assert.equal(called, 0);
});
test('Honeypot submissions cannot create a signup', async () => {
  const handler = createWaitlistHandler({ config, fetchImpl: async () => { throw new Error('must not call'); } });
  assert.equal((await handler(request({ email: 'qa@example.com', consent: true, website: 'spam' }))).status, 400);
});
test('The persistent database rate limit becomes a retryable HTTP 429', async () => {
  const handler = createWaitlistHandler({ config, fetchImpl: async () => Response.json('limited') }); assert.equal((await handler(request())).status, 429);
});
test('Both new and duplicate acceptance return the same response without exposing emails', async () => {
  const handler = createWaitlistHandler({ config, fetchImpl: async () => Response.json('accepted') });
  assert.deepEqual(await (await handler(request())).json(), await (await handler(request())).json());
});
test('Database errors and network failures never leak provider details or signal success', async () => {
  for (const fetchImpl of [async () => new Response('PRIVATE SQL', { status: 500 }), async () => { throw new Error('PRIVATE KEY'); }, async () => new Response('bad json'), async () => Response.json('unexpected')]) {
    const response = await createWaitlistHandler({ config, fetchImpl })(request()); assert.equal(response.status, 503); assert.equal((await response.text()).includes('PRIVATE'), false);
  }
});
