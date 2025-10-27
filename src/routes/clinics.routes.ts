import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  createClinicController,
  deleteClinicController,
  listClinicController,
  updateClinicController,
  viewClinicController,
} from "../controllers/clinic.controller";
import {
  createClinicValidator,
  deleteClinicValidator,
  listClinicValidator,
  updateClinicValidator,
  viewClinicValidator,
} from "../validators/clinic.validator";

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
  "/update",
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

export default router;
