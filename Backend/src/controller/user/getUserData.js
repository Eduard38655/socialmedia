import db from "../../../prisma/db.js";

export default async function getUserData(req, res) {
  try {
    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;

    if (!userid) {
      return res.status(401).json({
        ok: false,
        message: "User not authenticated",
      });
    }

    const user = await db.users.findUnique({
      where: { userid: Number(userid) },
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      ok: true,
      data: user,
    });
  } catch (error) {
    console.error("getUserData error:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
}