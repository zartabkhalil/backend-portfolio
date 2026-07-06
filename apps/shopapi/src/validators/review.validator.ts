import { body, param } from "express-validator";

export default class ReviewValidator {
  static create() {
    return [
      body("productId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isInt({ min: 1 })
        .withMessage("Order ID must be a positive integer")
        .toInt(),
      body("reviews")
        .notEmpty()
        .withMessage("reviews is required")
        .isString()
        .withMessage("reviews must be a string")
        .trim(),
      body("ratings")
        .notEmpty()
        .withMessage("ratings is required")
        .isFloat({ min: 1, max: 5 })
        .withMessage("ratings must be a valid number and must be between 1-5")
        .toFloat(),
    ];
  }

  static getById() {
    return [];
  }

  static getAllByProduct() {
    return [
      param("productId")
        .isInt({ min: 1 })
        .withMessage("Product id must be a positive integer")
        .toInt(),
    ];
  }
  static delete() {
    return [
      param("id")
        .isInt({ min: 1 })
        .withMessage("Ratings id must be a positive integer")
        .toInt(),
    ];
  }
}
