import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import { createEntryValidator, listEntryValidator } from "../validators/waiting_list.validator";
import { createEntryController, listEntryController } from "../controllers/waiting_list.controller";

const router = Router();

router.post(
  "/waiting-list/create",
  authorisationMiddleware,
  createEntryValidator,
  createEntryController
);

router.post(
  "/waiting-list/list",
  authorisationMiddleware,
  listEntryValidator,
  listEntryController
);

export default router;
