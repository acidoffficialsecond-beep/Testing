export default async function handler(req, res) {
  const { universeId } = req.query;

  if (!universeId) {
    return res.status(400).json({ error: "Missing universeId" });
  }

  try {
    const robloxRes = await fetch(
      `https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100&sortOrder=Asc`
    );

    const data = await robloxRes.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=60");

    return res.status(200).json({
      proxied: true,
      universeId,
      robloxResponse: data
    });

  } catch (err) {
    return res.status(500).json({ error: "Proxy fetch failed" });
  }
}
