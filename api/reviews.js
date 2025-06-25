import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const auth = req.headers.authorization;
  const pkg = req.query.pkg;
  if (!auth || !pkg) return res.status(400).json({ error: 'Missing Authorization or pkg' });
  try {
    const token = auth.split(' ')[1];
    const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(pkg)}/reviews`;
    const apiRes = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await apiRes.json();
    return res.status(apiRes.ok ? 200 : apiRes.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}