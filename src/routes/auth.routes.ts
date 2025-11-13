import { Router } from "express";
import { loginValidator } from "../validators/auth.validator";
import {
  getMeController,
  loginController,
  verifyOtpController,
} from "../controllers/auth.controller";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.post("/login", loginValidator, loginController);
router.post("/verify-otp", verifyOtpController);
router.get("/me",authorisationMiddleware,getMeController)

export default router;
