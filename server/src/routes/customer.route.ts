import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { addCustomer, getCustomers } from "../controller/customer.controller.js";

const customerRouter = Router();

customerRouter.post("/add", authMiddleware, authorizeRoles("Admin", "Manager", "Employee"), addCustomer);
customerRouter.get("/", authMiddleware, getCustomers);

export default customerRouter;