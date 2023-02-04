import { Request, Response } from "express";
import { LogInfo } from "@utils/logger";
import Guild from "@models/Guild";

export function getGuild(req: Request, res: Response) {
  LogInfo(`Getting guild '${req.params.id}'`);
  Guild.findOne({ guildId: req.params.id })
    .then((guild) => res.status(200).json(guild))
    .catch((error) => res.status(404).json({ error }));
}

export function createGuild(req: Request, res: Response) {
  LogInfo(`Creating guild '${req.body.name}'`);
  const guild = new Guild({ ...req.body });
  guild
    .save()
    .then(() => res.status(201).json({ message: "Guild created!" }))
    .catch((error) => res.status(400).json({ error }));
}

export function deleteGuild(req: Request, res: Response) {
  LogInfo(`Deleting guild '${req.params.id}'`);
  Guild.deleteOne({ guildId: req.params.id })
    .then(() => res.status(200).json({ message: "Guild deleted!" }))
    .catch((error) => res.status(400).json({ error }));
}

export default { getGuild, createGuild, deleteGuild };
