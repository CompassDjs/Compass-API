import { Express, NextFunction, Request, Response } from "express";
import { PassportStatic } from "passport";
import { initUser } from "@controllers/user.controller";
import IUser from "@interfaces/IUser";

const Strategy = require("passport-discord").Strategy;

export function DiscordAPI(app: Express, passport: PassportStatic) {
  passport.serializeUser(function (
    user: Express.User,
    done: (err: any, id?: any) => void
  ) {
    done(null, user);
  });
  passport.deserializeUser(function (
    obj: object,
    done: (err: any, id?: any) => void
  ) {
    done(null, obj);
  });

  const scopes = ["identify", "guilds", "guilds.members.read"];
  const prompt = "consent";

  passport.use(
    new Strategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_REDIRECT_URL,
        scope: scopes,
        prompt: prompt,
      },
      function (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any
      ) {
        process.nextTick(function () {
          const tokens = {
            accessToken: accessToken,
            refreshToken: refreshToken,
          };
          const profileData = {
            userId: profile.id,
            username: profile.username,
            avatarUrl:
              "https://cdn.discordapp.com/avatars/" +
              profile.id +
              "/" +
              profile.avatar +
              ".png",
            bannerUrl:
              "https://cdn.discordapp.com/banners/" +
              profile.id +
              "/" +
              profile.banner +
              ".png",
            nitro: profile.premium_type,
            locale: profile.locale,
          };

          initUser(
            { ...tokens, ...profileData } as IUser,
            profile.public_flags
          );
          return done(null, profile);
        });
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.get(
    "/",
    passport.authenticate("discord", { scope: scopes, prompt: prompt }),
    function (_req: Request, _res: Response) {}
  );
  app.get(
    "/api/auth",
    passport.authenticate("discord", {
      failureRedirect: process.env.FRONTEND_URL!,
    }),
    function (req: Request, res: Response) {
      res.redirect("/api/auth/user");
    }
  );

  app.get(
    "/api/auth/user",
    checkAuth,
    function (req: Request, res: Response, next: NextFunction) {
      if (req.cookies.user) {
        res.redirect(process.env.FRONTEND_URL!);
      } else {
        res.cookie("user", req.user, { maxAge: 900000, httpOnly: true });
        res.redirect(process.env.FRONTEND_URL!);
      }
      next();
    }
  );
}

function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Not authenticated" });
}
