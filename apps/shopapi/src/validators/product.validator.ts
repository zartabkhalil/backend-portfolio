import { body, param } from "express-validator";

export default class ProductValidator {
  static create() {
    return [
      body("title").trim().notEmpty().withMessage("Title is required"),

      body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a valid number")
        .toFloat(),

      body("categoryId")
        .notEmpty()
        .withMessage("Category id is required")
        .isInt({ min: 1 })
        .withMessage("Category id must be a positive integer")
        .toInt(),

      body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

      body("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a valid integer")
        .toInt(),

      body("discount")
        .notEmpty()
        .withMessage("Discount is required")
        .isFloat({ min: 0 })
        .withMessage("Discount must be a valid number")
        .toFloat(),

      body("image").custom((value, { req }) => {
        if (!req.file) {
          throw new Error("Image is required");
        }

        return true;
      }),
    ];
  }

  static getById() {
    return [
      param("id")
        .notEmpty()
        .withMessage("Product id is required")
        .isInt({ min: 1 })
        .withMessage("Product id must be a positive integer")
        .toInt(),
    ];
  }

  static updateById() {
    return [
      param("id")
        .isInt({ min: 1 })
        .withMessage("Product id must be a positive integer")
        .toInt(),

      body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),

      body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a valid number")
        .toFloat(),

      body("categoryId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Category id must be a positive integer")
        .toInt(),

      body("description").optional().trim(),

      body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a valid integer")
        .toInt(),

      body("discount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Discount must be a valid number")
        .toFloat(),
    ];
  }

  static deleteById() {
    return [
      param("id")
        .notEmpty()
        .withMessage("Product id is required")
        .isInt({ min: 1 })
        .withMessage("Product id must be a positive integer")
        .toInt(),
    ];
  }
}
