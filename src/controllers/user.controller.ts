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
  LogInfo(`Creating user '${req.body.username}'`);
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
  LogInfo(`Updating user '${req.params.id}' voice time`);
  User.findOne({ userId: req.params.id })
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      console.log(req.body);
      User.updateOne(
        { userId: req.params.id },
        { voiceTime: user.voiceTime + req.body.voiceTime }
      )
        .then(() => res.status(200).json({ message: "Voice time updated!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch(() => {
      console.log(req);
      const user = new User({ ...req.body, userId: req.params.id });
      user
        .save()
        .then(() =>
          res.status(201).json({ message: "User did not exist, created!" })
        )
        .catch((error) => res.status(400).json({ error }));
    });
}

export default { getUser, createUser, updateUser, updateUserVoiceTime };
