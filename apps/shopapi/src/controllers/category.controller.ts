import { NextFunction, Request, Response } from "express";
import CategoryService from "../services/category.service";
export default class CategoryController {
  private categoryService: CategoryService;
  constructor() {
    this.categoryService = new CategoryService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const result = await this.categoryService.createCategory({
      name,
    });
    return res.status(201).json({
      success: true,
      message: "Category Created",
      data: result,
    });
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    const result = await this.categoryService.getCategories();
    return res.status(200).json({
      success: true,
      message: "Fetched successfully",
      data: result,
    });
  };
  getId = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await this.categoryService.getCategoryById(Number(id));
    return res.status(200).json({
      success: true,
      message: "Fetched successfully",
      data: result,
    });
  };

  //update category by id
  updateById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;

    const result = await this.categoryService.updateCategoryById(
      Number(id),
      name,
    );

    return res.status(200).json({
      success: true,
      message: "Record Updated",
      data: result,
    });
  };

  //::delete by category id
  deleteById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await this.categoryService.deleteById(Number(id));
    return res.status(200).json({
      success: true,
      message: "Record Deleted",
      data: result,
    });
  };
}
