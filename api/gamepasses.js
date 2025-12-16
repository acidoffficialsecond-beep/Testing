export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const gamesRes = await fetch(
      `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&limit=50`
    );
    const games = await gamesRes.json();

    let passes = [];

    for (const game of games.data || []) {
      const passRes = await fetch(
        `https://games.roblox.com/v1/games/${game.id}/game-passes?limit=50`
      );
      const passData = await passRes.json();

      for (const pass of passData.data || []) {
        if (pass.price !== null) {
          passes.push({
            game: game.name,
            universeId: game.id,
            id: pass.id,
            name: pass.name,
            price: pass.price
          });
        }
      }
    }

    res.status(200).json(passes);
  } catch {
    res.status(500).json({ error: "Failed to fetch gamepasses" });
  }
}
