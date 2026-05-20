import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { receiveInventory } from "../controller/purchase.controller.js";

const purchaseRouter = Router();

purchaseRouter.post("/receive", authMiddleware, authorizeRoles("Admin", "Manager"), receiveInventory);

export default purchaseRouter;