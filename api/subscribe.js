module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, nombre, nivel, objetivo } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'email required' });
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
        attributes: { FIRSTNAME: nombre, NIVEL: nivel, OBJETIVO: objetivo },
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
    return res.status(502).json({ error: body });
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
