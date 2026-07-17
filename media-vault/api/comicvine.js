export default async function handler(req, res) {
  // Allow the Vite dev server (different port) to call this route
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const { query = "spider-man" } = req.query;
  const KEY = process.env.COMICVINE_KEY;

  if (!KEY) {
    // This means vercel dev was NOT restarted after adding COMICVINE_KEY to .env.local
    return res.status(500).json({
      error: "COMICVINE_KEY is missing from environment variables",
      hint: "Stop vercel dev, then run it again — env vars are only read at startup, not hot-reloaded.",
    });
  }

  try {
    // Comic Vine requires a User-Agent header or it silently returns 401.
    // field_list limits the response to only the fields we actually use.
    const url =
      `https://comicvine.gamespot.com/api/search/` +
      `?api_key=${KEY}` +
      `&format=json` +
      `&query=${encodeURIComponent(query)}` +
      `&resources=issue` +
      `&field_list=id,name,image,cover_date,volume,description`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Lumen-MediaVault/1.0 (contact: dev@lumen.app)",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: "Comic Vine API request failed",
        status: response.status,
        details: errText,
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
}

