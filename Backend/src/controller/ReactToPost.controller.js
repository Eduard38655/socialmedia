import db from "../../prisma/db.js";

export const postReactions = async (req, res) => {
  try {
    const userId = req.user.userid;
    const { reactionId, msgId, emoji } = req.body;

    const result = await db.reactions.create({
      data: {
        reactionid: Number(reactionId),
        messageid: Number(msgId),
        created_at: new Date(),
        emoji: emoji,
        userid: Number(userId),
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
