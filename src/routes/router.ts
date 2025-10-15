import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import adminRoutes from "./admin.routes.ts";
import roleRoutes from "./roles.routes.ts";
import permissionRoutes from "./permissions.routes.ts";
import employeeRoutes from "./employee.routes.ts";
import organisationRoutes from "./organisation.routes.ts";
import patientRoutes from "./patients.routes.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/employee", employeeRoutes);
router.use("/organisations", organisationRoutes);
router.use("/patients", patientRoutes);

export default router;
