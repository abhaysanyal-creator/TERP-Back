import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  createRoomValidator,
  updateRoomValidator,
  viewRoomValidator,
} from "../validators/room.validator";
import {
  createRoomController,
  updateRoomController,
  viewRoomController,
} from "../controllers/room.controller";

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
  updateRoomValidator,
  updateRoomController
);

router.delete(
  "/delete':id",
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

export default router;
