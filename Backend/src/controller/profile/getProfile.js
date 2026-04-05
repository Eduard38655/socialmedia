export default function getProfile(req, res) {
  try {
    if (!req.user?.userid) {
      return res.status(401).json({
        ok: false,
        message: "Not authenticated",
      });
    }

    return res.status(200).json({
      ok: true,
      user: req.user,
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
}