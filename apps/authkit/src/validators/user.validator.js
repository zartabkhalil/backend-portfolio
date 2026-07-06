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
      body("password").notEmpty().withMessage("Password is required"),
    ];
  }

  static login() {
    return [
      body("email").notEmpty().withMessage("Email is required"),
      body("password").notEmpty().withMessage("Password is required"),
    ];
  }
  static forgot() {
    return [body("email").notEmpty().withMessage("Email is required")];
  }

  static reset() {
    return [
      body("email").notEmpty().withMessage("Email is required"),
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
