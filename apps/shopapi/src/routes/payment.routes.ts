import express from "express";
import { USERROLES } from "../config/constant";
import PaymentController from "../controllers/payment.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { generalLimiter } from "../middlewares/rateLimit.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import validate from "../middlewares/validate";
import PaymentValidator from "../validators/payment.validator";

const paymentsRouter = express.Router();
const controller = new PaymentController();

// customer — create payment -intent

paymentsRouter.post(
  "/create-intent",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.CUSTOMER),
  PaymentValidator.create(),
  validate,
  controller.createIntent,
);

export default paymentsRouter;
