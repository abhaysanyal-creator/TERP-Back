import { Router } from "express";
import {
  addRolesValidator,
  updateRolesValidator,
} from "../validators/roles.validator.ts";
import { addRolesController } from "../controllers/roles.controller.ts";
import { authorisationMiddleware } from "../middlewares/auth.middlewares.ts";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  addRolesValidator,
  addRolesController
);
router.post(
  "/view/:id",
  authorisationMiddleware,
  addRolesValidator,
  addRolesController
);
router.post(
  "/update/:id",
  authorisationMiddleware,
  updateRolesValidator,
  updateRolesValidator
);

export default router;
