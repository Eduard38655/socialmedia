import db from "../../prisma/db.js";

export const postReactions = async (req, res) => {
  try {
    const userId = req.user.userid;
    const { reactionid, messageid, emoji } = req.body;

    if (typeof reactionid !== "number" || typeof messageid !== "number") {
      return res.status(400).json({
        ok: false,
        message: "Invalid reactionid or messageid",
      });
    }

    const result = await db.reactions.create({
      data: {
        reactionid,
        messageid,
        created_at: new Date(),
        emoji: emoji,
        userid: userId,
      },
    });

    return res.status(200).json({
      ok: true,
      data: result,
    });
  } catch (error) {
    console.error("Get reactions error:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};
