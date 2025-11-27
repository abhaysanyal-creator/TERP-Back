import { Router } from "express";
import {
  forgotPasswordValidator,
  loginValidator,
  resendCodeValidator,
  resetPasswordValidator,
} from "../validators/auth.validator";
import {
  forgotPasswordController,
  getMeController,
  loginController,
  resendOtpController,
  resetPasswordController,
  verifyOtpController,
} from "../controllers/auth.controller";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.post("/login", loginValidator, loginController);
router.post("/verify-otp", verifyOtpController);
router.get("/me", authorisationMiddleware, getMeController);
router.post("/resend-code", resendCodeValidator, resendOtpController);
router.post("/forgot-password", forgotPasswordValidator, forgotPasswordController);
router.post("/reset-password", resetPasswordValidator, resetPasswordController);
export default router;
