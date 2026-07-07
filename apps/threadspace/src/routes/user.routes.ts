import express from "express";
import UserController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { authLimiter } from "../middlewares/rateLimit.middleware";
const userRouter = express.Router();
const controller = new UserController();

userRouter.get("/me", authLimiter, authMiddleware, controller.getUser);

export default userRouter;
