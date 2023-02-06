import { Request, Response } from "express";
import { LogCreate, LogDelete, LogUpdate, LogGet } from "@utils/logger";
import db from "@utils/db";
import IUser from "@interfaces/IUser";

const User = db.users;

export function getUser(req: Request, res: Response) {
  LogGet(`Getting user '${req.params.userId}'`);
  User.findOrCreate({
    where: { userId: req.params.userId },
    defaults: {
      userId: req.params.userId,
    },
  })
    .then((data: any) => {
      let user: IUser = data[0];
      res.status(200).json(user);
    })
    .catch((error: Error) => res.status(404).json({ error }));
}

export function createUser(req: Request, res: Response) {
  LogCreate(`Creating user '${req.body.userId}'`);
  User.create({ ...req.body })
    .then(() => res.status(201).json({ message: "User created!" }))
    .catch((error: Error) => res.status(400).json({ error: error.message }));
}

export function updateUser(req: Request, res: Response) {
  LogUpdate(`Updating user '${req.params.userId}'`);
  User.update({ ...req.body }, { where: { userId: req.params.userId } })
    .then(() => res.status(200).json({ message: "User updated!" }))
    .catch(() => res.status(404).json({ error: "User not found" }));
}

export function deleteUser(req: Request, res: Response) {
  LogDelete(`Deleting user '${req.params.userId}'`);
  User.destroy({ where: { userId: req.params.userId } })
    .then(() => res.status(200).json({ message: "User deleted!" }))
    .catch(() => res.status(404).json({ error: "User not found" }));
}
