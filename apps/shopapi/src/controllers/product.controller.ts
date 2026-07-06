import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/appError.lib";
import ProductService from "../services/product.service";
import { UpdateProductInput } from "../types/product.types";
export default class ProductController {
  private service: ProductService;
  constructor() {
    this.service = new ProductService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    const { title, price, categoryId, description, stock, discount } = req.body;
    if (!req.file) {
      throw new AppError("Image is required", 400);
    }

    const image = req.file.path;

    const result = await this.service.create({
      title,
      price,
      categoryId,
      image,
      description,
      stock,
      discount,
    });
    return res.status(201).json({
      success: true,
      message: "Product Created",
      data: result,
    });
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);

    const result = await this.service.getAll(page, limit);
    return res.status(200).json({
      success: true,
      message: "Fetched successfully",
      data: result,
    });
  };
  getById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await this.service.getById(Number(id));
    return res.status(200).json({
      success: true,
      message: "Fetched successfully",
      data: result,
    });
  };

  updateById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, price, categoryId, description, stock, discount } =
      req.body || {};
    const updateData: UpdateProductInput = {
      ...(title && { title }),
      ...(price !== undefined && { price }),
      ...(categoryId !== undefined && { categoryId }),
      ...(description !== undefined && { description }),
      ...(stock !== undefined && { stock }),
      ...(discount !== undefined && { discount }),
    };

    // optional image update
    if (req.file) {
      updateData.image = req.file.path;
    }

    const result = await this.service.updateById(Number(id), updateData);

    return res.status(200).json({
      success: true,
      message: "Record Updated",
      data: result,
    });
  };

  //::delete by  id
  deleteById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await this.service.deleteById(Number(id));
    return res.status(200).json({
      success: true,
      message: "Record Deleted",
      data: result,
    });
  };
}
