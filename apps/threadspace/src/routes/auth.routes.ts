import express from "express";
import UserController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import {
  authLimiter,
  refreshTokenLimiter,
} from "../middlewares/rateLimit.middleware";
import validate from "../middlewares/validate";
import UserValidator from "../validators/user.validator";
const authRouter = express.Router();
const controller = new UserController();

authRouter.post(
  "/register",
  authLimiter,
  UserValidator.register(),
  validate,
  controller.register,
);

//verify account
authRouter.post(
  "/verify-email",
  authLimiter,
  UserValidator.verify(),
  validate,
  controller.verifyAccount,
);

authRouter.post(
  "/login",
  authLimiter,
  UserValidator.login(),
  validate,
  controller.login,
);

authRouter.post(
  "/refresh-token",
  refreshTokenLimiter,
  UserValidator.refreshToken(),
  validate,
  controller.refreshToken,
);

authRouter.post("/logout", authLimiter, authMiddleware, controller.logout);

export default authRouter;
