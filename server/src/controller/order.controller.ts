import type { Response } from "express";
import mongoose from "mongoose";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { customerName, customerEmail, items } = req.body;

    const { company, _id } = req.user;

    let totalAmount = 0;

    const processedItems = [];

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.product,
        company: company,
      });

      // If the product doesn't exist OR belongs to another company, product will be null
      if (!product) {
        return new ApiError(404, `Product with ID ${item.product} not found in your inventory.`).send(res);
      }

      if (product.stock < item.quantity) {
        return new ApiError(400, "Insufficient stock").send(res);
      }

      totalAmount += product.price * item.quantity;

      processedItems.push({product : product._id, quantity : item.quantity, priceAtPurchase : product.price});

      product.stock -= item.quantity;

      await product.save();

    }

    const order = await Order.create({
      customerName,
      customerEmail,
      items: processedItems,
      totalAmount,
      company,
      createdBy: _id,
    });

    return new ApiResponse(201, "Order created successfully", { order }).send(res);
  } catch (error) {
     console.error(error);
     return new ApiError(500, "Internal server error").send(res);
  }
};

export const getOrders = async(req : AuthRequest, res :Response) => {
    try {

        const {company} = req.user;

        const orders = await Order.find({company}).populate("items.product", "name sku price");

        return new ApiResponse(200, "Order fetched successfully", {orders}).send(res);

    } catch (error) {
        console.log(error);
        return new ApiError(500, "Internal server error").send(res);
    }
}

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user.company;

    const stats = await Order.aggregate([
      // Stage 1: FIX - Manually convert the string ID to a real MongoDB ObjectId
      { 
        $match: { 
          company: new mongoose.Types.ObjectId(companyId) 
        } 
      },

      // Stage 2: Group and calculate
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const defaultStats = stats.length > 0 ? stats[0] : { totalRevenue: 0, totalOrders: 0 };

    return res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: defaultStats,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
