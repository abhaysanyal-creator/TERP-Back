import { Router } from "express";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.post("/create",authorisationMiddleware,)