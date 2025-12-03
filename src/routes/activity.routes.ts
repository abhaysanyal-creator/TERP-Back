import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  addEmployeeActivityController,
  addIndexPriceController,
  createActivityController,
  createExpenseController,
  deleteActivityController,
  deleteExpenseController,
  listActivityController,
  updateActivityController,
  updateExpenseController,
  viewActivityController,
} from "../controllers/activity.controller";
import {
  addEmployeeClinicValidator,
  addIndexPriceValidator,
  createActivityValidator,
  createExpenseValidator,
  deleteClinicValidator,
  deleteExpenseValidator,
  listClinicValidator,
  updateActivityValidator,
  updateExpenseValidator,
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

router.post(
  "/add-expense/:id",
  authorisationMiddleware,
  // createExpenseValidator,
  createExpenseController
);

router.patch(
  "/update-expense/:id/:exp_id",
  authorisationMiddleware,
  updateExpenseValidator,
  updateExpenseController
);

router.delete(
  "/delete-expense/:id/:exp_id",
  authorisationMiddleware,
  deleteExpenseValidator,
  deleteExpenseController
);

router.patch(
  "/:id/add-employee",
  authorisationMiddleware,
  // addEmployeeClinicValidator,
  addEmployeeActivityController
);

router.patch(
  "/:id/add-index-price",
  authorisationMiddleware,
  addIndexPriceValidator,
  addIndexPriceController
);

export default router;
