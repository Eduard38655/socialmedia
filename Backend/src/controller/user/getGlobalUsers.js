import db from "../../../prisma/db.js";

export default async function getGlobalUsers(req, res) {
  try {
    const users = await db.users.findMany({
      select: {
        userid: true,
        name: true,
        img: true,
        last_name: true,
      },
    });

    return res.status(200).json({
      ok: true,
      data: users,
    });
  } catch (error) {
    console.error("getGlobalUsers error:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
}
