import { Router } from "express";
import { createOrder, getOrders, getDashboardStats } from "../controller/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const orderRouter = Router();

orderRouter.post("/create",authMiddleware, createOrder);
orderRouter.get("/",authMiddleware, getOrders);
orderRouter.get("/dashboard", authMiddleware, authorizeRoles("Admin", "Manager"), getDashboardStats);

export default orderRouter;