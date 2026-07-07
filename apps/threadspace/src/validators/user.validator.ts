import { body } from "express-validator";

export default class UserValidator {
  static register() {
    return [
      body("name").notEmpty().withMessage("Name is required"),

      body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),
      body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain an uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain a lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain a number"),
    ];
  }

  static login() {
    return [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .normalizeEmail(),
      body("password").notEmpty().withMessage("Password is required"),
    ];
  }
  static forgot() {
    return [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .normalizeEmail(),
    ];
  }

  static reset() {
    return [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .normalizeEmail(),

      body("otp").notEmpty().withMessage("Otp is required"),
      body("newPassword").notEmpty().withMessage("newPassword is required"),
    ];
  }

  static refreshToken() {
    return [
      body("refreshToken").notEmpty().withMessage("refreshToken is Required"),
    ];
  }
}
