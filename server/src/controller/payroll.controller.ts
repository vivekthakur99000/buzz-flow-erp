import type { AuthRequest } from "../middlewares/auth.middleware.js";
import type { Response } from "express";
import Payroll from "../models/payroll.model.js";
import { ApiError, ApiResponse } from "../utils/apiResponse.js";
import EmployeeProfile from "../models/employeeProfile.model.js";
import Attendence from "../models/attendence.model.js";

export const generatePayroll = async (req: AuthRequest, res: Response) => {
    try {

        const { userId, month, year } = req.body;
        const companyId = req.user.company;

        // check if user exist in the employee profile and company

        const employeeProfile = await EmployeeProfile.findOne({ user: userId, company: companyId });

        if (!employeeProfile) {
            return new ApiError(404, "Employee profile not found for the given user in the company").send(res);
        }


        // check if payroll already generated for the month and year

        const existingPayroll = await Payroll.findOne({ user: userId, company: companyId, month, year });

        if (existingPayroll) {
            return new ApiError(400, "Payroll for the given month and year already generated.").send(res);
        }

        // calculate days worked from attendence

        const attendences = await Attendence.find({ user: userId, company: companyId, date: { $gte: new Date(year, month - 1, 1), $lte: new Date(year, month, 0) } });

        const daysWorked = attendences.length;

        // calculate net salary

        const baseSalary = employeeProfile.baseSalary;
        const deductions = 0; // You can add logic to calculate deductions based on your requirements
        const netSalary = baseSalary * (daysWorked / 30) - deductions; // Assuming 30 days in a month for pro-rata calculation  

        // create payroll record

        const payroll = await Payroll.create({
            user: userId,
            company: companyId,
            month,
            year,
            baseSalary,
            daysWorked,
            deductions,
            netSalary,
        });

        return new ApiResponse(201, "Payroll generated successfully", { payroll }).send(res);

    } catch (error) {
        console.error(error);
        return new ApiError(500, "Internal server error").send(res);
    }
}