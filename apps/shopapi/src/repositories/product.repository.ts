import { OrderItem, OrderStatus, Prisma, Product } from "@prisma/client";
import prisma from "../config/db";
import { PaginatedProducts } from "../types/product.types";

type TopProduct = {
  productId: number;
  totalOrders: number;
  product: {
    id: number;
    title: string;
    price: number;
    image: string | null;
  };
};
export default class ProductRepository {
  //:::setters
  create = async (data: Prisma.ProductCreateInput): Promise<Product> => {
    return prisma.product.create({
      data,
    });
  };

  //:::update by id
  updateById = async (
    id: number,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product> => {
    return prisma.product.update({
      where: {
        id,
      },
      data,
    });
  };

  findAll = async (page: number, limit: number): Promise<PaginatedProducts> => {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },
        where: {
          isActive: true,
        },

        include: {
          category: true,
        },
      }),

      prisma.product.count({
        where: {
          isActive: true,
        },
      }),
    ]);
    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  findById = async (id: number): Promise<Product | null> => {
    return prisma.product.findFirst({
      where: {
        id,
        isActive: true,
      },
      include: { category: true },
    });
  };

  disableById = async (id: number): Promise<Product | null> => {
    return prisma.product.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  };

  //used by Reviews
  hasPurchasedProduct = async (
    userId: number,
    productId: number,
  ): Promise<OrderItem | null> => {
    return await prisma.orderItem.findFirst({
      where: {
        productId,

        order: {
          userId,
          status: OrderStatus.DELIVERED,
        },
      },
    });
  };

  //count product
  totalProducts = async (): Promise<number> => {
    return prisma.product.count({
      where: {
        isActive: true,
      },
    });
  };

  topProducts = async (): Promise<TopProduct[]> => {
    // step 1: group order items
    const grouped = await prisma.orderItem.groupBy({
      by: ["productId"],

      _count: {
        productId: true,
      },

      orderBy: {
        _count: {
          productId: "desc",
        },
      },

      take: 5,
    });

    // step 2: fetch product details
    const result = await Promise.all(
      grouped.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: {
            id: item.productId,
          },

          select: {
            id: true,
            title: true,
            price: true,
            image: true,
          },
        });

        return {
          productId: item.productId,

          totalOrders: item._count.productId,

          product,
        };
      }),
    );

    return result as TopProduct[];
  };
}
