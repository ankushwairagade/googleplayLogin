const fetch = require('node-fetch');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { refresh_token, client_id, client_secret } = req.body;
  if (!refresh_token || !client_id || !client_secret) {
    return res.status(400).json({ error: 'Missing refresh_token, client_id, or client_secret' });
  }
  try {
    const params = new URLSearchParams({
      client_id,
      client_secret,
      refresh_token,
      grant_type: 'refresh_token'
    });
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    const data = await r.json();
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
};