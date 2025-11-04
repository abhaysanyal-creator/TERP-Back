import { request, response, Response, Router } from "express";
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
  "/meta-data/:type/create",
  authorisationMiddleware,
  createSpecialisationValidator,
  (request, response) => {
    const type = request.params.type.toLowerCase();
    createSpecialisationController(request, response, type);
  }
  // createSpecialisationController(request:request, response:response, "DISABILITY")
);

router.patch(
  "/meta-data/:type/update/:id",
  authorisationMiddleware,
  (request, response) => {
    const type = request.params.type.toLowerCase();
    updateSpecialisationController(request, response, type);
  }
);

router.post(
  "/meta-data/list",
  authorisationMiddleware,
  listSpecialisationController
);

router.delete(
  "/meta-data/delete/:id",
  authorisationMiddleware,
  deleteSpecialisationValidator,
  deleteSpecialisationController
);

// router.post(
//   "/allergies/create",
//   authorisationMiddleware,
//   createSpecialisationValidator,
//   createSpecialisationController
// );

// router.patch(
//   "/allergies/update/:id",
//   authorisationMiddleware,
//   updateSpecialisationValidator,
//   updateSpecialisationController
// );

// router.post(
//   "/allergies/list",
//   authorisationMiddleware,
//   listSpecialisationController
// );

// router.delete(
//   "/allergies/delete/:id",
//   authorisationMiddleware,
//   deleteSpecialisationValidator,
//   deleteSpecialisationController
// );

router.post(
  "/s3Upload",
  authorisationMiddleware,
  uploadDocumentsValidator,
  uploadDocumentController
);

router.post("/enums", authorisationMiddleware, listEnumsController);

export default router;
