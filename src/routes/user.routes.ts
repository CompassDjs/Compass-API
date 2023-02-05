import express from "express";
const router = express.Router();

import UserController from "@controllers/user.controller";

router.get("/i/:id", UserController.getUser);
router.post("/add", UserController.createUser);
router.put("/i/:id", UserController.updateUser);
router.put("/i/voice/:guildId/:userId", UserController.updateUserVoiceTime);
router.put("/i/game/:guildId/:userId", UserController.updateUserGameTime);

export default router;
