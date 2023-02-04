import { Request, Response } from "express";
import { LogInfo } from "@utils/logger";
import User from "@models/User";

export function getUser(req: Request, res: Response) {
  LogInfo(`Getting user '${req.params.id}'`);
  User.findOne({ userId: req.params.id })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
}

export function createUser(req: Request, res: Response) {
  LogInfo(`Creating user '${req.body.userId}'`);
  const user = new User({ ...req.body });
  user
    .save()
    .then(() => res.status(201).json({ message: "User created!" }))
    .catch((error) => res.status(400).json({ error }));
}

export function updateUser(req: Request, res: Response) {
  LogInfo(`Updating user '${req.params.id}'`);
  User.findOne({ userId: req.params.id })
    .then((user) => {
      console.log(user);
      let userObj = { ...req.body };
      User.updateOne({ userId: req.params.id }, { ...userObj })
        .then(() => res.status(200).json({ message: "User updated!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch(() => res.status(404).json({ error: "User not found" }));
}

export function updateUserVoiceTime(req: Request, res: Response) {
  LogInfo(`Updating user '${req.params.userId}' voice time`);
  User.findOne({ userId: req.params.userId })
    .then((user) => {
      if (!user) return;
      const guilds = user.guildStats;
      let guild = guilds.find((g) => g.guildId === req.params.guildId) ?? null;

      if (!guild) {
        guild = {
          guildId: req.params.guildId,
          voiceTime: req.body.voiceTime,
        };
        guilds.push(guild);
      } else {
        guild.voiceTime += req.body.voiceTime;
      }

      User.updateOne({ userId: req.params.userId }, { guildStats: guilds })
        .then(() => res.status(200).json({ message: "Voice time updated!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch(() => res.status(404).json({ error: "User not found" }));
}

export default { getUser, createUser, updateUser, updateUserVoiceTime };
