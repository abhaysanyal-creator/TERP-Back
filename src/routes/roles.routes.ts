import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  addRolesValidator,
  listRolesValidator,
  updateRolesValidator,
} from "../validators/roles.validator";
import {
  addRolesController,
  listRolesController,
  updateRolesController,
} from "../controllers/roles.controller";
import { updateOrganisationValidator } from "../validators/organisation.validator";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  addRolesValidator,
  addRolesController
);

router.post(
  "/list",
  authorisationMiddleware,
  listRolesValidator,
  listRolesController
);

router.patch(
  "/update/:id",
  authorisationMiddleware,
  updateRolesValidator,
  updateRolesController
);

export default router;
