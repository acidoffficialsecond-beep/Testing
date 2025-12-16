export default async function handler(req, res) {
  try {
    const { userId, universeId } = req.query;

    if (!userId && !universeId) {
      return res.status(400).json({
        error: "Missing userId or universeId"
      });
    }

    // Simple health check
    if (req.query.test === "1") {
      return res.status(200).json({ status: "alive" });
    }

    // Universe-based (preferred)
    if (universeId) {
      const r = await fetch(
        `https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100`
      );

      const data = await r.json();
      return res.status(200).json(data);
    }

    // User-based fallback
    const gamesRes = await fetch(
      `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&limit=50`
    );

    const games = await gamesRes.json();

    return res.status(200).json(games);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server crashed",
      details: String(err)
    });
  }
}
