import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares.ts";
import {
  changeOperatingHoursOrganisationController,
  createOrganisationController,
  deleteOrganisationController,
  listOrganisationController,
  updateOrganisationController,
  viewOrganisationController,
} from "../controllers/organisation.controller.ts";
import {
  changeOperatingHoursOrganisationValidator,
  createOrganisationValidator,
  deleteOrganisationValidator,
  listOrganisationValidator,
  updateOrganisationValidator,
  viewOrganisationValidator,
} from "../validators/organisation.validator.ts";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  createOrganisationValidator,
  createOrganisationController
);

router.get(
  "/view/:id",
  authorisationMiddleware,
  viewOrganisationValidator,
  viewOrganisationController
);

router.patch(
  "/update",
  authorisationMiddleware,
  updateOrganisationValidator,
  updateOrganisationController
);

router.delete(
  "/delete/:id",
  authorisationMiddleware,
  deleteOrganisationValidator,
  deleteOrganisationController
);

router.post(
  "/list",
  authorisationMiddleware,
  listOrganisationValidator,
  listOrganisationController
);

router.patch(
  "/change-operating-hours",
  authorisationMiddleware,
  changeOperatingHoursOrganisationValidator,
  changeOperatingHoursOrganisationController
);

export default router;
