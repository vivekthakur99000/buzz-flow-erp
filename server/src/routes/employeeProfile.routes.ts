import {Router} from "express";
import { addEmployeeProfile, getEmployeeProfile, getAllEmployeeProfiles } from "../controller/employeeProfile.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const employeeProfileRouter = Router();

employeeProfileRouter.post('/add', authMiddleware, authorizeRoles('Admin', "Manager"), addEmployeeProfile);
employeeProfileRouter.get('/me', authMiddleware, getEmployeeProfile);
employeeProfileRouter.get('/', authMiddleware, authorizeRoles('Admin', "Manager"), getAllEmployeeProfiles);

export default employeeProfileRouter;