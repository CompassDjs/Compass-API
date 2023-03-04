import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "@swaggerFile";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());

// Ping route
app.get("/api/ping", (_req, res) => {
  return res.status(200).send("🏓 Pong!");
});

// Routes
import userRoutes from "@routes/user.routes";
import guildRoutes from "@routes/guild.routes";
import channelRoutes from "@routes/channels.routes";
import statsRoutes from "@routes/stats.routes";
import authRoutes from "@routes/auth.routes";
import discordRoutes from "@routes/discord.routes";

app.use("/api/users", userRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/guilds", guildRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/discord", discordRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default app;
