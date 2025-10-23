import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  changeBookingStatusValidator,
  createBookingsValidator,
  deleteBookingValidator,
  updateBookingValidator,
  viewBookingValidator,
} from "../validators/booking.validator";
import {
  createBookingController,
  updateBookingsController,
  viewBookingController,
} from "../controllers/booking.controller";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  createBookingsValidator,
  createBookingController
);

router.get(
  "/view/:id",
  authorisationMiddleware,
  viewBookingValidator,
  viewBookingController
);

router.patch(
  "/update",
  authorisationMiddleware,
  updateBookingValidator,
  updateBookingsController
);

router.delete(
  "/delete/:id",
  authorisationMiddleware,
  deleteBookingValidator,
  updateBookingsController
);

router.patch(
  "/change-status",
  authorisationMiddleware,
  changeBookingStatusValidator,
  updateBookingsController
);

export default router;
