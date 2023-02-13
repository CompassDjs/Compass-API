import { Request, Response } from "express";
import db from "@utils/db";
import IUser from "@interfaces/IUser";

const User = db.users;
const Session = db.sessions;

export function AuthStatus(req: Request, res: Response) {
  if (req.cookies["connect.sid"] == undefined)
    return res.status(403).json({ message: "not logged in" });

  const sessionId = req.cookies["connect.sid"].split(":")[1].split(".")[0];
  Session.findOne({ where: { sid: sessionId } })
    .then((data: any) => {
      User.findOrCreate({
        where: { userId: data?.userId },
        defaults: {
          userId: data?.userId,
        },
      })
        .then((userData: any) => {
          const user: IUser = userData[0];

          res.status(200).json({ user });
        })
        .catch((error: Error) => {
          res.status(404).json({ error: error.message });
        });
    })
    .catch((error: Error) => {
      res
        .status(404)
        .json({ message: "not logged in\n", error: error.message });
    });
}

export function Logout(req: Request, res: Response) {
  Session.destroy({
    where: { sid: req.cookies["connect.sid"].split(":")[1].split(".")[0] },
  });
  res.clearCookie("connect.sid");
  res.status(200).json({ message: "logged out" });
}
