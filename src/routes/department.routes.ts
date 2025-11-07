import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  createOrganisationController,
  listOrganisationController,
  updateOrganisationController,
  viewOrganisationController,
} from "../controllers/organisation.controller";
import {
  createOrganisationValidator,
  listOrganisationValidator,
  updateOrganisationValidator,
  viewOrganisationValidator,
} from "../validators/organisation.validator";
import { createDeptValidator, updateDepartmentValidator } from "../validators/department.validator";
import { createDeptController, listDeptController, updateDeptController, viewDeptController } from "../controllers/department.controller";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  createDeptValidator,
  createDeptController
);

router.get(
  "/view/:id",
  authorisationMiddleware,
  viewOrganisationValidator,
  viewDeptController
);

router.patch(
  "/update/:id",
  authorisationMiddleware,
  updateDepartmentValidator,
  updateDeptController
);

// router.delete(
//   "/delete/:id",
//   authorisationMiddleware,
//   deleteOrganisationValidator,
//   deleteOrganisationController
// );

router.post(
  "/list",
  authorisationMiddleware,
  listOrganisationValidator,
  listDeptController
);

// router.patch(
//   "/change-operating-hours",
//   authorisationMiddleware,
//   changeOperatingHoursOrganisationValidator,
//   changeOperatingHoursOrganisationController
// );

export default router;
