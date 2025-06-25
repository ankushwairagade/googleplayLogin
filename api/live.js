module.exports = (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  // Health-check endpoint
  return res.status(200).json({ status: 'live' });
};