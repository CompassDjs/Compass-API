import { Request, Response } from "express";
import { LogCreate, LogDelete, LogUpdate, LogGet } from "@utils/logger";
import IChannel from "@interfaces/IChannel";
import db from "@utils/db";

const Channel = db.channels;

export function getChannel(req: Request, res: Response) {
  LogGet(`Getting channel '${req.params.channelId}'`);
  Channel.findOne({ where: { channelId: req.params.channelId } })
    .then((channel: IChannel) => res.status(200).json(channel))
    .catch((error: Error) => res.status(404).json({ error }));
}

export function createChannel(req: Request, res: Response) {
  LogCreate(`Creating channel '${req.body.channelId}'`);
  Channel.create({ ...req.body })
    .then(() => res.status(201).json({ message: "Channel created!" }))
    .catch((error: Error) => res.status(400).json({ error: error.message }));
}

export function updateChannel(req: Request, res: Response) {
  LogUpdate(`Updating channel '${req.params.channelId}'`);
  Channel.update(
    { ...req.body },
    { where: { channelId: req.params.channelId } }
  )
    .then(() => res.status(200).json({ message: "Channel updated!" }))
    .catch(() => res.status(404).json({ error: "Channel not found" }));
}
