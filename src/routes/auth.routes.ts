import { Router } from "express";
import { loginValidator } from "../validators/auth.validator.ts";
import {
  loginController,
  verifyOtpController,
} from "../controllers/auth.controller.ts";

const router = Router();

router.post("/login", loginValidator, loginController);
router.post("/verify-otp", verifyOtpController);

export default router;
