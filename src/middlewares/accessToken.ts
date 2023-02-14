import { Response } from "express";
import { NextFunction } from "express";
import { decrypt } from "@utils/crypto";
import IUser from "@interfaces/IUser";
import ISession from "@interfaces/ISession";
import db from "@utils/db";

const Session = db.sessions;
const User = db.users;

export default (req: any, res: Response, next: NextFunction) => {
  if (!req.cookies["connect.sid"])
    return res.status(401).json({ error: "No cookie provided" });
  req.cookies = req.cookies["connect.sid"].split(".")[0].split(":")[1];

  Session.findOne({ where: { sid: req.cookies } })
    .then((sessionData: any) => {
      const session: ISession = sessionData.get({ plain: true });
      User.findOne({ where: { userId: session.userId } })
        .then((userData: any) => {
          const user: IUser = userData.get({ plain: true });
          req.tokens = {
            accessToken: user.accessToken ? decrypt(user.accessToken) : null,
          };
          next();
        })
        .catch(() => {
          return res.status(404).json({ message: "User not found" });
        });
    })
    .catch(() => {
      return res.status(404).json({ message: "Session not found" });
    });
};
