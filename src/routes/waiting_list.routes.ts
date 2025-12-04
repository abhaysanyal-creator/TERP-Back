import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import { createEntryValidator, listEntryValidator, viewEntryValidator } from "../validators/waiting_list.validator";
import { createEntryController, listEntryController, viewEntryController } from "../controllers/waiting_list.controller";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  createEntryValidator,
  createEntryController
);

router.post(
  "/list",
  authorisationMiddleware,
  listEntryValidator,
  listEntryController
);

router.post(
  "/view/:id",
  authorisationMiddleware,
  viewEntryValidator,
  viewEntryController
);

export default router;
