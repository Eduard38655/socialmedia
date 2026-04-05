import db from "../../../prisma/db.js";

export default async function getWorkspaceMembers(req, res) {
  try {
    const userid = req.user?.userid ?? req.user?.id ?? req.login?.loginid;

    if (!userid) {
      return res.status(400).json({
        ok: false,
        message: "No user id available",
      });
    }

    const data = await db.workspace_members.findMany({
      where: { userid: Number(userid) },
      include: {
        workspaces: true,
      },
    });

    return res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error("workspace_members error:", error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
}