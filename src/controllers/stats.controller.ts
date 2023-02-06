import { Request, Response } from "express";
import { LogUpdate, LogGet } from "@utils/logger";
import db from "@utils/db";
import IUser from "@interfaces/IUser";
import IGuild from "@interfaces/IGuild";
import IChannel from "@interfaces/IChannel";
import IUserChannel from "@interfaces/IUserChannel";
import IGame from "@interfaces/IGame";
import IUserGame from "@interfaces/IUserGame";

const User = db.users;
const Channel = db.channels;
const Guild = db.guilds;
const Game = db.games;
const UsersChannels = db.users_channels;
const UsersGuilds = db.users_guilds;
const UsersGames = db.users_games;

export function getStats(req: Request, res: Response) {
  LogGet(`Getting stats for user '${req.params.userId}'`);
  User.findOne({
    where: { userId: req.params.userId },
  })
    .then((user: IUser) => {
      if (!user) return res.status(404).send({ message: "User not found" });
      UsersGames.findAll({
        where: { userUserId: user.userId },
      }).then((userGame: []) => {
        let totalGameTime = 0;
        userGame.forEach((game: IUserGame) => {
          totalGameTime += game.gameTime;
        });

        userGame.sort((a: IUserGame, b: IUserGame) => {
          return b.gameTime - a.gameTime;
        });

        let top3Games: object[] = [];
        userGame.forEach((game: IUserGame, index: number) => {
          if (index < 3) {
            top3Games.push({
              name: game.gameGameName,
              time: game.gameTime,
            });
          }
        });

        UsersChannels.findAll({
          where: { userUserId: user.userId },
        }).then((userChannel: []) => {
          let totalVoiceTime = 0;
          userChannel.forEach((channel: IUserChannel) => {
            totalVoiceTime += channel.voiceTime;
          });
          res.status(200).json({
            user,
            userGame,
            userChannel,
            totalVoiceTime,
            totalGameTime,
            top3Games,
          });
        });
      });
    })
    .catch((error: Error) => res.status(404).json({ error }));
}

export function updateUserVoiceTime(req: Request, res: Response) {
  LogUpdate(`Updating user '${req.body.userId}' voice time`);
  User.findOrCreate({
    where: { userId: req.body.userId },
    defaults: {
      userId: req.body.userId,
    },
  })
    .then((data: any) => {
      const user: IUser = data[0];
      Guild.findOrCreate({
        where: { guildId: req.body.guildId },
        defaults: {
          guildId: req.body.guildId,
          createdAt: req.body.createdAt,
        },
      })
        .then((data: any) => {
          const guild: IGuild = data[0];
          Channel.findOrCreate({
            where: {
              channelId: req.body.channelId,
            },
            defaults: {
              guildGuildId: guild.guildId,
              channelId: req.body.channelId,
              type: req.body.type,
            },
          })
            .then((data: any) => {
              const channel: IChannel = data[0];
              UsersChannels.findOrCreate({
                where: {
                  channelChannelId: channel.channelId,
                  userUserId: user.userId,
                },
                defaults: {
                  channelChannelId: channel.channelId,
                  userUserId: user.userId,
                },
              })
                .then((data: any) => {
                  const userChannel: IUserChannel = data[0];
                  userChannel.voiceTime += req.body.voiceTime;
                  UsersChannels.update(
                    { voiceTime: userChannel.voiceTime },
                    {
                      where: {
                        userUserId: user.userId,
                        channelChannelId: channel.channelId,
                      },
                    }
                  )
                    .then(() =>
                      res.status(200).json({ message: "Voice time updated!" })
                    )
                    .catch((error: Error) =>
                      res.status(400).json({ error: error.message })
                    );
                })
                .catch((error: Error) =>
                  res.status(400).json({ error: error.message })
                );
            })
            .catch((error: Error) =>
              res.status(400).json({ error: error.message })
            );
        })
        .catch((error: Error) =>
          res.status(400).json({ error: error.message })
        );
    })
    .catch((error: Error) => res.status(400).json({ error: error.message }));
}

export function updateUserGameTime(req: Request, res: Response) {
  LogUpdate(`Updating user '${req.body.userId}' game time`);
  User.findOrCreate({
    where: { userId: req.body.userId },
    defaults: { userId: req.body.userId },
  })
    .then((data: any) => {
      const user: IUser = data[0];
      Game.findOrCreate({
        where: { gameName: req.body.gameName },
        defaults: { gameName: req.body.gameName },
      })
        .then((data: any) => {
          const game: IGame = data[0];
          UsersGames.findOrCreate({
            where: {
              gameGameName: game.gameName,
              userUserId: user.userId,
            },
            defaults: {
              gameGameName: game.gameName,
              userUserId: user.userId,
              firstPlayed: Date.now() - req.body.gameTime,
            },
          })
            .then((data: any) => {
              const userGame: IUserGame = data[0];
              userGame.gameTime += req.body.gameTime;
              UsersGames.update(
                { gameTime: userGame.gameTime },
                {
                  where: {
                    userUserId: user.userId,
                    gameGameName: game.gameName,
                  },
                }
              )
                .then(() =>
                  res.status(200).json({ message: "Game time updated!" })
                )
                .catch((error: Error) =>
                  res.status(400).json({ error: error.message })
                );
            })
            .catch((error: Error) =>
              res.status(400).json({ error: error.message })
            );
        })
        .catch((error: Error) =>
          res.status(400).json({ error: error.message })
        );
    })
    .catch((error: Error) => res.status(400).json({ error: error.message }));
}
