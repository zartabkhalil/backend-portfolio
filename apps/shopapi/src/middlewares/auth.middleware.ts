import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/appError.lib";
import JwtService from "../lib/jwt.lib";

const jwtService = new JwtService();

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Access denied. Token missing", 401);
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      throw new AppError("Invalid token format", 401);
    }

    const token = parts[1];

    const decode = jwtService.verifyAccessToken(token);

    req.user = {
      userId: decode.userId,
      role: decode.role,
    };

    next();
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }
    // Unexpected — log the real error, return a sanitized message
    console.error("Auth middleware error:", err);
    return next(new AppError("Authentication failed", 401));
  }
}
