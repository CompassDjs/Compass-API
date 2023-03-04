import express from "express";
const router = express.Router();

import {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@controllers/user.controller";

router.get("/i/:userId", getUser);
//TODO: remove this route
router.get("/all", getUsers);
router.post("/add", createUser);
router.put("/i/:userId", updateUser);
router.delete("/i/:userId", deleteUser);

export default router;
