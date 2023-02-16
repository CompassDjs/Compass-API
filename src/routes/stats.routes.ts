import express from "express";
const router = express.Router();

import {
  getUserStats,
  getGuildStats,
  updateUserVoiceTime,
  updateUserGameTime,
  newMessage,
} from "@controllers/stats.controller";

router.get("/user/:guildId/:userId", getUserStats);
router.get("/guild/:guildId", getGuildStats);
router.put("/voice", updateUserVoiceTime);
router.put("/game", updateUserGameTime);
router.post("/message", newMessage);

export default router;
