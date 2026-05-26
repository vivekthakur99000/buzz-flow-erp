import Supplier from "../models/supplier.model.js";
import type {Response} from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { ApiError, ApiResponse } from "../utils/apiResponse.js";

export const addSupplier = async (req : AuthRequest, res : Response) => {
    try {
        const { contactName, contactPerson, ...rest } = req.body;

        await Supplier.create({
            ...rest,
            contactPerson: contactPerson ?? contactName,
            company : req.user.company,
        });

        return new ApiResponse(201, "Supplier created successfully").send(res);
    } catch (error) {
        console.log(error);
        return new ApiError(500, "Internal server Error").send(res);
    }
}

export const getAllSupplier = async (req : AuthRequest, res : Response) => {
    try {

        const companyId = req.user.company;
       
        const suppliers = await Supplier.find({company : companyId});
        console.log(suppliers);

        return new ApiResponse(200, "Fetched suppliers successfully", {suppliers}).send(res);
    } catch (error) {
        console.log(error);
        return new ApiError(500, "Internal server Error").send(res);
    }
}