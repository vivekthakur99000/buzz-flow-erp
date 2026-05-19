import { type Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import Product from "../models/product.model.js";
import { ApiError, ApiResponse } from "../utils/apiResponse.js";

export const receiveInventory = async (req: AuthRequest, res: Response) => {
  try {
    console.log("1. Request reached the controller!"); // <--- ADD THIS
    
    const { items, supplier } = req.body;
    console.log("2. Items received:", items); // <--- ADD THIS
    const company = req.user.company;

    let totalCost = 0;
    const processedItems = [];

    for (let item of items) {
      const product = await Product.findOne({ _id: item.product, company });

      if (!product) {
        return new ApiError(
          404,
          `Product with ID ${item.product} not found.`,
        ).send(res);
      }

      totalCost += item.costPrice * item.quantity;

      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        costPrice: item.costPrice,
      });

      product.stock += item.quantity;

      await product.save();
    }

    const purchaseOrder = await PurchaseOrder.create({
      supplier,
      items: processedItems,
      totalCost,
      status: "Received",
      company,
    });

    return new ApiResponse(201, "Inventory updated successfully", {
      purchaseOrder,
    }).send(res);
  } catch (error) {
    console.log(error)
    return new ApiError(500, "Internal server error").send(res);
  }
};
