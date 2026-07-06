import express from "express";
import { USERROLES } from "../config/constant";
import OrderController from "../controllers/order.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { generalLimiter } from "../middlewares/rateLimit.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import validate from "../middlewares/validate";
import OrderValidator from "../validators/order.validator";

const ordersRouter = express.Router();
const controller = new OrderController();

// customer — create order
ordersRouter.post(
  "/",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.CUSTOMER),
  OrderValidator.create(),
  validate,
  controller.create,
);

// customer — get all orders
ordersRouter.get(
  "/getMyOrders",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.CUSTOMER),
  controller.getMyOrders,
);

// customer — anyone authenticated — get order by id
ordersRouter.get(
  "/:id",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.CUSTOMER),
  OrderValidator.getById(),
  validate,
  controller.getById,
);

// admin — update order status
ordersRouter.patch(
  "/:id/status",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.ADMIN),
  OrderValidator.updateStatus(),
  validate,
  controller.updateStatus,
);

export default ordersRouter;
