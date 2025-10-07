import { Router } from "express";
import {
  adminCreateValidator,
  viewAdminValidator,
} from "../validators/admin.validator.js";
import {
  adminCreateController,
  viewAdminController,
} from "../controllers/admin.controller.js";
import { authorisationMiddleware } from "../middlewares/auth.middlewares.js";

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
