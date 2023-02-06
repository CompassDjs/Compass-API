import express from "express";
const router = express.Router();

import {
  getStats,
  updateUserVoiceTime,
  updateUserGameTime,
} from "@controllers/stats.controller";

router.get("/i/:userId", getStats);
router.put("/voice", updateUserVoiceTime);
router.put("/game", updateUserGameTime);

export default router;
