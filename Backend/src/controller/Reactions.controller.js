import express from "express";
import db from "../../prisma/db.js";

const router = express.Router();
 
export const getReactions=async(req, res) => {
  try {
    const result = await db.reactions.findMany();

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
 
