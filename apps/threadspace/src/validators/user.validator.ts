import { body } from "express-validator";

export default class UserValidator {
  static register() {
    return [
      body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("First name must be between 2 and 50 characters"),

      body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Last name must be between 2 and 50 characters"),

      body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-zA-Z0-9._]+$/)
        .withMessage(
          "Username can only contain letters, numbers, dots and underscores",
        ),

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
  static verify() {
    return [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .normalizeEmail(),
      body("otp").notEmpty().withMessage("otp is required"),
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
