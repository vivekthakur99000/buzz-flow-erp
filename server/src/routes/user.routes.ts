import { Router } from "express";
import { createUser, getUserProfile, loginUser } from "../controller/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post('/createuser', createUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', authMiddleware, getUserProfile);

export default userRouter;