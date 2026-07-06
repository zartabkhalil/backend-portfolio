import { NextFunction, Request, Response } from "express";
import { USERROLES } from "../config/constant";
import { AppError } from "../lib/appError.lib";

export default function roleMiddleware(role: keyof typeof USERROLES) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return next(new AppError("Forbidden", 403));
    }
    next();
  };
}
