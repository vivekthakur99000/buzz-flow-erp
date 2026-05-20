import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { ApiError, ApiResponse } from "../utils/apiResponse.js";
import Customer from "../models/customer.model.js";

export const addCustomer = async (req : AuthRequest, res : Response) => {
    try {

        await Customer.create({...req.body, company : req.user.company});

        return new ApiResponse(201, "Customer created successfully").send(res);
        
    } catch (error) {
        console.log(error);
        return new ApiError(500, "Internal server Error").send(res);
    }
}

export const getCustomers = async (req : AuthRequest, res : Response) => {
    try {

        const {company} = req.user

        const customers = await Customer.find({company});

        return new ApiResponse(200, "Fetched all customers" ,{customers}).send(res);
        
    } catch (error) {
        console.log(error);
        return new ApiError(500, "Internal server Error").send(res);
    }
}

