import { Request, Response } from "express";
import { LogUpdate, LogGet, LogCreate } from "@utils/logger";
import { FindGameByName, GetGameCover } from "@utils/igdb";
import { QueryTypes } from "sequelize";
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
const Message = db.messages;
const UsersChannels = db.users_channels;
const UsersGuilds = db.users_guilds;
const UsersGames = db.users_games;
const UsersMessages = db.users_messages;

export function getGuildUserStats(req: any, res: Response) {
  LogGet(`Stats for user guild ${req.params.guildId}`);
  if (!req.tokens.userId)
    return res.status(400).json({ error: "Session expired" });

  const userId = req.tokens.userId;
  Guild.findOne({
    where: { id: req.params.guildId },
  })
    .then(async (data: any) => {
      const guild = data.dataValues as IGuild;

      let totalMsg, totalVoice, totalGames;
      try {
        totalMsg = await db.sequelize.query(
          `SELECT COUNT(*) AS totalMessages
            FROM messages m
            INNER JOIN channels c ON m.channelChannelId = c.channelId
            INNER JOIN guilds g ON c.guildId = g.id
            INNER JOIN users_messages um ON m.messageId = um.messageMessageId
            INNER JOIN users u ON um.userUserId = u.userId
            WHERE g.id = :guildId AND u.userId = :userId;
            `,
          {
            replacements: {
              guildId: guild.id,
              userId: userId,
            },
          }
        );

        totalVoice = await db.sequelize.query(
          `SELECT SUM(uc.voiceTime) AS totalVoiceTime
            FROM users_channels uc
            INNER JOIN channels c ON uc.channelChannelId = c.channelId
            INNER JOIN guilds g ON c.guildId = g.id
            INNER JOIN users u ON uc.userUserId = u.userId
            WHERE g.id = :guildId AND u.userId = :userId;
            `,
          {
            replacements: {
              guildId: guild.id,
              userId: userId,
            },
          }
        );

        totalGames = await db.sequelize.query(
          `SELECT SUM(ug.gameTime) AS totalGameTime
            FROM users_games ug
            INNER JOIN games g ON ug.gameGameName = g.gameName
            INNER JOIN users u ON ug.userUserId = u.userId
            INNER JOIN users_guilds ugld ON ugld.userUserId = u.userId
            INNER JOIN guilds gld ON ugld.guildId = gld.id
            WHERE gld.id = :guildId AND u.userId = :userId;
            `,
          {
            replacements: {
              guildId: guild.id,
              userId: userId,
            },
          }
        );
      } catch (error) {
        return res.status(404).json({ error });
      }

      const totals = {
        totalMsg: totalMsg[0][0].totalMessages,
        totalVoice: totalVoice[0][0].totalVoiceTime,
        totalGames: totalGames[0][0].totalGameTime,
      };
      res.status(200).json({ totals });
    })
    .catch((error: Error) => res.status(404).json({ error }));
}

export function getGuildStats(req: any, res: Response) {
  LogGet(`Stats for guild '${req.params.guildId}'`);
  const accessToken = req.tokens.accessToken;
  Guild.findOne({
    where: { id: req.params.guildId },
  })
    .then(async (data: any) => {
      const guild = data.dataValues as IGuild;

      let totalMsg, totalVoice, totalGames;
      try {
        totalMsg = await db.sequelize.query(
          `SELECT COUNT(*) AS totalMessages
      FROM messages m
      INNER JOIN channels c ON m.channelChannelId = c.channelId
      INNER JOIN guilds g ON c.guildId = g.id
      WHERE g.id = :guildId;`,
          {
            replacements: {
              guildId: guild.id,
            },
          }
        );

        totalVoice = await db.sequelize.query(
          `SELECT cast(SUM(uc.voiceTime) AS UNSIGNED) AS totalVoiceTime
      FROM users_channels uc
      INNER JOIN channels c ON uc.channelChannelId = c.channelId
      INNER JOIN guilds g ON c.guildId = g.id
      WHERE g.id = :guildId;`,
          {
            replacements: {
              guildId: guild.id,
            },
          }
        );

        totalGames = await db.sequelize.query(
          `SELECT cast(SUM(ug2.gameTime) AS UNSIGNED) AS totalGameTime
      FROM users_guilds ug
      INNER JOIN guilds g ON ug.guildId = g.id
      INNER JOIN users u ON ug.userUserId = u.userId
      INNER JOIN users_games ug2 ON u.userId = ug2.userUserId
      WHERE g.id = :guildId;`,
          {
            replacements: {
              guildId: guild.id,
            },
          }
        );
      } catch (error) {
        return res.status(404).json({ error });
      }
      const totals = {
        totalMsg: totalMsg[0][0].totalMessages,
        totalVoice: totalVoice[0][0].totalVoiceTime,
        totalGames: totalGames[0][0].totalGameTime,
      };

      let topPlayers, topSpeakers, topChannels, topMessagers;
      try {
        topPlayers = await db.sequelize.query(
          `SELECT u.userId, cast(SUM(ug.gameTime) AS UNSIGNED) AS totalGameTime
      FROM users u
      INNER JOIN users_games ug ON u.userId = ug.userUserId
      INNER JOIN users_guilds uguilds ON u.userId = uguilds.userUserId
      WHERE uguilds.guildId = :guildId
      GROUP BY u.userId
      ORDER BY totalGameTime DESC
      LIMIT 10;
      `,
          {
            replacements: {
              guildId: guild.id,
            },
          }
        );

        topSpeakers = await db.sequelize.query(
          `SELECT u.userId, cast(SUM(uc.voiceTime) AS UNSIGNED) AS totalVoiceTime
      FROM users u
      INNER JOIN users_channels uc ON u.userId = uc.userUserId
      INNER JOIN users_guilds uguilds ON u.userId = uguilds.userUserId
      WHERE uc.channelChannelId IN (
        SELECT channelId FROM channels WHERE guildId = :guildId
      )
      AND uguilds.guildId = :guildId
      GROUP BY u.userId
      ORDER BY totalVoiceTime DESC
      LIMIT 10;`,
          {
            replacements: {
              guildId: guild.id,
            },
          }
        );

        topMessagers = await db.sequelize.query(
          `SELECT u.userId, COUNT(*) AS messageCount
      FROM users u
      JOIN users_messages um ON u.userId = um.userUserId
      JOIN messages m ON m.messageId = um.messageMessageId
      JOIN channels c ON c.channelId = m.channelChannelId
      JOIN guilds g ON g.id = c.guildId
      WHERE g.id = :guildId
      GROUP BY u.userId
      ORDER BY messageCount DESC
      LIMIT 10;`,
          {
            replacements: {
              guildId: guild.id,
            },
          }
        );

        topChannels = await db.sequelize.query(
          `SELECT c.channelId AS channelId, COUNT(*) AS messageCount
      FROM messages m
      JOIN channels c ON m.channelChannelId = c.channelId
      WHERE c.guildId = :guildId
      GROUP BY m.channelChannelId
      ORDER BY messageCount DESC
      LIMIT 3;
      `,
          {
            replacements: {
              guildId: guild.id,
            },
          }
        );
      } catch (error) {
        return res.status(404).json({ error });
      }

      const tops = {
        topPlayers: topPlayers[0],
        topSpeakers: topSpeakers[0],
        topMessagers: topMessagers[0],
        topChannels: topChannels[0],
      };

      res.status(200).json({
        id: guild.id,
        totals,
        tops,
      });
    })
    .catch((error: Error) => res.status(404).json({ error }));
}

export function updateUserVoiceTime(req: Request, res: Response) {
  LogUpdate(`'${req.body.userId}' voice time`);
  User.findOrCreate({
    where: { userId: req.body.userId },
    defaults: {
      userId: req.body.userId,
    },
  })
    .then((data: any) => {
      const user: IUser = data[0];
      Guild.findOrCreate({
        where: { id: req.body.guildId },
        defaults: {
          id: req.body.guildId,
          guildCreatedAt: req.body.guildCreatedAt,
        },
      })
        .then((data: any) => {
          const guild: IGuild = data[0];
          UsersGuilds.findOrCreate({
            where: {
              guildId: guild.id,
              userUserId: user.userId,
            },
            defaults: {
              guildId: guild.id,
              userUserId: user.userId,
            },
          })
            .then(() => {
              Channel.findOrCreate({
                where: {
                  channelId: req.body.channelId,
                },
                defaults: {
                  guildId: guild.id,
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
                          res
                            .status(200)
                            .json({ message: "Voice time updated!" })
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
        .catch((error: Error) =>
          res.status(400).json({ error: error.message })
        );
    })
    .catch((error: Error) => res.status(400).json({ error: error.message }));
}

export function updateUserGameTime(req: Request, res: Response) {
  LogUpdate(`'${req.body.userId}' game time`);
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
        .then(async (data: any) => {
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
                  res.status(400).json({ error: error })
                );
            })
            .catch((error: Error) => res.status(400).json({ error: error }));
        })
        .catch((error: Error) => res.status(400).json({ error: error }));
    })
    .catch((error: Error) => res.status(400).json({ error: error }));
}

export function newMessage(req: Request, res: Response) {
  LogCreate(`'${req.body.messageId}' message`);
  User.findOrCreate({
    where: { userId: req.body.userId },
    defaults: { userId: req.body.userId },
  })
    .then((data: any) => {
      const user: IUser = data[0];
      Guild.findOrCreate({
        where: { id: req.body.guildId },
        defaults: {
          id: req.body.guildId,
          guildCreatedAt: req.body.guildCreatedAt,
        },
      })
        .then((data: any) => {
          const guild: IGuild = data[0];
          UsersGuilds.findOrCreate({
            where: {
              guildId: guild.id,
              userUserId: user.userId,
            },
            defaults: {
              guildId: guild.id,
              userUserId: user.userId,
            },
          })
            .then(() => {
              Channel.findOrCreate({
                where: {
                  channelId: req.body.channelId,
                },
                defaults: {
                  guildId: guild.id,
                  channelId: req.body.channelId,
                  type: req.body.type,
                },
              })
                .then((data: any) => {
                  const channel: IChannel = data[0];
                  Message.create({
                    messageId: req.body.messageId,
                    channelChannelId: channel.channelId,
                  })
                    .then(() => {
                      UsersMessages.create({
                        userUserId: user.userId,
                        messageMessageId: req.body.messageId,
                      })
                        .then(() => {
                          res.status(200).json({ message: "Message updated!" });
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
