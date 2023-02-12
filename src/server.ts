import passport from "passport";
import http from "http";
import app from "./app";
import db from "@utils/db";
import { DiscordAPI } from "@utils/discord";
import session from "express-session";
import * as dotenv from "dotenv";
dotenv.config();

// normalize the port, return a valid port number
const normalizePort = (val: string) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.API_PORT || "3000");
app.set("port", port);

const errorHandler = (error: any) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (
    error.code // list of error.code possible: https://nodejs.org/api/errors.html#errors_common_system_errors
  ) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
    case "ECONNREFUSED":
      console.error(bind + " connection is refused.");
      process.exit(1);
    case "ECONNRESET":
      console.error(bind + " connection as been reset by a peer.");
      process.exit(1);
    default:
      throw error;
  }
};

const server = http.createServer(app); // create the server

// listeners
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("🌐 Listening on " + bind);
});

const SequelizeStore = require("connect-session-sequelize")(session.Store);

function extendDefaultFields(defaults: any, session: any) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.passport.user.id,
  };
}

const store = new SequelizeStore({
  db: db.sequelize,
  table: "sessions",
  extendDefaultFields: extendDefaultFields,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
store.sync();

(async () => {
  try {
    await db.sequelize.sync();
    DiscordAPI(app, passport);
    server.listen(process.env.API_PORT || 3000);
  } catch (error) {
    console.error(error);
  }
})();

export default server;
