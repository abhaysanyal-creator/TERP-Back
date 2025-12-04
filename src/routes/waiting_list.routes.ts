import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import { createEntryValidator, listEntryValidator, viewEntryValidator } from "../validators/waiting_list.validator";
import { createEntryController, deleteEntryController, getDemandInsightsController, listEntryController, viewEntryController } from "../controllers/waiting_list.controller";

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

router.get(
  "/view/:id",
  authorisationMiddleware,
  viewEntryValidator,
  viewEntryController
);

router.delete(
  "/delete/:id",
  authorisationMiddleware,
  viewEntryValidator,
  deleteEntryController
);

router.post(
  "/demand-insights",
  authorisationMiddleware,
  getDemandInsightsController
);

export default router;
