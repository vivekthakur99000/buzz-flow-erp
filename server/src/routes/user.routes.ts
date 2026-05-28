import { Router } from "express";
import { createUser, getCompanyUsers, getUserProfile, loginUser, registerWorkspace } from "../controller/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const userRouter = Router();

userRouter.post('/createuser', authMiddleware, authorizeRoles("Admin", "Manager"), createUser);
userRouter.post('/register', registerWorkspace);

userRouter.post('/login', loginUser);
userRouter.get('/profile', authMiddleware, getUserProfile);
userRouter.get('/', authMiddleware, authorizeRoles("Admin", "Manager"), getCompanyUsers);

export default userRouter;