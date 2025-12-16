export default async function handler(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // 1. Fetch user's games
    const gamesRes = await fetch(
      `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&limit=50&sortOrder=Asc`
    );
    const gamesData = await gamesRes.json();

    if (!gamesData.data) {
      return res.status(404).json({ error: "No games found" });
    }

    let allPasses = [];

    // 2. Loop through games & fetch passes
    for (const game of gamesData.data) {
      const passesRes = await fetch(
        `https://games.roblox.com/v1/games/${game.id}/game-passes?limit=50&sortOrder=Asc`
      );
      const passesData = await passesRes.json();

      if (passesData.data) {
        allPasses.push(
          ...passesData.data.map(pass => ({
            gameName: game.name,
            universeId: game.id,
            passId: pass.id,
            name: pass.name,
            price: pass.price,
            icon: pass.iconImageAssetId
              ? `https://www.roblox.com/asset-thumbnail/image?assetId=${pass.iconImageAssetId}&width=420&height=420&format=png`
              : null
          }))
        );
      }
    }

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    return res.status(200).json(allPasses);

  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch game passes" });
  }
}
