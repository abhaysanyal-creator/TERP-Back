import { Router } from "express";
import authRoutes from "./auth.routes";
import adminRoutes from "./admin.routes";
import roleRoutes from "./roles.routes";
import permissionRoutes from "./permissions.routes";
import employeeRoutes from "./employee.routes";
import organisationRoutes from "./organisation.routes";
import patientRoutes from "./patients.routes";
import clinicRoutes from "./clinics.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/employee", employeeRoutes);
router.use("/organisations", organisationRoutes);
router.use("/patients", patientRoutes);
router.use("/clinics",clinicRoutes)

export default router;
