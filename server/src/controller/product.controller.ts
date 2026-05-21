import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import Product from "../models/product.model.js";
import { ApiError, ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.create({
      ...req.body,
      company: req.user.company,
    });
    return new ApiResponse(201, "Product created successfully", {
      product,
    }).send(res);
  } catch (error) {
    console.log(error);
    return new ApiError(500, "Internal server error").send(res);
  }
};

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user.company;

    const { page = "1", limit = "10", search } = req.query;

    let pageNum = Number(page);
    let pageLimit = Number(limit);

    const skip = (pageNum - 1) * pageLimit;

    // 1. Initialize with the mandatory company filter from the authenticated user
    const filterQuery: any = {
      company: companyId,
    };

    if (search && typeof search === "string" && search.trim() !== "") {
      filterQuery.name = { $regex: search.trim(), $options: "i" };
    }

    const [products, totalCount] = await Promise.all([
      Product.find(filterQuery)
        .skip(skip)
        .limit(pageLimit)
        .sort({ createdAt: -1 }),
      Product.countDocuments(filterQuery),
    ]);

    const totalPages = Math.ceil(totalCount / pageLimit) || 1;

    return new ApiResponse(200, "Products fetched successfully", {
      products,
      pagination: {
        totalItems: totalCount,
        currentPage: pageNum,
        totalPages,
        limit: pageLimit,
      },
    }).send(res);
  } catch (error) {
    console.log(error);
    return new ApiError(500, "Internal server error").send(res);
  }
};
