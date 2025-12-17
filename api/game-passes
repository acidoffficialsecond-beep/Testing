async function fetchGamePasses(gameId) {
  const url = `https://apis.roproxy.com/game-passes/v1/universes/${gameId}/game-passes?passView=Full&pageSize=100`;
  const response = await fetch(url);
  const data = await response.json();

  return data?.gamePasses || [];
}

export default async function handler(req, res) {
  const { userid } = req.query;

  if (!userid) {
    return res.status(400).json({ error: "Missing userid" });
  }

  try {
    let cursor = null;
    const games = [];

    // Fetch all games
    do {
      let url = `https://games.roproxy.com/v2/users/${userid}/games?sortOrder=Asc&limit=10`;
      if (cursor) url += `&cursor=${cursor}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data?.data) break;

      for (const game of data.data) {
        games.push(game.id);
      }

      cursor = data.nextPageCursor;
    } while (cursor);

    // Fetch gamepasses per game
    const allPasses = [];

    for (const gameId of games) {
      const passes = await fetchGamePasses(gameId);
      for (const pass of passes) {
        allPasses.push({
          gameId,
          ...pass
        });
      }
    }

    return res.status(200).json({
      userId: userid,
      gamePasses: allPasses
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch gamepasses",
      details: err.message
    });
  }
}
