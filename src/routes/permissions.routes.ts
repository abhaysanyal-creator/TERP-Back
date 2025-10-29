import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import { assignPermissionController, listPermissionController } from "../controllers/permission.controller";
import { checkPermissions } from "../middlewares/check-permission";
import { assignPermissionsValidator } from "../validators/permissions.validator";

const router = Router();

router.post("/list", authorisationMiddleware, listPermissionController);
router.patch(
  "/manage-permissions",
  authorisationMiddleware,
  checkPermissions("permissions.manage"),
  assignPermissionsValidator,
  assignPermissionController
);

export default router;
