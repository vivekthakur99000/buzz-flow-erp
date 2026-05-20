import type { AuthRequest } from "../middlewares/auth.middleware.js";
import type { Response } from "express";
import EmployeeProfile from "../models/employeeProfile.model.js";
import { ApiError, ApiResponse } from "../utils/apiResponse.js";

export const addEmployeeProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { designation, department, baseSalary } = req.body;
        const userId = req.user._id;
        const companyId = req.user.company;
        // Check if employee profile already exists for the user in the company
        const existingProfile = await EmployeeProfile.findOne({ user: userId, company: companyId });

        if (existingProfile) {
            return new ApiError(400, "Employee profile already exists for the given user in the company").send(res);
        }

        // Create new employee profile
        const employeeProfile = await EmployeeProfile.create({
            user: userId,
            company: companyId,
            designation,
            department,
            baseSalary
        });

        return new ApiResponse(201, "Employee profile added successfully", { employeeProfile }).send(res);
    } catch (error) {
        console.error(error);
        return new ApiError(500, "Internal server error").send(res);
    }
};

export const getEmployeeProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const companyId = req.user.company;

        const employeeProfile = await EmployeeProfile.findOne({ user: userId, company: companyId });

        if (!employeeProfile) {
            return new ApiError(404, "Employee profile not found").send(res);
        }

        return new ApiResponse(200, "Employee profile retrieved successfully", { employeeProfile }).send(res);
    } catch (error) {
        console.error(error);
        return new ApiError(500, "Internal server error").send(res);
    }
};
