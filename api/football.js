export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { p } = req.query;
  if (!p) return res.status(400).json({ error: 'Missing path parameter' });

  const key = process.env.VITE_FOOTBALLDATA_KEY;
  if (!key) return res.status(500).json({ error: 'API key not configured on server' });

  try {
    const url = `https://api.football-data.org/v4/${p}`;
    const r = await fetch(url, {
      headers: { 'X-Auth-Token': key }
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
