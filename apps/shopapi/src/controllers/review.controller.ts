import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/appError.lib";
import ReviewService from "../services/review.service";

export default class ReviewController {
  private service: ReviewService;
  constructor() {
    this.service = new ReviewService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const { productId, reviews, ratings } = req.body;

    const data = await this.service.create(Number(userId), {
      productId,
      reviews,
      ratings,
    });

    return res.status(200).json({
      success: true,
      message: "Review submited successfully",
      data,
    });
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {};

  getAllByProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const data = await this.service.getAllByProduct(Number(productId));
    return res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data,
    });
  };

  getAllByUser = async (req: Request, res: Response, next: NextFunction) => {};

  updateById = async (req: Request, res: Response, next: NextFunction) => {};

  deleteById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const { id } = req.params;
    const data = await this.service.deleteById(Number(id), userId);
    return res.status(200).json({
      success: true,
      message: "Review Deleted successfully",
      data,
    });
  };
}
