import { NextFunction, Request, Response } from "express";

interface ErrorResponse {
  success: boolean;
  message: string;
  stack?: string;
}

export default function errorHandler(
  err: Error & { status?: number; statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res?.headersSent) {
    return next(err);
  }
  const statusCode = err?.status || err?.statusCode || 500;

  const response: ErrorResponse = {
    success: false,
    message: err?.message || "Something went wrong",
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err?.stack;
  }

  res.status(statusCode).json(response);
}
