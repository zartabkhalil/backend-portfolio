import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/appError.lib";
import OrderService from "../services/order.service";

export default class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const { address } = req.body;
    const result = await this.orderService.create(userId, address);
    return res.status(200).json({
      success: true,
      message: "Order Place Successfully",
      data: result,
    });
  };

  getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const data = await this.orderService.getMyOrders(userId);
    return res.status(200).json({
      success: true,
      message: "Orders of User",
      data,
    });
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const data = await this.orderService.getById(Number(id), userId);
    return res.status(200).json({
      success: true,
      message: "Orders Detail",
      data,
    });
  };
  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
    const data = await this.orderService.updateStatus(Number(id), status);
    return res.status(200).json({
      success: true,
      message: "Order Updated",
      data,
    });
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {};

  cancel = async (req: Request, res: Response, next: NextFunction) => {};
}
