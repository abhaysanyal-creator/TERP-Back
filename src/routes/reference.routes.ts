import { Router } from "express";
import {
  createSpecialisationValidator,
  listCitiesValidator,
  listStatesValidator,
} from "../validators/reference.validator";
import {
  createSpecialisationController,
  listCitiesController,
  listCountriesController,
  listSpecialisationController,
  listStatesController,
  listEnumsController
} from "../controllers/reference.controller";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.post("/countries", listCountriesController);

router.post("/states", listStatesValidator, listStatesController);

router.post("/cities", listCitiesValidator, listCitiesController);

router.post(
  "/specialisation/create",
  authorisationMiddleware,
  createSpecialisationValidator,
  createSpecialisationController
);

router.post(
  "/specialisation/list",
  authorisationMiddleware,
  listSpecialisationController
);

router.post(
  "/enums",
  authorisationMiddleware,
  listEnumsController
);

export default router;
