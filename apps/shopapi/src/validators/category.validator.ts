import { body, param } from "express-validator";

export default class CategoryValidator {
  static create() {
    return [body("name").notEmpty().withMessage("name is required")];
  }

  static getCategoryById() {
    return [
      param("id")
        .notEmpty()
        .withMessage("Category id is required")
        .isInt({ min: 1 })
        .withMessage("Category id must be a positive integer"),
    ];
  }
  static updateCategory() {
    return [
      // validate route param
      param("id")
        .isInt({ min: 1 })
        .withMessage("Category id must be a positive integer"),

      // validate body
      body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .trim(),
    ];
  }
  static deleteCategoryById() {
    return [
      param("id")
        .notEmpty()
        .withMessage("Category id is required")
        .isInt({ min: 1 })
        .withMessage("Category id must be a positive integer"),
    ];
  }
}
