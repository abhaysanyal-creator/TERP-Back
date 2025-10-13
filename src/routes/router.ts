import { Router } from "express";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import roleRoutes from "./roles.routes.js";
import permissionRoutes from "./permissions.routes.js";
import employeeRoutes from "./employee.routes.js";
import organisationRoutes from "./organisation.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/employee", employeeRoutes);
router.use("/organisation", organisationRoutes);

export default router;
