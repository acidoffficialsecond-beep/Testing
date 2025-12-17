/**
 * Fetch all game passes for a given Roblox universe (game) ID
 * @param {string | number} gameId
 * @returns {Promise<Array>}
 */
async function fetchGamePasses(gameId) {
  const passes = [];
  let cursor = null;

  try {
    do {
      const url = new URL(
        `https://apis.roproxy.com/game-passes/v1/universes/${gameId}/game-passes`
      );

      url.searchParams.set("passView", "Full");
      url.searchParams.set("pageSize", "100");
      if (cursor) url.searchParams.set("cursor", cursor);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data?.gamePasses) {
        passes.push(...data.gamePasses);
      }

      cursor = data?.nextPageCursor ?? null;
    } while (cursor);

    return passes;
  } catch (err) {
    console.error("Failed to fetch game passes:", err);
    return [];
  }
}

module.exports = { fetchGamePasses };
