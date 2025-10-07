import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares.js";
import { addPermissionController } from "../controllers/permission.controller.js";
import { addPermissionsValidator } from "../validators/permissions.validator.js";

const router = Router();

router.post("/add",authorisationMiddleware,addPermissionsValidator,addPermissionController)

export default router;