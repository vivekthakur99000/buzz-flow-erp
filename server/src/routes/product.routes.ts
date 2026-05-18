import {Router}  from "express";
import {createProduct, getProducts} from "../controller/product.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {authorizeRoles} from "../middlewares/role.middleware.js"

const productRouter = Router();

productRouter.post('/', authMiddleware, authorizeRoles("Admin", "Manager"), createProduct);

productRouter.get('/', authMiddleware, getProducts);

export default productRouter;