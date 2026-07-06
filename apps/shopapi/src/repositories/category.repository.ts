import { Category, Prisma } from "@prisma/client";
import prisma from "../config/db";

export default class CategoryRepoistory {
  //:::setters
  createCategory = async (
    data: Prisma.CategoryCreateInput,
  ): Promise<Category> => {
    return prisma.category.create({
      data,
    });
  };

  //:::update by id
  updateById = async (
    id: number,
    data: Prisma.CategoryCreateInput,
  ): Promise<Category> => {
    return prisma.category.update({
      where: {
        id,
      },
      data,
    });
  };

  //:::gettters
  findByName = async (name: string): Promise<Category | null> => {
    return prisma.category.findUnique({
      where: {
        name,
      },
    });
  };

  findAll = async (): Promise<Category[]> => {
    return prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  findById = async (id: number): Promise<Category | null> => {
    return prisma.category.findUnique({
      where: {
        id,
      },
    });
  };

  deleteById = async (id: number): Promise<Category | null> => {
    return prisma.category.delete({
      where: {
        id,
      },
    });
  };

  hasProducts = async (categoryId: number): Promise<boolean> => {
    const count = await prisma.product.count({
      where: {
        categoryId,
      },
    });

    return count > 0;
  };
}
