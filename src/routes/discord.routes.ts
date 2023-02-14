import express from "express";
const router = express.Router();

import accessToken from "@middlewares/accessToken";

import {
  getMutualGuilds,
  getAndUpdateUser,
  getGuildChannels,
} from "@controllers/discord.controller";

router.get("/user/mutual-guilds", accessToken, getMutualGuilds);
router.get("/user", accessToken, getAndUpdateUser);
router.get("/guilds/:guildId/channels", getGuildChannels);

export default router;
