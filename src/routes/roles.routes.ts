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
import { addRolesValidator, listRolesValidator } from "../validators/roles.validator";
import { addRolesController } from "../controllers/roles.controller";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  addRolesValidator,
  addRolesController
);



export default router;
