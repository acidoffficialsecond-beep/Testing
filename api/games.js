export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const allGames = [];
  let cursor = null;

  try {
    do {
      let url = `https://games.roproxy.com/v2/users/${userId}/games?sortOrder=Asc&limit=10`;
      if (cursor) url += `&cursor=${cursor}`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Vercel-Games-Fetcher"
        }
      });

      if (!response.ok) {
        throw new Error(`RoProxy error ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data?.data)) break;

      for (const game of data.data) {
        allGames.push({
          id: game.id,
          name: game.name,
          placeId: game.rootPlace?.id
        });
      }

      cursor = data.nextPageCursor ?? null;
    } while (cursor);

    return res.status(200).json({
      count: allGames.length,
      games: allGames
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to fetch games",
      details: err.message
    });
  }
}
