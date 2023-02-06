import express from "express";
const router = express.Router();

import {
  getChannel,
  createChannel,
  updateChannel,
} from "@controllers/channel.controller";

router.get("/i/:channelId", getChannel);
router.post("/add", createChannel);
router.put("/i/:channelId", updateChannel);

export default router;
