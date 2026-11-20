// Contador propio de clics, sin cookies ni datos personales.
// Guarda solo HINCRBY ev:AAAA-MM-DD "<evento>|<pagina>" 1 en Upstash (REST).
// No guarda IP, user agent ni identificadores. TTL 25 meses (límite AEPD).
const EVENTOS = new Set(['click_reserva', 'va_al_calendario', 'gracias']);
const MAX_PAGINA = 100;
const TTL_SEGUNDOS = 65750400; // 761 días ≈ 25 meses
const TIMEOUT_MS = 3000;

function parseBody(body) {
  if (!body) return null;
  if (typeof body === 'string') {
    try { return JSON.parse(body); } catch (e) { return null; }
  }
  if (Buffer.isBuffer(body)) {
    try { return JSON.parse(body.toString('utf8')); } catch (e) { return null; }
  }
  return typeof body === 'object' ? body : null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const data = parseBody(req.body);
  const evento = data && data.evento;
  const pagina = data && data.pagina;
  if (
    typeof evento !== 'string' || !EVENTOS.has(evento) ||
    typeof pagina !== 'string' || pagina[0] !== '/' ||
    pagina.length > MAX_PAGINA || pagina.includes('?')
  ) {
    return res.status(204).end();
  }

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(204).end();

  const clave = 'ev:' + new Date().toISOString().slice(0, 10);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    await fetch(url.replace(/\/+$/, '') + '/pipeline', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'content-type': 'application/json' },
      body: JSON.stringify([
        ['HINCRBY', clave, evento + '|' + pagina, 1],
        ['EXPIRE', clave, TTL_SEGUNDOS]
      ]),
      signal: controller.signal
    });
  } catch (err) {
    console.error('evento: fallo al contar', err && err.name);
  } finally {
    clearTimeout(timer);
  }
  return res.status(204).end();
};
