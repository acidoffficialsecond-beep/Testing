export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const gameId = req.query.gameId;

  if (!gameId || isNaN(gameId)) {
    return res.status(400).json({ error: "Invalid gameId" });
  }

  try {
    const robloxResponse = await fetch(
      `https://games.roblox.com/v1/games/${gameId}/game-passes?limit=50`,
      {
        headers: {
          "User-Agent": "RobloxProxy/1.0"
        }
      }
    );

    if (!robloxResponse.ok) {
      return res
        .status(robloxResponse.status)
        .json({ error: "Roblox request failed" });
    }

    const data = await robloxResponse.json();

    // YOUR endpoint response
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Proxy failed", details: error.message });
  }
}
