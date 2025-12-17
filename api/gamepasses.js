export default async function handler(req, res) {
  const { gameId } = req.query;

  if (!gameId) {
    return res.status(400).json({ error: "Missing gameId" });
  }

  try {
    const url = `https://apis.RoProxy.com/game-passes/v1/universes/${gameId}/game-passes?passView=Full&pageSize=100`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.data) {
      return res.status(404).json({ error: "No gamepasses found" });
    }

    // Optional: clean response for donation games
    const passes = data.data
      .filter(p => p.price !== null)
      .map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        icon: p.iconImageAssetId
          ? `https://www.roblox.com/asset-thumbnail/image?assetId=${p.iconImageAssetId}&width=420&height=420&format=png`
          : null
      }));

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.status(200).json(passes);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gamepasses" });
  }
}
