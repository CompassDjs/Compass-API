import express from "express";
const router = express.Router();

import {
  getGuild,
  createGuild,
  deleteGuild,
} from "@controllers/guild.controller";

router.get("/i/:guildId", getGuild);
router.post("/add", createGuild);
router.delete("/i/:guildId", deleteGuild);

export default router;
