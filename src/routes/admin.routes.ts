import { Router } from "express";
import {
  adminCreateValidator,
  viewAdminValidator,
} from "../validators/admin.validator";
import {
  adminCreateController,
  viewAdminController,
} from "../controllers/admin.controller";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  adminCreateValidator,
  adminCreateController
);

router.get(
  "/view/:id",
  authorisationMiddleware,
  viewAdminValidator,
  viewAdminController
);

export default router;
