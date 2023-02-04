import express from "express";
const router = express.Router();

import UserController from "@controllers/user.controller";

router.get("/i/:id", UserController.getUser);
router.post("/add", UserController.createUser);
router.put("/i/:id", UserController.updateUser);
router.put("/i/voice/:id", UserController.updateUserVoiceTime);

export default router;
