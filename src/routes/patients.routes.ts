import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  createPatientValidator,
  deletePatientValidator,
  updatePatientValidator,
  viewPatientValidator,
} from "../validators/patients.validator";
import {
  createPatientController,
  deletePatientController,
  listPatientController,
  updatePatientController,
  viewPatientController,
} from "../controllers/patients.controller";
import { listOrganisationValidator } from "../validators/organisation.validator";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  createPatientValidator,
  createPatientController
);

router.get(
  "/view/:id",
  authorisationMiddleware,
  viewPatientValidator,
  viewPatientController
);

router.patch(
  "/update",
  authorisationMiddleware,
  updatePatientValidator,
  updatePatientController
);

router.delete(
  "/delete/:id",
  authorisationMiddleware,
  deletePatientValidator,
  deletePatientController
);

router.post(
  "/list",
  authorisationMiddleware,
  listOrganisationValidator,
  listPatientController
);

export default router;