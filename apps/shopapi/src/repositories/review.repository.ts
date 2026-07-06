import { Prisma } from "@prisma/client";
import prisma from "../config/db";

export default class ReviewRepository {
  create = async (data: Prisma.RatingCreateInput) => {
    return prisma.rating.create({
      data,
    });
  };

  findById = async (id: number) => {
    return prisma.rating.findFirst({
      where: {
        id,
      },
      include: { product: true },
    });
  };
  findByProductAndUserId = async (userId: number, productId: number) => {
    return prisma.rating.findFirst({
      where: {
        userId,
        productId,
      },
    });
  };

  findAllByProduct = async (productId: number) => {
    return prisma.rating.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  };

  findAllByUser = async (userId: number, page: number, limit: number) => {};

  updateById = async (id: number, data: Prisma.RatingUpdateInput) => {};

  deleteById = async (id: number) => {
    return prisma.rating.delete({
      where: {
        id,
      },
    });
  };
}
