import db from "../../../prisma/db.js";

export default async function deleteGroupMessage(req, res) {
  try {
    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;
    const { messageid } = req.params;

    if (!userid) {
      return res.status(400).json({
        ok: false,
        message: "No user id available",
      });
    }

    if (!messageid) {
      return res.status(400).json({
        ok: false,
        message: "Message id is required",
      });
    }

    const result = await db.messages.deleteMany({
      where: {
        messageid: Number(messageid),
        userid: Number(userid),
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        ok: false,
        message: "Message not found or not yours",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
}