import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  createActivityController,
  deleteActivityController,
  listActivityController,
  updateActivityController,
  viewActivityController,
} from "../controllers/activity.controller";
import {
  createActivityValidator,
  deleteClinicValidator,
  listClinicValidator,
  updateActivityValidator,
  viewActivityValidator,
} from "../validators/activity.validator";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  createActivityValidator,
  createActivityController
);

router.get(
  "/view/:id",
  authorisationMiddleware,
  viewActivityValidator,
  viewActivityController
);

router.patch(
  "/update/:id",
  authorisationMiddleware,
  updateActivityValidator,
  updateActivityController
);

router.delete(
  "/delete/:id",
  authorisationMiddleware,
  deleteClinicValidator,
  deleteActivityController
);

router.post(
  "/list",
  authorisationMiddleware,
  listClinicValidator,
  listActivityController
);

export default router;
