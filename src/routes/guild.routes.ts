import express from "express";
const router = express.Router();

import GuildController from "@controllers/guild.controller";

router.get("/i/:id", GuildController.getGuild);
router.post("/add", GuildController.createGuild);
router.delete("/i/:id", GuildController.deleteGuild);

export default router;
