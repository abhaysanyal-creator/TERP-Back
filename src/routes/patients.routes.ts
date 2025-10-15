import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares.ts";
import {
  createPatientValidator,
  deletePatientValidator,
  updatePatientValidator,
  viewPatientValidator,
} from "../validators/patients.validator.ts";
import {
  createPatientController,
  deletePatientController,
  updatePatientController,
  viewPatientController,
} from "../controllers/patients.controller.ts";

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

export default router;