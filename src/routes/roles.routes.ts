import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import {
  createRoomValidator,
  updateRoomValidator,
  viewRoomValidator,
} from "../validators/room.validator";
import {
  createRoomController,
  deleteRoomController,
  updateRoomController,
  viewRoomController,
} from "../controllers/room.controller";
import { listRolesValidator } from "../validators/roles.validator";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  createRoomValidator,
  createRoomController
);
router.post(
  "/view/:id",
  authorisationMiddleware,
  viewRoomValidator,
  viewRoomController
);
router.post(
  "/update",
  authorisationMiddleware,
  updateRoomValidator,
  updateRoomController
);
router.delete(
  "/delete",
  authorisationMiddleware,
  viewRoomValidator,
  deleteRoomController
);

router.delete(
  "/list",
  authorisationMiddleware,
  listRolesValidator,
  deleteRoomController
);


export default router;
