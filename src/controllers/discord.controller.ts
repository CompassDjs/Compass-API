import IGuild from "@interfaces/IGuild";
import { Request, Response } from "express";
import { LogGet, LogUpdate } from "@utils/logger";
import axios from "axios";
import db from "@utils/db";
import { Wait } from "@utils/functions";

const User = db.users;
const Guild = db.guilds;

export function getMutualGuilds(req: any, res: Response) {
  const accessToken = req.tokens.accessToken;
  if (accessToken) {
    getUserGuilds(accessToken).then((userGuilds) => {
      getBotGuilds().then(async (botGuilds) => {
        // TODO: Handle permissions
        const mutualGuilds = botGuilds.data.filter((botGuild: IGuild) =>
          userGuilds.data.some(
            (userGuild: IGuild) => userGuild.id === botGuild.id
          )
        );

        let fullGuilds: IGuild[] = [];
        mutualGuilds.map(async (guild: IGuild) => {
          let guildDb = await getGuild(guild.id);
          fullGuilds.push({
            ...guild,
            icon: guild.icon
              ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
              : null,
            guildCreatedAt: guildDb.guildCreatedAt,
            createdAt: guildDb.createdAt,
          });
        });
        await Wait(1000);
        res.status(200).json(fullGuilds);
      });
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

async function getGuild(guildId: string) {
  return Guild.findOne({ where: { id: guildId } }).then((foundGuild: any) => {
    return foundGuild.dataValues;
  });
}

export function getAndUpdateUser(req: any, res: Response) {
  const accessToken = req.tokens.accessToken;
  if (accessToken) {
    axios
      .get("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        LogUpdate(`User '${req.params.userId}'`);
        const user = response.data;
        User.update(
          { ...user },
          { where: { userId: req.params.userId }, returning: true }
        )
          .then((updatedUser: any) => res.status(200).json(updatedUser[1][0]))
          .catch(() => res.status(404).json({ error: "User not found" }));
      })
      .catch(() => res.status(404).json({ error: "Could not find user" }));
  } else {
    res.status(404).json({ error: "Could not find token" });
  }
}

export function getGuildChannels(req: Request, res: Response) {
  LogGet(`Channels for guild '${req.params.guildId}'`);
  axios
    .get(`https://discord.com/api/guilds/${req.params.guildId}/channels`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    })
    .then((response) => res.status(200).json(response.data))
    .catch(() => res.status(404).json({ error: "Could not find guild" }));
}

function getBotGuilds() {
  return axios.get("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  });
}

function getUserGuilds(accessToken: string) {
  return axios.get("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
