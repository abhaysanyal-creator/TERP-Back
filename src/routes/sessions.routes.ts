import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  changeBookingStatusValidator,
  createAppointmentValidator,
  deleteBookingValidator,
  updateBookingValidator,
  viewAppointmentValidator,
} from "../validators/sessions.validator";
import {
  createAppointmentController,
  updateBookingsController,
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

export default router;
