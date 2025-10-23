import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import { addPermissionController } from "../controllers/permission.controller";
import { addPermissionsValidator } from "../validators/permissions.validator";

const router = Router();

router.post("/create",authorisationMiddleware,addPermissionsValidator,addPermissionController)

export default router;