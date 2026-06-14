import { Router } from "express";
import {
  deleteUser,
  getUserProfile,
  getUsers,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/userProfile/:id", getUserProfile);
router.delete("/deleteUser/:id", deleteUser);

export default router;
