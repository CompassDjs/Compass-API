import express from "express";
const router = express.Router();

import {
  getUserStats,
  updateUserVoiceTime,
  updateUserGameTime,
  newMessage,
} from "@controllers/stats.controller";

router.get("/i/:guildId/:userId", getUserStats);
router.put("/voice", updateUserVoiceTime);
router.put("/game", updateUserGameTime);
router.post("/message", newMessage);

export default router;
