import { type Request, type Response } from "express";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { ApiError, ApiResponse } from "../utils/apiResponse.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, company } = req.body;

    await User.create({ name, email, password, role, company });

    return new ApiResponse(201, "User created successfully").send(res);
  } catch (error) {
    console.log(error);
    return new ApiError(500, "Internal server error").send(res);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return new ApiError(400, "User does not exist").send(res);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return new ApiError(400, "Invalid credentials").send(res);
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role, company: user.company },
      process.env.JWT_SECRET as string,
    );

    return new ApiResponse(200, "Login successful", { token }).send(res);
  } catch (error) {
    console.log(error);
    return new ApiError(500, "Internal server error").send(res);
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    return new ApiResponse(200, "Fetched user profile successfully", { user }).send(res);
  } catch (error) {
    console.log(error);
    return new ApiError(500, "Internal server error").send(res);
  }
};
