export default async function handler(req, res) {
  try {
    const { target } = req.query;

    if (!target) {
      return res.status(400).json({
        error: "Missing target URL"
      });
    }

    // Decode URL
    const url = decodeURIComponent(target);

    // Allow ONLY Roblox domains (security)
    const allowed = [
      "games.roblox.com",
      "users.roblox.com",
      "inventory.roblox.com",
      "catalog.roblox.com"
    ];

    const hostname = new URL(url).hostname;

    if (!allowed.includes(hostname)) {
      return res.status(403).json({
        error: "Domain not allowed"
      });
    }

    const r = await fetch(url, {
      headers: {
        "User-Agent": "RobloxProxy/1.0"
      }
    });

    const data = await r.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");

    return res.status(r.status).send(data);

  } catch (err) {
    return res.status(500).json({
      error: "Proxy failed",
      details: String(err)
    });
  }
}
