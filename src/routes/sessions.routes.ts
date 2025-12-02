import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  createAppointmentValidator,
  listAppointmentsValidator,
  updateAppointmentsValidator,
  updateSessionsStatusValidator,
  viewAppointmentValidator,
} from "../validators/sessions.validator";
import {
  createAppointmentController,
  listAppointmentController,
  updateAppointmentsController,
  updateSessionStatusController,
  viewAppointmentController,
} from "../controllers/sessions.controller";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  createAppointmentValidator,
  createAppointmentController
);

router.get(
  "/view/:id",
  authorisationMiddleware,
  viewAppointmentValidator,
  viewAppointmentController
);

router.patch(
  "/update/:id",
  authorisationMiddleware,
  updateAppointmentsValidator,
  updateAppointmentsController
);

router.patch(
  "/change-status/:id",
  authorisationMiddleware,
  updateSessionsStatusValidator,
  updateSessionStatusController
);

router.post(
  "/list",
  authorisationMiddleware,
  listAppointmentsValidator,
  listAppointmentController
);

router.post(
  "/add-compensatory-session/:id",
  authorisationMiddleware,
  listAppointmentsValidator,
  listAppointmentController
);

export default router;
