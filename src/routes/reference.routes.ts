import { Router } from "express";
import {
  getCitiesValidator,
  listStatesValidator,
} from "../validators/reference.validator";
import {
  listCountriesController,
  listStatesController,
} from "../controllers/reference.controller";

const router = Router();

router.post("/countries", listCountriesController);
router.post("/states", listStatesValidator, listStatesController);
router.post("/cities", getCitiesValidator);

export default router;
