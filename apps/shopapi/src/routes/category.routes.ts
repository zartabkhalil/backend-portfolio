import express from "express";
import { USERROLES } from "../config/constant";
import CategoryController from "../controllers/category.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { generalLimiter } from "../middlewares/rateLimit.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import validate from "../middlewares/validate";
import CategoryValidator from "../validators/category.validator";
const categoriesRouter = express.Router();
const controller = new CategoryController();

//anyone can access
categoriesRouter.get("/", generalLimiter, controller.getAll);

//anyone can access
categoriesRouter.get(
  "/:id",
  generalLimiter,
  CategoryValidator.getCategoryById(),
  validate,
  controller.getId,
);

//only for admin
categoriesRouter.post(
  "/",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.ADMIN),
  CategoryValidator.create(),
  validate,
  controller.create,
);

//only for admin
categoriesRouter.put(
  "/:id",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.ADMIN),
  CategoryValidator.updateCategory(),
  validate,
  controller.updateById,
);

//only for admin
categoriesRouter.delete(
  "/:id",
  generalLimiter,
  authMiddleware,
  roleMiddleware(USERROLES.ADMIN),
  CategoryValidator.deleteCategoryById(),
  validate,
  controller.deleteById,
);
export default categoriesRouter;
