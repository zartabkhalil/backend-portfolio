import { OrderStatus } from "@prisma/client";
import { body, param } from "express-validator";

export default class OrderValidator {
  static create() {
    return [
      body("address")
        .notEmpty()
        .withMessage("Address is required")
        .isString()
        .withMessage("Address must be a string")
        .trim(),
    ];
  }

  static getById() {
    return [
      param("id")
        .notEmpty()
        .withMessage("Order ID is required")
        .isInt({ min: 1 })
        .withMessage("Order ID must be a positive integer")
        .toInt(),
    ];
  }

  static cancel() {
    return [
      param("id")
        .notEmpty()
        .withMessage("Order ID is required")
        .isInt({ min: 1 })
        .withMessage("Order ID must be a positive integer")
        .toInt(),
    ];
  }

  static updateStatus() {
    return [
      param("id")
        .isInt({ min: 1 })
        .withMessage("Order ID must be a positive integer")
        .toInt(),

      body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(Object.values(OrderStatus))
        .withMessage(
          `Status must be one of: ${Object.values(OrderStatus).join(", ")}`,
        ),
    ];
  }
}
