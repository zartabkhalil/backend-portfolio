import express from "express";
import UserController from "../controllers/user.controller.js";
import auth from "../middlewares/auth.middleware.js";
import {
  authLimiter,
  refreshTokenLimiter,
} from "../middlewares/rateLimit.middleware.js";
import validate from "../middlewares/validate.js";
import UserValidator from "../validators/user.validator.js";
const userRouter = express.Router();
const controller = new UserController();

userRouter.post(
  "/register",
  authLimiter,
  UserValidator.register(),
  validate,
  controller.register,
);
userRouter.post(
  "/login",
  authLimiter,
  UserValidator.login(),
  validate,
  controller.login,
);
userRouter.post(
  "/forgot-password",
  authLimiter,
  UserValidator.forgot(),
  validate,
  controller.forgot,
);
userRouter.post(
  "/refresh-token",
  refreshTokenLimiter,
  UserValidator.refreshToken(),
  validate,
  controller.refreshToken,
);
userRouter.post(
  "/reset-password",
  authLimiter,
  UserValidator.reset(),
  validate,
  controller.reset,
);

userRouter.post("/logout", authLimiter, auth, controller.logout);

//Testing route
userRouter.get("/me", auth, controller.getUser);
export default userRouter;
