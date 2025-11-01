import { Router } from "express";
import {
  createSpecialisationValidator,
  deleteSpecialisationValidator,
  listCitiesValidator,
  listStatesValidator,
  updateSpecialisationValidator,
  uploadDocumentsValidator,
} from "../validators/reference.validator";
import {
  createSpecialisationController,
  listCitiesController,
  listCountriesController,
  listSpecialisationController,
  listStatesController,
  listEnumsController,
  deleteSpecialisationController,
  updateSpecialisationController,
} from "../controllers/reference.controller";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import { uploadDocumentController } from "../controllers/upload.controller";

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

router.patch(
  "/specialisation/update/:id",
  authorisationMiddleware,
  updateSpecialisationValidator,
  updateSpecialisationController
);

router.post(
  "/specialisation/list",
  authorisationMiddleware,
  listSpecialisationController
);

router.delete(
  "/specialisation/delete/:id",
  authorisationMiddleware,
  deleteSpecialisationValidator,
  deleteSpecialisationController
);

router.post(
  "/s3Upload",
  authorisationMiddleware,
  uploadDocumentsValidator,
  uploadDocumentController
);

router.post("/enums", authorisationMiddleware, listEnumsController);

export default router;
