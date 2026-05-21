import type { AuthRequest } from "../middlewares/auth.middleware.js";
import type { Response } from "express";
import mongoose from "mongoose";
import EmployeeProfile from "../models/employeeProfile.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/User.model.js";
import { ApiError, ApiResponse } from "../utils/apiResponse.js";

export const getMasterDashboard = async (req : AuthRequest, res : Response) => {
    try {
        const companyId = req.user?.company;

        if (!companyId) {
            return new ApiError(401, "Unauthorized: company context missing").send(res);
        }

        const companyObjectId = new mongoose.Types.ObjectId(companyId);

        const [revenueSummary, lowStockCount, activeEmployeeCount, recentOrders] = await Promise.all([
            Order.aggregate([
                { $match: { company: companyObjectId } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$grandTotal" },
                        totalOrders: { $sum: 1 },
                    },
                },
            ]),
            Product.countDocuments({
                company: companyObjectId,
                $expr: { $lte: ["$stock", "$lowStockThreshold"] },
            }),
            EmployeeProfile.countDocuments({ company: companyObjectId }),
            Order.find({ company: companyObjectId })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("customer", "name"),
        ]);

        const revenueData = revenueSummary[0] ?? { totalRevenue: 0, totalOrders: 0 };

        return new ApiResponse(200, "Master dashboard fetched successfully", {
            totalRevenue: revenueData.totalRevenue,
            totalOrders: revenueData.totalOrders,
            lowStockCount,
            activeEmployeeCount,
            recentOrders,
        }).send(res);

    } catch (error) {
        console.log(error);
        return new ApiError(500,"Internal server error").send(res);
    }
}