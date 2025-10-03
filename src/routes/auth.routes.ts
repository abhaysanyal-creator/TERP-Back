import { Router } from "express";
import { loginValidator } from "../validators/auth.validator.js";
import { loginController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", loginValidator, loginController);

export default router;