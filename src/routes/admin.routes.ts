import { Router } from "express";
import {
  adminCreateValidator,
  updateAdminValidator,
  viewAdminValidator,
} from "../validators/admin.validator";
import {
  adminCreateController,
  listAdminController,
  updateAdminController,
  viewAdminController,
} from "../controllers/admin.controller";
import { authorisationMiddleware } from "../middlewares/auth.middlewares";
import { listEmployeeValidator } from "../validators/employee.validator";
import { requireScope } from "../middlewares/scope.middlewares";
import axios from "axios";
import Constants from "../locales/constants";

const router = Router();

router.post(
  "/create",
  authorisationMiddleware,
  adminCreateValidator,
  adminCreateController
);

router.get(
  "/view/:id",
  authorisationMiddleware,
  viewAdminValidator,
  viewAdminController
);

router.patch(
  "/update/:id",
  authorisationMiddleware,
  updateAdminValidator,
  updateAdminController
);

router.post(
  "/list",
  authorisationMiddleware,
  listEmployeeValidator,
  listAdminController
);

router.get(
  "/audit/logs",
  authorisationMiddleware,
  requireScope("audit.view"),
  async (request, response) => {
    try {
      const { resource_type, resource_id, actor_id } = request.query;

      const result = await axios.get(
        `${process.env.AUDIT_SERVICE_URL}/audit/logs`,
        {
          params: { resource_type, resource_id, actor_id },
          headers: {
            Authorization: request.headers.authorization,
          },
        }
      );

      return response.json(result.data);
    } catch (error: any) {
      console.error("Error fetching audit logs:", error.message);
      return response
        .status(500)
        .json(Constants.MESSAGES.ERROR_FETCHING_AUDIT_LOG.code);
    }
  }
);

export default router;
