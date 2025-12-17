export default async function handler(req, res) {
  const { userid } = req.query;

  if (!userid) {
    return res.status(400).json({ error: "Missing userid" });
  }

  const allGames = [];
  let cursor = null;

  try {
    do {
      let url = `https://games.roproxy.com/v2/users/${userid}/games?sortOrder=Asc&limit=10`;
      if (cursor) url += `&cursor=${cursor}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data?.data) break;

      for (const game of data.data) {
        allGames.push({ id: game.id });
      }

      cursor = data.nextPageCursor;
    } while (cursor);

    return res.status(200).json(allGames);
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch games",
      details: err.message
    });
  }
}
