// server.js
import express from 'express';
import path from 'path';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Exchange auth code for tokens (credentials from request body)
app.post('/api/exchange', async (req, res) => {
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
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Refresh access token (credentials & refresh_token from body)
app.post('/api/refresh', async (req, res) => {
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
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Proxy Play Store reviews endpoint
app.get('/api/reviews', async (req, res) => {
  const auth = req.headers.authorization;
  const pkg = req.query.pkg;
  if (!auth) return res.status(400).json({ error: 'Missing Authorization header' });
  if (!pkg) return res.status(400).json({ error: 'Missing pkg parameter' });
  try {
    const accessToken = auth.split(' ')[1];
    const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(pkg)}/reviews`;
    const apiRes = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    const data = await apiRes.json();
    if (!apiRes.ok) return res.status(apiRes.status).json(data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));