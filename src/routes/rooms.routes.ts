import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import { createRoomValidator, viewRoomValidator } from "../validators/room.validator";
import { createRoomController, viewRoomController } from "../controllers/room.controller";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  createRoomValidator,
  createRoomController
);

router.get(
  "/view/:id",
  authorisationMiddleware,
  viewRoomValidator,
  viewRoomController
);

router.patch(
  "/update",
  authorisationMiddleware,
  createRoomValidator,
  createRoomController
);

router.delete(
  "/create",
  authorisationMiddleware,
  createRoomValidator,
  createRoomController
);

router.post(
  "/list",
  authorisationMiddleware,
  createRoomValidator,
  createRoomController
);