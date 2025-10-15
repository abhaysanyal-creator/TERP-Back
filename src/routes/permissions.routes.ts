import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares.ts";
import { addPermissionController } from "../controllers/permission.controller.ts";
import { addPermissionsValidator } from "../validators/permissions.validator.ts";

const router = Router();

router.post("/create",authorisationMiddleware,addPermissionsValidator,addPermissionController)

export default router;