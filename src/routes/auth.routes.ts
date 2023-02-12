import express from "express";
const router = express.Router();

import { AuthStatus, Logout } from "@controllers/auth.controller";

router.get("/status", AuthStatus);
router.get("/logout", Logout);

export default router;
