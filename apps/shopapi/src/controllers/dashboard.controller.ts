import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/appError.lib";
import DashboardService from "../services/dashboard.service";

export default class DashboardController {
  private service: DashboardService;
  constructor() {
    this.service = new DashboardService();
  }

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const data = await this.service.getStats(userId);
    return res.status(201).json({
      success: true,
      message: "Dashboard stats",
      data,
    });
  };
}
