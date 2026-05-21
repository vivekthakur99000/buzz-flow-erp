import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { getMasterDashboard } from "../controller/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/", authMiddleware, authorizeRoles("Admin", "Manager"), getMasterDashboard);

export default dashboardRouter;