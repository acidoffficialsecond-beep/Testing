export default async function handler(req, res) {
  try {
    const { gameId } = req.query;

    if (!gameId) {
      return res.status(400).json({ error: "Missing gameId" });
    }

    let passes = [];
    let cursor = null;

    do {
      const url =
        `https://apis.roproxy.com/game-passes/v1/universes/${gameId}/game-passes` +
        `?passView=Full&pageSize=100` +
        (cursor ? `&cursor=${cursor}` : "");

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Vercel-GamePass-Fetcher"
        }
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`RoProxy error ${response.status}: ${text}`);
      }

      const data = await response.json();

      if (Array.isArray(data?.gamePasses)) {
        passes.push(...data.gamePasses);
      }

      cursor = data?.nextPageCursor || null;
    } while (cursor);

    return res.status(200).json({
      count: passes.length,
      gamePasses: passes
    });

  } catch (err) {
    console.error("FUNCTION ERROR:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message
    });
  }
}
