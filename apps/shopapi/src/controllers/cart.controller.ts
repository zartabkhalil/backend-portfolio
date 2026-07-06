import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/appError.lib";
import CartService from "../services/cart.service";
export default class CartController {
  private service: CartService;
  constructor() {
    this.service = new CartService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { userId } = req.user;
    const { productId, quantity } = req.body;

    const result = await this.service.create({
      userId,
      productId,
      quantity,
    });
    return res.status(201).json({
      success: true,
      message: "Items Added to Cart ",
      data: result,
    });
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { userId } = req.user;
    if (!userId) {
      throw new AppError("User not found", 404);
    }
    const result = await this.service.getAll(userId);
    return res.status(200).json({
      success: true,
      message: "Fetched successfully",
      data: result,
    });
  };

  updateById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const { quantity } = req.body;

    const result = await this.service.updateById(userId, Number(id), {
      userId, // ← from JWT, not body
      quantity,
    });

    return res.status(200).json({
      success: true,
      message: "Cart Updated",
      data: result,
    });
  };

  //::delete by  id
  deleteById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    // Pass user so the service can verify ownership
    const result = await this.service.deleteById(Number(id), userId);
    return res.status(200).json({
      success: true,
      message: "Record Deleted",
      data: result,
    });
  };
}
