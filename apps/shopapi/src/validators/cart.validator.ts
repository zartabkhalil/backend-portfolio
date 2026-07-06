import { body, param } from "express-validator";

export default class CartValidator {
  static create() {
    return [
      body("productId")
        .notEmpty()
        .withMessage("Product ID  is required")
        .isInt({ min: 1 })
        .withMessage("Product ID  must be a positive integer")
        .toInt(),
      body("quantity")
        .notEmpty()
        .withMessage("quantity id is required")
        .isInt({ min: 1 })
        .withMessage("quantity id must be a positive integer")
        .toInt(),
    ];
  }

  static getById() {
    return [
      param("id")
        .notEmpty()
        .withMessage("Cart ID is required")
        .isInt({ min: 1 })
        .withMessage("Product id must be a positive integer")
        .toInt(),
    ];
  }

  static updateById() {
    return [
      param("id")
        .isInt({ min: 1 })
        .withMessage("Cart id must be a positive integer")
        .toInt(),
      // ✅ Only quantity is needed — userId comes from JWT, productId is immutable
      body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer")
        .toInt(),
    ];
  }

  static deleteById() {
    return [
      param("id")
        .notEmpty()
        .withMessage("Cart ID is required")
        .isInt({ min: 1 })
        .withMessage("Product id must be a positive integer")
        .toInt(),
    ];
  }
}
