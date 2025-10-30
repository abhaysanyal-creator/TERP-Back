import { Router } from "express";
import {
  adminCreateValidator,
  viewAdminValidator,
} from "../validators/admin.validator";
import {
  adminCreateController,
  listAdminController,
  viewAdminController,
} from "../controllers/admin.controller";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import { listEmployeeValidator } from "../validators/employee.validator";

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

router.post(
  "/list",
  authorisationMiddleware,
  listEmployeeValidator,
  listAdminController
);

export default router;
