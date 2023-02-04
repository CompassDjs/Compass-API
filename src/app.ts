import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

import userRoutes from "@routes/user.routes";
import guildRoutes from "@routes/guild.routes";

mongoose.set("strictQuery", false);
mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => console.log("🍀 Connected to MongoDB"))
  .catch((err) => console.log("❌ Failed to connect to MongoDB: " + err));

const app = express();
app.use(express.json());
app.use(cors());

// Ping route
app.get("/api/ping", (_req, res) => {
  return res.status(200).send("🏓 Pong!");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/guilds", guildRoutes);

export default app;
