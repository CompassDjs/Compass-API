import express from "express";
import cors from "cors";
import db from "@utils/db";
import * as dotenv from "dotenv";
dotenv.config();

db.sequelize.sync();

const app = express();
app.use(express.json());
app.use(cors());

// Ping route
app.get("/api/ping", (_req, res) => {
  return res.status(200).send("🏓 Pong!");
});

// Routes
import userRoutes from "@routes/user.routes";
import channelRoutes from "@routes/channels.routes";
import statsRoutes from "@routes/stats.routes";

app.use("/api/users", userRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/stats", statsRoutes);

export default app;
