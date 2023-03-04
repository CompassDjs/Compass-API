import express from "express";
const router = express.Router();

import {
  getGuild,
  createGuild,
  deleteGuild,
} from "@controllers/guild.controller";

router.get("/i/:id", getGuild);
router.post("/add", createGuild);
router.delete("/i/:id", deleteGuild);

export default router;
