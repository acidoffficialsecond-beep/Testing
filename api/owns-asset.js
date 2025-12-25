export default async function handler(req, res) {
  try {
    const { userId, assetId } = req.query;

    if (!userId || !assetId) {
      return res.status(400).json({
        error: "Missing userId or assetId",
        owns: false
      });
    }

    const url = `https://inventory.roproxy.com/v1/users/${userId}/items/Asset/${assetId}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Vercel-Asset-Checker"
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
      assetId,
      owns
    });

  } catch (err) {
    console.error("FUNCTION ERROR:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      owns: false,
      message: err.message
    });
  }
}
