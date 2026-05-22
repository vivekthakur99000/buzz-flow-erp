import { Router } from "express";
import { createUser, getUserProfile, loginUser, registerWorkspace } from "../controller/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post('/createuser', createUser);
userRouter.post('/register', registerWorkspace);

userRouter.post('/login', loginUser);
userRouter.get('/profile', authMiddleware, getUserProfile);

export default userRouter;