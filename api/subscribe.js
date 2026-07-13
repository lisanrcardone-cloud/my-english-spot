const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LEN = 100;

// Rate limit best-effort en memoria: no persiste entre instancias/cold starts
// de Vercel, pero corta los intentos automatizados más obvios (ráfagas desde
// la misma instancia caliente). Para un límite real por IP hace falta un
// store compartido (p.ej. Upstash Redis) — pendiente de decisión, ver informe.
const hits = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip) || { count: 0, start: now };
  if (now - entry.start > WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  hits.set(ip, entry);
  return entry.count > MAX_PER_WINDOW;
}

function clean(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD_LEN);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'too many requests' });
  }

  const email = clean((req.body || {}).email);
  const nombre = clean((req.body || {}).nombre);
  const nivel = clean((req.body || {}).nivel);
  const objetivo = clean((req.body || {}).objetivo);
  const source = clean((req.body || {}).source) || 'post_booking';

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'valid email required' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_KEY || ''
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: nombre, NIVEL: nivel, OBJETIVO: objetivo, SOURCE: source },
        listIds: [3],
        updateEnabled: true
      })
    });

    const status = response.status;
    // 201 created, 204 updated — both are success
    if (status === 201 || status === 204) {
      return res.status(200).json({ ok: true });
    }
    const body = await response.text();
    console.error('Brevo API error', status, body);
    return res.status(502).json({ error: 'subscription service error' });
  } catch (err) {
    console.error('Brevo request failed', err);
    return res.status(502).json({ error: 'subscription service error' });
  }
}
