import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { refresh_token, client_id, client_secret } = req.body;
  if (!refresh_token || !client_id || !client_secret) {
    return res.status(400).json({ error: 'Missing refresh_token, client_id or client_secret' });
  }
  try {
    const params = new URLSearchParams({
      client_id,
      client_secret,
      refresh_token,
      grant_type: 'refresh_token'
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