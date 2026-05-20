import type { Response } from "express";
import mongoose from "mongoose";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import Customer from "../models/customer.model.js";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { customer, items } = req.body;

    const { company, _id } = req.user;

    const customerRecord = await Customer.findOne({ _id: customer, company });

    if (!customerRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found." });
    }

    let subTotal = 0;

    const processedItems = [];

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.product,
        company: company,
      });

      // If the product doesn't exist OR belongs to another company, product will be null
      if (!product) {
        return new ApiError(
          404,
          `Product with ID ${item.product} not found in your inventory.`,
        ).send(res);
      }

      if (product.stock < item.quantity) {
        return new ApiError(400, "Insufficient stock").send(res);
      }

      subTotal += product.price * item.quantity;

      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });

      product.stock -= item.quantity;

      await product.save();
    }

    // Calculate GST (18%) and Grand Total
    const GST_RATE = 0.18;
    const gstAmount = subTotal * GST_RATE;
    const grandTotal = subTotal + gstAmount;

    const order = await Order.create({
      customer: customerRecord._id,
      items: processedItems,
      totalAmount: subTotal,
      gstAmount,
      grandTotal,
      company,
      createdBy: _id,
    });

    return new ApiResponse(201, "Order created successfully", { order }).send(
      res,
    );
  } catch (error) {
    console.error(error);
    return new ApiError(500, "Internal server error").send(res);
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { company } = req.user;

    const orders = await Order.find({ company }).populate(
      "items.product",
      "name sku price",
    );

    return new ApiResponse(200, "Order fetched successfully", { orders }).send(
      res,
    );
  } catch (error) {
    console.log(error);
    return new ApiError(500, "Internal server error").send(res);
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    // Remember the Mongoose string fix!
    const companyId = new mongoose.Types.ObjectId(req.user.company);

    // Promise.all runs both aggregations simultaneously for maximum speed
    const [salesStats, purchaseStats] = await Promise.all([
      // Query 1: Calculate Total Revenue from Sales
      Order.aggregate([
        { $match: { company: companyId } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
          },
        },
      ]),

      // Query 2: Calculate Total Costs from Restocking (Only count 'Received' orders!)
      PurchaseOrder.aggregate([
        { $match: { company: companyId, status: "Received" } },
        {
          $group: {
            _id: null,
            totalCosts: { $sum: "$totalCost" },
            totalPurchases: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Safely extract the numbers (default to 0 if they haven't sold/bought anything yet)
    const revenue = salesStats.length > 0 ? salesStats[0].totalRevenue : 0;
    const ordersCount = salesStats.length > 0 ? salesStats[0].totalOrders : 0;

    const costs = purchaseStats.length > 0 ? purchaseStats[0].totalCosts : 0;
    const purchasesCount =
      purchaseStats.length > 0 ? purchaseStats[0].totalPurchases : 0;

    // THE ULTIMATE BUSINESS METRIC:
    const grossProfit = revenue - costs;

    return res.status(200).json({
      success: true,
      message: "Master dashboard stats fetched successfully",
      data: {
        totalRevenue: revenue,
        totalCosts: costs,
        grossProfit: grossProfit, // If this is negative, the company is losing money!
        totalOrders: ordersCount,
        totalPurchases: purchasesCount,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
