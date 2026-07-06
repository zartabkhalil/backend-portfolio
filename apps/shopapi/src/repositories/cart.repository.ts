import { Cart, Prisma } from "@prisma/client";
import prisma from "../config/db";

type CartWithProduct = Prisma.CartGetPayload<{
  include: {
    product: {
      select: {
        title: true;
        price: true;
        stock: true;
        isActive: true;
        discount: true;
        image: true;
      };
    };
  };
}>;

export default class CartRepository {
  //:::setters
  create = async (data: Prisma.CartCreateInput): Promise<Cart> => {
    return prisma.cart.create({
      data,
      include: {
        product: true,
        user: true,
      },
    });
  };

  //:::update by id
  updateById = async (
    id: number,
    data: Prisma.CartUpdateInput,
  ): Promise<Cart> => {
    return prisma.cart.update({
      where: {
        id,
      },
      data,
      include: {
        product: {
          select: {
            title: true,
            price: true,
            discount: true,
            image: true,
          },
        },
      },
    });
  };

  findAll = async (userId: number): Promise<CartWithProduct[]> => {
    return prisma.cart.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId,
        product: {
          isActive: true,
        },
      },

      include: {
        product: {
          select: {
            title: true,
            price: true,
            stock: true,
            isActive: true,
            discount: true,
            image: true,
          },
        },
      },
    });
  };

  findById = async (id: number): Promise<CartWithProduct | null> => {
    return prisma.cart.findFirst({
      where: {
        id,
      },
      include: {
        product: {
          select: {
            title: true,
            price: true,
            discount: true,
            stock: true,
            isActive: true,
            image: true,
          },
        },
      },
    });
  };

  findByProductId = async (
    id: number,
    userId: number,
  ): Promise<Cart | null> => {
    return prisma.cart.findFirst({
      where: {
        productId: id,
        userId,
      },
      include: {
        product: {
          select: {
            title: true,
            price: true,
            discount: true,
            image: true,
          },
        },
      },
    });
  };

  deleteById = async (id: number): Promise<Cart | null> => {
    return prisma.cart.delete({
      where: {
        id,
      },
    });
  };
}
