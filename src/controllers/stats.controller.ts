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

export function getUserStats(req: Request, res: Response) {
  LogGet(`Stats for user '${req.params.userId}'`);
  User.findOne({
    where: { userId: req.params.userId },
  })
    .then((user: IUser) => {
      if (!user) return res.status(404).send({ message: "User not found" });
      UsersGames.findAll({
        attributes: ["gameGameName", "gameTime"],
        where: { userUserId: user.userId },
        sort: [["gameTime", "DESC"]],
        limit: 3,
      })
        .then(async (top3Games: []) => {
          const totalGameTime = await UsersGames.sum("gameTime", {
            where: { userUserId: user.userId },
          });

          const guildTotalVoice = await db.sequelize.query(
            `SELECT cast(SUM(uc.voiceTime) AS UNSIGNED) as voiceTime
          FROM users_channels AS uc
          JOIN channels AS c ON uc.channelChannelId = c.channelId
          JOIN users_guilds AS ug ON uc.userUserId = ug.userUserId
          WHERE uc.userUserId = :userId AND c.guildGuildId = :guildId
          `,
            {
              replacements: {
                guildId: req.params.guildId,
                userId: req.params.userId,
              },
              type: QueryTypes.SELECT,
            }
          );
          const top3Voice = await db.sequelize.query(
            `SELECT 
          channels.channelId, 
          users_channels.voiceTime as voiceTime
          FROM channels
          JOIN users_channels ON channels.channelId = users_channels.channelChannelId
          JOIN users_guilds ON users_channels.userUserId = users_guilds.userUserId
          WHERE 
          channels.guildGuildId = :guildId AND 
          users_guilds.guildGuildId = :guildId AND 
          users_channels.userUserId = :userId
          GROUP BY channels.channelId
          ORDER BY voiceTime DESC
          LIMIT 3;`,
            {
              replacements: {
                userId: user.userId,
                guildId: req.params.guildId,
              },
              type: QueryTypes.SELECT,
            }
          );

          const top3Msg = await db.sequelize.query(
            `SELECT channels.channelId, count(*) as messageCount
           FROM channels
           JOIN messages ON channels.channelId = messages.channelChannelId
           JOIN users_messages ON messages.messageId = users_messages.messageMessageId
           WHERE channels.guildGuildId = :guildId AND users_messages.userUserId = :userId
           GROUP BY channels.channelId
           ORDER BY messageCount DESC
           LIMIT 3;`,
            {
              replacements: {
                userId: user.userId,
                guildId: req.params.guildId,
              },
              type: QueryTypes.SELECT,
            }
          );
          Message.count({
            include: [
              {
                model: Channel,
                required: true,
                where: {
                  guildGuildId: req.params.guildId,
                },
                include: [
                  {
                    model: Guild,
                    required: true,
                  },
                ],
              },
              {
                model: User,
                required: true,
                where: {
                  userId: req.params.userId,
                },
              },
            ],
          })
            .then((guildTotalMsg: number) => {
              res.status(200).json({
                user: user.userId,
                top3Msg,
                top3Voice,
                top3Games,
                guildTotalMsg,
                guildTotalVoice: guildTotalVoice[0].voiceTime || 0,
                totalGameTime: totalGameTime || 0,
              });
            })
            .catch((error: Error) => res.status(404).json({ error }));
        })
        .catch((error: Error) => res.status(404).json({ error }));
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
        where: { guildId: req.body.guildId },
        defaults: {
          guildId: req.body.guildId,
          guildCreatedAt: req.body.guildCreatedAt,
        },
      })
        .then((data: any) => {
          const guild: IGuild = data[0];
          UsersGuilds.findOrCreate({
            where: {
              guildGuildId: guild.guildId,
              userUserId: user.userId,
            },
            defaults: {
              guildGuildId: guild.guildId,
              userUserId: user.userId,
            },
          })
            .then(() => {
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

          if (!game.igdbId) {
            const igdbObj = {
              igdbId: "",
              igdbCoverId: "",
            };

            //ADD TOKEN REFRESH
            try {
              const igdbGame = await FindGameByName(game);
              if (!igdbGame) return;
              igdbObj.igdbId = igdbGame ? igdbGame.id : null;
              const igdbCover = await GetGameCover(igdbObj.igdbId);
              igdbObj.igdbCoverId = igdbCover ? igdbCover.image_id : null;
            } catch (error) {
              console.log(error);
              throw new Error();
            }
            Game.update(
              { ...igdbObj },
              {
                where: {
                  gameName: game.gameName,
                },
              }
            )
              .then(() => {})
              .catch((error: Error) => {
                res.status(400).json({ error: error.message });
              });
          }
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

export function newMessage(req: Request, res: Response) {
  LogCreate(`'${req.body.messageId}' message`);
  User.findOrCreate({
    where: { userId: req.body.userId },
    defaults: { userId: req.body.userId },
  })
    .then((data: any) => {
      const user: IUser = data[0];
      Guild.findOrCreate({
        where: { guildId: req.body.guildId },
        defaults: {
          guildId: req.body.guildId,
          guildCreatedAt: req.body.guildCreatedAt,
        },
      })
        .then((data: any) => {
          const guild: IGuild = data[0];
          UsersGuilds.findOrCreate({
            where: {
              guildGuildId: guild.guildId,
              userUserId: user.userId,
            },
            defaults: {
              guildGuildId: guild.guildId,
              userUserId: user.userId,
            },
          })
            .then(() => {
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
function FindGameCover(igdbObj: {
  igdbId: string;
  igdbCoverId: string;
  igdbRealeaseDate: number;
}) {
  throw new Error("Function not implemented.");
}
