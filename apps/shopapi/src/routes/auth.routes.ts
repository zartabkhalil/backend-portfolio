import express from "express";
import UserController from "../controllers/auth.controller";
import { authLimiter } from "../middlewares/rateLimit.middleware";
import validate from "../middlewares/validate";
import UserValidator from "../validators/user.validator";
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

export default userRouter;
