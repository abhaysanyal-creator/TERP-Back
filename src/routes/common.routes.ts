import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import { changeActiveStatusValidator } from "../validators/common.validator";
import { changeActiveStatusController } from "../controllers/common.controller";

const router = Router();

router.patch(
  "/change-status",
  authorisationMiddleware,
  changeActiveStatusValidator,
  changeActiveStatusController
);

export default router;
