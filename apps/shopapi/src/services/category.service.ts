import { AppError } from "../lib/appError.lib";
import CategoryRepoistory from "../repositories/category.repository";
import { CreateCategoryInput } from "../types/category.types";

export default class CategoryService {
  private categoryRepository: CategoryRepoistory;
  constructor() {
    this.categoryRepository = new CategoryRepoistory();
  }

  createCategory = async (data: CreateCategoryInput) => {
    const existing = await this.categoryRepository.findByName(data.name);
    if (existing) {
      throw new AppError("Category already exists", 409);
    }

    //::Create Category if check passed

    const result = await this.categoryRepository.createCategory(data);
    return result;
  };

  getCategories = async () => {
    const categories = await this.categoryRepository.findAll();

    return categories;
  };

  getCategoryById = async (id: number) => {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    return category;
  };

  updateCategoryById = async (id: number, name: string) => {
    //:: find by id
    const isExist = await this.categoryRepository.findById(id);

    //:: if not exist throw error
    if (!isExist) {
      throw new AppError("Category not found", 404);
    }
    const result = await this.categoryRepository.updateById(id, { name });
    return result;

    //:: update cateogy by id
  };

  deleteById = async (id: number) => {
    //:: find by id
    const isExist = await this.categoryRepository.findById(id);

    //:: if not exist throw error
    if (!isExist) {
      throw new AppError("Category not found", 404);
    }

    //:: has product so throw error
    const hasProducts = await this.categoryRepository.hasProducts(id);
    if (hasProducts) {
      throw new AppError(
        "Category has product associated with it can't delete",
        400,
      );
    }
    const result = await this.categoryRepository.deleteById(id);
    return result;
  };
}
