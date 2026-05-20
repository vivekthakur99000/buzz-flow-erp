import { type Application, Router } from "express";
import {addSupplier, getAllSupplier} from "../controller/supplier.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const supplierRouter = Router();

supplierRouter.post("/create", authMiddleware, authorizeRoles("Admin", "Manager") ,addSupplier);
supplierRouter.get("/", authMiddleware, getAllSupplier);


export default supplierRouter;