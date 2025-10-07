import { Router } from "express";
import { loginValidator } from "../validators/auth.validator.js";
import {
  loginController,
  verifyOtpController,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", loginValidator, loginController);
router.post("/verify-otp", verifyOtpController);

export default router;
