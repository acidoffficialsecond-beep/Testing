export default async function handler(req, res) {
  try {
    const { userId, gamePassId } = req.query;

    if (!userId || !gamePassId) {
      return res.status(400).json({
        error: "Missing userId or gamePassId"
      });
    }

    const url = `https://inventory.roproxy.com/v1/users/${userId}/items/GamePass/${gamePassId}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Vercel-GamePass-Checker"
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`RoProxy error ${response.status}: ${text}`);
    }

    const data = await response.json();

    const owns =
      Array.isArray(data?.data) && data.data.length > 0;

    return res.status(200).json({
      userId,
      gamePassId,
      owns
    });

  } catch (err) {
    console.error("FUNCTION ERROR:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message
    });
  }
}
