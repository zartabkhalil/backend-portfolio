import express from "express";
import { USERROLES } from "../config/constant";
import ProductController from "../controllers/product.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { generalLimiter } from "../middlewares/rateLimit.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import upload from "../middlewares/upload.middleware";
import validate from "../middlewares/validate";
import ProductValidator from "../validators/product.validator";
const productRouter = express.Router();
const controller = new ProductController();

//PUBLIC::anyone can access
productRouter.get("/", generalLimiter, controller.getAll);

//PUBLIC::anyone can access
productRouter.get(
  "/:id",
  generalLimiter,
  ProductValidator.getById(),
  validate,
  controller.getById,
);

//ADMIN::only for admin
productRouter.post(
  "/",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.ADMIN),
  upload.single("image"),
  ProductValidator.create(),
  validate,

  controller.create,
);

//ADMIN::only for admin
productRouter.put(
  "/:id",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.ADMIN),
  upload.single("image"),
  ProductValidator.updateById(),
  validate,
  controller.updateById,
);

//ADMIN::only for admin
productRouter.delete(
  "/:id",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.ADMIN),
  ProductValidator.deleteById(),
  validate,
  controller.deleteById,
);
export default productRouter;
