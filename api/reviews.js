const fetch = require('node-fetch');
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  const auth = req.headers.authorization;
  const pkg = req.query.pkg;
  if (!auth) return res.status(400).json({ error: 'Missing Authorization header' });
  if (!pkg) return res.status(400).json({ error: 'Missing pkg parameter' });
  try {
    const token = auth.split(' ')[1];
    const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(pkg)}/reviews`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await r.json();
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
};