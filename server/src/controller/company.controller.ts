import { type Request, type Response } from "express";
import Company from "../models/company.model.js";

export const createCompany = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, address } = req.body;

        await Company.create({
            name,
            email,
            phone,
            address,
        });

        return res.status(201).json({ success: true, message: "Company created successfully" });
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default { createCompany };