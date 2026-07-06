import express from "express";
import { USERROLES } from "../config/constant";
import ReviewController from "../controllers/review.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { generalLimiter } from "../middlewares/rateLimit.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import validate from "../middlewares/validate";
import ReviewValidator from "../validators/review.validator";

const reviewRouter = express.Router();
const controller = new ReviewController();

//create review
reviewRouter.post(
  "/",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.CUSTOMER),
  ReviewValidator.create(),
  validate,
  controller.create,
);

//get review of a product
reviewRouter.post(
  "/product/:productId",
  generalLimiter,
  ReviewValidator.getAllByProduct(),
  controller.getAllByProduct,
);

//delete  review
reviewRouter.delete(
  "/:id",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.CUSTOMER),
  ReviewValidator.delete(),
  validate,
  controller.deleteById,
);

export default reviewRouter;
