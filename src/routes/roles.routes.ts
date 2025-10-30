import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  addRolesValidator,
  listRolesValidator,
} from "../validators/roles.validator";
import {
  addRolesController,
  listRolesController,
} from "../controllers/roles.controller";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  addRolesValidator,
  addRolesController
);

router.post(
  "/list",
  authorisationMiddleware,
  listRolesValidator,
  listRolesController
);

export default router;
