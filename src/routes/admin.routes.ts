import { Router } from "express";
import {
  adminCreateValidator,
  viewAdminValidator,
} from "../validators/admin.validator.ts";
import {
  adminCreateController,
  viewAdminController,
} from "../controllers/admin.controller.ts";
import { authorisationMiddleware } from "../middlewares/auth.middlewares.ts";

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
