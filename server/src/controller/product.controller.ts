import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import Product from "../models/product.model.js";

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.create({
      ...req.body,
      company: req.user.company,
    });
    console.log(product);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user.company;

    const products = await Product.find({ company: companyId });

    res
      .status(200)
      .json({
        success: true,
        message: "Fetched product successfully",
        products,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
