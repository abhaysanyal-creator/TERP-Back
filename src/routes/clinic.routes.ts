import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  deleteClinicValidator,
  listClinicValidator,
} from "../validators/activity.validator";
import {
  addEmployeeClinicValidator,
  createClinicValidator,
  updateClinicValidator,
  viewClinicValidator,
} from "../validators/clinic.validator";
import {
  addEmployeeClinicController,
  createClinicController,
  deleteClinicController,
  listClinicController,
  updateClinicController,
  viewClinicController,
} from "../controllers/clinic.controller";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  createClinicValidator,
  createClinicController
);

router.get(
  "/view/:id",
  authorisationMiddleware,
  viewClinicValidator,
  viewClinicController
);

router.patch(
  "/update/:id",
  authorisationMiddleware,
  updateClinicValidator,
  updateClinicController
);

router.delete(
  "/delete/:id",
  authorisationMiddleware,
  deleteClinicValidator,
  deleteClinicController
);

router.post(
  "/list",
  authorisationMiddleware,
  listClinicValidator,
  listClinicController
);

router.patch(
  "/:id/add-employee",
  authorisationMiddleware,
  addEmployeeClinicValidator,
  addEmployeeClinicController
);

export default router;
