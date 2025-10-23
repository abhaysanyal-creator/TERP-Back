import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  changeWorkingHoursEmployeeValidator,
  createEmployeeValidator,
  deleteEmployeeValidator,
  listEmployeeValidator,
  updateEmployeeValidator,
  viewEmployeeValidator,
} from "../validators/employee.validator";
import {
  changeWorkingHoursEmployeeController,
  createEmployeeController,
  deleteEmployeeController,
  listEmployeeController,
  updateEmployeeController,
  viewEmployeeController,
} from "../controllers/employee.controller";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  createEmployeeValidator,
  createEmployeeController
);

router.get(
  "/view/:id",
  authorisationMiddleware,
  viewEmployeeValidator,
  viewEmployeeController
);

router.put(
  "/update/:id",
  authorisationMiddleware,
  updateEmployeeValidator,
  updateEmployeeController
);

router.delete(
  "/delete/:id",
  authorisationMiddleware,
  deleteEmployeeValidator,
  deleteEmployeeController
);

router.patch(
  "/change-working-hours",
  authorisationMiddleware,
  changeWorkingHoursEmployeeValidator,
  changeWorkingHoursEmployeeController
);

router.post(
  "/list",
  authorisationMiddleware,
  listEmployeeValidator,
  listEmployeeController
);

export default router;
