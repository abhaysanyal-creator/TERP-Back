import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  addRecurringSessionsValidator,
  createAppointmentValidator,
  listAppointmentsValidator,
  updateAppointmentsValidator,
  updateSessionsStatusValidator,
  viewAppointmentValidator,
} from "../validators/sessions.validator";
import {
  addRecurringSessionsController,
  createAppointmentController,
  listAppointmentController,
  updateAppointmentsController,
  updateSessionStatusController,
  viewAppointmentController,
} from "../controllers/sessions.controller";
import { addEmployeeClinicValidator } from "../validators/activity.validator";

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
  // addRecurringSessionsValidator,
  addRecurringSessionsController
);

export default router;
