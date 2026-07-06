import { Order, OrderStatus, Prisma } from "@prisma/client";
import prisma from "../config/db";
type OrderItem = {
  productId: number;
  quantity: number;
  price: number;
}[];

type RecentOrder = {
  id: number;
  amount: number;
  createdAt: Date;
  user: {
    name: string;
  };
};
export default class OrderRepository {
  create = async (
    order: Prisma.OrderCreateInput,
    orderItems: OrderItem,
    userId: number,
  ): Promise<Order> => {
    return prisma.$transaction(async (tx) => {
      //order
      const orderResult = await tx.order.create({ data: order });

      //createin order items
      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          orderId: orderResult.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      //reduce stock
      for (const item of orderItems) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      //clear cart
      await tx.cart.deleteMany({
        where: {
          userId,
        },
      });
      return orderResult;
    });
  };

  //find all order agains a userId

  findManyById = async (userId: number): Promise<Order[]> => {
    return prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  };

  findById = async (id: number, userId?: number): Promise<Order | null> => {
    return prisma.order.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        orderItems: {
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
        },
      },
    });
  };

  updateById = async (id: number, data: any): Promise<Order> => {
    return prisma.order.update({
      where: {
        id,
      },
      data,
    });
  };

  countOrder = async (): Promise<number> => {
    return prisma.order.count({});
  };
  countOrdersByStatus = async () => {
    const result = await prisma.order.groupBy({
      by: ["status"],

      _count: {
        status: true,
      },
    });
    const formatted: Record<OrderStatus, number> = {
      PENDING: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    result.forEach((item) => {
      formatted[item.status] = item._count.status;
    });

    return formatted;
  };

  recentOrders = async (): Promise<RecentOrder[]> => {
    return prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  };
}
