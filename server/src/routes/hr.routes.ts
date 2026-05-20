import { Router } from "express";
import {applyLeave, getAllLeaveRequest, punchIn, punchOut, updateLeaveStatus} from "../controller/hr.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { generatePayroll } from "../controller/payroll.controller.js";

const hrRouter = Router();

hrRouter.post('/punch-in', authMiddleware, punchIn);
hrRouter.post('/punch-out', authMiddleware, punchOut);
hrRouter.post('/leave', authMiddleware, applyLeave);
hrRouter.post('/leave/:leaveId', authMiddleware, authorizeRoles("Admin", "Manager"), updateLeaveStatus);
hrRouter.get('/all-requests', authMiddleware, authorizeRoles("Admin", "Manager"), getAllLeaveRequest);
hrRouter.post('/payroll/generate', authMiddleware, authorizeRoles("Admin", "Manager"), generatePayroll);

export default hrRouter;