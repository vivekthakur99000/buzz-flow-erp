import {Router} from "express";
import { addEmployeeProfile, getEmployeeProfile } from "../controller/employeeProfile.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const employeeProfileRouter = Router();

employeeProfileRouter.post('/', authMiddleware, addEmployeeProfile);
employeeProfileRouter.get('/:employeeId', authMiddleware, getEmployeeProfile);

export default employeeProfileRouter;