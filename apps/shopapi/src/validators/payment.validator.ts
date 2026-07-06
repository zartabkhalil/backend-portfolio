import { PaymentStatus } from "@prisma/client";
import { body, param } from "express-validator";

export default class PaymentValidator {
  static create() {
    return [
      body("orderId")
        .notEmpty()
        .withMessage("orderId is required")
        .isInt({ min: 1 })
        .withMessage("Order ID must be a positive integer")
        .toInt(),
    ];
  }

  static getById() {
    return [
      param("id")
        .notEmpty()
        .withMessage("Payment ID is required")
        .isInt({ min: 1 })
        .withMessage("Payment ID must be a positive integer")
        .toInt(),
    ];
  }

  static getByOrderId() {
    return [
      param("orderId")
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
        .withMessage("Payment ID must be a positive integer")
        .toInt(),

      body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(Object.values(PaymentStatus))
        .withMessage(
          `Status must be one of: ${Object.values(PaymentStatus).join(", ")}`,
        ),
    ];
  }
}
