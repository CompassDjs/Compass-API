import { Request, Response } from "express";
import { LogCreate, LogDelete, LogGet } from "@utils/logger";
import db from "@utils/db";
import IGuild from "@interfaces/IGuild";

const Guild = db.guilds;

export function getGuild(req: Request, res: Response) {
  LogGet(`Guild '${req.params.guildId}'`);
  Guild.findOne({ where: { guildId: req.params.guildId } })
    .then((guild: IGuild) => res.status(200).json(guild))
    .catch((error: Error) => res.status(404).json({ error }));
}

export function createGuild(req: Request, res: Response) {
  LogCreate(`Creating guild '${req.body.id}'`);
  Guild.create({ ...req.body })
    .then(() => res.status(201).json({ message: "Guild created!" }))
    .catch((error: Error) => res.status(400).json({ error: error.message }));
}

export function deleteGuild(req: Request, res: Response) {
  LogDelete(`Deleting guild '${req.params.guildId}'`);
  Guild.destroy({ where: { guildId: req.params.guildId } })
    .then(() => res.status(200).json({ message: "Guild deleted!" }))
    .catch(() => res.status(404).json({ error: "Guild not found" }));
}
