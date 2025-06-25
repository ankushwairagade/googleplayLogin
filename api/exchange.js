const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { code, client_id, client_secret } = req.body;
  if (!code || !client_id || !client_secret) {
    return res.status(400).json({ error: 'Missing code, client_id, or client_secret' });
  }
  try {
    const params = new URLSearchParams({
      client_id,
      client_secret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'postmessage' // Use 'postmessage' for web apps
    });
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    const data = await tokenRes.json();
    return res.status(tokenRes.ok ? 200 : tokenRes.status).json(data);
  } catch (err) {
    console.error('exchange error', err);
    return res.status(500).json({ error: 'server_error' });
  }
};