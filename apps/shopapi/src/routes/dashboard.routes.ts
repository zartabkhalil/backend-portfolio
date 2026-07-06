import express from "express";
import DashboardController from "../controllers/dashboard.controller";
import { generalLimiter } from "../middlewares/rateLimit.middleware";

const dashboardRouter = express.Router();
const controller = new DashboardController();

//anyone can access
dashboardRouter.get("/dashboard", generalLimiter, controller.getStats);

export default dashboardRouter;
