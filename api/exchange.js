import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { code, client_id, client_secret } = req.body;
  if (!code || !client_id || !client_secret) {
    return res.status(400).json({ error: 'Missing code, client_id or client_secret' });
  }
  try {
    const params = new URLSearchParams({
      client_id,
      client_secret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
    });
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    const data = await response.json();
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}