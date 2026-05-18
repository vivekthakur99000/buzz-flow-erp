import { type Request, type Response } from "express";
import Company from "../models/company.model.js";
import { ApiError, ApiResponse } from "../utils/apiResponse.js";

export const createCompany = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, address } = req.body;

        await Company.create({
            name,
            email,
            phone,
            address,
        });

        return new ApiResponse(201, "Company created successfully").send(res);
    } catch (error: unknown) {
        console.error(error);
        return new ApiError(500, "Internal server error").send(res);
    }
};

export default { createCompany };