import { OrderStatus, Prisma, Transaction } from "@prisma/client";
import prisma from "../config/db";

export default class PaymentRepository {
  create = async (
    data: Prisma.TransactionCreateInput,
    orderId: number,
    status: OrderStatus,
  ): Promise<Transaction> => {
    return await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: data,
      });
      await tx.order.update({
        where: { id: orderId },
        data: {
          status,
        },
      });
      return transaction;
    });
  };
  sumCompleted = async (): Promise<number> => {
    const result = await prisma.transaction.aggregate({
      where: {
        status: "COMPLETED",
      },
      _sum: { amount: true },
    });

    return result._sum.amount || 0;
  };
}
