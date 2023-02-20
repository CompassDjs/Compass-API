import express from "express";
const router = express.Router();

import accessToken from "@middlewares/accessToken";

import {
  getGuildUserStats,
  getGuildStats,
  updateUserVoiceTime,
  updateUserGameTime,
  newMessage,
} from "@controllers/stats.controller";

router.get("/user/:guildId", accessToken, getGuildUserStats);
router.get("/guild/:guildId", accessToken, getGuildStats);
router.put("/voice", updateUserVoiceTime);
router.put("/game", updateUserGameTime);
router.post("/message", newMessage);

export default router;
