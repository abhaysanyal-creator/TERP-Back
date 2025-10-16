import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import { createClinicController } from "../controllers/clinic.controller";
import { createClinicValidator, viewClinicValidator } from "../validators/clinic.validator";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  createClinicValidator,
  createClinicController
);

router.get("/view",authorisationMiddleware,viewClinicValidator)

export default router;