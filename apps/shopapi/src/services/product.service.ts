import { AppError } from "../lib/appError.lib";
import CategoryRepoistory from "../repositories/category.repository";
import ProductRepository from "../repositories/product.repository";
import { CreateProductInput, UpdateProductInput } from "../types/product.types";

export default class ProductService {
  private repository: ProductRepository;
  private categoryRepository: CategoryRepoistory;
  constructor() {
    this.repository = new ProductRepository();
    this.categoryRepository = new CategoryRepoistory();
  }

  create = async (data: CreateProductInput) => {
    const { categoryId, ...cleanData } = data;

    //:: verify category exists.
    const existing = await this.categoryRepository.findById(categoryId);
    if (!existing) {
      throw new AppError("Category not exists", 409);
    }
    const result = await this.repository.create({
      ...cleanData,
      price: Number(cleanData.price),
      stock: Number(cleanData.stock),
      discount: Number(cleanData.discount),
      category: {
        connect: {
          id: data.categoryId,
        },
      },
    });
    return result;
  };

  getAll = async (page: number, limit: number) => {
    const data = await this.repository.findAll(page, limit);

    return data;
  };

  getById = async (id: number) => {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return product;
  };

  updateById = async (id: number, data: UpdateProductInput) => {
    const { categoryId, ...cleanData } = data;

    //:: find by id
    const isExist = await this.repository.findById(id);

    //:: if not exist throw error
    if (!isExist) {
      throw new AppError("Product not found", 404);
    }

    // :: validate category if provided
    if (categoryId) {
      const existing = await this.categoryRepository.findById(categoryId);
      if (!existing) {
        throw new AppError("Category not exists", 409);
      }
    }

    const result = await this.repository.updateById(id, {
      ...cleanData,
      ...(categoryId && {
        category: {
          connect: {
            id: categoryId,
          },
        },
      }),
    });
    return result;
  };

  deleteById = async (id: number) => {
    //:: find by id
    const isExist = await this.repository.findById(id);

    //:: if not exist throw error
    if (!isExist) {
      throw new AppError("Product not found", 404);
    }

    const result = await this.repository.disableById(id);
    return result;
  };
}
