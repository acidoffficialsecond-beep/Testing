export default async function handler(req, res) {
  const { gameId } = req.query;

  if (!gameId) {
    return res.status(400).json({ error: "Missing gameId" });
  }

  try {
    const robloxUrl = `https://games.roblox.com/v1/games/${gameId}/game-passes?limit=50`;

    const response = await fetch(robloxUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
