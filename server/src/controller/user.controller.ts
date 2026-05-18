import { type Request, type Response } from "express";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { success } from "zod";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, company } = req.body;

    await User.create({ name, email, password, role, company });

    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role, company: user.company },
      process.env.JWT_SECRET as string,
    );

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    res
      .status(200)
      .json({
        success: true,
        message: "Fetched user profile successfully",
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
