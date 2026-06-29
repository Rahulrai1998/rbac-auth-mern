import { Router } from "express";
import {
  deleteUser,
  getUserProfile,
  getUsers,
} from "../controllers/user.controller.js";
import { verifyToken, verifyUserRole } from "../middleware/authMiddleware.js";

const router = Router();

//we pass middleware to protect users route. here, only admin can access the users list.
router.get("/", verifyToken, verifyUserRole("admin"), getUsers);
router.get("/my-profile", verifyToken, getUserProfile);
router.delete(
  "/delete-user/:id",
  verifyToken,
  verifyUserRole("admin"),
  deleteUser,
);

export default router;
