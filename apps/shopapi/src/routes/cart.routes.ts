import express from "express";
import { USERROLES } from "../config/constant";
import CartController from "../controllers/cart.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { generalLimiter } from "../middlewares/rateLimit.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import validate from "../middlewares/validate";
import CartValidator from "../validators/cart.validator";
const cartRouter = express.Router();
const controller = new CartController();

//CUSTOMER:: can access
cartRouter.get(
  "/",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.CUSTOMER),
  controller.getAll,
);

//::CUSTOMER can access
cartRouter.post(
  "/",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.CUSTOMER),
  CartValidator.create(),
  validate,

  controller.create,
);

//CUSTOMER::anyone can access
cartRouter.put(
  "/:id",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.CUSTOMER),
  CartValidator.updateById(),
  validate,
  controller.updateById,
);

//CUSTOMER::anyone can access
cartRouter.delete(
  "/:id",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.CUSTOMER),
  CartValidator.deleteById(),
  validate,
  controller.deleteById,
);
export default cartRouter;
