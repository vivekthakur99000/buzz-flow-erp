import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import Product from "../models/product.model.js";
import { ApiError, ApiResponse } from "../utils/apiResponse.js";

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.create({
      ...req.body,
      company: req.user.company,
    });
    return new ApiResponse(201, "Product created successfully", { product }).send(res);
  } catch (error) {
    console.log(error);
    return new ApiError(500, "Internal server error").send(res);
  }
};

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user.company;

    const products = await Product.find({ company: companyId });

    return new ApiResponse(200, "Fetched product successfully", { products }).send(res);
  } catch (error) {
    console.log(error);
    return new ApiError(500, "Internal server error").send(res);
  }
};
