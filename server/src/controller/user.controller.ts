import { type Request, type Response } from "express";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { ApiError, ApiResponse } from "../utils/apiResponse.js";
import Company from "../models/company.model.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, company } = req.body;
    const authReq = req as AuthRequest;
    const resolvedCompany = authReq.user?.company || company;

    if (!resolvedCompany) {
      return new ApiError(400, "Company is required to create user").send(res);
    }

    await User.create({ name, email, password, role, company: resolvedCompany });

    return new ApiResponse(201, "User created successfully").send(res);
  } catch (error) {
    console.log(error);
    return new ApiError(500, "Internal server error").send(res);
  }
};

export const getCompanyUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({ company: req.user.company }).select("-password");

    return new ApiResponse(200, "Users fetched successfully", { users }).send(res);
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

export const registerWorkspace = async (req: Request, res: Response) => {
  let createdCompanyId: string | null = null;

  try {
    // 1. Extract exactly what the updated React frontend is sending
    const { 
      companyName, companyEmail, companyPhone, companyAddress, 
      name, email, password 
    } = req.body;

    const requiredFields = [
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      name,
      email,
      password,
    ];

    if (requiredFields.some((field) => typeof field !== "string" || !field.trim())) {
      return new ApiError(400, "All workspace and admin fields are required").send(res);
    }

    // 2. Prevent duplicates (Check both User and Company emails)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new ApiError(400, "User with this email already exists").send(res);
    }
    
    const existingCompany = await Company.findOne({ 
      $or: [{ email: companyEmail }, { phone: companyPhone }] 
    });
    if (existingCompany) {
       return new ApiError(400, "A company with this email or phone already exists").send(res);
    }

    // 3. Create the new Company Tenant using your exact schema
    const newCompany = await Company.create({ 
      name: companyName,
      email: companyEmail,
      phone: companyPhone,
      address: companyAddress
    });
    createdCompanyId = String(newCompany._id);

    // 4. Create the Admin User and link them to the new Company
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: "Admin", 
      company: newCompany._id // Link the Object ID!
    });

    // 5. Generate the JWT Token
    const token = jwt.sign(
      { _id: user._id, role: user.role, company: user.company },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' } 
    );

    // 6. Return the success response
    return new ApiResponse(201, "Workspace created successfully", { 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company
      }, 
      token 
    }).send(res);
  } catch (error) {
    if (createdCompanyId) {
      await Company.findByIdAndDelete(createdCompanyId);
    }

    if (typeof error === "object" && error !== null && "code" in error && (error as { code?: number }).code === 11000) {
      return new ApiError(400, "A workspace with one of these unique fields already exists").send(res);
    }

    console.log("Workspace Registration Error:", error);
    return new ApiError(500, "Internal server error").send(res);
  }
};
