import expess, { Router } from "express";
import {
  getNewAccessToken,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refreshToken", getNewAccessToken);
router.post("/logout", logout);

export default router;
