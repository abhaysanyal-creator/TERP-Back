import { Router } from "express";
import authRoutes from "./auth.routes";
import adminRoutes from "./admin.routes";
import roleRoutes from "./roles.routes";
import permissionRoutes from "./permissions.routes";
import employeeRoutes from "./employee.routes";
import organisationRoutes from "./organisation.routes";
import patientRoutes from "./patients.routes";
import activityRoutes from "./activity.routes";
import roomRoutes from "./rooms.routes";
import referenceRoutes from "./reference.routes";
import commonRoutes from "./common.routes";
import departmentRoutes from "./department.routes";
import sessionsRoutes from "./sessions.routes";
import clinicRoutes from "./clinic.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/employee", employeeRoutes);
router.use("/organisations", organisationRoutes);
router.use("/patients", patientRoutes);
router.use("/activity", activityRoutes);
router.use("/rooms", roomRoutes);
router.use("/reference", referenceRoutes);
router.use("/common", commonRoutes);
router.use("/departments", departmentRoutes);
router.use("/sessions", sessionsRoutes);
router.use("/clinics", clinicRoutes);

export default router;
