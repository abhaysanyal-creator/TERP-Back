import { Router } from "express";
import {
  createSpecialisationValidator,
  getCitiesValidator,
  listStatesValidator,
} from "../validators/reference.validator";
import {
  createSpecialisationController,
  listCountriesController,
  listStatesController,
} from "../controllers/reference.controller";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.post("/countries", listCountriesController);
router.post("/states", listStatesValidator, listStatesController);
router.post("/cities", getCitiesValidator);
router.post(
  "/specialisation/create",
  authorisationMiddleware,
  createSpecialisationValidator,
  createSpecialisationController
);
export default router;
