import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import { createEntryValidator } from "../validators/waiting_list.validator";
import { createEntryController } from "../controllers/waiting_list.controller";

const router = Router();

router.post(
  "/waiting-list",
  authorisationMiddleware,
  createEntryValidator,
  createEntryController
);

export default router;
