import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import { createRoomValidator } from "../validators/room.validator";
import { createRoomController } from "../controllers/room.controller";

const router = Router();

router.post("/create",authorisationMiddleware,createRoomValidator,createRoomController)
