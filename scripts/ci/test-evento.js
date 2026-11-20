// Test del handler api/evento.js con fetch simulado. Uso: node scripts/ci/test-evento.js
const assert = require('assert');
const handler = require('../../api/evento.js');

function mkRes() {
  return { code: null, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, end() { return this; } };
}
async function run(req, env) {
  const prev = {};
  for (const k of ['KV_REST_API_URL', 'KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']) { prev[k] = process.env[k]; delete process.env[k]; }
  Object.assign(process.env, env || {});
  const calls = [];
  global.fetch = async (url, opts) => { calls.push({ url, opts }); return { ok: true }; };
  const res = mkRes();
  await handler(req, res);
  for (const k in prev) { if (prev[k] === undefined) delete process.env[k]; else process.env[k] = prev[k]; }
  return { res, calls };
}
const ENV = { KV_REST_API_URL: 'https://x.example', KV_REST_API_TOKEN: 'test' };
const post = (body) => ({ method: 'POST', body });

(async () => {
  let r = await run(post({ evento: 'click_reserva', pagina: '/index' }), ENV);
  assert.strictEqual(r.res.code, 204);
  assert.strictEqual(r.calls.length, 1);
  assert.strictEqual(r.calls[0].url, 'https://x.example/pipeline');
  assert.strictEqual(r.calls[0].opts.headers.Authorization, 'Bearer test');
  const cmds = JSON.parse(r.calls[0].opts.body);
  const hoy = new Date().toISOString().slice(0, 10);
  assert.deepStrictEqual(cmds, [['HINCRBY', 'ev:' + hoy, 'click_reserva|/index', 1], ['EXPIRE', 'ev:' + hoy, 65750400]]);

  // body como string (sendBeacon)
  r = await run(post(JSON.stringify({ evento: 'gracias', pagina: '/gracias' })), { UPSTASH_REDIS_REST_URL: 'https://y.example/', UPSTASH_REDIS_REST_TOKEN: 't' });
  assert.strictEqual(r.calls.length, 1);
  assert.strictEqual(r.calls[0].url, 'https://y.example/pipeline');

  // no guarda
  for (const b of [
    { evento: 'otro', pagina: '/a' },
    { evento: 'click_reserva', pagina: '/' + 'a'.repeat(100) },
    { evento: 'click_reserva', pagina: '/a?x=1' },
    { evento: 'click_reserva', pagina: 'a' },
    { evento: 'click_reserva' },
    'no es json', null
  ]) {
    r = await run(post(b), ENV);
    assert.strictEqual(r.res.code, 204);
    assert.strictEqual(r.calls.length, 0, JSON.stringify(b));
  }

  // sin variables
  r = await run(post({ evento: 'click_reserva', pagina: '/a' }), {});
  assert.strictEqual(r.res.code, 204);
  assert.strictEqual(r.calls.length, 0);

  // método
  r = await run({ method: 'GET' }, ENV);
  assert.strictEqual(r.res.code, 405);

  // fallo de fetch -> 204
  global.fetch = async () => { throw new Error('boom'); };
  const res = mkRes();
  process.env.KV_REST_API_URL = 'https://x.example'; process.env.KV_REST_API_TOKEN = 't';
  const origErr = console.error; console.error = () => {};
  await handler(post({ evento: 'gracias', pagina: '/g' }), res);
  console.error = origErr;
  assert.strictEqual(res.code, 204);
  console.log('test-evento: OK');
})().catch((e) => { console.error(e); process.exit(1); });
