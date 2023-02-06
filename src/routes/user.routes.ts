import express from "express";
const router = express.Router();

import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "@controllers/user.controller";

router.get("/i/:userId", getUser);
router.post("/add", createUser);
router.put("/i/:userId", updateUser);
router.delete("/i/:userId", deleteUser);

export default router;
